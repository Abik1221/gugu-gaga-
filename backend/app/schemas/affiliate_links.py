from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class AffiliateLinkItem(BaseModel):
    token: str
    url: str
    active: bool


class AffiliateLinksResponse(BaseModel):
    max_links: int
    count: int
    links: List[AffiliateLinkItem]
    can_create_more: bool


class AffiliateLinkActionResponse(BaseModel):
    token: str
    status: str
    url: Optional[str] = None
