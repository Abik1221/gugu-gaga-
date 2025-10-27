from __future__ import annotations

from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.core.roles import Role
from app.db.deps import get_db
from app.models.medicine import InventoryItem, Medicine
from app.models.sales import SaleItem
from app.deps.ratelimit import rate_limit_user
from app.schemas.inventory import IdResponse, StatusResponse, InventoryBulkResult, InventoryListResponse
from app.services.audit import log_event

router = APIRouter(prefix="/inventory", tags=["inventory"])


def _to_units(packs_count: int | None, singles_count: int | None, pack_size: int) -> int:
    p = max(0, packs_count or 0)
    s = max(0, singles_count or 0)
    return p * max(1, pack_size) + s


@router.post("/items", response_model=IdResponse)
def upsert_item(
    medicine_id: int,
    branch: str | None = None,
    pack_size: int = 1,
    packs_count: int | None = None,
    singles_count: int | None = None,
    expiry_date: date | None = None,
    lot_number: str | None = None,
    purchase_price: float | None = None,
    sell_price: float | None = None,
    reorder_level: int = 0,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
    _rl=Depends(rate_limit_user("inventory_mutation_user")),
):
    if pack_size < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="pack_size must be >= 1")
    qty_units = _to_units(packs_count, singles_count, pack_size)
    if qty_units <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be > 0")
    med = db.query(Medicine).filter(Medicine.id == medicine_id, Medicine.tenant_id == tenant_id).first()
    if not med:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")
    # Try to find existing lot record for upsert
    existing = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.medicine_id == medicine_id,
            InventoryItem.branch == branch,
            InventoryItem.lot_number == lot_number,
        )
        .first()
    )
    if existing:
        existing.quantity = (existing.quantity or 0) + qty_units
        existing.pack_size = pack_size
        if expiry_date is not None:
            existing.expiry_date = expiry_date
        if purchase_price is not None:
            existing.purchase_price = purchase_price
        if sell_price is not None:
            existing.sell_price = sell_price
        existing.reorder_level = max(0, reorder_level)
        db.add(existing)
        db.commit()
        db.refresh(existing)
        log_event(
            db,
            tenant_id=tenant_id,
            actor_user_id=getattr(current_user, "id", None),
            action="inventory_upsert",
            target_type="inventory_item",
            target_id=str(existing.id),
            metadata={
                "medicine_id": medicine_id,
                "branch": branch,
                "quantity": existing.quantity,
                "reorder_level": existing.reorder_level,
                "expiry_date": existing.expiry_date.isoformat() if existing.expiry_date else None,
            },
        )
        return {"id": existing.id}
    item = InventoryItem(
        tenant_id=tenant_id,
        medicine_id=medicine_id,
        branch=branch,
        quantity=qty_units,
        reorder_level=max(0, reorder_level),
        expiry_date=expiry_date,
        lot_number=lot_number,
        pack_size=pack_size,
        purchase_price=purchase_price,
        sell_price=sell_price,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    log_event(
        db,
        tenant_id=tenant_id,
        actor_user_id=getattr(current_user, "id", None),
        action="inventory_upsert",
        target_type="inventory_item",
        target_id=str(item.id),
        metadata={
            "medicine_id": medicine_id,
            "branch": branch,
            "quantity": item.quantity,
            "reorder_level": item.reorder_level,
            "expiry_date": item.expiry_date.isoformat() if item.expiry_date else None,
        },
    )
    return {"id": item.id}


@router.post("/bulk", response_model=InventoryBulkResult)
def bulk_upsert_inventory(
    items: list[dict] | None = None,
    csv_text: str | None = None,
    dry_run: bool = False,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
    _rl=Depends(rate_limit_user("inventory_mutation_user")),
):
    # Fields per row: medicine_name OR sku (one required), branch, pack_size, packs_count, singles_count,
    # expiry_date (YYYY-MM-DD), lot_number, purchase_price, sell_price, reorder_level
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
    updated = 0
    errors: list[dict] = []
    from datetime import datetime as _dt

    for r in rows:
        name = (r.get("medicine_name") or "").strip()
        sku = (r.get("sku") or "").strip()
        branch = (r.get("branch") or None)
        try:
            pack_size = int(r.get("pack_size") or 1)
            packs_count = int(r.get("packs_count") or 0)
            singles_count = int(r.get("singles_count") or 0)
            expiry_date = r.get("expiry_date")
            expiry = _dt.strptime(expiry_date, "%Y-%m-%d").date() if expiry_date else None
            lot_number = (r.get("lot_number") or None)
            purchase_price = float(r["purchase_price"]) if r.get("purchase_price") not in (None, "") else None
            sell_price = float(r["sell_price"]) if r.get("sell_price") not in (None, "") else None
            reorder_level = int(r.get("reorder_level") or 0)
        except Exception as e:
            errors.append({"row": r, "error": f"parse_error: {e}"})
            continue
        if not name and not sku:
            errors.append({"row": r, "error": "medicine_name or sku required"})
            continue
        med_q = db.query(Medicine).filter(Medicine.tenant_id == tenant_id)
        if sku:
            med = med_q.filter(Medicine.sku == sku).first()
        else:
            med = med_q.filter(Medicine.name == name).first()
        if not med:
            errors.append({"row": r, "error": "medicine not found"})
            continue
        # upsert
        qty_units = _to_units(packs_count, singles_count, max(1, pack_size))
        if qty_units <= 0:
            errors.append({"row": r, "error": "quantity computed <= 0"})
            continue
        existing = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.tenant_id == tenant_id,
                InventoryItem.medicine_id == med.id,
                InventoryItem.branch == branch,
                InventoryItem.lot_number == lot_number,
            )
            .first()
        )
        if existing:
            if not dry_run:
                existing.quantity = (existing.quantity or 0) + qty_units
                existing.pack_size = pack_size
                existing.expiry_date = expiry
                existing.purchase_price = purchase_price
                existing.sell_price = sell_price
                existing.reorder_level = max(0, reorder_level)
                db.add(existing)
            updated += 1
        else:
            if not dry_run:
                item = InventoryItem(
                    tenant_id=tenant_id,
                    medicine_id=med.id,
                    branch=branch,
                    quantity=qty_units,
                    reorder_level=max(0, reorder_level),
                    expiry_date=expiry,
                    lot_number=lot_number,
                    pack_size=pack_size,
                    purchase_price=purchase_price,
                    sell_price=sell_price,
                )
                db.add(item)
            created += 1
    if not dry_run:
        db.commit()
        log_event(
            db,
            tenant_id=tenant_id,
            actor_user_id=getattr(current_user, "id", None),
            action="inventory_bulk_upsert",
            target_type="inventory",
            target_id=None,
            metadata={"created": created, "updated": updated},
        )
    return {"created": created, "updated": updated, "errors": errors, "dry_run": dry_run}


@router.get("/template.csv", response_class=PlainTextResponse)
def inventory_template():
    return (
        "medicine_name,sku,branch,pack_size,packs_count,singles_count,expiry_date,lot_number,purchase_price,sell_price,reorder_level\n"
        "Paracetamol 500mg,PARA500,Central,10,50,0,2026-01-01,LOT123,1.20,2.50,100\n"
        "Ibuprofen 200mg,IBU200,Central,20,25,10,2025-12-15,LOT777,0.80,1.90,80\n"
    )


@router.get("/items", response_model=InventoryListResponse)
def list_items(
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
    db: Session = Depends(get_db),
    q: str | None = None,
    branch: str | None = None,
    expiring_in_days: int | None = None,
    low_stock_only: bool = False,
    page: int = 1,
    page_size: int = 20,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    query = db.query(InventoryItem).filter(InventoryItem.tenant_id == tenant_id)
    if branch:
        query = query.filter(InventoryItem.branch == branch)
    if q:
        like = f"%{q}%"
        query = query.join(Medicine).filter((Medicine.name.ilike(like)) | (Medicine.sku.ilike(like)))
    if expiring_in_days is not None and expiring_in_days >= 0:
        from datetime import date as _d, timedelta

        cutoff = _d.today() + timedelta(days=expiring_in_days)
        query = query.filter(and_(InventoryItem.expiry_date.isnot(None), InventoryItem.expiry_date <= cutoff))
    if low_stock_only:
        query = query.filter(InventoryItem.quantity <= InventoryItem.reorder_level)
    total = query.count()
    rows = query.order_by(InventoryItem.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [
            {
                "id": r.id,
                "medicine_id": r.medicine_id,
                "medicine_name": r.medicine.name,
                "sku": r.medicine.sku,
                "branch": r.branch,
                "quantity": r.quantity,
                "pack_size": r.pack_size,
                "packs": (r.quantity // r.pack_size) if r.pack_size else r.quantity,
                "singles": (r.quantity % r.pack_size) if r.pack_size else 0,
                "reorder_level": r.reorder_level,
                "expiry_date": r.expiry_date.isoformat() if r.expiry_date else None,
                "lot_number": r.lot_number,
                "sell_price": r.sell_price,
            }
            for r in rows
        ],
    }


@router.delete("/items/{item_id}", response_model=StatusResponse)
def delete_item(
    item_id: int,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _rl=Depends(rate_limit_user("inventory_mutation_user")),
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id, InventoryItem.tenant_id == tenant_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    # Safety: if there are sale items tied to this medicine and this lot still has quantity, deletion may hide stock history.
    # Conservative policy: allow delete for mistaken lot entries only when quantity == 0.
    if item.quantity and item.quantity > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete lot with remaining quantity; set quantity to 0 first")
    # Optional stronger safety: block if medicine appears in any sale lines and item was created before those sales (omitted for now for speed)
    db.delete(item)
    db.commit()
    return {"status": "deleted"}


@router.patch("/items/{item_id}", response_model=IdResponse)
def update_item(
    item_id: int,
    tenant_id: str = Depends(require_tenant),
    _role=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    quantity: int | None = None,
    reorder_level: int | None = None,
    expiry_date: date | None = None,
    lot_number: str | None = None,
    sell_price: float | None = None,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
    _rl=Depends(rate_limit_user("inventory_mutation_user")),
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id, InventoryItem.tenant_id == tenant_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if quantity is not None:
        if quantity < 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity cannot be negative")
        item.quantity = quantity
    if reorder_level is not None:
        item.reorder_level = max(0, reorder_level)
    if expiry_date is not None:
        item.expiry_date = expiry_date
    if lot_number is not None:
        item.lot_number = lot_number or None
    if sell_price is not None:
        item.sell_price = sell_price
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id}
