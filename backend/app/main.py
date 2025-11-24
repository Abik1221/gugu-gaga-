from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
from starlette.responses import JSONResponse

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
from .services.notifications.triggers import notify_low_stock, notify_subscription_expiring, notify_expiring_items
from .services.billing.subscriptions import process_subscription_due
from .services.integrations.monitoring import warn_expiring_tokens

tags_metadata = [
    {"name": "auth", "description": "MesobAI Authentication - Secure user registration and JWT token management for Ethiopian pharmacy businesses"},
    {"name": "pharmacy_cms", "description": "Mesob Pharmacy Management - AI-powered dashboard and medicine inventory for Ethiopian healthcare providers"},
    {"name": "sales", "description": "AI Business Intelligence - Smart POS operations and transaction analytics for Ethiopian pharmacies"},
    {"name": "inventory", "description": "MesobAI Inventory - Intelligent stock management with AI-powered alerts for Ethiopian businesses"},
    {"name": "affiliate", "description": "Mesob Affiliate Network - Commission tracking and partnership management for Ethiopian healthcare sector"},
    {"name": "admin", "description": "MesobAI Administration - KYC approvals and payment verification for Ethiopian pharmacy compliance"},
    {"name": "ai", "description": "AI in Ethiopia - Advanced artificial intelligence insights and business analytics powered by MesobAI technology"},
]

app = FastAPI(
    title="MesobAI - AI-Powered Pharmacy Management System for Ethiopia",
    version="0.1.0",
    description="MesobAI: Revolutionary AI in business solution for Ethiopian pharmacies. Advanced mesob technology platform offering AI-powered pharmacy management, inventory control, and business intelligence for Ethiopia's healthcare sector.",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "MesobAI Support",
        "url": "https://mesobai.com",
        "email": "support@mesobai.com",
    },
    license_info={
        "name": "Proprietary",
        "url": "https://mesobai.com/license",
    },
    servers=[
        {"url": "https://api.mesobai.com", "description": "Production server"},
        {"url": "http://localhost:8000", "description": "Development server"},
    ],
)

# Multi-tenant context middleware
app.add_middleware(TenantContextMiddleware)
# Request/response logging middleware
app.add_middleware(LoggingMiddleware)

# CORS configuration with large request support
origins = [o.strip() for o in (settings.cors_origins or "").split(",") if o.strip()] or (["*"] if settings.environment != "production" else [])
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)

# Handle request size errors
@app.exception_handler(413)
async def request_entity_too_large_handler(request: Request, exc):
    return JSONResponse(
        status_code=413,
        content={"detail": "Request entity too large. Please reduce the size of your request."}
    )

@app.on_event("startup")
def on_startup():
    # Temporary: auto-create tables until Alembic migrations are added
    if settings.environment != "production":
        engine = get_engine()
        Base.metadata.create_all(bind=engine)
    
    # Seed admin user from environment variables
    from .core.admin_seeder import seed_admin_user
    db = SessionLocal()
    try:
        seed_admin_user(db)
    finally:
        db.close()
    
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
                                    notify_expiring_items(db, tenant_id=t)
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


@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    """
    MesobAI Health Check - AI in Ethiopia Pharmacy Management System
    
    Monitor the health of Ethiopia's leading AI in business platform.
    MesobAI combines traditional mesob technology with modern AI for 
    comprehensive pharmacy management across Ethiopian healthcare sector.
    """
    return {
        "status": "ok",
        "service": "MesobAI - AI in Ethiopia",
        "description": "AI-powered pharmacy management system for Ethiopian businesses",
        "technology": "Mesob AI Technology Platform",
        "market": "Ethiopian Healthcare Sector",
        "keywords": ["MesobAI", "mesob", "AI in Ethiopia", "AI in business"],
        "version": "1.0.0"
    }


# Include SEO routes at root level
from .api.v1.seo import router as seo_router
app.include_router(seo_router)

app.include_router(api_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
