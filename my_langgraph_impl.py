from __future__ import annotations

from typing import Dict, Any, Optional

"""Concrete LangGraph runner template with safe fallback.

If a real LangGraph implementation is available, it will be used. Otherwise,
we fall back to a minimal rule-based mapping that the orchestrator will still
validate through a SQL safety gate.
"""


def _fallback_sql(prompt: str) -> Dict[str, Any]:
    p = prompt.lower()
    if "top" in p and "sell" in p:
        return {
            "sql": (
                "SELECT mi.name, SUM(si.quantity) as qty, SUM(si.line_total) as revenue "
                "FROM sale_items si JOIN medicines mi ON mi.id = si.medicine_id "
                "JOIN sales s ON s.id = si.sale_id "
                "WHERE s.tenant_id = :tenant_id "
                "GROUP BY mi.name ORDER BY qty DESC LIMIT 10"
            ),
            "intent": "top_selling",
        }
    if ("low stock" in p) or ("low" in p and "stock" in p):
        return {
            "sql": (
                "SELECT mi.name, ii.quantity, ii.reorder_level FROM inventory_items ii "
                "JOIN medicines mi ON mi.id = ii.medicine_id "
                "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
                "ORDER BY ii.quantity ASC"
            ),
            "intent": "low_stock",
        }
    return {
        "sql": (
            "SELECT DATE(s.created_at) as day, SUM(s.total_amount) as revenue FROM sales s "
            "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-7 day') "
            "GROUP BY day ORDER BY day"
        ),
        "intent": "sales_last_7_days",
    }


def run_graph(*, prompt: str, tenant_id: str, user_id: int, schema: Optional[str] = None) -> Dict[str, Any]:
    """Return {"sql","intent"}, using LangGraph if available, else fallback.

    Arguments:
    - prompt: user text request
    - tenant_id: current tenant context (use for SQL paramization)
    - user_id: current user id (can be used for personalization)
    - schema: compact DB schema overview for LLM grounding (optional)
    """
    try:
        # Example of integrating LangGraph/LangChain (pseudo-code).
        # Replace with your actual graph build and run.
        # from langgraph import Graph
        # from langchain_openai import ChatOpenAI
        # graph = Graph(...)
        # model = ChatOpenAI(model="gpt-4o-mini")
        # result = graph.run(model=model, prompt=prompt, schema=schema, tenant_id=tenant_id, user_id=user_id)
        # return {"sql": str(result["sql"]), "intent": str(result.get("intent", "auto"))}
        raise ImportError("LangGraph/LangChain not installed in this environment")
    except Exception:
        return _fallback_sql(prompt)
