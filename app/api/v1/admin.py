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
