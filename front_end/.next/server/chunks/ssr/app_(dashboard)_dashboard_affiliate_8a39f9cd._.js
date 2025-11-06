module.exports = [
"[project]/app/(dashboard)/dashboard/affiliate/_hooks/use-affiliate-dashboard.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAffiliateDashboard",
    ()=>useAffiliateDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-ssr] (ecmascript)");
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
    const source = data?.stats ?? data ?? {};
    const payouts = source?.payouts ?? {};
    return {
        currentCommission: toNumber(source.currentCommission ?? source.current_commission ?? source.current ?? source.amount ?? source.commission ?? 0),
        pendingPayout: toNumber(source.pendingPayout ?? source.pending_payout ?? source.pending ?? payouts.pending_total ?? payouts.pending ?? 0),
        paidPayout: toNumber(source.paidPayout ?? source.paid_payout ?? source.paid ?? payouts.paid_total ?? payouts.paid ?? 0),
        referrals: toNumber(source.referrals ?? source.total_referrals ?? source.affiliates ?? source.referrals_count ?? source.activated_referrals ?? 0)
    };
}
function normalizeLinks(payload) {
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.links) ? payload.links : [];
    return list.map((item)=>({
            token: String(item?.token ?? item?.code ?? ""),
            url: String(item?.url ?? item?.link ?? item?.register_url ?? ""),
            active: Boolean(item?.active ?? item?.is_active ?? item?.status === "active"),
            createdAt: item?.created_at ?? item?.createdAt ?? null
        })).filter((item)=>item.token && item.url);
}
function extractMonthLabel(data) {
    if (typeof data?.year === "number" && typeof data?.month === "number") {
        try {
            return new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric"
            }).format(new Date(data.year, data.month - 1));
        } catch  {
            return `${data.year}-${String(data.month).padStart(2, "0")}`;
        }
    }
    const month = data?.monthLabel ?? data?.month_label ?? data?.current_month_label ?? data?.stats?.month_label ?? null;
    if (month) return String(month);
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    }).format(new Date());
}
function extractPercent(data) {
    return toNumber(data?.percent ?? data?.commission_percent ?? data?.stats?.percent ?? data?.current_percent ?? 5);
}
function normalizePayout(item) {
    return {
        id: Number(item?.id ?? 0),
        month: item?.month ? String(item.month) : "",
        percent: toNumber(item?.percent ?? 0),
        amount: toNumber(item?.amount ?? 0),
        status: String(item?.status ?? "pending")
    };
}
function getErrorMessage(error) {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    try {
        return JSON.stringify(error);
    } catch  {
        return "Unexpected error";
    }
}
function useAffiliateDashboard() {
    const { show } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_STATS);
    const [dash, setDash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [links, setLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [payouts, setPayouts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [canCreateMore, setCanCreateMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [monthLabel, setMonthLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(extractMonthLabel(null));
    const [payoutMonth, setPayoutMonthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_MONTH);
    const [payoutPercent, setPayoutPercentState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(5);
    const [requestingPayout, setRequestingPayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const refreshLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].getLinks();
        const normalized = normalizeLinks(response);
        setLinks(normalized);
        const activeCount = normalized.filter((link)=>link.active).length;
        setCanCreateMore(activeCount < MAX_ACTIVE_LINKS);
    }, []);
    const refreshDashboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].dashboard();
        setStats(extractStats(response));
        const snapshot = response?.dash ?? response?.current_month ?? response?.summary ?? response?.stats?.current_month ?? response ?? null;
        setDash(snapshot ?? null);
        setMonthLabel(extractMonthLabel(response));
        const percent = extractPercent(response);
        const nextMonth = response?.next_payout_month ?? response?.payout_month ?? (typeof response?.year === "number" && typeof response?.month === "number" ? `${response.year}-${String(response.month).padStart(2, "0")}` : null);
        if (!hasInitialized.current) {
            setPayoutPercentState(percent > 0 ? percent : 5);
            setPayoutMonthState(typeof nextMonth === "string" && nextMonth ? nextMonth : DEFAULT_MONTH);
            hasInitialized.current = true;
        }
    }, []);
    const refreshPayouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].payouts();
        if (Array.isArray(response)) {
            setPayouts(response.map(normalizePayout));
        } else {
            setPayouts([]);
        }
    }, []);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
    }, [
        refreshDashboard,
        refreshLinks,
        refreshPayouts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        refresh();
    }, [
        refresh
    ]);
    const handleCreateLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].createLink();
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
    }, [
        refreshLinks,
        show
    ]);
    const handleRotateLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (token)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].rotate(token);
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
    }, [
        refreshLinks,
        show
    ]);
    const handleDeactivateLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (token)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].deactivate(token);
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
    }, [
        refreshLinks,
        show
    ]);
    const handleCopyLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (url)=>{
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
    }, [
        show
    ]);
    const handleRequestPayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setRequestingPayout(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateAPI"].requestPayout(payoutMonth || undefined, payoutPercent || 5);
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
    }, [
        payoutMonth,
        payoutPercent,
        refreshDashboard,
        refreshPayouts,
        show
    ]);
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            refresh,
            createLink: handleCreateLink,
            deactivate: handleDeactivateLink,
            rotate: handleRotateLink,
            copyLink: handleCopyLink,
            requestPayout: handleRequestPayout
        }), [
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
}),
"[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AffiliateDashboardProvider",
    ()=>AffiliateDashboardProvider,
    "useAffiliateDashboardContext",
    ()=>useAffiliateDashboardContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_hooks$2f$use$2d$affiliate$2d$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(dashboard)/dashboard/affiliate/_hooks/use-affiliate-dashboard.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const AffiliateDashboardContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AffiliateDashboardProvider({ children }) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_hooks$2f$use$2d$affiliate$2d$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAffiliateDashboard"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AffiliateDashboardContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
function useAffiliateDashboardContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AffiliateDashboardContext);
    if (!context) {
        throw new Error("useAffiliateDashboardContext must be used within AffiliateDashboardProvider");
    }
    return context;
}
}),
"[project]/app/(dashboard)/dashboard/affiliate/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AffiliateLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function AffiliateLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AffiliateDashboardProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/affiliate/layout.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_%28dashboard%29_dashboard_affiliate_8a39f9cd._.js.map