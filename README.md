# MesobAI - AI-Powered Pharmacy Management System for Ethiopia 🇪🇹

**Revolutionary AI in Business Solutions | Mesob Technology for Ethiopian Healthcare**

MesobAI is Ethiopia's leading AI-powered pharmacy management platform, combining advanced artificial intelligence with traditional Ethiopian business wisdom (mesob). Our comprehensive solution transforms how pharmacies operate across Ethiopia, delivering intelligent inventory management, business analytics, and automated operations.

## 🚀 Why MesobAI? AI in Ethiopia Revolution

- **🧠 AI in Business**: Advanced machine learning algorithms optimized for Ethiopian pharmacy operations
- **🏥 Healthcare AI**: Specialized AI models trained on Ethiopian healthcare patterns and regulations
- **📊 Business Intelligence**: Real-time analytics and insights powered by MesobAI technology
- **🔄 Mesob Integration**: Seamlessly connects traditional Ethiopian business practices with modern AI
- **🌍 Ethiopia-First**: Built specifically for Ethiopian market needs and regulatory requirements

For detailed architecture and API reference, see DOCS.md.

## 🎆 Core Features - MesobAI Technology Stack

### 🧠 AI in Business Intelligence
- **Smart Analytics**: AI-powered business insights tailored for Ethiopian pharmacy operations
- **Predictive Inventory**: Machine learning algorithms predict stock needs based on Ethiopian market patterns
- **Automated Reporting**: AI-generated reports optimized for Ethiopian healthcare regulations

### 🏥 Mesob Multi-Tenant Architecture
- **Tenant Isolation**: Strict multi-tenancy with `enforce_user_tenant` for secure Ethiopian pharmacy chains
- **KYC Compliance**: Per-tenant approvals via `UserTenant.is_approved` meeting Ethiopian regulatory standards
- **Scalable Infrastructure**: Built to handle Ethiopia's growing pharmacy network

### 💳 Ethiopian Business Operations
- **Local Payment Integration**: Subscription billing with Ethiopian payment methods
- **Regulatory Compliance**: Automated notices and blocking systems for Ethiopian healthcare laws
- **Manual Verification**: Payment code verification system adapted for Ethiopian business practices

### 🔒 Security & Authentication
- **OTP Verification**: Two-factor authentication optimized for Ethiopian mobile networks
- **JWT Security**: Enterprise-grade token management for Ethiopian healthcare data
- **Admin Controls**: Comprehensive user↔tenant management for Ethiopian pharmacy chains

### 📨 Communication Systems
- **Multi-Channel Notifications**: In-app, email, and WebSocket push notifications
- **Ethiopian Language Support**: Localized messaging for Ethiopian pharmacy staff
- **Real-time Updates**: Instant notifications for critical pharmacy operations

## Quickstart (local)
1) Create venv and install deps
```powershell
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
2) Configure environment
```powershell
Copy-Item .env.example .env -Force
# Edit .env: DATABASE_URL, REDIS_URL, JWT_SECRET, CORS_ORIGINS, SCHEDULER_TENANTS
```
3) Migrate DB (Alembic)
```powershell
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```
4) Run API
```powershell
# Option 1: Use the configured startup script (recommended)
python start_server.py

# Option 2: Direct uvicorn with large request support
uvicorn app.main:app --reload --limit-max-requests 52428800
```

## Quickstart (Docker)
```powershell
docker compose up --build
```
Entrypoint waits for DB, applies Alembic migrations, and starts the API.

## Configuration
- `.env`
  - ENVIRONMENT, APP_NAME, CORS_ORIGINS
  - DATABASE_URL, REDIS_URL, JWT_SECRET
  - USE_LANGGRAPH (true/false)
  - ENABLE_SCHEDULER, SCHEDULER_TENANTS (CSV), SCHEDULER_INTERVAL_SECONDS
  - RATE_LIMIT_GENERAL_PER_MINUTE, RATE_LIMIT_GEMINI_PER_MINUTE

## Multi-tenancy and Roles
- Tenant context via `X-Tenant-ID` header or `?tenant_id=` query.
- Roles: `admin`, `pharmacy_owner`, `cashier`, `affiliate`, `customer`.
- Access:
  - Non-admins must pass `enforce_user_tenant` to access tenant data.
  - Subscription enforcement (`enforce_subscription_active`) blocks protected routes for unpaid tenants (affiliates and admins are exempt).

## Auth & OTP
- Registration sends OTP email → `/api/v1/auth/register/verify` marks `is_verified=true`.
- Two-step login: `/auth/login/request-code` then `/auth/login/verify` returns JWT.
- Owner/Cashier registration requires `tenant_id` and auto-creates a `UserTenant` link.

## KYC & Admin
- KYC submission/status: `/api/v1/kyc/submit`, `/api/v1/kyc/status`.
- Admin approves/rejects, updates `UserTenant.is_approved` per tenant.
- Admin manage links: POST/GET/DELETE `/api/v1/admin/user-tenants`, and approve/reject per link.

## Billing (Manual verification)
- Daily scheduler sends notices from 5 days before due date to 5 days after.
- If on/after due date and 3 daily notices sent → tenant is blocked (not deleted).
- Tenant can still submit payment code while blocked:
  - POST `/api/v1/billing/payment-code` (requires tenant + membership)
- Admin verifies and unblocks:
  - POST `/api/v1/admin/payments/{payment_code}/verify`
  - Advances due date by one cycle and resets counters.

## 🧠 MesobAI Intelligence & Chat System

### AI in Ethiopia - Advanced Analytics
- **MesobAI Ask**: `/api/v1/ai/ask` - Intelligent query system for Ethiopian pharmacy insights
- **Business Intelligence**: AI-powered analytics specifically trained on Ethiopian healthcare data
- **Regulatory Compliance**: AI ensures all queries meet Ethiopian pharmacy regulations

### Mesob Technology Integration
- **LangGraph Integration**: Advanced AI workflows via `my_langgraph_impl.run_graph`
- **Schema Intelligence**: AI understands Ethiopian pharmacy data structures
- **SQL Safety**: Secure, tenant-isolated queries for Ethiopian multi-pharmacy operations

### AI in Business Communication
- **Smart Chat Threads**: AI-enhanced messaging system for Ethiopian pharmacy teams
- **Rate-Limited AI**: Optimized AI usage for Ethiopian internet infrastructure
- **Tenant-Aware AI**: AI responses tailored to specific Ethiopian pharmacy contexts

## Notifications
- In-app: GET `/api/v1/notifications`, POST `/api/v1/notifications/{id}/read`.
- Email: sent via stub `send_email` (plug in SMTP/SendGrid later).
- Preferences: GET/POST `/api/v1/notifications/preferences` to toggle per-type email.
- WebSocket: `ws /api/v1/ws/notifications?tenant_id=...&user_id=...`.

## Key Endpoints (selection)
- Health: `/health`, `/api/v1/health`
- Auth: `/api/v1/auth/register`, `/auth/register/verify`, `/auth/login`, `/auth/login/request-code`, `/auth/login/verify`, `/auth/me`
- KYC: `/api/v1/kyc/submit`, `/api/v1/kyc/status`
- Admin KYC/Payments: `/api/v1/admin/pharmacies/{id}/approve|reject`, `/api/v1/admin/payments/{code}/verify`
- Admin User-Tenant: `/api/v1/admin/user-tenants` (link/list/unlink/approve/reject)
- Billing: `/api/v1/billing/payment-code`
- Pharmacies: `/api/v1/pharmacies` (create/list)
- Staff: `/api/v1/staff`
- Affiliate: `/api/v1/affiliate/register-link`, `/api/v1/affiliate/commissions`
- AI: `/api/v1/ai/ask`
- Chat: `/api/v1/chat/threads`, `/api/v1/chat/threads/{id}/messages`

## Sample Flows (PowerShell)
Set variables
```powershell
$base = "http://127.0.0.1:8000"
$tenant = "tenantA"
```
1) Register Owner (with tenant) and OTP verify
```powershell
curl -X POST "$base/api/v1/auth/register?tenant_id=$tenant" -H "Content-Type: application/json" -d '{
  "email":"owner@a.com","password":"pass","role":"pharmacy_owner"
}'
curl -X POST "$base/api/v1/auth/register/verify" -H "Content-Type: application/x-www-form-urlencoded" -d "email=owner@a.com&code=<CODE>"
```
2) Submit KYC and wait for Admin approval
```powershell
curl -X POST "$base/api/v1/kyc/submit" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{"documents_path":"/docs/kyc.pdf"}'
curl -X POST "$base/api/v1/admin/pharmacies/1/approve" -H "Authorization: Bearer <ADMIN_TOKEN>" -H "X-Tenant-ID: $tenant"
```
3) Staff creation (owner)
```powershell
curl -X POST "$base/api/v1/staff" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{
  "email":"cashier@a.com","password":"pass","role":"cashier"
}'
```
4) Billing payment code submission and admin verification
```powershell
curl -X POST "$base/api/v1/billing/payment-code" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/x-www-form-urlencoded" -d "code=PAY12345"
curl -X POST "$base/api/v1/admin/payments/PAY12345/verify" -H "Authorization: Bearer <ADMIN_TOKEN>" -H "X-Tenant-ID: $tenant"
```
5) AI chat
```powershell
curl -X POST "$base/api/v1/chat/threads" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{"title":"Insights"}'
curl -X POST "$base/api/v1/chat/threads/1/messages" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{"prompt":"Top selling items"}'
```

## Troubleshooting
- 402 Payment Required: tenant is blocked. Submit payment code and wait for admin verification.
- 403 Tenant access denied: user not linked to tenant or wrong tenant id.
- 429 Too many requests: rate limits hit; try later.

## 🔍 SEO & Discovery

### Keywords & Search Terms
MesobAI is optimized for discovery through these key terms:
- **MesobAI** - Our primary brand for AI in Ethiopia
- **Mesob Technology** - Traditional Ethiopian wisdom meets modern AI
- **AI in Ethiopia** - Leading artificial intelligence solutions for Ethiopian businesses
- **AI in Business** - Enterprise AI solutions for Ethiopian healthcare sector
- **Ethiopian Pharmacy AI** - Specialized AI for Ethiopian pharmacy management
- **Healthcare AI Ethiopia** - Medical and pharmaceutical AI solutions
- **Business Intelligence Ethiopia** - Data analytics for Ethiopian enterprises

### API Documentation & SEO
- **OpenAPI Documentation**: `/docs` - Comprehensive API documentation
- **ReDoc Interface**: `/redoc` - Alternative API documentation view
- **SEO Metadata**: `/api/v1/seo-meta` - Structured SEO information
- **Sitemap**: `/sitemap.xml` - Search engine sitemap
- **Robots.txt**: `/robots.txt` - Search engine crawling instructions

### Ethiopian Market Focus
MesobAI is specifically designed for:
- Ethiopian pharmacy chains and independent pharmacies
- Healthcare providers across Ethiopia's regions
- Medical distributors and suppliers in Ethiopia
- Healthcare technology adopters in Ethiopian cities
- Traditional Ethiopian businesses embracing AI technology

## 🌐 About Mesob Technology

"Mesob" represents the traditional Ethiopian communal dining experience - bringing people together around shared resources. MesobAI applies this philosophy to pharmacy management, creating a unified platform where Ethiopian healthcare providers can share insights, resources, and AI-powered intelligence.

Our AI in business approach combines:
- **Traditional Ethiopian Values**: Community, sharing, and collective growth
- **Modern AI Technology**: Machine learning, predictive analytics, and automation
- **Ethiopian Market Understanding**: Local regulations, business practices, and cultural nuances
- **Scalable Solutions**: From single pharmacies to nationwide chains

## License
Proprietary – All rights reserved to MesobAI Technologies, Ethiopia.