from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Iterable

from sqlalchemy.orm import Session

from app.models.integration import IntegrationConnection

logger = logging.getLogger("integrations.monitoring")


def _ensure_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def warn_expiring_tokens(
    db: Session,
    *,
    tenant_id: str,
    threshold_days: int = 7,
    now: datetime | None = None,
) -> list[IntegrationConnection]:
    """Log warnings for tokens expiring soon.

    Returns the list of connections that triggered warnings for optional caller processing.
    """

    now = _ensure_aware(now or datetime.now(timezone.utc))
    cutoff = now + timedelta(days=threshold_days)

    naive_cutoff = cutoff.replace(tzinfo=None)
    connections: Iterable[IntegrationConnection] = (
        db.query(IntegrationConnection)
        .filter(
            IntegrationConnection.tenant_id == tenant_id,
            IntegrationConnection.status == "connected",
            IntegrationConnection.token_expiry.isnot(None),
            IntegrationConnection.token_expiry <= naive_cutoff,
        )
        .all()
    )

    expiring_connections: list[IntegrationConnection] = []
    for connection in connections:
        expiry_raw = connection.token_expiry
        if not expiry_raw:
            continue
        expiry = _ensure_aware(expiry_raw)
        if expiry <= cutoff:
            expiring_connections.append(connection)
            logger.warning(
                json.dumps(
                    {
                        "event": "integration.token_expiry_warning",
                        "tenant_id": connection.tenant_id,
                        "connection_id": connection.id,
                        "provider_key": getattr(connection.provider, "key", None),
                        "provider_name": getattr(connection.provider, "name", None),
                        "expires_at": expiry.isoformat(),
                        "days_remaining": (expiry - now).days,
                    }
                )
            )
    return expiring_connections
