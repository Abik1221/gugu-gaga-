from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.core.settings import settings
from app.models.session import AuthSession


REFRESH_TOKEN_BYTES = 48


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(
    db: Session,
    *,
    user_id: int,
    tenant_id: Optional[str],
    user_agent: Optional[str],
    ip_address: Optional[str],
    expires_days: Optional[int] = None,
) -> tuple[AuthSession, str]:
    refresh_token = secrets.token_urlsafe(REFRESH_TOKEN_BYTES)
    token_hash = _hash_token(refresh_token)
    ttl_days = expires_days or settings.refresh_token_expires_days
    now = datetime.utcnow()
    session = AuthSession(
        user_id=user_id,
        tenant_id=tenant_id,
        token_hash=token_hash,
        user_agent=user_agent,
        ip_address=ip_address,
        created_at=now,
        expires_at=now + timedelta(days=ttl_days),
        last_seen_at=now,
        is_revoked=False,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session, refresh_token


def rotate_session(db: Session, session: AuthSession, *, expires_days: Optional[int] = None) -> str:
    refresh_token = secrets.token_urlsafe(REFRESH_TOKEN_BYTES)
    session.token_hash = _hash_token(refresh_token)
    ttl_days = expires_days or settings.refresh_token_expires_days
    session.expires_at = datetime.utcnow() + timedelta(days=ttl_days)
    session.last_seen_at = datetime.utcnow()
    session.is_revoked = False
    session.revoked_at = None
    db.add(session)
    db.commit()
    db.refresh(session)
    return refresh_token


def revoke_session(db: Session, session: AuthSession) -> None:
    if session.is_revoked:
        return
    session.is_revoked = True
    session.revoked_at = datetime.utcnow()
    db.add(session)
    db.commit()


def update_last_seen(db: Session, session: AuthSession, *, timestamp: Optional[datetime] = None) -> None:
    ts = timestamp or datetime.utcnow()
    if session.last_seen_at and (ts - session.last_seen_at).total_seconds() < 30:
        return
    session.last_seen_at = ts
    db.add(session)
    db.commit()


def get_session_by_id(db: Session, session_id: int) -> Optional[AuthSession]:
    return db.query(AuthSession).filter(AuthSession.id == session_id).first()


def get_session_by_token(db: Session, refresh_token: str) -> Optional[AuthSession]:
    token_hash = _hash_token(refresh_token)
    return db.query(AuthSession).filter(AuthSession.token_hash == token_hash).first()
