from __future__ import annotations

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.deps.auth import require_role, get_current_user
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.core.roles import Role
from app.db.deps import get_db
from app.models.sales import Sale, SaleItem
from app.models.medicine import Medicine, InventoryItem
from app.deps.ratelimit import rate_limit_user
from app.services.notifications.notify import notify_user

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/transactions")
def list_transactions(
    tenant_id: str = Depends(require_tenant),
    _=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
    db: Session = Depends(get_db),
    q: str | None = None,
    from_date: str | None = None,
    to_date: str | None = None,
    branch: str | None = None,
    page: int = 1,
    page_size: int = 20,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    from datetime import datetime as _dt

    page = max(1, page)
    page_size = max(1, min(100, page_size))
    sale_q = db.query(Sale).filter(Sale.tenant_id == tenant_id)
    if branch:
        sale_q = sale_q.filter(Sale.branch == branch)
    if from_date:
        try:
            dt = _dt.fromisoformat(from_date)
            sale_q = sale_q.filter(Sale.created_at >= dt)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid from_date")
    if to_date:
        try:
            dt = _dt.fromisoformat(to_date)
            sale_q = sale_q.filter(Sale.created_at <= dt)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid to_date")

    # Filter by medicine name/sku if q provided by joining SaleItem->Medicine
    if q:
        like = f"%{q}%"
        sale_ids = (
            db.query(SaleItem.sale_id)
            .join(Medicine, Medicine.id == SaleItem.medicine_id)
            .filter((Medicine.name.ilike(like)) | (Medicine.sku.ilike(like)))
            .distinct()
            .all()
        )
        sale_ids = [sid[0] for sid in sale_ids]
        if not sale_ids:
            return {"page": page, "page_size": page_size, "total": 0, "items": []}
        sale_q = sale_q.filter(Sale.id.in_(sale_ids))

    total = sale_q.count()
    sales = (
        sale_q.order_by(Sale.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    if not sales:
        return {"page": page, "page_size": page_size, "total": total, "items": []}
    sale_ids_page = [s.id for s in sales]
    items = (
        db.query(SaleItem, Medicine)
        .join(Medicine, Medicine.id == SaleItem.medicine_id)
        .filter(SaleItem.sale_id.in_(sale_ids_page))
        .all()
    )
    lines_by_sale: dict[int, list[dict]] = {}
    for si, med in items:
        lines_by_sale.setdefault(si.sale_id, []).append(
            {
                "medicine_id": si.medicine_id,
                "medicine_name": med.name,
                "sku": med.sku,
                "quantity": si.quantity,
                "unit_price": si.unit_price,
                "line_total": si.line_total,
            }
        )

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [
            {
                "id": s.id,
                "branch": s.branch,
                "cashier_user_id": s.cashier_user_id,
                "total_amount": s.total_amount,
                "created_at": s.created_at.isoformat() if getattr(s, "created_at", None) else None,
                "lines": lines_by_sale.get(s.id, []),
            }
            for s in sales
        ],
    }


def _resolve_medicine(db: Session, tenant_id: str, name_or_sku: str) -> Medicine | None:
    q = name_or_sku.strip()
    if not q:
        return None
    med = (
        db.query(Medicine)
        .filter(Medicine.tenant_id == tenant_id, (Medicine.sku == q) | (Medicine.name == q))
        .first()
    )
    return med


@router.post("/pos")
def create_sale_pos(
    lines: List[Dict[str, Any]],
    branch: str | None = None,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(require_role(Role.admin, Role.cashier, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
    _rl=Depends(rate_limit_user("pos_user")),
):
    if not lines:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No sale lines provided")
    # Validate and prepare
    resolved = []
    for ln in lines:
        q = (ln.get("name_or_sku") or "").strip()
        qty = int(ln.get("quantity_units") or 0)
        if qty <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="quantity_units must be > 0")
        med = _resolve_medicine(db, tenant_id, q)
        if not med:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Medicine not found: {q}")
        price = ln.get("unit_price")
        # fallback to inventory sell_price if not provided
        if price is None:
            inv_price = (
                db.query(InventoryItem.sell_price)
                .filter(InventoryItem.tenant_id == tenant_id, InventoryItem.medicine_id == med.id)
                .order_by(InventoryItem.id.desc())
                .first()
            )
            price = float(inv_price[0]) if inv_price and inv_price[0] is not None else 0.0
        resolved.append({"med": med, "qty": qty, "unit_price": float(price)})

    # Check stock FEFO and compute totals
    total = 0.0
    decrement_plan: Dict[int, List[Dict[str, Any]]] = {}
    for r in resolved:
        med: Medicine = r["med"]
        needed = r["qty"]
        lots = (
            db.query(InventoryItem)
            .filter(InventoryItem.tenant_id == tenant_id, InventoryItem.medicine_id == med.id)
            .order_by(InventoryItem.expiry_date.is_(None), InventoryItem.expiry_date.asc(), InventoryItem.id.asc())
            .all()
        )
        remaining = needed
        plan = []
        for lot in lots:
            if remaining <= 0:
                break
            take = min(lot.quantity, remaining)
            if take > 0:
                plan.append({"lot_id": lot.id, "take": take})
                remaining -= take
        if remaining > 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient stock for {med.name}")
        decrement_plan[med.id] = plan
        total += r["qty"] * r["unit_price"]

    # Persist sale
    sale = Sale(tenant_id=tenant_id, cashier_user_id=getattr(current_user, "id", None), branch=branch, total_amount=0.0)
    db.add(sale)
    db.commit()
    db.refresh(sale)

    for r in resolved:
        med = r["med"]
        qty = r["qty"]
        unit_price = r["unit_price"]
        item = SaleItem(sale_id=sale.id, medicine_id=med.id, quantity=qty, unit_price=unit_price, line_total=qty * unit_price)
        db.add(item)
    sale.total_amount = total
    db.add(sale)
    db.commit()

    # Decrement inventory per plan and collect low-stock notifications
    low_stock_hits = []
    for med_id, plan in decrement_plan.items():
        for action in plan:
            lot = db.query(InventoryItem).filter(InventoryItem.id == action["lot_id"]).with_for_update().first()
            if not lot:
                continue
            lot.quantity = max(0, lot.quantity - action["take"])
            db.add(lot)
            db.commit()
            if lot.quantity <= lot.reorder_level:
                low_stock_hits.append((med_id, lot))

    # Notify low-stock for affected items
    if low_stock_hits:
        for med_id, lot in low_stock_hits:
            med = db.query(Medicine).filter(Medicine.id == med_id).first()
            title = "Low stock alert"
            body = f"{med.name} stock is low (qty={lot.quantity}, reorder_level={lot.reorder_level})."
            # send to cashier/owner user if available; here we broadcast to tenant
            from app.services.notifications.notify import notify_broadcast

            notify_broadcast(db, tenant_id=tenant_id, type="low_stock", title=title, body=body)

    return {"id": sale.id, "total": sale.total_amount}
