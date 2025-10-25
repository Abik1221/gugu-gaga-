from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.deps.auth import get_current_user
from app.models.notification_pref import NotificationPreference

router = APIRouter(prefix="/notifications/preferences", tags=["notifications"])


@router.get("")
def list_prefs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    prefs = (
        db.query(NotificationPreference)
        .filter(NotificationPreference.user_id == current_user.id)
        .order_by(NotificationPreference.id.desc())
        .all()
    )
    return [
        {"id": p.id, "type": p.type, "email_enabled": p.email_enabled} for p in prefs
    ]


@router.post("")
def set_pref(
    type: str,
    email_enabled: bool = True,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    pref = (
        db.query(NotificationPreference)
        .filter(NotificationPreference.user_id == current_user.id, NotificationPreference.type == type)
        .first()
    )
    if pref is None:
        pref = NotificationPreference(user_id=current_user.id, type=type, email_enabled=email_enabled)
        db.add(pref)
    else:
        pref.email_enabled = email_enabled
        db.add(pref)
    db.commit()
    db.refresh(pref)
    return {"id": pref.id, "type": pref.type, "email_enabled": pref.email_enabled}
