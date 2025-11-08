from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import get_current_user, require_role
from app.models.user import User
from app.models.supplier import Supplier
from app.models.supplier_kyc import SupplierKYC, SupplierPaymentSubmission
from app.services.supplier import SupplierService

router = APIRouter(prefix="/supplier-onboarding", tags=["supplier_onboarding"])


class SupplierKYCSubmit(BaseModel):
    business_license_number: Optional[str] = None
    tax_certificate_number: Optional[str] = None
    documents_path: Optional[str] = None
    notes: Optional[str] = None


class SupplierPaymentSubmit(BaseModel):
    code: str
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class SupplierOnboardingStatus(BaseModel):
    step: str  # kyc_pending, payment_pending, completed
    kyc_status: Optional[str] = None
    payment_status: Optional[str] = None
    can_access_dashboard: bool = False


@router.get("/status", response_model=SupplierOnboardingStatus)
def get_onboarding_status(
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Get current onboarding status for supplier"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    # Check KYC status
    kyc = db.query(SupplierKYC).filter(SupplierKYC.supplier_id == supplier.id).first()
    kyc_status = kyc.status if kyc else None
    
    # Check payment status
    payment = db.query(SupplierPaymentSubmission).filter(
        SupplierPaymentSubmission.supplier_id == supplier.id,
        SupplierPaymentSubmission.status == "verified"
    ).first()
    payment_status = "verified" if payment else "pending"
    
    # Determine current step
    if not kyc or kyc_status == "pending":
        step = "kyc_pending"
    elif kyc_status == "rejected":
        step = "kyc_rejected"
    elif kyc_status == "approved" and payment_status != "verified":
        step = "payment_pending"
    else:
        step = "completed"
    
    can_access_dashboard = (
        supplier.is_verified and 
        current_user.is_approved and 
        payment_status == "verified"
    )
    
    return SupplierOnboardingStatus(
        step=step,
        kyc_status=kyc_status,
        payment_status=payment_status,
        can_access_dashboard=can_access_dashboard
    )


@router.post("/kyc/submit")
def submit_kyc(
    kyc_data: SupplierKYCSubmit,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Submit KYC application"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    # Check if KYC already exists
    existing_kyc = db.query(SupplierKYC).filter(SupplierKYC.supplier_id == supplier.id).first()
    if existing_kyc and existing_kyc.status == "approved":
        raise HTTPException(status_code=400, detail="KYC already approved")
    
    if existing_kyc:
        # Update existing KYC
        existing_kyc.business_license_number = kyc_data.business_license_number
        existing_kyc.tax_certificate_number = kyc_data.tax_certificate_number
        existing_kyc.documents_path = kyc_data.documents_path
        existing_kyc.notes = kyc_data.notes
        existing_kyc.status = "pending"
        existing_kyc.submitted_at = datetime.utcnow()
        db.add(existing_kyc)
    else:
        # Create new KYC
        kyc = SupplierKYC(
            supplier_id=supplier.id,
            business_license_number=kyc_data.business_license_number,
            tax_certificate_number=kyc_data.tax_certificate_number,
            documents_path=kyc_data.documents_path,
            notes=kyc_data.notes,
            status="pending"
        )
        db.add(kyc)
    
    db.commit()
    return {"message": "KYC application submitted successfully"}


@router.get("/kyc/status")
def get_kyc_status(
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Get KYC application status"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    kyc = db.query(SupplierKYC).filter(SupplierKYC.supplier_id == supplier.id).first()
    if not kyc:
        return {"status": "not_submitted"}
    
    return {
        "status": kyc.status,
        "submitted_at": kyc.submitted_at.isoformat(),
        "reviewed_at": kyc.reviewed_at.isoformat() if kyc.reviewed_at else None,
        "admin_notes": kyc.admin_notes
    }


@router.post("/payment/submit")
def submit_payment(
    payment_data: SupplierPaymentSubmit,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Submit payment code"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    # Check if KYC is approved
    kyc = db.query(SupplierKYC).filter(SupplierKYC.supplier_id == supplier.id).first()
    if not kyc or kyc.status != "approved":
        raise HTTPException(status_code=400, detail="KYC must be approved before submitting payment")
    
    # Check if payment already verified
    existing_payment = db.query(SupplierPaymentSubmission).filter(
        SupplierPaymentSubmission.supplier_id == supplier.id,
        SupplierPaymentSubmission.status == "verified"
    ).first()
    if existing_payment:
        raise HTTPException(status_code=400, detail="Payment already verified")
    
    # Create payment submission
    payment = SupplierPaymentSubmission(
        supplier_id=supplier.id,
        code=payment_data.code,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        notes=payment_data.notes,
        status="pending"
    )
    db.add(payment)
    db.commit()
    
    return {"message": "Payment code submitted successfully"}


@router.get("/payment/status")
def get_payment_status(
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Get payment submission status"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    payment = db.query(SupplierPaymentSubmission).filter(
        SupplierPaymentSubmission.supplier_id == supplier.id
    ).order_by(SupplierPaymentSubmission.id.desc()).first()
    
    if not payment:
        return {"status": "not_submitted"}
    
    return {
        "status": payment.status,
        "code": payment.code,
        "submitted_at": payment.submitted_at.isoformat(),
        "verified_at": payment.verified_at.isoformat() if payment.verified_at else None,
        "admin_notes": payment.admin_notes
    }