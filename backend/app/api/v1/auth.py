from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.core.security import create_access_token, hash_password, verify_password
from app.db.deps import get_db
from app.deps.tenant import get_optional_tenant_id
from app.models.user import User
from app.models.affiliate import AffiliateProfile, AffiliateReferral
from app.models.kyc import KYCApplication
from app.models.user_tenant import UserTenant
from app.services.verification import issue_code, verify_code
from app.services.notifications.email import send_email
from app.schemas.auth import Token, UserLogin, UserOut, PharmacyRegister, AffiliateRegister, RegistrationVerifyRequest, LoginVerifyRequest
from app.deps.auth import get_current_user
from app.deps.ratelimit import rate_limit
from app.services.billing.subscriptions import ensure_subscription


router = APIRouter(prefix="/auth", tags=["auth"])


def _make_tenant_id_from_name(name: str, existing: list[str]) -> str:
    import re

    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    if not base:
        base = "tenant"
    candidate = base
    i = 1
    while candidate in existing:
        i += 1
        candidate = f"{base}-{i}"
    return candidate


@router.post("/register/pharmacy", response_model=UserOut)
def register_pharmacy(payload: PharmacyRegister, db: Session = Depends(get_db)):
    # Ensure owner email unused
    if db.query(User).filter(User.email == payload.owner_email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Owner email already registered")
    # Generate unique tenant_id
    existing_tenants = [t[0] for t in db.query(User.tenant_id).filter(User.tenant_id.isnot(None)).distinct().all()]
    tenant_id = _make_tenant_id_from_name(payload.pharmacy_name, existing_tenants)
    # Create Pharmacy record
    from app.models.pharmacy import Pharmacy
    ph = Pharmacy(tenant_id=tenant_id, name=payload.pharmacy_name.strip(), address=payload.address)
    db.add(ph)
    db.commit()
    db.refresh(ph)
    # Create owner user pending approval
    try:
        owner_password_hash = hash_password(payload.owner_password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    owner = User(
        email=payload.owner_email,
        phone=payload.owner_phone,
        role=Role.pharmacy_owner.value,
        tenant_id=tenant_id,
        password_hash=owner_password_hash,
        is_active=True,
        is_approved=False,
    )
    db.add(owner)
    db.commit()
    db.refresh(owner)
    db.add(UserTenant(user_id=owner.id, tenant_id=tenant_id))
    db.commit()
    # Create KYC application
    app = KYCApplication(
        tenant_id=tenant_id,
        applicant_user_id=owner.id,
        id_number=payload.id_number,
        pharmacy_license_number=payload.pharmacy_license_number,
        documents_path=payload.pharmacy_license_document_path or payload.national_id_document_path,
        notes=payload.kyc_notes,
        status="pending",
    )
    db.add(app)
    db.commit()
    # If arrived via affiliate link token, create referral
    if payload.affiliate_token:
        from app.models.affiliate import AffiliateLink, AffiliateReferral
        link = (
            db.query(AffiliateLink)
            .filter(AffiliateLink.token == payload.affiliate_token, AffiliateLink.active == True)
            .first()
        )
        if link:
            ref = AffiliateReferral(
                affiliate_user_id=link.affiliate_user_id,
                referred_tenant_id=tenant_id,
                code=payload.affiliate_token,
            )
            db.add(ref)
            db.commit()
    # In-app notifications (best-effort)
    try:
        from app.services.notifications.in_app import create_notification
        create_notification(
            db,
            tenant_id=None,
            title="New Pharmacy Registration",
            body=f"Pharmacy '{payload.pharmacy_name}' submitted KYC and awaits approval.",
        )
        create_notification(
            db,
            tenant_id=tenant_id,
            title="Application Received",
            body="Your pharmacy registration is pending admin approval.",
        )
    except Exception:
        pass
    # Notify admin via email (best-effort) with KYC details
    try:
        send_email(
            "admin@zemen.local",
            "New Pharmacy Registration",
            f"Pharmacy '{payload.pharmacy_name}' awaiting approval. License: {payload.pharmacy_license_number}; ID: {payload.id_number}",
        )
    except Exception:
        pass
    # Send verification code to owner (best-effort)
    try:
        code = issue_code(db, email=owner.email, purpose="register")
        if owner.email:
            send_email(owner.email, "Verify your account", f"Your verification code is: {code}")
    except Exception:
        pass
    return UserOut.model_validate(owner)


@router.post("/register/affiliate", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_affiliate(payload: AffiliateRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    try:
        password_hash = hash_password(payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    user = User(
        email=payload.email,
        phone=None,
        role=Role.affiliate.value,
        tenant_id=None,
        password_hash=password_hash,
        is_active=True,
        is_approved=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    code = f"AFF{user.id:06d}"
    profile = AffiliateProfile(
        user_id=user.id,
        code=code,
        full_name=payload.affiliate_full_name,
        bank_name=payload.bank_name,
        bank_account_name=payload.bank_account_name,
        bank_account_number=payload.bank_account_number,
    )
    db.add(profile)
    db.commit()
    # Issue OTP registration code (best-effort)
    try:
        if user.email:
            reg_code = issue_code(db, email=user.email, purpose="register")
            send_email(user.email, "Verify your account", f"Your verification code is: {reg_code}")
    except Exception:
        pass
    return UserOut.model_validate(user)


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    tenant_id: Optional[str] = Depends(get_optional_tenant_id),
    _rl=Depends(rate_limit("login", identify_by="ip")),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    # Enforce OTP-only login for affiliates
    if user.role == Role.affiliate.value:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Affiliates must use OTP login flow: /auth/login/request-code then /auth/login/verify")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    # Pharmacy owner/cashier: require admin approval then payment
    if user.role in {Role.pharmacy_owner.value, Role.cashier.value}:
        if not user.is_approved:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Awaiting admin approval")
        if user.tenant_id:
            sub = ensure_subscription(db, tenant_id=user.tenant_id)
            if sub.blocked:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription blocked. Submit payment code and await verification.")
    if user.role != Role.admin.value:
        # Enforce tenant match for non-admin users
        if tenant_id and user.tenant_id != tenant_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant mismatch")
    token = create_access_token(subject=user.email, role=user.role, tenant_id=user.tenant_id)
    return Token(access_token=token)


@router.post("/register/verify")
def verify_registration(
    payload: RegistrationVerifyRequest,
    db: Session = Depends(get_db),
):
    if not verify_code(db, email=payload.email, purpose="register", code=payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.is_verified = True
    db.add(user)
    db.commit()
    return {"status": "verified"}


@router.post("/login/request-code")
def login_request_code(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    tenant_id: Optional[str] = Depends(get_optional_tenant_id),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if user.role != Role.admin.value and tenant_id and user.tenant_id and user.tenant_id != tenant_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant mismatch")
    code = issue_code(db, email=user.email, purpose="login")
    if user.email:
        send_email(user.email, "Login verification code", f"Your login code is: {code}")
    return {"status": "code_sent"}


@router.post("/login/verify", response_model=Token)
def login_verify(
    payload: LoginVerifyRequest,
    tenant_id: Optional[str] = Depends(get_optional_tenant_id),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not verify_code(db, email=payload.email, purpose="login", code=payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")
    if user.role != Role.admin.value and tenant_id and user.tenant_id and user.tenant_id != tenant_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant mismatch")
    # Pharmacy owner/cashier: require approval then payment before issuing token
    if user.role in {Role.pharmacy_owner.value, Role.cashier.value}:
        if not user.is_approved:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Awaiting admin approval")
        if user.tenant_id:
            sub = ensure_subscription(db, tenant_id=user.tenant_id)
            if sub.blocked:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription blocked. Submit payment code and await verification.")
    token = create_access_token(subject=user.email, role=user.role, tenant_id=user.tenant_id)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
