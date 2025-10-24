from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.deps.auth import require_role
from app.deps.tenant import require_tenant, enforce_user_tenant
from app.core.roles import Role
from app.db.deps import get_db
from app.models.affiliate import AffiliateProfile
from app.services.affiliates import compute_monthly_commission
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/affiliate", tags=["affiliate"])


@router.get("/register-link")
def register_link(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_link_user")),
    _ten=Depends(enforce_user_tenant),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user.id).first()
    if not profile:
        code = f"AFF{user.id:06d}"
        profile = AffiliateProfile(user_id=user.id, code=code)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {"tenant_id": tenant_id, "link": f"https://zemen.example/ref/{profile.code}", "code": profile.code}


@router.get("/commissions")
def commission_summary(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_commissions_user")),
    _ten=Depends(enforce_user_tenant),
):
    now = datetime.utcnow()
    data = compute_monthly_commission(db, affiliate_user_id=user.id, year=now.year, month=now.month)
    return {"tenant_id": tenant_id, **data}
