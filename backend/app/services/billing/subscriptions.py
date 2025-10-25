from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.models.subscription import Subscription, PaymentSubmission
from app.services.notifications.notify import notify_broadcast


BILLING_CYCLE_DAYS = 30


def ensure_subscription(db: Session, *, tenant_id: str) -> Subscription:
    sub = db.query(Subscription).filter(Subscription.tenant_id == tenant_id).first()
    if sub:
        return sub
    # Default next due date: today + billing cycle
    next_due = date.today() + timedelta(days=BILLING_CYCLE_DAYS)
    sub = Subscription(tenant_id=tenant_id, next_due_date=next_due, blocked=False, notices_sent=0, last_notice_date=None)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


def submit_payment_code(db: Session, *, tenant_id: str, code: str, submitted_by_user_id: Optional[int]) -> PaymentSubmission:
    ensure_subscription(db, tenant_id=tenant_id)
    ps = PaymentSubmission(tenant_id=tenant_id, code=code, status="pending", submitted_by_user_id=submitted_by_user_id)
    db.add(ps)
    db.commit()
    db.refresh(ps)
    return ps


def process_subscription_due(db: Session, *, tenant_id: str) -> None:
    sub = ensure_subscription(db, tenant_id=tenant_id)
    today = date.today()
    delta_days = (sub.next_due_date - today).days
    # Only send at most one notice per day
    if sub.last_notice_date == today:
        return
    if -5 <= delta_days <= 5:
        # Send notice; increment counter if within or past due date window
        sub.last_notice_date = today
        sub.notices_sent = (sub.notices_sent or 0) + 1
        db.add(sub)
        db.commit()
        notify_broadcast(
            db,
            tenant_id=tenant_id,
            type="subscription_notice",
            title="Subscription Due",
            body=f"Your subscription is due on {sub.next_due_date.isoformat()}. Please submit your payment code.",
        )
        # After 3 notices on/after due date (delta_days <= 0), block
        if delta_days <= 0 and sub.notices_sent >= 3:
            sub.blocked = True
            db.add(sub)
            db.commit()
            notify_broadcast(
                db,
                tenant_id=tenant_id,
                type="subscription_blocked",
                title="Subscription Blocked",
                body="Access has been temporarily blocked due to non-payment. Submit code and await admin verification to restore access.",
            )


def verify_payment_and_unblock(db: Session, *, tenant_id: str, code: str) -> bool:
    # Mark payment submission verified (latest matching code)
    ps = (
        db.query(PaymentSubmission)
        .filter(PaymentSubmission.tenant_id == tenant_id, PaymentSubmission.code == code, PaymentSubmission.status == "pending")
        .order_by(PaymentSubmission.id.desc())
        .first()
    )
    if not ps:
        return False
    ps.status = "verified"
    ps.verified_at = datetime.utcnow()
    db.add(ps)
    # Unblock subscription and advance due date
    sub = ensure_subscription(db, tenant_id=tenant_id)
    sub.blocked = False
    sub.next_due_date = max(sub.next_due_date, date.today()) + timedelta(days=BILLING_CYCLE_DAYS)
    sub.notices_sent = 0
    sub.last_notice_date = None
    db.add(sub)
    db.commit()
    notify_broadcast(
        db,
        tenant_id=tenant_id,
        type="subscription_unblocked",
        title="Subscription Active",
        body=f"Payment verified. Next due date: {sub.next_due_date.isoformat()}.",
    )
    return True
