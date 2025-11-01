from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.deps.auth import require_role, get_current_user
from app.core.roles import Role
from app.db.deps import get_db
from app.models.affiliate import AffiliateProfile, AffiliateReferral, CommissionPayout, AffiliateLink
from app.services.affiliates import compute_monthly_commission
from app.deps.ratelimit import rate_limit_user
from app.schemas.affiliate_links import (
    AffiliateLinksResponse,
    AffiliateLinkActionResponse,
    AffiliateLinkItem,
)

router = APIRouter(prefix="/affiliate", tags=["affiliate"])


@router.get("/register-link", response_model=AffiliateLinksResponse)
def register_link(
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_link_user")),
    create_new: bool = False,
):
    # Ensure profile exists for completeness
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user.id).first()
    if not profile:
        code = f"AFF{user.id:06d}"
        profile = AffiliateProfile(user_id=user.id, code=code)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    # Fetch active links
    links = db.query(AffiliateLink).filter(AffiliateLink.affiliate_user_id == user.id, AffiliateLink.active == True).all()
    if create_new and len(links) < 2:
        import secrets
        token = secrets.token_urlsafe(12)
        new_link = AffiliateLink(affiliate_user_id=user.id, token=token, active=True)
        db.add(new_link)
        db.commit()
        db.refresh(new_link)
        links.append(new_link)
    return {
        "max_links": 2,
        "count": len(links),
        "links": [
            {"token": l.token, "url": f"https://zemen.example/ref/{l.token}", "active": l.active}
            for l in links
        ],
        "can_create_more": len(links) < 2,
    }


@router.post("/links/{token}/deactivate", response_model=AffiliateLinkActionResponse)
def deactivate_link(
    token: str,
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_link_manage_user")),
):
    link = (
        db.query(AffiliateLink)
        .filter(AffiliateLink.token == token, AffiliateLink.affiliate_user_id == user.id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    link.active = False
    db.add(link)
    db.commit()
    return {"token": token, "status": "deactivated"}


@router.post("/links/{token}/rotate", response_model=AffiliateLinkActionResponse)
def rotate_link(
    token: str,
    user=Depends(require_role(Role.admin, Role.affiliate)),
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_user("affiliate_link_manage_user")),
):
    # Deactivate the old link and create a new one if under limit
    link = (
        db.query(AffiliateLink)
        .filter(AffiliateLink.token == token, AffiliateLink.affiliate_user_id == user.id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    link.active = False
    db.add(link)
    db.commit()
    active_count = (
        db.query(AffiliateLink)
        .filter(AffiliateLink.affiliate_user_id == user.id, AffiliateLink.active == True)
        .count()
    )
    if active_count >= 2:
        return {"token": token, "status": "rotated_but_limit_reached"}
    import secrets
    new_token = secrets.token_urlsafe(12)
    new_link = AffiliateLink(affiliate_user_id=user.id, token=new_token, active=True)
    db.add(new_link)
    db.commit()
    return {"token": new_token, "status": "rotated", "url": f"https://zemen.example/ref/{new_token}"}


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
    pending_total = (
        db.query(func.coalesce(func.sum(CommissionPayout.amount), 0.0))
        .filter(CommissionPayout.affiliate_user_id == user.id, CommissionPayout.status == "pending")
        .scalar()
        or 0.0
    )
    paid_total = (
        db.query(func.coalesce(func.sum(CommissionPayout.amount), 0.0))
        .filter(CommissionPayout.affiliate_user_id == user.id, CommissionPayout.status == "paid")
        .scalar()
        or 0.0
    )
    return {
        "referrals_count": referrals_count,
        **monthly,
        "payouts": {"pending_total": float(pending_total), "paid_total": float(paid_total)},
    }


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
    amount = float(summary.get("amount", 0.0) or 0.0)
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must earn commission for the selected period before requesting a payout.",
        )
    payout = CommissionPayout(
        affiliate_user_id=user.id,
        tenant_id="GLOBAL",
        month=month,
        percent=percent,
        amount=amount,
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
