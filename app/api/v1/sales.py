from fastapi import APIRouter, Depends

from app.deps.auth import require_role
from app.deps.tenant import require_tenant
from app.core.roles import Role

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/transactions")
def list_transactions(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
):
    return {"tenant_id": tenant_id, "transactions": []}
