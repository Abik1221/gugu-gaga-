from __future__ import annotations

from typing import Dict, Any, Optional, Tuple, List

from app.services.ai.mcp import PharmacyMCPClient, ToolExecutionError


class RealLangGraphOrchestrator:
    """Orchestrator that routes prompts through MCP tools (and optional LangGraph)."""

    def __init__(self, mcp_client: Optional[PharmacyMCPClient] = None):
        self._available = False
        self._mcp_client: Optional[PharmacyMCPClient] = None
        self._mcp_available = False
        try:
            # Try to import a user-provided LangGraph runner
            from my_langgraph_impl import run_graph  # type: ignore
            self._run_graph = run_graph
            self._available = True
        except Exception:
            self._run_graph = None
            self._available = False
        try:
            client = mcp_client or PharmacyMCPClient()
            if client.is_available():
                self._mcp_client = client
                self._mcp_available = True
        except Exception:
            self._mcp_client = None
            self._mcp_available = False

    def run(self, *, prompt: str, tenant_id: str, user_id: int, schema: Optional[str] = None) -> Dict[str, Any]:
        if self._mcp_available:
            try:
                mcp_payload = self._run_with_mcp(prompt=prompt, tenant_id=tenant_id, user_id=user_id)
                if mcp_payload:
                    return mcp_payload
            except ToolExecutionError:
                pass
            except Exception:
                pass
        if self._available:
            try:
                result = self._run_graph(prompt=prompt, tenant_id=tenant_id, user_id=user_id, schema=schema)
                return {"sql": str(result.get("sql", "")), "intent": str(result.get("intent", "auto"))}
            except Exception:
                pass
        raise ToolExecutionError("Unable to fulfill request via MCP or LangGraph")

    def _run_with_mcp(self, *, prompt: str, tenant_id: str, user_id: int) -> Dict[str, Any]:
        if not self._mcp_client:
            return {}
        tool_name, params, intent = self._select_tool(prompt)
        if not tool_name:
            return {}
        result = self._mcp_client.invoke(
            tool_name,
            tenant_id=tenant_id,
            user_id=user_id,
            params=params,
            prompt=prompt,
            metadata={"source": "langgraph"},
        )
        rows, sql = self._normalize_tool_output(tool_name, result)
        if rows is None and not sql:
            return {}
        if rows is None:
            rows = []
        derived_intent = intent or self._extract_intent(tool_name, result)
        return {
            "sql": sql or "",
            "intent": derived_intent,
            "rows": rows,
            "tool": tool_name,
            "raw_tool_payload": result,
        }

    def _select_tool(self, prompt: str) -> Tuple[str | None, Dict[str, Any], str | None]:
        lowered = prompt.lower()
        params: Dict[str, Any] = {}
        intent: Optional[str] = None

        if any(keyword in lowered for keyword in ("top selling", "top product", "best seller", "best-selling")) or (
            "top" in lowered and ("sell" in lowered or "product" in lowered)
        ):
            limit = self._extract_limit(lowered)
            if limit:
                params["limit"] = limit
            intent = "top_selling"
            return "owner.top_products", params, intent

        if any(keyword in lowered for keyword in ("branch", "outlet", "location")):
            intent = "branch_performance"
            return "owner.branch_comparison", params, intent

        if any(keyword in lowered for keyword in ("inventory", "stock", "expiry", "expiring")):
            intent = "inventory_health"
            return "owner.inventory_health", params, intent

        if "revenue" in lowered or "sales" in lowered:
            for horizon in ("day", "week", "month", "quarter", "year"):
                if horizon in lowered:
                    params["horizon"] = horizon
                    break
            intent = "revenue_summary"
            return "owner.revenue_summary", params, intent

        params["prompt"] = prompt
        return "owner.sql_analytics", params, None

    def _extract_limit(self, prompt: str) -> Optional[int]:
        import re

        match = re.search(r"top\s+(\d+)", prompt)
        if match:
            try:
                return int(match.group(1))
            except ValueError:
                return None
        return None

    def _normalize_tool_output(self, tool_name: str, payload: Dict[str, Any]) -> Tuple[Optional[List[Dict[str, Any]]], Optional[str]]:
        if tool_name == "owner.top_products":
            products = payload.get("products")
            if not isinstance(products, list):
                return None, None
            rows: List[Dict[str, Any]] = []
            for item in products:
                if not isinstance(item, dict):
                    continue
                rows.append(
                    {
                        "name": item.get("name", "Unknown"),
                        "qty": item.get("quantity", 0),
                        "revenue": item.get("revenue", 0.0),
                    }
                )
            return rows, None
        if tool_name == "owner.branch_comparison":
            branches = payload.get("branches")
            if not isinstance(branches, list):
                return None, None
            return [dict(item) for item in branches if isinstance(item, dict)], None
        if tool_name == "owner.inventory_health":
            segments = payload.get("segments")
            if not isinstance(segments, list):
                return None, None
            return [dict(item) for item in segments if isinstance(item, dict)], None
        if tool_name == "owner.revenue_summary":
            if not isinstance(payload, dict):
                return None, None
            rows = [
                {
                    "horizon": payload.get("horizon"),
                    "total_revenue": payload.get("total_revenue", 0.0),
                    "sale_count": payload.get("sale_count", 0),
                    "units_sold": payload.get("units_sold", 0),
                }
            ]
            return rows, None
        if tool_name == "owner.sql_analytics":
            if not isinstance(payload, dict):
                return None, None
            rows = payload.get("rows")
            sql = payload.get("sql")
            if not isinstance(rows, list) or not isinstance(sql, str):
                return None, None
            normalized_rows = [dict(item) for item in rows if isinstance(item, dict)]
            return normalized_rows, sql
        return None, None

    def _extract_intent(self, tool_name: str, payload: Dict[str, Any]) -> str:
        if tool_name == "owner.sql_analytics" and isinstance(payload, dict):
            intent = payload.get("intent")
            if isinstance(intent, str) and intent:
                return intent
        return tool_name
