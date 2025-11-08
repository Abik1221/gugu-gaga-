from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

from app.deps.auth import get_current_user
from app.deps.tenant import require_tenant, enforce_subscription_active
from app.db.deps import get_db
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/owner/overview")
def get_owner_analytics_overview(
    tenant_id: str = Depends(require_tenant),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
    _sub=Depends(enforce_subscription_active),
):
    """Comprehensive owner analytics overview."""
    
    # Revenue trends
    revenue_query = text("""
        SELECT 
            DATE(created_at) as date,
            SUM(total_amount) as revenue,
            COUNT(*) as orders,
            COUNT(DISTINCT customer_id) as customers
        FROM sales 
        WHERE tenant_id = :tenant_id 
        AND created_at >= DATE('now', :days_back)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
    """)
    
    revenue_data = db.execute(revenue_query, {
        "tenant_id": tenant_id, 
        "days_back": f"-{days} days"
    }).fetchall()
    
    # Inventory health
    inventory_query = text("""
        SELECT 
            m.category,
            SUM(ii.quantity) as current_stock,
            AVG(ii.reorder_level) as avg_reorder_level,
            COUNT(CASE WHEN ii.quantity <= ii.reorder_level THEN 1 END) as low_stock_items,
            COUNT(*) as total_items
        FROM inventory_items ii
        JOIN medicines m ON m.id = ii.medicine_id
        WHERE ii.tenant_id = :tenant_id
        GROUP BY m.category
        ORDER BY current_stock DESC
    """)
    
    inventory_data = db.execute(inventory_query, {"tenant_id": tenant_id}).fetchall()
    
    # Supplier performance
    supplier_query = text("""
        SELECT 
            s.business_name,
            COUNT(o.id) as total_orders,
            AVG(CASE WHEN o.status = 'delivered' THEN 100.0 ELSE 0.0 END) as on_time_rate,
            SUM(o.total_amount) as total_value,
            AVG(COALESCE(r.rating, 0)) as avg_rating
        FROM suppliers s
        LEFT JOIN orders o ON o.supplier_id = s.id AND o.tenant_id = :tenant_id
        LEFT JOIN order_reviews r ON r.order_id = o.id
        WHERE s.tenant_id = :tenant_id
        GROUP BY s.id, s.business_name
        HAVING COUNT(o.id) > 0
        ORDER BY total_value DESC
        LIMIT 10
    """)
    
    supplier_data = db.execute(supplier_query, {"tenant_id": tenant_id}).fetchall()
    
    # Staff performance
    staff_query = text("""
        SELECT 
            u.email,
            COALESCE(u.first_name || ' ' || u.last_name, u.email) as name,
            u.role,
            COUNT(s.id) as transactions,
            SUM(s.total_amount) as total_sales,
            AVG(s.total_amount) as avg_transaction
        FROM users u
        LEFT JOIN sales s ON s.cashier_user_id = u.id AND s.tenant_id = :tenant_id
        WHERE u.tenant_id = :tenant_id 
        AND u.role IN ('cashier', 'staff', 'pharmacy_owner')
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.role
        ORDER BY total_sales DESC NULLS LAST
        LIMIT 10
    """)
    
    staff_data = db.execute(staff_query, {"tenant_id": tenant_id}).fetchall()
    
    # Summary metrics
    summary_query = text("""
        SELECT 
            (SELECT SUM(total_amount) FROM sales WHERE tenant_id = :tenant_id AND created_at >= DATE('now', :days_back)) as total_revenue,
            (SELECT COUNT(*) FROM sales WHERE tenant_id = :tenant_id AND created_at >= DATE('now', :days_back)) as total_orders,
            (SELECT COUNT(DISTINCT customer_id) FROM sales WHERE tenant_id = :tenant_id AND created_at >= DATE('now', :days_back)) as unique_customers,
            (SELECT COUNT(*) FROM inventory_items ii JOIN medicines m ON m.id = ii.medicine_id WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level) as low_stock_items
    """)
    
    summary = db.execute(summary_query, {
        "tenant_id": tenant_id,
        "days_back": f"-{days} days"
    }).fetchone()
    
    return {
        "summary": {
            "total_revenue": float(summary.total_revenue or 0),
            "total_orders": int(summary.total_orders or 0),
            "unique_customers": int(summary.unique_customers or 0),
            "low_stock_items": int(summary.low_stock_items or 0),
            "avg_order_value": float(summary.total_revenue or 0) / max(int(summary.total_orders or 0), 1)
        },
        "revenue_trends": [
            {
                "date": row.date,
                "revenue": float(row.revenue or 0),
                "orders": int(row.orders or 0),
                "customers": int(row.customers or 0)
            } for row in revenue_data
        ],
        "inventory_health": [
            {
                "category": row.category or "Uncategorized",
                "current_stock": int(row.current_stock or 0),
                "avg_reorder_level": float(row.avg_reorder_level or 0),
                "low_stock_items": int(row.low_stock_items or 0),
                "total_items": int(row.total_items or 0),
                "status": "critical" if row.low_stock_items > row.total_items * 0.3 else "low" if row.low_stock_items > 0 else "healthy"
            } for row in inventory_data
        ],
        "supplier_performance": [
            {
                "name": row.business_name,
                "total_orders": int(row.total_orders or 0),
                "on_time_rate": float(row.on_time_rate or 0),
                "total_value": float(row.total_value or 0),
                "avg_rating": float(row.avg_rating or 0)
            } for row in supplier_data
        ],
        "staff_performance": [
            {
                "name": row.name,
                "role": row.role,
                "transactions": int(row.transactions or 0),
                "total_sales": float(row.total_sales or 0),
                "avg_transaction": float(row.avg_transaction or 0),
                "efficiency": min(100, (int(row.transactions or 0) / max(days, 1)) * 10)  # Simplified efficiency calc
            } for row in staff_data
        ]
    }

@router.get("/supplier/overview")
def get_supplier_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
):
    """Comprehensive supplier analytics overview."""
    
    # Get supplier profile
    supplier_query = text("""
        SELECT id FROM suppliers WHERE user_id = :user_id
    """)
    supplier = db.execute(supplier_query, {"user_id": current_user.id}).fetchone()
    
    if not supplier:
        return {"error": "Supplier profile not found"}
    
    supplier_id = supplier.id
    
    # Order performance
    order_query = text("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as total_orders,
            COUNT(CASE WHEN status IN ('delivered', 'completed') THEN 1 END) as fulfilled_orders,
            SUM(total_amount) as revenue
        FROM orders 
        WHERE supplier_id = :supplier_id 
        AND created_at >= DATE('now', :days_back)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
    """)
    
    order_data = db.execute(order_query, {
        "supplier_id": supplier_id,
        "days_back": f"-{days} days"
    }).fetchall()
    
    # Product performance
    product_query = text("""
        SELECT 
            sp.name,
            COUNT(oi.id) as units_sold,
            SUM(oi.total_price) as revenue,
            AVG(sp.unit_price) as avg_price,
            (AVG(sp.unit_price) - AVG(sp.unit_price * 0.7)) / AVG(sp.unit_price) * 100 as margin
        FROM supplier_products sp
        LEFT JOIN order_items oi ON oi.product_id = sp.id
        LEFT JOIN orders o ON o.id = oi.order_id
        WHERE sp.supplier_id = :supplier_id
        AND (o.created_at >= DATE('now', :days_back) OR o.created_at IS NULL)
        GROUP BY sp.id, sp.name
        ORDER BY revenue DESC NULLS LAST
        LIMIT 10
    """)
    
    product_data = db.execute(product_query, {
        "supplier_id": supplier_id,
        "days_back": f"-{days} days"
    }).fetchall()
    
    # Customer insights
    customer_query = text("""
        SELECT 
            u.email,
            COALESCE(u.first_name || ' ' || u.last_name, u.email) as name,
            COUNT(o.id) as total_orders,
            SUM(o.total_amount) as total_value,
            AVG(COALESCE(r.rating, 0)) as satisfaction
        FROM orders o
        JOIN users u ON u.id = o.customer_id
        LEFT JOIN order_reviews r ON r.order_id = o.id
        WHERE o.supplier_id = :supplier_id
        AND o.created_at >= DATE('now', :days_back)
        GROUP BY u.id, u.email, u.first_name, u.last_name
        ORDER BY total_value DESC
        LIMIT 10
    """)
    
    customer_data = db.execute(customer_query, {
        "supplier_id": supplier_id,
        "days_back": f"-{days} days"
    }).fetchall()
    
    # Delivery metrics
    delivery_query = text("""
        SELECT 
            status,
            COUNT(*) as count,
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
        FROM orders 
        WHERE supplier_id = :supplier_id
        AND created_at >= DATE('now', :days_back)
        GROUP BY status
    """)
    
    delivery_data = db.execute(delivery_query, {
        "supplier_id": supplier_id,
        "days_back": f"-{days} days"
    }).fetchall()
    
    # Summary metrics
    summary_query = text("""
        SELECT 
            COUNT(*) as total_orders,
            COUNT(CASE WHEN status IN ('delivered', 'completed') THEN 1 END) as fulfilled_orders,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as avg_order_value,
            AVG(COALESCE(r.rating, 0)) as avg_rating
        FROM orders o
        LEFT JOIN order_reviews r ON r.order_id = o.id
        WHERE o.supplier_id = :supplier_id
        AND o.created_at >= DATE('now', :days_back)
    """)
    
    summary = db.execute(summary_query, {
        "supplier_id": supplier_id,
        "days_back": f"-{days} days"
    }).fetchone()
    
    return {
        "summary": {
            "total_orders": int(summary.total_orders or 0),
            "fulfilled_orders": int(summary.fulfilled_orders or 0),
            "fulfillment_rate": (int(summary.fulfilled_orders or 0) / max(int(summary.total_orders or 0), 1)) * 100,
            "total_revenue": float(summary.total_revenue or 0),
            "avg_order_value": float(summary.avg_order_value or 0),
            "avg_rating": float(summary.avg_rating or 0)
        },
        "order_trends": [
            {
                "date": row.date,
                "total_orders": int(row.total_orders or 0),
                "fulfilled_orders": int(row.fulfilled_orders or 0),
                "revenue": float(row.revenue or 0)
            } for row in order_data
        ],
        "product_performance": [
            {
                "name": row.name,
                "units_sold": int(row.units_sold or 0),
                "revenue": float(row.revenue or 0),
                "avg_price": float(row.avg_price or 0),
                "margin": float(row.margin or 25)  # Default margin if calculation fails
            } for row in product_data
        ],
        "customer_insights": [
            {
                "name": row.name,
                "total_orders": int(row.total_orders or 0),
                "total_value": float(row.total_value or 0),
                "satisfaction": float(row.satisfaction or 0)
            } for row in customer_data
        ],
        "delivery_metrics": [
            {
                "status": "On Time" if row.status in ['delivered', 'completed'] else "Delayed" if row.status == 'pending' else "Cancelled",
                "count": int(row.count or 0),
                "percentage": float(row.percentage or 0)
            } for row in delivery_data
        ]
    }