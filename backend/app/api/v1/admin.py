from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.core.roles import Role
from app.db.deps import get_db
from app.services.audit import log_event
from app.models.kyc import KYCApplication
from app.models.user import User
from app.models.user_tenant import UserTenant
from app.services.notifications.in_app import create_notification
from app.services.notifications.email import send_email
from app.deps.ratelimit import rate_limit_user
from app.services.billing.subscriptions import verify_payment_and_unblock
from app.models.affiliate import CommissionPayout, AffiliateProfile, AffiliateReferral
from app.models.subscription import Subscription
from app.models.pharmacy import Pharmacy
from app.schemas.admin import PharmaciesAdminListResponse, AffiliatesAdminListResponse
from app.deps.ratelimit import rate_limit_user
from sqlalchemy import func
from sqlalchemy import text as sa_text
from app.services.ai.usage import get_usage_summary
from app.models.audit import AuditLog

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/pharmacies/{application_id}/approve")
def approve_pharmacy(
    application_id: int,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("admin_approve_user")),
    _ten=Depends(enforce_user_tenant),
):
    app = db.query(KYCApplication).filter(KYCApplication.id == application_id, KYCApplication.tenant_id == tenant_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="KYC application not found")
    app.status = "approved"
    from datetime import datetime

    app.decided_at = datetime.utcnow()
    owner = db.query(User).filter(User.id == app.applicant_user_id).first()
    if owner:
        owner.is_approved = True
        # Per-tenant approval in UserTenant
        link = (
            db.query(UserTenant)
            .filter(UserTenant.user_id == owner.id, UserTenant.tenant_id == tenant_id)
            .first()
        )
        if link:
            link.is_approved = True
            db.add(link)
    db.add(app)
    db.commit()
    log_event(
        db,
        tenant_id=tenant_id,
        actor_user_id=current_user.id,
        action="pharmacy_approved",
        target_type="pharmacy_application",
        target_id=str(application_id),
        metadata={"status": "approved"},
    )
    # Notify owner
    if owner:
        create_notification(
            db,
            tenant_id=tenant_id,
            user_id=owner.id,
            type="kyc_approved",
            title="Pharmacy Approved",
            body="Your pharmacy application has been approved.",
        )
        if owner.email:
            send_email(owner.email, "Pharmacy Approved", "Your pharmacy application has been approved.")
    return {"tenant_id": tenant_id, "application_id": application_id, "status": "approved"}


@router.post("/payments/{payment_code}/verify")
def verify_payment(
    payment_code: str,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("admin_payverify_user")),
    _ten=Depends(enforce_user_tenant),
):
    if not payment_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment code")
    ok = verify_payment_and_unblock(db, tenant_id=tenant_id, code=payment_code)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment submission not found or already processed")
    log_event(
        db,
        tenant_id=tenant_id,
        actor_user_id=current_user.id,
        action="payment_verified",
        target_type="payment",
        target_id=payment_code,
        metadata={"status": "verified"},
    )
    # Notify tenant (broadcast)
    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=None,
        type="payment_verified",
        title="Payment Verified",
        body=f"Payment code {payment_code} has been verified.",
    )
    return {"tenant_id": tenant_id, "payment_code": payment_code, "status": "verified"}


@router.post("/pharmacies/{application_id}/reject")
def reject_pharmacy(
    application_id: int,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("admin_reject_user")),
    _ten=Depends(enforce_user_tenant),
):
    app = db.query(KYCApplication).filter(KYCApplication.id == application_id, KYCApplication.tenant_id == tenant_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="KYC application not found")
    app.status = "rejected"
    from datetime import datetime

    app.decided_at = datetime.utcnow()
    # Per-tenant rejection toggles link approval off if exists
    link = (
        db.query(UserTenant)
        .filter(UserTenant.user_id == app.applicant_user_id, UserTenant.tenant_id == tenant_id)
        .first()
    )
    if link:
        link.is_approved = False
        db.add(link)
    db.add(app)
    db.commit()
    log_event(
        db,
        tenant_id=tenant_id,
        actor_user_id=current_user.id,
        action="pharmacy_rejected",
        target_type="pharmacy_application",
        target_id=str(application_id),
        metadata={"status": "rejected"},
    )
    # Notify applicant
    owner = db.query(User).filter(User.id == app.applicant_user_id).first()
    if owner:
        create_notification(
            db,
            tenant_id=tenant_id,
            user_id=owner.id,
            type="kyc_rejected",
            title="Pharmacy Rejected",
            body="Your pharmacy application has been rejected.",
        )
        if owner.email:
            send_email(owner.email, "Pharmacy Rejected", "Your pharmacy application has been rejected.")
    return {"tenant_id": tenant_id, "application_id": application_id, "status": "rejected"}


# Affiliate payouts (no tenant context)
@router.get("/affiliate/payouts")
def list_affiliate_payouts(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    status_filter: str | None = None,
):
    q = db.query(CommissionPayout)
    if status_filter:
        q = q.filter(CommissionPayout.status == status_filter)
    rows = q.order_by(CommissionPayout.id.desc()).all()
    return [
        {
            "id": r.id,
            "affiliate_user_id": r.affiliate_user_id,
            "tenant_id": r.tenant_id,
            "month": r.month,
            "percent": r.percent,
            "amount": r.amount,
            "status": r.status,
        }
        for r in rows
    ]


@router.get("/usage")
def usage_summary_admin(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    days: int = 30,
):
    days = max(1, min(365, days))
    # tenant_id None => aggregate across tenants
    return get_usage_summary(db, tenant_id=None, days=days)


@router.get("/audit")
def list_audit_events(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    tenant_id: str | None = None,
    action: str | None = None,
    limit: int = 50,
):
    limit = max(1, min(200, limit))
    q = db.query(AuditLog)
    if tenant_id:
        q = q.filter(AuditLog.tenant_id == tenant_id)
    if action:
        q = q.filter(AuditLog.action == action)
    rows = q.order_by(AuditLog.id.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "tenant_id": r.tenant_id,
            "actor_user_id": r.actor_user_id,
            "action": r.action,
            "target_type": r.target_type,
            "target_id": r.target_id,
            "metadata": r.metadata,
            "created_at": getattr(r, "created_at", None).isoformat() if getattr(r, "created_at", None) else None,
        }
        for r in rows
    ]


@router.post("/affiliate/payouts/{payout_id}/mark-paid")
def mark_affiliate_payout_paid(
    payout_id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    payout = db.query(CommissionPayout).filter(CommissionPayout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payout not found")
    payout.status = "paid"
    db.add(payout)
    db.commit()
    # Notify affiliate via email if possible
    user = db.query(User).filter(User.id == payout.affiliate_user_id).first()
    if user and user.email:
        send_email(user.email, "Payout processed", f"Your affiliate payout for {payout.month} has been marked as paid.")
    return {"id": payout.id, "status": payout.status}


@router.post("/affiliate/payouts/{payout_id}/approve")
def approve_affiliate_payout(
    payout_id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    payout = db.query(CommissionPayout).filter(CommissionPayout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payout not found")
    if payout.status == "paid":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payout already paid")
    payout.status = "approved"
    db.add(payout)
    db.commit()
    return {"id": payout.id, "status": payout.status}


@router.get("/pharmacies", response_model=PharmaciesAdminListResponse)
def list_pharmacies_admin(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
    _rl=Depends(rate_limit_user("admin_list_pharmacies")),
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    query = db.query(Pharmacy)
    if q:
        like = f"%{q}%"
        query = query.filter(Pharmacy.name.ilike(like))
    total = query.count()
    rows = query.order_by(Pharmacy.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    result = []
    for ph in rows:
        owner = db.query(User).filter(User.tenant_id == ph.tenant_id, User.role == Role.pharmacy_owner.value).first()
        kyc = db.query(KYCApplication).filter(KYCApplication.tenant_id == ph.tenant_id).order_by(KYCApplication.id.desc()).first()
        sub = db.query(Subscription).filter(Subscription.tenant_id == ph.tenant_id).first()
        result.append(
            {
                "id": ph.id,
                "tenant_id": ph.tenant_id,
                "name": ph.name,
                "address": getattr(ph, "address", None),
                "owner_email": owner.email if owner else None,
                "owner_phone": owner.phone if owner else None,
                "owner_approved": owner.is_approved if owner else None,
                "kyc_id": kyc.id if kyc else None,
                "kyc_status": kyc.status if kyc else None,
                "subscription": {
                    "blocked": bool(sub.blocked) if sub else None,
                    "next_due_date": sub.next_due_date.isoformat() if sub and sub.next_due_date else None,
                },
                "created_at": ph.created_at.isoformat() if ph.created_at else None,
            }
        )
    return {"page": page, "page_size": page_size, "total": total, "items": result}


@router.get("/affiliates", response_model=AffiliatesAdminListResponse)
def list_affiliates_admin(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
    _rl=Depends(rate_limit_user("admin_list_affiliates")),
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    query = db.query(User).filter(User.role == Role.affiliate.value)
    if q:
        like = f"%{q}%"
        query = query.filter(User.email.ilike(like))
    total = query.count()
    users = query.order_by(User.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    items = []
    for u in users:
        prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == u.id).first()
        refs = db.query(AffiliateReferral).filter(AffiliateReferral.affiliate_user_id == u.id).count()
        pending_total = (
            db.query(func.coalesce(func.sum(CommissionPayout.amount), 0.0))
            .filter(CommissionPayout.affiliate_user_id == u.id, CommissionPayout.status == "pending")
            .scalar()
            or 0.0
        )
        paid_total = (
            db.query(func.coalesce(func.sum(CommissionPayout.amount), 0.0))
            .filter(CommissionPayout.affiliate_user_id == u.id, CommissionPayout.status == "paid")
            .scalar()
            or 0.0
        )
        items.append(
            {
                "user_id": u.id,
                "email": u.email,
                "full_name": prof.full_name if prof else None,
                "bank_name": prof.bank_name if prof else None,
                "bank_account_name": prof.bank_account_name if prof else None,
                "bank_account_number": prof.bank_account_number if prof else None,
                "referrals": refs,
                "payouts": {"pending_total": float(pending_total), "paid_total": float(paid_total)},
            }
        )
    return {"page": page, "page_size": page_size, "total": total, "items": items}


@router.post("/affiliate/payouts/{payout_id}/approve")
def approve_affiliate_payout(
    payout_id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    payout = db.query(CommissionPayout).filter(CommissionPayout.id == payout_id).first()
    if not payout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payout not found")
    if payout.status == "paid":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payout already paid")
    payout.status = "approved"
    db.add(payout)
    db.commit()
    return {"id": payout.id, "status": payout.status}


@router.post("/affiliates/{user_id}/approve")
def approve_affiliate(
    user_id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.role == Role.affiliate.value).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate not found")
    user.is_active = True
    user.is_approved = True
    db.add(user)
    db.commit()
    if user.email:
        try:
            send_email(user.email, "Affiliate Approved", "Your affiliate account has been approved.")
        except Exception:
            pass
    return {"user_id": user_id, "status": "approved"}


@router.post("/affiliates/{user_id}/reject")
def reject_affiliate(
    user_id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.role == Role.affiliate.value).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate not found")
    user.is_active = False
    user.is_approved = False
    db.add(user)
    db.commit()
    if user.email:
        try:
            send_email(user.email, "Affiliate Rejected", "Your affiliate account has been rejected or suspended.")
        except Exception:
            pass
    return {"user_id": user_id, "status": "rejected"}
