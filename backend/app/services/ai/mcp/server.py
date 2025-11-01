from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime
from typing import Any, Dict, Generator, Optional

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.ai.sql_heuristics import heuristic_sql_and_intent
from app.services.ai.sql_utils import is_safe_sql, rows_to_dicts
from .registry import MCPToolRegistry, ToolContext, ToolExecutionError


class PharmacyMCPServer:
    """In-process MCP-aligned server hosting pharmacy analytics tools.

    This stub keeps everything in-process. If we later adopt a standalone MCP
    runtime, we can port these handlers without touching the orchestrator.
    """

    def __init__(self, registry: Optional[MCPToolRegistry] = None) -> None:
        self.registry = registry or MCPToolRegistry()

    @contextmanager
    def session_scope(self) -> Generator[Session, None, None]:
        session: Session = SessionLocal()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def handle_tool_call(
        self,
        *,
        tool_name: str,
        tenant_id: str,
        user_id: int,
        params: Optional[Dict[str, Any]] = None,
        prompt: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        with self.session_scope() as db:
            context = ToolContext(
                tenant_id=tenant_id,
                user_id=user_id,
                db=db,
                prompt=prompt,
                metadata=metadata or {},
            )
            result = self.registry.execute(tool_name, context=context, params=params)
            return dict(result)


def _register_default_tools(registry: MCPToolRegistry) -> None:
    from app.services.owner_analytics import (
        get_branch_comparison,
        get_inventory_health,
        get_period_bounds,
        get_revenue_summary,
        get_top_products,
    )

    def _resolve_period(params: Optional[Dict[str, Any]]) -> str:
        horizon = (params or {}).get("horizon") or "month"
        try:
            return str(horizon).lower()
        except Exception:
            return "month"

    def revenue_summary_tool(context: ToolContext, params: Dict[str, Any]) -> Dict[str, Any]:
        params = params or {}
        horizon = _resolve_period(params)
        now_value = params.get("now")
        now = now_value if isinstance(now_value, datetime) else None
        since, until = get_period_bounds(horizon, now=now)
        summary = get_revenue_summary(
            context.db,
            tenant_id=context.tenant_id,
            since=since,
            until=until,
        )
        return {
            "horizon": horizon,
            "total_revenue": summary["total_revenue"],
            "sale_count": summary["sale_count"],
            "units_sold": summary["units_sold"],
        }

    registry.register(
        name="owner.revenue_summary",
        description="Summarize revenue, sale counts, and units for the selected period.",
        handler=revenue_summary_tool,
        input_schema={
            "type": "object",
            "properties": {
                "horizon": {
                    "type": "string",
                    "enum": ["day", "week", "month", "quarter", "year"],
                    "default": "month",
                }
            },
        },
        output_schema={
            "type": "object",
            "properties": {
                "horizon": {"type": "string"},
                "total_revenue": {"type": "number"},
                "sale_count": {"type": "integer"},
                "units_sold": {"type": "integer"},
            },
            "required": ["total_revenue", "sale_count", "units_sold"],
        },
    )

    def sql_analytics_tool(context: ToolContext, params: Dict[str, Any]) -> Dict[str, Any]:
        params = params or {}
        prompt_text = params.get("prompt") if isinstance(params.get("prompt"), str) else context.prompt or ""
        sql, intent = heuristic_sql_and_intent(prompt_text)
        if not is_safe_sql(sql):
            raise ToolExecutionError("Generated SQL did not pass safety validation")
        if "tenant_id" not in sql.lower():
            raise ToolExecutionError("Generated SQL missing tenant filter")
        rows = context.db.execute(text(sql), {"tenant_id": context.tenant_id}).fetchall()
        return {
            "intent": intent,
            "sql": sql,
            "rows": rows_to_dicts(rows),
        }

    registry.register(
        name="owner.sql_analytics",
        description="Generate and run a tenant-scoped analytics SQL query derived from the prompt.",
        handler=sql_analytics_tool,
        input_schema={
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Explicit prompt override for SQL generation."}
            },
        },
        output_schema={
            "type": "object",
            "properties": {
                "intent": {"type": "string"},
                "sql": {"type": "string"},
                "rows": {
                    "type": "array",
                    "items": {"type": "object"},
                },
            },
            "required": ["sql", "rows"],
        },
    )

    def inventory_health_tool(context: ToolContext, params: Dict[str, Any]) -> Dict[str, Any]:
        slices = get_inventory_health(context.db, tenant_id=context.tenant_id)
        return {"segments": list(slices)}

    registry.register(
        name="owner.inventory_health",
        description="Break down inventory status counts (healthy, low stock, out of stock, expiring).",
        handler=inventory_health_tool,
        output_schema={
            "type": "object",
            "properties": {
                "segments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "label": {"type": "string"},
                            "count": {"type": "integer"},
                        },
                        "required": ["label", "count"],
                    },
                }
            },
            "required": ["segments"],
        },
    )

    def top_products_tool(context: ToolContext, params: Dict[str, Any]) -> Dict[str, Any]:
        params = params or {}
        limit = params.get("limit")
        try:
            parsed_limit = int(limit)
        except (TypeError, ValueError):
            parsed_limit = 5
        parsed_limit = max(1, min(20, parsed_limit))
        since, _ = get_period_bounds("month")
        rows = get_top_products(
            context.db,
            tenant_id=context.tenant_id,
            since=since,
            limit=parsed_limit,
        )
        return {"products": rows}

    registry.register(
        name="owner.top_products",
        description="List the best-selling medicines for the last 30 days by revenue.",
        handler=top_products_tool,
        input_schema={
            "type": "object",
            "properties": {
                "limit": {"type": "integer", "minimum": 1, "maximum": 20, "default": 5}
            },
        },
        output_schema={
            "type": "object",
            "properties": {
                "products": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "revenue": {"type": "number"},
                            "quantity": {"type": "integer"},
                        },
                        "required": ["name", "revenue", "quantity"],
                    },
                }
            },
            "required": ["products"],
        },
    )

    def branch_comparison_tool(context: ToolContext, params: Dict[str, Any]) -> Dict[str, Any]:
        since, _ = get_period_bounds("month")
        aggregates = get_branch_comparison(context.db, tenant_id=context.tenant_id, since=since)
        rows = [
            {
                "branch": item.branch,
                "revenue": item.revenue,
                "sale_count": item.sale_count,
                "units_sold": item.units_sold,
            }
            for item in aggregates
        ]
        rows.sort(key=lambda entry: entry.get("revenue", 0.0), reverse=True)
        return {"branches": rows}

    registry.register(
        name="owner.branch_comparison",
        description="Compare sales metrics across branches for the last 30 days.",
        handler=branch_comparison_tool,
        output_schema={
            "type": "object",
            "properties": {
                "branches": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "branch": {"type": ["string", "null"]},
                            "revenue": {"type": "number"},
                            "sale_count": {"type": "integer"},
                            "units_sold": {"type": "integer"},
                        },
                        "required": ["revenue", "sale_count", "units_sold"],
                    },
                }
            },
            "required": ["branches"],
        },
    )


_default_server: Optional[PharmacyMCPServer] = None


def get_default_server() -> PharmacyMCPServer:
    global _default_server
    if _default_server is None:
        registry = MCPToolRegistry()
        _register_default_tools(registry)
        _default_server = PharmacyMCPServer(registry=registry)
    return _default_server


def set_default_server(server: PharmacyMCPServer) -> None:
    global _default_server
    _default_server = server
