from __future__ import annotations

from typing import Any, Dict, List, Tuple

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.chat import ChatMessage
from app.services.ai.gemini import GeminiClient
from app.core.settings import settings
from app.services.ai.langgraph_adapter import PassthroughLangGraph, HeuristicSQLTool, RealLangGraphOrchestrator
from app.services.db.schema import schema_overview_string
from app.services.ai.usage import record_ai_usage


FORBIDDEN_SQL = ("insert", "update", "delete", "drop", "alter", "create", "grant", "revoke", "truncate")


def _is_safe_sql(sql: str) -> bool:
    s = sql.strip().lower()
    if not s.startswith("select"):
        return False
    return not any(tok in s for tok in FORBIDDEN_SQL)


def _rows_to_dicts(rows) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    for row in rows:
        if hasattr(row, "_mapping"):
            results.append(dict(row._mapping))
        else:
            results.append(dict(row))
    return results


def _heuristic_sql_from_prompt(prompt: str) -> Tuple[str, str]:
    p = prompt.lower()
    if "top" in p and "sell" in p:
        sql = (
            "SELECT mi.name, SUM(si.quantity) as qty, SUM(si.line_total) as revenue "
            "FROM sale_items si JOIN medicines mi ON mi.id = si.medicine_id "
            "JOIN sales s ON s.id = si.sale_id "
            "WHERE s.tenant_id = :tenant_id "
            "GROUP BY mi.name ORDER BY qty DESC LIMIT 10"
        )
        return sql, "top_selling"
    if "low stock" in p or "low" in p and "stock" in p:
        sql = (
            "SELECT mi.name, ii.quantity, ii.reorder_level FROM inventory_items ii "
            "JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
            "ORDER BY ii.quantity ASC"
        )
        return sql, "low_stock"
    # Default: total sales last 7 days
    sql = (
        "SELECT DATE(s.created_at) as day, SUM(s.total_amount) as revenue FROM sales s "
        "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-7 day') "
        "GROUP BY day ORDER BY day"
    )
    return sql, "sales_last_7_days"


def process_message(
    db: Session,
    *,
    tenant_id: str,
    user_id: int,
    thread_id: int,
    prompt: str,
    user_role: str = "user",
) -> Dict[str, Any]:
    # System prompt establishes assistant behavior in pharmacy domain.
    SYSTEM_PROMPT = (
        "You are Zemen AI, a helpful assistant for a multi-tenant pharmacy system. "
        "Only use safe, read-only queries. Summarize results clearly and concisely. "
        "If the request is unclear or unsafe, explain why and suggest a safer query."
    )
    # Save user message
    user_msg = ChatMessage(
        thread_id=thread_id,
        tenant_id=tenant_id,
        user_id=user_id,
        role=user_role,
        content=prompt,
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    client = GeminiClient()
    # Choose SQL generation path: Real LangGraph orchestrator (if enabled) vs heuristic
    if settings.use_langgraph:
        orchestrator = RealLangGraphOrchestrator(tool=HeuristicSQLTool())
        schema_ctx = schema_overview_string(db)
        result = orchestrator.run(prompt=f"{SYSTEM_PROMPT}\n\nUser: {prompt}", tenant_id=tenant_id, user_id=user_id, schema=schema_ctx)
        sql = result.get("sql", "")
        intent = result.get("intent", "auto")
        if not sql:
            sql, intent = _heuristic_sql_from_prompt(prompt)
    else:
        sql, intent = _heuristic_sql_from_prompt(prompt)

    if not _is_safe_sql(sql):
        assistant_text = "Sorry, the generated query was not safe to execute."
        asst_msg = ChatMessage(
            thread_id=thread_id, tenant_id=tenant_id, user_id=None, role="assistant", content=assistant_text
        )
        db.add(asst_msg)
        db.commit()
        db.refresh(asst_msg)
        # log usage (heuristic model)
        record_ai_usage(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            thread_id=thread_id,
            prompt_text=f"{SYSTEM_PROMPT}\n\nUser: {prompt}",
            completion_text=assistant_text,
            model="heuristic-sql",
        )
        return {"answer": assistant_text, "intent": intent}

    try:
        rows = db.execute(text(sql), {"tenant_id": tenant_id}).fetchall()
        data = _rows_to_dicts(rows)
        assistant_text = {"intent": intent, "rows": data}
    except Exception:
        assistant_text = {"error": "query_failed"}

    asst_msg = ChatMessage(
        thread_id=thread_id, tenant_id=tenant_id, user_id=None, role="assistant", content=str(assistant_text)
    )
    db.add(asst_msg)
    db.commit()
    db.refresh(asst_msg)
    # Record usage after completion
    record_ai_usage(
        db,
        tenant_id=tenant_id,
        user_id=user_id,
        thread_id=thread_id,
        prompt_text=f"{SYSTEM_PROMPT}\n\nUser: {prompt}\n\nSQL: {sql}",
        completion_text=str(assistant_text),
        model=("langgraph+heuristic" if settings.use_langgraph else "heuristic-sql"),
    )

    return assistant_text
