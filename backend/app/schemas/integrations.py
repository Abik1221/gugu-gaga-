from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class IntegrationCapabilityOut(BaseModel):
    resources: list[str]
    supports_webhooks: bool = False
    supports_delta_sync: bool = False


class IntegrationProviderOut(BaseModel):
    key: str
    name: str
    category: str
    capability: IntegrationCapabilityOut
    requires_oauth: bool = False


class IntegrationConnectionOut(BaseModel):
    id: int
    tenant_id: str
    provider_key: str
    provider_name: str
    display_name: str
    status: str
    created_at: datetime
    updated_at: datetime
    last_synced_at: Optional[datetime] = Field(default=None)
    resource_scope: Optional[list[str]] = None


class IntegrationOAuthStartResponse(BaseModel):
    authorization_url: str
    state: str
    expires_in_seconds: int


class IntegrationDisconnectResponse(BaseModel):
    disconnected: bool = True


class IntegrationSyncJobOut(BaseModel):
    id: int
    connection_id: int
    direction: str
    resource: str
    status: str
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    error_message: Optional[str]


class CreateConnectionPayload(BaseModel):
    provider_key: str
    display_name: Optional[str] = None
    resources: Optional[list[str]] = None


class OAuthCallbackPayload(BaseModel):
    code: str
    state: str
    provider_key: Optional[str] = None
    redirect_uri: Optional[str] = None


class ManualTokenInput(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: Optional[int] = None
    scopes: Optional[list[str]] = None
    metadata: Optional[dict] = None


class IntegrationSyncRequest(BaseModel):
    resource: str
    direction: str = Field(pattern=r"^(incoming|outgoing)$", description="incoming=provider->local, outgoing=local->provider")
