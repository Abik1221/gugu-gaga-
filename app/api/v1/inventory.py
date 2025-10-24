from fastapi import APIRouter, Depends

from app.deps.auth import require_role
from app.deps.tenant import require_tenant
from app.core.roles import Role

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/stock")
def stock_overview(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
):
    return {"tenant_id": tenant_id, "low_stock": [], "expiring": []}
