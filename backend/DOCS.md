# Zemen Pharma Backend Documentation

## Overview
Zemen Pharma is a multi-tenant, AI-powered CMS and management system for pharmacies built on FastAPI. It supports Owners, Cashiers/Staff, Affiliates, and Admins with strict tenant isolation, per-tenant approvals (KYC), and AI insights with schema-aware, safe SQL generation.

## Architecture
- FastAPI monolith with modular routers
- PostgreSQL via SQLAlchemy; Redis for cache/rate-limits
- Multi-tenancy via `tenant_id` header/query + `enforce_user_tenant` dependency
- RBAC: `admin`, `pharmacy_owner`, `cashier`, `affiliate`, `customer`
- AI orchestration: pluggable LangGraph adapter with schema introspection and SELECT-only safety gate
- Notifications: in-app feed + email; optional WebSocket push for real-time UI updates
- OTP verification for registration and 2-step login

## Core Models (selected)
- Users: `User` (with `is_verified`, legacy `is_approved`)
- Tenant linking: `UserTenant` (per-tenant `is_approved` for KYC)
- Pharmacy: `Pharmacy` (by `tenant_id`)
- Inventory & Sales: `Medicine`, `InventoryItem`, `Sale`, `SaleItem`
- AI/Chat: `ChatThread`, `ChatMessage`
- Affiliate: `AffiliateProfile`, `AffiliateReferral`, `CommissionPayout`
- Audit: `AuditLog`
- Notifications: `Notification`, `NotificationPreference`
- Verification: `VerificationCode`

## Tenant Isolation
- `X-Tenant-ID` header or `?tenant_id` query sets tenant context
- `enforce_user_tenant` ensures non-admin users only access allowed tenants via `UserTenant` or `user.tenant_id`
- All data queries filtered by `tenant_id`

## Security & Auth
- JWT tokens; OAuth2 password flow for login
- OTP flows:
  - Registration: code emailed, `/auth/register/verify` to finalize
  - Login 2-step: `/auth/login/request-code` then `/auth/login/verify`
- Per-endpoint rate limits (IP for login; per-user for analytics, AI, admin, staff, KYC, affiliate)

## AI Orchestration
- `USE_LANGGRAPH=true` enables `my_langgraph_impl.run_graph` with schema overview and returns `{sql,intent}`
- SQL safety gate enforces SELECT-only and param binding with `tenant_id`
- Fallback heuristic when LangGraph not available

## Notifications
- In-app feed: GET `/api/v1/notifications`, POST `/api/v1/notifications/{id}/read`
- Email via `send_email` stub
- Preferences: GET/POST `/api/v1/notifications/preferences` (per-type email on/off)
- WebSocket (optional): `GET ws://.../api/v1/ws/notifications?tenant_id=...&user_id=...`
- Unified notify helper chooses in-app + WS + email (respecting preferences)

## Key Endpoints (non-exhaustive)
- Health: GET `/health`, `/api/v1/health`
- Auth: `/api/v1/auth/register`, `/auth/register/verify`, `/auth/login`, `/auth/login/request-code`, `/auth/login/verify`, `/auth/me`
- KYC: `/api/v1/kyc/submit`, `/api/v1/kyc/status`
- Admin KYC/Payments: `/api/v1/admin/pharmacies/{application_id}/approve|reject`, `/api/v1/admin/payments/{payment_code}/verify`
- Admin User-Tenant: POST/GET/DELETE `/api/v1/admin/user-tenants`, POST `/api/v1/admin/user-tenants/{id}/approve|reject`
- Pharmacies: POST `/api/v1/pharmacies`, GET `/api/v1/pharmacies`
- Staff: POST `/api/v1/staff`
- Affiliate: GET `/api/v1/affiliate/register-link`, `/api/v1/affiliate/commissions`
- AI: POST `/api/v1/ai/ask`
- Chat: POST `/api/v1/chat/threads`, POST/GET `/api/v1/chat/threads/{id}/messages`
- Inventory/Sales (analytics): `/api/v1/pharmacy/cashier/kpis`, `/pharmacy/top-skus`, `/pharmacy/cashier/avg-basket-by-hour`, `/pharmacy/branch-comparison`, `/pharmacy/refunds`

## Runbook
- Dev (local):
  1) `py -3 -m venv .venv && .venv\Scripts\Activate.ps1`
  2) `pip install -r requirements.txt`
  3) `Copy-Item .env.example .env -Force`
  4) Edit `.env`: set DB, REDIS, JWT_SECRET, CORS_ORIGINS
  5) Alembic initial migration: `alembic revision --autogenerate -m "initial schema" && alembic upgrade head`
  6) `uvicorn app.main:app --reload`
- Docker (prod-like):
  - `docker compose up --build`
  - Entrypoint waits for DB, runs migrations, starts Uvicorn

## Configuration
- `.env` highlights:
  - `ENVIRONMENT`, `DEBUG`, `APP_NAME`, `CORS_ORIGINS`
  - `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`
  - `USE_LANGGRAPH` (true/false)
  - Scheduler: `ENABLE_SCHEDULER`, `SCHEDULER_TENANTS`, `SCHEDULER_INTERVAL_SECONDS`
  - Rate limits: `RATE_LIMIT_GENERAL_PER_MINUTE`, `RATE_LIMIT_GEMINI_PER_MINUTE`

## Operational Considerations
- Migrations: always run Alembic in prod; auto-create disabled in production
- CORS: explicit origins in prod
- Email: replace stub with SMTP/SendGrid + credentials via env
- Observability: add structured logging and request IDs (future)

## Known Constraints & Future Work
- `User.is_approved` retained for backward compatibility; prefer per-tenant `UserTenant.is_approved`
- Email notifications are stubs; plug real provider
- WebSocket push is basic; consider auth and multiplexing
- Add more unit/integration tests, especially around AI SQL safety and analytics

## Glossary
- Tenant: A pharmacy (or organization) identified by `tenant_id`
- Owner: `pharmacy_owner` role
- Link: record in `UserTenant` associating user ↔ tenant with optional per-tenant approval
