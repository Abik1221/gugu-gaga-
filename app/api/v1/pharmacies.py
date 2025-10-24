from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.models.pharmacy import Pharmacy

router = APIRouter(prefix="/pharmacies", tags=["pharmacy_cms"])


@router.post("")
def create_pharmacy(
    name: str,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
):
    existing = db.query(Pharmacy).filter(Pharmacy.tenant_id == tenant_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tenant already has a pharmacy record")
    ph = Pharmacy(tenant_id=tenant_id, name=name)
    db.add(ph)
    db.commit()
    db.refresh(ph)
    return {"id": ph.id, "tenant_id": ph.tenant_id, "name": ph.name}


@router.get("")
def list_pharmacies(
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
):
    # Admin sees all, owners can filter via linked tenants on the UI (not enforced here)
    items = db.query(Pharmacy).order_by(Pharmacy.id.desc()).limit(100).all()
    return [{"id": p.id, "tenant_id": p.tenant_id, "name": p.name} for p in items]
