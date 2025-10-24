from fastapi import APIRouter, Depends

from app.deps.auth import require_role
from app.deps.tenant import require_tenant, enforce_user_tenant, enforce_subscription_active
from app.core.roles import Role
from app.deps.auth import get_current_user
from app.models.user import User
from sqlalchemy.orm import Session
from app.db.deps import get_db
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from app.models.sales import Sale, SaleItem
from app.models.medicine import Medicine
from app.deps.ratelimit import rate_limit_user
from app.schemas.pharmacy_cms import (
    DashboardResponse,
    MedicineListResponse,
    CashierDashboardResponse,
    CashierKpisResponse,
    TopSkuItem,
    AvgBasketHourResponse,
    BranchComparisonResponse,
    RefundsResponse,
)

router = APIRouter(prefix="/pharmacy", tags=["pharmacy_cms"])


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    if current_user.role == Role.pharmacy_owner.value and not current_user.is_approved:
        return {"tenant_id": tenant_id, "status": "pending_approval"}
    return {"tenant_id": tenant_id, "message": "Pharmacy dashboard placeholder"}


@router.get("/medicines", response_model=MedicineListResponse)
def list_medicines(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
    db: Session = Depends(get_db),
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    query = db.query(Medicine).filter(Medicine.tenant_id == tenant_id)
    if q:
        like = f"%{q}%"
        query = query.filter((Medicine.name.ilike(like)) | (Medicine.sku.ilike(like)))
    total = query.count()
    rows = query.order_by(Medicine.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "tenant_id": tenant_id,
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [
            {
                "id": r.id,
                "name": r.name,
                "sku": r.sku,
                "category": getattr(r, "category", None),
                "manufacturer": getattr(r, "manufacturer", None),
            }
            for r in rows
        ],
    }


@router.get("/cashier/dashboard", response_model=CashierDashboardResponse)
def cashier_dashboard(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.cashier)),
    db: Session = Depends(get_db),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    total_sales = db.query(func.coalesce(func.sum(Sale.total_amount), 0.0)).filter(Sale.tenant_id == tenant_id).scalar() or 0.0
    return {"tenant_id": tenant_id, "total_sales": float(total_sales)}


@router.get("/cashier/kpis", response_model=CashierKpisResponse)
def cashier_kpis(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.cashier)),
    db: Session = Depends(get_db),
    branch: str | None = None,
    _rl=Depends(rate_limit_user("cashier_kpis_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    now = datetime.utcnow()
    start_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    # Today revenue
    sale_filters = [Sale.tenant_id == tenant_id, and_(Sale.created_at >= start_day, Sale.created_at <= now)]
    if branch:
        sale_filters.append(Sale.branch == branch)
    today_revenue = (
        db.query(func.coalesce(func.sum(Sale.total_amount), 0.0)).filter(*sale_filters).scalar() or 0.0
    )
    # Items sold today
    items_sold = (
        db.query(func.coalesce(func.sum(SaleItem.quantity), 0))
        .join(Sale, Sale.id == SaleItem.sale_id)
        .filter(*sale_filters)
        .scalar()
        or 0
    )
    # Discounts and tax sums
    discounts_sum = db.query(func.coalesce(func.sum(Sale.discount_amount), 0.0)).filter(*sale_filters).scalar() or 0.0
    tax_sum = db.query(func.coalesce(func.sum(Sale.tax_amount), 0.0)).filter(*sale_filters).scalar() or 0.0
    # Transactions count for avg ticket
    tx_count = db.query(func.count(Sale.id)).filter(*sale_filters).scalar() or 0
    hours = max(1.0, (now - start_day).total_seconds() / 3600.0)
    items_per_hour = round(float(items_sold) / hours, 2)
    return {
        "tenant_id": tenant_id,
        "today_revenue": float(today_revenue),
        "items_sold": int(items_sold),
        "items_per_hour": items_per_hour,
        "discounts_sum": float(discounts_sum),
        "tax_sum": float(tax_sum),
        "avg_ticket": round(float(today_revenue) / max(1, int(tx_count)), 2),
        "branch": branch,
    }


@router.get("/top-skus", response_model=list[TopSkuItem])
def top_skus(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner, Role.cashier)),
    db: Session = Depends(get_db),
    days: int = 30,
    limit: int = 10,
    branch: str | None = None,
    _rl=Depends(rate_limit_user("top_skus_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    until = datetime.utcnow()
    since = until - timedelta(days=max(1, days))
    q = (
        db.query(
            Medicine.name.label("name"),
            func.sum(SaleItem.quantity).label("qty"),
            func.sum(SaleItem.line_total).label("revenue"),
        )
        .join(Sale, Sale.id == SaleItem.sale_id)
        .join(Medicine, Medicine.id == SaleItem.medicine_id)
        .filter(Sale.tenant_id == tenant_id)
        .filter(and_(Sale.created_at >= since, Sale.created_at <= until))
    )
    if branch:
        q = q.filter(Sale.branch == branch)
    rows = (
        q.group_by(Medicine.name)
        .order_by(func.sum(SaleItem.quantity).desc())
        .limit(limit)
        .all()
    )
    return [{"name": r.name, "qty": int(r.qty or 0), "revenue": float(r.revenue or 0.0)} for r in rows]


@router.get("/cashier/avg-basket-by-hour", response_model=AvgBasketHourResponse)
def avg_basket_by_hour(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.cashier)),
    db: Session = Depends(get_db),
    days: int = 7,
    branch: str | None = None,
    _rl=Depends(rate_limit_user("avg_basket_hour_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    until = datetime.utcnow()
    since = until - timedelta(days=max(1, days))
    q = db.query(
        func.strftime("%H", Sale.created_at).label("hour") if db.bind.dialect.name == "sqlite" else func.to_char(Sale.created_at, "HH24").label("hour"),
        func.coalesce(func.sum(Sale.total_amount), 0.0).label("revenue"),
        func.count(Sale.id).label("tx_count"),
    ).filter(Sale.tenant_id == tenant_id, and_(Sale.created_at >= since, Sale.created_at <= until))
    if branch:
        q = q.filter(Sale.branch == branch)
    rows = q.group_by("hour").order_by("hour").all()
    result = []
    for r in rows:
        revenue = float(r.revenue or 0.0)
        tx = int(r.tx_count or 0)
        avg_ticket = round(revenue / max(1, tx), 2)
        result.append({"hour": str(r.hour), "avg_ticket": avg_ticket, "revenue": revenue, "tx_count": tx})
    return {"tenant_id": tenant_id, "branch": branch, "days": days, "hours": result}


@router.get("/branch-comparison", response_model=BranchComparisonResponse)
def branch_comparison(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    days: int = 30,
    limit: int = 5,
    _rl=Depends(rate_limit_user("branch_comp_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    until = datetime.utcnow()
    since = until - timedelta(days=max(1, days))
    rows = (
        db.query(Sale.branch.label("branch"), func.coalesce(func.sum(Sale.total_amount), 0.0).label("revenue"))
        .filter(Sale.tenant_id == tenant_id, and_(Sale.created_at >= since, Sale.created_at <= until))
        .group_by(Sale.branch)
        .order_by(func.coalesce(func.sum(Sale.total_amount), 0.0).desc())
        .limit(limit)
        .all()
    )
    return {"tenant_id": tenant_id, "days": days, "branches": [{"branch": r.branch, "revenue": float(r.revenue or 0.0)} for r in rows]}


@router.get("/refunds", response_model=RefundsResponse)
def refunds_summary(
    tenant_id: str = Depends(require_tenant),
    user=Depends(require_role(Role.admin, Role.cashier, Role.pharmacy_owner)),
    db: Session = Depends(get_db),
    days: int = 30,
    branch: str | None = None,
    _rl=Depends(rate_limit_user("refunds_user")),
    _ten=Depends(enforce_user_tenant),
    _sub=Depends(enforce_subscription_active),
):
    until = datetime.utcnow()
    since = until - timedelta(days=max(1, days))
    q = db.query(func.coalesce(func.sum(Sale.total_amount), 0.0).label("refunds"))\
        .filter(Sale.tenant_id == tenant_id, and_(Sale.created_at >= since, Sale.created_at <= until), Sale.total_amount < 0)
    if branch:
        q = q.filter(Sale.branch == branch)
    refunds = float(q.scalar() or 0.0)
    return {"tenant_id": tenant_id, "days": days, "branch": branch, "refunds_total": refunds}
