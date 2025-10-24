from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.deps.auth import require_role, get_current_user
from app.core.roles import Role
from app.db.deps import get_db
from app.models.affiliate import AffiliateProfile, AffiliateReferral, CommissionPayout
from app.services.affiliates import compute_monthly_commission
from app.deps.ratelimit import rate_limit_user

router = APIRouter(prefix="/affiliate", tags=["affiliate"])


@router.get("/register-link")
def register_link(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_link_user")),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user.id).first()
    if not profile:
        code = f"AFF{user.id:06d}"
        profile = AffiliateProfile(user_id=user.id, code=code)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {"link": f"https://zemen.example/ref/{profile.code}", "code": profile.code}


@router.get("/commissions")
def commission_summary(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_commissions_user")),
):
    now = datetime.utcnow()
    data = compute_monthly_commission(db, affiliate_user_id=user.id, year=now.year, month=now.month)
    return data


@router.get("/dashboard")
def dashboard(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_dashboard_user")),
):
    now = datetime.utcnow()
    referrals_count = db.query(AffiliateReferral).filter(AffiliateReferral.affiliate_user_id == user.id).count()
    monthly = compute_monthly_commission(db, affiliate_user_id=user.id, year=now.year, month=now.month)
    return {"referrals_count": referrals_count, **monthly}


@router.get("/payouts")
def list_payouts(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    status_filter: str | None = None,
):
    q = db.query(CommissionPayout).filter(CommissionPayout.affiliate_user_id == user.id)
    if status_filter:
        q = q.filter(CommissionPayout.status == status_filter)
    rows = q.order_by(CommissionPayout.id.desc()).all()
    return [
        {"id": r.id, "month": r.month, "percent": r.percent, "amount": r.amount, "status": r.status}
        for r in rows
    ]


@router.post("/payouts/request")
def request_payout(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    month: str | None = None,  # YYYY-MM
    percent: float = 5.0,
):
    now = datetime.utcnow()
    if not month:
        month = f"{now.year:04d}-{now.month:02d}"
    try:
        year, mon = [int(x) for x in month.split("-")]
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid month format, expected YYYY-MM")
    summary = compute_monthly_commission(db, affiliate_user_id=user.id, year=year, month=mon, percent=percent)
    payout = CommissionPayout(
        affiliate_user_id=user.id,
        tenant_id="GLOBAL",
        month=month,
        percent=percent,
        amount=summary.get("amount", 0.0),
        status="pending",
    )
    db.add(payout)
    db.commit()
    db.refresh(payout)
    return {"id": payout.id, "month": payout.month, "amount": payout.amount, "percent": payout.percent, "status": payout.status}


@router.post("/profile")
def update_profile(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    full_name: str | None = None,
    bank_name: str | None = None,
    bank_account_name: str | None = None,
    bank_account_number: str | None = None,
    iban: str | None = None,
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user.id).first()
    if not profile:
        code = f"AFF{user.id:06d}"
        profile = AffiliateProfile(user_id=user.id, code=code)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    if full_name is not None:
        profile.full_name = full_name
    if bank_name is not None:
        profile.bank_name = bank_name
    if bank_account_name is not None:
        profile.bank_account_name = bank_account_name
    if bank_account_number is not None:
        profile.bank_account_number = bank_account_number
    if iban is not None:
        profile.iban = iban
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {
        "full_name": profile.full_name,
        "bank_name": profile.bank_name,
        "bank_account_name": profile.bank_account_name,
        "bank_account_number": profile.bank_account_number,
        "iban": profile.iban,
        "code": profile.code,
    }
