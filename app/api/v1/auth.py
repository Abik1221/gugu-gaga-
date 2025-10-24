from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.core.security import create_access_token, hash_password, verify_password
from app.db.deps import get_db
from app.deps.tenant import get_tenant_id
from app.models.user import User
from app.models.affiliate import AffiliateProfile, AffiliateReferral
from app.models.user_tenant import UserTenant
from app.services.verification import issue_code, verify_code
from app.services.notifications.email import send_email
from app.schemas.auth import Token, UserCreate, UserLogin, UserOut
from app.deps.auth import get_current_user
from app.deps.ratelimit import rate_limit

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db), tenant_id: Optional[str] = Depends(get_tenant_id)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    role_value = payload.role or Role.customer.value
    # Require tenant for pharmacy_owner/cashier registrations
    if role_value in {Role.pharmacy_owner.value, Role.cashier.value} and not tenant_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="tenant_id is required for this role")
    user = User(
        email=payload.email,
        phone=payload.phone,
        role=role_value,
        tenant_id=tenant_id,
        password_hash=hash_password(payload.password),
        is_active=True,
        is_approved=(role_value in {Role.customer.value, Role.affiliate.value}),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Link user to tenant for multi-pharmacy support when applicable
    if tenant_id and role_value in {Role.pharmacy_owner.value, Role.cashier.value}:
        link = UserTenant(user_id=user.id, tenant_id=tenant_id, role_override=None)
        db.add(link)
        db.commit()
    # Send verification code for registration (email-based)
    code = issue_code(db, email=user.email, purpose="register")
    if user.email:
        send_email(user.email, "Verify your account", f"Your verification code is: {code}")
    # Record affiliate referral if code provided and tenant context exists
    if payload.affiliate_code and tenant_id:
        profile = (
            db.query(AffiliateProfile).filter(AffiliateProfile.code == payload.affiliate_code).first()
        )
        if profile:
            referral = AffiliateReferral(
                affiliate_user_id=profile.user_id,
                referred_tenant_id=tenant_id,
                code=profile.code,
            )
            db.add(referral)
            db.commit()
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    tenant_id: Optional[str] = Depends(get_tenant_id),
    _rl=Depends(rate_limit("login", identify_by="ip")),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    if user.role != Role.admin.value:
        # Enforce tenant match for non-admin users
        if tenant_id and user.tenant_id != tenant_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant mismatch")
    token = create_access_token(subject=user.email, role=user.role, tenant_id=user.tenant_id)
    return Token(access_token=token)


@router.post("/register/verify")
def verify_registration(
    email: str,
    code: str,
    db: Session = Depends(get_db),
):
    if not verify_code(db, email=email, purpose="register", code=code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")
    user = db.query(User).filter(User.email == email).first()
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
    tenant_id: Optional[str] = Depends(get_tenant_id),
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
    email: str,
    code: str,
    tenant_id: Optional[str] = Depends(get_tenant_id),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not verify_code(db, email=email, purpose="login", code=code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")
    if user.role != Role.admin.value and tenant_id and user.tenant_id and user.tenant_id != tenant_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tenant mismatch")
    token = create_access_token(subject=user.email, role=user.role, tenant_id=user.tenant_id)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
