from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class OwnerAnalyticsTotals(BaseModel):
    total_revenue: float
    average_ticket: float
    units_sold: int
    sale_count: int
    active_cashiers: int
    total_customers: int
    active_customers: int
    upcoming_refills: int


class OwnerAnalyticsDeltas(BaseModel):
    revenue_vs_last_period: float
    avg_ticket_vs_last_period: float
    units_vs_last_period: float


class OwnerRevenuePoint(BaseModel):
    period: str
    revenue: float


class OwnerTopProduct(BaseModel):
    name: str
    revenue: float
    quantity: int


class OwnerInventorySlice(BaseModel):
    label: str
    count: int


class OwnerPaymentEntry(BaseModel):
    id: int
    status: str
    status_label: str
    code: Optional[str]
    created_at: datetime
    created_at_formatted: str


class BranchComparisonItem(BaseModel):
    branch: str | None
    revenue: float
    sale_count: int
    units_sold: int


class StaffProductivityItem(BaseModel):
    user_id: int
    name: str
    email: Optional[str]
    role: str
    total_sales: float
    transactions: int
    units_sold: int


class StaffActivityItem(BaseModel):
    id: int
    action: str
    actor_user_id: Optional[int]
    actor_name: Optional[str]
    actor_role: Optional[str]
    target_type: Optional[str]
    target_id: Optional[str]
    metadata: Optional[dict]
    created_at: datetime


class OwnerAnalyticsResponse(BaseModel):
    horizon: str
    totals: OwnerAnalyticsTotals
    deltas: OwnerAnalyticsDeltas
    revenue_trend: List[OwnerRevenuePoint]
    top_products: List[OwnerTopProduct]
    inventory_health: List[OwnerInventorySlice]
    recent_payments: List[OwnerPaymentEntry]
    branch_comparison: List[BranchComparisonItem]
    staff_productivity: List[StaffProductivityItem]
    staff_activity: List[StaffActivityItem]
