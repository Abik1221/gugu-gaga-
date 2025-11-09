export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
export const TENANT_HEADER =
  process.env.NEXT_PUBLIC_TENANT_HEADER || "X-Tenant-ID";

const API_BASE_NORMALIZED = API_BASE.replace(/\/+$/, "");
let API_BASE_PATH = "";
try {
  const parsed = new URL(API_BASE_NORMALIZED);
  API_BASE_PATH = parsed.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
} catch {
  API_BASE_PATH = "";
}

function buildHeaders(
  initHeaders?: HeadersInit,
  tenantId?: string
): HeadersInit {
  const headers: Record<string, string> = {
    ...(initHeaders as Record<string, string>),
  };
  if (tenantId) headers[TENANT_HEADER] = tenantId;
  return headers;
}

function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("?") || path.startsWith("#")) {
    return `${API_BASE_NORMALIZED}${path}`;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  let relativePath = normalizedPath;


  if (API_BASE_PATH) {
    const prefix = `${API_BASE_PATH}/`;
    if (relativePath.startsWith(prefix)) {
      relativePath = relativePath.slice(prefix.length);
    } else if (relativePath === API_BASE_PATH) {
      relativePath = "";
    }
  }

  if (!relativePath) {
    return API_BASE_NORMALIZED;
  }

  return `${API_BASE_NORMALIZED}/${relativePath}`;
}

export async function postForm<T = any>(
  path: string,
  data: Record<string, string>,
  tenantId?: string
): Promise<T> {
  const body = new URLSearchParams(data);
  const res = await fetch(resolveApiUrl(path), {
    method: "POST",
    headers: buildHeaders(
      { "Content-Type": "application/x-www-form-urlencoded" },
      tenantId
    ),
    body,
  });

  if (!res.ok) {
    let parsed: any = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = await res.text().catch(() => null);
    }

    let msg = "";
    if (!parsed) msg = `Request failed with ${res.status}`;
    else if (typeof parsed === "string") msg = parsed;
    else if (Array.isArray(parsed)) msg = parsed.join(", ");
    else if (parsed?.detail) msg = parsed.detail;
    else if (parsed?.message) msg = parsed.message;
    else if (parsed?.error) msg = parsed.error;
    else if (parsed?.errors) {
      msg = Object.keys(parsed.errors)
        .map(
          (k) =>
            `${k}: ${Array.isArray(parsed.errors[k])
              ? parsed.errors[k].join(", ")
              : parsed.errors[k]
            }`
        )
        .join(" | ");
    } else msg = JSON.stringify(parsed);

    const err: any = new Error(msg || `Request failed with ${res.status}`);
    err.status = res.status;
    err.body = parsed;
    console.error("[postForm] failed", { path, status: res.status, parsed });
    throw err;
  }

  return (await res.json()) as T;
}

export async function postJSON<T = any>(
  path: string,
  body: any,
  tenantId?: string
): Promise<T> {
  const requestInit = {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, tenantId),
    body: JSON.stringify(body),
  } satisfies RequestInit;

  try {
    const res = await fetch(resolveApiUrl(path), requestInit);

    if (!res.ok) {
      let parsed: any = null;
      let message = "";
      try {
        parsed = await res.json();
        if (typeof parsed === "string") message = parsed;
        else if (Array.isArray(parsed)) message = parsed.join(", ");
        else message = parsed?.error || parsed?.detail || parsed?.message || "";
        if (!message && parsed) message = JSON.stringify(parsed);
      } catch {
        parsed = null;
        message = await res.text().catch(() => "");
      }

      const error: any = new Error(message || `Request failed with ${res.status}`);
      error.status = res.status;
      if (parsed !== null) error.body = parsed;
      throw error;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (typeof window !== "undefined" && !navigator.onLine) {
      const { queueRequest } = await import("@/lib/offline/queue");
      await queueRequest(path, requestInit, {
        tenantId,
        requiresAuth: true,
        description: requestInit.body ? `POST ${path}` : undefined,
      });
      const offlineError: any = new Error("Request queued until you are back online.");
      offlineError.offline = true;
      throw offlineError;
    }
    throw error;
  }
}

export async function putAuthJSON<T = any>(
  path: string,
  bodyData: any,
  tenantId?: string
): Promise<T> {
  const res = await authFetch(
    path,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    },
    true,
    tenantId
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function postMultipart<T = any>(
  path: string,
  formData: FormData,
  tenantId?: string
): Promise<T> {
  const res = await fetch(resolveApiUrl(path), {
    method: "POST",
    headers: buildHeaders(undefined, tenantId),
    body: formData,
  });

  if (!res.ok) {
    try {
      const data = await res.json();
      const msg = data?.error || data?.detail || JSON.stringify(data);
      throw new Error(msg || `Request failed with ${res.status}`);
    } catch {
      throw new Error(`Request failed with ${res.status}`);
    }
  }

  return (await res.json()) as T;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}



function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

async function refreshTokens(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;
  const res = await fetch(resolveApiUrl("/api/v1/auth/refresh"), {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ refresh_token: rt }),
  });
  if (!res.ok) {
    return false;
  }
  try {
    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    return true;
  } catch {
    return false;
  }
}

export async function authFetch<T>(
  path: string,
  init?: RequestInit,
  retry = true,
  tenantId?: string
): Promise<Response> {
  const token = getAccessToken();
  const headers: HeadersInit = buildHeaders(
    {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    tenantId
  );
  let res = await fetch(resolveApiUrl(path), { ...(init || {}), headers });

  if (res.status === 401 && retry) {
    const ok = await refreshTokens();
    if (ok) {
      const newToken = getAccessToken();
      const retryHeaders: HeadersInit = buildHeaders(
        {
          ...(init?.headers || {}),
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        },
        tenantId
      );
      res = await fetch(resolveApiUrl(path), {
        ...(init || {}),
        headers: retryHeaders,
      });
    }
  }

  return res;
}

export async function getAuthJSON<T = any>(
  path: string,
  tenantId?: string
): Promise<T> {
  const res = await authFetch(path, undefined, true, tenantId);
  if (!res.ok) {
    const data = await res.text().catch(() => "");
    throw new Error(data || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function postAuthJSON<T = any>(
  path: string,
  bodyData: any,
  tenantId?: string
): Promise<T> {
  const res = await authFetch(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    },
    true,
    tenantId
  );

  if (!res.ok) {
    const data = await res.text().catch(() => "");
    throw new Error(data || `Request failed with ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function deleteAuthJSON(
  path: string,
  tenantId?: string
): Promise<void> {
  const res = await authFetch(
    path,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    },
    true,
    tenantId
  );

  if (!res.ok) {
    const data = await res.text().catch(() => "");
    throw new Error(data || `Request failed with ${res.status}`);
  }

  // For DELETE requests, we might not have a response body
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

// ----------------- AuthAPI -----------------
export type AuthProfile = {
  id: number;
  email: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role?: string | null;
  tenant_id?: string | null;
  kyc_status?: string | null;
  subscription_status?: string | null;
  subscription_blocked?: boolean | null;
  subscription_next_due_date?: string | null;
  latest_payment_status?: string | null;
};

export type AuthTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  session_id: number;
};

export type SessionInfo = {
  id: number;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  revoked_at?: string | null;
  is_revoked: boolean;
  user_agent?: string | null;
  ip_address?: string | null;
  is_current: boolean;
};

export type TenantActivityRecord = {
  id: number;
  tenant_id: string;
  actor_user_id?: number | null;
  action: string;
  message: string;
  target_type?: string | null;
  target_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export const AuthAPI = {
  registerAffiliate: (body: any) => postJSON("/api/v1/auth/register/affiliate", body),
  registerPharmacy: (body: any) => postJSON("/api/v1/auth/register/pharmacy", body),

  registerVerify: async (email: string, code: string) => {
    try {
      return await postForm("/api/v1/auth/register/verify", { email, code });
    } catch (err: any) {
      if (err?.status === 422) {
        console.warn("[AuthAPI.registerVerify] 422, retrying with JSON", {
          body: err.body,
        });
        try {
          return await postJSON("/api/v1/auth/register/verify", { email, code });
        } catch (err2: any) {
          const e: any = new Error(
            err2?.message || err?.message || "Verification failed"
          );
          e.original = err;
          e.retry = err2;
          throw e;
        }
      }
      throw err;
    }
  },

  verifyRegistration: (email: string, code: string) =>
    postForm("/api/v1/auth/register/verify", { email, code }),
  login: (email: string, password: string, tenantId?: string) =>
    postForm<AuthTokenResponse>(
      "/api/v1/auth/login",
      {
        username: email,
        password,
        grant_type: "password",
      },
      tenantId
    ).then(
      (resp) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", resp.access_token);
          localStorage.setItem("refresh_token", resp.refresh_token);
        }
        return resp;
      }
    ),
  loginRequestCode: (email: string, password: string, tenantId?: string) =>
    postForm(
      "/api/v1/auth/login/request-code",
      { username: email, password, grant_type: "password" },
      tenantId
    ),
  loginVerify: (email: string, code: string, tenantId?: string) =>
    postJSON<AuthTokenResponse>("/api/v1/auth/login/verify", { email, code }, tenantId).then((resp) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", resp.access_token);
        localStorage.setItem("refresh_token", resp.refresh_token);
      }
      return resp;
    }),
  refresh: (refreshToken: string) =>
    postJSON<AuthTokenResponse>("/api/v1/auth/refresh", { refresh_token: refreshToken }),
  sessions: () => getAuthJSON<SessionInfo[]>("/api/v1/auth/sessions"),
  revokeSession: (sessionId: number) =>
    authFetch(`/api/v1/auth/sessions/${sessionId}`, { method: "DELETE" }).then((res) => {
      if (!res.ok) throw new Error("Failed to revoke session");
    }),
  changePassword: (body: { current_password: string; new_password: string }) =>
    postAuthJSON<{ status: string }>("/api/v1/auth/change-password", body),
  me: () => getAuthJSON<AuthProfile>("/api/v1/auth/me"),
};

export const TenantAPI = {
  activity: async (params?: { action?: string[]; limit?: number; offset?: number }, tenantId?: string) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    params?.action?.forEach((action) => searchParams.append("action", action));
    const qs = searchParams.toString();
    const url = `/api/v1/tenant/activity${qs ? `?${qs}` : ""}`;
    const res = await authFetch(url, undefined, true, tenantId);
    if (res.status === 404 || res.status === 204) {
      return [];
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return [];
    }
    try {
      return (await res.json()) as TenantActivityRecord[];
    } catch {
      return [];
    }
  },
};

// ----------------- IntegrationsAPI -----------------
export type IntegrationProviderOut = {
  key: string;
  name: string;
  category: string;
  capability: {
    resources: string[];
    supports_webhooks: boolean;
    supports_delta_sync: boolean;
  };
  requires_oauth: boolean;
};

export type IntegrationConnectionOut = {
  id: number;
  tenant_id: string;
  provider_key: string;
  provider_name: string;
  display_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_synced_at?: string | null;
  resource_scope?: string[] | null;
};

export type IntegrationOAuthStartResponse = {
  authorization_url: string;
  state: string;
  expires_in_seconds: number;
};

export type IntegrationSyncJobOut = {
  id: number;
  connection_id: number;
  direction: string;
  resource: string;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  error_message?: string | null;
};

export const IntegrationsAPI = {
  listProviders: () => getAuthJSON<IntegrationProviderOut[]>("/api/v1/integrations/providers"),
  listConnections: (tenantId: string) =>
    getAuthJSON<IntegrationConnectionOut[]>("/api/v1/integrations/connections", tenantId),
  startOAuth: (tenantId: string, providerKey: string, resources?: string[]) =>
    postAuthJSON<IntegrationOAuthStartResponse>(
      "/api/v1/integrations/oauth/start",
      { provider_key: providerKey, resources, display_name: undefined },
      tenantId
    ),
  completeOAuth: (code: string, state: string, providerKey?: string) =>
    postJSON<IntegrationConnectionOut>(
      "/api/v1/integrations/oauth/callback",
      { code, state, provider_key: providerKey }
    ),
  disconnect: (tenantId: string, connectionId: number) =>
    authFetch(`/api/v1/integrations/connections/${connectionId}`, { method: "DELETE" }, true, tenantId).then(
      async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      }
    ),
  triggerSync: (tenantId: string, connectionId: number, resource: string, direction: "incoming" | "outgoing") =>
    postAuthJSON<IntegrationSyncJobOut>(
      `/api/v1/integrations/connections/${connectionId}/sync`,
      { resource, direction },
      tenantId
    ),
};

export const AffiliateAPI = {
  getLinks: () => getAuthJSON("/api/v1/affiliate/register-link", ""),
  createLink: () => getAuthJSON("/api/v1/affiliate/register-link?create_new=true", ""),
  deactivate: (token: string) =>
    postAuthJSON(
      `/api/v1/affiliate/links/${encodeURIComponent(token)}/deactivate`,
      {},
      ""
    ),
  rotate: (token: string) =>
    postAuthJSON(`/api/v1/affiliate/links/${encodeURIComponent(token)}/rotate`, {}, ""),
  dashboard: () => getAuthJSON("/api/v1/affiliate/dashboard", ""),
  payouts: (status?: string) =>
    getAuthJSON(
      `/api/v1/affiliate/payouts${status ? `?status_filter=${encodeURIComponent(status)}` : ""
      }`,
      ""
    ),
  requestPayout: (month?: string, percent = 5) =>
    postAuthJSON("/api/v1/affiliate/payouts/request", { month, percent }, ""),
  updateProfile: (body: any) => postAuthJSON("/api/v1/affiliate/profile", body, ""),
};

// ----------------- AdminAPI -----------------
export const AdminAPI = {
  analyticsOverview: (days = 30) =>
    getAuthJSON(`/api/v1/admin/analytics/overview?days=${days}`),
  pharmacySummary: () => getAuthJSON(`/api/v1/admin/pharmacies/summary`),
  pharmacies: (page = 1, pageSize = 20, q = "") =>
    getAuthJSON(
      `/api/v1/admin/pharmacies?page=${page}&page_size=${pageSize}&q=${encodeURIComponent(q)}`
    ),
  approvePharmacy: (tenantId: string, applicationId: number, body?: any) =>
    postAuthJSON(`/api/v1/admin/pharmacies/${applicationId}/approve`, body || {}, tenantId),
  rejectPharmacy: (tenantId: string, applicationId: number) =>
    postAuthJSON(`/api/v1/admin/pharmacies/${applicationId}/reject`, {}, tenantId),
  verifyPayment: (tenantId: string, code?: string | null) =>
    postAuthJSON(`/api/v1/admin/payments/verify`, { code: code || null }, tenantId),
  rejectPayment: (tenantId: string, code?: string | null) =>
    postAuthJSON(`/api/v1/admin/payments/reject`, { code: code || null }, tenantId),
  approveAffiliate: (userId: number) => postAuthJSON(`/api/v1/admin/affiliates/${userId}/approve`, {}),
  rejectAffiliate: (userId: number) => postAuthJSON(`/api/v1/admin/affiliates/${userId}/reject`, {}),
  affiliates: (page = 1, pageSize = 20, q = "") =>
    getAuthJSON(
      `/api/v1/admin/affiliates?page=${page}&page_size=${pageSize}&q=${encodeURIComponent(q)}`
    ),
  usage: (days = 14) => getAuthJSON(`/api/v1/admin/usage?days=${days}`),
  audit: (params: { tenant_id?: string; action?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.tenant_id) query.set('tenant_id', params.tenant_id);
    if (params.action) query.set('action', params.action);
    if (params.limit) query.set('limit', params.limit.toString());
    return getAuthJSON(`/api/v1/admin/audit${query.toString() ? `?${query.toString()}` : ''}`);
  },
};

// ----------------- StaffAPI -----------------
export const StaffAPI = {
  createCashier: (
    tenantId: string,
    body: {
      email: string;
      password: string;
      phone?: string;
      role?: string;
      assigned_branch_id?: number | null;
    }
  ) => postAuthJSON("/api/v1/staff", body, tenantId),
  list: (tenantId: string) => getAuthJSON("/api/v1/staff", tenantId),
  update: (tenantId: string, userId: number, body: { is_active?: boolean }) =>
    authFetch(
      `/api/v1/staff/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      true,
      tenantId
    ).then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with ${res.status}`);
      }
      return res.json();
    }),
  remove: (tenantId: string, userId: number) =>
    authFetch(
      `/api/v1/staff/${userId}`,
      { method: "DELETE" },
      true,
      tenantId
    ).then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with ${res.status}`);
      }
      return res.json();
    }),
};

// ----------------- Pharmacy models -----------------
export type PharmacyOut = {
  id: number;
  tenant_id: string;
  name: string;
  address?: string | null;
};

export type PharmaciesListResponse = {
  page: number;
  page_size: number;
  total: number;
  items: PharmacyOut[];
};

// ----------------- BillingAPI -----------------
export const BillingAPI = {
  submitPaymentCode: (tenantId: string, code: string) =>
    postAuthJSON("/api/v1/owner/billing/payment-code", { code }, tenantId),
};

// ----------------- UploadAPI -----------------
export const UploadAPI = {
  uploadKyc: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return postMultipart("/uploads/kyc", fd);
  },
};

// ----------------- KYCAPI -----------------
export const KYCAPI = {
  status: (tenantId: string) => getAuthJSON("/api/v1/owner/kyc/status", tenantId),
  update: (tenantId: string, body: any) =>
    putAuthJSON("/api/v1/owner/kyc/status", body, tenantId),
};

// ----------------- PharmaciesAPI -----------------
export const PharmaciesAPI = {
  list: (
    tenantId?: string,
    params?: { page?: number; page_size?: number; q?: string }
  ): Promise<PharmaciesListResponse> => {
    const search = new URLSearchParams();
    search.set("page", String(params?.page ?? 1));
    search.set("page_size", String(params?.page_size ?? 20));
    if (params?.q) search.set("q", params.q);
    const queryString = search.toString();
    const path = `/api/v1/pharmacies${queryString ? `?${queryString}` : ""}`;
    return getAuthJSON<PharmaciesListResponse>(path, tenantId);
  },
  get: (id: number, tenantId?: string) =>
    getAuthJSON<PharmacyOut>(`/api/v1/pharmacies/${id}`, tenantId),
  update: (id: number, body: { name?: string; address?: string }, tenantId?: string) =>
    authFetch(`/api/v1/pharmacies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, true, tenantId).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as PharmacyOut;
    }),
};

// ----------------- BranchAPI -----------------

interface BranchRecord {
  id: number;
  pharmacy_id: number;
  tenant_id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
}

export const BranchAPI = {
  create: (tenantId: string | undefined, payload: { name: string; address?: string; phone?: string; pharmacy_id: number }) =>
    postAuthJSON<{ id: number }>("/api/v1/branches", payload, tenantId),

  list: (tenantId: string | undefined, pharmacyId?: number) => {
    const query = pharmacyId ? `?pharmacy_id=${pharmacyId}` : '';
    return getAuthJSON<{ items: BranchRecord[] }>(`/api/v1/branches${query}`, tenantId);
  },

  get: (tenantId: string | undefined, id: number) =>
    getAuthJSON<BranchRecord>(`/api/v1/branches/${id}`, tenantId),

  update: (tenantId: string | undefined, id: number, payload: { name?: string; address?: string | null; phone?: string | null }) =>
    putAuthJSON<BranchRecord>(`/api/v1/branches/${id}`, payload, tenantId),

  delete: (tenantId: string | undefined, id: number) =>
    deleteAuthJSON(`/api/v1/branches/${id}`, tenantId)
};

// ----------------- ChatAPI -----------------
export const ChatAPI = {
  listThreads: (tenantId: string) => getAuthJSON(`/api/v1/chat/threads`, tenantId),
  createThread: (tenantId: string, title?: string) =>
    postAuthJSON(
      `/api/v1/chat/threads`,
      title ? { title } : {},
      tenantId
    ),
  listMessages: (tenantId: string, threadId: number) =>
    getAuthJSON(`/api/v1/chat/threads/${threadId}/messages`, tenantId),
  sendMessage: (tenantId: string, threadId: number, prompt: string) =>
    postAuthJSON(`/api/v1/chat/threads/${threadId}/messages`, { prompt }, tenantId),
  usage: (tenantId: string, days = 30) =>
    getAuthJSON(`/api/v1/chat/usage?days=${days}`, tenantId),
};

export type OwnerAnalyticsResponse = {
  summary: {
    total_revenue: number;
    total_orders: number;
    unique_customers: number;
    low_stock_items: number;
    avg_order_value: number;
  };
  revenue_trends: {
    date: string;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  inventory_health: {
    category: string;
    current_stock: number;
    avg_reorder_level: number;
    low_stock_items: number;
    total_items: number;
    status: string;
  }[];
  supplier_performance: {
    name: string;
    total_orders: number;
    on_time_rate: number;
    total_value: number;
    avg_rating: number;
  }[];
  staff_performance: {
    name: string;
    role: string;
    transactions: number;
    total_sales: number;
    avg_transaction: number;
    efficiency: number;
  }[];
};

export type SupplierAnalyticsResponse = {
  summary: {
    total_orders: number;
    fulfilled_orders: number;
    fulfillment_rate: number;
    total_revenue: number;
    avg_order_value: number;
    avg_rating: number;
  };
  order_trends: {
    date: string;
    total_orders: number;
    fulfilled_orders: number;
    revenue: number;
  }[];
  product_performance: {
    name: string;
    units_sold: number;
    revenue: number;
    avg_price: number;
    margin: number;
  }[];
  customer_insights: {
    name: string;
    total_orders: number;
    total_value: number;
    satisfaction: number;
  }[];
  delivery_metrics: {
    status: string;
    count: number;
    percentage: number;
  }[];
};

export const OwnerAnalyticsAPI = {
  overview: (
    tenantId: string,
    options?: { horizon?: string; trendWeeks?: number; days?: number }
  ) => {
    const params = new URLSearchParams();
    if (options?.horizon) params.set("horizon", options.horizon);
    if (options?.trendWeeks) params.set("trend_weeks", String(options.trendWeeks));
    if (options?.days) params.set("days", String(options.days));
    const query = params.toString();
    const path = `/api/v1/analytics/owner/overview${query ? `?${query}` : ""}`;
    return getAuthJSON<OwnerAnalyticsResponse>(path, tenantId);
  },
};

export const SupplierAnalyticsAPI = {
  overview: (days?: number) => {
    const params = new URLSearchParams();
    if (days) params.set("days", String(days));
    const query = params.toString();
    const path = `/api/v1/analytics/supplier/overview${query ? `?${query}` : ""}`;
    return getAuthJSON(path);
  },
};

// ----------------- OwnerChatAPI -----------------
export type OwnerChatThread = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type OwnerChatMessage = {
  id: number;
  thread_id: number;
  role: "owner" | "assistant";
  content: string;
  created_at: string;
};

export const OwnerChatAPI = {
  listThreads: (tenantId: string) => getAuthJSON<OwnerChatThread[]>("/api/v1/owner/chat/threads", tenantId),
  createThread: (tenantId: string, title: string) =>
    postAuthJSON<OwnerChatThread>("/api/v1/owner/chat/threads", { title }, tenantId),
  listMessages: (tenantId: string, threadId: number) =>
    getAuthJSON<OwnerChatMessage[]>(`/api/v1/owner/chat/threads/${threadId}/messages`, tenantId),
  sendMessage: (tenantId: string, threadId: number, prompt: string) =>
    postAuthJSON<OwnerChatMessage>(`/api/v1/owner/chat/threads/${threadId}/messages`, { prompt }, tenantId),
};

// ----------------- InventoryAPI -----------------
export type InventoryItem = {
  id: number;
  medicine_id: number;
  medicine_name: string;
  sku?: string | null;
  branch?: string | null;
  quantity: number;
  pack_size: number;
  packs: number;
  singles: number;
  reorder_level: number;
  expiry_date?: string | null;
  lot_number?: string | null;
  sell_price?: number | null;
};

export type InventoryListResponse = {
  page: number;
  page_size: number;
  total: number;
  items: InventoryItem[];
};

type InventoryListOptions = {
  q?: string;
  branch?: string;
  expiringInDays?: number;
  lowStockOnly?: boolean;
  page?: number;
  pageSize?: number;
};

type InventoryUpdatePayload = {
  quantity?: number;
  reorder_level?: number;
  expiry_date?: string | null;
  lot_number?: string | null;
  sell_price?: number | null;
};

type InventoryCreatePayload = {
  medicine_id: number;
  branch?: string | null;
  pack_size: number;
  packs_count?: number;
  singles_count?: number;
  expiry_date?: string | null;
  lot_number?: string | null;
  purchase_price?: number | null;
  sell_price?: number | null;
  reorder_level?: number;
};

export const InventoryAPI = {
  list: (tenantId?: string, options?: InventoryListOptions) => {
    const params = new URLSearchParams();
    if (options?.q) params.set("q", options.q);
    if (options?.branch) params.set("branch", options.branch);
    if (typeof options?.expiringInDays === "number") {
      params.set("expiring_in_days", String(options.expiringInDays));
    }
    if (options?.lowStockOnly) params.set("low_stock_only", "true");
    if (options?.page) params.set("page", String(options.page));
    if (options?.pageSize) params.set("page_size", String(options.pageSize));
    const query = params.toString();
    const path = `/api/v1/inventory/items${query ? `?${query}` : ""}`;
    return getAuthJSON<InventoryListResponse>(path, tenantId);
  },
  create: async (tenantId: string | undefined, payload: InventoryCreatePayload) => {
    const form = new URLSearchParams();
    form.set("medicine_id", String(payload.medicine_id));
    form.set("pack_size", String(Math.max(1, payload.pack_size || 1)));
    if (payload.branch) {
      form.set("branch", payload.branch);
    }
    if (typeof payload.packs_count === "number") {
      form.set("packs_count", String(Math.max(0, payload.packs_count)));
    }
    if (typeof payload.singles_count === "number") {
      form.set("singles_count", String(Math.max(0, payload.singles_count)));
    }
    if (payload.expiry_date) {
      form.set("expiry_date", payload.expiry_date);
    }
    if (payload.lot_number) {
      form.set("lot_number", payload.lot_number);
    }
    if (typeof payload.purchase_price === "number") {
      form.set("purchase_price", String(payload.purchase_price));
    }
    if (typeof payload.sell_price === "number") {
      form.set("sell_price", String(payload.sell_price));
    }
    if (typeof payload.reorder_level === "number") {
      form.set("reorder_level", String(Math.max(0, payload.reorder_level)));
    }
    const res = await authFetch(
      `/api/v1/inventory/items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      },
      true,
      tenantId
    );
    if (!res.ok) {
      throw new Error((await res.text().catch(() => "")) || `Request failed with ${res.status}`);
    }
    return res.json();
  },
  update: async (tenantId: string | undefined, itemId: number, payload: InventoryUpdatePayload) => {
    const form = new URLSearchParams();
    if (typeof payload.quantity === "number") {
      form.set("quantity", String(payload.quantity));
    }
    if (typeof payload.reorder_level === "number") {
      form.set("reorder_level", String(Math.max(0, payload.reorder_level)));
    }
    if (typeof payload.sell_price === "number") {
      form.set("sell_price", String(payload.sell_price));
    }
    if (payload.expiry_date !== undefined) {
      form.set("expiry_date", payload.expiry_date || "");
    }
    if (payload.lot_number !== undefined) {
      form.set("lot_number", payload.lot_number || "");
    }
    const res = await authFetch(
      `/api/v1/inventory/items/${itemId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      },
      true,
      tenantId
    );
    if (!res.ok) {
      throw new Error((await res.text().catch(() => "")) || `Request failed with ${res.status}`);
    }
    return res.json();
  },
  remove: async (tenantId: string | undefined, itemId: number) => {
    const res = await authFetch(
      `/api/v1/inventory/items/${itemId}`,
      { method: "DELETE" },
      true,
      tenantId
    );
    if (!res.ok) {
      throw new Error((await res.text().catch(() => "")) || `Request failed with ${res.status}`);
    }
    return res.json();
  },
};

// ----------------- MedicinesAPI -----------------
export type MedicineListItem = {
  id: number;
  name: string;
  sku?: string | null;
  category?: string | null;
  manufacturer?: string | null;
};

export type MedicinesListResponse = {
  page: number;
  page_size: number;
  total: number;
  items: MedicineListItem[];
};

type MedicinesListOptions = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export const MedicinesAPI = {
  list: (tenantId?: string, options?: MedicinesListOptions) => {
    const query = new URLSearchParams();
    if (options?.q) {
      query.set("q", options.q);
    }
    if (options?.page) {
      query.set("page", String(options.page));
    }
    if (options?.pageSize) {
      query.set("page_size", String(Math.min(200, Math.max(1, options.pageSize))));
    }
    const path = `/api/v1/medicines${query.toString() ? `?${query.toString()}` : ""}`;
    return getAuthJSON<MedicinesListResponse>(path, tenantId);
  },
};

// ----------------- SalesAPI -----------------
type SaleLineInput = {
  name_or_sku: string;
  quantity_units: number;
  unit_price?: number;
};

export const SalesAPI = {
  pos: (
    tenantId: string | undefined,
    payload: { lines: SaleLineInput[]; branch?: string | null }
  ) => {
    const { lines, branch } = payload;
    const query = branch ? `?branch=${encodeURIComponent(branch)}` : "";
    const path = `/api/v1/sales/pos${query}`;
    return postAuthJSON<{ id: number; total: number }>(path, lines, tenantId);
  },
};

// ----------------- SupplierAPI -----------------
export type SupplierProfile = {
  id: number;
  user_id: number;
  business_name: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  business_license?: string | null;
  tax_certificate?: string | null;
  is_verified: boolean;
  created_at: string;
};

export type SupplierProduct = {
  id: number;
  supplier_id: number;
  name: string;
  description?: string | null;
  category?: string | null;
  unit_price: number;
  minimum_order_quantity: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
};

export type Order = {
  id: number;
  customer_id: number;
  supplier_id: number;
  tenant_id: string;
  status: string;
  total_amount: number;
  payment_method?: string | null;
  payment_code?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  supplier?: SupplierProfile;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: SupplierProduct;
};

export type OrderReview = {
  id: number;
  order_id: number;
  customer_id: number;
  rating: number;
  comment?: string | null;
  created_at: string;
};

export const SupplierAPI = {
  // Profile management
  getProfile: () => getAuthJSON<SupplierProfile>("/api/v1/suppliers/profile"),
  createProfile: (data: any) => postAuthJSON<SupplierProfile>("/api/v1/suppliers/profile", data),
  updateProfile: (data: any) => putAuthJSON<SupplierProfile>("/api/v1/suppliers/profile", data),
  
  // Product management
  getProducts: () => getAuthJSON<SupplierProduct[]>("/api/v1/suppliers/products"),
  createProduct: (data: any) => postAuthJSON<SupplierProduct>("/api/v1/suppliers/products", data),
  updateProduct: (id: number, data: any) => putAuthJSON<SupplierProduct>(`/api/v1/suppliers/products/${id}`, data),
  deleteProduct: (id: number) => deleteAuthJSON(`/api/v1/suppliers/products/${id}`),
  
  // Order management
  getOrders: () => getAuthJSON<Order[]>("/api/v1/suppliers/orders"),
  approveOrder: (id: number) => putAuthJSON(`/api/v1/suppliers/orders/${id}/approve`, {}),
  rejectOrder: (id: number) => putAuthJSON(`/api/v1/suppliers/orders/${id}/reject`, {}),
  verifyPayment: (id: number) => putAuthJSON(`/api/v1/suppliers/orders/${id}/verify-payment`, {}),
  markDelivered: (id: number) => putAuthJSON(`/api/v1/suppliers/orders/${id}/mark-delivered`, {}),
  
  // Public endpoints for customers
  browse: (tenantId: string) => getAuthJSON<SupplierProfile[]>("/api/v1/suppliers/browse", tenantId),
  getSupplierProducts: (supplierId: number, tenantId: string) => 
    getAuthJSON<SupplierProduct[]>(`/api/v1/suppliers/${supplierId}/products`, tenantId),
};

export const OrderAPI = {
  create: (data: any, tenantId: string) => postAuthJSON<Order>("/api/v1/orders", data, tenantId),
  list: (tenantId: string) => getAuthJSON<Order[]>("/api/v1/orders", tenantId),
  get: (id: number, tenantId: string) => getAuthJSON<Order>(`/api/v1/orders/${id}`, tenantId),
  submitPaymentCode: (id: number, code: string, tenantId: string) => 
    putAuthJSON(`/api/v1/orders/${id}/payment-code`, { code }, tenantId),
  createReview: (id: number, data: any, tenantId: string) => 
    postAuthJSON<OrderReview>(`/api/v1/orders/${id}/review`, data, tenantId),
  getReview: (id: number, tenantId: string) => 
    getAuthJSON<OrderReview>(`/api/v1/orders/${id}/review`, tenantId),
};

export const SupplierOnboardingAPI = {
  getStatus: () => getAuthJSON("/api/v1/supplier-onboarding/status"),
  submitKYC: (data: any) => postAuthJSON("/api/v1/supplier-onboarding/kyc/submit", data),
  getKYCStatus: () => getAuthJSON("/api/v1/supplier-onboarding/kyc/status"),
  submitPayment: (data: any) => postAuthJSON("/api/v1/supplier-onboarding/payment/submit", data),
  getPaymentStatus: () => getAuthJSON("/api/v1/supplier-onboarding/payment/status"),
};

// Update AdminAPI with supplier management
export const SupplierAdminAPI = {
  getSuppliers: () => getAuthJSON("/api/v1/admin/suppliers"),
  getPendingKYC: () => getAuthJSON("/api/v1/admin/suppliers/kyc/pending"),
  approveKYC: (supplierId: number) => postAuthJSON(`/api/v1/admin/suppliers/${supplierId}/kyc/approve`, {}),
  rejectKYC: (supplierId: number, notes?: string) => 
    postAuthJSON(`/api/v1/admin/suppliers/${supplierId}/kyc/reject`, { notes }),
  getPendingPayments: () => getAuthJSON("/api/v1/admin/suppliers/payments/pending"),
  verifyPayment: (code: string) => postAuthJSON(`/api/v1/admin/suppliers/payments/${code}/verify`, {}),
  rejectPayment: (code: string, notes?: string) => 
    postAuthJSON(`/api/v1/admin/suppliers/payments/${code}/reject`, { notes }),
};

// Other API objects (AffiliateAPI, AdminAPI, etc.) remain unchanged

// export const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
// export const TENANT_HEADER =
//   process.env.NEXT_PUBLIC_TENANT_HEADER || "X-Tenant-ID";

// function buildHeaders(
//   initHeaders?: HeadersInit,
//   tenantId?: string
// ): HeadersInit {
//   const headers: Record<string, string> = {
//     ...(initHeaders as Record<string, string>),
//   };
//   if (tenantId) headers[TENANT_HEADER] = tenantId;
//   return headers;
// }

// export async function putAuthJSON<T = any>(
//   path: string,
//   bodyData: any,
//   tenantId?: string
// ): Promise<T> {
//   const res = await authFetch(
//     path,
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bodyData),
//     },
//     true,
//     tenantId
//   );
//   if (!res.ok) {
//     try {
//       const data = await res.json();
//       const msg = data?.error || data?.detail || JSON.stringify(data);
//       throw new Error(msg || `Request failed with ${res.status}`);
//     } catch {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `Request failed with ${res.status}`);
//     }
//   }
//   return (await res.json()) as T;
// }

// export async function postForm<T = any>(
//   path: string,
//   data: Record<string, string>,
//   tenantId?: string
// ): Promise<T> {
//   const body = new URLSearchParams(data);
//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "POST",
//     headers: buildHeaders(
//       {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       tenantId
//     ),
//     body,
//   });
//   if (!res.ok) {
//     try {
//       const data = await res.json();
//       const msg = data?.error || data?.detail || JSON.stringify(data);
//       throw new Error(msg || `Request failed with ${res.status}`);
//     } catch {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `Request failed with ${res.status}`);
//     }
//   }
//   return (await res.json()) as T;
// }

// export async function postJSON<T = any>(
//   path: string,
//   body: any,
//   tenantId?: string
// ): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "POST",
//     headers: buildHeaders({ "Content-Type": "application/json" }, tenantId),
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) {
//     try {
//       const data = await res.json();
//       const msg = data?.error || data?.detail || JSON.stringify(data);
//       throw new Error(msg || `Request failed with ${res.status}`);
//     } catch {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `Request failed with ${res.status}`);
//     }
//   }
//   return (await res.json()) as T;
// }

// export async function postMultipart<T = any>(
//   path: string,
//   formData: FormData,
//   tenantId?: string
// ): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "POST",
//     headers: buildHeaders(undefined, tenantId),
//     body: formData,
//   });
//   if (!res.ok) {
//     try {
//       const data = await res.json();
//       const msg = data?.error || data?.detail || JSON.stringify(data);
//       throw new Error(msg || `Request failed with ${res.status}`);
//     } catch {
//       let message = `Request failed with ${res.status}`;
//       throw new Error(message);
//     }
//   }
//   return (await res.json()) as T;
// }

// export function getAccessToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("access_token");
// }

// function getRefreshToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("refresh_token");
// }

// async function refreshTokens(): Promise<boolean> {
//   const rt = getRefreshToken();
//   if (!rt) return false;
//   const url = `${API_BASE}/api/v1/auth/refresh?refresh_token=${encodeURIComponent(
//     rt
//   )}`;
//   const res = await fetch(url, { method: "POST" });
//   if (!res.ok) return false;
//   try {
//     const data = (await res.json()) as {
//       access_token: string;
//       refresh_token: string;
//       token_type: string;
//       expires_in: number;
//     };
//     if (typeof window !== "undefined") {
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);
//     }
//     return true;
//   } catch {
//     return false;
//   }
// }

// async function authFetch(
//   path: string,
//   init?: RequestInit,
//   retry = true,
//   tenantId?: string
// ): Promise<Response> {
//   const token = getAccessToken();
//   const headers: HeadersInit = buildHeaders(
//     {
//       ...(init?.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     tenantId
//   );
//   const res = await fetch(`${API_BASE}${path}`, { ...(init || {}), headers });
//   if (res.status === 401 && retry) {
//     const ok = await refreshTokens();
//     if (ok) {
//       const newToken = getAccessToken();
//       const retryHeaders: HeadersInit = buildHeaders(
//         {
//           ...(init?.headers || {}),
//           ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
//         },
//         tenantId
//       );
//       return fetch(`${API_BASE}${path}`, {
//         ...(init || {}),
//         headers: retryHeaders,
//       });
//     }
//   }
//   return res;
// }

// export async function getAuthJSON<T = any>(
//   path: string,
//   tenantId?: string
// ): Promise<T> {
//   const res = await authFetch(path, undefined, true, tenantId);
//   if (!res.ok) {
//     try {
//       const data = await res.json();
//       const msg = data?.error || data?.detail || JSON.stringify(data);
//       throw new Error(msg || `Request failed with ${res.status}`);
//     } catch {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `Request failed with ${res.status}`);
//     }
//   }
//   return (await res.json()) as T;
// }

// export async function postAuthJSON<T = any>(
//   path: string,
//   bodyData: any,
//   tenantId?: string
// ): Promise<T> {
//   const res = await authFetch(
//     path,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bodyData),
//     },
//     true,
//     tenantId
//   );
//   if (!res.ok) {
//     try {
//       const data = await res.json();
//       const msg = data?.error || data?.detail || JSON.stringify(data);
//       throw new Error(msg || `Request failed with ${res.status}`);
//     } catch {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `Request failed with ${res.status}`);
//     }
//   }
//   return (await res.json()) as T;
// }

// // Convenience wrappers for key flows
// export const AuthAPI = {
//   registerAffiliate: (body: any) => postJSON("/auth/register/affiliate", body),
//   registerPharmacy: (body: any) => postJSON("/auth/register/pharmacy", body),
//   registerVerify: (email: string, code: string) =>
//     postForm("/auth/register/verify", { email, code }),
//   verifyRegistration: (email: string, code: string) =>
//     postForm("/auth/register/verify", { email, code }),
//   login: (email: string, password: string, tenantId?: string) =>
//     postForm("/auth/login", { username: email, password }, tenantId),
//   loginRequestCode: (email: string, password: string, tenantId?: string) =>
//     postForm(
//       "/auth/login/request-code",
//       { username: email, password },
//       tenantId
//     ),
//   loginVerify: (email: string, code: string, tenantId?: string) =>
//     postJSON("/auth/login/verify", { email, code }, tenantId),
//   me: () => getAuthJSON("/auth/me"),
// };

// export const AffiliateAPI = {
//   getLinks: () => getAuthJSON("/affiliate/register-link"),
//   createLink: () => getAuthJSON("/affiliate/register-link?create_new=true"),
//   deactivate: (token: string) =>
//     postAuthJSON(
//       `/affiliate/links/${encodeURIComponent(token)}/deactivate`,
//       {}
//     ),
//   rotate: (token: string) =>
//     postAuthJSON(`/affiliate/links/${encodeURIComponent(token)}/rotate`, {}),
//   dashboard: () => getAuthJSON("/affiliate/dashboard"),
//   payouts: (status?: string) =>
//     getAuthJSON(
//       `/affiliate/payouts${
//         status ? `?status_filter=${encodeURIComponent(status)}` : ""
//       }`
//     ),
//   requestPayout: (month?: string, percent = 5) =>
//     postAuthJSON("/affiliate/payouts/request", { month, percent }),
//   updateProfile: (body: any) => postAuthJSON("/affiliate/profile", body),
// };

// export const AdminAPI = {
//   pharmacies: (page = 1, pageSize = 20, q?: string) =>
//     getAuthJSON(
//       `/admin/pharmacies?page=${page}&page_size=${pageSize}${
//         q ? `&q=${encodeURIComponent(q)}` : ""
//       }`
//     ),
//   affiliates: (page = 1, pageSize = 20, q?: string) =>
//     getAuthJSON(
//       `/admin/affiliates?page=${page}&page_size=${pageSize}${
//         q ? `&q=${encodeURIComponent(q)}` : ""
//       }`
//     ),
//   approvePharmacy: (
//     tenantId: string,
//     applicationId: number,
//     body?: { issue_temp_password?: boolean; temp_password?: string }
//   ) =>
//     postAuthJSON(
//       `/admin/pharmacies/${applicationId}/approve`,
//       body || {},
//       tenantId
//     ),
//   rejectPharmacy: (tenantId: string, applicationId: number) =>
//     postAuthJSON(`/admin/pharmacies/${applicationId}/reject`, {}, tenantId),
//   verifyPayment: (tenantId: string, code?: string | null) =>
//     postAuthJSON(`/admin/payments/verify`, { code: code || null }, tenantId),
//   rejectPayment: (tenantId: string, code?: string | null) =>
//     postAuthJSON(`/admin/payments/reject`, { code: code || null }, tenantId),
//   analyticsOverview: (days = 30) =>
//     getAuthJSON(`/admin/analytics/overview?days=${days}`),
//   downloadPharmacyLicense: async (applicationId: number) => {
//     const res = await authFetch(
//       `/admin/pharmacies/${applicationId}/license`,
//       { method: "GET" },
//       true
//     );
//     if (!res.ok) {
//       const text = await res.text().catch(() => "");
//       throw new Error(text || `HTTP ${res.status}`);
//     }
//     const blob = await res.blob();
//     let filename = `license-${applicationId}`;
//     const disposition = res.headers.get("Content-Disposition") || "";
//     const match = disposition.match(
//       /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i
//     );
//     const extracted = match?.[1] || match?.[2];
//     if (extracted) {
//       try {
//         filename = decodeURIComponent(extracted);
//       } catch {
//         filename = extracted;
//       }
//     }
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   },
//   approveAffiliate: (userId: number) =>
//     postAuthJSON(`/admin/affiliates/${userId}/approve`, {}),
//   rejectAffiliate: (userId: number) =>
//     postAuthJSON(`/admin/affiliates/${userId}/reject`, {}),
//   listAffiliatePayouts: (status?: string) =>
//     getAuthJSON(
//       `/admin/affiliate/payouts${
//         status ? `?status=${encodeURIComponent(status)}` : ""
//       }`
//     ),
//   markPayoutPaid: (payoutId: number) =>
//     postAuthJSON(`/admin/affiliate/payouts/${payoutId}/mark-paid`, {}),
//   approvePayout: (payoutId: number) =>
//     postAuthJSON(`/admin/affiliate/payouts/${payoutId}/approve`, {}),
//   usage: (days = 30) => getAuthJSON(`/admin/usage?days=${days}`),
//   audit: (params?: { tenant_id?: string; action?: string; limit?: number }) =>
//     getAuthJSON(
//       `/admin/audit${(() => {
//         const qs = new URLSearchParams();
//         if (params?.tenant_id) qs.set("tenant_id", params.tenant_id);
//         if (params?.action) qs.set("action", params.action);
//         if (params?.limit) qs.set("limit", String(params.limit));
//         const s = qs.toString();
//         return s ? `?${s}` : "";
//       })()}`
//     ),
// };

// export const StaffAPI = {
//   createCashier: (tenantId: string, body: any) =>
//     postAuthJSON("/staff", body, tenantId),
//   list: (tenantId: string) => getAuthJSON("/staff", tenantId),
//   update: (tenantId: string, userId: number, body: { is_active?: boolean }) =>
//     authFetch(
//       `/staff/${userId}`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       },
//       true,
//       tenantId
//     ).then(async (res) => {
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || `HTTP ${res.status}`);
//       }
//       return res.json();
//     }),
//   remove: (tenantId: string, userId: number) =>
//     authFetch(`/staff/${userId}`, { method: "DELETE" }, true, tenantId).then(
//       async (res) => {
//         if (!res.ok) {
//           const t = await res.text();
//           throw new Error(t || `HTTP ${res.status}`);
//         }
//         return res.json();
//       }
//     ),
// };

// export const BillingAPI = {
//   submitPaymentCode: (tenantId: string, code: string) =>
//     postAuthJSON("/billing/payment-code", { code }, tenantId),
// };

// export const UploadAPI = {
//   uploadKyc: async (
//     file: File
//   ): Promise<{ path: string; size: number; filename: string }> => {
//     const fd = new FormData();
//     fd.append("file", file);
//     return await postMultipart(`/uploads/kyc`, fd);
//   },
// };

// export const KYCAPI = {
//   status: (tenantId: string) => getAuthJSON(`/owner/kyc/status`, tenantId),
//   update: (tenantId: string, body: any) =>
//     putAuthJSON(`/owner/kyc/status`, body, tenantId),
// };

// export const PharmaciesAPI = {
//   list: (page = 1, pageSize = 20, q?: string) =>
//     getAuthJSON(
//       `/pharmacies?page=${page}&page_size=${pageSize}${
//         q ? `&q=${encodeURIComponent(q)}` : ""
//       }`
//     ),
//   get: (id: number) => getAuthJSON(`/pharmacies/${id}`),
//   update: (id: number, body: { name?: string; address?: string }) =>
//     authFetch(`/pharmacies/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     }).then(async (res) => {
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || `HTTP ${res.status}`);
//       }
//       return res.json();
//     }),
// };

// export const ChatAPI = {
//   listThreads: (tenantId: string) => getAuthJSON(`/chat/threads`, tenantId),
//   createThread: (tenantId: string, title: string) =>
//     postAuthJSON(`/chat/threads`, { title }, tenantId),
//   listMessages: (tenantId: string, threadId: number) =>
//     getAuthJSON(`/chat/threads/${threadId}/messages`, tenantId),
//   sendMessage: (tenantId: string, threadId: number, prompt: string) =>
//     postAuthJSON(`/chat/threads/${threadId}/messages`, { prompt }, tenantId),
//   usage: (tenantId: string, days = 30) =>
//     getAuthJSON(`/chat/usage?days=${days}`, tenantId),
//   sendStream: async (
//     tenantId: string,
//     threadId: number,
//     prompt: string,
//     onEvent: (evt: { event: string; data?: any }) => void
//   ): Promise<void> => {
//     const res = await authFetch(
//       `/chat/threads/${threadId}/messages/stream`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       },
//       true,
//       tenantId
//     );
//     if (!res.ok || !res.body) {
//       const t = await res.text().catch(() => "");
//       throw new Error(t || `HTTP ${res.status}`);
//     }
//     const reader = res.body.getReader();
//     const decoder = new TextDecoder();
//     let buf = "";
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       buf += decoder.decode(value, { stream: true });
//       let idx;
//       while ((idx = buf.indexOf("\n\n")) !== -1) {
//         const chunk = buf.slice(0, idx).trim();
//         buf = buf.slice(idx + 2);
//         if (chunk.startsWith("data:")) {
//           try {
//             const jsonStr = chunk.slice(5).trim();
//             const obj = JSON.parse(jsonStr);
//             onEvent(obj);
//           } catch {}
//         }
//       }
//     }
//   },
// };
