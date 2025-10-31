from __future__ import annotations

import json
import os
import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
from sqlalchemy.orm import Session

from app.models.integration import (
    IntegrationConnection,
    IntegrationProvider,
    IntegrationSyncJob,
    IntegrationStagingRecord,
)
from app.schemas.integrations import (
    CreateConnectionPayload,
    IntegrationCapabilityOut,
    IntegrationConnectionOut,
    IntegrationProviderOut,
    IntegrationSyncJobOut,
    IntegrationOAuthStartResponse,
)
from app.services.integrations.encryption import decrypt, encrypt
from app.services.integrations.connectors import get_connector, SyncContext
from app.services.integrations.manager import integration_manager
from app.services.integrations.registry import DEFAULT_REGISTRY, IntegrationDescriptor, OAuthConfig
from app.services.integrations.state import OAuthStateStore, get_oauth_state_store
from app.services.redis_client import get_redis
from app.core.settings import settings


class IntegrationServiceError(RuntimeError):
    pass


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class IntegrationService:
    def __init__(self, db: Session) -> None:
        self.db = db
        redis_client = get_redis()
        self.state_store: OAuthStateStore = get_oauth_state_store(
            redis_client, settings.integration_state_ttl_seconds
        )

    # Provider helpers -----------------------------------------------------------------

    def _ensure_provider(self, descriptor: IntegrationDescriptor) -> IntegrationProvider:
        provider = (
            self.db.query(IntegrationProvider).filter(IntegrationProvider.key == descriptor.key).first()
        )
        if provider:
            provider.name = descriptor.name
            provider.category = descriptor.category
            provider.updated_at = _utcnow()
            return provider

        provider = IntegrationProvider(key=descriptor.key, name=descriptor.name, category=descriptor.category)
        self.db.add(provider)
        self.db.flush()
        return provider

    def list_providers(self, *, allowed_keys: Optional[set[str]] = None) -> list[IntegrationProviderOut]:
        return integration_manager.list_providers(allowed_keys=allowed_keys)

    # Connection helpers ----------------------------------------------------------------

    def list_connections(self, tenant_id: str) -> list[IntegrationConnectionOut]:
        connections = (
            self.db.query(IntegrationConnection)
            .join(IntegrationProvider, IntegrationProvider.id == IntegrationConnection.provider_id)
            .filter(IntegrationConnection.tenant_id == tenant_id)
            .all()
        )
        results: list[IntegrationConnectionOut] = []
        for conn in connections:
            results.append(
                IntegrationConnectionOut(
                    id=conn.id,
                    tenant_id=conn.tenant_id,
                    provider_key=conn.provider.key,
                    provider_name=conn.provider.name,
                    display_name=conn.display_name,
                    status=conn.status,
                    created_at=conn.created_at,
                    updated_at=conn.updated_at,
                    last_synced_at=None,
                    resource_scope=None,
                )
            )
        return results

    def disconnect(self, tenant_id: str, connection_id: int) -> bool:
        connection = (
            self.db.query(IntegrationConnection)
            .filter(
                IntegrationConnection.id == connection_id,
                IntegrationConnection.tenant_id == tenant_id,
            )
            .first()
        )
        if not connection:
            return False
        self.db.delete(connection)
        return True

    # OAuth flow ------------------------------------------------------------------------

    def start_oauth(self, tenant_id: str, user_id: int, payload: CreateConnectionPayload) -> IntegrationOAuthStartResponse:
        descriptor = DEFAULT_REGISTRY.get(payload.provider_key)
        if not descriptor.oauth:
            raise IntegrationServiceError("Provider does not support OAuth")

        client_id, redirect_uri = self._get_oauth_credentials(descriptor.oauth)
        state_payload = {
            "tenant_id": tenant_id,
            "user_id": user_id,
            "provider_key": descriptor.key,
        }

        if descriptor.oauth.use_pkce:
            code_verifier = self._generate_code_verifier()
            code_challenge = self._compute_code_challenge(code_verifier)
            state_payload["code_verifier"] = code_verifier
        else:
            code_challenge = None

        if payload.resources:
            state_payload["resources"] = payload.resources

        state_token = self.state_store.create_state(state_payload)

        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": " ".join(descriptor.oauth.default_scopes),
            "state": state_token,
        }

        if code_challenge:
            params["code_challenge"] = code_challenge
            params["code_challenge_method"] = "S256"

        params.update(descriptor.oauth.extra_auth_params)

        url = httpx.URL(descriptor.oauth.authorize_url, params=params).human_repr()
        return IntegrationOAuthStartResponse(
            authorization_url=url,
            state=state_token,
            expires_in_seconds=settings.integration_state_ttl_seconds,
        )

    def complete_oauth(self, code: str, state: str, provider_key: Optional[str] = None) -> IntegrationConnectionOut:
        state_payload = self.state_store.consume_state(state)
        if not state_payload:
            raise IntegrationServiceError("Invalid or expired state token")

        descriptor = DEFAULT_REGISTRY.get(provider_key or state_payload.get("provider_key"))
        if not descriptor.oauth:
            raise IntegrationServiceError("Provider does not support OAuth")

        client_id, redirect_uri = self._get_oauth_credentials(descriptor.oauth)
        tenant_id = state_payload["tenant_id"]
        code_verifier = state_payload.get("code_verifier")

        token_response = self._exchange_token(
            descriptor.oauth,
            code=code,
            redirect_uri=redirect_uri,
            client_id=client_id,
            code_verifier=code_verifier,
        )

        provider = self._ensure_provider(descriptor)
        connection = IntegrationConnection(
            tenant_id=tenant_id,
            provider_id=provider.id,
            display_name=descriptor.name,
            status="connected",
            access_token=encrypt(token_response.access_token),
            refresh_token=encrypt(token_response.refresh_token) if token_response.refresh_token else None,
            token_expiry=token_response.expires_at,
            scopes=" ".join(token_response.scopes or []),
            extra_metadata=json.dumps(token_response.metadata or {}),
        )
        self.db.add(connection)
        self.db.flush()

        return IntegrationConnectionOut(
            id=connection.id,
            tenant_id=connection.tenant_id,
            provider_key=descriptor.key,
            provider_name=descriptor.name,
            display_name=connection.display_name,
            status=connection.status,
            created_at=connection.created_at,
            updated_at=connection.updated_at,
            last_synced_at=None,
            resource_scope=state_payload.get("resources"),
        )

    # Sync jobs ------------------------------------------------------------------------

    def enqueue_sync_job(self, tenant_id: str, connection_id: int, resource: str, direction: str) -> IntegrationSyncJobOut:
        connection = (
            self.db.query(IntegrationConnection)
            .filter(
                IntegrationConnection.id == connection_id,
                IntegrationConnection.tenant_id == tenant_id,
            )
            .first()
        )
        if not connection:
            raise IntegrationServiceError("Connection not found")

        job = IntegrationSyncJob(
            tenant_id=tenant_id,
            connection_id=connection.id,
            direction=direction,
            resource=resource,
            status="queued",
            created_at=_utcnow(),
        )
        self.db.add(job)
        self.db.flush()
        return IntegrationSyncJobOut(
            id=job.id,
            connection_id=connection.id,
            direction=job.direction,
            resource=job.resource,
            status=job.status,
            started_at=job.started_at,
            finished_at=job.finished_at,
            error_message=job.error_message,
        )

    def process_next_job(self) -> Optional[IntegrationSyncJobOut]:
        job = (
            self.db.query(IntegrationSyncJob)
            .filter(IntegrationSyncJob.status == "queued")
            .order_by(IntegrationSyncJob.created_at.asc())
            .first()
        )
        if not job:
            return None

        job.status = "in_progress"
        job.started_at = _utcnow()
        self.db.add(job)
        self.db.flush()

        connection = job.connection
        provider = connection.provider

        access_token = decrypt(connection.access_token)
        refresh_token = decrypt(connection.refresh_token)

        metadata = {}
        if connection.extra_metadata:
            try:
                metadata = json.loads(connection.extra_metadata)
            except json.JSONDecodeError:
                metadata = {}

        context = SyncContext(
            tenant_id=connection.tenant_id,
            connection_id=connection.id,
            job_id=job.id,
            provider_key=provider.key,
            provider_name=provider.name,
            resource=job.resource,
            direction=job.direction,
            access_token=access_token,
            refresh_token=refresh_token,
            metadata=metadata,
        )

        try:
            connector = get_connector(provider.key)
            result = connector.sync(context)

            if result.metadata_updates:
                merged = {**metadata, **result.metadata_updates}
                connection.extra_metadata = json.dumps(merged)

            if result.access_token:
                connection.access_token = encrypt(result.access_token)
            if result.refresh_token:
                connection.refresh_token = encrypt(result.refresh_token)
            if result.token_expiry:
                connection.token_expiry = result.token_expiry

            if result.staging_records:
                self._write_staging_records(connection, result.staging_records)

            job.status = "completed"
            job.finished_at = _utcnow()
        except NotImplementedError as exc:
            job.status = "unsupported"
            job.finished_at = _utcnow()
            job.error_message = str(exc)
        except Exception as exc:  # pragma: no cover - defensive
            job.status = "failed"
            job.finished_at = _utcnow()
            job.error_message = str(exc)
        finally:
            self.db.add(job)
            self.db.flush()

        return IntegrationSyncJobOut(
            id=job.id,
            connection_id=job.connection_id,
            direction=job.direction,
            resource=job.resource,
            status=job.status,
            started_at=job.started_at,
            finished_at=job.finished_at,
            error_message=job.error_message,
        )

    # Private helpers ------------------------------------------------------------------

    def _write_staging_records(self, connection: IntegrationConnection, records: list[dict]) -> None:
        for entry in records:
            resource = entry.get("resource") or "unknown"
            direction = entry.get("direction") or "incoming"
            payload = entry.get("payload") or {}
            staging = IntegrationStagingRecord(
                tenant_id=connection.tenant_id,
                connection_id=connection.id,
                resource=resource,
                direction=direction,
                payload=payload,
            )
            self.db.add(staging)
        self.db.flush()

    def _get_oauth_credentials(self, config: OAuthConfig) -> tuple[str, str]:
        if not config.env_prefix:
            raise IntegrationServiceError("Provider credentials are not configured")
        client_id = os.getenv(f"{config.env_prefix}_CLIENT_ID")
        client_secret = os.getenv(f"{config.env_prefix}_CLIENT_SECRET")
        redirect_uri = settings.integration_oauth_redirect_uri
        if not client_id or not client_secret:
            raise IntegrationServiceError("Provider client credentials missing in environment")
        if not redirect_uri:
            raise IntegrationServiceError("INTEGRATION_OAUTH_REDIRECT_URI is not configured")
        return client_id, redirect_uri

    def _exchange_token(
        self,
        config: OAuthConfig,
        *,
        code: str,
        redirect_uri: str,
        client_id: str,
        code_verifier: Optional[str],
    ) -> "TokenExchangeResult":
        client_secret = os.getenv(f"{config.env_prefix}_CLIENT_SECRET") if config.env_prefix else None
        auth = (client_id, client_secret) if config.use_basic_auth and client_secret else None

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
        }
        if not config.use_basic_auth:
            data["client_id"] = client_id
            if client_secret:
                data["client_secret"] = client_secret
        if code_verifier:
            data["code_verifier"] = code_verifier

        with httpx.Client(timeout=30) as client:
            response = client.post(config.token_url, data=data, auth=auth)
        if response.status_code >= 400:
            raise IntegrationServiceError(
                f"Token exchange failed ({response.status_code}): {response.text[:200]}"
            )
        token_payload = response.json()
        return TokenExchangeResult.from_token_response(token_payload)

    def _generate_code_verifier(self) -> str:
        alphabet = string.ascii_letters + string.digits + "-._~"
        return "".join(secrets.choice(alphabet) for _ in range(64))

    def _compute_code_challenge(self, verifier: str) -> str:
        import hashlib
        import base64

        digest = hashlib.sha256(verifier.encode("utf-8")).digest()
        return base64.urlsafe_b64encode(digest).rstrip(b"=").decode("utf-8")


class TokenExchangeResult:
    def __init__(
        self,
        access_token: str,
        refresh_token: Optional[str],
        expires_at: Optional[datetime],
        scopes: Optional[list[str]] = None,
        metadata: Optional[dict] = None,
    ) -> None:
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.expires_at = expires_at
        self.scopes = scopes
        self.metadata = metadata

    @classmethod
    def from_token_response(cls, data: dict) -> "TokenExchangeResult":
        access_token = data.get("access_token")
        if not access_token:
            raise IntegrationServiceError("Token response missing access_token")
        refresh_token = data.get("refresh_token")
        expires_in = data.get("expires_in")
        expires_at = (
            _utcnow() + timedelta(seconds=int(expires_in)) if expires_in else None
        )
        scope_raw = data.get("scope")
        scopes: Optional[list[str]] = None
        if scope_raw:
            if isinstance(scope_raw, str):
                scopes = scope_raw.split()
            elif isinstance(scope_raw, list):
                scopes = scope_raw
        metadata = {k: v for k, v in data.items() if k not in {"access_token", "refresh_token", "expires_in", "scope"}}
        return cls(access_token, refresh_token, expires_at, scopes, metadata)
