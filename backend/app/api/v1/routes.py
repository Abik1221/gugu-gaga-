from fastapi import APIRouter

from .auth import router as auth_router
from .public import router as public_router
from .pharmacy import router as pharmacy_router
from .sales import router as sales_router
from .inventory import router as inventory_router
from .medicines import router as medicines_router
from .affiliate import router as affiliate_router
from .admin import router as admin_router
from .ai import router as ai_router
from .kyc import router as kyc_router
from .staff import router as staff_router
from .chat import router as chat_router
from .notifications import router as notifications_router
from .pharmacies import router as pharmacies_router
from .admin_user_tenants import router as admin_user_tenants_router
from .notification_prefs import router as notification_prefs_router
from .ws import router as ws_router
from .billing import router as billing_router
from .subscriptions import router as subscriptions_router
from .owner_analytics import router as owner_analytics_router
from .branches import router as branches_router
from .uploads import router as uploads_router
from .tenant_activity import router as tenant_activity_router
from .integrations import router as integrations_router
from .customers import router as customers_router
from .suppliers import router as suppliers_router
from .orders import router as orders_router
from .supplier_onboarding import router as supplier_onboarding_router
from .seo import router as seo_router
from .system import router as system_router
from .expenses import router as expenses_router
from .goals import router as goals_router


api_router = APIRouter()


@api_router.get("/health")
def api_health():
    return {"status": "ok"}


# Mount feature routers
api_router.include_router(auth_router)
api_router.include_router(public_router)
api_router.include_router(pharmacy_router)
api_router.include_router(sales_router)
api_router.include_router(inventory_router)
api_router.include_router(medicines_router)
api_router.include_router(affiliate_router)
api_router.include_router(admin_router)
api_router.include_router(system_router)
api_router.include_router(ai_router)
api_router.include_router(kyc_router, prefix="/owner")
api_router.include_router(staff_router)
api_router.include_router(chat_router)
api_router.include_router(notifications_router)
api_router.include_router(pharmacies_router)
api_router.include_router(admin_user_tenants_router)
api_router.include_router(notification_prefs_router)
api_router.include_router(ws_router)
api_router.include_router(billing_router, prefix="/owner")
api_router.include_router(subscriptions_router, prefix="/owner")
api_router.include_router(owner_analytics_router, prefix="/owner")
api_router.include_router(branches_router)
api_router.include_router(uploads_router)
api_router.include_router(tenant_activity_router)
api_router.include_router(integrations_router, prefix="/integrations", tags=["integrations"])
api_router.include_router(customers_router)
api_router.include_router(suppliers_router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(orders_router, prefix="/orders", tags=["orders"])
api_router.include_router(supplier_onboarding_router, tags=["supplier_onboarding"])
api_router.include_router(seo_router, tags=["seo"])
api_router.include_router(expenses_router, prefix="/expenses", tags=["expenses"])
api_router.include_router(goals_router, prefix="/goals", tags=["goals"])
