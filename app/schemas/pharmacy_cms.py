from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class DashboardResponse(BaseModel):
    tenant_id: str
    status: Optional[str] = Field(default=None, description="If owner pending approval, returns 'pending_approval'")
    message: Optional[str] = None


class MedicineItem(BaseModel):
    id: int
    name: str
    sku: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None


class MedicineListResponse(BaseModel):
    tenant_id: str
    page: int
    page_size: int
    total: int
    items: List[MedicineItem]


class CashierDashboardResponse(BaseModel):
    tenant_id: str
    total_sales: float


class CashierKpisResponse(BaseModel):
    tenant_id: str
    today_revenue: float
    items_sold: int
    items_per_hour: float
    discounts_sum: float
    tax_sum: float
    avg_ticket: float
    branch: Optional[str] = None


class TopSkuItem(BaseModel):
    name: str
    qty: int
    revenue: float


class TopSkusResponse(BaseModel):
    __root__: List[TopSkuItem]


class HourStat(BaseModel):
    hour: str
    avg_ticket: float
    revenue: float
    tx_count: int


class AvgBasketHourResponse(BaseModel):
    tenant_id: str
    branch: Optional[str] = None
    days: int
    hours: List[HourStat]


class BranchRevenueItem(BaseModel):
    branch: Optional[str]
    revenue: float


class BranchComparisonResponse(BaseModel):
    tenant_id: str
    days: int
    branches: List[BranchRevenueItem]


class RefundsResponse(BaseModel):
    tenant_id: str
    days: int
    branch: Optional[str] = None
    refunds_total: float


class PharmacyOut(BaseModel):
    id: int
    tenant_id: str
    name: str
    address: Optional[str] = None


class PharmaciesListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[PharmacyOut]
