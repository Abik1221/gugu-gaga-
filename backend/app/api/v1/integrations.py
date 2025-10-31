from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.deps.auth import require_role
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.core.roles import Role
from app.schemas.integrations import (
    CreateConnectionPayload,
    IntegrationConnectionOut,
    IntegrationDisconnectResponse,
    IntegrationOAuthStartResponse,
    IntegrationProviderOut,
    IntegrationSyncJobOut,
    IntegrationSyncRequest,
)
from app.services.integrations.service import IntegrationService, IntegrationServiceError
from app.models.subscription import Subscription

router = APIRouter()


def _service(db: Session) -> IntegrationService:
    return IntegrationService(db)


@router.get("/providers", response_model=list[IntegrationProviderOut])
def list_providers(
    _user=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.affiliate)),
    db: Session = Depends(get_db),
):
    tenant_ids: set[str] = set()
    if hasattr(_user, "tenant_id") and _user.tenant_id:
        tenant_ids.add(_user.tenant_id)
    if hasattr(_user, "tenants"):
        tenant_ids.update(getattr(_user, "tenants", []))

    allowed_keys = None
    if tenant_ids:
        # If any tenant has verified payment, unlock full catalog
        has_paid = (
            db.query(Subscription)
            .filter(Subscription.tenant_id.in_(list(tenant_ids)))
            .filter(Subscription.blocked == False)
            .filter(Subscription.next_due_date >= date.today())
            .limit(1)
            .count()
        )
        if has_paid == 0:
            allowed_keys = {"google_sheets"}

    service = _service(db)
    return service.list_providers(allowed_keys=allowed_keys)


@router.get("/connections", response_model=list[IntegrationConnectionOut])
def list_connections(
    tenant_id: str = Depends(require_tenant),
    _user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    _tenant=Depends(enforce_user_tenant),
    db: Session = Depends(get_db),
):
    service = _service(db)
    return service.list_connections(tenant_id)


@router.post("/oauth/start", response_model=IntegrationOAuthStartResponse)
def start_oauth_connection(
    payload: CreateConnectionPayload,
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    _tenant=Depends(enforce_user_tenant),
    db: Session = Depends(get_db),
):
    service = _service(db)
    try:
        return service.start_oauth(tenant_id=tenant_id, user_id=user.id, payload=payload)
    except IntegrationServiceError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/oauth/callback", response_model=IntegrationConnectionOut)
def complete_oauth_connection(
    code: str,
    state: str,
    provider_key: str | None = None,
    db: Session = Depends(get_db),
):
    service = _service(db)
    try:
        connection = service.complete_oauth(code=code, state=state, provider_key=provider_key)
        db.commit()
        return connection
    except IntegrationServiceError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/connections/{connection_id}", response_model=IntegrationDisconnectResponse)
def disconnect_integration(
    connection_id: int,
    tenant_id: str = Depends(require_tenant),
    _user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    _tenant=Depends(enforce_user_tenant),
    db: Session = Depends(get_db),
):
    service = _service(db)
    removed = service.disconnect(tenant_id=tenant_id, connection_id=connection_id)
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Connection not found")
    db.commit()
    return IntegrationDisconnectResponse(disconnected=True)


@router.post("/connections/{connection_id}/sync", response_model=IntegrationSyncJobOut)
def trigger_sync(
    connection_id: int,
    payload: IntegrationSyncRequest,
    tenant_id: str = Depends(require_tenant),
    _user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    _tenant=Depends(enforce_user_tenant),
    db: Session = Depends(get_db),
):
    service = _service(db)
    try:
        job = service.enqueue_sync_job(
            tenant_id=tenant_id,
            connection_id=connection_id,
            resource=payload.resource,
            direction=payload.direction,
        )
        db.commit()
        return job
    except IntegrationServiceError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
