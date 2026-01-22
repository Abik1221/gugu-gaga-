export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://mymesob.com/api/v1";
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

export function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// Cookie Version System - Update this when deploying breaking changes
// See COOKIE_VERSION_GUIDE.md for detailed instructions
const COOKIE_VERSION = "v1.0.2"; // INCREMENT THIS ON UPDATES

/**
 * Check and enforce cookie/auth version.
 * Clears all authentication data if version mismatch detected.
 * Call this on app initialization to ensure users have fresh auth data.
 */
export function checkAuthVersion() {
  if (typeof window === "undefined") return;

  const storedVersion = localStorage.getItem("auth_version");

  // Version mismatch - clear all auth data
  if (storedVersion !== COOKIE_VERSION) {
    console.log(`[Auth Version] Clearing old data. Old: ${storedVersion}, New: ${COOKIE_VERSION}`);

    // Clear localStorage
    const keysToKeep = ["cookie-consent", "theme"]; // Keep non-auth preferences
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clear auth cookies
    const cookiesToClear = ["access_token", "refresh_token", "token"];
    cookiesToClear.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Set new version
    localStorage.setItem("auth_version", COOKIE_VERSION);

    console.log("[Auth Version] Auth data cleared. Please log in again.");
  }
}

/**
 * Centralized sign out function.
 * Clears all authentication tokens from both localStorage and cookies,
 * then redirects to the homepage.
 */
export function signOut() {
  if (typeof window === "undefined") return;

  // Clear localStorage tokens
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Clear cookies by setting them to expire in the past
  const cookiesToClear = ["access_token", "refresh_token", "token"];
  cookiesToClear.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  });

  // Redirect to homepage
  window.location.href = "/";
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
      setCookie("access_token", data.access_token, 7);
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
  user?: {
    role?: string;
    tenant_id?: string;
  };
  tenant_id?: string;
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
  checkEmail: async (email: string) => {
    return postJSON<{ exists: boolean; message: string }>("/api/v1/auth/check-email", { email });
  },
  registerAffiliate: async (body: any) => {
    const resp = await postJSON<AuthTokenResponse>("/api/v1/auth/register/affiliate", body);
    if (typeof window !== "undefined" && resp.access_token) {
      localStorage.setItem("access_token", resp.access_token);
      localStorage.setItem("refresh_token", resp.refresh_token);
      setCookie("access_token", resp.access_token, 7);
    }
    return resp;
  },
  registerPharmacy: async (body: any) => {
    const resp = await postJSON<AuthTokenResponse>("/api/v1/auth/register/owner", body);
    if (typeof window !== "undefined" && resp.access_token) {
      localStorage.setItem("access_token", resp.access_token);
      localStorage.setItem("refresh_token", resp.refresh_token);
      setCookie("access_token", resp.access_token, 7);
    }
    return resp;
  },


  registerVerify: async (email: string, code: string) => {
    try {
      const resp = await postForm<AuthTokenResponse>("/api/v1/auth/register/verify", { email, code });
      if (typeof window !== "undefined" && resp.access_token) {
        localStorage.setItem("access_token", resp.access_token);
        localStorage.setItem("refresh_token", resp.refresh_token);
        setCookie("access_token", resp.access_token, 7);
      }
      return resp;
    } catch (err: any) {
      if (err?.status === 422) {
        console.warn("[AuthAPI.registerVerify] 422, retrying with JSON", {
          body: err.body,
        });
        try {
          const resp = await postJSON<AuthTokenResponse>("/api/v1/auth/register/verify", { email, code });
          if (typeof window !== "undefined" && resp.access_token) {
            localStorage.setItem("access_token", resp.access_token);
            localStorage.setItem("refresh_token", resp.refresh_token);
            setCookie("access_token", resp.access_token, 7);
          }
          return resp;
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
  login: (email: string, password: string, tenantId?: string, expectedRole?: string) =>
    postForm<AuthTokenResponse>(
      "/api/v1/auth/login",
      {
        username: email,
        password,
        grant_type: "password",
        expected_role: expectedRole || "",
      },
      tenantId
    ).then(
      (resp) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", resp.access_token);
          localStorage.setItem("refresh_token", resp.refresh_token);
          setCookie("access_token", resp.access_token, 7);
        }
        return resp;
      }
    ),
  loginRequestCode: (email: string, password: string, tenantId?: string, expectedRole?: string) =>
    postForm(
      "/api/v1/auth/login/request-code",
      { username: email, password, grant_type: "password", expected_role: expectedRole || "" },
      tenantId
    ),
  loginVerify: (email: string, code: string, tenantId?: string) =>
    postJSON<AuthTokenResponse>("/api/v1/auth/login/verify", { email, code }, tenantId).then((resp) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", resp.access_token);
        localStorage.setItem("refresh_token", resp.refresh_token);
        setCookie("access_token", resp.access_token, 7);
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
  requestPayoutWithBankDetails: (data: {
    month?: string;
    percent?: number;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
  }) =>
    postAuthJSON("/api/v1/affiliate/payouts/request", data, ""),
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
  system: {
    health: () => getAuthJSON("/api/v1/system/health"),
    settings: () => getAuthJSON("/api/v1/system/settings"),
    updateSetting: (key: string, value: string, description?: string) =>
      authFetch(`/api/v1/system/settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, description }),
      }, true).then(res => res.json()),
    announcements: () => getAuthJSON("/api/v1/system/announcements"),
    createAnnouncement: (body: any) => postAuthJSON("/api/v1/system/announcements", body),
    deleteAnnouncement: (id: number) => deleteAuthJSON(`/api/v1/system/announcements/${id}`),
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
  horizon: string;
  totals: {
    total_revenue: number;
    average_ticket: number;
    units_sold: number;
    sale_count: number;
    active_cashiers: number;
    total_customers: number;
    active_customers: number;
    upcoming_refills: number;
  };
  deltas: {
    revenue_vs_last_period: number;
    avg_ticket_vs_last_period: number;
    units_vs_last_period: number;
  };
  revenue_trend: {
    period: string;
    revenue: number;
  }[];
  top_products: {
    name: string;
    revenue: number;
    quantity: number;
  }[];
  inventory_health: {
    label: string;
    count: number;
  }[];
  recent_payments: {
    id: number;
    status: string;
    status_label: string;
    code?: string;
    created_at: string; // ISO
    created_at_formatted: string;
  }[];
  branch_comparison: {
    branch: number | string | null;
    revenue: number;
    sale_count: number;
    units_sold: number;
  }[];
  staff_productivity: {
    user_id: number;
    name: string;
    email?: string;
    role: string;
    total_sales: number;
    transactions: number;
    units_sold: number;
  }[];
  staff_activity: {
    id: number;
    action: string;
    actor_user_id?: number;
    actor_name?: string;
    actor_role?: string;
    target_type?: string;
    target_id?: string;
    metadata?: any;
    created_at: string; // ISO
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
  unit_type?: string;
  packaging_data?: any;
  price_per_unit?: number | null;
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



// ----------------- Generic API Wrapper -----------------
export const api = {
  get: async (url: string, config?: any) => {
    let finalUrl = url;
    if (config?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
      }
    }
    const data = await getAuthJSON(finalUrl);
    return { data };
  },
  post: async (url: string, data: any) => {
    const res = await postAuthJSON(url, data);
    return { data: res };
  },
  patch: async (url: string, data: any) => {
    const res = await authFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }, true);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
    const json = await res.json().catch(() => ({}));
    return { data: json };
  },
  delete: async (url: string) => {
    const res = await authFetch(url, { method: "DELETE" }, true);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
    const json = await res.json().catch(() => ({}));
    return { data: json };
  }
};

// ----------------- GoalsAPI -----------------
export enum GoalType {
  REVENUE = "revenue",
  PROFIT = "profit",
  CUSTOMERS = "customers",
  SALES_COUNT = "sales_count",
}

export enum GoalStatus {
  ACTIVE = "active",
  ACHIEVED = "achieved",
  MISSED = "missed",
  ARCHIVED = "archived",
}

export type Milestone = {
  id: number;
  goal_id: number;
  title: string;
  target_value: number;
  achieved: boolean;
  achieved_at?: string;
  description?: string;
  created_at: string;
};

export type BusinessGoal = {
  id: number;
  tenant_id: string;
  title: string;
  goal_type: GoalType;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  status: GoalStatus;
  description?: string;
  created_at: string;
  updated_at: string;
  milestones: Milestone[];
  progress_percentage?: number;
  days_remaining?: number;
  is_on_track?: boolean;
};

export const GoalsAPI = {
  list: (tenantId: string, params?: { status?: GoalStatus; goal_type?: GoalType }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.goal_type) search.set("goal_type", params.goal_type);
    return getAuthJSON<BusinessGoal[]>(`/api/v1/goals?${search.toString()}`, tenantId);
  },
  create: (tenantId: string, body: any) => postAuthJSON<BusinessGoal>("/api/v1/goals", body, tenantId),
  get: (tenantId: string, id: number) => getAuthJSON<BusinessGoal>(`/api/v1/goals/${id}`, tenantId),
  update: (tenantId: string, id: number, body: any) =>
    authFetch(`/api/v1/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, true, tenantId).then(res => res.json()),
  delete: (tenantId: string, id: number) =>
    authFetch(`/api/v1/goals/${id}`, { method: "DELETE" }, true, tenantId).then(res => res.json()),
  addMilestone: (tenantId: string, goalId: number, body: any) =>
    postAuthJSON(`/api/v1/goals/${goalId}/milestones`, body, tenantId),
  getProgress: (tenantId: string, goalId: number) =>
    getAuthJSON(`/api/v1/goals/${goalId}/progress`, tenantId),
};

// ----------------- NotificationsAPI -----------------
export type Notification = {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export const NotificationsAPI = {
  list: (tenantId: string) => getAuthJSON<Notification[]>("/api/v1/notifications", tenantId),
  markRead: (tenantId: string, notificationId: number) =>
    postAuthJSON(`/api/v1/notifications/${notificationId}/read`, {}, tenantId),
  getUnreadCount: async (tenantId: string): Promise<number> => {
    const notifications = await getAuthJSON<Notification[]>("/api/v1/notifications", tenantId);
    return notifications.filter(n => !n.is_read).length;
  },
};

// ----------------- ExpensesAPI -----------------
export enum ExpenseCategory {
  SALARY = "salary",
  RENT = "rent",
  TAX = "tax",
  UTILITIES = "utilities",
  SUPPLIES = "supplies",
  MAINTENANCE = "maintenance",
  OTHER = "other",
}

export enum ExpenseStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
}

export type Expense = {
  id: number;
  tenant_id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  due_date?: string | null;
  paid_date?: string | null;
  status: ExpenseStatus;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export const ExpensesAPI = {
  list: (tenantId: string, params?: { status?: ExpenseStatus; category?: ExpenseCategory }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.category) search.set("category", params.category);
    return getAuthJSON<Expense[]>(`/api/v1/expenses?${search.toString()}`, tenantId);
  },
  create: (tenantId: string, body: any) => postAuthJSON<Expense>("/api/v1/expenses", body, tenantId),
  update: (tenantId: string, id: number, body: any) =>
    authFetch(`/api/v1/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, true, tenantId).then(res => res.json()),
  delete: (tenantId: string, id: number) =>
    authFetch(`/api/v1/expenses/${id}`, { method: "DELETE" }, true, tenantId).then(res => res.json()),
};

