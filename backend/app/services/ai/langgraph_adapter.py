from __future__ import annotations

from typing import Protocol, Dict, Any, Optional


class SQLTool(Protocol):
    def generate_sql(self, *, prompt: str, tenant_id: str) -> str: ...


class LangGraphOrchestrator(Protocol):
    """Protocol for plugging in a real LangGraph multi-agent workflow.

    A conforming implementation should:
    - Use an LLM agent graph to interpret prompt
    - Call a SQL tool to produce candidate SQL
    - Optionally call a safety tool/validator
    - Return a dict payload with keys like {"sql": str, "intent": str}
    """

    def run(self, *, prompt: str, tenant_id: str, user_id: int) -> Dict[str, Any]: ...


class HeuristicSQLTool:
    """Fallback SQL tool mirroring current heuristic logic."""

    def generate_sql(self, *, prompt: str, tenant_id: str) -> str:
        p = prompt.lower()
        if "top" in p and "sell" in p:
            return (
                "SELECT mi.name, SUM(si.quantity) as qty, SUM(si.line_total) as revenue "
                "FROM sale_items si JOIN medicines mi ON mi.id = si.medicine_id "
                "JOIN sales s ON s.id = si.sale_id "
                "WHERE s.tenant_id = :tenant_id "
                "GROUP BY mi.name ORDER BY qty DESC LIMIT 10"
            )
        if "low stock" in p or ("low" in p and "stock" in p):
            return (
                "SELECT mi.name, ii.quantity, ii.reorder_level FROM inventory_items ii "
                "JOIN medicines mi ON mi.id = ii.medicine_id "
                "WHERE ii.tenant_id = :tenant_id AND ii.quantity <= ii.reorder_level "
                "ORDER BY ii.quantity ASC"
            )
        return (
            "SELECT DATE(s.created_at) as day, SUM(s.total_amount) as revenue FROM sales s "
            "WHERE s.tenant_id = :tenant_id AND s.created_at >= DATE('now','-7 day') "
            "GROUP BY day ORDER BY day"
        )


class PassthroughLangGraph:
    """Stub orchestrator that uses the heuristic SQL tool; replace with real LangGraph."""

    def __init__(self, tool: Optional[SQLTool] = None):
        self.tool = tool or HeuristicSQLTool()

    def run(self, *, prompt: str, tenant_id: str, user_id: int) -> Dict[str, Any]:
        sql = self.tool.generate_sql(prompt=prompt, tenant_id=tenant_id)
        return {"sql": sql, "intent": "auto"}


class RealLangGraphOrchestrator:
    """Optional wrapper intended to call an actual LangGraph workflow if installed.

    Fallbacks to heuristic tool if the underlying implementation is missing.
    """

    def __init__(self, tool: Optional[SQLTool] = None):
        self.tool = tool or HeuristicSQLTool()
        self._available = False
        try:
            # Try to import a user-provided LangGraph runner
            from my_langgraph_impl import run_graph  # type: ignore
            self._run_graph = run_graph
            self._available = True
        except Exception:
            self._run_graph = None
            self._available = False

    def run(self, *, prompt: str, tenant_id: str, user_id: int, schema: Optional[str] = None) -> Dict[str, Any]:
        if self._available:
            try:
                result = self._run_graph(prompt=prompt, tenant_id=tenant_id, user_id=user_id, schema=schema)
                return {"sql": str(result.get("sql", "")), "intent": str(result.get("intent", "auto"))}
            except Exception:
                pass
        # Fallback
        sql = self.tool.generate_sql(prompt=prompt, tenant_id=tenant_id)
        return {"sql": sql, "intent": "auto"}
