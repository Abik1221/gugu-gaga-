from __future__ import annotations

from typing import Optional

from app.core.settings import settings
from app.models.integration import (
    IntegrationConnection,
    IntegrationProvider,
    IntegrationSyncJob,
)
from app.schemas.integrations import IntegrationCapabilityOut, IntegrationProviderOut
from app.services.integrations.encryption import decrypt
from app.services.integrations.registry import DEFAULT_REGISTRY, IntegrationRegistry


class IntegrationManager:
    """High level helper for listing providers and shaping responses."""

    def __init__(self, registry: IntegrationRegistry = DEFAULT_REGISTRY) -> None:
        self.registry = registry

    def list_providers(self, *, allowed_keys: Optional[set[str]] = None) -> list[IntegrationProviderOut]:
        providers: list[IntegrationProviderOut] = []
        for descriptor in self.registry.list().values():
            if allowed_keys is not None and descriptor.key not in allowed_keys:
                continue
            providers.append(
                IntegrationProviderOut(
                    key=descriptor.key,
                    name=descriptor.name,
                    category=descriptor.category,
                    capability=IntegrationCapabilityOut(
                        resources=list(descriptor.capability.resources),
                        supports_delta_sync=descriptor.capability.supports_delta_sync,
                        supports_webhooks=descriptor.capability.supports_webhooks,
                    ),
                    requires_oauth=descriptor.oauth is not None,
                )
            )
        return providers

    def resolve_provider(self, key: str) -> IntegrationProvider:
        descriptor = self.registry.get(key)
        return IntegrationProvider(key=descriptor.key, name=descriptor.name, category=descriptor.category)

    def get_connection_secret(self, connection: IntegrationConnection) -> Optional[str]:
        return decrypt(connection.access_token)


integration_manager = IntegrationManager()
