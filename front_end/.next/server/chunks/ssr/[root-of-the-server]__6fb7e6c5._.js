module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/utils/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE",
    ()=>API_BASE,
    "AdminAPI",
    ()=>AdminAPI,
    "AffiliateAPI",
    ()=>AffiliateAPI,
    "AuthAPI",
    ()=>AuthAPI,
    "BillingAPI",
    ()=>BillingAPI,
    "ChatAPI",
    ()=>ChatAPI,
    "KYCAPI",
    ()=>KYCAPI,
    "OwnerAnalyticsAPI",
    ()=>OwnerAnalyticsAPI,
    "PharmaciesAPI",
    ()=>PharmaciesAPI,
    "StaffAPI",
    ()=>StaffAPI,
    "TENANT_HEADER",
    ()=>TENANT_HEADER,
    "UploadAPI",
    ()=>UploadAPI,
    "getAccessToken",
    ()=>getAccessToken,
    "getAuthJSON",
    ()=>getAuthJSON,
    "postAuthJSON",
    ()=>postAuthJSON,
    "postForm",
    ()=>postForm,
    "postJSON",
    ()=>postJSON,
    "postMultipart",
    ()=>postMultipart,
    "putAuthJSON",
    ()=>putAuthJSON
]);
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:8000/api/v1") || "http://localhost:8000";
const TENANT_HEADER = ("TURBOPACK compile-time value", "X-Tenant-ID") || "X-Tenant-ID";
const API_BASE_NORMALIZED = API_BASE.replace(/\/+$/, "");
let API_BASE_PATH = "";
try {
    const parsed = new URL(API_BASE_NORMALIZED);
    API_BASE_PATH = parsed.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
} catch  {
    API_BASE_PATH = "";
}
function buildHeaders(initHeaders, tenantId) {
    const headers = {
        ...initHeaders
    };
    if (tenantId) headers[TENANT_HEADER] = tenantId;
    return headers;
}
function resolveApiUrl(path) {
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
async function postForm(path, data, tenantId) {
    const body = new URLSearchParams(data);
    const res = await fetch(resolveApiUrl(path), {
        method: "POST",
        headers: buildHeaders({
            "Content-Type": "application/x-www-form-urlencoded"
        }, tenantId),
        body
    });
    if (!res.ok) {
        let parsed = null;
        try {
            parsed = await res.json();
        } catch  {
            parsed = await res.text().catch(()=>null);
        }
        let msg = "";
        if (!parsed) msg = `Request failed with ${res.status}`;
        else if (typeof parsed === "string") msg = parsed;
        else if (Array.isArray(parsed)) msg = parsed.join(", ");
        else if (parsed?.detail) msg = parsed.detail;
        else if (parsed?.message) msg = parsed.message;
        else if (parsed?.error) msg = parsed.error;
        else if (parsed?.errors) {
            msg = Object.keys(parsed.errors).map((k)=>`${k}: ${Array.isArray(parsed.errors[k]) ? parsed.errors[k].join(", ") : parsed.errors[k]}`).join(" | ");
        } else msg = JSON.stringify(parsed);
        const err = new Error(msg || `Request failed with ${res.status}`);
        err.status = res.status;
        err.body = parsed;
        console.error("[postForm] failed", {
            path,
            status: res.status,
            parsed
        });
        throw err;
    }
    return await res.json();
}
async function postJSON(path, body, tenantId) {
    const res = await fetch(resolveApiUrl(path), {
        method: "POST",
        headers: buildHeaders({
            "Content-Type": "application/json"
        }, tenantId),
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        try {
            const data = await res.json();
            const msg = data?.error || data?.detail || JSON.stringify(data);
            throw new Error(msg || `Request failed with ${res.status}`);
        } catch  {
            const text = await res.text().catch(()=>"");
            throw new Error(text || `Request failed with ${res.status}`);
        }
    }
    return await res.json();
}
async function putAuthJSON(path, bodyData, tenantId) {
    const res = await fetch(resolveApiUrl(path), {
        method: "PUT",
        headers: buildHeaders({
            "Content-Type": "application/json"
        }, tenantId),
        body: JSON.stringify(bodyData)
    });
    if (!res.ok) {
        try {
            const data = await res.json();
            const msg = data?.error || data?.detail || JSON.stringify(data);
            throw new Error(msg || `Request failed with ${res.status}`);
        } catch  {
            const text = await res.text().catch(()=>"");
            throw new Error(text || `Request failed with ${res.status}`);
        }
    }
    return await res.json();
}
async function postMultipart(path, formData, tenantId) {
    const res = await fetch(resolveApiUrl(path), {
        method: "POST",
        headers: buildHeaders(undefined, tenantId),
        body: formData
    });
    if (!res.ok) {
        try {
            const data = await res.json();
            const msg = data?.error || data?.detail || JSON.stringify(data);
            throw new Error(msg || `Request failed with ${res.status}`);
        } catch  {
            throw new Error(`Request failed with ${res.status}`);
        }
    }
    return await res.json();
}
function getAccessToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function getTenantId() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function getRefreshToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
async function refreshTokens() {
    const rt = getRefreshToken();
    if (!rt) return false;
    const BASE = "http://localhost:8000";
    const url = `${BASE}/api/v1/auth/refresh?refresh_token=${encodeURIComponent(rt)}`;
    const res = await fetch(url, {
        method: "POST"
    });
    if (!res.ok) return false;
    try {
        const data = await res.json();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return true;
    } catch  {
        return false;
    }
}
async function authFetch(path, init, retry = true, tenantId) {
    const token = getAccessToken();
    const activeTenantId = tenantId ?? getTenantId() ?? undefined;
    const headers = buildHeaders({
        ...init?.headers || {},
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {}
    }, activeTenantId);
    let res = await fetch(resolveApiUrl(path), {
        ...init || {},
        headers
    });
    if (res.status === 401 && retry) {
        const ok = await refreshTokens();
        if (ok) {
            const newToken = getAccessToken();
            const retryTenantId = tenantId ?? getTenantId() ?? undefined;
            const retryHeaders = buildHeaders({
                ...init?.headers || {},
                ...newToken ? {
                    Authorization: `Bearer ${newToken}`
                } : {}
            }, retryTenantId);
            res = await fetch(resolveApiUrl(path), {
                ...init || {},
                headers: retryHeaders
            });
        }
    }
    return res;
}
async function getAuthJSON(path, tenantId) {
    const res = await authFetch(path, undefined, true, tenantId);
    if (!res.ok) {
        const data = await res.text().catch(()=>"");
        throw new Error(data || `Request failed with ${res.status}`);
    }
    return await res.json();
}
async function postAuthJSON(path, bodyData, tenantId) {
    const res = await authFetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    }, true, tenantId);
    if (!res.ok) {
        const data = await res.text().catch(()=>"");
        throw new Error(data || `Request failed with ${res.status}`);
    }
    return await res.json();
}
const AuthAPI = {
    registerAffiliate: (body)=>postJSON("/api/v1/auth/register/affiliate", body),
    registerPharmacy: (body)=>postJSON("/api/v1/auth/register/pharmacy", body),
    registerVerify: async (email, code)=>{
        try {
            return await postForm("/api/v1/auth/register/verify", {
                email,
                code
            });
        } catch (err) {
            if (err?.status === 422) {
                console.warn("[AuthAPI.registerVerify] 422, retrying with JSON", {
                    body: err.body
                });
                try {
                    return await postJSON("/api/v1/auth/register/verify", {
                        email,
                        code
                    });
                } catch (err2) {
                    const e = new Error(err2?.message || err?.message || "Verification failed");
                    e.original = err;
                    e.retry = err2;
                    throw e;
                }
            }
            throw err;
        }
    },
    verifyRegistration: (email, code)=>postForm("/api/v1/auth/register/verify", {
            email,
            code
        }),
    login: (email, password, tenantId)=>postForm("/api/v1/auth/login", {
            username: email,
            password
        }, tenantId),
    loginRequestCode: (email, password, tenantId)=>postForm("/api/v1/auth/login/request-code", {
            username: email,
            password
        }, tenantId),
    loginVerify: (email, code, tenantId)=>postJSON("/api/v1/auth/login/verify", {
            email,
            code
        }, tenantId),
    me: ()=>getAuthJSON("/api/v1/auth/me")
};
const AffiliateAPI = {
    getLinks: ()=>getAuthJSON("/api/v1/affiliate/register-link"),
    createLink: ()=>getAuthJSON("/api/v1/affiliate/register-link?create_new=true"),
    deactivate: (token)=>postAuthJSON(`/api/v1/affiliate/links/${encodeURIComponent(token)}/deactivate`, {}),
    rotate: (token)=>postAuthJSON(`/api/v1/affiliate/links/${encodeURIComponent(token)}/rotate`, {}),
    dashboard: ()=>getAuthJSON("/api/v1/affiliate/dashboard"),
    payouts: (status)=>getAuthJSON(`/api/v1/affiliate/payouts${status ? `?status_filter=${encodeURIComponent(status)}` : ""}`),
    requestPayout: (month, percent = 5)=>postAuthJSON("/api/v1/affiliate/payouts/request", {
            month,
            percent
        }),
    updateProfile: (body)=>postAuthJSON("/api/v1/affiliate/profile", body)
};
const AdminAPI = {
    pharmacies: (page = 1, pageSize = 20, q)=>getAuthJSON(`/api/v1/admin/pharmacies?page=${page}&page_size=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
    affiliates: (page = 1, pageSize = 20, q)=>getAuthJSON(`/api/v1/admin/affiliates?page=${page}&page_size=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
    approvePharmacy: (tenantId, applicationId, body)=>postAuthJSON(`/api/v1/admin/pharmacies/${applicationId}/approve`, body || {}, tenantId),
    rejectPharmacy: (tenantId, applicationId)=>postAuthJSON(`/api/v1/admin/pharmacies/${applicationId}/reject`, {}, tenantId),
    verifyPayment: (tenantId, code)=>postAuthJSON(`/api/v1/admin/payments/verify`, {
            code: code || null
        }, tenantId),
    rejectPayment: (tenantId, code)=>postAuthJSON(`/api/v1/admin/payments/reject`, {
            code: code || null
        }, tenantId),
    analyticsOverview: (days = 30)=>getAuthJSON(`/api/v1/admin/analytics/overview?days=${days}`),
    approveAffiliate: (userId)=>postAuthJSON(`/api/v1/admin/affiliates/${userId}/approve`, {}),
    rejectAffiliate: (userId)=>postAuthJSON(`/api/v1/admin/affiliates/${userId}/reject`, {})
};
const StaffAPI = {
    createCashier: (tenantId, body)=>postAuthJSON("/api/v1/staff", body, tenantId),
    list: (tenantId)=>getAuthJSON("/api/v1/staff", tenantId),
    update: (tenantId, userId, body)=>authFetch(`/api/v1/staff/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        }),
    remove: (tenantId, userId)=>authFetch(`/api/v1/staff/${userId}`, {
            method: "DELETE"
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        })
};
const BillingAPI = {
    submitPaymentCode: (tenantId, code)=>postAuthJSON("/api/v1/owner/billing/payment-code", {
            code
        }, tenantId)
};
const UploadAPI = {
    uploadKyc: async (file)=>{
        const fd = new FormData();
        fd.append("file", file);
        return postMultipart("/uploads/kyc", fd);
    }
};
const KYCAPI = {
    status: (tenantId)=>getAuthJSON("/api/v1/owner/kyc/status", tenantId),
    update: (tenantId, body)=>putAuthJSON("/api/v1/owner/kyc/status", body, tenantId)
};
const PharmaciesAPI = {
    list: (page = 1, pageSize = 20, q)=>getAuthJSON(`/api/v1/pharmacies?page=${page}&page_size=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
    get: (id)=>getAuthJSON(`/api/v1/pharmacies/${id}`),
    update: (id, body)=>authFetch(`/api/v1/pharmacies/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(async (res)=>{
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        })
};
const ChatAPI = {
    listThreads: (tenantId)=>getAuthJSON(`/api/v1/chat/threads`, tenantId),
    createThread: (tenantId, title)=>postAuthJSON(`/api/v1/chat/threads`, {
            title
        }, tenantId),
    listMessages: (tenantId, threadId)=>getAuthJSON(`/api/v1/chat/threads/${threadId}/messages`, tenantId),
    sendMessage: (tenantId, threadId, prompt)=>postAuthJSON(`/api/v1/chat/threads/${threadId}/messages`, {
            prompt
        }, tenantId),
    usage: (tenantId, days = 30)=>getAuthJSON(`/api/v1/chat/usage?days=${days}`, tenantId)
};
const OwnerAnalyticsAPI = {
    overview: (tenantId)=>getAuthJSON("/api/v1/owner/analytics/overview", tenantId)
}; // Other API objects (AffiliateAPI, AdminAPI, etc.) remain unchanged
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
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/app/(dashboard)/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Dashboard layout (sidebar, nav)
__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function deriveRoles(user) {
    const roles = new Set();
    if (user?.role) roles.add(user.role.toLowerCase());
    user?.roles?.forEach((entry)=>{
        const name = entry?.role?.name;
        if (name) roles.add(name.toLowerCase());
    });
    return Array.from(roles);
}
function DashboardLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isAdminRoute = pathname?.startsWith("/dashboard/admin");
    const loginPath = isAdminRoute ? "/login" : `/auth?tab=signin&next=${encodeURIComponent(pathname || "/dashboard")}`;
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [banner, setBanner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const roles = deriveRoles(user);
    const roleName = roles[0] || "";
    const isAffiliate = roles.includes("affiliate");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        async function check() {
            try {
                const me = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthJSON"])("/auth/me");
                if (!active) return;
                setUser(me);
                // If KYC is pending and user is an owner/staff, keep them on status page only
                const primaryRole = (me?.role || me?.roles?.[0]?.role?.name || "").toLowerCase();
                const roleSet = deriveRoles(me);
                const isOwnerRole = roleSet.includes("pharmacy_owner") || roleSet.includes("owner");
                const isCashierRole = roleSet.includes("cashier");
                if (isOwnerRole && pathname.startsWith("/dashboard/pos")) {
                    router.replace("/dashboard/owner");
                    return;
                }
                if (!isOwnerRole && pathname.startsWith("/dashboard/owner/staff")) {
                    router.replace(isCashierRole ? "/dashboard/pos" : "/dashboard");
                    return;
                }
                if (primaryRole !== "admin" && pathname.startsWith("/dashboard/admin")) {
                    router.replace("/dashboard/owner");
                    return;
                }
                if ([
                    "pharmacy_owner",
                    "owner",
                    "cashier",
                    "manager"
                ].includes(primaryRole)) {
                    const needsKyc = me?.kyc_status !== "approved";
                    const needsPayment = me?.kyc_status === "approved" && me?.subscription_status && me.subscription_status !== "active";
                    const ownerKycPath = "/dashboard/owner/kyc";
                    const ownerPaymentPath = "/dashboard/owner/payment";
                    if (needsKyc && pathname !== ownerKycPath) {
                        router.replace(ownerKycPath);
                        return;
                    }
                    if (!needsKyc && needsPayment && pathname !== ownerPaymentPath) {
                        router.replace(ownerPaymentPath);
                        return;
                    }
                    if (!needsKyc && !needsPayment && (pathname === ownerKycPath || pathname === ownerPaymentPath)) {
                        router.replace("/dashboard/owner");
                        return;
                    }
                }
            // One-time referral track removed (handled server-side)
            } catch (e) {
                if (!active) return;
                setError("Unauthorized");
                router.replace(loginPath);
            } finally{
                if (active) setLoading(false);
            }
        }
        // If no token, redirect immediately
        if ("undefined" !== "undefined" && !localStorage.getItem("access_token")) //TURBOPACK unreachable
        ;
        check();
        return ()=>{
            active = false;
        };
    }, [
        router,
        pathname,
        loginPath
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user) {
            setBanner(null);
            return;
        }
        const userRoles = deriveRoles(user);
        const isOwner = userRoles.includes("pharmacy_owner") || userRoles.includes("owner");
        const isCashier = userRoles.includes("cashier");
        if (!(isOwner || isCashier)) {
            setBanner(null);
            return;
        }
        if (user.kyc_status && user.kyc_status !== "approved") {
            setBanner({
                kind: "kyc_pending",
                title: "KYC review in progress",
                description: "Thanks for submitting your application. Our compliance team is reviewing your documents — you will receive an email once it is approved."
            });
            return;
        }
        const status = user.subscription_status || "active";
        if ([
            "awaiting_payment",
            "pending_verification",
            "payment_rejected"
        ].includes(status)) {
            const copies = {
                awaiting_payment: {
                    title: "Subscription payment required",
                    description: "Complete your first subscription payment and submit the receipt code so the admin team can activate your access."
                },
                pending_verification: {
                    title: "Payment awaiting verification",
                    description: "We have received your payment code. The admin team is verifying it — you will be notified once access is restored."
                },
                payment_rejected: {
                    title: "Payment could not be verified",
                    description: "The last payment submission was rejected. Please double-check the receipt code and submit it again."
                }
            };
            const copy = copies[status];
            setBanner({
                kind: "payment",
                title: copy.title,
                description: copy.description,
                actionHref: "/dashboard/owner/payment",
                actionLabel: "Submit payment"
            });
            return;
        }
        setBanner(null);
    }, [
        user
    ]);
    function logout() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (isAffiliate) {
            router.replace("/auth/affiliate-login");
            return;
        }
        if (roleName === "admin") {
            router.replace("/login");
            return;
        }
        router.replace("/auth?tab=signin");
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse text-gray-500",
                children: "Loading dashboard..."
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 196,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(dashboard)/layout.tsx",
            lineNumber: 195,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return null; // Redirected
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Shell, {
        user: user,
        onLogout: logout,
        children: [
            banner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 border rounded bg-amber-50 text-amber-800 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium",
                                children: banner.title
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs md:text-sm",
                                children: banner.description
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this),
                    banner.actionHref && banner.actionLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: banner.actionHref,
                        className: "inline-flex items-center justify-center rounded border border-amber-600 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100",
                        children: banner.actionLabel
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 214,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
function Shell({ user, onLogout, children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const roles = deriveRoles(user);
    const baseRole = (user?.role || "").toLowerCase();
    const primaryRole = baseRole || roles[0] || "";
    const isOwner = baseRole === "pharmacy_owner" || baseRole === "owner" || roles.includes("pharmacy_owner") || roles.includes("owner");
    const isCashier = baseRole === "cashier" || roles.includes("cashier");
    const isManager = baseRole === "manager" || roles.includes("manager");
    const isAffiliate = baseRole === "affiliate" || roles.includes("affiliate");
    const isAdmin = baseRole === "admin";
    const isTenantStaff = isOwner || isManager || isCashier;
    const subscriptionStatus = user?.subscription_status || "active";
    const requiresPayment = isTenantStaff && user?.kyc_status === "approved" && subscriptionStatus !== "active";
    const kycPending = isTenantStaff && user?.kyc_status && user.kyc_status !== "approved";
    let nav;
    if (isAffiliate) {
        nav = [
            {
                href: "/dashboard/affiliate",
                label: "Affiliate Dashboard"
            }
        ];
    } else if (isAdmin) {
        nav = [
            {
                href: "/dashboard/admin",
                label: "Admin Overview"
            },
            {
                href: "/dashboard/admin/users",
                label: "Users"
            },
            {
                href: "/dashboard/admin/pharmacies",
                label: "Pharmacies"
            },
            {
                href: "/dashboard/admin/affiliates",
                label: "Affiliates"
            },
            {
                href: "/dashboard/admin/payouts",
                label: "Payouts"
            },
            {
                href: "/dashboard/admin/audit",
                label: "Audit Log"
            }
        ];
    } else if (isOwner) {
        if (kycPending) {
            nav = [
                {
                    href: "/dashboard/owner/kyc",
                    label: "KYC"
                }
            ];
        } else if (requiresPayment) {
            nav = [
                {
                    href: "/dashboard/owner/payment",
                    label: "Payment"
                }
            ];
        } else {
            nav = [
                {
                    href: "/dashboard/owner",
                    label: "Owner Overview"
                },
                {
                    href: "/dashboard/inventory",
                    label: "Inventory"
                },
                {
                    href: "/dashboard/settings",
                    label: "Settings"
                },
                {
                    href: "/dashboard/owner/staff",
                    label: "Staff Management"
                }
            ];
        }
    } else if (isManager || isCashier) {
        if (kycPending) {
            nav = [
                {
                    href: "/dashboard/owner/kyc",
                    label: "KYC"
                }
            ];
        } else if (requiresPayment) {
            nav = [
                {
                    href: "/dashboard/owner/payment",
                    label: "Payment"
                }
            ];
        } else {
            nav = [
                {
                    href: "/dashboard/pos",
                    label: "Point of Sale"
                },
                {
                    href: "/dashboard/inventory",
                    label: "Inventory"
                },
                {
                    href: "/dashboard/settings",
                    label: "Settings"
                }
            ];
        }
    } else {
        nav = [
            {
                href: "/dashboard",
                label: "Overview"
            },
            {
                href: "/dashboard/inventory",
                label: "Inventory"
            },
            {
                href: "/dashboard/pos",
                label: "POS"
            },
            {
                href: "/dashboard/affiliate",
                label: "Affiliate"
            },
            {
                href: "/dashboard/settings",
                label: "Settings"
            },
            {
                href: "/dashboard/about",
                label: "About"
            }
        ];
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen grid grid-cols-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "col-span-12 md:col-span-2 border-r p-4 space-y-6 bg-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-semibold",
                                children: isAffiliate ? "Affiliate Portal" : isAdmin ? "Admin Console" : "Zemen Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500",
                                children: isAffiliate ? "Track referrals & payouts" : isAdmin ? "Manage platform data" : "Secure area"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1 text-sm",
                        children: user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-medium",
                                    children: user.username
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/layout.tsx",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-gray-500 truncate",
                                    children: user.email
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/layout.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this),
                                primaryRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xs uppercase text-gray-400",
                                    children: primaryRole
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/layout.tsx",
                                    lineNumber: 313,
                                    columnNumber: 31
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "space-y-1",
                        children: nav.map((item)=>{
                            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: "block rounded px-3 py-2 text-sm " + (active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "hover:bg-gray-50 text-gray-700"),
                                children: item.label
                            }, item.href, false, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 322,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: onLogout,
                            className: "w-full text-red-600 border-red-200 hover:bg-red-50",
                            children: "Logout"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 339,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "col-span-12 md:col-span-10 flex flex-col min-h-screen bg-gray-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b bg-white p-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium",
                                children: nav.find((n)=>pathname?.startsWith(n.href))?.label || "Overview"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this),
                            !isAffiliate && !isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-500",
                                children: [
                                    "Tenant: ",
                                    user?.tenant_id || "N/A"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 348,
                                columnNumber: 40
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "p-6 flex-1",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 345,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 297,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6fb7e6c5._.js.map