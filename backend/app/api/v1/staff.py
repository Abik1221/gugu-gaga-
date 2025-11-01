from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.core.security import hash_password
from app.db.deps import get_db
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.deps.auth import require_role
from app.models.user import User
from app.models.branch import Branch
from app.schemas.staff import StaffCreate, StaffOut
from app.deps.ratelimit import rate_limit_user
from app.services.billing.subscriptions import ensure_subscription

router = APIRouter(prefix="/staff", tags=["pharmacy_cms"])


def _serialize_staff(user: User, branch: Branch | None = None) -> StaffOut:
    assigned_branch = branch or getattr(user, "assigned_branch", None)
    return StaffOut(
        id=user.id,
        email=user.email,
        role=user.role,
        phone=user.phone,
        assigned_branch_id=user.assigned_branch_id,
        assigned_branch_name=getattr(assigned_branch, "name", None) if assigned_branch else None,
        is_active=user.is_active,
    )


@router.post("", response_model=StaffOut)
def create_staff(
    payload: StaffCreate,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("staff_create_user")),
    _ten=Depends(enforce_user_tenant),
):
    # Only the owner of this tenant or admin can create cashier
    if user.role != Role.admin.value and user.tenant_id != tenant_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    # Require owner approval and active subscription
    if user.role != Role.admin.value:
        owner = db.query(User).filter(User.tenant_id == tenant_id, User.role == Role.pharmacy_owner.value).first()
        if not owner or not owner.is_approved:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Owner not approved yet")
        sub = ensure_subscription(db, tenant_id=tenant_id)
        if sub.blocked:
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription blocked. Submit payment code and await verification.")
    if payload.role not in {Role.cashier.value, "staff"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    assigned_branch: Branch | None = None
    if payload.assigned_branch_id is not None:
        assigned_branch = (
            db.query(Branch)
            .filter(Branch.id == payload.assigned_branch_id, Branch.tenant_id == tenant_id)
            .first()
        )
        if not assigned_branch:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found for tenant")
    staff = User(
        email=payload.email,
        phone=payload.phone,
        role=payload.role if payload.role in {Role.cashier.value, "staff"} else Role.cashier.value,
        tenant_id=tenant_id,
        password_hash=hash_password(payload.password),
        is_active=True,
        is_approved=True,
        assigned_branch_id=payload.assigned_branch_id,
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return _serialize_staff(staff, branch=assigned_branch)


@router.get("", response_model=list[StaffOut])
def list_staff(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
):
    rows = (
        db.query(User, Branch)
        .outerjoin(Branch, Branch.id == User.assigned_branch_id)
        .filter(User.tenant_id == tenant_id, User.role.in_([Role.cashier.value, "staff"]))
        .order_by(User.id.desc())
        .all()
    )
    return [_serialize_staff(user, branch) for user, branch in rows]


@router.patch("/{user_id}")
def update_staff(
    user_id: int,
    is_active: bool | None = None,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
):
    staff = db.query(User).filter(User.id == user_id, User.tenant_id == tenant_id, User.role.in_([Role.cashier.value, "staff"])).first()
    if not staff:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    if is_active is not None:
        staff.is_active = bool(is_active)
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return _serialize_staff(staff)


@router.delete("/{user_id}")
def delete_staff(
    user_id: int,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
):
    staff = db.query(User).filter(User.id == user_id, User.tenant_id == tenant_id, User.role == Role.cashier.value).first()
    if not staff:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    db.delete(staff)
    db.commit()
    return {"status": "deleted"}
