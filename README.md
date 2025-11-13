## Zemen Pharma – Multi-tenant FastAPI Backend

Professional, secure, and tenant-aware backend for managing pharmacies with AI insights, KYC, billing, and notifications.

For a deeper architecture and API reference, see DOCS.md.

## Features
- Multi-tenancy with strict enforcement (`enforce_user_tenant`).
- Per-tenant KYC approvals via `UserTenant.is_approved` (admin-controlled).
- Subscription billing with due-date notices, blocking, and manual unblocking via payment code verification.
- AI insights (LangGraph-ready) with schema introspection and strict SQL safety.
- OTP verification for registration and 2-step login.
- Notifications: in-app feed, email with per-type prefs, optional WebSocket push.
- Admin: manage user↔tenant links, approve/reject per-tenant access.

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

## AI & Chat
- AI ask: `/api/v1/ai/ask` (tenant + subscription enforced).
- LangGraph integration via `my_langgraph_impl.run_graph` with schema overview.
- SQL safety gate: SELECT-only, tenant parameter binding.
- Chat: threads/messages endpoints with per-user rate limits and tenant enforcement.

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

## License
Proprietary – All rights reserved.