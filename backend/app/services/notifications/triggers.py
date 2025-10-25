from __future__ import annotations

from datetime import datetime, timedelta
from typing import List

from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.medicine import InventoryItem, Medicine
from app.services.notifications.in_app import create_notification


def notify_low_stock(db: Session, *, tenant_id: str, threshold: int = 5) -> int:
    """Create low-stock notifications for items at/below threshold.
    Returns count of notifications created.
    """
    rows: List[InventoryItem] = (
        db.query(InventoryItem)
        .filter(and_(InventoryItem.tenant_id == tenant_id, InventoryItem.quantity <= InventoryItem.reorder_level))
        .all()
    )
    count = 0
    for item in rows:
        # fetch medicine name via relationship if joined; else query
        name = getattr(item, "medicine", None).name if getattr(item, "medicine", None) else None
        if not name:
            med = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
            name = med.name if med else "Medicine"
        create_notification(
            db,
            tenant_id=tenant_id,
            user_id=None,
            type="low_stock",
            title=f"Low stock: {name}",
            body=f"{name} is low on stock (qty={item.quantity}, reorder={item.reorder_level}).",
        )
        count += 1
    return count


def notify_subscription_expiring(db: Session, *, tenant_id: str, days_before: int = 7) -> int:
    """Stub example for subscription expiry notifications.
    Replace with real subscription model and expiry dates.
    """
    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=None,
        type="subscription_expiring",
        title="Subscription Expiring Soon",
        body=f"Your subscription will expire in ~{days_before} days. Please renew to avoid interruptions.",
    )
    return 1
