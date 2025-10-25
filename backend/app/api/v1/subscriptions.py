from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.models.subscription import PaymentSubmission
from app.services.billing.subscriptions import ensure_subscription

router = APIRouter(prefix="/subscriptions", tags=["billing"])


@router.get("/current")
def get_current_subscription(
    tenant_id: str = Depends(require_tenant),
    _=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    _ten=Depends(enforce_user_tenant),
    db: Session = Depends(get_db),
):
    """Return the current subscription status for the tenant, creating a row if needed."""
    sub = ensure_subscription(db, tenant_id=tenant_id)
    latest_payment = (
        db.query(PaymentSubmission)
        .filter(PaymentSubmission.tenant_id == tenant_id)
        .order_by(PaymentSubmission.id.desc())
        .first()
    )
    return {
        "tenant_id": tenant_id,
        "blocked": sub.blocked,
        "next_due_date": sub.next_due_date.isoformat() if sub.next_due_date else None,
        "notices_sent": sub.notices_sent,
        "last_notice_date": sub.last_notice_date.isoformat() if sub.last_notice_date else None,
        "latest_payment": {
            "code": latest_payment.code if latest_payment else None,
            "status": latest_payment.status if latest_payment else None,
            "submitted_at": latest_payment.created_at.isoformat() if latest_payment and latest_payment.created_at else None,
            "verified_at": latest_payment.verified_at.isoformat() if latest_payment and latest_payment.verified_at else None,
        },
    }
