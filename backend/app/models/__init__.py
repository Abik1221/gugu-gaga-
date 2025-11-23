"""Aggregate SQLAlchemy models for metadata discovery."""

from app.db.session import Base  # noqa: F401

# Import model modules so that Alembic / SQLAlchemy see their tables.
from app.models.user import User  # noqa: F401
from app.models.pharmacy import Pharmacy  # noqa: F401
from app.models.branch import Branch  # noqa: F401
from app.models.medicine import Medicine, InventoryItem  # noqa: F401
from app.models.sales import Sale, SaleItem  # noqa: F401
from app.models.customer import Customer  # noqa: F401
from app.models.affiliate import AffiliateProfile, AffiliateReferral, AffiliateLink, CommissionPayout  # noqa: F401
from app.models.notification_pref import NotificationPreference  # noqa: F401
from app.models.chat import ChatThread, ChatMessage  # noqa: F401
from app.models.audit import AuditLog  # noqa: F401
from app.models.session import AuthSession  # noqa: F401
from app.models.kyc import KYCApplication  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.integration import (  # noqa: F401
    IntegrationConnection,
    IntegrationProvider,
    IntegrationSyncJob,
)
from app.models.supplier import Supplier, SupplierProduct, Order, OrderItem, OrderReview  # noqa: F401
from app.models.supplier_kyc import SupplierKYC, SupplierPaymentSubmission  # noqa: F401
from app.models.verification import VerificationCode  # noqa: F401
from app.models.user_tenant import UserTenant  # noqa: F401
from app.models.subscription import Subscription, PaymentSubmission  # noqa: F401
from app.models.tenant_activity import TenantActivityLog  # noqa: F401
from app.models.system import SystemSetting, Announcement  # noqa: F401

