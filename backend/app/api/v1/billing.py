from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.deps.ratelimit import rate_limit_user
from app.services.billing.subscriptions import submit_payment_code

router = APIRouter(prefix="/billing", tags=["admin"])


@router.post("/payment-code")
def submit_payment(
    code: str,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _rl=Depends(rate_limit_user("billing_submit_user")),
):
    if not code or len(code) < 4:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid code")
    ps = submit_payment_code(db, tenant_id=tenant_id, code=code, submitted_by_user_id=current_user.id)
    return {"id": ps.id, "status": ps.status}
