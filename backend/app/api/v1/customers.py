from __future__ import annotations

from datetime import date, timedelta
from typing import Optional

import sqlalchemy as sa
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.models.branch import Branch
from app.models.customer import Customer
from app.models.user import User
from app.schemas.customer import (
    CustomerCreate,
    CustomerListResponse,
    CustomerOut,
    CustomerUpdate,
)

router = APIRouter(prefix="/customers", tags=["customers"])


def _serialize_customer(customer: Customer) -> CustomerOut:
    branch = getattr(customer, "branch", None)
    return CustomerOut(
        id=customer.id,
        tenant_id=customer.tenant_id,
        branch_id=customer.branch_id,
        branch_name=getattr(branch, "name", None) if branch else None,
        created_by_user_id=customer.created_by_user_id,
        first_name=customer.first_name,
        last_name=customer.last_name,
        email=customer.email,
        phone=customer.phone,
        gender=customer.gender,
        date_of_birth=customer.date_of_birth,
        address=customer.address,
        notes=customer.notes,
        meds_regimen=customer.meds_regimen,
        refill_frequency_days=customer.refill_frequency_days,
        next_refill_date=customer.next_refill_date,
        last_refill_date=customer.last_refill_date,
        loyalty_tier=customer.loyalty_tier,
        engagement_notes=customer.engagement_notes,
        is_active=customer.is_active,
        created_at=customer.created_at,
        updated_at=customer.updated_at,
    )


def _ensure_can_manage(user: User) -> None:
    if user.role not in {Role.admin.value, Role.cashier.value, "staff"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role to manage customers")


def _staff_branch_guard(user: User, branch_id: Optional[int]) -> Optional[int]:
    """Ensure staff cannot operate on branches they are not assigned to."""
    assigned_branch_id = getattr(user, "assigned_branch_id", None)
    if user.role in {Role.cashier.value, "staff"}:
        if assigned_branch_id:
            if branch_id is None:
                return assigned_branch_id
            if branch_id != assigned_branch_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not allowed to manage customers for another branch",
                )
        else:
            return branch_id
    return branch_id


def _validate_branch(db: Session, tenant_id: str, branch_id: Optional[int]) -> Optional[Branch]:
    if branch_id is None:
        return None
    branch = db.query(Branch).filter(Branch.id == branch_id, Branch.tenant_id == tenant_id).first()
    if not branch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found for tenant")
    return branch


@router.get("", response_model=CustomerListResponse)
def list_customers(
    tenant_id: str = Depends(require_tenant),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
    q: Optional[str] = None,
    branch_id: Optional[int] = None,
    include_inactive: bool = False,
    upcoming_refills_within_days: Optional[int] = None,
    page: int = 1,
    page_size: int = 20,
):
    roles_allowed = {Role.admin.value, Role.pharmacy_owner.value, Role.cashier.value, "staff"}
    if user.role not in roles_allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role to view customers")

    page = max(1, page)
    page_size = max(1, min(100, page_size))

    query = db.query(Customer).filter(Customer.tenant_id == tenant_id)

    if not include_inactive:
        query = query.filter(Customer.is_active.is_(True))

    branch = None
    if branch_id is not None:
        branch = _validate_branch(db, tenant_id, branch_id)
        query = query.filter(Customer.branch_id == branch.id)

    assigned_branch_id = getattr(user, "assigned_branch_id", None)
    if user.role in {Role.cashier.value, "staff"} and assigned_branch_id:
        # staff can only see their branch or unassigned customers
        query = query.filter(sa.or_(Customer.branch_id == assigned_branch_id, Customer.branch_id.is_(None)))

    if q:
        like = f"%{q.strip()}%"
        query = query.filter(
            sa.or_(
                Customer.first_name.ilike(like),
                Customer.last_name.ilike(like),
                Customer.email.ilike(like),
                Customer.phone.ilike(like),
                Customer.notes.ilike(like),
                Customer.meds_regimen.ilike(like),
            )
        )

    if upcoming_refills_within_days is not None and upcoming_refills_within_days >= 0:
        today = date.today()
        cutoff = today + timedelta(days=upcoming_refills_within_days)
        query = query.filter(Customer.next_refill_date.is_not(None)).filter(Customer.next_refill_date <= cutoff)

    total = query.count()
    rows = (
        query.order_by(Customer.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return CustomerListResponse(
        page=page,
        page_size=page_size,
        total=total,
        items=[_serialize_customer(c) for c in rows],
    )


@router.get("/summary")
def customer_summary(
    tenant_id: str = Depends(require_tenant),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    if user.role not in {Role.admin.value, Role.pharmacy_owner.value, Role.cashier.value, "staff"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role to view customer summary")

    query = db.query(Customer).filter(Customer.tenant_id == tenant_id)

    assigned_branch_id = getattr(user, "assigned_branch_id", None)
    if user.role in {Role.cashier.value, "staff"} and assigned_branch_id:
        query = query.filter(sa.or_(Customer.branch_id == assigned_branch_id, Customer.branch_id.is_(None)))

    total_customers = query.count()
    active_customers = query.filter(Customer.is_active.is_(True)).count()

    upcoming_cutoff = date.today() + timedelta(days=7)
    upcoming_count = (
        query.filter(Customer.next_refill_date.is_not(None))
        .filter(Customer.next_refill_date <= upcoming_cutoff)
        .count()
    )

    return {
        "total_customers": total_customers,
        "active_customers": active_customers,
        "upcoming_refills": upcoming_count,
    }


@router.post("", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(
    payload: CustomerCreate,
    tenant_id: str = Depends(require_tenant),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    _ensure_can_manage(user)

    data = payload.model_dump(exclude_unset=True)
    branch_id = data.pop("branch_id", None)
    branch_id = _staff_branch_guard(user, branch_id)
    branch = _validate_branch(db, tenant_id, branch_id)

    if not any([data.get("first_name"), data.get("last_name"), data.get("phone"), data.get("email")]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide at least a name, phone, or email")

    customer = Customer(tenant_id=tenant_id, created_by_user_id=user.id)
    if branch:
        customer.branch_id = branch.id
    elif branch_id:
        customer.branch_id = branch_id

    for field, value in data.items():
        setattr(customer, field, value)

    db.add(customer)
    db.commit()
    db.refresh(customer)
    return _serialize_customer(customer)


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: int,
    tenant_id: str = Depends(require_tenant),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    roles_allowed = {Role.admin.value, Role.pharmacy_owner.value, Role.cashier.value, "staff"}
    if user.role not in roles_allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role to view customer")

    customer = db.query(Customer).filter(Customer.id == customer_id, Customer.tenant_id == tenant_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    assigned_branch_id = getattr(user, "assigned_branch_id", None)
    if user.role in {Role.cashier.value, "staff"} and assigned_branch_id:
        if customer.branch_id not in (None, assigned_branch_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot access customers for another branch")

    return _serialize_customer(customer)


@router.patch("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int,
    payload: CustomerUpdate,
    tenant_id: str = Depends(require_tenant),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    _ensure_can_manage(user)

    customer = db.query(Customer).filter(Customer.id == customer_id, Customer.tenant_id == tenant_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    assigned_branch_id = getattr(user, "assigned_branch_id", None)
    if user.role in {Role.cashier.value, "staff"} and assigned_branch_id:
        if customer.branch_id not in (None, assigned_branch_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot update customers for another branch")

    data = payload.model_dump(exclude_unset=True)
    new_branch_id = data.pop("branch_id", None)

    if new_branch_id is not None:
        new_branch_id = _staff_branch_guard(user, new_branch_id)
        branch = _validate_branch(db, tenant_id, new_branch_id)
        customer.branch_id = branch.id if branch else new_branch_id
    elif user.role in {Role.cashier.value, "staff"} and assigned_branch_id and customer.branch_id is None:
        customer.branch_id = assigned_branch_id

    for field, value in data.items():
        setattr(customer, field, value)

    db.add(customer)
    db.commit()
    db.refresh(customer)
    return _serialize_customer(customer)


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    tenant_id: str = Depends(require_tenant),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    _ensure_can_manage(user)

    customer = db.query(Customer).filter(Customer.id == customer_id, Customer.tenant_id == tenant_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    assigned_branch_id = getattr(user, "assigned_branch_id", None)
    if user.role in {Role.cashier.value, "staff"} and assigned_branch_id:
        if customer.branch_id not in (None, assigned_branch_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot delete customers for another branch")

    db.delete(customer)
    db.commit()
    return {"status": "deleted"}
