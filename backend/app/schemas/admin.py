from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, EmailStr


class PharmacyAdminItem(BaseModel):
    id: int
    tenant_id: str
    name: str
    address: Optional[str] = None
    owner_email: Optional[EmailStr] = None
    owner_phone: Optional[str] = None
    owner_approved: Optional[bool] = None
    kyc_status: Optional[str] = None
    subscription: Optional[dict] = None
    created_at: Optional[str] = None
    latest_payment_code: Optional[str] = None
    latest_payment_status: Optional[str] = None
    latest_payment_submitted_at: Optional[str] = None


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
