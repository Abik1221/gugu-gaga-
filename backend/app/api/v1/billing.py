from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.deps.ratelimit import rate_limit_user
from app.services.billing.subscriptions import submit_payment_code
from pydantic import BaseModel

router = APIRouter(prefix="/billing", tags=["admin"])


class PaymentCodePayload(BaseModel):
    code: str


@router.post("/payment-code")
def submit_payment(
    payload: PaymentCodePayload,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _rl=Depends(rate_limit_user("billing_submit_user")),
):
    code = payload.code.strip()
    if not code or len(code) < 4:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid code")
    ps = submit_payment_code(db, tenant_id=tenant_id, code=code, submitted_by_user_id=current_user.id)
    return {"id": ps.id, "status": ps.status, "code": ps.code}
