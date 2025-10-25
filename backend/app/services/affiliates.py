from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.models.affiliate import AffiliateReferral
from app.models.sales import Sale


def compute_monthly_commission(
    db: Session, *, affiliate_user_id: int, year: int, month: int, percent: float = 5.0
) -> dict:
    referred_tenants: List[str] = [
        r.referred_tenant_id
        for r in db.query(AffiliateReferral).filter(AffiliateReferral.affiliate_user_id == affiliate_user_id).all()
    ]
    if not referred_tenants:
        return {"year": year, "month": month, "percent": percent, "amount": 0.0, "tenants": []}

    q = (
        db.query(func.coalesce(func.sum(Sale.total_amount), 0.0))
        .filter(Sale.tenant_id.in_(referred_tenants))
        .filter(extract("year", Sale.created_at) == year)
        .filter(extract("month", Sale.created_at) == month)
    )
    total_revenue = float(q.scalar() or 0.0)
    amount = round(total_revenue * (percent / 100.0), 2)
    return {"year": year, "month": month, "percent": percent, "amount": amount, "tenants": referred_tenants}
