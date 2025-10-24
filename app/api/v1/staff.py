from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.core.security import hash_password
from app.db.deps import get_db
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.deps.auth import require_role
from app.models.user import User
from app.schemas.staff import StaffCreate
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/staff", tags=["pharmacy_cms"])


@router.post("")
def create_staff(
    payload: StaffCreate,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("staff_create_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    if payload.role not in {Role.cashier.value, "staff"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    staff = User(
        email=payload.email,
        phone=payload.phone,
        role=payload.role if payload.role in {Role.cashier.value} else Role.cashier.value,
        tenant_id=tenant_id,
        password_hash=hash_password(payload.password),
        is_active=True,
        is_approved=True,
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return {"id": staff.id, "email": staff.email, "role": staff.role}
