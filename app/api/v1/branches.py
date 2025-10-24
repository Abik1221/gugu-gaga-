from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import re

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.models.branch import Branch
from app.models.pharmacy import Pharmacy
from app.schemas.branches import BranchOut, BranchListResponse
from app.schemas.inventory import StatusResponse

router = APIRouter(prefix="/branches", tags=["pharmacy_cms"])

PHONE_RE = re.compile(r"^[0-9+\-()\s]{7,32}$")


def _validate_branch_inputs(name: str | None, address: str | None, phone: str | None):
    if name is not None:
        if not name.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required")
        if len(name) > 255:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name too long")
    if address is not None and len(address) > 255:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Address too long")
    if phone is not None:
        if len(phone) > 32 or not PHONE_RE.match(phone):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid phone format")


@router.post("", response_model=BranchOut)
def create_branch(
    pharmacy_id: int,
    name: str,
    address: str | None = None,
    phone: str | None = None,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    _validate_branch_inputs(name, address, phone)
    ph = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id, Pharmacy.tenant_id == tenant_id).first()
    if not ph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pharmacy not found for tenant")
    br = Branch(tenant_id=tenant_id, pharmacy_id=pharmacy_id, name=name.strip(), address=address, phone=phone)
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
    name: str | None = None,
    address: str | None = None,
    phone: str | None = None,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    _validate_branch_inputs(name or "ok", address, phone)  # allow None but validate formats if provided
    br = db.query(Branch).filter(Branch.id == branch_id, Branch.tenant_id == tenant_id).first()
    if not br:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
    if name is not None:
        name = name.strip()
        if not name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name cannot be empty")
        br.name = name
    if address is not None:
        br.address = address
    if phone is not None:
        if not PHONE_RE.match(phone):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid phone format")
        br.phone = phone
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
