from __future__ import annotations

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import date


class IdResponse(BaseModel):
    id: int


class StatusResponse(BaseModel):
    status: str


class InventoryBulkResult(BaseModel):
    created: int
    updated: int
    errors: List[dict]
    dry_run: bool


class PackagingLevel(BaseModel):
    name: str
    quantity: int
    contains: int


class InventoryItemCreate(BaseModel):
    medicine_name: str
    quantity: int
    unit_type: str = "unit"
    sku: Optional[str] = None
    expiry_date: Optional[date] = None
    lot_number: Optional[str] = None
    sell_price: Optional[float] = None
    reorder_level: int = 0
    branch: Optional[str] = None


class InventoryItemPacketCreate(BaseModel):
    medicine_name: str
    packaging_levels: List[PackagingLevel]
    sku: Optional[str] = None
    expiry_date: Optional[date] = None
    lot_number: Optional[str] = None
    sell_price_per_unit: Optional[float] = None
    reorder_level: int = 0
    branch: Optional[str] = None


class InventoryItemBulkCreate(BaseModel):
    items: List[InventoryItemCreate]


class InventoryAdjustment(BaseModel):
    mode: str = Field(..., description="add, remove, or replace")
    quantity: int
    reason: str


class InventoryTransactionOut(BaseModel):
    id: int
    transaction_type: str
    quantity_change: int
    quantity_before: int
    quantity_after: int
    reason: Optional[str]
    created_by: int
    created_at: Any

    class Config:
        from_attributes = True


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
    unit_type: Optional[str] = "unit"
    packaging_data: Optional[Dict] = None
    price_per_unit: Optional[float] = None
    
    class Config:
        from_attributes = True


class InventoryListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[InventoryItemOut]
