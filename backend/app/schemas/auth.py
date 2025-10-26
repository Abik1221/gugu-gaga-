from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.roles import Role
from app.core.security import MAX_PASSWORD_BYTES


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: Optional[str] = None  # default handled server-side
    affiliate_code: Optional[str] = None
    # Pharmacy KYC fields
    id_number: Optional[str] = Field(default=None, description="Applicant national ID or company ID number (required for pharmacy_owner)")
    pharmacy_license_number: Optional[str] = Field(default=None, description="Official pharmacy license number (required for pharmacy_owner)")
    national_id_document_path: Optional[str] = Field(default=None, description="Path/URL to uploaded national ID document")
    pharmacy_license_document_path: Optional[str] = Field(default=None, description="Path/URL to uploaded pharmacy license document")
    license_document_name: Optional[str] = Field(default=None, description="Original filename for the pharmacy license document")
    license_document_mime: Optional[str] = Field(default=None, description="MIME type for the pharmacy license document")
    license_document_base64: Optional[str] = Field(default=None, description="Base64-encoded pharmacy license document contents")
    kyc_notes: Optional[str] = Field(default=None, description="Additional notes for KYC reviewer")
    affiliate_token: Optional[str] = Field(default=None, description="Referral link token if pharmacy arrived via affiliate link")
    # Affiliate details
    affiliate_full_name: Optional[str] = Field(default=None, description="Affiliate full legal name for payouts")
    bank_name: Optional[str] = Field(default=None, description="Affiliate bank name")
    bank_account_name: Optional[str] = Field(default=None, description="Affiliate bank account holder name")
    bank_account_number: Optional[str] = Field(default=None, description="Affiliate bank account number")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} characters long")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in {Role.admin.value, Role.customer.value, Role.affiliate.value, Role.pharmacy_owner.value, Role.cashier.value}:
            raise ValueError("Invalid role")
        return v


class PharmacyRegister(BaseModel):
    pharmacy_name: str = Field(..., description="Registered pharmacy name")
    address: Optional[str] = Field(default=None, description="Pharmacy address")
    owner_email: EmailStr
    owner_phone: Optional[str] = Field(default=None, description="Owner phone number")
    owner_password: str
    id_number: str = Field(..., description="Owner national/company ID number")
    pharmacy_license_number: str = Field(..., description="Official pharmacy license number")
    national_id_document_path: Optional[str] = Field(default=None, description="Path/URL to uploaded national ID document")
    pharmacy_license_document_path: Optional[str] = Field(default=None, description="Path/URL to uploaded pharmacy license document")
    license_document_name: Optional[str] = Field(default=None, description="Original filename for uploaded pharmacy license")
    license_document_mime: Optional[str] = Field(default=None, description="MIME type for uploaded pharmacy license")
    license_document_base64: Optional[str] = Field(default=None, description="Base64 encoded pharmacy license document")
    kyc_notes: Optional[str] = Field(default=None, description="Additional notes for KYC reviewer")
    affiliate_token: Optional[str] = Field(default=None, description="Affiliate referral token, if registration came via an affiliate link")


class AffiliateRegister(BaseModel):
    email: EmailStr
    password: str
    affiliate_full_name: Optional[str] = Field(default=None, description="Affiliate full legal name for payouts")
    bank_name: Optional[str] = Field(default=None, description="Affiliate bank name")
    bank_account_name: Optional[str] = Field(default=None, description="Affiliate bank account holder name")
    bank_account_number: Optional[str] = Field(default=None, description="Affiliate bank account number")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} characters long")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    phone: Optional[str] = None
    role: str
    tenant_id: Optional[str] = None
    is_active: bool
    is_approved: bool
    kyc_status: Optional[str] = None
    subscription_status: Optional[str] = None
    subscription_blocked: Optional[bool] = None
    subscription_next_due_date: Optional[str] = None
    latest_payment_status: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegistrationVerifyRequest(BaseModel):
    email: EmailStr
    code: str


class LoginVerifyRequest(BaseModel):
    email: EmailStr
    code: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    code: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        if len(v.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} characters long")
        return v
