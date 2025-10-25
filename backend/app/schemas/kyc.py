from pydantic import BaseModel
from typing import Optional


class KYCSubmitRequest(BaseModel):
    documents_path: Optional[str] = None
    notes: Optional[str] = None


class KYCStatusResponse(BaseModel):
    id: int
    status: str
    notes: Optional[str] = None
    documents_path: Optional[str] = None


class KYCDecision(BaseModel):
    decision: str  # approved or rejected
    notes: Optional[str] = None
