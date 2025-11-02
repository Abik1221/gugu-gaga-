from __future__ import annotations

from datetime import datetime, timedelta
from typing import List

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.medicine import InventoryItem, Medicine
from app.services.notifications.in_app import create_notification


def notify_affiliate_login(db: Session, *, affiliate_user_id: int, tenant_id: str | None, ip: str | None = None):
    body = "Signed in successfully"
    if ip:
        body += f" from {ip}"
    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=affiliate_user_id,
        type="affiliate_login",
        title="New login",
        body=body,
    )


def notify_affiliate_link_event(
    db: Session,
    *,
    affiliate_user_id: int,
    tenant_id: str | None,
    event: str,
    token: str,
):
    titles = {
        "created": "Referral link created",
        "rotated": "Referral link rotated",
        "deactivated": "Referral link deactivated",
    }
    create_notification(
        db,
        tenant_id=tenant_id,
        user_id=affiliate_user_id,
        type=f"affiliate_link_{event}",
        title=titles.get(event, "Referral link update"),
        body=f"Token: {token}",
    )


def notify_affiliate_referral_registered(
    db: Session,
    *,
    affiliate_user_id: int,
    referred_tenant_id: str,
    pharmacy_name: str | None = None,
):
    create_notification(
        db,
        tenant_id=None,
        user_id=affiliate_user_id,
        type="affiliate_referral_registered",
        title="New pharmacy registered",
        body="A pharmacy just signed up with your referral" + (f": {pharmacy_name}" if pharmacy_name else ""),
    )


def notify_affiliate_referral_activated(
    db: Session,
    *,
    affiliate_user_id: int,
    referred_tenant_id: str,
):
    create_notification(
        db,
        tenant_id=referred_tenant_id,
        user_id=affiliate_user_id,
        type="affiliate_referral_activated",
        title="Referral activated",
        body="Your referred pharmacy has completed onboarding",
    )


def notify_affiliate_payout_status(
    db: Session,
    *,
    affiliate_user_id: int,
    month: str,
    amount: float,
    status: str,
):
    statuses = {
        "pending": "Payout request received",
        "under_review": "Payout under review",
        "approved": "Payout approved",
        "paid": "Payout sent",
        "rejected": "Payout rejected",
    }
    title = statuses.get(status, "Payout update")
    body = f"Period {month} · Amount {amount:.2f}"
    create_notification(
        db,
        tenant_id=None,
        user_id=affiliate_user_id,
        type=f"affiliate_payout_{status}",
        title=title,
        body=body,
    )


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
