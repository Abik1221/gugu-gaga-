from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from pydantic import field_validator
from app.core.roles import Role


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
    kyc_notes: Optional[str] = Field(default=None, description="Additional notes for KYC reviewer")
    # Affiliate details
    affiliate_full_name: Optional[str] = Field(default=None, description="Affiliate full legal name for payouts")
    bank_name: Optional[str] = Field(default=None, description="Affiliate bank name")
    bank_account_name: Optional[str] = Field(default=None, description="Affiliate bank account holder name")
    bank_account_number: Optional[str] = Field(default=None, description="Affiliate bank account number")
    iban: Optional[str] = Field(default=None, description="Affiliate IBAN (if applicable)")

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        allowed = {r.value for r in Role}
        if v not in allowed:
            raise ValueError("Invalid role")
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

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
