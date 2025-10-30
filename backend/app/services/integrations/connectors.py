from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Protocol

logger = logging.getLogger(__name__)


@dataclass
class SyncContext:
    tenant_id: str
    connection_id: int
    job_id: int
    provider_key: str
    provider_name: str
    resource: str
    direction: str
    access_token: str | None
    refresh_token: str | None
    metadata: dict


@dataclass
class SyncResult:
    staging_records: List[dict] = field(default_factory=list)
    messages: List[str] = field(default_factory=list)
    metadata_updates: Optional[dict] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expiry: Optional[datetime] = None


class IntegrationConnector(Protocol):
    """Interface for integration connectors to implement sync logic."""

    def sync(self, context: SyncContext) -> SyncResult:
        ...


class NotImplementedConnector:
    """Fallback connector that marks the job as unsupported."""

    def __init__(self, provider_name: str) -> None:
        self.provider_name = provider_name

    def sync(self, context: SyncContext) -> SyncResult:  # pragma: no cover - trivial logging
        logger.warning(
            "Connector for provider %s (%s) is not implemented",
            context.provider_key,
            self.provider_name,
        )
        raise NotImplementedError(
            "Sync connector has not been implemented for this provider."
        )


_CONNECTORS: Dict[str, IntegrationConnector] = {
    "google_sheets": NotImplementedConnector("Google Sheets"),
    "airtable": NotImplementedConnector("Airtable"),
    "notion": NotImplementedConnector("Notion"),
    "odoo": NotImplementedConnector("Odoo ERP"),
    "zoho_books": NotImplementedConnector("Zoho Books"),
    "erpnext": NotImplementedConnector("ERPNext"),
    "custom_rest": NotImplementedConnector("Custom REST"),
}


def get_connector(provider_key: str) -> IntegrationConnector:
    connector = _CONNECTORS.get(provider_key)
    if not connector:
        raise KeyError(f"No connector registered for provider '{provider_key}'")
    return connector


def register_connector(provider_key: str, connector: IntegrationConnector) -> None:
    _CONNECTORS[provider_key] = connector


__all__ = [
    "IntegrationConnector",
    "SyncContext",
    "get_connector",
    "register_connector",
]
