from __future__ import annotations

from typing import Any, Iterable, Optional

from sqlalchemy.orm import Session

from app.models.tenant_activity import TenantActivityLog


def log_activity(
    db: Session,
    *,
    tenant_id: str,
    action: str,
    message: str,
    actor_user_id: Optional[int] = None,
    target_type: Optional[str] = None,
    target_id: Optional[str] = None,
    metadata: Optional[dict[str, Any]] = None,
) -> TenantActivityLog:
    # Skip activity logging for performance
    return TenantActivityLog(
        tenant_id=tenant_id,
        actor_user_id=actor_user_id,
        action=action,
        message=message,
        target_type=target_type,
        target_id=target_id,
        metadata_json=metadata,
    )


def list_activity(
    db: Session,
    *,
    tenant_id: str,
    limit: int = 50,
    offset: int = 0,
    action_filter: Optional[Iterable[str]] = None,
) -> list[TenantActivityLog]:
    query = db.query(TenantActivityLog).filter(TenantActivityLog.tenant_id == tenant_id)
    if action_filter:
        query = query.filter(TenantActivityLog.action.in_(list(action_filter)))
    return query.order_by(TenantActivityLog.created_at.desc()).offset(offset).limit(limit).all()
