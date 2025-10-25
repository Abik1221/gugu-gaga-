from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.services.notifications.in_app import create_notification
from app.services.notifications.email import send_email
from app.models.notification_pref import NotificationPreference
from app.services.notifications.ws import ws_manager


def notify_user(
    db: Session,
    *,
    tenant_id: Optional[str],
    user_id: Optional[int],
    type: str,
    title: str,
    body: str,
    email: Optional[str] = None,
    send_email_also: bool = True,
) -> None:
    # Create in-app notification
    create_notification(db, tenant_id=tenant_id, user_id=user_id, type=type, title=title, body=body)
    # WS push to user channel
    try:
        import asyncio
        asyncio.create_task(ws_manager.send_user(tenant_id, user_id, {"type": type, "title": title, "body": body}))
    except Exception:
        pass
    # Send email copy (Upwork-like) if email provided and enabled
    if send_email_also and email:
        pref = None
        if user_id is not None:
            pref = (
                db.query(NotificationPreference)
                .filter(NotificationPreference.user_id == user_id, NotificationPreference.type == type)
                .first()
            )
        if pref is None or pref.email_enabled:
            send_email(email, title, body)


def notify_broadcast(
    db: Session,
    *,
    tenant_id: str,
    type: str,
    title: str,
    body: str,
) -> None:
    # System UI broadcast for tenant (no email fan-out by default)
    create_notification(db, tenant_id=tenant_id, user_id=None, type=type, title=title, body=body)
    # WS broadcast to tenant channel
    try:
        import asyncio
        asyncio.create_task(ws_manager.broadcast_tenant(tenant_id, {"type": type, "title": title, "body": body}))
    except Exception:
        pass
