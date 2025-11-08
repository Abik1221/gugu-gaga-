module.exports = [
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
    "BranchAPI",
    ()=>BranchAPI,
    "ChatAPI",
    ()=>ChatAPI,
    "IntegrationsAPI",
    ()=>IntegrationsAPI,
    "InventoryAPI",
    ()=>InventoryAPI,
    "KYCAPI",
    ()=>KYCAPI,
    "MedicinesAPI",
    ()=>MedicinesAPI,
    "OwnerAnalyticsAPI",
    ()=>OwnerAnalyticsAPI,
    "OwnerChatAPI",
    ()=>OwnerChatAPI,
    "PharmaciesAPI",
    ()=>PharmaciesAPI,
    "SalesAPI",
    ()=>SalesAPI,
    "StaffAPI",
    ()=>StaffAPI,
    "TENANT_HEADER",
    ()=>TENANT_HEADER,
    "TenantAPI",
    ()=>TenantAPI,
    "UploadAPI",
    ()=>UploadAPI,
    "authFetch",
    ()=>authFetch,
    "deleteAuthJSON",
    ()=>deleteAuthJSON,
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
    const requestInit = {
        method: "POST",
        headers: buildHeaders({
            "Content-Type": "application/json"
        }, tenantId),
        body: JSON.stringify(body)
    };
    try {
        const res = await fetch(resolveApiUrl(path), requestInit);
        if (!res.ok) {
            let parsed = null;
            let message = "";
            try {
                parsed = await res.json();
                if (typeof parsed === "string") message = parsed;
                else if (Array.isArray(parsed)) message = parsed.join(", ");
                else message = parsed?.error || parsed?.detail || parsed?.message || "";
                if (!message && parsed) message = JSON.stringify(parsed);
            } catch  {
                parsed = null;
                message = await res.text().catch(()=>"");
            }
            const error = new Error(message || `Request failed with ${res.status}`);
            error.status = res.status;
            if (parsed !== null) error.body = parsed;
            throw error;
        }
        return await res.json();
    } catch (error) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        throw error;
    }
}
async function putAuthJSON(path, bodyData, tenantId) {
    const res = await authFetch(path, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    }, true, tenantId);
    if (!res.ok) {
        const text = await res.text().catch(()=>"");
        throw new Error(text || `Request failed with ${res.status}`);
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
    const res = await fetch(resolveApiUrl("/api/v1/auth/refresh"), {
        method: "POST",
        headers: buildHeaders({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            refresh_token: rt
        })
    });
    if (!res.ok) {
        return false;
    }
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
async function deleteAuthJSON(path, tenantId) {
    const res = await authFetch(path, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }, true, tenantId);
    if (!res.ok) {
        const data = await res.text().catch(()=>"");
        throw new Error(data || `Request failed with ${res.status}`);
    }
    // For DELETE requests, we might not have a response body
    try {
        return await res.json();
    } catch  {
        return undefined;
    }
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
            password,
            grant_type: "password"
        }, tenantId).then((resp)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return resp;
        }),
    loginRequestCode: (email, password, tenantId)=>postForm("/api/v1/auth/login/request-code", {
            username: email,
            password,
            grant_type: "password"
        }, tenantId),
    loginVerify: (email, code, tenantId)=>postJSON("/api/v1/auth/login/verify", {
            email,
            code
        }, tenantId).then((resp)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return resp;
        }),
    refresh: (refreshToken)=>postJSON("/api/v1/auth/refresh", {
            refresh_token: refreshToken
        }),
    sessions: ()=>getAuthJSON("/api/v1/auth/sessions"),
    revokeSession: (sessionId)=>authFetch(`/api/v1/auth/sessions/${sessionId}`, {
            method: "DELETE"
        }).then((res)=>{
            if (!res.ok) throw new Error("Failed to revoke session");
        }),
    changePassword: (body)=>postAuthJSON("/api/v1/auth/change-password", body),
    me: ()=>getAuthJSON("/api/v1/auth/me").then((profile)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return profile;
        })
};
const TenantAPI = {
    activity: async (params)=>{
        const searchParams = new URLSearchParams();
        if (params?.limit) searchParams.set("limit", params.limit.toString());
        if (params?.offset) searchParams.set("offset", params.offset.toString());
        params?.action?.forEach((action)=>searchParams.append("action", action));
        const qs = searchParams.toString();
        const url = `/api/v1/tenant/activity${qs ? `?${qs}` : ""}`;
        const tenantId = getTenantId() ?? undefined;
        const res = await authFetch(url, undefined, true, tenantId);
        if (res.status === 404 || res.status === 204) {
            return [];
        }
        if (!res.ok) {
            const text = await res.text().catch(()=>"");
            throw new Error(text || `Request failed with ${res.status}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return [];
        }
        try {
            return await res.json();
        } catch  {
            return [];
        }
    }
};
const IntegrationsAPI = {
    listProviders: ()=>getAuthJSON("/api/v1/integrations/providers"),
    listConnections: (tenantId)=>getAuthJSON("/api/v1/integrations/connections", tenantId),
    startOAuth: (tenantId, providerKey, resources)=>postAuthJSON("/api/v1/integrations/oauth/start", {
            provider_key: providerKey,
            resources,
            display_name: undefined
        }, tenantId),
    completeOAuth: (code, state, providerKey)=>postJSON("/api/v1/integrations/oauth/callback", {
            code,
            state,
            provider_key: providerKey
        }),
    disconnect: (tenantId, connectionId)=>authFetch(`/api/v1/integrations/connections/${connectionId}`, {
            method: "DELETE"
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) {
                const text = await res.text().catch(()=>"");
                throw new Error(text || `HTTP ${res.status}`);
            }
            return res.json();
        }),
    triggerSync: (tenantId, connectionId, resource, direction)=>postAuthJSON(`/api/v1/integrations/connections/${connectionId}/sync`, {
            resource,
            direction
        }, tenantId)
};
const AffiliateAPI = {
    getLinks: ()=>getAuthJSON("/api/v1/affiliate/register-link", ""),
    createLink: ()=>getAuthJSON("/api/v1/affiliate/register-link?create_new=true", ""),
    deactivate: (token)=>postAuthJSON(`/api/v1/affiliate/links/${encodeURIComponent(token)}/deactivate`, {}, ""),
    rotate: (token)=>postAuthJSON(`/api/v1/affiliate/links/${encodeURIComponent(token)}/rotate`, {}, ""),
    dashboard: ()=>getAuthJSON("/api/v1/affiliate/dashboard", ""),
    payouts: (status)=>getAuthJSON(`/api/v1/affiliate/payouts${status ? `?status_filter=${encodeURIComponent(status)}` : ""}`, ""),
    requestPayout: (month, percent = 5)=>postAuthJSON("/api/v1/affiliate/payouts/request", {
            month,
            percent
        }, ""),
    updateProfile: (body)=>postAuthJSON("/api/v1/affiliate/profile", body, "")
};
const AdminAPI = {
    analyticsOverview: (days = 30)=>getAuthJSON(`/api/v1/admin/analytics/overview?days=${days}`),
    pharmacySummary: ()=>getAuthJSON(`/api/v1/admin/pharmacies/summary`),
    pharmacies: (page = 1, pageSize = 20, q = "")=>getAuthJSON(`/api/v1/admin/pharmacies?page=${page}&page_size=${pageSize}&q=${encodeURIComponent(q)}`),
    approvePharmacy: (tenantId, applicationId, body)=>postAuthJSON(`/api/v1/admin/pharmacies/${applicationId}/approve`, body || {}, tenantId),
    rejectPharmacy: (tenantId, applicationId)=>postAuthJSON(`/api/v1/admin/pharmacies/${applicationId}/reject`, {}, tenantId),
    verifyPayment: (tenantId, code)=>postAuthJSON(`/api/v1/admin/payments/verify`, {
            code: code || null
        }, tenantId),
    rejectPayment: (tenantId, code)=>postAuthJSON(`/api/v1/admin/payments/reject`, {
            code: code || null
        }, tenantId),
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
            if (!res.ok) {
                const text = await res.text().catch(()=>"");
                throw new Error(text || `Request failed with ${res.status}`);
            }
            return res.json();
        }),
    remove: (tenantId, userId)=>authFetch(`/api/v1/staff/${userId}`, {
            method: "DELETE"
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) {
                const text = await res.text().catch(()=>"");
                throw new Error(text || `Request failed with ${res.status}`);
            }
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
    list: (tenantId, params)=>{
        const search = new URLSearchParams();
        search.set("page", String(params?.page ?? 1));
        search.set("page_size", String(params?.page_size ?? 20));
        if (params?.q) search.set("q", params.q);
        const queryString = search.toString();
        const path = `/api/v1/pharmacies${queryString ? `?${queryString}` : ""}`;
        return getAuthJSON(path, tenantId);
    },
    get: (id, tenantId)=>getAuthJSON(`/api/v1/pharmacies/${id}`, tenantId),
    update: (id, body, tenantId)=>authFetch(`/api/v1/pharmacies/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) throw new Error(await res.text());
            return await res.json();
        })
};
const BranchAPI = {
    create: (tenantId, payload)=>postAuthJSON("/api/v1/branches", payload, tenantId),
    list: (tenantId, pharmacyId)=>{
        const query = pharmacyId ? `?pharmacy_id=${pharmacyId}` : '';
        return getAuthJSON(`/api/v1/branches${query}`, tenantId);
    },
    get: (tenantId, id)=>getAuthJSON(`/api/v1/branches/${id}`, tenantId),
    update: (tenantId, id, payload)=>putAuthJSON(`/api/v1/branches/${id}`, payload, tenantId),
    delete: (tenantId, id)=>deleteAuthJSON(`/api/v1/branches/${id}`, tenantId)
};
const ChatAPI = {
    listThreads: (tenantId)=>getAuthJSON(`/api/v1/chat/threads`, tenantId),
    createThread: (tenantId, title)=>postAuthJSON(`/api/v1/chat/threads`, title ? {
            title
        } : {}, tenantId),
    listMessages: (tenantId, threadId)=>getAuthJSON(`/api/v1/chat/threads/${threadId}/messages`, tenantId),
    sendMessage: (tenantId, threadId, prompt)=>postAuthJSON(`/api/v1/chat/threads/${threadId}/messages`, {
            prompt
        }, tenantId),
    usage: (tenantId, days = 30)=>getAuthJSON(`/api/v1/chat/usage?days=${days}`, tenantId)
};
const OwnerAnalyticsAPI = {
    overview: (tenantId, options)=>{
        const params = new URLSearchParams();
        if (options?.horizon) params.set("horizon", options.horizon);
        if (options?.trendWeeks) params.set("trend_weeks", String(options.trendWeeks));
        const query = params.toString();
        const path = `/api/v1/owner/analytics/overview${query ? `?${query}` : ""}`;
        return getAuthJSON(path, tenantId);
    }
};
const OwnerChatAPI = {
    listThreads: (tenantId)=>getAuthJSON("/api/v1/owner/chat/threads", tenantId),
    createThread: (tenantId, title)=>postAuthJSON("/api/v1/owner/chat/threads", {
            title
        }, tenantId),
    listMessages: (tenantId, threadId)=>getAuthJSON(`/api/v1/owner/chat/threads/${threadId}/messages`, tenantId),
    sendMessage: (tenantId, threadId, prompt)=>postAuthJSON(`/api/v1/owner/chat/threads/${threadId}/messages`, {
            prompt
        }, tenantId)
};
const InventoryAPI = {
    list: (tenantId, options)=>{
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
        return getAuthJSON(path, tenantId);
    },
    create: async (tenantId, payload)=>{
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
        const res = await authFetch(`/api/v1/inventory/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form.toString()
        }, true, tenantId);
        if (!res.ok) {
            throw new Error(await res.text().catch(()=>"") || `Request failed with ${res.status}`);
        }
        return res.json();
    },
    update: async (tenantId, itemId, payload)=>{
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
        const res = await authFetch(`/api/v1/inventory/items/${itemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form.toString()
        }, true, tenantId);
        if (!res.ok) {
            throw new Error(await res.text().catch(()=>"") || `Request failed with ${res.status}`);
        }
        return res.json();
    },
    remove: async (tenantId, itemId)=>{
        const res = await authFetch(`/api/v1/inventory/items/${itemId}`, {
            method: "DELETE"
        }, true, tenantId);
        if (!res.ok) {
            throw new Error(await res.text().catch(()=>"") || `Request failed with ${res.status}`);
        }
        return res.json();
    }
};
const MedicinesAPI = {
    list: (tenantId, options)=>{
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
        return getAuthJSON(path, tenantId);
    }
};
const SalesAPI = {
    pos: (tenantId, payload)=>{
        const { lines, branch } = payload;
        const query = branch ? `?branch=${encodeURIComponent(branch)}` : "";
        const path = `/api/v1/sales/pos${query}`;
        return postAuthJSON(path, lines, tenantId);
    }
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
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border border-white/20 bg-white/70 p-6 shadow-[0_20px_70px_-40px_rgba(16,185,129,0.65)] backdrop-blur-md", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mb-3 flex items-center justify-between gap-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-tight text-emerald-900", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = "CardTitle";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm leading-relaxed text-slate-700", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-4 flex flex-wrap items-center justify-between gap-3", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 48,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = "CardFooter";
;
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
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 cursor-pointer", {
    variants: {
        variant: {
            default: "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500/90 hover:via-emerald-600/90 hover:to-teal-500/90 hover:shadow-emerald-500/40",
            destructive: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:from-red-500/90 hover:to-rose-500/90 focus-visible:ring-red-400/40",
            outline: "border border-emerald-300/60 bg-white/80 text-emerald-700 backdrop-blur-sm shadow-sm hover:border-emerald-400 hover:bg-white",
            secondary: "bg-emerald-50 text-emerald-700 shadow-sm hover:bg-emerald-100",
            ghost: "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",
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
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton,
    "TableSkeletonRows",
    ()=>TableSkeletonRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function Skeleton({ className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `animate-pulse bg-gray-200 rounded ${className}`
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 10
    }, this);
}
function TableSkeletonRows({ rows = 6, cols = 6 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        children: Array.from({
            length: rows
        }).map((_, r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-t",
                children: Array.from({
                    length: cols
                }).map((__, c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-4 w-full"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/skeleton.tsx",
                            lineNumber: 15,
                            columnNumber: 15
                        }, this)
                    }, c, false, {
                        fileName: "[project]/components/ui/skeleton.tsx",
                        lineNumber: 14,
                        columnNumber: 13
                    }, this))
            }, r, false, {
                fileName: "[project]/components/ui/skeleton.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground shadow",
            secondary: "border-transparent bg-secondary text-secondary-foreground",
            destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
            outline: "border-border bg-background text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/app/(dashboard)/dashboard/admin/segments/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminSegmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/tabs'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/alert'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
const SEGMENTS = [
    {
        key: "paid",
        title: "Active (Paid)",
        description: "Fully onboarded pharmacies with verified payments."
    },
    {
        key: "free_trial",
        title: "Free Trial",
        description: "Tenants still within their free-trial window.",
        tone: "info"
    },
    {
        key: "payment_pending",
        title: "Payment Under Review",
        description: "Submitted payment codes awaiting admin verification.",
        tone: "warning"
    },
    {
        key: "unpaid",
        title: "Awaiting Payment",
        description: "Approved KYC but no payment received yet.",
        tone: "warning"
    },
    {
        key: "blocked",
        title: "Blocked",
        description: "Access suspended due to missing or rejected payments.",
        tone: "danger"
    },
    {
        key: "onboarding",
        title: "Onboarding",
        description: "KYC still pending approval.",
        tone: "info"
    }
];
function summarizeDate(label, iso) {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return `${label}: ${iso}`;
    return `${label}: ${date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    })}`;
}
function AdminSegmentsPage() {
    const { show } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("paid");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        async function load() {
            setLoading(true);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdminAPI"].pharmacySummary();
                if (!active) return;
                setData(response);
                setError(null);
            } catch (err) {
                if (!active) return;
                const message = err?.message || "Failed to load pharmacy summary";
                setError(message);
                show({
                    variant: "destructive",
                    title: "Error",
                    description: message
                });
            } finally{
                if (active) setLoading(false);
            }
        }
        load();
        return ()=>{
            active = false;
        };
    }, [
        show
    ]);
    const grouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = new Map();
        SEGMENTS.forEach((segment)=>map.set(segment.key, []));
        data?.items.forEach((item)=>{
            const segmentList = map.get(item.status) || [];
            segmentList.push(item);
            map.set(item.status, segmentList);
        });
        return map;
    }, [
        data
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    className: "h-8 w-56"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: Array.from({
                        length: 6
                    }).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "h-32"
                        }, idx, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Alert, {
            variant: "destructive",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertTitle, {
                    children: "Error"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDescription, {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                    lineNumber: 150,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
            lineNumber: 148,
            columnNumber: 7
        }, this);
    }
    if (!data) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-muted-foreground",
            children: "No data available."
        }, void 0, false, {
            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
            lineNumber: 156,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold",
                        children: "Pharmacy Segments"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Track every tenant across onboarding, payment, and retention states. Use these segments to drive outreach and support."
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Total Pharmacies",
                        value: data.totals.total
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Active (Paid)",
                        value: data.totals.paid,
                        tone: "success"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Free Trial",
                        value: data.totals.free_trial,
                        tone: "info"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Payment Pending",
                        value: data.totals.payment_pending,
                        tone: "warning"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Awaiting Payment",
                        value: data.totals.unpaid,
                        tone: "muted"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Blocked",
                        value: data.totals.blocked,
                        tone: "danger"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                        label: "Onboarding",
                        value: data.totals.onboarding,
                        tone: "info"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tabs, {
                value: activeTab,
                onValueChange: (val)=>setActiveTab(val),
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsList, {
                        className: "flex-wrap justify-start",
                        children: SEGMENTS.map((segment)=>{
                            const count = grouped.get(segment.key)?.length || 0;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsTrigger, {
                                value: segment.key,
                                className: "flex items-center gap-2",
                                children: [
                                    segment.title,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "outline",
                                        className: "text-xs",
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, segment.key, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    SEGMENTS.map((segment)=>{
                        const list = grouped.get(segment.key) || [];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsContent, {
                            value: segment.key,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SegmentHeader, {
                                    segment: segment,
                                    count: list.length
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this),
                                list.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "py-12 text-center text-sm text-muted-foreground",
                                        children: "No pharmacies found in this segment."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                    lineNumber: 203,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 lg:grid-cols-2",
                                    children: list.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SegmentCard, {
                                            item: item
                                        }, item.tenant_id, false, {
                                            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                            lineNumber: 211,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                    lineNumber: 209,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, segment.key, true, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
function SummaryCard({ label, value, tone = "default" }) {
    const toneClasses = {
        default: "border-white/10 bg-white/5",
        success: "border-emerald-400/40 bg-emerald-500/15",
        warning: "border-amber-400/40 bg-amber-500/15",
        danger: "border-red-400/40 bg-red-500/15",
        info: "border-sky-400/40 bg-sky-500/15",
        muted: "border-white/10 bg-white/5"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: toneClasses[tone],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                    className: "text-sm text-muted-foreground uppercase tracking-[0.2em]",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-3xl font-semibold text-white",
                    children: value.toLocaleString()
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                    lineNumber: 246,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
function SegmentHeader({ segment, count }) {
    const badgeTone = segment.tone === "danger" ? "bg-red-500/20 text-red-200" : segment.tone === "warning" ? "bg-amber-500/20 text-amber-100" : segment.tone === "info" ? "bg-sky-500/20 text-sky-100" : "bg-white/10 text-white";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-white flex items-center gap-2",
                        children: [
                            segment.title,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeTone}`,
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground mt-1",
                        children: segment.description
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "outline",
                size: "sm",
                className: "self-start",
                children: "Export Segment"
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
        lineNumber: 269,
        columnNumber: 5
    }, this);
}
function SegmentCard({ item }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "border-white/10 bg-white/5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-base text-white",
                        children: item.name || item.tenant_id
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground font-mono",
                        children: item.tenant_id
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-3 text-sm text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Branches: ",
                                    item.branch_count
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Users: ",
                                    item.user_count
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    summarizeDate("Trial ends", item.trial_ends_at) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: summarizeDate("Trial ends", item.trial_ends_at)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 298,
                        columnNumber: 61
                    }, this),
                    summarizeDate("Last payment", item.last_payment_verified_at) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-emerald-200 text-xs",
                        children: summarizeDate("Last payment", item.last_payment_verified_at)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    summarizeDate("Payment submitted", item.pending_payment_submitted_at) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-amber-200 text-xs",
                        children: summarizeDate("Payment submitted", item.pending_payment_submitted_at)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "outline",
                            className: "uppercase tracking-[0.2em] text-xs",
                            children: item.status_label
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "secondary",
                                className: "flex-1",
                                children: "Open details"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                className: "flex-1",
                                children: "Message owner"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                                lineNumber: 314,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/segments/page.tsx",
        lineNumber: 288,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_3cc6cb99._.js.map