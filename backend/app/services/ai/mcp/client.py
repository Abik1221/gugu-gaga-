from __future__ import annotations

from typing import Any, Dict, Optional

from .server import PharmacyMCPServer, get_default_server


class PharmacyMCPClient:
    """Thin in-process MCP client facade for the analytics agent."""

    def __init__(self, server: Optional[PharmacyMCPServer] = None) -> None:
        self._server = server or get_default_server()

    def is_available(self) -> bool:
        return self._server is not None

    def invoke(
        self,
        tool_name: str,
        *,
        tenant_id: str,
        user_id: int,
        params: Optional[Dict[str, Any]] = None,
        prompt: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if not self._server:
            raise RuntimeError("No MCP server is configured")
        return self._server.handle_tool_call(
            tool_name=tool_name,
            tenant_id=tenant_id,
            user_id=user_id,
            params=params,
            prompt=prompt,
            metadata=metadata,
        )
