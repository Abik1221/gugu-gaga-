from datetime import datetime
from typing import List, Optional
import base64

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.core.security import create_access_token, hash_password, verify_password, decode_token
from app.db.deps import get_db
from app.deps.tenant import get_optional_tenant_id
from app.models.user import User
from app.models.affiliate import AffiliateProfile, AffiliateReferral
from app.models.kyc import KYCApplication
from app.models.user_tenant import UserTenant
from app.models.session import AuthSession
from app.services.verification import issue_code, verify_code
from app.services.notifications.email import send_email
from app.schemas.auth import (
    Token,
    TokenWithRefresh,
    RefreshTokenRequest,
    PasswordChangeRequest,
    SessionOut,
    UserLogin,
    UserOut,
    PharmacyRegister,
    AffiliateRegister,
    RegistrationVerifyRequest,
    LoginVerifyRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    UserProfileUpdate,
)
from app.deps.auth import get_current_user, oauth2_scheme
from app.deps.ratelimit import rate_limit
from app.services.billing.subscriptions import ensure_subscription
from app.models.subscription import Subscription, PaymentSubmission
from app.services.sessions import (
    create_session,
    rotate_session,
    get_session_by_token,
    get_session_by_id,
    revoke_session as revoke_auth_session,
)
from app.services.tenant_activity import log_activity


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


def _user_with_status(db: Session, user: User) -> UserOut:
    kyc_status: Optional[str] = None
    subscription_status: Optional[str] = None
    subscription_blocked: Optional[bool] = None
    subscription_next_due: Optional[str] = None
    latest_payment_status: Optional[str] = None

    if user.tenant_id:
        kyc = (
            db.query(KYCApplication)
            .filter(KYCApplication.tenant_id == user.tenant_id)
            .order_by(KYCApplication.id.desc())
            .first()
        )
        if kyc:
            kyc_status = kyc.status
        else:
            kyc_status = None

        subscription = (
            db.query(Subscription)
            .filter(Subscription.tenant_id == user.tenant_id)
            .first()
        )
        payment = (
            db.query(PaymentSubmission)
            .filter(PaymentSubmission.tenant_id == user.tenant_id)
            .order_by(PaymentSubmission.id.desc())
            .first()
        )
        if payment:
            latest_payment_status = payment.status

        if subscription:
            subscription_blocked = bool(subscription.blocked)
            if subscription.next_due_date:
                subscription_next_due = subscription.next_due_date.isoformat()
        if kyc_status != "approved":
            subscription_status = "kyc_pending"
        else:
            if subscription:
                if subscription.blocked:
                    if payment and payment.status == "pending":
                        subscription_status = "pending_verification"
                    elif payment and payment.status == "rejected":
                        subscription_status = "payment_rejected"
                    else:
                        subscription_status = "awaiting_payment"
                else:
                    subscription_status = "active"
            else:
                subscription_status = "awaiting_payment"

    return UserOut(
        id=user.id,
        email=user.email,
        phone=user.phone,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        tenant_id=user.tenant_id,
        is_active=user.is_active,
        is_approved=user.is_approved,
        kyc_status=kyc_status,
        subscription_status=subscription_status,
        subscription_blocked=subscription_blocked,
        subscription_next_due_date=subscription_next_due,
        latest_payment_status=latest_payment_status,
    )


def _client_ip(request: Request) -> Optional[str]:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        ip = forwarded.split(",")[0].strip()
        if ip:
            return ip
    if request.client:
        return request.client.host
    return None


def _issue_session_tokens(db: Session, user: User, request: Request) -> TokenWithRefresh:
    session, refresh_token = create_session(
        db,
        user_id=user.id,
        tenant_id=user.tenant_id,
        user_agent=request.headers.get("user-agent"),
        ip_address=_client_ip(request),
    )
    access_token = create_access_token(
        subject=user.email,
        role=user.role,
        tenant_id=user.tenant_id,
        session_id=session.id,
    )
    if user.tenant_id:
        log_activity(
            db,
            tenant_id=user.tenant_id,
            actor_user_id=user.id,
            action="session.login",
            message="User logged in",
            metadata={
                "session_id": session.id,
                "ip": _client_ip(request),
                "user_agent": request.headers.get("user-agent"),
            },
        )
    return TokenWithRefresh(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        session_id=session.id,
    )


@router.post("/register/owner")
def register_owner(payload: PharmacyRegister, db: Session = Depends(get_db)):
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

    try:
        owner_password_hash = hash_password(payload.owner_password)
    except ValueError as exc:
        db.delete(ph)
        db.commit()
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
    license_name = payload.license_document_name
    license_mime = payload.license_document_mime
    license_data = None
    if payload.license_document_base64:
        data_str = payload.license_document_base64.strip()
        if data_str.startswith("data:"):
            try:
                header, data_str = data_str.split(",", 1)
                if not license_mime:
                    parts = header.split(";", 1)[0]
                    if parts.startswith("data:"):
                        license_mime = parts[len("data:") :]
            except ValueError:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid data URL format for license document")
        try:
            license_data = base64.b64decode(data_str)
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid license document encoding: {exc}")
        if len(license_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="License document too large (max 10MB)")
        if not license_name:
            license_name = f"{tenant_id}_license"
        if not license_mime:
            license_mime = "application/octet-stream"

    if not license_data and not payload.pharmacy_license_document_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Business license document is required")

    app = KYCApplication(
        tenant_id=tenant_id,
        applicant_user_id=owner.id,
        id_number=payload.id_number,
        pharmacy_license_number=payload.pharmacy_license_number,
        documents_path=None if license_data else (payload.pharmacy_license_document_path or payload.national_id_document_path),
        license_document_name=license_name,
        license_document_mime=license_mime,
        license_document_data=license_data,
        pharmacy_name=payload.pharmacy_name,
        pharmacy_address=payload.address,
        owner_email=payload.owner_email,
        owner_phone=payload.owner_phone,
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
    # In-app notifications and status emails (best-effort)
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
            user_id=owner.id,
            title="Application Under Review",
            body="We have received your pharmacy application. Our team will review it and follow up soon.",
        )
        if owner.email:
            send_email(
                owner.email,
                "Pharmacy application received",
                "Thanks for submitting your pharmacy information. Our team is reviewing it now and will contact you soon with next steps.",
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
    return {
        "user": _user_with_status(db, owner),
        "tenant_id": tenant_id,
        "kyc": {
            "id": app.id,
            "status": app.status,
            "pharmacy_name": app.pharmacy_name,
            "pharmacy_address": app.pharmacy_address,
            "id_number": app.id_number,
            "pharmacy_license_number": app.pharmacy_license_number,
            "owner_phone": app.owner_phone,
            "notes": app.notes,
            "license_document_name": app.license_document_name,
            "license_document_mime": app.license_document_mime,
            "documents_path": app.documents_path,
        },
    }


@router.post("/register/supplier")
def register_supplier(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    password = payload.get("password")
    supplier_name = payload.get("supplier_name")
    national_id = payload.get("national_id")
    tin_number = payload.get("tin_number")
    phone = payload.get("phone")
    address = payload.get("address")
    license_image = payload.get("business_license_image")
    
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    try:
        password_hash = hash_password(password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    
    # Create user
    user = User(
        email=email,
        phone=phone,
        role=Role.supplier.value,
        tenant_id=None,
        password_hash=password_hash,
        is_active=True,
        is_approved=False,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create supplier profile
    from app.models.supplier import Supplier
    supplier = Supplier(
        user_id=user.id,
        company_name=supplier_name,
        tax_id=tin_number,
        phone=phone,
        address=address,
        business_license=license_image,
        is_verified=False,
        is_active=True,
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    
    # Create KYC record
    from app.models.supplier_kyc import SupplierKYC
    kyc = SupplierKYC(
        supplier_id=supplier.id,
        national_id=national_id,
        business_license_image=license_image,
        tax_certificate_number=tin_number,
        status="pending",
    )
    db.add(kyc)
    db.commit()
    
    # Send verification code
    try:
        code = issue_code(db, email=user.email, purpose="register")
        if user.email:
            send_email(user.email, "Verify your account", f"Your verification code is: {code}")
    except Exception:
        pass
    
    return {
        "user": _user_with_status(db, user),
        "message": "Registration successful. Please verify your email."
    }


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
    return _user_with_status(db, user)


@router.post("/login", response_model=TokenWithRefresh)
def login(
    request: Request,
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
    if user.role in {Role.pharmacy_owner.value, Role.cashier.value} and user.tenant_id:
        sub = ensure_subscription(db, tenant_id=user.tenant_id)
        if user.role == Role.cashier.value:
            if not user.is_approved:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Awaiting admin approval")
            if sub.blocked:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription blocked. Submit payment code and await verification.")
    if user.role != Role.admin.value:
        # Enforce tenant match for non-admin users
        if tenant_id and user.tenant_id != tenant_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant mismatch")
    tokens = _issue_session_tokens(db, user, request)
    return tokens


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Allow owners/cashiers to update contact details even if subscription is blocked or payment pending.
    if current_user.role in {Role.pharmacy_owner.value, Role.cashier.value}:
        sub = None
        if current_user.tenant_id:
            sub = ensure_subscription(db, tenant_id=current_user.tenant_id)
        if sub and sub.blocked:
            # Owners should still be able to update contact info to resolve payment blockers; do not raise.
            pass

    updated = False

    if payload.username is not None:
        username = payload.username.strip() or None
        if username:
            existing = db.query(User).filter(User.username == username, User.id != current_user.id).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
        current_user.username = username
        updated = True

    if payload.first_name is not None:
        current_user.first_name = payload.first_name.strip() or None
        updated = True

    if payload.last_name is not None:
        current_user.last_name = payload.last_name.strip() or None
        updated = True

    if payload.phone is not None:
        current_user.phone = payload.phone.strip() or None
        updated = True

    if not updated:
        return _user_with_status(db, current_user)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return _user_with_status(db, current_user)


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
    token = create_access_token(subject=user.email, role=user.role, tenant_id=user.tenant_id)
    return {"status": "verified", "access_token": token, "token_type": "bearer"}


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


@router.post("/login/verify", response_model=TokenWithRefresh)
def login_verify(
    payload: LoginVerifyRequest,
    request: Request,
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
    if user.role in {Role.pharmacy_owner.value, Role.cashier.value} and user.tenant_id:
        sub = ensure_subscription(db, tenant_id=user.tenant_id)
        if user.role == Role.cashier.value:
            if not user.is_approved:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Awaiting admin approval")
            if sub.blocked:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription blocked. Submit payment code and await verification.")
    tokens = _issue_session_tokens(db, user, request)
    return tokens


@router.post("/password/reset/request")
def password_reset_request(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Avoid user enumeration
        return {"status": "sent"}
    if user.role != Role.pharmacy_owner.value:
        return {"status": "sent"}
    if not user.is_approved:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account not yet approved")
    code = issue_code(db, email=user.email, purpose="password_reset", ttl_minutes=30)
    if user.email:
        send_email(
            user.email,
            "Reset your password",
            f"Use this code to reset your password: {code}. It expires in 30 minutes.",
        )
    return {"status": "sent"}


@router.post("/password/reset/confirm")
def password_reset_confirm(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.role != Role.pharmacy_owner.value:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password reset not available for this account")
    if not user.is_approved:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account not yet approved")
    if not verify_code(db, email=payload.email, purpose="password_reset", code=payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")
    try:
        user.password_hash = hash_password(payload.new_password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    db.add(user)
    db.commit()
    return {"status": "reset"}


@router.get("/me", response_model=UserOut)
def me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _user_with_status(db, current_user)


@router.post("/refresh", response_model=TokenWithRefresh)
def refresh_tokens(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    session = get_session_by_token(db, payload.refresh_token)
    if not session or session.is_revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    if session.expires_at < datetime.utcnow():
        revoke_auth_session(db, session)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Expired refresh token")
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user or not user.is_active:
        revoke_auth_session(db, session)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    new_refresh = rotate_session(db, session)
    if user.tenant_id:
        log_activity(
            db,
            tenant_id=user.tenant_id,
            actor_user_id=user.id,
            action="session.refresh",
            message="Session tokens refreshed",
            target_type="session",
            target_id=str(session.id),
        )
    access_token = create_access_token(
        subject=user.email,
        role=user.role,
        tenant_id=user.tenant_id,
        session_id=session.id,
    )
    return TokenWithRefresh(
        access_token=access_token,
        token_type="bearer",
        refresh_token=new_refresh,
        session_id=session.id,
    )


@router.post("/change-password")
def change_password(
    payload: PasswordChangeRequest,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    try:
        current_user.password_hash = hash_password(payload.new_password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    db.add(current_user)
    db.commit()

    try:
        payload_token = decode_token(token)
        current_sid = payload_token.get("sid")
    except Exception:
        current_sid = None

    sessions_query = db.query(AuthSession).filter(AuthSession.user_id == current_user.id, AuthSession.is_revoked == False)
    if current_sid is not None:
        sessions_query = sessions_query.filter(AuthSession.id != current_sid)
    for other_session in sessions_query.all():
        revoke_auth_session(db, other_session)

    if current_user.tenant_id:
        log_activity(
            db,
            tenant_id=current_user.tenant_id,
            actor_user_id=current_user.id,
            action="account.password-change",
            message="Account password updated",
            metadata={"session_kept": current_sid},
        )

    return {"status": "changed"}


@router.get("/sessions", response_model=List[SessionOut])
def list_sessions(
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        payload = decode_token(token)
        current_sid = payload.get("sid")
    except Exception:
        current_sid = None
    sessions: List[AuthSession] = (
        db.query(AuthSession)
        .filter(AuthSession.user_id == current_user.id)
        .order_by(AuthSession.created_at.desc())
        .all()
    )
    results: List[SessionOut] = []
    for session in sessions:
        results.append(
            SessionOut(
                id=session.id,
                created_at=session.created_at,
                last_seen_at=session.last_seen_at,
                expires_at=session.expires_at,
                revoked_at=session.revoked_at,
                is_revoked=session.is_revoked,
                user_agent=session.user_agent,
                ip_address=session.ip_address,
                is_current=bool(current_sid and session.id == current_sid),
            )
        )
    return results


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = get_session_by_id(db, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    revoke_auth_session(db, session)
    if current_user.tenant_id:
        log_activity(
            db,
            tenant_id=current_user.tenant_id,
            actor_user_id=current_user.id,
            action="session.revoke",
            message="Session revoked",
            target_type="session",
            target_id=str(session.id),
        )
    return None
