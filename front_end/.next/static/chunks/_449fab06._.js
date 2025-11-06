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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
    rejectAffiliate: (userId)=>postAuthJSON("/api/v1/admin/affiliates/".concat(userId, "/reject"), {})
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
"[project]/app/(dashboard)/dashboard/affiliate/_hooks/use-affiliate-dashboard.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAffiliateDashboard",
    ()=>useAffiliateDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DEFAULT_STATS = {
    currentCommission: 0,
    pendingPayout: 0,
    paidPayout: 0,
    referrals: 0
};
const DEFAULT_MONTH = new Date().toISOString().slice(0, 7);
const MAX_ACTIVE_LINKS = 2;
function toNumber(value) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
}
function extractStats(data) {
    var _data_stats, _ref;
    const source = (_ref = (_data_stats = data === null || data === void 0 ? void 0 : data.stats) !== null && _data_stats !== void 0 ? _data_stats : data) !== null && _ref !== void 0 ? _ref : {};
    var _source_payouts;
    const payouts = (_source_payouts = source === null || source === void 0 ? void 0 : source.payouts) !== null && _source_payouts !== void 0 ? _source_payouts : {};
    var _source_currentCommission, _ref1, _ref2, _ref3, _ref4, _source_pendingPayout, _ref5, _ref6, _ref7, _ref8, _source_paidPayout, _ref9, _ref10, _ref11, _ref12, _source_referrals, _ref13, _ref14, _ref15, _ref16;
    return {
        currentCommission: toNumber((_ref4 = (_ref3 = (_ref2 = (_ref1 = (_source_currentCommission = source.currentCommission) !== null && _source_currentCommission !== void 0 ? _source_currentCommission : source.current_commission) !== null && _ref1 !== void 0 ? _ref1 : source.current) !== null && _ref2 !== void 0 ? _ref2 : source.amount) !== null && _ref3 !== void 0 ? _ref3 : source.commission) !== null && _ref4 !== void 0 ? _ref4 : 0),
        pendingPayout: toNumber((_ref8 = (_ref7 = (_ref6 = (_ref5 = (_source_pendingPayout = source.pendingPayout) !== null && _source_pendingPayout !== void 0 ? _source_pendingPayout : source.pending_payout) !== null && _ref5 !== void 0 ? _ref5 : source.pending) !== null && _ref6 !== void 0 ? _ref6 : payouts.pending_total) !== null && _ref7 !== void 0 ? _ref7 : payouts.pending) !== null && _ref8 !== void 0 ? _ref8 : 0),
        paidPayout: toNumber((_ref12 = (_ref11 = (_ref10 = (_ref9 = (_source_paidPayout = source.paidPayout) !== null && _source_paidPayout !== void 0 ? _source_paidPayout : source.paid_payout) !== null && _ref9 !== void 0 ? _ref9 : source.paid) !== null && _ref10 !== void 0 ? _ref10 : payouts.paid_total) !== null && _ref11 !== void 0 ? _ref11 : payouts.paid) !== null && _ref12 !== void 0 ? _ref12 : 0),
        referrals: toNumber((_ref16 = (_ref15 = (_ref14 = (_ref13 = (_source_referrals = source.referrals) !== null && _source_referrals !== void 0 ? _source_referrals : source.total_referrals) !== null && _ref13 !== void 0 ? _ref13 : source.affiliates) !== null && _ref14 !== void 0 ? _ref14 : source.referrals_count) !== null && _ref15 !== void 0 ? _ref15 : source.activated_referrals) !== null && _ref16 !== void 0 ? _ref16 : 0)
    };
}
function normalizeLinks(payload) {
    const list = Array.isArray(payload) ? payload : Array.isArray(payload === null || payload === void 0 ? void 0 : payload.links) ? payload.links : [];
    return list.map((item)=>{
        var _item_token, _ref, _item_url, _ref1, _ref2, _item_active, _ref3, _item_created_at, _ref4;
        return {
            token: String((_ref = (_item_token = item === null || item === void 0 ? void 0 : item.token) !== null && _item_token !== void 0 ? _item_token : item === null || item === void 0 ? void 0 : item.code) !== null && _ref !== void 0 ? _ref : ""),
            url: String((_ref2 = (_ref1 = (_item_url = item === null || item === void 0 ? void 0 : item.url) !== null && _item_url !== void 0 ? _item_url : item === null || item === void 0 ? void 0 : item.link) !== null && _ref1 !== void 0 ? _ref1 : item === null || item === void 0 ? void 0 : item.register_url) !== null && _ref2 !== void 0 ? _ref2 : ""),
            active: Boolean((_ref3 = (_item_active = item === null || item === void 0 ? void 0 : item.active) !== null && _item_active !== void 0 ? _item_active : item === null || item === void 0 ? void 0 : item.is_active) !== null && _ref3 !== void 0 ? _ref3 : (item === null || item === void 0 ? void 0 : item.status) === "active"),
            createdAt: (_ref4 = (_item_created_at = item === null || item === void 0 ? void 0 : item.created_at) !== null && _item_created_at !== void 0 ? _item_created_at : item === null || item === void 0 ? void 0 : item.createdAt) !== null && _ref4 !== void 0 ? _ref4 : null
        };
    }).filter((item)=>item.token && item.url);
}
function extractMonthLabel(data) {
    var _data_stats;
    if (typeof (data === null || data === void 0 ? void 0 : data.year) === "number" && typeof (data === null || data === void 0 ? void 0 : data.month) === "number") {
        try {
            return new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric"
            }).format(new Date(data.year, data.month - 1));
        } catch (e) {
            return "".concat(data.year, "-").concat(String(data.month).padStart(2, "0"));
        }
    }
    var _data_monthLabel, _ref, _ref1, _ref2;
    const month = (_ref2 = (_ref1 = (_ref = (_data_monthLabel = data === null || data === void 0 ? void 0 : data.monthLabel) !== null && _data_monthLabel !== void 0 ? _data_monthLabel : data === null || data === void 0 ? void 0 : data.month_label) !== null && _ref !== void 0 ? _ref : data === null || data === void 0 ? void 0 : data.current_month_label) !== null && _ref1 !== void 0 ? _ref1 : data === null || data === void 0 ? void 0 : (_data_stats = data.stats) === null || _data_stats === void 0 ? void 0 : _data_stats.month_label) !== null && _ref2 !== void 0 ? _ref2 : null;
    if (month) return String(month);
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    }).format(new Date());
}
function extractPercent(data) {
    var _data_stats;
    var _data_percent, _ref, _ref1, _ref2;
    return toNumber((_ref2 = (_ref1 = (_ref = (_data_percent = data === null || data === void 0 ? void 0 : data.percent) !== null && _data_percent !== void 0 ? _data_percent : data === null || data === void 0 ? void 0 : data.commission_percent) !== null && _ref !== void 0 ? _ref : data === null || data === void 0 ? void 0 : (_data_stats = data.stats) === null || _data_stats === void 0 ? void 0 : _data_stats.percent) !== null && _ref1 !== void 0 ? _ref1 : data === null || data === void 0 ? void 0 : data.current_percent) !== null && _ref2 !== void 0 ? _ref2 : 5);
}
function normalizePayout(item) {
    var _item_id, _item_percent, _item_amount, _item_status;
    return {
        id: Number((_item_id = item === null || item === void 0 ? void 0 : item.id) !== null && _item_id !== void 0 ? _item_id : 0),
        month: (item === null || item === void 0 ? void 0 : item.month) ? String(item.month) : "",
        percent: toNumber((_item_percent = item === null || item === void 0 ? void 0 : item.percent) !== null && _item_percent !== void 0 ? _item_percent : 0),
        amount: toNumber((_item_amount = item === null || item === void 0 ? void 0 : item.amount) !== null && _item_amount !== void 0 ? _item_amount : 0),
        status: String((_item_status = item === null || item === void 0 ? void 0 : item.status) !== null && _item_status !== void 0 ? _item_status : "pending")
    };
}
function getErrorMessage(error) {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    try {
        return JSON.stringify(error);
    } catch (e) {
        return "Unexpected error";
    }
}
function useAffiliateDashboard() {
    _s();
    const { show } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_STATS);
    const [dash, setDash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [links, setLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [payouts, setPayouts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [canCreateMore, setCanCreateMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [monthLabel, setMonthLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(extractMonthLabel(null));
    const [payoutMonth, setPayoutMonthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_MONTH);
    const [payoutPercent, setPayoutPercentState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [requestingPayout, setRequestingPayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const refreshLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[refreshLinks]": async ()=>{
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].getLinks();
            const normalized = normalizeLinks(response);
            setLinks(normalized);
            const activeCount = normalized.filter({
                "useAffiliateDashboard.useCallback[refreshLinks]": (link)=>link.active
            }["useAffiliateDashboard.useCallback[refreshLinks]"]).length;
            setCanCreateMore(activeCount < MAX_ACTIVE_LINKS);
        }
    }["useAffiliateDashboard.useCallback[refreshLinks]"], []);
    const refreshDashboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[refreshDashboard]": async ()=>{
            var _response_stats;
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].dashboard();
            setStats(extractStats(response));
            var _response_dash, _ref, _ref1, _ref2, _ref3;
            const snapshot = (_ref3 = (_ref2 = (_ref1 = (_ref = (_response_dash = response === null || response === void 0 ? void 0 : response.dash) !== null && _response_dash !== void 0 ? _response_dash : response === null || response === void 0 ? void 0 : response.current_month) !== null && _ref !== void 0 ? _ref : response === null || response === void 0 ? void 0 : response.summary) !== null && _ref1 !== void 0 ? _ref1 : response === null || response === void 0 ? void 0 : (_response_stats = response.stats) === null || _response_stats === void 0 ? void 0 : _response_stats.current_month) !== null && _ref2 !== void 0 ? _ref2 : response) !== null && _ref3 !== void 0 ? _ref3 : null;
            setDash(snapshot !== null && snapshot !== void 0 ? snapshot : null);
            setMonthLabel(extractMonthLabel(response));
            const percent = extractPercent(response);
            var _response_next_payout_month, _ref4;
            const nextMonth = (_ref4 = (_response_next_payout_month = response === null || response === void 0 ? void 0 : response.next_payout_month) !== null && _response_next_payout_month !== void 0 ? _response_next_payout_month : response === null || response === void 0 ? void 0 : response.payout_month) !== null && _ref4 !== void 0 ? _ref4 : typeof (response === null || response === void 0 ? void 0 : response.year) === "number" && typeof (response === null || response === void 0 ? void 0 : response.month) === "number" ? "".concat(response.year, "-").concat(String(response.month).padStart(2, "0")) : null;
            if (!hasInitialized.current) {
                setPayoutPercentState(percent > 0 ? percent : 5);
                setPayoutMonthState(typeof nextMonth === "string" && nextMonth ? nextMonth : DEFAULT_MONTH);
                hasInitialized.current = true;
            }
        }
    }["useAffiliateDashboard.useCallback[refreshDashboard]"], []);
    const refreshPayouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[refreshPayouts]": async ()=>{
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].payouts();
            if (Array.isArray(response)) {
                setPayouts(response.map(normalizePayout));
            } else {
                setPayouts([]);
            }
        }
    }["useAffiliateDashboard.useCallback[refreshPayouts]"], []);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[refresh]": async ()=>{
            try {
                setLoading(true);
                await Promise.all([
                    refreshDashboard(),
                    refreshLinks(),
                    refreshPayouts()
                ]);
                setError(null);
            } catch (err) {
                const message = getErrorMessage(err);
                console.error("[useAffiliateDashboard] refresh failed", err);
                setError(message);
            } finally{
                setLoading(false);
            }
        }
    }["useAffiliateDashboard.useCallback[refresh]"], [
        refreshDashboard,
        refreshLinks,
        refreshPayouts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAffiliateDashboard.useEffect": ()=>{
            refresh();
        }
    }["useAffiliateDashboard.useEffect"], [
        refresh
    ]);
    const handleCreateLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[handleCreateLink]": async ()=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].createLink();
                await refreshLinks();
                show({
                    variant: "success",
                    title: "Link created",
                    description: "A new referral link is now active."
                });
            } catch (err) {
                const message = getErrorMessage(err);
                show({
                    variant: "destructive",
                    title: "Failed to create link",
                    description: message
                });
            }
        }
    }["useAffiliateDashboard.useCallback[handleCreateLink]"], [
        refreshLinks,
        show
    ]);
    const handleRotateLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[handleRotateLink]": async (token)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].rotate(token);
                await refreshLinks();
                show({
                    variant: "success",
                    title: "Link rotated",
                    description: "The referral link has been refreshed."
                });
            } catch (err) {
                const message = getErrorMessage(err);
                show({
                    variant: "destructive",
                    title: "Failed to rotate",
                    description: message
                });
            }
        }
    }["useAffiliateDashboard.useCallback[handleRotateLink]"], [
        refreshLinks,
        show
    ]);
    const handleDeactivateLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[handleDeactivateLink]": async (token)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].deactivate(token);
                await refreshLinks();
                show({
                    variant: "success",
                    title: "Link deactivated",
                    description: "The referral link is now inactive."
                });
            } catch (err) {
                const message = getErrorMessage(err);
                show({
                    variant: "destructive",
                    title: "Failed to deactivate",
                    description: message
                });
            }
        }
    }["useAffiliateDashboard.useCallback[handleDeactivateLink]"], [
        refreshLinks,
        show
    ]);
    const handleCopyLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[handleCopyLink]": async (url)=>{
            try {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                    await navigator.clipboard.writeText(url);
                    show({
                        variant: "success",
                        title: "Copied",
                        description: "Referral link copied to clipboard."
                    });
                } else {
                    throw new Error("Clipboard API unavailable");
                }
            } catch (err) {
                const message = getErrorMessage(err);
                show({
                    variant: "destructive",
                    title: "Copy failed",
                    description: message
                });
            }
        }
    }["useAffiliateDashboard.useCallback[handleCopyLink]"], [
        show
    ]);
    const handleRequestPayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAffiliateDashboard.useCallback[handleRequestPayout]": async ()=>{
            setRequestingPayout(true);
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AffiliateAPI"].requestPayout(payoutMonth || undefined, payoutPercent || 5);
                show({
                    variant: "success",
                    title: "Payout requested",
                    description: "Finance will review your request shortly."
                });
                await Promise.all([
                    refreshDashboard(),
                    refreshPayouts()
                ]);
            } catch (err) {
                const message = getErrorMessage(err);
                show({
                    variant: "destructive",
                    title: "Request failed",
                    description: message
                });
            } finally{
                setRequestingPayout(false);
            }
        }
    }["useAffiliateDashboard.useCallback[handleRequestPayout]"], [
        payoutMonth,
        payoutPercent,
        refreshDashboard,
        refreshPayouts,
        show
    ]);
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAffiliateDashboard.useMemo[actions]": ()=>({
                refresh,
                createLink: handleCreateLink,
                deactivate: handleDeactivateLink,
                rotate: handleRotateLink,
                copyLink: handleCopyLink,
                requestPayout: handleRequestPayout
            })
    }["useAffiliateDashboard.useMemo[actions]"], [
        refresh,
        handleCreateLink,
        handleDeactivateLink,
        handleRotateLink,
        handleCopyLink,
        handleRequestPayout
    ]);
    return {
        loading,
        error,
        stats,
        dash,
        links,
        payouts,
        canCreateMore,
        monthLabel,
        payoutMonth,
        payoutPercent,
        requestingPayout,
        setPayoutMonth: setPayoutMonthState,
        setPayoutPercent: setPayoutPercentState,
        actions
    };
}
_s(useAffiliateDashboard, "c/lsJGsS+N0sI6GNR1cthEDsupQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AffiliateDashboardProvider",
    ()=>AffiliateDashboardProvider,
    "useAffiliateDashboardContext",
    ()=>useAffiliateDashboardContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_hooks$2f$use$2d$affiliate$2d$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(dashboard)/dashboard/affiliate/_hooks/use-affiliate-dashboard.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AffiliateDashboardContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AffiliateDashboardProvider(param) {
    let { children } = param;
    _s();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_hooks$2f$use$2d$affiliate$2d$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAffiliateDashboard"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AffiliateDashboardContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_s(AffiliateDashboardProvider, "YNybtVMu82fADrSobzazEFIhChM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_hooks$2f$use$2d$affiliate$2d$dashboard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAffiliateDashboard"]
    ];
});
_c = AffiliateDashboardProvider;
function useAffiliateDashboardContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AffiliateDashboardContext);
    if (!context) {
        throw new Error("useAffiliateDashboardContext must be used within AffiliateDashboardProvider");
    }
    return context;
}
_s1(useAffiliateDashboardContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AffiliateDashboardProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GenerateLinkPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as LinkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pointer$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pointer.js [app-client] (ecmascript) <export default as Pointer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function GenerateLinkPage() {
    _s();
    const { links, canCreateMore, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAffiliateDashboardContext"])();
    const [refreshing, setRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const createLinkLabel = canCreateMore ? "Generate referral link" : "Link limit reached";
    const activeLinks = links.filter((link)=>link.active).length;
    async function refreshAll() {
        setRefreshing(true);
        try {
            await actions.refresh();
        } finally{
            setRefreshing(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 pt-2 sm:flex-row sm:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>{
                            void actions.createLink();
                        },
                        disabled: !canCreateMore,
                        className: "group h-12 cursor-pointer rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 px-7 text-sm font-semibold text-white shadow-[0_18px_55px_-30px_rgba(16,185,129,0.7)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-35px_rgba(16,185,129,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mr-2 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/15 text-white transition group-hover:scale-105",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pointer$3e$__["Pointer"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinkIcon$3e$__["LinkIcon"], {
                                className: "mr-2 h-4 w-4 transition-transform group-hover:-rotate-6"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            createLinkLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: refreshAll,
                        variant: "outline",
                        disabled: refreshing,
                        className: "h-11 cursor-pointer rounded-2xl border-white/30 bg-white/5 px-5 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white/15 disabled:cursor-wait",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            " ",
                            refreshing ? "Refreshing..." : "Refresh data"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-emerald-100/70",
                children: [
                    activeLinks,
                    " of 2 active links in use · ",
                    canCreateMore ? "Generate a new link to start sharing" : "Deactivate one to free a slot"
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 space-y-3",
                children: links.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-emerald-100/70",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinkIcon$3e$__["LinkIcon"], {
                            className: "h-8 w-8 text-emerald-300"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "No referral links yet. Generate one to start sharing."
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, this) : links.map((link)=>{
                    const statusClass = link.active ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-200/30 text-slate-200";
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "flex items-center gap-2 text-sm font-semibold text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinkIcon$3e$__["LinkIcon"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                                lineNumber: 70,
                                                columnNumber: 21
                                            }, this),
                                            " Referral link",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ".concat(statusClass),
                                                children: link.active ? "Active" : "Inactive"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                                lineNumber: 71,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                        lineNumber: 69,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "break-all font-mono text-xs text-emerald-100/80",
                                        children: link.url
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                        lineNumber: 77,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                lineNumber: 68,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>{
                                            void actions.copyLink(link.url);
                                        },
                                        className: "cursor-pointer rounded-xl border-emerald-300/30 bg-emerald-500/10 text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-500/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                className: "mr-1.5 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                                lineNumber: 88,
                                                columnNumber: 21
                                            }, this),
                                            " Copy"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>{
                                            void actions.deactivate(link.token);
                                        },
                                        disabled: !link.active,
                                        className: "cursor-pointer rounded-xl border-rose-300/30 bg-rose-500/10 text-rose-100 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50",
                                        children: "Deactivate"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>{
                                            void actions.rotate(link.token);
                                        },
                                        className: "cursor-pointer rounded-xl border-cyan-300/30 bg-cyan-500/10 text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-500/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "mr-1.5 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                                lineNumber: 109,
                                                columnNumber: 21
                                            }, this),
                                            " Rotate"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                                lineNumber: 79,
                                columnNumber: 17
                            }, this)
                        ]
                    }, link.token, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                        lineNumber: 64,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/affiliate/generate-link/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(GenerateLinkPage, "RoEeahSa3JiY/nxIqwyfUmjYmMM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAffiliateDashboardContext"]
    ];
});
_c = GenerateLinkPage;
var _c;
__turbopack_context__.k.register(_c, "GenerateLinkPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Copy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "14",
            height: "14",
            x: "8",
            y: "8",
            rx: "2",
            ry: "2",
            key: "17jyea"
        }
    ],
    [
        "path",
        {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
            key: "zix9uf"
        }
    ]
];
const Copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("copy", __iconNode);
;
 //# sourceMappingURL=copy.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pointer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Pointer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M22 14a8 8 0 0 1-8 8",
            key: "56vcr3"
        }
    ],
    [
        "path",
        {
            d: "M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
            key: "1agjmk"
        }
    ],
    [
        "path",
        {
            d: "M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1",
            key: "wdbh2u"
        }
    ],
    [
        "path",
        {
            d: "M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10",
            key: "1ibuk9"
        }
    ],
    [
        "path",
        {
            d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
            key: "g6ys72"
        }
    ]
];
const Pointer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("pointer", __iconNode);
;
 //# sourceMappingURL=pointer.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pointer.js [app-client] (ecmascript) <export default as Pointer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Pointer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pointer.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>RefreshCw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
            key: "v9h5vc"
        }
    ],
    [
        "path",
        {
            d: "M21 3v5h-5",
            key: "1q7to0"
        }
    ],
    [
        "path",
        {
            d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
            key: "3uifl3"
        }
    ],
    [
        "path",
        {
            d: "M8 16H3v5",
            key: "1cv678"
        }
    ]
];
const RefreshCw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("refresh-cw", __iconNode);
;
 //# sourceMappingURL=refresh-cw.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RefreshCw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$545$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.545.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_449fab06._.js.map