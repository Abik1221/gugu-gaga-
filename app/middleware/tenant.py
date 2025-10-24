import contextvars
from typing import Optional

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Context var to hold current tenant id per request
_current_tenant: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("current_tenant", default=None)


def set_current_tenant(tenant_id: Optional[str]) -> None:
    _current_tenant.set(tenant_id)


def get_current_tenant_id() -> Optional[str]:
    return _current_tenant.get()

class TenantContextMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, header_name: str = "X-Tenant-ID", query_param: str = "tenant_id"):
        super().__init__(app)
        self.header_name = header_name
        self.query_param = query_param

    async def dispatch(self, request: Request, call_next):
        # Try multiple common header aliases to reduce 400s from missing tenant id during Swagger testing
        header_candidates = [
            self.header_name,
            "X-Tenant",
            "Tenant-Id",
            "Tenant-ID",
            "X-TenantID",
            "X-Tenant-Id",
        ]
        tenant_id = None
        for h in header_candidates:
            val = request.headers.get(h)
            if val:
                tenant_id = val
                break
        if not tenant_id:
            # Try multiple query param aliases
            query_candidates = [self.query_param, "tenant", "tenantId", "tenantID"]
            for q in query_candidates:
                val = request.query_params.get(q)
                if val:
                    tenant_id = val
                    break
        set_current_tenant(tenant_id)
        try:
            response = await call_next(request)
            return response
        finally:
            # Clear after request
            set_current_tenant(None)
