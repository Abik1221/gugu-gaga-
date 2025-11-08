from __future__ import annotations

from typing import Dict, Any, Optional

"""Concrete LangGraph runner template with safe fallback.

If a real LangGraph implementation is available, it will be used. Otherwise,
we fall back to a minimal rule-based mapping that the orchestrator will still
validate through a SQL safety gate.
"""





def run_graph(*, prompt: str, tenant_id: str, user_id: int, schema: Optional[str] = None) -> Dict[str, Any]:
    """Enhanced SQL generation with comprehensive business intelligence."""
    try:
        from app.services.ai.gemini import GeminiClient
        client = GeminiClient()
        
        if client.is_configured():
            system_prompt = f"""
You are Mesob AI, a business intelligence assistant for a multi-tenant business management platform.

STRICT RULES:
1. ONLY generate SELECT queries - never INSERT, UPDATE, DELETE, DROP, ALTER, CREATE
2. ALWAYS include tenant_id filter: WHERE table.tenant_id = :tenant_id
3. Use ONLY tables and columns from the provided schema
4. Return ONLY valid JSON with "sql" and "intent" keys
5. NEVER hallucinate - if unsure, use a safe fallback query

SCHEMA: {schema or 'No schema available'}

COMMON BUSINESS QUERIES:
- Revenue trends: sales table with date grouping
- Inventory status: inventory_items with quantity checks
- Staff performance: users joined with sales data
- Supplier orders: orders table with supplier relationships
- Product analytics: medicines/products with sales data

User question: {prompt}

Respond with JSON only:
{{
  "sql": "SELECT ... WHERE tenant_id = :tenant_id",
  "intent": "descriptive_intent"
}}
"""
            
            response = client.ask(system_prompt, "sql_generation", str(user_id))
            if "answer" in response:
                try:
                    import json
                    result = json.loads(response["answer"])
                    if "sql" in result and "tenant_id" in result["sql"].lower():
                        return result
                except:
                    pass
        
        return _enhanced_fallback_sql(prompt)
    except Exception:
        return _enhanced_fallback_sql(prompt)


def _enhanced_fallback_sql(prompt: str) -> Dict[str, Any]:
    """Enhanced fallback with supplier and owner specific queries."""
    p = prompt.lower()
    
    # Supplier-specific queries
    if "supplier" in p:
        if "order" in p:
            return {
                "sql": (
                    "SELECT o.id, o.status, o.total_amount, o.created_at, sp.business_name "
                    "FROM orders o JOIN suppliers sp ON sp.id = o.supplier_id "
                    "WHERE o.tenant_id = :tenant_id ORDER BY o.created_at DESC LIMIT 20"
                ),
                "intent": "supplier_orders"
            }
        if "product" in p:
            return {
                "sql": (
                    "SELECT sp.name, sp.unit_price, sp.stock_quantity, s.business_name "
                    "FROM supplier_products sp JOIN suppliers s ON s.id = sp.supplier_id "
                    "WHERE sp.tenant_id = :tenant_id AND sp.is_active = 1 ORDER BY sp.name"
                ),
                "intent": "supplier_products"
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
    
    # Default safe query
    return {
        "sql": (
            "SELECT DATE(created_at) as day, COUNT(*) as transactions, SUM(total_amount) as revenue "
            "FROM sales WHERE tenant_id = :tenant_id "
            "AND created_at >= date('now', '-7 days') "
            "GROUP BY day ORDER BY day DESC"
        ),
        "intent": "recent_activity"
    }
