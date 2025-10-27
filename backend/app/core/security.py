from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt
from passlib.context import CryptContext

from app.core.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_PASSWORD_BYTES = 72


def _ensure_password_length(password: str) -> None:
    if len(password.encode("utf-8")) > MAX_PASSWORD_BYTES:
        raise ValueError(f"Password must be at most {MAX_PASSWORD_BYTES} characters long")


def hash_password(password: str) -> str:
    _ensure_password_length(password)
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(
    subject: str,
    role: str,
    tenant_id: Optional[str],
    *,
    expires_minutes: Optional[int] = None,
    session_id: Optional[int] = None,
) -> str:
    expire_minutes = expires_minutes or settings.access_token_expires_minutes
    expire = datetime.now(tz=timezone.utc) + timedelta(minutes=expire_minutes)
    payload: Dict[str, Any] = {
        "sub": subject,
        "role": role,
        "tenant_id": tenant_id,
        "exp": expire,
        "iat": datetime.now(tz=timezone.utc),
    }
    if session_id is not None:
        payload["sid"] = session_id
    token = jwt.encode(payload, settings.jwt_secret or "dev-secret", algorithm=settings.jwt_algorithm)
    return token


def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, settings.jwt_secret or "dev-secret", algorithms=[settings.jwt_algorithm])
