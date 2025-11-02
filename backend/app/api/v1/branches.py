from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import re

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from datetime import date

from app.models.branch import Branch
from app.models.pharmacy import Pharmacy
from app.schemas.branches import BranchOut, BranchListResponse, BranchCreate, BranchUpdate
from app.schemas.inventory import StatusResponse

router = APIRouter(prefix="/branches", tags=["pharmacy_cms"])

PHONE_RE = re.compile(r"^[0-9+\-()\s]{7,32}$")


def _validate_branch_inputs(
    name: str | None,
    address: str | None,
    phone: str | None,
    *,
    require_name: bool = False,
) -> str | None:
    cleaned_name: str | None = None
    if name is None:
        if require_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required")
    else:
        cleaned_name = name.strip()
        if not cleaned_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required")
        if len(cleaned_name) > 255:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name too long")
    if address is not None and len(address) > 255:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Address too long")
    if phone is not None:
        if len(phone) > 32 or not PHONE_RE.match(phone):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid phone format")
    return cleaned_name


@router.post("", response_model=BranchOut)
def create_branch(
    payload: BranchCreate,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    cleaned_name = _validate_branch_inputs(payload.name, payload.address, payload.phone, require_name=True)
    sub = db.query(Subscription).filter(Subscription.tenant_id == tenant_id).first()
    has_verified_payment = (
        db.query(PaymentSubmission)
        .filter(
            PaymentSubmission.tenant_id == tenant_id,
            PaymentSubmission.status == "verified",
        )
        .order_by(PaymentSubmission.verified_at.desc())
        .first()
        is not None
    )
    if sub and not has_verified_payment:
        today = date.today()
        if not sub.next_due_date or today <= sub.next_due_date:
            existing_count = db.query(Branch).filter(Branch.tenant_id == tenant_id).count()
            if existing_count >= 1:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Free trial plan supports only one location. Upgrade to add more branches.",
                )
    ph = (
        db.query(Pharmacy)
        .filter(Pharmacy.id == payload.pharmacy_id, Pharmacy.tenant_id == tenant_id)
        .first()
    )
    if not ph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pharmacy not found for tenant")
    br = Branch(
        tenant_id=tenant_id,
        pharmacy_id=payload.pharmacy_id,
        name=cleaned_name or payload.name.strip(),
        address=payload.address,
        phone=payload.phone,
    )
    db.add(br)
    db.commit()
    db.refresh(br)
    return {"id": br.id, "pharmacy_id": br.pharmacy_id, "tenant_id": br.tenant_id, "name": br.name, "address": br.address, "phone": br.phone}


@router.get("", response_model=BranchListResponse)
def list_branches(
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    q: str | None = None,
    pharmacy_id: int | None = None,
    page: int = 1,
    page_size: int = 20,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    query = db.query(Branch).filter(Branch.tenant_id == tenant_id)
    if pharmacy_id is not None:
        query = query.filter(Branch.pharmacy_id == pharmacy_id)
    if q:
        like = f"%{q}%"
        query = query.filter(Branch.name.ilike(like))
    total = query.count()
    rows = query.order_by(Branch.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [
            {"id": r.id, "pharmacy_id": r.pharmacy_id, "tenant_id": r.tenant_id, "name": r.name, "address": r.address, "phone": r.phone}
            for r in rows
        ],
    }


@router.get("/{branch_id}", response_model=BranchOut)
def get_branch(
    branch_id: int,
    tenant_id: str = Depends(require_tenant),
    _=Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    br = db.query(Branch).filter(Branch.id == branch_id, Branch.tenant_id == tenant_id).first()
    if not br:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
    return {"id": br.id, "pharmacy_id": br.pharmacy_id, "tenant_id": br.tenant_id, "name": br.name, "address": br.address, "phone": br.phone}


@router.patch("/{branch_id}", response_model=BranchOut)
def update_branch(
    branch_id: int,
    payload: BranchUpdate,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    cleaned_name = _validate_branch_inputs(payload.name, payload.address, payload.phone, require_name=False)
    br = db.query(Branch).filter(Branch.id == branch_id, Branch.tenant_id == tenant_id).first()
    if not br:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
    if payload.name is not None:
        br.name = cleaned_name or payload.name.strip()
    if payload.address is not None:
        br.address = payload.address
    if payload.phone is not None:
        br.phone = payload.phone
    db.add(br)
    db.commit()
    db.refresh(br)
    return {"id": br.id, "pharmacy_id": br.pharmacy_id, "tenant_id": br.tenant_id, "name": br.name, "address": br.address, "phone": br.phone}


@router.delete("/{branch_id}", response_model=StatusResponse)
def delete_branch(
    branch_id: int,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
):
    br = db.query(Branch).filter(Branch.id == branch_id, Branch.tenant_id == tenant_id).first()
    if not br:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
    db.delete(br)
    db.commit()
    return {"status": "deleted"}
