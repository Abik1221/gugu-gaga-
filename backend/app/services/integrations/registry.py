from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, Mapping, Optional, Sequence


@dataclass(frozen=True)
class OAuthConfig:
    authorize_url: str
    token_url: str
    default_scopes: Sequence[str]
    use_pkce: bool = True
    use_basic_auth: bool = False
    extra_auth_params: Mapping[str, str] = field(default_factory=dict)
    env_prefix: Optional[str] = None


@dataclass(frozen=True)
class IntegrationCapability:
    resources: Sequence[str]
    supports_webhooks: bool = False
    supports_delta_sync: bool = False


@dataclass(frozen=True)
class IntegrationDescriptor:
    key: str
    name: str
    category: str
    capability: IntegrationCapability
    oauth: Optional[OAuthConfig] = None


class IntegrationRegistry:
    def __init__(self, providers: Iterable[IntegrationDescriptor]):
        self._providers: Dict[str, IntegrationDescriptor] = {p.key: p for p in providers}

    def list(self) -> Mapping[str, IntegrationDescriptor]:
        return self._providers

    def get(self, key: str) -> IntegrationDescriptor:
        provider = self._providers.get(key)
        if not provider:
            raise KeyError(f"Unknown integration provider: {key}")
        return provider


DEFAULT_REGISTRY = IntegrationRegistry(
    [
        IntegrationDescriptor(
            key="google_sheets",
            name="Google Sheets",
            category="sheet",
            capability=IntegrationCapability(
                resources=("inventory", "sales", "customers"),
                supports_delta_sync=True,
            ),
            oauth=OAuthConfig(
                authorize_url="https://accounts.google.com/o/oauth2/v2/auth",
                token_url="https://oauth2.googleapis.com/token",
                default_scopes=(
                    "https://www.googleapis.com/auth/spreadsheets",
                    "https://www.googleapis.com/auth/drive.readonly",
                ),
                use_pkce=True,
                extra_auth_params={"access_type": "offline", "prompt": "consent"},
                env_prefix="GOOGLE_SHEETS",
            ),
        ),
        IntegrationDescriptor(
            key="airtable",
            name="Airtable",
            category="database",
            capability=IntegrationCapability(
                resources=("inventory", "sales", "suppliers"),
                supports_delta_sync=True,
            ),
            oauth=OAuthConfig(
                authorize_url="https://airtable.com/oauth2/v1/authorize",
                token_url="https://airtable.com/oauth2/v1/token",
                default_scopes=("data.records:read", "data.records:write"),
                use_pkce=False,
                env_prefix="AIRTABLE",
            ),
        ),
        IntegrationDescriptor(
            key="notion",
            name="Notion",
            category="docs",
            capability=IntegrationCapability(resources=("inventory", "tasks"), supports_delta_sync=False),
            oauth=OAuthConfig(
                authorize_url="https://api.notion.com/v1/oauth/authorize",
                token_url="https://api.notion.com/v1/oauth/token",
                default_scopes=("database.read", "database.write", "page.read", "page.write"),
                use_pkce=False,
                use_basic_auth=True,
                env_prefix="NOTION",
            ),
        ),
        IntegrationDescriptor(
            key="odoo",
            name="Odoo ERP",
            category="erp",
            capability=IntegrationCapability(
                resources=("inventory", "sales", "suppliers"),
                supports_webhooks=True,
                supports_delta_sync=True,
            ),
        ),
        IntegrationDescriptor(
            key="zoho_books",
            name="Zoho Books",
            category="erp",
            capability=IntegrationCapability(
                resources=("inventory", "sales", "customers"),
                supports_delta_sync=True,
            ),
            oauth=OAuthConfig(
                authorize_url="https://accounts.zoho.com/oauth/v2/auth",
                token_url="https://accounts.zoho.com/oauth/v2/token",
                default_scopes=("ZohoInventory.fullaccess.ALL",),
                use_pkce=False,
                env_prefix="ZOHO_BOOKS",
            ),
        ),
        IntegrationDescriptor(
            key="erpnext",
            name="ERPNext",
            category="erp",
            capability=IntegrationCapability(
                resources=("inventory", "sales", "suppliers"),
                supports_webhooks=True,
            ),
        ),
        IntegrationDescriptor(
            key="custom_rest",
            name="Custom REST",
            category="custom",
            capability=IntegrationCapability(
                resources=("inventory", "sales", "customers", "suppliers"),
                supports_delta_sync=False,
            ),
        ),
    ]
)
