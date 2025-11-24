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
        # Check if notification already exists for this item today
        # We can use a simple check on title or body if we don't have a dedicated reference ID
        # For better robustness, we could add 'entity_id' to Notification model, but for now:
        
        # fetch medicine name via relationship if joined; else query
        name = getattr(item, "medicine", None).name if getattr(item, "medicine", None) else None
        if not name:
            med = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
            name = med.name if med else "Medicine"
            
        title = f"Low stock: {name}"
        
        # Check if recent notification exists (e.g. last 24h)
        from app.models.notification import Notification
        recent = db.query(Notification).filter(
            Notification.tenant_id == tenant_id,
            Notification.type == "low_stock",
            Notification.title == title,
            Notification.created_at >= datetime.utcnow() - timedelta(hours=24)
        ).first()
        
        if recent:
            continue

        create_notification(
            db,
            tenant_id=tenant_id,
            user_id=None,
            type="low_stock",
            title=title,
            body=f"{name} is low on stock (qty={item.quantity}, reorder={item.reorder_level}).",
        )
        count += 1
    return count


def notify_subscription_expiring(db: Session, *, tenant_id: str, days_before: int = 7) -> int:
    """Stub example for subscription expiry notifications.
    Replace with real subscription model and expiry dates.
    """
    # Check if notification already sent recently
    from app.models.notification import Notification
    title = "Subscription Expiring Soon"
    recent = db.query(Notification).filter(
        Notification.tenant_id == tenant_id,
        Notification.type == "subscription_expiring",
        Notification.title == title,
        Notification.created_at >= datetime.utcnow() - timedelta(hours=24)
    ).first()
    
    if recent:
        return 0

    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=None,
        type="subscription_expiring",
        title=title,
        body=f"Your subscription will expire in ~{days_before} days. Please renew to avoid interruptions.",
    )
    return 1

def notify_expiring_items(db: Session, *, tenant_id: str, days_threshold: int = 30) -> int:
    """Create notifications for items expiring soon."""
    target_date = datetime.utcnow().date() + timedelta(days=days_threshold)
    
    # Find items expiring on or before target_date, but not already expired (optional)
    # Or just items expiring within the window
    
    # We need to cast expiry_date string to date if it's stored as string, 
    # but InventoryItem model has expiry_date as String usually in this codebase?
    # Let's check model. InventoryItem.expiry_date is String (YYYY-MM-DD usually).
    
    # We'll fetch all items with expiry_date and filter in python to be safe with sqlite/postgres differences on string dates
    items = db.query(InventoryItem).filter(
        InventoryItem.tenant_id == tenant_id,
        InventoryItem.expiry_date.isnot(None)
    ).all()
    
    count = 0
    now_date = datetime.utcnow().date()
    
    for item in items:
        try:
            # Parse date
            exp_date = datetime.strptime(item.expiry_date, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            continue
            
        days_until = (exp_date - now_date).days
        
        if days_until < 0:
            # Already expired
            notif_type = "expired"
            title_prefix = "Expired"
        elif days_until <= days_threshold:
            # Expiring soon
            notif_type = "expiring_soon"
            title_prefix = "Expiring soon"
        else:
            continue
            
        # fetch medicine name
        name = getattr(item, "medicine", None).name if getattr(item, "medicine", None) else None
        if not name:
            med = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
            name = med.name if med else "Medicine"
            
        title = f"{title_prefix}: {name}"
        
        # Check duplicate
        from app.models.notification import Notification
        recent = db.query(Notification).filter(
            Notification.tenant_id == tenant_id,
            Notification.type == notif_type,
            Notification.title == title,
            Notification.created_at >= datetime.utcnow() - timedelta(hours=24) # Notify once a day
        ).first()
        
        if recent:
            continue
            
        body = f"{name} (Lot: {item.lot_number or 'N/A'}) expires on {item.expiry_date}."
        
        create_notification(
            db,
            tenant_id=tenant_id,
            user_id=None,
            type=notif_type,
            title=title,
            body=body,
        )
        count += 1
        
    return count

