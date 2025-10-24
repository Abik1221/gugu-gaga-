from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class SaleLine(BaseModel):
    medicine_id: int
    medicine_name: str
    sku: Optional[str] = None
    quantity: int
    unit_price: float
    line_total: float


class TransactionItem(BaseModel):
    id: int
    branch: Optional[str] = None
    cashier_user_id: Optional[int] = None
    total_amount: float
    created_at: Optional[str] = None
    lines: List[SaleLine]


class TransactionsListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[TransactionItem]


class PosCreateResponse(BaseModel):
    id: int
    total: float
