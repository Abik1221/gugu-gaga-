from typing import Optional

from fastapi import Depends, HTTPException, status

from app.middleware.tenant import get_current_tenant_id
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.deps.auth import get_current_user
from app.core.roles import Role
from app.models.user_tenant import UserTenant
from app.models.user import User
from app.models.subscription import Subscription


def get_tenant_id(optional: bool = False) -> Optional[str]:
    tenant_id = get_current_tenant_id()
    if tenant_id:
        return tenant_id
    if optional:
        return None
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing tenant identifier")


def require_tenant(tenant_id: Optional[str] = Depends(get_tenant_id)) -> str:
    # This dependency ensures tenant is present
    if tenant_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing tenant identifier")
    return tenant_id


def get_optional_tenant_id() -> Optional[str]:
    return get_tenant_id(optional=True)


def enforce_user_tenant(
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == Role.admin.value:
        return True
    # Direct user.tenant_id match grants access
    if current_user.tenant_id == tenant_id:
        return True
    # Check link in UserTenant for multi-tenant access
    link = (
        db.query(UserTenant)
        .filter(UserTenant.user_id == current_user.id, UserTenant.tenant_id == tenant_id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant access denied")
    return True


def enforce_subscription_active(
    tenant_id: str = Depends(require_tenant),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user and current_user.role == Role.admin.value:
        return True
    sub = db.query(Subscription).filter(Subscription.tenant_id == tenant_id).first()
    if sub and sub.blocked:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription blocked: payment required")
    return True
