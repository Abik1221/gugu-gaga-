from __future__ import annotations

import os
from datetime import datetime, timezone, timedelta
from typing import Dict, Iterable, List, Optional

import httpx

from app.core.settings import settings
from app.services.integrations.connectors import IntegrationConnector, SyncContext, SyncResult, register_connector
from app.services.integrations.pipeline import IntegrationSyncPipeline, ResourceAdapter

ZOHO_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token"
DEFAULT_API_BASE = "https://books.zoho.com/api/v3"


class ZohoBooksError(Exception):
    pass


class ZohoBooksClient:
    def __init__(
        self,
        *,
        access_token: str,
        refresh_token: str | None,
        metadata: dict,
    ) -> None:
        if not access_token:
            raise ZohoBooksError("Access token missing for Zoho Books connection")
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.metadata = metadata or {}
        self.api_base = self.metadata.get("api_base") or DEFAULT_API_BASE
        self.token_expiry: Optional[datetime] = None

    def _auth_header(self) -> Dict[str, str]:
        return {"Authorization": f"Zoho-oauthtoken {self.access_token}"}

    def request(self, method: str, path: str, *, params: Optional[dict] = None) -> dict:
        url = f"{self.api_base.rstrip('/')}/{path.lstrip('/')}"
        with httpx.Client(timeout=30) as client:
            response = client.request(method, url, params=params, headers=self._auth_header())
            if response.status_code == 401 and self.refresh_token:
                self._refresh_access_token()
                response = client.request(method, url, params=params, headers=self._auth_header())
            if response.status_code >= 400:
                raise ZohoBooksError(f"Zoho Books request failed ({response.status_code}): {response.text[:200]}")
            return response.json()

    def _refresh_access_token(self) -> None:
        client_id = os.getenv("ZOHO_BOOKS_CLIENT_ID")
        client_secret = os.getenv("ZOHO_BOOKS_CLIENT_SECRET")
        if not client_id or not client_secret:
            raise ZohoBooksError("ZOHO_BOOKS_CLIENT_ID/SECRET must be set for token refresh")
        data = {
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token,
            "client_id": client_id,
            "client_secret": client_secret,
        }
        with httpx.Client(timeout=30) as client:
            response = client.post(self.metadata.get("token_url", ZOHO_TOKEN_URL), data=data)
        if response.status_code >= 400:
            raise ZohoBooksError(
                f"Zoho Books token refresh failed ({response.status_code}): {response.text[:200]}"
            )
        payload = response.json()
        access_token = payload.get("access_token")
        if not access_token:
            raise ZohoBooksError("Zoho Books refresh response missing access_token")
        self.access_token = access_token
        self.refresh_token = payload.get("refresh_token", self.refresh_token)
        expires_in = payload.get("expires_in")
        if expires_in:
            self.token_expiry = datetime.now(timezone.utc) + timedelta(seconds=int(expires_in))

    def list_items(self, organization_id: str) -> Iterable[dict]:
        page = 1
        while True:
            params = {
                "organization_id": organization_id,
                "page": page,
                "per_page": 200,
            }
            data = self.request("GET", "/items", params=params)
            items = data.get("items", [])
            for item in items:
                yield item
            page_context = data.get("page_context", {})
            if not page_context.get("has_more_page"):
                break
            page += 1


class InventoryAdapter(ResourceAdapter):
    resource = "inventory"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        quantity = record.get("stock_on_hand")
        try:
            quantity = int(float(quantity)) if quantity is not None else None
        except (TypeError, ValueError):
            quantity = None
        payload = {
            "external_id": record.get("item_id"),
            "name": record.get("name"),
            "sku": record.get("sku") or record.get("item_code"),
            "description": record.get("description"),
            "quantity_on_hand": quantity,
            "available_stock": record.get("available_stock"),
            "purchase_price": record.get("purchase_rate"),
            "sell_price": record.get("rate"),
            "tax_percentage": record.get("tax_percentage"),
            "is_active": record.get("status") == "active",
            "raw": {k: record.get(k) for k in ("cf_vendor", "item_type", "created_time", "last_modified_time")},
        }
        return payload


class ZohoBooksConnector(IntegrationConnector):
    def __init__(self) -> None:
        self.inventory_adapter = InventoryAdapter()

    def sync(self, context: SyncContext) -> SyncResult:
        pipeline = IntegrationSyncPipeline(context)

        if context.direction != "incoming":
            pipeline.note("Outgoing sync not yet supported for Zoho Books")
            return pipeline.finalize()

        organization_id = context.metadata.get("organization_id")
        if not organization_id:
            raise ZohoBooksError("Zoho Books connection missing organization_id metadata")

        client = ZohoBooksClient(
            access_token=context.access_token or "",
            refresh_token=context.refresh_token,
            metadata=context.metadata,
        )

        if context.resource == "inventory":
            records = list(client.list_items(organization_id))
            pipeline.stage(self.inventory_adapter, records)
            pipeline.note(f"Fetched {len(records)} inventory items from Zoho Books")
        else:
            pipeline.note(f"Resource '{context.resource}' not yet implemented for Zoho Books")

        pipeline.update_metadata({
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
        })

        result = pipeline.finalize()
        result.access_token = client.access_token
        result.refresh_token = client.refresh_token
        result.token_expiry = client.token_expiry
        return result


register_connector("zoho_books", ZohoBooksConnector())
