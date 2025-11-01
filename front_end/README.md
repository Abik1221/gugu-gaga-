## Zemen Inventory Frontend (Next.js 15)

Rich PWA dashboard for inventory-led businesses—owners, staff, and affiliates—with offline sync, AI chat, and third-party integrations.

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn/bun
- Backend API running (see `/backend/README.md`)

### Installation & Development

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

### Environment variables (`.env.local`)

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_TENANT_HEADER=X-Tenant-ID
NEXT_PUBLIC_ENABLE_PWA=true
```

Optional extras:

- `NEXT_PUBLIC_LANGSMITH_KEY` for tracing AI conversations.
- `NEXT_PUBLIC_GTAG_ID` for analytics.

### Key Features

| Area | Description |
| --- | --- |
| **Owner dashboard** | Revenue analytics, branch comparisons, staff productivity, member quick actions. |
| **Offline support** | Service worker caches routes; `lib/offline/queue.ts` stores authenticated POST requests when offline. |
| **AI chat** | LangGraph-powered assistant that respects tenant scope. |
| **Integrations** | Human-driven OAuth flows and manual sync orchestration from the UI. |

### Integrations UI workflow

1. Navigate to **Dashboard → Owner → Connect tools** or `/dashboard/owner/integrations`.
2. Review the curated provider list (Google Sheets, Airtable, Notion, ERPs).
3. Click **Connect** to launch the OAuth flow. The user completes authentication in the provider window; tokens are encrypted server-side.
4. Once connected, the page shows available resources. Owners can trigger **Import** (provider → Zemen) or **Push updates** (Zemen → provider).
5. Sync requests enqueue jobs processed by the backend worker. Latest status and timestamps display inline.

### Offline queueing

All authenticated fetch helpers (`utils/api.ts`) fall back to `queueRequest` when offline. Requests persist in IndexedDB until connectivity is restored. Use the browser DevTools > Application > IndexedDB (`zemen-offline`) to inspect or clear the queue.

### Building for production

```bash
pnpm build
pnpm start
```

### Testing

Jest and Playwright suites are scaffolded under `tests/`. Run unit tests:

```bash
pnpm test
```

End-to-end smoke tests (optional):

```bash
pnpm playwright test
```

### Deployment notes

- Ensure backend CORS allows the frontend origin.
- Provide the same tenant header constant on both frontend and backend.
- Register the production OAuth redirect (`/api/v1/integrations/oauth/callback`) with each provider.
- Enable HTTPS so Google Sheets and other providers accept the redirect.

### Troubleshooting

- **Stuck “Redirecting…” after OAuth**: verify `.env.local` has the correct `NEXT_PUBLIC_API_BASE` and backend env has valid credentials.
- **Sync errors**: check the backend worker logs (`scripts/run_integration_worker.py`) and ensure Redis/DB are reachable.
- **Offline queue not replaying**: confirm service worker is registered and IndexedDB is not in private browsing mode.
