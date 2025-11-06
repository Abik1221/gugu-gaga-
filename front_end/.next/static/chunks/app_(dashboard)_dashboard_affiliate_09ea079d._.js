(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/app/(dashboard)/dashboard/affiliate/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AffiliateOverviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@playwright+test@1.56.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function AffiliateOverviewPage() {
    _s();
    const { stats, dash, monthLabel, payoutPercent, actions, canCreateMore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAffiliateDashboardContext"])();
    const highlightItems = [
        "You’re earning a ".concat(payoutPercent, "% commission rate this month."),
        "".concat(stats.referrals.toLocaleString(), " referred pharmacies are being tracked in real-time."),
        "".concat(formatCurrency(stats.paidPayout), " has already been paid out – keep sharing links to grow it.")
    ];
    const summaryCards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AffiliateOverviewPage.useMemo[summaryCards]": ()=>[
                {
                    title: "Current commission",
                    value: formatCurrency(stats.currentCommission),
                    description: "".concat(monthLabel, " projected payout")
                },
                {
                    title: "Pending review",
                    value: formatCurrency(stats.pendingPayout),
                    description: "Awaiting finance approval"
                },
                {
                    title: "Paid to date",
                    value: formatCurrency(stats.paidPayout),
                    description: "Lifetime transferred earnings"
                },
                {
                    title: "Active referrals",
                    value: stats.referrals.toLocaleString(),
                    description: "Pharmacies onboarded via your links"
                }
            ]
    }["AffiliateOverviewPage.useMemo[summaryCards]"], [
        monthLabel,
        stats.currentCommission,
        stats.paidPayout,
        stats.pendingPayout,
        stats.referrals
    ]);
    var _dash_tenants;
    const referredTenants = (_dash_tenants = dash === null || dash === void 0 ? void 0 : dash.tenants) !== null && _dash_tenants !== void 0 ? _dash_tenants : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$playwright$2b$test$40$1$2e$56$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "dashboard of affiliate"
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/affiliate/page.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(AffiliateOverviewPage, "y8jMke4CO1z7G/hC4KUYBA6XwhE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$dashboard$2f$affiliate$2f$_context$2f$affiliate$2d$dashboard$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAffiliateDashboardContext"]
    ];
});
_c = AffiliateOverviewPage;
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount || 0);
}
var _c;
__turbopack_context__.k.register(_c, "AffiliateOverviewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_%28dashboard%29_dashboard_affiliate_09ea079d._.js.map