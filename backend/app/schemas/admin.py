from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "admin"
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    tenant_id: Optional[str] = None

class AdminUserOut(BaseModel):
    id: int
    email: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    is_approved: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Pharmacy Management Schemas
class PharmacySummaryTotals(BaseModel):
    total: int
    paid: int
    free_trial: int
    payment_pending: int
    blocked: int
    onboarding: int
    unpaid: int

class PharmacySummaryItem(BaseModel):
    tenant_id: str
    name: Optional[str]
    status: str
    status_label: str
    branch_count: int
    user_count: int
    trial_ends_at: Optional[str]
    last_payment_verified_at: Optional[str]
    pending_payment_submitted_at: Optional[str]

class PharmacySummaryResponse(BaseModel):
    totals: PharmacySummaryTotals
    items: List[PharmacySummaryItem]

class PharmaciesAdminListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[dict]

class AffiliatesAdminListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[dict]

# Analytics Schemas
class AnalyticsTotals(BaseModel):
    total_pharmacies: int
    active_pharmacies: int
    pending_kyc: int
    blocked_pharmacies: int
    total_branches: int
    pharmacy_owners: int

class AnalyticsPharmacyUsage(BaseModel):
    tenant_id: str
    name: Optional[str]
    branch_count: int
    ai_tokens_30d: int
    status: Optional[str]

class AnalyticsBranchRow(BaseModel):
    tenant_id: str
    name: Optional[str]
    branch_count: int

class AnalyticsOverviewResponse(BaseModel):
    totals: AnalyticsTotals
    ai_usage_daily: List[dict]
    top_pharmacies: List[AnalyticsPharmacyUsage]
    branch_distribution: List[AnalyticsBranchRow]

class IntegrationUsageItem(BaseModel):
    tenant_id: str
    name: Optional[str]
    connection_count: int
    sync_count: int
    last_sync: Optional[str]

class IntegrationUsageResponse(BaseModel):
    items: List[IntegrationUsageItem]