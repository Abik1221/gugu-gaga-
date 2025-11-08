from fastapi import FastAPI

from .core.settings import settings
from .api.v1.routes import api_router
from .api.v1.analytics import router as analytics_router
from .middleware.tenant import TenantContextMiddleware
from .middleware.logging import LoggingMiddleware
from fastapi.middleware.cors import CORSMiddleware
from .db.session import Base, get_engine, SessionLocal
from .core.errors import register_error_handlers
import asyncio
from typing import List
from .services.notifications.triggers import notify_low_stock, notify_subscription_expiring
from .services.billing.subscriptions import process_subscription_due
from .services.integrations.monitoring import warn_expiring_tokens

tags_metadata = [
    {"name": "auth", "description": "Authentication, registration, JWT tokens"},
    {"name": "pharmacy_cms", "description": "Pharmacy management, dashboard, medicines"},
    {"name": "sales", "description": "POS-like sales operations and transactions"},
    {"name": "inventory", "description": "Stock levels, low stock and expiry alerts"},
    {"name": "affiliate", "description": "Affiliate links and commission summaries"},
    {"name": "admin", "description": "KYC approvals and payment verification"},
    {"name": "ai", "description": "AI insights via Gemini (rate limited)"},
]

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Multi-tenant AI-powered CMS and management system for pharmacies.",
    openapi_tags=tags_metadata,
)

# Multi-tenant context middleware
app.add_middleware(TenantContextMiddleware)
# Request/response logging middleware
app.add_middleware(LoggingMiddleware)

# CORS configuration
origins = [o.strip() for o in (settings.cors_origins or "").split(",") if o.strip()] or (["*"] if settings.environment != "production" else [])
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Temporary: auto-create tables until Alembic migrations are added
    if settings.environment != "production":
        engine = get_engine()
        Base.metadata.create_all(bind=engine)
    register_error_handlers(app)
    # Start scheduler loop if enabled
    if settings.enable_scheduler:
        async def _scheduler_loop():
            interval = max(60, int(settings.scheduler_interval_seconds or 600))
            tenants: List[str] = [t.strip() for t in (settings.scheduler_tenants or "").split(",") if t.strip()]
            while True:
                try:
                    if tenants:
                        for t in tenants:
                            db = SessionLocal()
                            try:
                                try:
                                    notify_low_stock(db, tenant_id=t)
                                    notify_subscription_expiring(db, tenant_id=t)
                                    process_subscription_due(db, tenant_id=t)
                                    warn_expiring_tokens(db, tenant_id=t)
                                finally:
                                    db.close()
                            except Exception:
                                pass
                    await asyncio.sleep(interval)
                except asyncio.CancelledError:
                    break

        app.state.scheduler_task = asyncio.create_task(_scheduler_loop())


@app.on_event("shutdown")
async def on_shutdown():
    task = getattr(app.state, "scheduler_task", None)
    if task:
        task.cancel()


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
