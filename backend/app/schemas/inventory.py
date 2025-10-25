from __future__ import annotations

from typing import List, Optional, Any
from pydantic import BaseModel


class IdResponse(BaseModel):
    id: int


class StatusResponse(BaseModel):
    status: str


class InventoryBulkResult(BaseModel):
    created: int
    updated: int
    errors: List[dict]
    dry_run: bool


class InventoryItemOut(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    sku: Optional[str] = None
    branch: Optional[str] = None
    quantity: int
    pack_size: int
    packs: int
    singles: int
    reorder_level: int
    expiry_date: Optional[str] = None
    lot_number: Optional[str] = None
    sell_price: Optional[float] = None


class InventoryListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[InventoryItemOut]
