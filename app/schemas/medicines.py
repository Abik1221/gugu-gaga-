from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class MedicineCreated(BaseModel):
    id: int
    name: str
    sku: Optional[str] = None


class MedicineItem(BaseModel):
    id: int
    name: str
    sku: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None


class MedicinesListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[MedicineItem]


class BulkMedicinesResult(BaseModel):
    created: int
    skipped: list[dict]
    dry_run: bool


class DeletedResponse(BaseModel):
    status: str
