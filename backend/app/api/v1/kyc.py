from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps.auth import get_current_user, require_role
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.core.roles import Role
from app.db.deps import get_db
from app.models.kyc import KYCApplication
from app.models.user import User
from app.schemas.kyc import KYCDecision, KYCStatusResponse, KYCSubmitRequest
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/kyc", tags=["admin"])


@router.post("/submit", response_model=KYCStatusResponse)
def submit_kyc(
    payload: KYCSubmitRequest,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    _rl=Depends(rate_limit_user("kyc_submit_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
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
        documents_path=payload.documents_path,
        notes=payload.notes,
        status="pending",
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return KYCStatusResponse(id=app.id, status=app.status, notes=app.notes, documents_path=app.documents_path)


@router.get("/status", response_model=KYCStatusResponse)
def kyc_status(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    _rl=Depends(rate_limit_user("kyc_status_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    app = (
        db.query(KYCApplication)
        .filter(KYCApplication.tenant_id == tenant_id, KYCApplication.applicant_user_id == current_user.id)
        .order_by(KYCApplication.id.desc())
        .first()
    )
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No KYC submission found")
    return KYCStatusResponse(id=app.id, status=app.status, notes=app.notes, documents_path=app.documents_path)
