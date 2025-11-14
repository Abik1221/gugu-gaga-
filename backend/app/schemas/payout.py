from pydantic import BaseModel, Field
from typing import Optional


class PayoutRequest(BaseModel):
    month: Optional[str] = Field(default=None, description="Month in YYYY-MM format")
    percent: float = Field(default=5.0, description="Commission percentage")
    bank_name: str = Field(..., description="Bank name for payout")
    bank_account_name: str = Field(..., description="Bank account holder name")
    bank_account_number: str = Field(..., description="Bank account number")


class PayoutResponse(BaseModel):
    id: int
    month: str
    amount: float
    percent: float
    status: str