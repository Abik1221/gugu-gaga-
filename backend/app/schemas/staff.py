from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic import field_validator
from app.core.roles import Role

class StaffCreate(BaseModel):
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: str = "cashier"  # cashier or staff
    assigned_branch_id: Optional[int] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        allowed = {Role.cashier.value, "staff"}
        if v not in allowed:
            raise ValueError("Invalid role for staff")
        return v


class StaffOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    phone: Optional[str] = None
    assigned_branch_id: Optional[int] = None
    assigned_branch_name: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True
