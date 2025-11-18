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
    
    # Log the code to terminal for development
    import logging
    logger = logging.getLogger(__name__)
    logger.warning(f"\n{'='*60}\n🔐 VERIFICATION CODE for {email} ({purpose})\nCODE: {code}\nExpires in {ttl_minutes} minutes\n{'='*60}\n")
    
    return code


def verify_code(db: Session, *, email: str, purpose: str, code: str) -> bool:
    now = datetime.utcnow()
    
    # Debug logging
    import logging
    logger = logging.getLogger(__name__)
    logger.warning(f"\n🔍 VERIFYING CODE: email={email}, purpose={purpose}, code={code}")
    
    # Clean the code input
    code = str(code).strip()
    
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
        # Debug: Show what codes exist for this email/purpose
        existing_codes = db.query(VerificationCode).filter(
            VerificationCode.email == email,
            VerificationCode.purpose == purpose,
            VerificationCode.consumed == False,
            VerificationCode.expires_at >= now,
        ).all()
        logger.warning(f"❌ No matching code found. Existing codes: {[(c.code, c.expires_at) for c in existing_codes]}")
        return False
        
    logger.warning(f"✅ Code verified successfully!")
    vc.consumed = True
    db.add(vc)
    db.commit()
    return True
