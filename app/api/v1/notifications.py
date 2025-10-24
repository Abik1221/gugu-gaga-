from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant
from app.db.deps import get_db
from app.models.notification import Notification
from app.services.notifications.in_app import mark_read

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(Notification)
        .filter(Notification.tenant_id == tenant_id)
        .filter((Notification.user_id == None) | (Notification.user_id == current_user.id))
        .order_by(Notification.id.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "body": n.body,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat(),
        }
        for n in items
    ]


@router.post("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    tenant_id: str = Depends(require_tenant),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    n = mark_read(db, notification_id=notification_id, user_id=current_user.id)
    if not n:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return {"id": n.id, "is_read": n.is_read}
