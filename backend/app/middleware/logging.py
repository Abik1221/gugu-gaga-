from __future__ import annotations

import time
import uuid
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        start = time.perf_counter()
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        # Attach request_id to state so handlers can read it
        request.state.request_id = request_id
        # Basic request log
        try:
            client = request.client.host if request.client else "-"
            method = request.method
            path = request.url.path
            print(f"[REQ] {request_id} {client} {method} {path}")
        except Exception:
            pass
        # Proceed
        response = await call_next(request)
        # Timing and response status
        try:
            duration_ms = int((time.perf_counter() - start) * 1000)
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time-ms"] = str(duration_ms)
            status = response.status_code
            print(f"[RES] {request_id} {status} {duration_ms}ms")
        except Exception:
            pass
        return response
