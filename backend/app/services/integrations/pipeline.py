from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Iterable, Optional

from .connectors import SyncContext, SyncResult


class ResourceAdapter(ABC):
    """Base class for mapping provider payloads into normalized records."""

    resource: Optional[str] = None

    @abstractmethod
    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        """Return a normalized payload or None to skip the record."""


class IntegrationSyncPipeline:
    """Utility to collect staging payloads and metadata updates for a sync job."""

    def __init__(self, context: SyncContext) -> None:
        self.context = context
        self._result = SyncResult()

    def stage(self, adapter: ResourceAdapter, records: Iterable[dict]) -> None:
        resource = adapter.resource or self.context.resource
        for record in records:
            payload = adapter.transform(record, self.context)
            if not payload:
                continue
            entry = {
                "resource": resource,
                "direction": self.context.direction,
                "payload": payload,
            }
            self._result.staging_records.append(entry)

    def note(self, message: str) -> None:
        if message:
            self._result.messages.append(message)

    def update_metadata(self, updates: dict) -> None:
        if not updates:
            return
        if self._result.metadata_updates:
            merged = {**self._result.metadata_updates, **updates}
            self._result.metadata_updates = merged
        else:
            self._result.metadata_updates = dict(updates)

    def finalize(self) -> SyncResult:
        return self._result
