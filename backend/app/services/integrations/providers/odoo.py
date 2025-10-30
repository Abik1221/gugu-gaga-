from __future__ import annotations

import itertools
import json
import time
from typing import Any, Dict, Iterable, Optional

import httpx

from app.services.integrations.connectors import IntegrationConnector, SyncContext, SyncResult, register_connector
from app.services.integrations.pipeline import IntegrationSyncPipeline, ResourceAdapter


class OdooError(Exception):
    """Raised when a call to the Odoo API fails."""


class OdooClient:
    def __init__(
        self,
        *,
        base_url: str,
        database: str,
        user_id: int,
        api_key: str,
    ) -> None:
        if not all((base_url, database, api_key)):
            raise OdooError("Odoo metadata must include base_url, database, and api_key")
        self.base_url = base_url.rstrip("/")
        self.database = database
        self.user_id = user_id
        self.api_key = api_key
        self._request_counter = itertools.count(1)

    def call(self, model: str, method: str, *args: Any, **kwargs: Any) -> Any:
        payload = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute_kw",
                "args": [
                    self.database,
                    self.user_id,
                    self.api_key,
                    model,
                    method,
                    list(args),
                    kwargs,
                ],
            },
            "id": next(self._request_counter),
        }
        url = f"{self.base_url}/jsonrpc"
        with httpx.Client(timeout=30) as client:
            response = client.post(url, json=payload)
        if response.status_code >= 400:
            raise OdooError(f"Odoo request failed ({response.status_code}): {response.text[:200]}")
        data = response.json()
        if "error" in data:
            raise OdooError(json.dumps(data["error"]))
        return data.get("result")

    def search_read(
        self,
        model: str,
        *,
        domain: Optional[list] = None,
        fields: Optional[list[str]] = None,
        limit: int = 200,
    ) -> Iterable[dict]:
        offset = 0
        domain = domain or []
        while True:
            result = self.call(
                model,
                "search_read",
                domain,
                {
                    "fields": fields or [],
                    "limit": limit,
                    "offset": offset,
                },
            )
            records = result or []
            for rec in records:
                yield rec
            if len(records) < limit:
                break
            offset += limit
            time.sleep(0.1)


class OdooInventoryAdapter(ResourceAdapter):
    resource = "inventory"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        qty_available = record.get("qty_available")
        try:
            qty_available = float(qty_available) if qty_available is not None else None
        except (TypeError, ValueError):
            qty_available = None
        payload = {
            "external_id": record.get("id"),
            "sku": record.get("default_code"),
            "name": record.get("display_name") or record.get("name"),
            "barcode": record.get("barcode"),
            "quantity_on_hand": qty_available,
            "uom": record.get("uom_id", [None, None])[1] if isinstance(record.get("uom_id"), (list, tuple)) else None,
            "list_price": record.get("list_price"),
            "standard_price": record.get("standard_price"),
            "active": record.get("active", True),
            "raw": {
                "categ_id": record.get("categ_id"),
                "type": record.get("type"),
                "tracking": record.get("tracking"),
                "company_id": record.get("company_id"),
            },
        }
        return payload


class OdooConnector(IntegrationConnector):
    def __init__(self) -> None:
        self.inventory_adapter = OdooInventoryAdapter()

    def sync(self, context: SyncContext) -> SyncResult:
        pipeline = IntegrationSyncPipeline(context)

        if context.direction != "incoming":
            pipeline.note("Outgoing sync not yet supported for Odoo")
            return pipeline.finalize()

        metadata = context.metadata or {}
        base_url = metadata.get("base_url")
        database = metadata.get("database")
        api_key = context.access_token or metadata.get("api_key")
        user_id = metadata.get("user_id")
        if not isinstance(user_id, int):
            raise OdooError("Odoo metadata must include integer user_id")

        client = OdooClient(base_url=base_url, database=database, user_id=user_id, api_key=api_key or "")

        if context.resource == "inventory":
            fields = [
                "id",
                "default_code",
                "display_name",
                "name",
                "barcode",
                "qty_available",
                "list_price",
                "standard_price",
                "uom_id",
                "categ_id",
                "type",
                "tracking",
                "company_id",
                "active",
            ]
            records = list(client.search_read("product.product", fields=fields, limit=200))
            pipeline.stage(self.inventory_adapter, records)
            pipeline.note(f"Fetched {len(records)} Odoo products")
        else:
            pipeline.note(f"Resource '{context.resource}' not yet implemented for Odoo")

        pipeline.update_metadata({"last_sync_at": metadata_timestamp()})
        return pipeline.finalize()


def metadata_timestamp() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).isoformat()


register_connector("odoo", OdooConnector())
