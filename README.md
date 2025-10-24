7) OTP verification
```powershell
# After register
curl -X POST "$base/api/v1/auth/register/verify" -H "Content-Type: application/x-www-form-urlencoded" -d "email=owner@a.com&code=<CODE>"
# Login 2-step
curl -X POST "$base/api/v1/auth/login/request-code?tenant_id=$tenant" -H "Content-Type: application/x-www-form-urlencoded" -d "username=owner@a.com&password=pass"
curl -X POST "$base/api/v1/auth/login/verify?tenant_id=$tenant" -H "Content-Type: application/x-www-form-urlencoded" -d "email=owner@a.com&code=<CODE>"
```
## Zemen Pharma – Monolithic FastAPI Backend

## Overview
Multi-tenant AI-powered CMS and management system for pharmacies built with FastAPI.

Key modules: auth/RBAC, pharmacy CMS, sales, inventory, affiliate, admin back office, AI (Gemini stub), notifications.

## Quickstart (Windows PowerShell)
1. Clone or open the repo
2. Create venv and install deps
   ```powershell
   py -3 -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
3. Configure environment
   ```powershell
   Copy-Item .env.example .env -Force
   # Edit .env to set DATABASE_URL, JWT_SECRET, REDIS_URL, GEMINI_API_KEY
   ```
4. Run server
   ```powershell
   uvicorn app.main:app --reload
   ```

## Alembic Commands
- Generate initial migration
  ```powershell
  alembic revision --autogenerate -m "initial schema"
  alembic upgrade head
  ```
- In production, auto table creation is disabled; migrations are applied on container start via entrypoint.
 - New models included: Pharmacy, UserTenant, VerificationCode, and User.is_verified.

## CORS Notes
- Configure allowed origins via `CORS_ORIGINS` in `.env` (comma-separated URLs):
  ```
  CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
  ```
- In production, wildcard "*" is not allowed by default; specify explicit origins.

## Endpoints
- Health: GET `/health`, GET `/api/v1/health`
- Auth: POST `/api/v1/auth/register`, POST `/api/v1/auth/login` (OAuth2 form), GET `/api/v1/auth/me` (Bearer)
- Pharmacy: GET `/api/v1/pharmacy/dashboard`, `/api/v1/pharmacy/medicines`
- Sales: GET `/api/v1/sales/transactions`
- Inventory: GET `/api/v1/inventory/stock`
- Affiliate: GET `/api/v1/affiliate/register-link`, `/api/v1/affiliate/commissions`
- Admin: POST `/api/v1/admin/pharmacies/{application_id}/approve`, POST `/api/v1/admin/payments/{payment_code}/verify`
- AI: POST `/api/v1/ai/ask`
 - KYC: POST `/api/v1/kyc/submit`, GET `/api/v1/kyc/status`
 - Staff: POST `/api/v1/staff`
- Chat: POST `/api/v1/chat/threads`, GET `/api/v1/chat/threads/{id}/messages`, POST `/api/v1/chat/threads/{id}/messages`
 - Pharmacies: POST `/api/v1/pharmacies` (create for tenant), GET `/api/v1/pharmacies` (list)

Notes:
- Multi-tenancy: send `X-Tenant-ID` header (or `?tenant_id=` query).
- DB: Uses `DATABASE_URL` if set; otherwise SQLite file `zemen_local.db`.
- Tables auto-created on startup temporarily (replace with Alembic later).

## Runbook: Sample Flows (PowerShell curl)

Set variables
```powershell
$base = "http://127.0.0.1:8000"
$tenant = "tenantA"
```

1) Register pharmacy owner (optionally via affiliate code) and login
```powershell
curl -X POST "$base/api/v1/auth/register?tenant_id=$tenant" -H "Content-Type: application/json" -d '{
  "email":"owner@a.com","password":"pass","role":"pharmacy_owner","affiliate_code":null
}'
curl -X POST "$base/api/v1/auth/login?tenant_id=$tenant" -H "Content-Type: application/x-www-form-urlencoded" -d "username=owner@a.com&password=pass"
# Save token from response
```

2) Submit KYC and check status
```powershell
curl -X POST "$base/api/v1/kyc/submit" -H "Authorization: Bearer <TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{"documents_path":"/docs/kyc.pdf","notes":"KYC docs"}'
curl -X GET "$base/api/v1/kyc/status" -H "Authorization: Bearer <TOKEN>" -H "X-Tenant-ID: $tenant"
```

3) Admin approves KYC
```powershell
curl -X POST "$base/api/v1/admin/pharmacies/1/approve" -H "Authorization: Bearer <ADMIN_TOKEN>" -H "X-Tenant-ID: $tenant"
```

4) Owner creates cashier
```powershell
curl -X POST "$base/api/v1/staff" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{
  "email":"cashier@a.com","password":"pass","role":"cashier"
}'
```

5) Affiliate link and commissions
```powershell
curl -X GET "$base/api/v1/affiliate/register-link" -H "Authorization: Bearer <AFFILIATE_TOKEN>" -H "X-Tenant-ID: $tenant"
curl -X GET "$base/api/v1/affiliate/commissions" -H "Authorization: Bearer <AFFILIATE_TOKEN>" -H "X-Tenant-ID: $tenant"
```

6) AI chat threads and messages
```powershell
curl -X POST "$base/api/v1/chat/threads" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{"title":"Insights"}'
curl -X POST "$base/api/v1/chat/threads/1/messages" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant" -H "Content-Type: application/json" -d '{"prompt":"Show me top selling medicines"}'
curl -X GET "$base/api/v1/chat/threads/1/messages" -H "Authorization: Bearer <OWNER_TOKEN>" -H "X-Tenant-ID: $tenant"