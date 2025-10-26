from pydantic import BaseModel
from typing import Optional


class KYCSubmitRequest(BaseModel):
    pharmacy_name: Optional[str] = None
    pharmacy_address: Optional[str] = None
    owner_phone: Optional[str] = None
    id_number: Optional[str] = None
    pharmacy_license_number: Optional[str] = None
    pharmacy_license_document_path: Optional[str] = None
    license_document_base64: Optional[str] = None
    license_document_name: Optional[str] = None
    license_document_mime: Optional[str] = None
    notes: Optional[str] = None


class KYCStatusResponse(BaseModel):
    id: int
    status: str
    pharmacy_name: Optional[str] = None
    pharmacy_address: Optional[str] = None
    owner_phone: Optional[str] = None
    id_number: Optional[str] = None
    pharmacy_license_number: Optional[str] = None
    notes: Optional[str] = None
    pharmacy_license_document_path: Optional[str] = None
    license_document_name: Optional[str] = None
    license_document_mime: Optional[str] = None


class KYCDecision(BaseModel):
    decision: str  # approved or rejected
    notes: Optional[str] = None
