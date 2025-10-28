from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class TenantActivityCreate(BaseModel):
    tenant_id: str
    actor_user_id: Optional[int]
    action: str
    message: str
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class TenantActivityOut(BaseModel):
    id: int
    tenant_id: str
    actor_user_id: Optional[int]
    action: str
    message: str
    target_type: Optional[str]
    target_id: Optional[str]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True
