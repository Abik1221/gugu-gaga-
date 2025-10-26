import io
import secrets
import string
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
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
from app.services.billing.subscriptions import verify_payment_and_unblock, reject_payment_submission, ensure_subscription
from app.models.affiliate import CommissionPayout, AffiliateProfile, AffiliateReferral
from app.models.subscription import Subscription, PaymentSubmission
from app.models.pharmacy import Pharmacy
from app.models.branch import Branch
from app.schemas.admin import (
    PharmaciesAdminListResponse,
    AffiliatesAdminListResponse,
    AnalyticsOverviewResponse,
    AnalyticsTotals,
    AnalyticsPharmacyUsage,
    AnalyticsBranchRow,
)
from app.deps.ratelimit import rate_limit_user
from sqlalchemy import func
from sqlalchemy import text as sa_text
from app.services.ai.usage import get_usage_summary
from app.models.audit import AuditLog
from app.core.security import hash_password
import mimetypes
from urllib.parse import quote

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminUserOut(BaseModel):
    id: int
    email: EmailStr
    username: str | None = None
    role: str
    is_active: bool
    is_approved: bool
    is_verified: bool


class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str | None = None
    role: str | None = Role.admin.value


class AdminUserDetailOut(AdminUserOut):
    roles: list[dict[str, str]]


class AdminAssignRole(BaseModel):
    role: str


class PaymentActionPayload(BaseModel):
    code: str | None = None


class PharmacyApprovalPayload(BaseModel):
    issue_temp_password: bool = False
    temp_password: Optional[str] = None


def _role_to_label(role_value: str) -> str:
    return role_value.replace("_", " ").title()


def _user_roles_payload(user: User) -> list[dict[str, str]]:
    if not user.role:
        return []
    return [
        {
            "id": user.role,
            "name": _role_to_label(user.role),
        }
    ]


def _generate_temp_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _user_to_admin_out(user: User) -> AdminUserOut:
    username = getattr(user, "username", None)
    if not username:
        username = (user.email.split("@", 1)[0] if user.email else None)
    return AdminUserOut(
        id=user.id,
        email=user.email,
        username=username,
        role=user.role,
        is_active=user.is_active,
        is_approved=user.is_approved,
        is_verified=user.is_verified,
    )


def _user_to_admin_detail_out(user: User) -> AdminUserDetailOut:
    base = _user_to_admin_out(user)
    return AdminUserDetailOut(**base.model_dump(), roles=_user_roles_payload(user))


@router.post("/pharmacies/{application_id}/approve")
def approve_pharmacy(
    application_id: int,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("admin_approve_user")),
    _ten=Depends(enforce_user_tenant),
    payload: PharmacyApprovalPayload | None = None,
):
    app = db.query(KYCApplication).filter(KYCApplication.id == application_id, KYCApplication.tenant_id == tenant_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="KYC application not found")
    app.status = "approved"
    from datetime import datetime

    app.decided_at = datetime.utcnow()
    owner = db.query(User).filter(User.id == app.applicant_user_id).first()
    temp_password: Optional[str] = None
    if owner:
        owner.is_approved = True
        issue_temp = payload.issue_temp_password if payload else False
        supplied = payload.temp_password if payload else None
        if issue_temp:
            temp_password = supplied or _generate_temp_password()
            if len(temp_password) < 6:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Temporary password must be at least 6 characters long")
            owner.password_hash = hash_password(temp_password)
        # Per-tenant approval in UserTenant
        link = (
            db.query(UserTenant)
            .filter(UserTenant.user_id == owner.id, UserTenant.tenant_id == tenant_id)
            .first()
        )
        if link:
            link.is_approved = True
            db.add(link)
    # Ensure a subscription record exists and remains blocked until payment is verified
    sub = ensure_subscription(db, tenant_id=tenant_id)
    if not sub.blocked:
        sub.blocked = True
        db.add(sub)
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
        payment_instructions = (
            "Your pharmacy application has been approved. Please submit your subscription payment via the usual offline "
            "channels and provide the payment code to the admin desk. Access will be activated once the payment is verified."
        )
        create_notification(
            db,
            tenant_id=tenant_id,
            user_id=owner.id,
            type="kyc_approved",
            title="Pharmacy Approved",
            body=payment_instructions,
        )
        if owner.email:
            send_email(
                owner.email,
                "Pharmacy approved – next step: payment",
                (
                    "Hello,\n\n"
                    "Great news—your pharmacy application has been approved. To activate your access, please complete the "
                    "subscription payment using the agreed offline method and share the payment code with the admin team.\n\n"
                    "Once the payment is confirmed, you will receive immediate access to your dashboards.\n\n"
                    "Thank you!"
                    f"\n\nTemporary password: {temp_password}" if temp_password else ""
                ),
            )
    response = {"tenant_id": tenant_id, "application_id": application_id, "status": "approved"}
    if temp_password:
        response["temporary_password"] = temp_password
    return response


@router.get("/pharmacies/{application_id}/license")
def download_pharmacy_license(
    application_id: int,
    current_user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    kyc = db.query(KYCApplication).filter(KYCApplication.id == application_id).first()
    if not kyc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="KYC application not found")
    if not kyc.license_document_data and not kyc.documents_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No license document stored for this application")

    filename = kyc.license_document_name or f"license-{application_id}.bin"
    media_type = kyc.license_document_mime or "application/octet-stream"
    data: bytes

    if kyc.license_document_data:
        data = kyc.license_document_data
    else:
        base_dir = Path(__file__).resolve().parents[3]
        file_path = base_dir / kyc.documents_path
        if not file_path.exists() or not file_path.is_file():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stored license file is missing")
        data = file_path.read_bytes()
        if not kyc.license_document_name:
            filename = file_path.name
        if not kyc.license_document_mime:
            guess = mimetypes.guess_type(str(file_path))[0]
            if guess:
                media_type = guess

    safe_filename = filename.replace('"', "'")
    try:
        encoded_filename = quote(filename.encode("utf-8"))
    except Exception:
        encoded_filename = filename

    log_event(
        db,
        tenant_id=kyc.tenant_id,
        actor_user_id=current_user.id,
        action="kyc_license_downloaded",
        target_type="kyc_application",
        target_id=str(application_id),
        metadata={"filename": filename},
    )

    headers = {
        "Content-Disposition": f"attachment; filename=\"{safe_filename}\"; filename*=UTF-8''{encoded_filename}",
    }
    return StreamingResponse(io.BytesIO(data), media_type=media_type, headers=headers)


@router.get("/users", response_model=List[AdminUserOut])
def list_users(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_list_users")),
):
    users = db.query(User).order_by(User.id.desc()).limit(200).all()
    return [_user_to_admin_out(u) for u in users]


@router.get("/users/{user_id}", response_model=AdminUserDetailOut)
def get_user_admin(
    user_id: int,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_get_user")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _user_to_admin_detail_out(user)


@router.post("/users", response_model=AdminUserOut, status_code=status.HTTP_201_CREATED)
def create_user_admin(
    payload: AdminUserCreate,
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_create_user")),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    try:
        password_hash = hash_password(payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    user = User(
        email=payload.email,
        password_hash=password_hash,
        role=payload.role or Role.admin.value,
        is_active=True,
        is_approved=True,
        is_verified=True,
    )
    if payload.username:
        setattr(user, "username", payload.username)
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_to_admin_out(user)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_admin(
    user_id: int,
    current_user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_delete_user")),
):
    if current_user.id == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete yourself")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    return None


@router.post("/users/{user_id}/assign-role", response_model=AdminUserDetailOut)
def assign_role_admin(
    user_id: int,
    payload: AdminAssignRole,
    current_user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_assign_role")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    role_value = payload.role.lower()
    if role_value not in {r.value for r in Role}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    user.role = role_value
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_to_admin_detail_out(user)


@router.post("/users/{user_id}/remove-role", response_model=AdminUserDetailOut)
def remove_role_admin(
    user_id: int,
    current_user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("admin_remove_role")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = Role.customer.value
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_to_admin_detail_out(user)


@router.get("/roles")
def list_roles_admin(
    _=Depends(require_role(Role.admin)),
):
    return [
        {
            "id": role.value,
            "name": _role_to_label(role.value),
        }
        for role in Role
    ]


@router.post("/payments/verify")
def verify_payment(
    payload: PaymentActionPayload,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("admin_payverify_user")),
    _ten=Depends(enforce_user_tenant),
):
    result = verify_payment_and_unblock(db, tenant_id=tenant_id, code=payload.code, admin_user_id=current_user.id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment submission not found or already processed")
    ps, sub = result

    log_event(
        db,
        tenant_id=tenant_id,
        actor_user_id=current_user.id,
        action="payment_verified",
        target_type="payment",
        target_id=ps.code,
        metadata={"status": "verified"},
    )
    # Notify tenant and owner
    owner = db.query(User).filter(User.tenant_id == tenant_id, User.role == Role.pharmacy_owner.value).first()
    message_body = "Payment verified. Subscription unblocked. You now have access to the dashboards."
    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=owner.id if owner else None,
        type="payment_verified",
        title="Payment Verified",
        body=message_body,
    )
    if owner and owner.email:
        send_email(
            owner.email,
            "Payment confirmed – access granted",
            (
                "Hello,\n\n"
                "We have verified your subscription payment and your access has been restored immediately. You can now log in "
                "to the pharmacy dashboards.\n\n"
                "Thank you for the prompt payment!"
            ),
        )
    return {"tenant_id": tenant_id, "payment_code": ps.code, "status": "verified", "next_due_date": sub.next_due_date.isoformat() if sub.next_due_date else None}


@router.post("/payments/reject")
def reject_payment(
    payload: PaymentActionPayload,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _rl=Depends(rate_limit_user("admin_payreject_user")),
    _ten=Depends(enforce_user_tenant),
):
    ps = reject_payment_submission(db, tenant_id=tenant_id, code=payload.code, admin_user_id=current_user.id)
    if not ps:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment submission not found or already processed")
    log_event(
        db,
        tenant_id=tenant_id,
        actor_user_id=current_user.id,
        action="payment_rejected",
        target_type="payment",
        target_id=ps.code,
        metadata={"status": "rejected"},
    )
    owner = db.query(User).filter(User.tenant_id == tenant_id, User.role == Role.pharmacy_owner.value).first()
    rejection_body = "Payment could not be verified. Please resubmit the correct payment code."
    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=owner.id if owner else None,
        type="payment_rejected",
        title="Payment Rejected",
        body=rejection_body,
    )
    if owner and owner.email:
        send_email(
            owner.email,
            "Payment could not be verified",
            (
                "Hello,\n\n"
                "We attempted to verify your recent payment submission but could not confirm it. Please double-check the payment "
                "details and resubmit the correct payment code so we can activate your access.\n\n"
                "If you need help, contact the admin team."
            ),
        )
    pending = (
        db.query(PaymentSubmission)
        .filter(PaymentSubmission.tenant_id == tenant_id, PaymentSubmission.status == "pending")
        .count()
    )
    return {
        "tenant_id": tenant_id,
        "payment_code": ps.code,
        "status": "rejected",
        "pending_payments": pending,
    }


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
            "metadata": r.meta,
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


@router.get("/analytics/overview", response_model=AnalyticsOverviewResponse)
def analytics_overview(
    _=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
    days: int = 30,
):
    days = max(1, min(90, days))

    total_pharmacies = db.query(func.count(Pharmacy.id)).scalar() or 0
    active_pharmacies = (
        db.query(func.count(Subscription.id))
        .filter(Subscription.blocked == False)
        .scalar()
        or 0
    )
    pending_kyc = db.query(func.count(KYCApplication.id)).filter(KYCApplication.status == "pending").scalar() or 0
    blocked_pharmacies = (
        db.query(func.count(Subscription.id))
        .filter(Subscription.blocked == True)
        .scalar()
        or 0
    )
    total_branches = db.query(func.count(Branch.id)).scalar() or 0
    pharmacy_owners = db.query(func.count(User.id)).filter(User.role == Role.pharmacy_owner.value).scalar() or 0

    totals = AnalyticsTotals(
        total_pharmacies=total_pharmacies,
        active_pharmacies=active_pharmacies,
        pending_kyc=pending_kyc,
        blocked_pharmacies=blocked_pharmacies,
        total_branches=total_branches,
        pharmacy_owners=pharmacy_owners,
    )

    db.execute(
        sa_text(
            """
            CREATE TABLE IF NOT EXISTS ai_usage (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              tenant_id VARCHAR(64),
              user_id INTEGER,
              thread_id INTEGER,
              model VARCHAR(64),
              prompt_tokens INTEGER NOT NULL,
              completion_tokens INTEGER NOT NULL,
              total_tokens INTEGER NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
    )

    usage_daily = []
    try:
        usage_daily = get_usage_summary(db, tenant_id=None, days=days)
    except Exception:
        usage_daily = []

    usage_rows = db.execute(
        sa_text(
            """
            SELECT tenant_id, SUM(total_tokens) AS tokens
            FROM ai_usage
            WHERE created_at >= :cutoff
            GROUP BY tenant_id
            ORDER BY tokens DESC
            LIMIT 10
            """
        ),
        {"cutoff": datetime.utcnow() - timedelta(days=days)},
    ).fetchall()

    tenant_branch_rows = (
        db.query(Pharmacy.tenant_id, Pharmacy.name, func.count(Branch.id))
        .outerjoin(Branch, Pharmacy.tenant_id == Branch.tenant_id)
        .group_by(Pharmacy.tenant_id, Pharmacy.name)
        .all()
    )
    tenant_branch_map = {row[0]: (row[1], int(row[2] or 0)) for row in tenant_branch_rows}

    top_pharmacies: list[AnalyticsPharmacyUsage] = []
    for tenant_id, tokens in usage_rows:
        name, branch_count = tenant_branch_map.get(tenant_id, (None, 0))
        status_row = (
            db.query(KYCApplication.status)
            .filter(KYCApplication.tenant_id == tenant_id)
            .order_by(KYCApplication.id.desc())
            .first()
        )
        status = status_row[0] if status_row else None
        top_pharmacies.append(
            AnalyticsPharmacyUsage(
                tenant_id=tenant_id or "",
                name=name,
                branch_count=branch_count,
                ai_tokens_30d=int(tokens or 0),
                status=status,
            )
        )

    branch_distribution: list[AnalyticsBranchRow] = []
    for tenant_id, (name, branch_count) in tenant_branch_map.items():
        branch_distribution.append(
            AnalyticsBranchRow(tenant_id=tenant_id, name=name, branch_count=branch_count)
        )
    branch_distribution.sort(key=lambda row: row.branch_count, reverse=True)

    return AnalyticsOverviewResponse(
        totals=totals,
        ai_usage_daily=usage_daily,
        top_pharmacies=top_pharmacies,
        branch_distribution=branch_distribution,
    )


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
        latest_payment = (
            db.query(PaymentSubmission)
            .filter(PaymentSubmission.tenant_id == ph.tenant_id)
            .order_by(PaymentSubmission.id.desc())
            .first()
        )
        pending_payment = (
            db.query(PaymentSubmission)
            .filter(PaymentSubmission.tenant_id == ph.tenant_id, PaymentSubmission.status == "pending")
            .order_by(PaymentSubmission.id.desc())
            .first()
        )
        kyc_status = kyc.status if kyc else None
        subscription_status = "kyc_pending"
        if kyc_status == "approved":
            if sub:
                if sub.blocked:
                    if pending_payment:
                        subscription_status = "pending_verification"
                    elif latest_payment and latest_payment.status == "rejected":
                        subscription_status = "payment_rejected"
                    else:
                        subscription_status = "awaiting_payment"
                else:
                    subscription_status = "active"
            else:
                subscription_status = "awaiting_payment"
        elif kyc_status == "rejected":
            subscription_status = "kyc_rejected"

        status_map = {
            "kyc_pending": ("Pending KYC", 10),
            "awaiting_payment": ("Awaiting Payment", 20),
            "pending_verification": ("Awaiting Verification", 30),
            "active": ("Active", 40),
            "payment_rejected": ("Payment Rejected", 50),
            "kyc_rejected": ("KYC Rejected", 50),
        }
        status_category = subscription_status
        if subscription_status in {"payment_rejected", "kyc_rejected"}:
            status_category = "blocked"
        elif subscription_status == "kyc_pending":
            status_category = "pending_kyc"
        status_label, status_priority = status_map.get(subscription_status, (subscription_status.replace("_", " ").title() if subscription_status else "Unknown", 60))
        if status_category == "blocked":
            status_label = "Blocked / Rejected"
            status_priority = 50
        elif status_category == "pending_kyc":
            status_label = "Pending KYC"
            status_priority = 10

        pending_payload = None
        if pending_payment:
            pending_payload = {
                "code": pending_payment.code,
                "status": pending_payment.status,
                "submitted_at": pending_payment.created_at.isoformat() if pending_payment.created_at else None,
                "submitted_by_user_id": pending_payment.submitted_by_user_id,
            }

        latest_payload = None
        if latest_payment:
            latest_payload = {
                "code": latest_payment.code,
                "status": latest_payment.status,
                "submitted_at": latest_payment.created_at.isoformat() if latest_payment.created_at else None,
                "verified_at": latest_payment.verified_at.isoformat() if latest_payment.verified_at else None,
            }

        kyc_payload = None
        if kyc:
            license_available = bool(kyc.license_document_data) or bool(kyc.documents_path)
            kyc_payload = {
                "application_id": kyc.id,
                "status": kyc.status,
                "applicant_user_id": kyc.applicant_user_id,
                "id_number": kyc.id_number,
                "pharmacy_license_number": kyc.pharmacy_license_number,
                "license_document_name": kyc.license_document_name,
                "license_document_mime": kyc.license_document_mime,
                "license_document_available": license_available,
                "notes": kyc.notes,
                "submitted_at": kyc.created_at.isoformat() if kyc.created_at else None,
                "pharmacy_name": kyc.pharmacy_name,
                "pharmacy_address": kyc.pharmacy_address,
                "owner_email": kyc.owner_email,
                "owner_phone": kyc.owner_phone,
            }

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
                "kyc_status": kyc_status,
                "subscription": {
                    "blocked": bool(sub.blocked) if sub else None,
                    "next_due_date": sub.next_due_date.isoformat() if sub and sub.next_due_date else None,
                    "status": subscription_status,
                },
                "created_at": ph.created_at.isoformat() if ph.created_at else None,
                "latest_payment_code": latest_payment.code if latest_payment else None,
                "latest_payment_status": latest_payment.status if latest_payment else None,
                "latest_payment_submitted_at": latest_payment.created_at.isoformat() if latest_payment and latest_payment.created_at else None,
                "latest_payment_verified_at": latest_payment.verified_at.isoformat() if latest_payment and latest_payment.verified_at else None,
                "pending_payment_code": pending_payment.code if pending_payment else None,
                "pending_payment_submitted_at": pending_payment.created_at.isoformat() if pending_payment and pending_payment.created_at else None,
                "status_category": status_category,
                "status_label": status_label,
                "status_priority": status_priority,
                "pending_payment": pending_payload,
                "latest_payment": latest_payload,
                "kyc": kyc_payload,
                "owner_password_hash": owner.password_hash if owner else None,
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
