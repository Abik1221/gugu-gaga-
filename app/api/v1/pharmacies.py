from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.models.pharmacy import Pharmacy
from app.models.user_tenant import UserTenant
from app.schemas.pharmacy_cms import PharmaciesListResponse, PharmacyOut

router = APIRouter(prefix="/pharmacies", tags=["pharmacy_cms"])


@router.post("")
def create_pharmacy(
    name: str,
    address: str | None = None,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    if not name or not name.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required")
    if address is not None and len(address) > 255:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Address too long")
    existing = db.query(Pharmacy).filter(Pharmacy.tenant_id == tenant_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tenant already has a pharmacy record")
    ph = Pharmacy(tenant_id=tenant_id, name=name.strip(), address=address.strip() if address else None)
    db.add(ph)
    db.commit()
    db.refresh(ph)
    return {"id": ph.id, "tenant_id": ph.tenant_id, "name": ph.name, "address": getattr(ph, "address", None)}


@router.get("", response_model=PharmaciesListResponse)
def list_pharmacies(
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    q = db.query(Pharmacy)
    if user.role != Role.admin.value:
        # Restrict owners to their linked tenants
        tenant_ids = [r.tenant_id for r in db.query(UserTenant).filter(UserTenant.user_id == user.id).all()]
        if not tenant_ids:
            return []
        q = q.filter(Pharmacy.tenant_id.in_(tenant_ids))
    if q:
        like = f"%{q}%"
        q = q.filter(Pharmacy.name.ilike(like))
    total = q.count()
    items = q.order_by(Pharmacy.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [{"id": p.id, "tenant_id": p.tenant_id, "name": p.name, "address": getattr(p, "address", None)} for p in items],
    }


@router.get("/{pharmacy_id}", response_model=PharmacyOut)
def get_pharmacy(
    pharmacy_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ph = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not ph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pharmacy not found")
    # Access: admin or owner linked to this tenant
    if current_user.role != Role.admin.value:
        link = (
            db.query(UserTenant)
            .filter(UserTenant.user_id == current_user.id, UserTenant.tenant_id == ph.tenant_id)
            .first()
        )
        if not link:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return {"id": ph.id, "tenant_id": ph.tenant_id, "name": ph.name, "address": getattr(ph, "address", None)}


@router.patch("/{pharmacy_id}")
def update_pharmacy(
    pharmacy_id: int,
    name: str | None = None,
    address: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
):
    ph = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not ph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pharmacy not found")
    # Owners can only update their own tenant's pharmacy
    if current_user.role != Role.admin.value:
        link = (
            db.query(UserTenant)
            .filter(UserTenant.user_id == current_user.id, UserTenant.tenant_id == ph.tenant_id)
            .first()
        )
        if not link:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if name is not None:
        name = name.strip()
        if not name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name cannot be empty")
        ph.name = name
    if address is not None:
        if len(address) > 255:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Address too long")
        ph.address = address
    db.add(ph)
    db.commit()
    db.refresh(ph)
    return {"id": ph.id, "tenant_id": ph.tenant_id, "name": ph.name, "address": getattr(ph, "address", None)}


@router.delete("/{pharmacy_id}")
def delete_pharmacy(
    pharmacy_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(Role.admin)),
):
    ph = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not ph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pharmacy not found")
    db.delete(ph)
    db.commit()
    return {"status": "deleted"}
