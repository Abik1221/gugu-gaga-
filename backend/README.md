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
uvicorn app.main:app --reload
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

## Security checklist
- Rotate `INTEGRATION_ENCRYPTION_KEY` if compromise is suspected (tokens will require re-auth).
- Keep OAuth client secrets in your secret manager; never commit `.env`.
- Limit OAuth scopes in `registry.py` to the minimum resources used.
- Configure Redis with authentication/TLS when deployed publicly.
- Enforce HTTPS in production so OAuth callbacks and JWT cookies remain secure.
- Monitor `integration_sync_jobs` for repeated failures (possible credential expiry).
- Audit records: enable DB-level logging or forward `integration_service` logs to SIEM.

## Testing strategy
- **Unit tests**: `pytest tests/` covers integrations, worker logic, and service utilities.
- **Smoke tests**: run `pytest -m smoke` (tag smoke tests as needed) before each release.
- **Integration tests**: enable `RUN_INTEGRATION_LIVE_TESTS=1` with sandbox credentials to validate real OAuth/token exchanges.
- **Worker soak**: run `python scripts/run_integration_worker.py --once` in staging to drain jobs and inspect staging tables.
- **Frontend E2E**: Launch the Playwright suite (`pnpm playwright test`) to verify UI flows including the Integrations page.
- **Monitoring**: configure alerts on job failure rates, Redis connectivity, and OAuth callback errors (HTTP 400/500).

## Observability & monitoring
- **Worker log streaming**: forward `scripts/run_integration_worker.py` stdout/stderr to your logging stack (Loki/ELK/Datadog). Include contextual fields like `tenant_id`, `provider_key`, and `job_id`.
- **Metrics to publish**:
  - `integration.jobs.queued|in_progress|completed|failed` gauges per provider.
  - Queue depth and average processing duration (`job.finished_at - job.started_at`).
  - OAuth callback status counts (track 4xx vs 5xx).
- **Alerting guardrails**:
  - Trigger alerts when `failed` or `unsupported` jobs exceed 5 within 15 minutes.
  - Watch Redis latency/connectivity; the OAuth state store depends on it.
  - Emit warnings when `token_expiry` is <7 days away (`IntegrationConnection.token_expiry`). Consider a nightly cron that checks and sends Slack/email alerts.
- **Dashboards**: chart sync success rates, import volumes per resource, and worker uptime. Overlay provider status pages to correlate outages.

## Staged dry runs
1. **Create staging tenant** with sandbox provider credentials.
2. **Connect provider** via the UI and trigger each resource sync (inventory/sales/customers). Note job IDs for traceability.
3. **Worker execution**: run `python scripts/run_integration_worker.py --once` to drain the queue. Inspect `integration_staging_records` and downstream tables to confirm ingestion results.
4. **Data validation**: compare inventory counts against the source system, check audit logs, and verify LangGraph nodes are registered.
5. **Frontend walkthrough**: execute the Integrations flow with Playwright or manual QA, capturing screenshots and console/network logs for sign-off.

## Operational playbooks
- **OAuth credential rotation**:
  1. Create new provider credentials (client ID/secret).
  2. Update secrets in your manager (Vault, AWS Secrets Manager) and redeploy.
  3. Notify tenants to reconnect if tokens become invalid.
- **Worker outage recovery**:
  - Monitor queue depth; if jobs pile up, restart the worker process and confirm it rehydrates DB/Redis sessions.
  - Use `--once` mode to validate the pipeline before returning to long-running mode.
- **Failed sync triage**:
  - Review job error messages and provider API responses.
  - Replay specific staging records after fixes using a bespoke admin script or by re-queuing the job.
- **Support team runbook**:
  - Steps to disconnect/reconnect a provider safely from the dashboard.
  - Checklist for advising customers (clear cookies, confirm scopes, verify redirect URL).

## Security hardening
- Enforce HTTPS/TLS for all API endpoints and the OAuth callback; terminate TLS at the load balancer or app server.
- Secure Redis with authentication/TLS and network isolation (VPC/subnet ACLs).
- Store secrets in a vault service—never commit `.env` with credentials.
- Limit OAuth scopes in `registry.py` to the minimum read/write access required.
- Maintain an `INTEGRATION_ENCRYPTION_KEY` rotation plan; rotating requires re-authentication of providers and invalidating old keys.
- Periodically audit `integration_connections` to remove dormant links and revoke provider-side access tokens.

## Zoho Books rollout guide
1. **Credentials & scopes**
   - Create a Zoho Books OAuth client and copy `client_id` / `client_secret`.
   - Add to backend env: `ZOHO_BOOKS_CLIENT_ID`, `ZOHO_BOOKS_CLIENT_SECRET`.
   - Ensure `INTEGRATION_OAUTH_REDIRECT_URI` matches Zoho’s registered redirect (e.g. `https://your.api/api/v1/integrations/oauth/callback`).
   - Required scope: `ZohoInventory.fullaccess.ALL` (already set in `registry.py`).

2. **Staging tenant dry-run**
   - Connect Zoho Books from the staging UI (Owner → Connect tools).
   - Trigger an “Import inventory” sync; verify `integration_staging_records` get populated.
   - Run the worker once (`python scripts/run_integration_worker.py --once`) and confirm inventory items are upserted.

3. **Monitoring**
   - Log metrics: sync job duration, failures per provider, queued job counts.
   - Alert if consecutive Zoho jobs fail with 401/403 (token revoked) or 5xx (API outage).
   - Track token expiry (`IntegrationConnection.token_expiry`) and prompt rotation 7 days before expiration.

4. **Operational playbook**
   - For token revocation: disconnect the integration from the dashboard, then reconnect to refresh tokens.
   - For data mismatches: inspect staging payloads (JSON stored per record) before replaying ingestion.
   - Document branch mappings if Zoho uses custom fields; update the connector mapping helpers accordingly.

5. **Production rollout**
   - Enable the worker service alongside the API (supervisord, systemd, or container).
   - Verify CORS/HTTPS and confirm Zoho callback is reachable from the public internet.
   - Communicate required permissions to pharmacy admins (Zoho Books owner access is needed).

## License
Proprietary – All rights reserved.