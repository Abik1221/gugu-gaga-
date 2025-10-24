from __future__ import annotations

from typing import Optional, Dict, Any

from sqlalchemy.orm import Session

from app.models.audit import AuditLog


def log_event(
    db: Session,
    *,
    tenant_id: Optional[str],
    actor_user_id: Optional[int],
    action: str,
    target_type: Optional[str] = None,
    target_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> AuditLog:
    entry = AuditLog(
        tenant_id=tenant_id,
        actor_user_id=actor_user_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        metadata=metadata or {},
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
