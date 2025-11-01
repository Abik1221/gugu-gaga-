from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=120)
    last_name: Optional[str] = Field(default=None, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=32)
    gender: Optional[str] = Field(default=None, max_length=32)
    date_of_birth: Optional[date] = None
    address: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = None
    meds_regimen: Optional[str] = None
    refill_frequency_days: Optional[int] = Field(default=None, ge=1)
    next_refill_date: Optional[date] = None
    last_refill_date: Optional[date] = None
    loyalty_tier: Optional[str] = Field(default=None, max_length=64)
    engagement_notes: Optional[str] = None
    branch_id: Optional[int] = None


class CustomerCreate(CustomerBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class CustomerUpdate(CustomerBase):
    is_active: Optional[bool] = None


class CustomerOut(BaseModel):
    id: int
    tenant_id: str
    branch_id: Optional[int] = None
    branch_name: Optional[str] = None
    created_by_user_id: Optional[int] = None

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    meds_regimen: Optional[str] = None
    refill_frequency_days: Optional[int] = None
    next_refill_date: Optional[date] = None
    last_refill_date: Optional[date] = None
    loyalty_tier: Optional[str] = None
    engagement_notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: list[CustomerOut]
