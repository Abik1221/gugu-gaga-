from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class BranchOut(BaseModel):
    id: int
    pharmacy_id: int
    tenant_id: str
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None


class BranchListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: List[BranchOut]


class BranchCreate(BaseModel):
    pharmacy_id: int
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None


class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
