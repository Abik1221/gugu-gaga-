from __future__ import annotations

from typing import Dict, Set, Tuple, Optional

from fastapi import WebSocket


class WSManager:
    def __init__(self) -> None:
        # Map (tenant_id, user_id or None) -> set of websockets
        self._connections: Dict[Tuple[Optional[str], Optional[int]], Set[WebSocket]] = {}

    async def connect(self, ws: WebSocket, tenant_id: Optional[str], user_id: Optional[int]) -> None:
        await ws.accept()
        key = (tenant_id, user_id)
        self._connections.setdefault(key, set()).add(ws)

    def disconnect(self, ws: WebSocket, tenant_id: Optional[str], user_id: Optional[int]) -> None:
        key = (tenant_id, user_id)
        conns = self._connections.get(key)
        if conns and ws in conns:
            conns.remove(ws)
            if not conns:
                self._connections.pop(key, None)

    async def send_user(self, tenant_id: Optional[str], user_id: Optional[int], message: dict) -> None:
        key = (tenant_id, user_id)
        for ws in list(self._connections.get(key, set())):
            try:
                await ws.send_json(message)
            except Exception:
                # Best-effort cleanup
                self.disconnect(ws, tenant_id, user_id)

    async def broadcast_tenant(self, tenant_id: str, message: dict) -> None:
        # Send to tenant broadcast group (user_id None)
        key = (tenant_id, None)
        for ws in list(self._connections.get(key, set())):
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(ws, tenant_id, None)


ws_manager = WSManager()
