from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Iterable, Optional

import httpx

from app.services.integrations.connectors import IntegrationConnector, SyncContext, SyncResult, register_connector
from app.services.integrations.pipeline import IntegrationSyncPipeline, ResourceAdapter

NOTION_API_BASE = "https://api.notion.com/v1"
DEFAULT_VERSION = "2022-06-28"


class NotionError(Exception):
    """Raised when a call to the Notion API fails."""


class NotionClient:
    def __init__(self, *, access_token: str, version: str | None = None) -> None:
        if not access_token:
            raise NotionError("Notion access token is required")
        self.access_token = access_token
        self.version = version or DEFAULT_VERSION

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Notion-Version": self.version,
            "Content-Type": "application/json",
        }

    def request(self, method: str, path: str, *, json_payload: Optional[dict] = None) -> dict:
        url = f"{NOTION_API_BASE.rstrip('/')}/{path.lstrip('/')}"
        with httpx.Client(timeout=30) as client:
            response = client.request(method, url, json=json_payload or {}, headers=self._headers())
        if response.status_code >= 400:
            raise NotionError(f"Notion request failed ({response.status_code}): {response.text[:200]}")
        return response.json()

    def query_database(self, database_id: str) -> Iterable[dict]:
        payload: dict[str, Any] = {"page_size": 100}
        while True:
            data = self.request("POST", f"/databases/{database_id}/query", json_payload=payload)
            results = data.get("results", [])
            for entry in results:
                yield entry
            if not data.get("has_more") or not data.get("next_cursor"):
                break
            payload["start_cursor"] = data.get("next_cursor")


def _resolve_property(properties: dict, name: str) -> Any:
    prop = properties.get(name)
    if not prop:
        return None
    prop_type = prop.get("type")
    if prop_type == "title":
        return " ".join(
            block.get("plain_text", "") for block in prop.get("title", []) if isinstance(block, dict)
        ).strip()
    if prop_type == "rich_text":
        return " ".join(
            block.get("plain_text", "") for block in prop.get("rich_text", []) if isinstance(block, dict)
        ).strip()
    if prop_type == "number":
        return prop.get("number")
    if prop_type == "select":
        option = prop.get("select")
        return option.get("name") if isinstance(option, dict) else None
    if prop_type == "multi_select":
        options = prop.get("multi_select") or []
        return [opt.get("name") for opt in options if isinstance(opt, dict)]
    if prop_type == "checkbox":
        return prop.get("checkbox")
    if prop_type == "date":
        date_obj = prop.get("date")
        return date_obj.get("start") if isinstance(date_obj, dict) else None
    if prop_type == "people":
        users = prop.get("people") or []
        return [user.get("name") for user in users if isinstance(user, dict)]
    if prop_type == "url":
        return prop.get("url")
    if prop_type == "relation":
        rel = prop.get("relation") or []
        return [item.get("id") for item in rel if isinstance(item, dict)]
    return None


def _get_mapped_property(properties: dict, mapping: dict | None, key: str) -> Any:
    if mapping and key in mapping:
        return _resolve_property(properties, mapping[key])
    return _resolve_property(properties, key)


class NotionInventoryAdapter(ResourceAdapter):
    resource = "inventory"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        properties = record.get("properties", {})
        mapping = context.metadata.get("inventory_properties", {}) if isinstance(context.metadata, dict) else {}
        quantity = _get_mapped_property(properties, mapping, "quantity")
        try:
            quantity = float(quantity) if quantity is not None else None
        except (TypeError, ValueError):
            quantity = None
        payload = {
            "external_id": record.get("id"),
            "name": _get_mapped_property(properties, mapping, "name"),
            "sku": _get_mapped_property(properties, mapping, "sku"),
            "description": _get_mapped_property(properties, mapping, "description"),
            "quantity_on_hand": quantity,
            "available_stock": quantity,
            "category": _get_mapped_property(properties, mapping, "category"),
            "unit_price": _get_mapped_property(properties, mapping, "unit_price"),
            "tags": _get_mapped_property(properties, mapping, "tags"),
            "raw": properties,
        }
        return payload


class NotionTaskAdapter(ResourceAdapter):
    resource = "tasks"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        properties = record.get("properties", {})
        mapping = context.metadata.get("task_properties", {}) if isinstance(context.metadata, dict) else {}
        payload = {
            "external_id": record.get("id"),
            "title": _get_mapped_property(properties, mapping, "title"),
            "status": _get_mapped_property(properties, mapping, "status"),
            "assignees": _get_mapped_property(properties, mapping, "assignees"),
            "due_date": _get_mapped_property(properties, mapping, "due_date"),
            "priority": _get_mapped_property(properties, mapping, "priority"),
            "raw": properties,
        }
        return payload


class NotionConnector(IntegrationConnector):
    def __init__(self) -> None:
        self.inventory_adapter = NotionInventoryAdapter()
        self.task_adapter = NotionTaskAdapter()

    def sync(self, context: SyncContext) -> SyncResult:
        pipeline = IntegrationSyncPipeline(context)

        if context.direction != "incoming":
            pipeline.note("Outgoing sync not yet supported for Notion")
            return pipeline.finalize()

        client = NotionClient(access_token=context.access_token or "")
        metadata = context.metadata or {}

        if context.resource == "inventory":
            database_id = metadata.get("inventory_database_id")
            if not database_id:
                raise NotionError("Notion metadata missing inventory_database_id")
            records = list(client.query_database(database_id))
            pipeline.stage(self.inventory_adapter, records)
            pipeline.note(f"Fetched {len(records)} Notion inventory records")
        elif context.resource == "tasks":
            database_id = metadata.get("tasks_database_id")
            if not database_id:
                raise NotionError("Notion metadata missing tasks_database_id")
            records = list(client.query_database(database_id))
            pipeline.stage(self.task_adapter, records)
            pipeline.note(f"Fetched {len(records)} Notion tasks")
        else:
            pipeline.note(f"Resource '{context.resource}' not yet implemented for Notion")

        pipeline.update_metadata({"last_sync_at": datetime.now(timezone.utc).isoformat()})
        return pipeline.finalize()


register_connector("notion", NotionConnector())
