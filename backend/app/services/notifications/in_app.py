from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    *,
    tenant_id: Optional[str],
    user_id: Optional[int],
    type: str,
    title: str,
    body: str,
) -> Notification:
    n = Notification(tenant_id=tenant_id, user_id=user_id, type=type, title=title, body=body)
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


def mark_read(db: Session, *, notification_id: int, user_id: Optional[int]) -> Optional[Notification]:
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        return None
    if user_id and n.user_id and n.user_id != user_id:
        return None
    n.is_read = True
    db.add(n)
    db.commit()
    db.refresh(n)
    return n
