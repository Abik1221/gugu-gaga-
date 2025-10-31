from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Iterable, List, Optional

import httpx

from app.services.integrations.connectors import IntegrationConnector, SyncContext, SyncResult, register_connector
from app.services.integrations.pipeline import IntegrationSyncPipeline, ResourceAdapter

GOOGLE_SHEETS_API_BASE = "https://sheets.googleapis.com/v4"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


class GoogleSheetsError(Exception):
    """Raised when a Google Sheets call fails."""


class GoogleSheetsClient:
    def __init__(
        self,
        *,
        access_token: str,
        refresh_token: Optional[str],
        metadata: dict,
    ) -> None:
        if not access_token:
            raise GoogleSheetsError("Missing access token for Google Sheets connection")
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.metadata = metadata or {}
        self.token_expiry: Optional[datetime] = None

    def _auth_headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.access_token}"}

    def _request(self, method: str, path: str, *, params: Optional[dict] = None) -> dict:
        url = f"{GOOGLE_SHEETS_API_BASE.rstrip('/')}/{path.lstrip('/')}"
        with httpx.Client(timeout=30) as client:
            response = client.request(method, url, params=params, headers=self._auth_headers())
            if response.status_code == 401 and self.refresh_token:
                self._refresh_access_token()
                response = client.request(method, url, params=params, headers=self._auth_headers())
            if response.status_code >= 400:
                raise GoogleSheetsError(
                    f"Google Sheets request failed ({response.status_code}): {response.text[:200]}"
                )
            return response.json()

    def get_values(self, spreadsheet_id: str, range_name: str) -> List[List[Any]]:
        params = {
            "majorDimension": "ROWS",
            "valueRenderOption": "UNFORMATTED_VALUE",
        }
        path = f"spreadsheets/{spreadsheet_id}/values/{range_name}"
        payload = self._request("GET", path, params=params)
        return payload.get("values", [])

    def _refresh_access_token(self) -> None:
        if not self.refresh_token:
            raise GoogleSheetsError("Refresh token not available for Google Sheets connection")
        client_id = os.getenv("GOOGLE_SHEETS_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_SHEETS_CLIENT_SECRET")
        if not client_id or not client_secret:
            raise GoogleSheetsError("GOOGLE_SHEETS_CLIENT_ID/SECRET must be set to refresh tokens")
        data = {
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token,
            "client_id": client_id,
            "client_secret": client_secret,
        }
        token_url = self.metadata.get("token_url") or GOOGLE_TOKEN_URL
        with httpx.Client(timeout=30) as client:
            response = client.post(token_url, data=data)
        if response.status_code >= 400:
            raise GoogleSheetsError(
                f"Google Sheets token refresh failed ({response.status_code}): {response.text[:200]}"
            )
        payload = response.json()
        access_token = payload.get("access_token")
        if not access_token:
            raise GoogleSheetsError("Refresh response missing access_token")
        self.access_token = access_token
        self.refresh_token = payload.get("refresh_token", self.refresh_token)
        expires_in = payload.get("expires_in")
        if expires_in:
            self.token_expiry = datetime.now(timezone.utc) + timedelta(seconds=int(expires_in))


def _row_to_mapping(values: List[List[Any]], *, columns: Dict[str, str], use_header: bool) -> List[Dict[str, Any]]:
    if not values:
        return []
    headers: List[str]
    start_index = 0
    if use_header:
        headers = [str(h).strip() for h in values[0]]
        start_index = 1
    else:
        headers = [f"col_{idx}" for idx in range(len(values[0]))]

    index_map: Dict[str, int] = {}
    for field, header_name in columns.items():
        header_name = header_name.strip()
        try:
            index_map[field] = headers.index(header_name)
        except ValueError:
            # Column not found; leave unmapped
            continue

    records: List[Dict[str, Any]] = []
    for row in values[start_index:]:
        record: Dict[str, Any] = {}
        for field, idx in index_map.items():
            record[field] = row[idx] if idx < len(row) else None
        if record:
            records.append(record)
    return records


def _to_float(value: Any) -> Optional[float]:
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


class InventorySheetAdapter(ResourceAdapter):
    resource = "inventory"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        quantity = _to_float(record.get("quantity"))
        available = _to_float(record.get("available_stock")) or quantity
        payload = {
            "external_id": record.get("external_id") or record.get("sku"),
            "sku": record.get("sku"),
            "name": record.get("name"),
            "description": record.get("description"),
            "quantity_on_hand": quantity,
            "available_stock": available,
            "purchase_price": _to_float(record.get("purchase_price")),
            "sell_price": _to_float(record.get("sell_price")),
            "category": record.get("category"),
            "raw": record,
        }
        return payload


class SalesSheetAdapter(ResourceAdapter):
    resource = "sales"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        payload = {
            "external_id": record.get("sale_id") or record.get("invoice_number"),
            "invoice_number": record.get("invoice_number"),
            "date": record.get("date"),
            "customer": record.get("customer"),
            "total_amount": _to_float(record.get("total_amount")) or 0.0,
            "tax_amount": _to_float(record.get("tax_amount")) or 0.0,
            "raw": record,
        }
        return payload


class CustomerSheetAdapter(ResourceAdapter):
    resource = "customers"

    def transform(self, record: dict, context: SyncContext) -> Optional[dict]:
        payload = {
            "external_id": record.get("customer_id") or record.get("email"),
            "name": record.get("name"),
            "email": record.get("email"),
            "phone": record.get("phone"),
            "loyalty_tier": record.get("tier"),
            "raw": record,
        }
        return payload


class GoogleSheetsConnector(IntegrationConnector):
    def __init__(self) -> None:
        self.adapters: Dict[str, ResourceAdapter] = {
            "inventory": InventorySheetAdapter(),
            "sales": SalesSheetAdapter(),
            "customers": CustomerSheetAdapter(),
        }

    def _resource_config(self, context: SyncContext) -> Dict[str, Any]:
        metadata = context.metadata or {}
        sheets_cfg = metadata.get("sheets") or {}
        resource_cfg = sheets_cfg.get(context.resource)
        if not resource_cfg:
            raise GoogleSheetsError(f"No sheet mapping configured for resource '{context.resource}'")
        return resource_cfg

    def sync(self, context: SyncContext) -> SyncResult:
        pipeline = IntegrationSyncPipeline(context)

        if context.direction != "incoming":
            pipeline.note("Outgoing sync not yet supported for Google Sheets")
            return pipeline.finalize()

        config = self._resource_config(context)
        spreadsheet_id = config.get("spreadsheet_id")
        range_name = config.get("range")
        if not spreadsheet_id or not range_name:
            raise GoogleSheetsError("Google Sheets metadata must include spreadsheet_id and range")

        columns_map = config.get("columns") or {}
        use_header = bool(config.get("use_header_row", True))

        client = GoogleSheetsClient(
            access_token=context.access_token or "",
            refresh_token=context.refresh_token,
            metadata=context.metadata,
        )

        values = client.get_values(spreadsheet_id, range_name)
        records = _row_to_mapping(values, columns=columns_map, use_header=use_header)

        adapter = self.adapters.get(context.resource)
        if not adapter:
            pipeline.note(f"Resource '{context.resource}' not yet implemented for Google Sheets")
        else:
            pipeline.stage(adapter, records)
            pipeline.note(f"Fetched {len(records)} rows from Google Sheets {context.resource}")

        pipeline.update_metadata({
            "last_sync_at": datetime.now(timezone.utc).isoformat(),
            "spreadsheet_id": spreadsheet_id,
            "resource_range": range_name,
        })

        result = pipeline.finalize()
        result.access_token = client.access_token
        result.refresh_token = client.refresh_token
        result.token_expiry = client.token_expiry
        return result


register_connector("google_sheets", GoogleSheetsConnector())
