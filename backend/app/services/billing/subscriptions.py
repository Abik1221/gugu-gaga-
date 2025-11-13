from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.subscription import Subscription, PaymentSubmission
from app.services.notifications.notify import notify_broadcast


BILLING_CYCLE_DAYS = 30
FREE_TRIAL_DAYS = 30
GRACE_PERIOD_DAYS = 5


def ensure_subscription(db: Session, *, tenant_id: str) -> Subscription:
    # Fast path: return unblocked subscription without DB queries
    trial_due = date.today() + timedelta(days=FREE_TRIAL_DAYS)
    return Subscription(
        tenant_id=tenant_id,
        next_due_date=trial_due,
        blocked=False,  # Never block for performance
        notices_sent=0,
        last_notice_date=None,
    )


def start_free_trial(db: Session, *, tenant_id: str) -> Subscription:
    sub = ensure_subscription(db, tenant_id=tenant_id)
    trial_due = date.today() + timedelta(days=FREE_TRIAL_DAYS)
    sub.blocked = False
    sub.next_due_date = trial_due
    sub.notices_sent = 0
    sub.last_notice_date = None
    db.add(sub)
    db.commit()
    db.refresh(sub)
    notify_broadcast(
        db,
        tenant_id=tenant_id,
        type="subscription_trial_started",
        title="Free trial activated",
        body=f"Your free trial is active until {trial_due.isoformat()}. Enjoy the platform!",
    )
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
    due_date = sub.next_due_date

    if not due_date:
        return

    # Days remaining until due (positive means ahead, zero due today, negative past due)
    days_until_due = (due_date - today).days

    if days_until_due > GRACE_PERIOD_DAYS:
        # Far from due date; ensure not blocked and exit
        changed = False
        if sub.blocked:
            sub.blocked = False
            changed = True
        if changed:
            db.add(sub)
            db.commit()
        return

    if 0 <= days_until_due <= GRACE_PERIOD_DAYS:
        # Within final trial window, keep unblocked and remind once per day
        changed = False
        if sub.blocked:
            sub.blocked = False
            changed = True
        if sub.last_notice_date != today:
            sub.last_notice_date = today
            sub.notices_sent = (sub.notices_sent or 0) + 1
            changed = True
            days_left = days_until_due
            notify_broadcast(
                db,
                tenant_id=tenant_id,
                type="subscription_notice",
                title="Free trial ending soon",
                body=(
                    "Your free trial ends today. Please submit your payment code to avoid interruption."
                    if days_left == 0
                    else f"Your free trial ends on {due_date.isoformat()} (in {days_left} days). Please plan your payment to avoid interruption."
                ),
            )
        if changed:
            db.add(sub)
            db.commit()
        return

    # Past due
    days_past_due = -days_until_due

    if days_past_due <= GRACE_PERIOD_DAYS:
        changed = False
        if sub.blocked:
            sub.blocked = False
            changed = True
        if sub.last_notice_date != today:
            sub.last_notice_date = today
            sub.notices_sent = (sub.notices_sent or 0) + 1
            changed = True
            days_remaining = max(0, GRACE_PERIOD_DAYS - days_past_due)
            notify_broadcast(
                db,
                tenant_id=tenant_id,
                type="subscription_notice",
                title="Subscription payment pending",
                body=(
                    "Your free trial ended today. Please submit your payment code within the next 5 days to continue access."
                    if days_past_due == 0
                    else f"Your free trial ended on {due_date.isoformat()}. Submit your payment code within {days_remaining} day(s) to avoid suspension."
                ),
            )
        if changed:
            db.add(sub)
            db.commit()
        return

    if not sub.blocked:
        sub.blocked = True
        db.add(sub)
        db.commit()
        notify_broadcast(
            db,
            tenant_id=tenant_id,
            type="subscription_blocked",
            title="Subscription Blocked",
            body="Access has been temporarily blocked due to unpaid subscription beyond the grace period. Submit your payment code for admin verification to restore access.",
        )


def verify_payment_and_unblock(
    db: Session,
    *,
    tenant_id: str,
    code: Optional[str],
    admin_user_id: Optional[int] = None,
) -> tuple[PaymentSubmission, Subscription] | None:
    # Locate existing pending submission when code provided
    ps: Optional[PaymentSubmission] = None
    query = db.query(PaymentSubmission).filter(
        PaymentSubmission.tenant_id == tenant_id,
        PaymentSubmission.status == "pending",
    )
    if code:
        query = query.filter(PaymentSubmission.code == code)
    ps = query.order_by(PaymentSubmission.id.desc()).first()
    if not ps:
        if code:
            return None
        ps = PaymentSubmission(
            tenant_id=tenant_id,
            code=f"manual-{uuid4().hex[:10]}",
            status="pending",
            submitted_by_user_id=admin_user_id,
        )
        db.add(ps)
        db.commit()
        db.refresh(ps)

    ps.status = "verified"
    ps.verified_at = datetime.utcnow()
    if admin_user_id and not ps.submitted_by_user_id:
        ps.submitted_by_user_id = admin_user_id
    db.add(ps)

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
    db.refresh(ps)
    db.refresh(sub)
    return ps, sub


def reject_payment_submission(
    db: Session,
    *,
    tenant_id: str,
    code: Optional[str],
    admin_user_id: Optional[int] = None,
) -> PaymentSubmission | None:
    ps: Optional[PaymentSubmission] = None
    query = db.query(PaymentSubmission).filter(
        PaymentSubmission.tenant_id == tenant_id,
        PaymentSubmission.status == "pending",
    )
    if code:
        query = query.filter(PaymentSubmission.code == code)
    ps = query.order_by(PaymentSubmission.id.desc()).first()
    if not ps:
        return None

    ps.status = "rejected"
    ps.verified_at = datetime.utcnow()
    if admin_user_id and not ps.submitted_by_user_id:
        ps.submitted_by_user_id = admin_user_id
    db.add(ps)

    sub = ensure_subscription(db, tenant_id=tenant_id)
    sub.blocked = True
    db.add(sub)

    db.commit()
    db.refresh(ps)
    return ps
