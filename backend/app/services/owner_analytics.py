from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.models.medicine import InventoryItem, Medicine
from app.models.sales import Sale, SaleItem
from app.models.user import User
from app.models.audit import AuditLog


@dataclass
class BranchAggregate:
    branch: Optional[str]
    revenue: float
    sale_count: int
    units_sold: int


@dataclass
class StaffAggregate:
    user_id: int
    name: str
    email: Optional[str]
    role: str
    total_sales: float
    transactions: int
    units_sold: int


@dataclass
class StaffActivity:
    id: int
    action: str
    actor_user_id: Optional[int]
    actor_name: Optional[str]
    actor_role: Optional[str]
    target_type: Optional[str]
    target_id: Optional[str]
    metadata: Optional[dict]
    created_at: datetime


def get_period_bounds(period: str, now: Optional[datetime] = None) -> tuple[datetime, datetime]:
    now = now or datetime.utcnow()
    period = period.lower()
    if period == "day":
        start = now - timedelta(days=1)
    elif period == "week":
        start = now - timedelta(weeks=1)
    elif period == "month":
        start = now - timedelta(days=30)
    elif period == "quarter":
        start = now - timedelta(days=90)
    elif period == "year":
        start = now - timedelta(days=365)
    else:
        start = now - timedelta(days=30)
    return start, now


def get_revenue_trend(
    db: Session,
    *,
    tenant_id: str,
    weeks: int = 12,
) -> List[Dict[str, float]]:
    weeks = max(1, min(52, weeks))
    now = datetime.utcnow()
    trend_start = now - timedelta(weeks=weeks - 1)
    weekly_totals: Dict[str, float] = {}
    for i in range(weeks):
        week_dt = trend_start + timedelta(weeks=i)
        iso_year, iso_week, _ = week_dt.isocalendar()
        weekly_totals[f"{iso_year}-W{iso_week:02d}"] = 0.0
    sales_rows = (
        db.query(Sale.created_at, Sale.total_amount)
        .filter(Sale.tenant_id == tenant_id, Sale.created_at >= trend_start)
        .all()
    )
    for created_at, total_amount in sales_rows:
        iso_year, iso_week, _ = created_at.isocalendar()
        key = f"{iso_year}-W{iso_week:02d}"
        if key in weekly_totals:
            weekly_totals[key] += float(total_amount or 0.0)
    return [
        {"period": period, "revenue": round(total, 2)}
        for period, total in weekly_totals.items()
    ]


def get_branch_comparison(
    db: Session,
    *,
    tenant_id: str,
    since: datetime,
) -> List[BranchAggregate]:
    rows = (
        db.query(
            Sale.branch,
            func.coalesce(func.sum(Sale.total_amount), 0.0),
            func.count(func.distinct(Sale.id)),
            func.coalesce(func.sum(SaleItem.quantity), 0),
        )
        .join(SaleItem, SaleItem.sale_id == Sale.id)
        .filter(Sale.tenant_id == tenant_id, Sale.created_at >= since)
        .group_by(Sale.branch)
        .all()
    )
    return [
        BranchAggregate(
            branch=row[0],
            revenue=round(float(row[1] or 0.0), 2),
            sale_count=int(row[2] or 0),
            units_sold=int(row[3] or 0),
        )
        for row in rows
    ]


def get_staff_productivity(
    db: Session,
    *,
    tenant_id: str,
    since: datetime,
) -> List[StaffAggregate]:
    rows = (
        db.query(
            User.id,
            func.coalesce(User.first_name, ""),
            func.coalesce(User.last_name, ""),
            User.email,
            User.role,
            func.coalesce(func.sum(Sale.total_amount), 0.0),
            func.count(func.distinct(Sale.id)),
            func.coalesce(func.sum(SaleItem.quantity), 0),
        )
        .join(Sale, Sale.cashier_user_id == User.id)
        .join(SaleItem, SaleItem.sale_id == Sale.id)
        .filter(
            User.tenant_id == tenant_id,
            User.role.in_([Role.cashier.value, Role.pharmacy_owner.value, Role.manager.value]),
            Sale.created_at >= since,
        )
        .group_by(User.id, User.first_name, User.last_name, User.email, User.role)
        .order_by(func.coalesce(func.sum(Sale.total_amount), 0.0).desc())
        .all()
    )
    aggregates: List[StaffAggregate] = []
    for row in rows:
        full_name = f"{row[1]} {row[2]}".strip() or "Unnamed"
        aggregates.append(
            StaffAggregate(
                user_id=row[0],
                name=full_name,
                email=row[3],
                role=row[4],
                total_sales=round(float(row[5] or 0.0), 2),
                transactions=int(row[6] or 0),
                units_sold=int(row[7] or 0),
            )
        )
    return aggregates


def get_staff_activity(
    db: Session,
    *,
    tenant_id: str,
    since: datetime,
    limit: int = 20,
) -> List[StaffActivity]:
    limit = max(1, min(100, limit))
    actions = [
        "inventory_upsert",
        "inventory_bulk_upsert",
        "pos_sale_create",
        "inventory_delete",
        "inventory_adjust",
    ]
    rows = (
        db.query(AuditLog, User)
        .outerjoin(User, User.id == AuditLog.actor_user_id)
        .filter(
            AuditLog.tenant_id == tenant_id,
            AuditLog.action.in_(actions),
            AuditLog.created_at >= since,
        )
        .order_by(AuditLog.id.desc())
        .limit(limit)
        .all()
    )
    activities: List[StaffActivity] = []
    for log, user in rows:
        if not log:
            continue
        name_part = []
        if user and getattr(user, "first_name", None):
            name_part.append(user.first_name)
        if user and getattr(user, "last_name", None):
            name_part.append(user.last_name)
        if not name_part and user and getattr(user, "username", None):
            name_part.append(user.username)
        actor_name = " ".join(name_part).strip() if name_part else None
        activities.append(
            StaffActivity(
                id=log.id,
                action=log.action,
                actor_user_id=log.actor_user_id,
                actor_name=actor_name,
                actor_role=getattr(user, "role", None) if user else None,
                target_type=log.target_type,
                target_id=log.target_id,
                metadata=getattr(log, "meta", None),
                created_at=log.created_at,
            )
        )
    return activities


def get_inventory_health(
    db: Session,
    *,
    tenant_id: str,
) -> List[Dict[str, int]]:
    rows = (
        db.query(InventoryItem.quantity, InventoryItem.reorder_level, InventoryItem.expiry_date)
        .filter(InventoryItem.tenant_id == tenant_id)
        .all()
    )
    low_stock = 0
    out_of_stock = 0
    healthy = 0
    expiring = 0
    today = datetime.utcnow().date()
    for quantity, reorder_level, expiry_date in rows:
        qty = int(quantity or 0)
        reorder = int(reorder_level or 0)
        if qty <= 0:
            out_of_stock += 1
        elif qty <= max(0, reorder):
            low_stock += 1
        else:
            healthy += 1
        if expiry_date and expiry_date <= today + timedelta(days=30):
            expiring += 1
    data = []
    if out_of_stock:
        data.append({"label": "Out of stock", "count": out_of_stock})
    if low_stock:
        data.append({"label": "Low stock", "count": low_stock})
    if expiring:
        data.append({"label": "Expiring soon", "count": expiring})
    if healthy:
        data.append({"label": "Healthy", "count": healthy})
    return data


def get_top_products(
    db: Session,
    *,
    tenant_id: str,
    since: datetime,
    limit: int = 5,
) -> List[Dict[str, float]]:
    limit = max(1, min(20, limit))
    rows = (
        db.query(
            Medicine.name.label("name"),
            func.coalesce(func.sum(SaleItem.line_total), 0.0).label("revenue"),
            func.coalesce(func.sum(SaleItem.quantity), 0).label("quantity"),
        )
        .join(Sale, Sale.id == SaleItem.sale_id)
        .join(Medicine, Medicine.id == SaleItem.medicine_id)
        .filter(Sale.tenant_id == tenant_id, Sale.created_at >= since)
        .group_by(Medicine.name)
        .order_by(func.coalesce(func.sum(SaleItem.line_total), 0.0).desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "name": row.name or "Unknown",
            "revenue": round(float(row.revenue or 0.0), 2),
            "quantity": int(row.quantity or 0),
        }
        for row in rows
    ]


def get_active_cashiers(
    db: Session,
    *,
    tenant_id: str,
) -> int:
    return (
        db.query(func.count(User.id))
        .filter(
            User.tenant_id == tenant_id,
            User.role == Role.cashier.value,
            User.is_active == True,
        )
        .scalar()
        or 0
    )


def get_revenue_summary(
    db: Session,
    *,
    tenant_id: str,
    since: datetime,
    until: datetime,
) -> Dict[str, float]:
    revenue, sale_count, units_sold = (
        db.query(
            func.coalesce(func.sum(Sale.total_amount), 0.0),
            func.count(func.distinct(Sale.id)),
            func.coalesce(func.sum(SaleItem.quantity), 0),
        )
        .join(SaleItem, SaleItem.sale_id == Sale.id)
        .filter(
            Sale.tenant_id == tenant_id,
            Sale.created_at >= since,
            Sale.created_at <= until,
        )
        .first()
    )
    return {
        "total_revenue": round(float(revenue or 0.0), 2),
        "sale_count": int(sale_count or 0),
        "units_sold": int(units_sold or 0),
    }
