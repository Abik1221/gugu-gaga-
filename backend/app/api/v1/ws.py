from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.notifications.ws import ws_manager

router = APIRouter()


@router.websocket("/ws/notifications")
async def ws_notifications(websocket: WebSocket, tenant_id: Optional[str] = None, user_id: Optional[int] = None):
    await ws_manager.connect(websocket, tenant_id, user_id)
    try:
        while True:
            # We don't expect client messages; keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, tenant_id, user_id)
