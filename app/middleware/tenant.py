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
        tenant_id = request.headers.get(self.header_name)
        if not tenant_id:
            tenant_id = request.query_params.get(self.query_param)
        set_current_tenant(tenant_id)
        try:
            response = await call_next(request)
            return response
        finally:
            # Clear after request
            set_current_tenant(None)
