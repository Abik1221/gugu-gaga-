from __future__ import annotations

from typing import Dict, Any, Optional

"""Concrete LangGraph runner template with safe fallback.

If a real LangGraph implementation is available, it will be used. Otherwise,
we fall back to a minimal rule-based mapping that the orchestrator will still
validate through a SQL safety gate.
"""





def run_graph(*, prompt: str, tenant_id: str, user_id: int, schema: Optional[str] = None) -> Dict[str, Any]:
    """AI-powered SQL generation with business intelligence."""
    try:
        from app.services.ai.gemini import GeminiClient
        client = GeminiClient()
        
        if client.is_configured():
            system_prompt = f"""
Generate secure SQL for business intelligence. ONLY SELECT queries with tenant_id filter.

Schema: {schema or 'Use fallback patterns'}

Rules:
1. SELECT only - never INSERT/UPDATE/DELETE
2. Always include: WHERE table.tenant_id = :tenant_id
3. Use schema tables/columns only
4. Return JSON: {{"sql": "...", "intent": "..."}}

Question: {prompt}
"""
            
            response = client.ask(system_prompt, "sql_generation", str(user_id))
            if "answer" in response:
                try:
                    import json
                    answer = response["answer"].strip()
                    if answer.startswith("```json"):
                        answer = answer[7:]
                    if answer.endswith("```"):
                        answer = answer[:-3]
                    
                    result = json.loads(answer.strip())
                    if "sql" in result and "tenant_id" in result["sql"].lower():
                        return {
                            "sql": result["sql"],
                            "intent": result.get("intent", "ai_generated")
                        }
                except Exception:
                    pass
        
        return _enhanced_fallback_sql(prompt)
    except Exception:
        return _enhanced_fallback_sql(prompt)


def _enhanced_fallback_sql(prompt: str) -> Dict[str, Any]:
    """Fallback SQL generation for business queries."""
    p = prompt.lower()
    
    # Supplier queries
    if "supplier" in p:
        if "order" in p or "purchase" in p:
            if "pending" in p or "waiting" in p:
                return {
                    "sql": (
                        "SELECT o.id, o.status, o.total_amount, o.created_at, o.expected_delivery, sp.business_name "
                        "FROM orders o JOIN suppliers sp ON sp.id = o.supplier_id "
                        "WHERE o.tenant_id = :tenant_id AND o.status IN ('pending', 'confirmed', 'shipped') "
                        "ORDER BY o.expected_delivery ASC LIMIT 25"
                    ),
                    "intent": "supplier_pending_orders"
                }
            return {
                "sql": (
                    "SELECT o.id, o.status, o.total_amount, o.created_at, o.expected_delivery, sp.business_name "
                    "FROM orders o JOIN suppliers sp ON sp.id = o.supplier_id "
                    "WHERE o.tenant_id = :tenant_id ORDER BY o.created_at DESC LIMIT 25"
                ),
                "intent": "supplier_orders_analysis"
            }
        if "product" in p or "catalog" in p:
            return {
                "sql": (
                    "SELECT sp.name, sp.unit_price, sp.stock_quantity, sp.minimum_order, s.business_name, s.reliability_score "
                    "FROM supplier_products sp JOIN suppliers s ON s.id = sp.supplier_id "
                    "WHERE sp.tenant_id = :tenant_id AND sp.is_active = 1 ORDER BY s.reliability_score DESC, sp.name"
                ),
                "intent": "supplier_product_catalog"
            }
        if "performance" in p or "reliable" in p or "rating" in p:
            return {
                "sql": (
                    "SELECT s.business_name, s.contact_email, COUNT(o.id) as total_orders, "
                    "AVG(CASE WHEN o.delivered_at IS NOT NULL THEN julianday(o.delivered_at) - julianday(o.created_at) END) as avg_delivery_days, "
                    "s.reliability_score "
                    "FROM suppliers s LEFT JOIN orders o ON o.supplier_id = s.id AND o.tenant_id = :tenant_id "
                    "WHERE s.tenant_id = :tenant_id GROUP BY s.id, s.business_name, s.contact_email, s.reliability_score "
                    "ORDER BY s.reliability_score DESC"
                ),
                "intent": "supplier_performance_metrics"
            }
        # Default supplier overview
        return {
            "sql": (
                "SELECT s.business_name, s.contact_email, s.phone, s.reliability_score, "
                "COUNT(o.id) as recent_orders "
                "FROM suppliers s LEFT JOIN orders o ON o.supplier_id = s.id AND o.tenant_id = :tenant_id "
                "WHERE s.tenant_id = :tenant_id GROUP BY s.id, s.business_name, s.contact_email, s.phone, s.reliability_score "
                "ORDER BY s.reliability_score DESC"
            ),
            "intent": "supplier_overview"
        }
    
    # Enhanced owner queries
    if "revenue" in p:
        if "month" in p:
            return {
                "sql": (
                    "SELECT strftime('%Y-%m', created_at) as month, SUM(total_amount) as revenue "
                    "FROM sales WHERE tenant_id = :tenant_id "
                    "AND created_at >= date('now', '-12 months') "
                    "GROUP BY month ORDER BY month DESC"
                ),
                "intent": "monthly_revenue"
            }
        return {
            "sql": (
                "SELECT DATE(created_at) as day, SUM(total_amount) as revenue "
                "FROM sales WHERE tenant_id = :tenant_id "
                "AND created_at >= date('now', '-30 days') "
                "GROUP BY day ORDER BY day DESC"
            ),
            "intent": "daily_revenue"
        }
    
    if "inventory" in p or "stock" in p:
        if "low" in p:
            return {
                "sql": (
                    "SELECT m.name, ii.quantity, ii.reorder_level "
                    "FROM inventory_items ii JOIN medicines m ON m.id = ii.medicine_id "
                    "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
                    "ORDER BY ii.quantity ASC LIMIT 20"
                ),
                "intent": "low_stock"
            }
        return {
            "sql": (
                "SELECT m.name, SUM(ii.quantity) as total_quantity "
                "FROM inventory_items ii JOIN medicines m ON m.id = ii.medicine_id "
                "WHERE ii.tenant_id = :tenant_id "
                "GROUP BY m.name ORDER BY total_quantity DESC LIMIT 20"
            ),
            "intent": "inventory_summary"
        }
    
    if "staff" in p or "employee" in p:
        return {
            "sql": (
                "SELECT u.email, u.role, u.is_active, COUNT(s.id) as sales_count "
                "FROM users u LEFT JOIN sales s ON s.cashier_user_id = u.id "
                "WHERE u.tenant_id = :tenant_id AND u.role IN ('cashier', 'staff') "
                "GROUP BY u.id, u.email, u.role, u.is_active ORDER BY sales_count DESC"
            ),
            "intent": "staff_performance"
        }
    
    if "top" in p and "sell" in p:
        return {
            "sql": (
                "SELECT m.name, SUM(si.quantity) as qty, SUM(si.line_total) as revenue "
                "FROM sale_items si JOIN medicines m ON m.id = si.medicine_id "
                "JOIN sales s ON s.id = si.sale_id "
                "WHERE s.tenant_id = :tenant_id "
                "GROUP BY m.name ORDER BY qty DESC LIMIT 10"
            ),
            "intent": "top_selling"
        }
    
    # Default query
    return {
        "sql": (
            "SELECT DATE(created_at) as day, COUNT(*) as transactions, "
            "SUM(total_amount) as revenue, AVG(total_amount) as avg_transaction "
            "FROM sales WHERE tenant_id = :tenant_id "
            "AND created_at >= date('now', '-7 days') "
            "GROUP BY day ORDER BY day DESC"
        ),
        "intent": "recent_business_activity"
    }
