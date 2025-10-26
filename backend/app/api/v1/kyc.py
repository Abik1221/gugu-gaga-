import base64
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps.auth import get_current_user, require_role
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.core.roles import Role
from app.db.deps import get_db
from app.models.kyc import KYCApplication
from app.models.user import User
from app.schemas.kyc import KYCDecision, KYCStatusResponse, KYCSubmitRequest
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/kyc", tags=["admin"])


def _apply_payload_to_kyc(
    app: KYCApplication,
    payload: KYCSubmitRequest,
    *,
    require_document: bool,
):
    if payload.pharmacy_name is not None:
        app.pharmacy_name = payload.pharmacy_name.strip() or None
    if payload.pharmacy_address is not None:
        app.pharmacy_address = payload.pharmacy_address.strip() or None
    if payload.owner_phone is not None:
        app.owner_phone = payload.owner_phone.strip() or None
    if payload.id_number is not None:
        app.id_number = payload.id_number.strip() or None
    if payload.pharmacy_license_number is not None:
        app.pharmacy_license_number = payload.pharmacy_license_number.strip() or None
    if payload.notes is not None:
        app.notes = payload.notes.strip() or None

    if payload.license_document_base64:
        data_str = payload.license_document_base64.strip()
        mime = payload.license_document_mime
        name = payload.license_document_name
        if data_str.startswith("data:"):
            try:
                header, data_str = data_str.split(",", 1)
                if not mime:
                    parts = header.split(";", 1)[0]
                    if parts.startswith("data:"):
                        mime = parts[len("data:") :]
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid data URL format for license document",
                )
        try:
            decoded = base64.b64decode(data_str)
        except Exception as exc:  # pragma: no cover - defensive
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid license document encoding: {exc}",
            )
        if len(decoded) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="License document too large (max 10MB)",
            )
        app.license_document_data = decoded
        app.license_document_name = name or app.license_document_name or "license"
        app.license_document_mime = mime or app.license_document_mime or "application/octet-stream"
        app.documents_path = None
    elif payload.pharmacy_license_document_path:
        app.documents_path = payload.pharmacy_license_document_path
        if payload.license_document_name:
            app.license_document_name = payload.license_document_name
        if payload.license_document_mime:
            app.license_document_mime = payload.license_document_mime
        app.license_document_data = app.license_document_data

    if require_document and not (app.license_document_data or app.documents_path):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pharmacy license document is required",
        )


def _kyc_to_response(app: KYCApplication) -> KYCStatusResponse:
    return KYCStatusResponse(
        id=app.id,
        status=app.status,
        pharmacy_name=app.pharmacy_name,
        pharmacy_address=app.pharmacy_address,
        owner_phone=app.owner_phone,
        id_number=app.id_number,
        pharmacy_license_number=app.pharmacy_license_number,
        notes=app.notes,
        pharmacy_license_document_path=app.documents_path,
        license_document_name=app.license_document_name,
        license_document_mime=app.license_document_mime,
    )


@router.post("/submit", response_model=KYCStatusResponse)
def submit_kyc(
    payload: KYCSubmitRequest,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    _rl=Depends(rate_limit_user("kyc_submit_user")),
    _ten=Depends(enforce_user_tenant),
):
    existing = (
        db.query(KYCApplication)
        .filter(KYCApplication.tenant_id == tenant_id, KYCApplication.applicant_user_id == current_user.id)
        .order_by(KYCApplication.id.desc())
        .first()
    )
    if existing and existing.status == "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="KYC already pending")

    app = KYCApplication(
        tenant_id=tenant_id,
        applicant_user_id=current_user.id,
        status="pending",
        created_at=datetime.utcnow(),
    )
    db.add(app)
    _apply_payload_to_kyc(app, payload, require_document=True)
    db.commit()
    db.refresh(app)
    return _kyc_to_response(app)


@router.get("/status", response_model=KYCStatusResponse)
def kyc_status(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    _rl=Depends(rate_limit_user("kyc_status_user")),
    _ten=Depends(enforce_user_tenant),
):
    app = (
        db.query(KYCApplication)
        .filter(KYCApplication.tenant_id == tenant_id, KYCApplication.applicant_user_id == current_user.id)
        .order_by(KYCApplication.id.desc())
        .first()
    )
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No KYC submission found")
    return _kyc_to_response(app)


@router.put("/status", response_model=KYCStatusResponse)
def update_kyc(
    payload: KYCSubmitRequest,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    _rl=Depends(rate_limit_user("kyc_update_user")),
    _ten=Depends(enforce_user_tenant),
):
    app = (
        db.query(KYCApplication)
        .filter(KYCApplication.tenant_id == tenant_id, KYCApplication.applicant_user_id == current_user.id)
        .order_by(KYCApplication.id.desc())
        .first()
    )
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No KYC submission found")
    if app.status == "approved":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="KYC already approved")

    _apply_payload_to_kyc(app, payload, require_document=not (app.documents_path or app.license_document_data))
    app.status = "pending"
    app.decided_at = None
    app.created_at = app.created_at or datetime.utcnow()
    db.add(app)
    db.commit()
    db.refresh(app)
    return _kyc_to_response(app)
