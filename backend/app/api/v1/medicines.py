from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.models.medicine import Medicine
from app.schemas.medicines import (
    MedicineCreated,
    MedicinesListResponse,
    BulkMedicinesResult,
    DeletedResponse,
)

router = APIRouter(prefix="/medicines", tags=["inventory"])


@router.post("", response_model=MedicineCreated)
def create_medicine(
    name: str,
    sku: str | None = None,
    category: str | None = None,
    manufacturer: str | None = None,
    description: str | None = None,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    name = (name or "").strip()
    if not name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required")
    existing = (
        db.query(Medicine)
        .filter(Medicine.tenant_id == tenant_id, Medicine.name == name)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Medicine already exists")
    med = Medicine(
        tenant_id=tenant_id,
        name=name,
        sku=sku.strip() if sku else None,
        category=category.strip() if category else None,
        manufacturer=manufacturer.strip() if manufacturer else None,
        description=description.strip() if description else None,
    )
    db.add(med)
    db.commit()
    db.refresh(med)
    return {"id": med.id, "name": med.name, "sku": med.sku}


@router.post("/bulk", response_model=BulkMedicinesResult)
def bulk_create_medicines(
    items: list[dict] | None = None,
    csv_text: str | None = None,
    dry_run: bool = False,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    rows: list[dict] = []
    if items:
        rows = items
    elif csv_text:
        import csv
        from io import StringIO

        reader = csv.DictReader(StringIO(csv_text))
        rows = list(reader)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide items (JSON array) or csv_text")

    created = 0
    skipped = []
    for r in rows:
        name = (r.get("name") or "").strip()
        if not name:
            skipped.append({"row": r, "error": "name required"})
            continue
        exists = db.query(Medicine).filter(Medicine.tenant_id == tenant_id, Medicine.name == name).first()
        if exists:
            skipped.append({"row": r, "error": "duplicate name"})
            continue
        if not dry_run:
            med = Medicine(
                tenant_id=tenant_id,
                name=name,
                sku=(r.get("sku") or None),
                category=(r.get("category") or None),
                manufacturer=(r.get("manufacturer") or None),
                description=(r.get("description") or None),
            )
            db.add(med)
        created += 1
    if not dry_run:
        db.commit()
    return {"created": created, "skipped": skipped, "dry_run": dry_run}


@router.get("/template.csv", response_class=PlainTextResponse)
def medicines_template():
    return (
        "name,sku,category,manufacturer,description\n"
        "Paracetamol 500mg,PARA500,Analgesic,ACME,Painkiller tablet\n"
        "Ibuprofen 200mg,IBU200,NSAID,ACME,Anti-inflammatory\n"
    )


@router.get("", response_model=MedicinesListResponse)
def list_medicines(
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
    db: Session = Depends(get_db),
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    query = db.query(Medicine).filter(Medicine.tenant_id == tenant_id)
    if q:
        like = f"%{q}%"
        query = query.filter((Medicine.name.ilike(like)) | (Medicine.sku.ilike(like)))
    total = query.count()
    rows = query.order_by(Medicine.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [
            {
                "id": r.id,
                "name": r.name,
                "sku": r.sku,
                "category": r.category,
                "manufacturer": r.manufacturer,
            }
            for r in rows
        ],
    }


@router.patch("/{medicine_id}", response_model=MedicineCreated)
def update_medicine(
    medicine_id: int,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    name: str | None = None,
    sku: str | None = None,
    category: str | None = None,
    manufacturer: str | None = None,
    description: str | None = None,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    med = db.query(Medicine).filter(Medicine.id == medicine_id, Medicine.tenant_id == tenant_id).first()
    if not med:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")
    if name is not None:
        name = name.strip()
        if not name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name cannot be empty")
        med.name = name
    if sku is not None:
        med.sku = sku.strip() or None
    if category is not None:
        med.category = category.strip() or None
    if manufacturer is not None:
        med.manufacturer = manufacturer.strip() or None
    if description is not None:
        med.description = description.strip() or None
    db.add(med)
    db.commit()
    db.refresh(med)
    return {"id": med.id, "name": med.name, "sku": med.sku}


@router.delete("/{medicine_id}", response_model=DeletedResponse)
def delete_medicine(
    medicine_id: int,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin)),
    db: Session = Depends(get_db),
):
    med = db.query(Medicine).filter(Medicine.id == medicine_id, Medicine.tenant_id == tenant_id).first()
    if not med:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")
    db.delete(med)
    db.commit()
    return {"status": "deleted"}
