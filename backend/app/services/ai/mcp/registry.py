from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Dict, Mapping, Optional

from sqlalchemy.orm import Session


class ToolExecutionError(RuntimeError):
    """Raised when a tool fails during execution."""


@dataclass
class ToolContext:
    """Execution context passed to each tool handler."""

    tenant_id: str
    user_id: int
    db: Session
    prompt: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


ToolHandler = Callable[[ToolContext, Dict[str, Any]], Mapping[str, Any] | Dict[str, Any]]


@dataclass
class RegisteredTool:
    name: str
    description: str
    handler: ToolHandler
    input_schema: Mapping[str, Any]
    output_schema: Mapping[str, Any]


class MCPToolRegistry:
    """Lightweight in-process registry that mirrors the MCP tool surface."""

    def __init__(self) -> None:
        self._tools: Dict[str, RegisteredTool] = {}

    def register(
        self,
        *,
        name: str,
        description: str,
        handler: ToolHandler,
        input_schema: Optional[Mapping[str, Any]] = None,
        output_schema: Optional[Mapping[str, Any]] = None,
    ) -> None:
        if name in self._tools:
            raise ValueError(f"Tool '{name}' is already registered")
        tool = RegisteredTool(
            name=name,
            description=description,
            handler=handler,
            input_schema=input_schema or {},
            output_schema=output_schema or {},
        )
        self._tools[name] = tool

    def has_tool(self, name: str) -> bool:
        return name in self._tools

    def list_tools(self) -> Dict[str, RegisteredTool]:
        return dict(self._tools)

    def execute(self, name: str, *, context: ToolContext, params: Optional[Dict[str, Any]] = None) -> Mapping[str, Any]:
        if name not in self._tools:
            raise ToolExecutionError(f"Unknown tool '{name}'")
        tool = self._tools[name]
        try:
            result = tool.handler(context, params or {})
            if not isinstance(result, Mapping):
                raise ToolExecutionError(
                    f"Tool '{name}' returned non-mapping result of type {type(result).__name__}"
                )
            return result
        except ToolExecutionError:
            raise
        except Exception as exc:  # pragma: no cover - defensive guard
            raise ToolExecutionError(f"Tool '{name}' failed: {exc}") from exc
