from __future__ import annotations

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class PharmacyKYCInfo(BaseModel):
    application_id: Optional[int] = None
    status: Optional[str] = None
    applicant_user_id: Optional[int] = None
    id_number: Optional[str] = None
    pharmacy_license_number: Optional[str] = None
    license_document_name: Optional[str] = None
    license_document_mime: Optional[str] = None
    license_document_available: bool = False
    notes: Optional[str] = None
    submitted_at: Optional[str] = None
    pharmacy_name: Optional[str] = None
    pharmacy_address: Optional[str] = None
    owner_email: Optional[str] = None
    owner_phone: Optional[str] = None


class PharmacyAdminItem(BaseModel):
    id: int
    tenant_id: str
    name: str
    address: Optional[str] = None
    owner_email: Optional[EmailStr] = None
    owner_phone: Optional[str] = None
    owner_approved: Optional[bool] = None
    kyc_id: Optional[int] = None
    kyc_status: Optional[str] = None
    subscription: Optional[dict] = None
    created_at: Optional[str] = None
    latest_payment_code: Optional[str] = None
    latest_payment_status: Optional[str] = None
    latest_payment_submitted_at: Optional[str] = None
    latest_payment_verified_at: Optional[str] = None
    pending_payment_code: Optional[str] = None
    pending_payment_submitted_at: Optional[str] = None
    status_category: str
    status_label: str
    status_priority: int
    pending_payment: Optional[Dict[str, Any]] = None
    latest_payment: Optional[Dict[str, Any]] = None
    kyc: Optional[PharmacyKYCInfo] = None
    owner_password_hash: Optional[str] = None


class PharmaciesAdminListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[PharmacyAdminItem]


class AffiliateAdminItem(BaseModel):
    user_id: int
    email: EmailStr
    full_name: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    referrals: int
    payouts: dict


class AffiliatesAdminListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[AffiliateAdminItem]


class AnalyticsTotals(BaseModel):
    total_pharmacies: int
    active_pharmacies: int
    pending_kyc: int
    blocked_pharmacies: int
    total_branches: int
    pharmacy_owners: int


class AnalyticsPharmacyUsage(BaseModel):
    tenant_id: str
    name: Optional[str] = None
    branch_count: int
    ai_tokens_30d: int
    status: Optional[str] = None


class AnalyticsBranchRow(BaseModel):
    tenant_id: str
    name: Optional[str] = None
    branch_count: int


class AnalyticsOverviewResponse(BaseModel):
    totals: AnalyticsTotals
    ai_usage_daily: List[Dict[str, Any]]
    top_pharmacies: List[AnalyticsPharmacyUsage]
    branch_distribution: List[AnalyticsBranchRow]
