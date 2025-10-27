from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import require_role
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.models.subscription import PaymentSubmission
from app.schemas.owner_analytics import (
    OwnerAnalyticsDeltas,
    OwnerAnalyticsResponse,
    OwnerAnalyticsTotals,
    OwnerPaymentEntry,
    OwnerRevenuePoint,
    OwnerTopProduct,
)
from app.services.owner_analytics import (
    get_active_cashiers,
    get_branch_comparison,
    get_inventory_health,
    get_period_bounds,
    get_revenue_summary,
    get_revenue_trend,
    get_staff_productivity,
    get_top_products,
)

router = APIRouter(prefix="/analytics", tags=["owner_analytics"])


def _calc_delta(current_value: float, previous_value: float) -> float:
    if previous_value <= 0:
        return 100.0 if current_value > 0 else 0.0
    return ((current_value - previous_value) / previous_value) * 100.0
@router.get("/overview", response_model=OwnerAnalyticsResponse)
def owner_analytics_overview(
    tenant_id: str = Depends(require_tenant),
    _user=Depends(require_role(Role.pharmacy_owner, Role.admin)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
    horizon: str = "month",
    trend_weeks: int = 12,
):
    horizon = horizon.lower()
    current_start, current_end = get_period_bounds(horizon)
    previous_start, previous_end = get_period_bounds(horizon, now=current_start)

    revenue_summary = get_revenue_summary(db, tenant_id=tenant_id, since=current_start, until=current_end)
    revenue_previous = get_revenue_summary(db, tenant_id=tenant_id, since=previous_start, until=previous_end)

    total_revenue_current = revenue_summary["total_revenue"]
    total_revenue_previous = revenue_previous["total_revenue"]
    sale_count_current = revenue_summary["sale_count"]
    sale_count_previous = revenue_previous["sale_count"]
    units_current = revenue_summary["units_sold"]
    units_previous = revenue_previous["units_sold"]

    average_ticket_current = total_revenue_current / sale_count_current if sale_count_current > 0 else 0.0
    average_ticket_previous = total_revenue_previous / sale_count_previous if sale_count_previous > 0 else 0.0

    active_cashiers = get_active_cashiers(db, tenant_id=tenant_id)

    totals = OwnerAnalyticsTotals(
        total_revenue=total_revenue_current,
        average_ticket=round(average_ticket_current, 2),
        units_sold=units_current,
        sale_count=sale_count_current,
        active_cashiers=active_cashiers,
    )

    deltas = OwnerAnalyticsDeltas(
        revenue_vs_last_period=round(_calc_delta(total_revenue_current, total_revenue_previous), 2),
        avg_ticket_vs_last_period=round(_calc_delta(average_ticket_current, average_ticket_previous), 2),
        units_vs_last_period=round(_calc_delta(float(units_current), float(units_previous)), 2),
    )

    revenue_trend = [
        OwnerRevenuePoint(period=point["period"], revenue=point["revenue"])
        for point in get_revenue_trend(db, tenant_id=tenant_id, weeks=trend_weeks)
    ]

    top_products = [
        OwnerTopProduct(name=item["name"], revenue=item["revenue"], quantity=item["quantity"])
        for item in get_top_products(db, tenant_id=tenant_id, since=current_start)
    ]

    branch_comparison = get_branch_comparison(db, tenant_id=tenant_id, since=current_start)
    staff_productivity = get_staff_productivity(db, tenant_id=tenant_id, since=current_start)
    inventory_health = get_inventory_health(db, tenant_id=tenant_id)

    # --- Recent payment submissions ---
    payment_rows = (
        db.query(PaymentSubmission)
        .filter(PaymentSubmission.tenant_id == tenant_id)
        .order_by(PaymentSubmission.created_at.desc())
        .limit(5)
        .all()
    )
    status_labels = {
        "pending": "Pending verification",
        "verified": "Verified",
        "rejected": "Rejected",
    }
    recent_payments = [
        OwnerPaymentEntry(
            id=row.id,
            status=row.status,
            status_label=status_labels.get((row.status or "").lower(), row.status or "Unknown"),
            code=row.code,
            created_at=row.created_at,
            created_at_formatted=row.created_at.strftime("%d %b %Y, %H:%M") if row.created_at else "",
        )
        for row in payment_rows
    ]

    return OwnerAnalyticsResponse(
        horizon=horizon,
        totals=totals,
        deltas=deltas,
        revenue_trend=revenue_trend,
        top_products=top_products,
        inventory_health=inventory_health,
        recent_payments=recent_payments,
        branch_comparison=[
            {
                "branch": item.branch,
                "revenue": item.revenue,
                "sale_count": item.sale_count,
                "units_sold": item.units_sold,
            }
            for item in branch_comparison
        ],
        staff_productivity=[
            {
                "user_id": item.user_id,
                "name": item.name,
                "email": item.email,
                "role": item.role,
                "total_sales": item.total_sales,
                "transactions": item.transactions,
                "units_sold": item.units_sold,
            }
            for item in staff_productivity
        ],
    )
