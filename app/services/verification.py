from __future__ import annotations

import random
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.models.verification import VerificationCode


def _random_code(length: int = 6) -> str:
    return "".join(str(random.randint(0, 9)) for _ in range(length))


def issue_code(db: Session, *, email: str, purpose: str, ttl_minutes: int = 10) -> str:
    code = _random_code()
    expires = datetime.utcnow() + timedelta(minutes=ttl_minutes)
    vc = VerificationCode(email=email, code=code, purpose=purpose, expires_at=expires, consumed=False)
    db.add(vc)
    db.commit()
    return code


def verify_code(db: Session, *, email: str, purpose: str, code: str) -> bool:
    now = datetime.utcnow()
    vc = (
        db.query(VerificationCode)
        .filter(
            VerificationCode.email == email,
            VerificationCode.purpose == purpose,
            VerificationCode.code == code,
            VerificationCode.consumed == False,
            VerificationCode.expires_at >= now,
        )
        .order_by(VerificationCode.id.desc())
        .first()
    )
    if not vc:
        return False
    vc.consumed = True
    db.add(vc)
    db.commit()
    return True
