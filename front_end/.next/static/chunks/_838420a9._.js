(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:8000/api/v1") || "http://localhost:8000";
const TENANT_HEADER = ("TURBOPACK compile-time value", "X-Tenant-ID") || "X-Tenant-ID";
const API_BASE_NORMALIZED = API_BASE.replace(/\/+$/, "");
let API_BASE_PATH = "";
try {
    const parsed = new URL(API_BASE_NORMALIZED);
    API_BASE_PATH = parsed.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
} catch (e) {
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
        return "".concat(API_BASE_NORMALIZED).concat(path);
    }
    const normalizedPath = path.replace(/^\/+/, "");
    let relativePath = normalizedPath;
    if (API_BASE_PATH) {
        const prefix = "".concat(API_BASE_PATH, "/");
        if (relativePath.startsWith(prefix)) {
            relativePath = relativePath.slice(prefix.length);
        } else if (relativePath === API_BASE_PATH) {
            relativePath = "";
        }
    }
    if (!relativePath) {
        return API_BASE_NORMALIZED;
    }
    return "".concat(API_BASE_NORMALIZED, "/").concat(relativePath);
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
        } catch (e) {
            parsed = await res.text().catch(()=>null);
        }
        let msg = "";
        if (!parsed) msg = "Request failed with ".concat(res.status);
        else if (typeof parsed === "string") msg = parsed;
        else if (Array.isArray(parsed)) msg = parsed.join(", ");
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.detail) msg = parsed.detail;
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.message) msg = parsed.message;
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.error) msg = parsed.error;
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.errors) {
            msg = Object.keys(parsed.errors).map((k)=>"".concat(k, ": ").concat(Array.isArray(parsed.errors[k]) ? parsed.errors[k].join(", ") : parsed.errors[k])).join(" | ");
        } else msg = JSON.stringify(parsed);
        const err = new Error(msg || "Request failed with ".concat(res.status));
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
                else message = (parsed === null || parsed === void 0 ? void 0 : parsed.error) || (parsed === null || parsed === void 0 ? void 0 : parsed.detail) || (parsed === null || parsed === void 0 ? void 0 : parsed.message) || "";
                if (!message && parsed) message = JSON.stringify(parsed);
            } catch (e) {
                parsed = null;
                message = await res.text().catch(()=>"");
            }
            const error = new Error(message || "Request failed with ".concat(res.status));
            error.status = res.status;
            if (parsed !== null) error.body = parsed;
            throw error;
        }
        return await res.json();
    } catch (error) {
        if ("object" !== "undefined" && !navigator.onLine) {
            const { queueRequest } = await __turbopack_context__.A("[project]/lib/offline/queue.ts [app-client] (ecmascript, async loader)");
            await queueRequest(path, requestInit, {
                tenantId,
                requiresAuth: true,
                description: requestInit.body ? "POST ".concat(path) : undefined
            });
            const offlineError = new Error("Request queued until you are back online.");
            offlineError.offline = true;
            throw offlineError;
        }
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
        throw new Error(text || "Request failed with ".concat(res.status));
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
            const msg = (data === null || data === void 0 ? void 0 : data.error) || (data === null || data === void 0 ? void 0 : data.detail) || JSON.stringify(data);
            throw new Error(msg || "Request failed with ".concat(res.status));
        } catch (e) {
            throw new Error("Request failed with ".concat(res.status));
        }
    }
    return await res.json();
}
function getAccessToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("access_token");
}
function getTenantId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("tenant_id");
}
function getRefreshToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("refresh_token");
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
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
        }
        return true;
    } catch (e) {
        return false;
    }
}
async function authFetch(path, init) {
    let retry = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, tenantId = arguments.length > 3 ? arguments[3] : void 0;
    const token = getAccessToken();
    var _ref;
    const activeTenantId = (_ref = tenantId !== null && tenantId !== void 0 ? tenantId : getTenantId()) !== null && _ref !== void 0 ? _ref : undefined;
    const headers = buildHeaders({
        ...(init === null || init === void 0 ? void 0 : init.headers) || {},
        ...token ? {
            Authorization: "Bearer ".concat(token)
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
            var _ref1;
            const retryTenantId = (_ref1 = tenantId !== null && tenantId !== void 0 ? tenantId : getTenantId()) !== null && _ref1 !== void 0 ? _ref1 : undefined;
            const retryHeaders = buildHeaders({
                ...(init === null || init === void 0 ? void 0 : init.headers) || {},
                ...newToken ? {
                    Authorization: "Bearer ".concat(newToken)
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
        throw new Error(data || "Request failed with ".concat(res.status));
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
        throw new Error(data || "Request failed with ".concat(res.status));
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
        throw new Error(data || "Request failed with ".concat(res.status));
    }
    // For DELETE requests, we might not have a response body
    try {
        return await res.json();
    } catch (e) {
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
            if ((err === null || err === void 0 ? void 0 : err.status) === 422) {
                console.warn("[AuthAPI.registerVerify] 422, retrying with JSON", {
                    body: err.body
                });
                try {
                    return await postJSON("/api/v1/auth/register/verify", {
                        email,
                        code
                    });
                } catch (err2) {
                    const e = new Error((err2 === null || err2 === void 0 ? void 0 : err2.message) || (err === null || err === void 0 ? void 0 : err.message) || "Verification failed");
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
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem("access_token", resp.access_token);
                localStorage.setItem("refresh_token", resp.refresh_token);
                if (tenantId) {
                    localStorage.setItem("tenant_id", tenantId);
                }
            }
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
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem("access_token", resp.access_token);
                localStorage.setItem("refresh_token", resp.refresh_token);
                if (tenantId) {
                    localStorage.setItem("tenant_id", tenantId);
                }
            }
            return resp;
        }),
    refresh: (refreshToken)=>postJSON("/api/v1/auth/refresh", {
            refresh_token: refreshToken
        }),
    sessions: ()=>getAuthJSON("/api/v1/auth/sessions"),
    revokeSession: (sessionId)=>authFetch("/api/v1/auth/sessions/".concat(sessionId), {
            method: "DELETE"
        }).then((res)=>{
            if (!res.ok) throw new Error("Failed to revoke session");
        }),
    changePassword: (body)=>postAuthJSON("/api/v1/auth/change-password", body),
    me: ()=>getAuthJSON("/api/v1/auth/me").then((profile)=>{
            if ("TURBOPACK compile-time truthy", 1) {
                if (profile === null || profile === void 0 ? void 0 : profile.tenant_id) {
                    localStorage.setItem("tenant_id", profile.tenant_id);
                }
            }
            return profile;
        })
};
const TenantAPI = {
    activity: async (params)=>{
        var _params_action;
        const searchParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit) searchParams.set("limit", params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset) searchParams.set("offset", params.offset.toString());
        params === null || params === void 0 ? void 0 : (_params_action = params.action) === null || _params_action === void 0 ? void 0 : _params_action.forEach((action)=>searchParams.append("action", action));
        const qs = searchParams.toString();
        const url = "/api/v1/tenant/activity".concat(qs ? "?".concat(qs) : "");
        var _getTenantId;
        const tenantId = (_getTenantId = getTenantId()) !== null && _getTenantId !== void 0 ? _getTenantId : undefined;
        const res = await authFetch(url, undefined, true, tenantId);
        if (res.status === 404 || res.status === 204) {
            return [];
        }
        if (!res.ok) {
            const text = await res.text().catch(()=>"");
            throw new Error(text || "Request failed with ".concat(res.status));
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return [];
        }
        try {
            return await res.json();
        } catch (e) {
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
    disconnect: (tenantId, connectionId)=>authFetch("/api/v1/integrations/connections/".concat(connectionId), {
            method: "DELETE"
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) {
                const text = await res.text().catch(()=>"");
                throw new Error(text || "HTTP ".concat(res.status));
            }
            return res.json();
        }),
    triggerSync: (tenantId, connectionId, resource, direction)=>postAuthJSON("/api/v1/integrations/connections/".concat(connectionId, "/sync"), {
            resource,
            direction
        }, tenantId)
};
const AffiliateAPI = {
    getLinks: ()=>getAuthJSON("/api/v1/affiliate/register-link", ""),
    createLink: ()=>getAuthJSON("/api/v1/affiliate/register-link?create_new=true", ""),
    deactivate: (token)=>postAuthJSON("/api/v1/affiliate/links/".concat(encodeURIComponent(token), "/deactivate"), {}, ""),
    rotate: (token)=>postAuthJSON("/api/v1/affiliate/links/".concat(encodeURIComponent(token), "/rotate"), {}, ""),
    dashboard: ()=>getAuthJSON("/api/v1/affiliate/dashboard", ""),
    payouts: (status)=>getAuthJSON("/api/v1/affiliate/payouts".concat(status ? "?status_filter=".concat(encodeURIComponent(status)) : ""), ""),
    requestPayout: function(month) {
        let percent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
        return postAuthJSON("/api/v1/affiliate/payouts/request", {
            month,
            percent
        }, "");
    },
    updateProfile: (body)=>postAuthJSON("/api/v1/affiliate/profile", body, "")
};
const AdminAPI = {
    analyticsOverview: function() {
        let days = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 30;
        return getAuthJSON("/api/v1/admin/analytics/overview?days=".concat(days));
    },
    pharmacySummary: ()=>getAuthJSON("/api/v1/admin/pharmacies/summary"),
    pharmacies: function() {
        let page = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, pageSize = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 20, q = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
        return getAuthJSON("/api/v1/admin/pharmacies?page=".concat(page, "&page_size=").concat(pageSize, "&q=").concat(encodeURIComponent(q)));
    },
    approvePharmacy: (tenantId, applicationId, body)=>postAuthJSON("/api/v1/admin/pharmacies/".concat(applicationId, "/approve"), body || {}, tenantId),
    rejectPharmacy: (tenantId, applicationId)=>postAuthJSON("/api/v1/admin/pharmacies/".concat(applicationId, "/reject"), {}, tenantId),
    verifyPayment: (tenantId, code)=>postAuthJSON("/api/v1/admin/payments/verify", {
            code: code || null
        }, tenantId),
    rejectPayment: (tenantId, code)=>postAuthJSON("/api/v1/admin/payments/reject", {
            code: code || null
        }, tenantId),
    approveAffiliate: (userId)=>postAuthJSON("/api/v1/admin/affiliates/".concat(userId, "/approve"), {}),
    rejectAffiliate: (userId)=>postAuthJSON("/api/v1/admin/affiliates/".concat(userId, "/reject"), {}),
    affiliates: function() {
        let page = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, pageSize = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 20, q = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
        return getAuthJSON("/api/v1/admin/affiliates?page=".concat(page, "&page_size=").concat(pageSize, "&q=").concat(encodeURIComponent(q)));
    },
    usage: function() {
        let days = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 14;
        return getAuthJSON("/api/v1/admin/usage?days=".concat(days));
    },
    audit: (params)=>{
        const query = new URLSearchParams();
        if (params.tenant_id) query.set('tenant_id', params.tenant_id);
        if (params.action) query.set('action', params.action);
        if (params.limit) query.set('limit', params.limit.toString());
        return getAuthJSON("/api/v1/admin/audit".concat(query.toString() ? "?".concat(query.toString()) : ''));
    }
};
const StaffAPI = {
    createCashier: (tenantId, body)=>postAuthJSON("/api/v1/staff", body, tenantId),
    list: (tenantId)=>getAuthJSON("/api/v1/staff", tenantId),
    update: (tenantId, userId, body)=>authFetch("/api/v1/staff/".concat(userId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) {
                const text = await res.text().catch(()=>"");
                throw new Error(text || "Request failed with ".concat(res.status));
            }
            return res.json();
        }),
    remove: (tenantId, userId)=>authFetch("/api/v1/staff/".concat(userId), {
            method: "DELETE"
        }, true, tenantId).then(async (res)=>{
            if (!res.ok) {
                const text = await res.text().catch(()=>"");
                throw new Error(text || "Request failed with ".concat(res.status));
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
        var _params_page;
        search.set("page", String((_params_page = params === null || params === void 0 ? void 0 : params.page) !== null && _params_page !== void 0 ? _params_page : 1));
        var _params_page_size;
        search.set("page_size", String((_params_page_size = params === null || params === void 0 ? void 0 : params.page_size) !== null && _params_page_size !== void 0 ? _params_page_size : 20));
        if (params === null || params === void 0 ? void 0 : params.q) search.set("q", params.q);
        const queryString = search.toString();
        const path = "/api/v1/pharmacies".concat(queryString ? "?".concat(queryString) : "");
        return getAuthJSON(path, tenantId);
    },
    get: (id, tenantId)=>getAuthJSON("/api/v1/pharmacies/".concat(id), tenantId),
    update: (id, body, tenantId)=>authFetch("/api/v1/pharmacies/".concat(id), {
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
        const query = pharmacyId ? "?pharmacy_id=".concat(pharmacyId) : '';
        return getAuthJSON("/api/v1/branches".concat(query), tenantId);
    },
    get: (tenantId, id)=>getAuthJSON("/api/v1/branches/".concat(id), tenantId),
    update: (tenantId, id, payload)=>putAuthJSON("/api/v1/branches/".concat(id), payload, tenantId),
    delete: (tenantId, id)=>deleteAuthJSON("/api/v1/branches/".concat(id), tenantId)
};
const ChatAPI = {
    listThreads: (tenantId)=>getAuthJSON("/api/v1/chat/threads", tenantId),
    createThread: (tenantId, title)=>postAuthJSON("/api/v1/chat/threads", title ? {
            title
        } : {}, tenantId),
    listMessages: (tenantId, threadId)=>getAuthJSON("/api/v1/chat/threads/".concat(threadId, "/messages"), tenantId),
    sendMessage: (tenantId, threadId, prompt)=>postAuthJSON("/api/v1/chat/threads/".concat(threadId, "/messages"), {
            prompt
        }, tenantId),
    usage: function(tenantId) {
        let days = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 30;
        return getAuthJSON("/api/v1/chat/usage?days=".concat(days), tenantId);
    }
};
const OwnerAnalyticsAPI = {
    overview: (tenantId, options)=>{
        const params = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.horizon) params.set("horizon", options.horizon);
        if (options === null || options === void 0 ? void 0 : options.trendWeeks) params.set("trend_weeks", String(options.trendWeeks));
        const query = params.toString();
        const path = "/api/v1/owner/analytics/overview".concat(query ? "?".concat(query) : "");
        return getAuthJSON(path, tenantId);
    }
};
const OwnerChatAPI = {
    listThreads: (tenantId)=>getAuthJSON("/api/v1/owner/chat/threads", tenantId),
    createThread: (tenantId, title)=>postAuthJSON("/api/v1/owner/chat/threads", {
            title
        }, tenantId),
    listMessages: (tenantId, threadId)=>getAuthJSON("/api/v1/owner/chat/threads/".concat(threadId, "/messages"), tenantId),
    sendMessage: (tenantId, threadId, prompt)=>postAuthJSON("/api/v1/owner/chat/threads/".concat(threadId, "/messages"), {
            prompt
        }, tenantId)
};
const InventoryAPI = {
    list: (tenantId, options)=>{
        const params = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.q) params.set("q", options.q);
        if (options === null || options === void 0 ? void 0 : options.branch) params.set("branch", options.branch);
        if (typeof (options === null || options === void 0 ? void 0 : options.expiringInDays) === "number") {
            params.set("expiring_in_days", String(options.expiringInDays));
        }
        if (options === null || options === void 0 ? void 0 : options.lowStockOnly) params.set("low_stock_only", "true");
        if (options === null || options === void 0 ? void 0 : options.page) params.set("page", String(options.page));
        if (options === null || options === void 0 ? void 0 : options.pageSize) params.set("page_size", String(options.pageSize));
        const query = params.toString();
        const path = "/api/v1/inventory/items".concat(query ? "?".concat(query) : "");
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
        const res = await authFetch("/api/v1/inventory/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form.toString()
        }, true, tenantId);
        if (!res.ok) {
            throw new Error(await res.text().catch(()=>"") || "Request failed with ".concat(res.status));
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
        const res = await authFetch("/api/v1/inventory/items/".concat(itemId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form.toString()
        }, true, tenantId);
        if (!res.ok) {
            throw new Error(await res.text().catch(()=>"") || "Request failed with ".concat(res.status));
        }
        return res.json();
    },
    remove: async (tenantId, itemId)=>{
        const res = await authFetch("/api/v1/inventory/items/".concat(itemId), {
            method: "DELETE"
        }, true, tenantId);
        if (!res.ok) {
            throw new Error(await res.text().catch(()=>"") || "Request failed with ".concat(res.status));
        }
        return res.json();
    }
};
const MedicinesAPI = {
    list: (tenantId, options)=>{
        const query = new URLSearchParams();
        if (options === null || options === void 0 ? void 0 : options.q) {
            query.set("q", options.q);
        }
        if (options === null || options === void 0 ? void 0 : options.page) {
            query.set("page", String(options.page));
        }
        if (options === null || options === void 0 ? void 0 : options.pageSize) {
            query.set("page_size", String(Math.min(200, Math.max(1, options.pageSize))));
        }
        const path = "/api/v1/medicines".concat(query.toString() ? "?".concat(query.toString()) : "");
        return getAuthJSON(path, tenantId);
    }
};
const SalesAPI = {
    pos: (tenantId, payload)=>{
        const { lines, branch } = payload;
        const query = branch ? "?branch=".concat(encodeURIComponent(branch)) : "";
        const path = "/api/v1/sales/pos".concat(query);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(dashboard)/dashboard/admin/audit/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminAuditPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function formatDateTime(value) {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "medium"
        });
    } catch (e) {
        return value;
    }
}
function ActionBadge(param) {
    let { action } = param;
    const getStyle = (action)=>{
        if (action.includes('create') || action.includes('register')) return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200";
        if (action.includes('delete') || action.includes('reject')) return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200";
        if (action.includes('update') || action.includes('approve')) return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200";
        if (action.includes('verify') || action.includes('payment')) return "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200";
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
    };
    const getIcon = (action)=>{
        if (action.includes('create') || action.includes('register')) return "✨";
        if (action.includes('delete') || action.includes('reject')) return "🗑️";
        if (action.includes('update') || action.includes('approve')) return "✅";
        if (action.includes('verify') || action.includes('payment')) return "💳";
        return "⚡";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap ".concat(getStyle(action)),
        title: action,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs",
                children: getIcon(action)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: action
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = ActionBadge;
function AdminAuditPage() {
    _s();
    const { show } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tenantId, setTenantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [action, setAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [limit, setLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("50");
    async function refresh() {
        setLoading(true);
        try {
            const lim = Math.max(1, Math.min(200, Number(limit) || 50));
            const rows = await (__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].audit || __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].getAuditLogs || (()=>[]))({
                tenant_id: tenantId || undefined,
                action: action || undefined,
                limit: lim
            });
            setItems(rows || []);
            setError(null);
        } catch (e) {
            setError(e.message || "Failed to load audit");
            show({
                variant: "destructive",
                title: "Error",
                description: e.message
            });
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminAuditPage.useEffect": ()=>{
            refresh();
        }
    }["AdminAuditPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row lg:items-center justify-between gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white text-xl",
                                                children: "📋"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    className: "text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent",
                                                    children: "Audit Trail"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600 text-sm",
                                                    children: "Track all system activities and changes"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 89,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 bg-gray-50 p-3 rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "🏢 Tenant",
                                        value: tenantId,
                                        onChange: (e)=>setTenantId(e.target.value),
                                        className: "w-32 text-sm text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "⚡ Action",
                                        value: action,
                                        onChange: (e)=>setAction(e.target.value),
                                        className: "w-28 text-sm text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "📊 Limit",
                                        value: limit,
                                        onChange: (e)=>setLimit(e.target.value),
                                        className: "w-20 text-sm text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: refresh,
                                        className: "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-sm",
                                        children: "🔍 Filter"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-gray-600 font-medium",
                                children: "Loading audit data..."
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                        lineNumber: 124,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                    lineNumber: 123,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-lg border border-red-200 p-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-600 text-2xl",
                                    children: "⚠️"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 135,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-red-600 font-semibold text-lg",
                                children: "Error Loading Data"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 138,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-red-500 text-center",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: refresh,
                                className: "bg-red-600 hover:bg-red-700 text-white",
                                children: "Try Again"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 140,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                        lineNumber: 134,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full table-fixed",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-blue-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-20 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-600",
                                                                children: "#"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 153,
                                                                columnNumber: 25
                                                            }, this),
                                                            "ID"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-40 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-green-600",
                                                                children: "🕒"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Time"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-32 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-blue-600",
                                                                children: "🏢"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Tenant"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-24 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-purple-600",
                                                                children: "👤"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 171,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Actor"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-40 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-600",
                                                                children: "⚡"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 177,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Action"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-32 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-600",
                                                                children: "🎯"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 183,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Target"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "w-28 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-indigo-600",
                                                                children: "📄"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 189,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Details"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 149,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-gray-100",
                                        children: [
                                            items.map((r, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ".concat(index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-2 py-1 rounded font-semibold",
                                                                children: r.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-900 font-medium whitespace-nowrap",
                                                                children: formatDateTime(r.created_at)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 204,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 203,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4",
                                                            children: r.tenant_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded font-semibold break-all",
                                                                title: r.tenant_id,
                                                                children: r.tenant_id
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 210,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400 italic text-xs",
                                                                children: "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4",
                                                            children: r.actor_user_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-2 py-1 rounded font-semibold",
                                                                children: [
                                                                    "#",
                                                                    r.actor_user_id
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 219,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-medium",
                                                                children: "System"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 223,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBadge, {
                                                                action: r.action
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4",
                                                            children: r.target_type ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-gray-700 font-medium text-xs",
                                                                        children: r.target_type
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                        lineNumber: 232,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    r.target_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-mono text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold inline-block",
                                                                        children: [
                                                                            "#",
                                                                            r.target_id
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                        lineNumber: 234,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400 italic text-xs",
                                                                children: "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 229,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-4 relative",
                                                            children: r.metadata && Object.keys(r.metadata).length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                                                className: "cursor-pointer group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                                        className: "text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-200 inline-block list-none",
                                                                        children: "📄 View"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                        lineNumber: 246,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute z-20 right-0 mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-xl max-w-md",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                                            className: "text-xs text-gray-700 overflow-auto max-h-60 whitespace-pre-wrap",
                                                                            children: JSON.stringify(r.metadata, null, 2)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                            lineNumber: 250,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                        lineNumber: 249,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-gray-400 italic",
                                                                children: "No data"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                            lineNumber: 243,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, r.id, true, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 21
                                                }, this)),
                                            items.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-20 text-center",
                                                    colSpan: 7,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-4xl",
                                                                    children: "📋"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                    lineNumber: 266,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 265,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xl font-bold text-gray-700",
                                                                        children: "No audit events found"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                        lineNumber: 269,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-gray-500",
                                                                        children: "Try adjusting your filters or check back later"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                        lineNumber: 270,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 268,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                onClick: refresh,
                                                                className: "bg-blue-600 hover:bg-blue-700 text-white",
                                                                children: "🔄 Refresh"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                                lineNumber: 272,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 148,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                            lineNumber: 147,
                            columnNumber: 13
                        }, this),
                        items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600 font-medium",
                                        children: [
                                            "📊 Showing ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold text-blue-600",
                                                children: items.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                                lineNumber: 286,
                                                columnNumber: 32
                                            }, this),
                                            " events"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: [
                                            "Limited to ",
                                            limit,
                                            " results"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                                lineNumber: 284,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                            lineNumber: 283,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/audit/page.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(AdminAuditPage, "gBfDc8VuOPVn+8E2L81pUPQtjWg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c1 = AdminAuditPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBadge");
__turbopack_context__.k.register(_c1, "AdminAuditPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_838420a9._.js.map