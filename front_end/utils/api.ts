export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
export const TENANT_HEADER = process.env.NEXT_PUBLIC_TENANT_HEADER || "X-Tenant-ID";

function buildHeaders(initHeaders?: HeadersInit, tenantId?: string): HeadersInit {
  const headers: Record<string, string> = {
    ...(initHeaders as Record<string, string>),
  };
  if (tenantId) headers[TENANT_HEADER] = tenantId;
  return headers;
}

export async function putAuthJSON<T = any>(path: string, bodyData: any, tenantId?: string): Promise<T> {
  const res = await authFetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  }, true, tenantId);
  if (!res.ok) {
    try {
      const data = await res.json();
      const msg = data?.error || data?.detail || JSON.stringify(data);
      throw new Error(msg || `Request failed with ${res.status}`);
    } catch {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
  }
  return (await res.json()) as T;
}

export async function postForm<T = any>(path: string, data: Record<string, string>, tenantId?: string): Promise<T> {
  const body = new URLSearchParams(data);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: buildHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }, tenantId),
    body,
  });
  if (!res.ok) {
    try {
      const data = await res.json();
      const msg = data?.error || data?.detail || JSON.stringify(data);
      throw new Error(msg || `Request failed with ${res.status}`);
    } catch {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
  }
  return (await res.json()) as T;
}

export async function postJSON<T = any>(path: string, body: any, tenantId?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, tenantId),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    try {
      const data = await res.json();
      const msg = data?.error || data?.detail || JSON.stringify(data);
      throw new Error(msg || `Request failed with ${res.status}`);
    } catch {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
  }
  return (await res.json()) as T;
}

export async function postMultipart<T = any>(path: string, formData: FormData, tenantId?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
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
      let message = `Request failed with ${res.status}`;
      throw new Error(message);
    }
  }
  return (await res.json()) as T;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

async function refreshTokens(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;
  const url = `${API_BASE}/api/v1/auth/refresh?refresh_token=${encodeURIComponent(rt)}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) return false;
  try {
    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
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

async function authFetch(path: string, init?: RequestInit, retry = true, tenantId?: string): Promise<Response> {
  const token = getAccessToken();
  const headers: HeadersInit = buildHeaders(
    {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    tenantId,
  );
  const res = await fetch(`${API_BASE}${path}`, { ...(init || {}), headers });
  if (res.status === 401 && retry) {
    const ok = await refreshTokens();
    if (ok) {
      const newToken = getAccessToken();
      const retryHeaders: HeadersInit = buildHeaders(
        {
          ...(init?.headers || {}),
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        },
        tenantId,
      );
      return fetch(`${API_BASE}${path}`, { ...(init || {}), headers: retryHeaders });
    }
  }
  return res;
}

export async function getAuthJSON<T = any>(path: string, tenantId?: string): Promise<T> {
  const res = await authFetch(path, undefined, true, tenantId);
  if (!res.ok) {
    try {
      const data = await res.json();
      const msg = data?.error || data?.detail || JSON.stringify(data);
      throw new Error(msg || `Request failed with ${res.status}`);
    } catch {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
  }
  return (await res.json()) as T;
}

export async function postAuthJSON<T = any>(path: string, bodyData: any, tenantId?: string): Promise<T> {
  const res = await authFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  }, true, tenantId);
  if (!res.ok) {
    try {
      const data = await res.json();
      const msg = data?.error || data?.detail || JSON.stringify(data);
      throw new Error(msg || `Request failed with ${res.status}`);
    } catch {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed with ${res.status}`);
    }
  }
  return (await res.json()) as T;
}

// Convenience wrappers for key flows
export const AuthAPI = {
  registerAffiliate: (body: any) => postJSON("/auth/register/affiliate", body),
  registerPharmacy: (body: any) => postJSON("/auth/register/pharmacy", body),
  verifyRegistration: (email: string, code: string) =>
    postForm("/auth/register/verify", { email, code }),
  login: (email: string, password: string, tenantId?: string) =>
    postForm("/auth/login", { username: email, password }, tenantId),
  loginRequestCode: (email: string, password: string, tenantId?: string) =>
    postForm("/auth/login/request-code", { username: email, password }, tenantId),
  loginVerify: (email: string, code: string, tenantId?: string) =>
    postJSON("/auth/login/verify", { email, code }, tenantId),
  me: () => getAuthJSON("/auth/me"),
};

export const AffiliateAPI = {
  getLinks: () => getAuthJSON("/affiliate/register-link"),
  createLink: () => getAuthJSON("/affiliate/register-link?create_new=true"),
  deactivate: (token: string) => postAuthJSON(`/affiliate/links/${encodeURIComponent(token)}/deactivate`, {}),
  rotate: (token: string) => postAuthJSON(`/affiliate/links/${encodeURIComponent(token)}/rotate`, {}),
  dashboard: () => getAuthJSON("/affiliate/dashboard"),
  payouts: (status?: string) => getAuthJSON(`/affiliate/payouts${status ? `?status_filter=${encodeURIComponent(status)}` : ""}`),
  requestPayout: (month?: string, percent = 5) => postAuthJSON("/affiliate/payouts/request", { month, percent }),
  updateProfile: (body: any) => postAuthJSON("/affiliate/profile", body),
};

export const AdminAPI = {
  pharmacies: (page = 1, pageSize = 20, q?: string) =>
    getAuthJSON(`/admin/pharmacies?page=${page}&page_size=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
  affiliates: (page = 1, pageSize = 20, q?: string) =>
    getAuthJSON(`/admin/affiliates?page=${page}&page_size=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
  approvePharmacy: (tenantId: string, applicationId: number, body?: { issue_temp_password?: boolean; temp_password?: string }) =>
    postAuthJSON(`/admin/pharmacies/${applicationId}/approve`, body || {}, tenantId),
  rejectPharmacy: (tenantId: string, applicationId: number) =>
    postAuthJSON(`/admin/pharmacies/${applicationId}/reject`, {}, tenantId),
  verifyPayment: (tenantId: string, code?: string | null) =>
    postAuthJSON(`/admin/payments/verify`, { code: code || null }, tenantId),
  rejectPayment: (tenantId: string, code?: string | null) =>
    postAuthJSON(`/admin/payments/reject`, { code: code || null }, tenantId),
  analyticsOverview: (days = 30) =>
    getAuthJSON(`/admin/analytics/overview?days=${days}`),
  downloadPharmacyLicense: async (applicationId: number) => {
    const res = await authFetch(`/admin/pharmacies/${applicationId}/license`, { method: "GET" }, true);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }
    const blob = await res.blob();
    let filename = `license-${applicationId}`;
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    const extracted = match?.[1] || match?.[2];
    if (extracted) {
      try {
        filename = decodeURIComponent(extracted);
      } catch {
        filename = extracted;
      }
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
  approveAffiliate: (userId: number) => postAuthJSON(`/admin/affiliates/${userId}/approve`, {}),
  rejectAffiliate: (userId: number) => postAuthJSON(`/admin/affiliates/${userId}/reject`, {}),
  listAffiliatePayouts: (status?: string) =>
    getAuthJSON(`/admin/affiliate/payouts${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  markPayoutPaid: (payoutId: number) => postAuthJSON(`/admin/affiliate/payouts/${payoutId}/mark-paid`, {}),
  approvePayout: (payoutId: number) => postAuthJSON(`/admin/affiliate/payouts/${payoutId}/approve`, {}),
  usage: (days = 30) => getAuthJSON(`/admin/usage?days=${days}`),
  audit: (params?: { tenant_id?: string; action?: string; limit?: number }) =>
    getAuthJSON(
      `/admin/audit${(() => {
        const qs = new URLSearchParams();
        if (params?.tenant_id) qs.set("tenant_id", params.tenant_id);
        if (params?.action) qs.set("action", params.action);
        if (params?.limit) qs.set("limit", String(params.limit));
        const s = qs.toString();
        return s ? `?${s}` : "";
      })()}`,
    ),
};

export const StaffAPI = {
  createCashier: (tenantId: string, body: any) => postAuthJSON("/staff", body, tenantId),
  list: (tenantId: string) => getAuthJSON("/staff", tenantId),
  update: (tenantId: string, userId: number, body: { is_active?: boolean }) =>
    authFetch(`/staff/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, true, tenantId)
      .then(async (res)=>{ if (!res.ok) { const t = await res.text(); throw new Error(t || `HTTP ${res.status}`); } return res.json(); }),
  remove: (tenantId: string, userId: number) =>
    authFetch(`/staff/${userId}`, { method: "DELETE" }, true, tenantId)
      .then(async (res)=>{ if (!res.ok) { const t = await res.text(); throw new Error(t || `HTTP ${res.status}`); } return res.json(); }),
};

export const BillingAPI = {
  submitPaymentCode: (tenantId: string, code: string) =>
    postAuthJSON("/billing/payment-code", { code }, tenantId),
};

export const UploadAPI = {
  uploadKyc: async (file: File): Promise<{ path: string; size: number; filename: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    return await postMultipart(`/uploads/kyc`, fd);
  },
};

export const KYCAPI = {
  status: (tenantId: string) => getAuthJSON(`/kyc/status`, tenantId),
  update: (tenantId: string, body: any) => putAuthJSON(`/kyc/status`, body, tenantId),
};

export const PharmaciesAPI = {
  list: (page = 1, pageSize = 20, q?: string) =>
    getAuthJSON(`/pharmacies?page=${page}&page_size=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
  get: (id: number) => getAuthJSON(`/pharmacies/${id}`),
  update: (id: number, body: { name?: string; address?: string }) =>
    authFetch(`/pharmacies/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(async (res)=>{ if (!res.ok) { const t = await res.text(); throw new Error(t || `HTTP ${res.status}`); } return res.json(); }),
};

export const ChatAPI = {
  listThreads: (tenantId: string) => getAuthJSON(`/chat/threads`, tenantId),
  createThread: (tenantId: string, title: string) => postAuthJSON(`/chat/threads`, { title }, tenantId),
  listMessages: (tenantId: string, threadId: number) => getAuthJSON(`/chat/threads/${threadId}/messages`, tenantId),
  sendMessage: (tenantId: string, threadId: number, prompt: string) =>
    postAuthJSON(`/chat/threads/${threadId}/messages`, { prompt }, tenantId),
  usage: (tenantId: string, days = 30) => getAuthJSON(`/chat/usage?days=${days}`, tenantId),
  sendStream: async (
    tenantId: string,
    threadId: number,
    prompt: string,
    onEvent: (evt: { event: string; data?: any }) => void,
  ): Promise<void> => {
    const res = await authFetch(`/chat/threads/${threadId}/messages/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }, true, tenantId);
    if (!res.ok || !res.body) {
      const t = await res.text().catch(()=>"");
      throw new Error(t || `HTTP ${res.status}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n\n")) !== -1) {
        const chunk = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 2);
        if (chunk.startsWith("data:")) {
          try {
            const jsonStr = chunk.slice(5).trim();
            const obj = JSON.parse(jsonStr);
            onEvent(obj);
          } catch {}
        }
      }
    }
  },
};
