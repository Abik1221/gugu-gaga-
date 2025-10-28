from __future__ import annotations

from typing import Any, Dict, List, Tuple
import json
import math
import re

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.chat import ChatMessage, ChatThread
from app.services.ai.gemini import GeminiClient
from app.core.settings import settings
from app.services.ai.langgraph_adapter import PassthroughLangGraph, HeuristicSQLTool, RealLangGraphOrchestrator
from app.services.db.schema import schema_overview_string
from app.services.ai.usage import record_ai_usage


FORBIDDEN_SQL = ("insert", "update", "delete", "drop", "alter", "create", "grant", "revoke", "truncate")
SCOPE_KEYWORDS = {
    "sale",
    "revenue",
    "inventory",
    "stock",
    "product",
    "medicine",
    "med",
    "sold",
    "cashier",
    "staff",
    "branch",
    "payment",
    "order",
    "transaction",
    "profit",
    "customer",
    "owner",
    "pharmacy",
    "staff",
    "employee",
    "cashier",
    "worker",
}
OUT_OF_SCOPE_MESSAGE = "Sorry, that request is outside the pharmacy analytics scope."
AGENT_SQL_PROMPT_TEMPLATE = """
You are Zemen AI, the analytics assistant for a multi-tenant pharmacy platform.
Generate a single safe SQL SELECT statement (or CTE-based SELECT) that answers the user's question.

Hard rules:
1. NEVER use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, GRANT, REVOKE, or TRUNCATE.
2. NEVER modify data. Read-only analytics only.
3. ALWAYS filter using the provided tenant_id parameter (use ":tenant_id" placeholder) so results only include that tenant's records.
4. Use columns that exist in the schema.
5. If the request is outside pharmacy analytics scope, reply with intent "out_of_scope" and no SQL.

Return JSON:
{
  "intent": "<short_intent_slug>",
  "sql": "<single SELECT query string or empty if out_of_scope>"
}

Schema overview for reference:
{schema}

User question:
{user_prompt}
"""


def _is_in_scope(prompt: str) -> bool:
    p = prompt.lower()
    return any(keyword in p for keyword in SCOPE_KEYWORDS)


def _strip_leading_comments(sql: str) -> str:
    s = sql.lstrip()
    while s.startswith("--") or s.startswith("/*"):
        if s.startswith("--"):
            newline = s.find("\n")
            if newline == -1:
                return ""
            s = s[newline + 1 :].lstrip()
        else:
            end = s.find("*/")
            if end == -1:
                return ""
            s = s[end + 2 :].lstrip()
    return s


def _is_safe_sql(sql: str) -> bool:
    stripped = _strip_leading_comments(sql)
    if not stripped:
        return False
    s = stripped.strip().lower()
    if not s:
        return False
    if s.startswith("with"):
        if "select" not in s:
            return False
    elif not s.startswith("select"):
        return False
    # Reject multi-statement attempts
    if ";" in s.rstrip(";\n "):
        return False
    tokens = re.findall(r"[a-z_]+", s)
    return not any(tok in FORBIDDEN_SQL for tok in tokens)


def _build_langgraph_prompt(user_prompt: str, *, schema: str) -> str:
    return AGENT_SQL_PROMPT_TEMPLATE.format(user_prompt=user_prompt, schema=schema or "(schema unavailable)")


def _rows_to_dicts(rows) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    for row in rows:
        if hasattr(row, "_mapping"):
            results.append(dict(row._mapping))
        else:
            results.append(dict(row))
    return results


def _clean_title(text: str, max_length: int = 100) -> str:
    cleaned = re.sub(r"\s+", " ", text.strip())
    cleaned = cleaned.strip(" .,:;-")
    if not cleaned:
        return "Conversation"
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length].rstrip(" .,:;-") + "…"
    return cleaned


def _fallback_title(prompt: str) -> str:
    sanitized = re.sub(r"[\r\n]+", " ", prompt).strip()
    if not sanitized:
        return "Conversation"
    words = sanitized.split()
    snippet = " ".join(words[:8])
    if len(words) > 8:
        snippet += "…"
    return _clean_title(snippet.title())


def _generate_chat_title(prompt: str, *, user_id: int | None) -> str:
    client = GeminiClient()
    if client.is_configured():
        response = client.ask(
            (
                "Craft a concise (max 6 words) title summarizing this pharmacy analytics chat. "
                "Only return the title text without additional commentary or punctuation.\n\n"
                f"User message: {prompt}"
            ),
            scope="chat_title",
            user_id=str(user_id) if user_id is not None else None,
        )
        candidate = None
        if isinstance(response, dict):
            candidate = response.get("answer")
        if candidate:
            if candidate.startswith("[") and "]" in candidate:
                candidate = candidate.split("]", 1)[-1].strip()
            candidate = candidate.strip().strip('"')
            cleaned = _clean_title(candidate)
            if cleaned and not cleaned.lower().startswith("[not-implemented]") and not cleaned.lower().startswith("[stubbed]"):
                return cleaned
    return _fallback_title(prompt)


def _heuristic_sql_from_prompt(prompt: str) -> Tuple[str | None, str]:
    p = prompt.lower()
    if not _is_in_scope(p):
        return None, "out_of_scope"
    count_words = {"how much", "how many", "total", "count", "number"}
    if (
        any(phrase in p for phrase in count_words)
        and ("product" in p or "products" in p or "inventory" in p or "stock" in p)
    ):
        sql = (
            "SELECT COALESCE(SUM(ii.quantity), 0) AS total_quantity "
            "FROM inventory_items ii "
            "WHERE ii.tenant_id = :tenant_id"
        )
        return sql, "inventory_total"
    if any(phrase in p for phrase in count_words) and ("staff" in p or "employee" in p or "cashier" in p):
        sql = (
            "SELECT COUNT(u.id) AS staff_count "
            "FROM users u "
            "WHERE u.tenant_id = :tenant_id AND u.role IN ('pharmacy_owner','cashier','staff')"
        )
        return sql, "staff_count"
    if "owner" in p and "status" in p:
        sql = (
            "SELECT u.id, u.email, u.is_active, u.is_approved, u.is_verified "
            "FROM users u WHERE u.tenant_id = :tenant_id AND u.role = 'pharmacy_owner'"
        )
        return sql, "owner_status"
    if "revenue" in p and ("today" in p or "yesterday" in p or "this" in p and "week" in p):
        sql = (
            "SELECT DATE(s.created_at) as period, SUM(s.total_amount) as revenue "
            "FROM sales s "
            "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-7 day') "
            "GROUP BY DATE(s.created_at) ORDER BY period DESC"
        )
        return sql, "daily_revenue_trend"
    if "month" in p and "revenue" in p:
        sql = (
            "SELECT strftime('%Y-%m', s.created_at) as month, SUM(s.total_amount) as revenue "
            "FROM sales s "
            "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-6 month') "
            "GROUP BY month ORDER BY month DESC"
        )
        return sql, "monthly_revenue"
    if "cashier" in p and ("performance" in p or "sales" in p):
        sql = (
            "SELECT u.id as cashier_id, COALESCE(u.first_name || ' ' || u.last_name, u.email) as name, "
            "COUNT(s.id) as transactions, COALESCE(SUM(s.total_amount),0) as revenue "
            "FROM users u LEFT JOIN sales s ON s.cashier_user_id = u.id AND s.tenant_id = :tenant_id "
            "WHERE u.tenant_id = :tenant_id AND u.role = 'cashier' "
            "GROUP BY u.id, name ORDER BY revenue DESC"
        )
        return sql, "cashier_productivity"
    if "branch" in p and ("compare" in p or "comparison" in p or "performance" in p):
        sql = (
            "SELECT s.branch, COUNT(s.id) as transactions, COALESCE(SUM(s.total_amount),0) as revenue "
            "FROM sales s WHERE s.tenant_id = :tenant_id "
            "GROUP BY s.branch ORDER BY revenue DESC"
        )
        return sql, "branch_performance"
    if "low stock" in p or ("low" in p and "stock" in p):
        sql = (
            "SELECT mi.name, ii.quantity, ii.reorder_level FROM inventory_items ii "
            "JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
            "ORDER BY ii.quantity ASC"
        )
        return sql, "low_stock"
    if "stock" in p or "inventory" in p:
        sql = (
            "SELECT mi.name, COALESCE(SUM(ii.quantity),0) AS quantity, "
            "MIN(ii.reorder_level) AS reorder_level, COALESCE(COUNT(DISTINCT ii.branch), 0) AS branches "
            "FROM inventory_items ii "
            "JOIN medicines mi ON mi.id = ii.medicine_id "
            "WHERE ii.tenant_id = :tenant_id "
            "GROUP BY mi.name "
            "ORDER BY quantity DESC LIMIT 20"
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
    # Default: total sales last 7 days
    sql = (
        "SELECT DATE(s.created_at) as day, SUM(s.total_amount) as revenue FROM sales s "
        "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-7 day') "
        "GROUP BY day ORDER BY day"
    )
    return sql, "sales_last_7_days"


def _summarize_results(
    client: GeminiClient,
    *,
    tenant_id: str,
    user_id: int,
    prompt: str,
    intent: str,
    rows: List[Dict[str, Any]],
) -> str:
    if not rows:
        empty_messages = {
            "daily_revenue_trend": "I couldn't find any recorded sales for the requested period.",
            "monthly_revenue": "No monthly revenue has been recorded yet for this tenant.",
            "top_selling": "No sales have been logged yet, so there are no top-selling medicines to report.",
            "low_stock": "All tracked medicines are above their reorder levels right now.",
            "inventory_snapshot": "I didn't find any inventory records for this pharmacy.",
            "branch_performance": "There are no branch sales recorded yet to compare.",
            "cashier_productivity": "No cashier transactions have been captured so far.",
            "pharmacy_overview": "There is no activity recorded for this tenant yet.",
            "sales_last_7_days": "No sales were logged in the last 7 days.",
            "inventory_total": "There are no inventory quantities recorded yet.",
            "staff_count": "No staff accounts exist for this tenant yet.",
        }
        return empty_messages.get(intent, "No matching records were found for that query.")

    preview = json.dumps(rows[:10], ensure_ascii=False)
    summary_prompt = (
        "You are Zemen AI, summarising pharmacy analytics for the tenant. "
        "Answer the user's question concisely using only the structured data provided. "
        "Highlight key figures, include totals when relevant, and avoid speculation.\n\n"
        f"User question: {prompt}\n"
        f"Intent: {intent}\n"
        f"Structured rows (JSON): {preview}"
    )

    if client.is_configured():
        response = client.ask(summary_prompt, scope="chat_answer", user_id=str(user_id))
        answer = response.get("answer") if isinstance(response, dict) else None
        if answer:
            return answer.strip()

    # Deterministic fallbacks when Gemini is not configured
    if intent == "inventory_total":
        total = rows[0].get("total_quantity")
        if total is None:
            return "I could not determine the total inventory quantity."
        return f"Your pharmacy currently has {int(total)} units recorded across all inventory items."
    if intent == "staff_count":
        count = rows[0].get("staff_count", 0)
        noun = "member" if count == 1 else "members"
        return f"You have {int(count)} active staff {noun} in your tenant."
    if intent == "owner_status":
        owners = rows
        active = sum(1 for row in owners if row.get("is_active"))
        approved = sum(1 for row in owners if row.get("is_approved"))
        verified = sum(1 for row in owners if row.get("is_verified"))
        return (
            f"Owner accounts — active: {active}, approved: {approved}, verified: {verified}."
        )
    if intent == "inventory_snapshot":
        top = rows[0]
        top_name = top.get("name", "Unknown")
        top_qty = top.get("quantity", 0)
        unique_items = len(rows)
        total_units = sum(int(row.get("quantity", 0) or 0) for row in rows)
        return (
            f"Inventory summary: {unique_items} products tracked with {total_units} total units. "
            f"Top item is {top_name} with {top_qty} units on hand."
        )
    if intent == "top_selling":
        top_items = ", ".join(f"{row.get('name', 'Unknown')} ({row.get('qty', 0)} units)" for row in rows[:3])
        return f"The top selling products are: {top_items}."
    if intent == "low_stock":
        item = rows[0]
        return (
            "Lowest stock item: "
            f"{item.get('name', 'Unknown')} with {item.get('quantity', 0)} units (reorder level {item.get('reorder_level', 0)})."
        )
    if intent == "sales_last_7_days":
        total_revenue = sum(float(row.get("revenue", 0.0) or 0.0) for row in rows)
        return f"Total revenue over the last 7 days is {total_revenue:,.2f}."
    if intent == "daily_revenue_trend":
        latest = rows[0] if rows else {}
        latest_period = latest.get("period", "recent days")
        latest_rev = float(latest.get("revenue", 0.0) or 0.0)
        total_revenue = sum(float(row.get("revenue", 0.0) or 0.0) for row in rows)
        return (
            f"Revenue over the last week totals {total_revenue:,.2f}, with {latest_period} bringing in {latest_rev:,.2f}."
        )
    if intent == "monthly_revenue":
        month_rows = rows[:3]
        parts = [f"{row.get('month', 'Unknown')}: {float(row.get('revenue', 0.0) or 0.0):,.2f}" for row in month_rows]
        return "Recent monthly revenue — " + "; ".join(parts)
    if intent == "cashier_productivity":
        top = rows[0]
        return (
            f"Top cashier {top.get('name', 'Unknown')} handled {int(top.get('transactions', 0) or 0)} transactions "
            f"for {float(top.get('revenue', 0.0) or 0.0):,.2f} in revenue."
        )
    if intent == "branch_performance":
        parts = [
            f"{row.get('branch') or 'Unassigned'}: {float(row.get('revenue', 0.0) or 0.0):,.2f} revenue"
            for row in rows[:3]
        ]
        return "Branch comparison — " + "; ".join(parts)
    if intent == "pharmacy_overview":
        overview = rows[0]
        staff = int(overview.get("staff", 0) or 0)
        products = int(overview.get("products", 0) or 0)
        units = int(overview.get("inventory_units", 0) or 0)
        revenue_30d = float(overview.get("revenue_30d", 0.0) or 0.0)
        return (
            f"Tenant snapshot — staff: {staff}, products: {products}, "
            f"total units in stock: {units}, revenue last 30 days: {revenue_30d:,.2f}."
        )

    return "Here are the requested analytics based on your data."


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
    thread: ChatThread | None = (
        db.query(ChatThread)
        .filter(ChatThread.id == thread_id, ChatThread.tenant_id == tenant_id)
        .first()
    )
    if thread is None:
        raise ValueError("Chat thread not found for message processing")

    # Save user message
    user_msg = ChatMessage(
        thread_id=thread_id,
        tenant_id=tenant_id,
        user_id=user_id,
        role=user_role,
        content=prompt,
    )
    if not thread.title or not thread.title.strip():
        thread.title = _generate_chat_title(prompt, user_id=user_id)

    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    client = GeminiClient()
    # Choose SQL generation path: Real LangGraph orchestrator (if enabled) vs heuristic
    if settings.use_langgraph:
        orchestrator = RealLangGraphOrchestrator(tool=HeuristicSQLTool())
        schema_ctx = schema_overview_string(db)
        agent_prompt = _build_langgraph_prompt(prompt, schema=schema_ctx)
        result = orchestrator.run(prompt=agent_prompt, tenant_id=tenant_id, user_id=user_id, schema=schema_ctx)
        sql = result.get("sql", "")
        intent = result.get("intent", "auto")
        if not sql:
            sql, intent = _heuristic_sql_from_prompt(prompt)
    else:
        sql, intent = _heuristic_sql_from_prompt(prompt)

    if not sql:
        assistant_payload = {"intent": intent, "answer": OUT_OF_SCOPE_MESSAGE}
        asst_msg = ChatMessage(
            thread_id=thread_id,
            tenant_id=tenant_id,
            user_id=None,
            role="assistant",
            content=json.dumps(assistant_payload),
        )
        db.add(asst_msg)
        db.commit()
        db.refresh(asst_msg)
        record_ai_usage(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            thread_id=thread_id,
            prompt_text=f"{SYSTEM_PROMPT}\n\nUser: {prompt}",
            completion_text=assistant_payload["answer"],
            model="heuristic-sql",
        )
        return assistant_payload

    if not _is_safe_sql(sql):
        fallback_sql, fallback_intent = _heuristic_sql_from_prompt(prompt)
        if fallback_sql and _is_safe_sql(fallback_sql):
            sql, intent = fallback_sql, fallback_intent
        else:
            assistant_text = "Sorry, the generated query was not safe to execute."
            assistant_payload = {"intent": intent, "answer": assistant_text}
            asst_msg = ChatMessage(
                thread_id=thread_id,
                tenant_id=tenant_id,
                user_id=None,
                role="assistant",
                content=json.dumps(assistant_payload),
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
            return assistant_payload

    if "tenant_id" not in sql.lower():
        assistant_text = "Query rejected because it did not include a tenant filter."
        assistant_payload = {"intent": intent, "answer": assistant_text}
        asst_msg = ChatMessage(
            thread_id=thread_id,
            tenant_id=tenant_id,
            user_id=None,
            role="assistant",
            content=json.dumps(assistant_payload),
        )
        db.add(asst_msg)
        db.commit()
        db.refresh(asst_msg)
        record_ai_usage(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            thread_id=thread_id,
            prompt_text=f"{SYSTEM_PROMPT}\n\nUser: {prompt}",
            completion_text=assistant_text,
            model="heuristic-sql",
        )
        return assistant_payload

    try:
        rows = db.execute(text(sql), {"tenant_id": tenant_id}).fetchall()
        data = _rows_to_dicts(rows)
        answer = _summarize_results(
            client,
            tenant_id=tenant_id,
            user_id=user_id,
            prompt=prompt,
            intent=intent,
            rows=data,
        )
        assistant_text = {"intent": intent, "rows": data, "answer": answer}
    except Exception:
        assistant_text = {"intent": intent, "error": "query_failed"}

    asst_msg = ChatMessage(
        thread_id=thread_id,
        tenant_id=tenant_id,
        user_id=None,
        role="assistant",
        content=json.dumps(assistant_text, default=str),
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
        completion_text=json.dumps(assistant_text, default=str),
        model=("langgraph+heuristic" if settings.use_langgraph else "heuristic-sql"),
    )

    return assistant_text
