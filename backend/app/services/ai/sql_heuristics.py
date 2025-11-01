from __future__ import annotations

from typing import Tuple


def heuristic_sql_and_intent(prompt: str) -> Tuple[str, str]:
    """Return (sql, intent) for a natural-language analytics prompt."""
    p = (prompt or "").lower()
    if "branch" in p or "outlet" in p or "location" in p:
        sql = (
            "SELECT s.branch, COALESCE(SUM(s.total_amount), 0) AS revenue, "
            "COUNT(DISTINCT s.id) AS sale_count, "
            "COALESCE(SUM(si.quantity), 0) AS units_sold "
            "FROM sales s "
            "LEFT JOIN sale_items si ON si.sale_id = s.id "
            "WHERE s.tenant_id = :tenant_id "
            "AND s.created_at >= DATE('now','-30 day') "
            "GROUP BY s.branch ORDER BY revenue DESC"
        )
        return sql, "branch_performance"
    if "low stock" in p or ("low" in p and "stock" in p):
        sql = (
            "SELECT mi.name, ii.quantity, ii.reorder_level, ii.branch "
            "FROM inventory_items ii "
            "JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
            "ORDER BY ii.quantity ASC"
        )
        return sql, "low_stock"
    if "expiring" in p or "expiry" in p or "expire" in p:
        sql = (
            "SELECT mi.name, ii.branch, ii.expiry_date, ii.quantity "
            "FROM inventory_items ii "
            "JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id AND ii.expiry_date IS NOT NULL "
            "AND ii.expiry_date <= DATE('now', '+30 day') "
            "ORDER BY ii.expiry_date ASC"
        )
        return sql, "expiring_lots"
    if "supplier" in p or "restock" in p or "purchase" in p:
        sql = (
            "SELECT mi.name, ii.quantity, ii.reorder_level, "
            "CASE WHEN ii.reorder_level > 0 THEN MAX(ii.reorder_level - ii.quantity, 0) ELSE 0 END AS suggested_order "
            "FROM inventory_items ii JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
            "GROUP BY mi.name, ii.quantity, ii.reorder_level "
            "ORDER BY suggested_order DESC"
        )
        return sql, "supplier_restock"
    if "inventory" in p or "stock" in p:
        sql = (
            "SELECT mi.name, COALESCE(SUM(ii.quantity),0) AS quantity, "
            "MIN(ii.reorder_level) AS reorder_level, COALESCE(COUNT(DISTINCT ii.branch), 0) AS branches "
            "FROM inventory_items ii "
            "JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id "
            "GROUP BY mi.name ORDER BY quantity DESC LIMIT 20"
        )
        return sql, "inventory_snapshot"
    if "overview" in p or "summary" in p or ("pharmacy" in p and "status" in p):
        sql = " ".join(
            [
                "SELECT",
                "(SELECT COUNT(*) FROM users u WHERE u.tenant_id = :tenant_id AND u.role IN ('pharmacy_owner','cashier','staff')) AS staff,",
                "(SELECT COUNT(*) FROM medicines m WHERE m.tenant_id = :tenant_id) AS products,",
                "(SELECT COALESCE(SUM(ii.quantity),0) FROM inventory_items ii WHERE ii.tenant_id = :tenant_id) AS inventory_units,",
                "(SELECT COALESCE(SUM(s.total_amount),0) FROM sales s WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-30 day')) AS revenue_30d",
            ]
        )
        return sql, "pharmacy_overview"
    if "top" in p and "sell" in p:
        sql = (
            "SELECT mi.name, SUM(si.quantity) as qty, SUM(si.line_total) as revenue "
            "FROM sale_items si JOIN medicines mi ON mi.id = si.medicine_id "
            "JOIN sales s ON s.id = si.sale_id "
            "WHERE s.tenant_id = :tenant_id "
            "GROUP BY mi.name ORDER BY qty DESC LIMIT 10"
        )
        return sql, "top_selling"
    if "refund" in p or "return" in p:
        sql = (
            "SELECT s.branch, COUNT(s.id) AS refund_count, ABS(SUM(s.total_amount)) AS refund_value "
            "FROM sales s "
            "WHERE s.tenant_id = :tenant_id AND s.total_amount < 0 "
            "AND s.created_at >= DATE('now','-30 day') "
            "GROUP BY s.branch"
        )
        return sql, "refund_summary"
    if "discount" in p or "promotion" in p:
        sql = (
            "SELECT DATE(s.created_at) as day, "
            "SUM(CASE WHEN s.discount_amount > 0 THEN s.discount_amount ELSE 0 END) AS total_discounts, "
            "SUM(s.total_amount) AS revenue_after_discount "
            "FROM sales s "
            "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-30 day') "
            "GROUP BY day ORDER BY day DESC"
        )
        return sql, "discount_impact"
    if "customer" in p and ("frequency" in p or "loyal" in p or "repeat" in p):
        sql = (
            "SELECT u.id AS customer_id, COALESCE(u.first_name || ' ' || u.last_name, u.email) AS customer_name, "
            "COUNT(s.id) AS orders, MAX(s.created_at) AS last_order_at "
            "FROM users u JOIN sales s ON s.customer_id = u.id "
            "WHERE u.tenant_id = :tenant_id AND s.tenant_id = :tenant_id "
            "GROUP BY u.id, customer_name ORDER BY orders DESC LIMIT 20"
        )
        return sql, "customer_frequency"
    # Default: total sales last 7 days
    sql = (
        "SELECT DATE(s.created_at) as day, SUM(s.total_amount) as revenue FROM sales s "
        "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-7 day') "
        "GROUP BY day ORDER BY day"
    )
    return sql, "sales_last_7_days"
