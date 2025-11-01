(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton,
    "TableSkeletonRows",
    ()=>TableSkeletonRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Skeleton(param) {
    let { className = "" } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-pulse bg-gray-200 rounded ".concat(className)
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 10
    }, this);
}
_c = Skeleton;
function TableSkeletonRows(param) {
    let { rows = 6, cols = 6 } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        children: Array.from({
            length: rows
        }).map((_, r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-t",
                children: Array.from({
                    length: cols
                }).map((__, c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-3 py-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
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
_c1 = TableSkeletonRows;
var _c, _c1;
__turbopack_context__.k.register(_c, "Skeleton");
__turbopack_context__.k.register(_c1, "TableSkeletonRows");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className = "", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ref: ref,
        className: "w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 " + className,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border border-white/20 bg-white/70 p-6 shadow-[0_20px_70px_-40px_rgba(16,185,129,0.65)] backdrop-blur-md", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-3 flex items-center justify-between gap-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-tight text-emerald-900", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm leading-relaxed text-slate-700", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c7 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 flex flex-wrap items-center justify-between gap-3", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 48,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c9 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardContent");
__turbopack_context__.k.register(_c8, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPharmaciesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const STATUS_SECTIONS = [
    {
        key: "pending_kyc",
        title: "Pending KYC"
    },
    {
        key: "awaiting_payment",
        title: "Awaiting Payment"
    },
    {
        key: "pending_verification",
        title: "Awaiting Verification"
    },
    {
        key: "active",
        title: "Active Pharmacies"
    },
    {
        key: "blocked",
        title: "Blocked / Rejected"
    }
];
const STATUS_TONE = {
    pending_kyc: "primary",
    awaiting_payment: "outline",
    pending_verification: "primary",
    active: "muted",
    blocked: "danger"
};
function generatePassword() {
    let length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 12;
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let result = "";
    for(let i = 0; i < length; i++){
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
}
function sortPharmacies(list) {
    return [
        ...list
    ].sort((a, b)=>{
        if (a.status_priority !== b.status_priority) {
            return a.status_priority - b.status_priority;
        }
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
    });
}
function formatDateTime(value) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
            ...options
        });
    } catch (e) {
        return value;
    }
}
function AdminPharmaciesPage() {
    _s();
    const { show } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedTenant, setSelectedTenant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingAction, setPendingAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [processing, setProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recentCredentials, setRecentCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [confirmOptions, setConfirmOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        issueTempPassword: false,
        tempPassword: ""
    });
    const handleDialogCancel = ()=>{
        setPendingAction(null);
        setConfirmOptions({
            issueTempPassword: false,
            tempPassword: ""
        });
    };
    function openAction(action) {
        setPendingAction(action);
        setConfirmOptions({
            issueTempPassword: false,
            tempPassword: ""
        });
    }
    async function handleCopyPassword(password) {
        try {
            await navigator.clipboard.writeText(password);
            show({
                variant: "success",
                title: "Copied",
                description: "Temporary password copied to clipboard"
            });
        } catch (err) {
            show({
                variant: "destructive",
                title: "Copy failed",
                description: (err === null || err === void 0 ? void 0 : err.message) || "Unable to copy password"
            });
        }
    }
    async function refresh() {
        let page = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
        setLoading(true);
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].pharmacies(page, 20, q);
            const sorted = sortPharmacies(data.items || []);
            setItems(sorted);
            setTotal(data.total || sorted.length);
            setError(null);
        } catch (e) {
            setError(e.message || "Failed to load pharmacies");
            show({
                variant: "destructive",
                title: "Error",
                description: e.message || "Failed to load"
            });
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminPharmaciesPage.useEffect": ()=>{
            refresh(1);
        }
    }["AdminPharmaciesPage.useEffect"], []);
    const grouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminPharmaciesPage.useMemo[grouped]": ()=>{
            const map = new Map();
            STATUS_SECTIONS.forEach({
                "AdminPharmaciesPage.useMemo[grouped]": (section)=>map.set(section.key, [])
            }["AdminPharmaciesPage.useMemo[grouped]"]);
            items.forEach({
                "AdminPharmaciesPage.useMemo[grouped]": (item)=>{
                    var _map_get, _ref;
                    const bucket = (_ref = (_map_get = map.get(item.status_category)) !== null && _map_get !== void 0 ? _map_get : map.get("blocked")) !== null && _ref !== void 0 ? _ref : [];
                    bucket.push(item);
                    map.set(item.status_category, bucket);
                }
            }["AdminPharmaciesPage.useMemo[grouped]"]);
            return map;
        }
    }["AdminPharmaciesPage.useMemo[grouped]"], [
        items
    ]);
    function updateTenant(tenantId, updater) {
        setItems((prev)=>{
            const updated = prev.map((item)=>item.tenant_id === tenantId ? updater(item) : item);
            return sortPharmacies(updated);
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            recentCredentials && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 rounded border border-emerald-500/60 bg-emerald-50 p-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-emerald-800",
                                children: "Temporary credentials issued"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-emerald-700",
                                children: [
                                    recentCredentials.name,
                                    " (tenant ",
                                    recentCredentials.tenantId,
                                    ") — share the password securely with the owner."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-emerald-900 text-sm",
                                children: recentCredentials.tempPassword
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                variant: "outline",
                                onClick: ()=>handleCopyPassword(recentCredentials.tempPassword),
                                children: "Copy"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                lineNumber: 192,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-semibold",
                                children: "Admin · Pharmacies"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        placeholder: "Search by name",
                                        value: q,
                                        onChange: (e)=>setQ(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>refresh(1),
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-64"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-red-600",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 216,
                        columnNumber: 11
                    }, this) : items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border rounded p-6 text-center text-gray-500",
                        children: "No pharmacies found."
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: STATUS_SECTIONS.map((section)=>{
                            const sectionItems = grouped.get(section.key) || [];
                            if (sectionItems.length === 0) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold",
                                                children: section.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                lineNumber: 227,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                    sectionItems.length,
                                                    " ",
                                                    sectionItems.length === 1 ? "pharmacy" : "pharmacies"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                lineNumber: 228,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                                        children: sectionItems.map((ph)=>{
                                            var _ph_pending_payment, _ph_subscription, _ph_subscription1, _ph_pending_payment1, _ph_pending_payment2, _ph_latest_payment, _ph_latest_payment1, _ph_latest_payment_status_toUpperCase, _ph_latest_payment_status, _ph_latest_payment2, _ph_latest_payment3, _ph_latest_payment4, _kyc_status;
                                            const isSelected = selectedTenant === ph.tenant_id;
                                            const statusTone = STATUS_TONE[ph.status_category] || "muted";
                                            const canApprove = ph.status_category === "pending_kyc" && !!ph.kyc_id;
                                            const canReject = ph.status_category === "pending_kyc" && !!ph.kyc_id;
                                            const pendingCode = ((_ph_pending_payment = ph.pending_payment) === null || _ph_pending_payment === void 0 ? void 0 : _ph_pending_payment.code) || ph.pending_payment_code;
                                            const canVerify = ph.status_category === "pending_verification" && !!pendingCode;
                                            const canRejectPayment = ph.status_category === "pending_verification" && !!pendingCode;
                                            const kyc = ph.kyc;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-shadow", isSelected && "border-blue-500 shadow-lg"),
                                                onClick: ()=>setSelectedTenant(ph.tenant_id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                        className: "flex flex-row items-start justify-between gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                                        className: "text-lg",
                                                                        children: ph.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 249,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-muted-foreground font-mono",
                                                                        children: ph.tenant_id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 250,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                lineNumber: 248,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2 justify-end",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusPill, {
                                                                        tone: statusTone,
                                                                        children: ph.status_label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 253,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    ph.owner_approved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusPill, {
                                                                        tone: "outline",
                                                                        children: "Owner approved"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 254,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Owner",
                                                                        value: ph.owner_email || "-",
                                                                        description: ph.owner_phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 259,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Created",
                                                                        value: formatDateTime(ph.created_at)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 260,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Address",
                                                                        value: ph.address || "-"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 261,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Subscription",
                                                                        value: ((_ph_subscription = ph.subscription) === null || _ph_subscription === void 0 ? void 0 : _ph_subscription.status) ? ph.subscription.status.replace("_", " ").toUpperCase() : "-",
                                                                        description: ((_ph_subscription1 = ph.subscription) === null || _ph_subscription1 === void 0 ? void 0 : _ph_subscription1.next_due_date) ? "Next due: ".concat(formatDateTime(ph.subscription.next_due_date, {
                                                                            dateStyle: "medium"
                                                                        })) : undefined
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 262,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    pendingCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Pending payment",
                                                                        value: pendingCode,
                                                                        description: ((_ph_pending_payment1 = ph.pending_payment) === null || _ph_pending_payment1 === void 0 ? void 0 : _ph_pending_payment1.submitted_at) ? "Submitted ".concat(formatDateTime((_ph_pending_payment2 = ph.pending_payment) === null || _ph_pending_payment2 === void 0 ? void 0 : _ph_pending_payment2.submitted_at)) : undefined
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 268,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Latest payment",
                                                                        value: ((_ph_latest_payment = ph.latest_payment) === null || _ph_latest_payment === void 0 ? void 0 : _ph_latest_payment.code) || ph.latest_payment_code || "—",
                                                                        description: ((_ph_latest_payment1 = ph.latest_payment) === null || _ph_latest_payment1 === void 0 ? void 0 : _ph_latest_payment1.status) ? "".concat((_ph_latest_payment2 = ph.latest_payment) === null || _ph_latest_payment2 === void 0 ? void 0 : (_ph_latest_payment_status = _ph_latest_payment2.status) === null || _ph_latest_payment_status === void 0 ? void 0 : (_ph_latest_payment_status_toUpperCase = _ph_latest_payment_status.toUpperCase) === null || _ph_latest_payment_status_toUpperCase === void 0 ? void 0 : _ph_latest_payment_status_toUpperCase.call(_ph_latest_payment_status)).concat(((_ph_latest_payment3 = ph.latest_payment) === null || _ph_latest_payment3 === void 0 ? void 0 : _ph_latest_payment3.submitted_at) ? " · ".concat(formatDateTime((_ph_latest_payment4 = ph.latest_payment) === null || _ph_latest_payment4 === void 0 ? void 0 : _ph_latest_payment4.submitted_at)) : "") : undefined
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 274,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    kyc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "rounded border p-3 space-y-2 bg-muted/50",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-sm font-semibold",
                                                                                children: "KYC Details"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                lineNumber: 281,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "grid gap-2 md:grid-cols-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "KYC Status",
                                                                                        value: ((_kyc_status = kyc.status) === null || _kyc_status === void 0 ? void 0 : _kyc_status.toUpperCase()) || "-"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 283,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "Submitted",
                                                                                        value: formatDateTime(kyc.submitted_at)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 284,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "ID Number",
                                                                                        value: kyc.id_number || "-"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 285,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "License Number",
                                                                                        value: kyc.pharmacy_license_number || "-"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 286,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    kyc.pharmacy_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "Registered Pharmacy Name",
                                                                                        value: kyc.pharmacy_name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 287,
                                                                                        columnNumber: 59
                                                                                    }, this),
                                                                                    kyc.pharmacy_address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "Registered Address",
                                                                                        value: kyc.pharmacy_address
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 288,
                                                                                        columnNumber: 62
                                                                                    }, this),
                                                                                    kyc.owner_email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "Owner Email (submitted)",
                                                                                        value: kyc.owner_email
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 289,
                                                                                        columnNumber: 57
                                                                                    }, this),
                                                                                    kyc.owner_phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                                        label: "Owner Phone (submitted)",
                                                                                        value: kyc.owner_phone
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                        lineNumber: 290,
                                                                                        columnNumber: 57
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                lineNumber: 282,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            kyc.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: [
                                                                                    "Notes: ",
                                                                                    kyc.notes
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                lineNumber: 292,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            kyc.license_document_available && kyc.application_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                variant: "outline",
                                                                                size: "sm",
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    const appId = kyc.application_id;
                                                                                    if (typeof appId !== "number") return;
                                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].downloadPharmacyLicense(appId).catch((err)=>show({
                                                                                            variant: "destructive",
                                                                                            title: "Download failed",
                                                                                            description: err.message || "Unable to download license"
                                                                                        }));
                                                                                },
                                                                                children: "Download License"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                                lineNumber: 294,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 280,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    ph.owner_password_hash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                                                        label: "Owner Password Hash",
                                                                        value: ph.owner_password_hash,
                                                                        masked: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 312,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-px bg-border"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        disabled: !canApprove,
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            openAction({
                                                                                type: "approve",
                                                                                tenantId: ph.tenant_id,
                                                                                kycId: ph.kyc_id,
                                                                                name: ph.name
                                                                            });
                                                                        },
                                                                        children: "Approve & Notify"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 319,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "outline",
                                                                        disabled: !canReject,
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            openAction({
                                                                                type: "reject",
                                                                                tenantId: ph.tenant_id,
                                                                                kycId: ph.kyc_id,
                                                                                name: ph.name
                                                                            });
                                                                        },
                                                                        children: "Reject"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 326,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "secondary",
                                                                        disabled: !canVerify,
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            openAction({
                                                                                type: "verify",
                                                                                tenantId: ph.tenant_id,
                                                                                name: ph.name,
                                                                                pendingPayment: ph.pending_payment
                                                                            });
                                                                        },
                                                                        children: "Verify Payment"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 334,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "outline",
                                                                        disabled: !canRejectPayment,
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            openAction({
                                                                                type: "rejectPayment",
                                                                                tenantId: ph.tenant_id,
                                                                                name: ph.name,
                                                                                pendingPayment: ph.pending_payment
                                                                            });
                                                                        },
                                                                        children: "Reject Payment"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                        lineNumber: 342,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                                lineNumber: 318,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, ph.id, true, {
                                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, section.key, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                lineNumber: 225,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            pendingAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmDialog, {
                action: pendingAction,
                loading: processing,
                onCancel: ()=>{
                    if (processing) return;
                    handleDialogCancel();
                },
                onConfirm: async ()=>{
                    if (processing) return;
                    setProcessing(true);
                    try {
                        switch(pendingAction.type){
                            case "approve":
                                {
                                    var _this;
                                    if (pendingAction.kycId == null) {
                                        show({
                                            variant: "destructive",
                                            title: "Missing application",
                                            description: "No KYC record found for this tenant."
                                        });
                                        setProcessing(false);
                                        return;
                                    }
                                    const trimmedPassword = confirmOptions.tempPassword.trim();
                                    if (confirmOptions.issueTempPassword && trimmedPassword && trimmedPassword.length < 6) {
                                        show({
                                            variant: "destructive",
                                            title: "Password too short",
                                            description: "Temporary passwords must be at least 6 characters."
                                        });
                                        setProcessing(false);
                                        return;
                                    }
                                    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].approvePharmacy(pendingAction.tenantId, pendingAction.kycId, {
                                        issue_temp_password: confirmOptions.issueTempPassword,
                                        temp_password: confirmOptions.issueTempPassword ? trimmedPassword || undefined : undefined
                                    });
                                    const generated = (_this = res) === null || _this === void 0 ? void 0 : _this.temporary_password;
                                    if (generated) {
                                        setRecentCredentials({
                                            tenantId: pendingAction.tenantId,
                                            name: pendingAction.name,
                                            tempPassword: generated
                                        });
                                    } else if (confirmOptions.issueTempPassword && trimmedPassword) {
                                        setRecentCredentials({
                                            tenantId: pendingAction.tenantId,
                                            name: pendingAction.name,
                                            tempPassword: trimmedPassword
                                        });
                                    } else {
                                        setRecentCredentials(null);
                                    }
                                    show({
                                        variant: "success",
                                        title: "Pharmacy approved",
                                        description: "".concat(pendingAction.name, " will be notified to pay")
                                    });
                                    refresh();
                                    break;
                                }
                            case "reject":
                                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].rejectPharmacy(pendingAction.tenantId, pendingAction.kycId);
                                show({
                                    variant: "success",
                                    title: "Pharmacy rejected",
                                    description: pendingAction.name
                                });
                                refresh();
                                break;
                            case "verify":
                                {
                                    var _pendingAction_pendingPayment;
                                    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].verifyPayment(pendingAction.tenantId, ((_pendingAction_pendingPayment = pendingAction.pendingPayment) === null || _pendingAction_pendingPayment === void 0 ? void 0 : _pendingAction_pendingPayment.code) || undefined);
                                    show({
                                        variant: "success",
                                        title: "Payment verified",
                                        description: "".concat(pendingAction.name, " notified")
                                    });
                                    updateTenant(pendingAction.tenantId, (prev)=>{
                                        var _prev_subscription, _pendingAction_pendingPayment, _prev_latest_payment, _pendingAction_pendingPayment1, _prev_latest_payment1, _pendingAction_pendingPayment2, _pendingAction_pendingPayment3;
                                        return {
                                            ...prev,
                                            status_category: "active",
                                            status_label: "Active",
                                            status_priority: 40,
                                            subscription: {
                                                ...prev.subscription || {},
                                                blocked: false,
                                                status: "active",
                                                next_due_date: (res === null || res === void 0 ? void 0 : res.next_due_date) || ((_prev_subscription = prev.subscription) === null || _prev_subscription === void 0 ? void 0 : _prev_subscription.next_due_date) || null
                                            },
                                            pending_payment: null,
                                            pending_payment_code: null,
                                            pending_payment_submitted_at: null,
                                            latest_payment: {
                                                code: ((_pendingAction_pendingPayment = pendingAction.pendingPayment) === null || _pendingAction_pendingPayment === void 0 ? void 0 : _pendingAction_pendingPayment.code) || (res === null || res === void 0 ? void 0 : res.payment_code) || ((_prev_latest_payment = prev.latest_payment) === null || _prev_latest_payment === void 0 ? void 0 : _prev_latest_payment.code) || prev.latest_payment_code,
                                                status: "verified",
                                                submitted_at: ((_pendingAction_pendingPayment1 = pendingAction.pendingPayment) === null || _pendingAction_pendingPayment1 === void 0 ? void 0 : _pendingAction_pendingPayment1.submitted_at) || ((_prev_latest_payment1 = prev.latest_payment) === null || _prev_latest_payment1 === void 0 ? void 0 : _prev_latest_payment1.submitted_at) || prev.latest_payment_submitted_at,
                                                verified_at: new Date().toISOString()
                                            },
                                            latest_payment_code: ((_pendingAction_pendingPayment2 = pendingAction.pendingPayment) === null || _pendingAction_pendingPayment2 === void 0 ? void 0 : _pendingAction_pendingPayment2.code) || (res === null || res === void 0 ? void 0 : res.payment_code) || prev.latest_payment_code,
                                            latest_payment_status: "verified",
                                            latest_payment_submitted_at: ((_pendingAction_pendingPayment3 = pendingAction.pendingPayment) === null || _pendingAction_pendingPayment3 === void 0 ? void 0 : _pendingAction_pendingPayment3.submitted_at) || prev.latest_payment_submitted_at,
                                            latest_payment_verified_at: new Date().toISOString()
                                        };
                                    });
                                    break;
                                }
                            case "rejectPayment":
                                var _pendingAction_pendingPayment1;
                                await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminAPI"].rejectPayment(pendingAction.tenantId, ((_pendingAction_pendingPayment1 = pendingAction.pendingPayment) === null || _pendingAction_pendingPayment1 === void 0 ? void 0 : _pendingAction_pendingPayment1.code) || undefined);
                                show({
                                    variant: "success",
                                    title: "Payment rejected",
                                    description: "".concat(pendingAction.name, " informed to retry")
                                });
                                refresh();
                                break;
                        }
                        handleDialogCancel();
                    } catch (err) {
                        show({
                            variant: "destructive",
                            title: "Action failed",
                            description: (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong"
                        });
                    } finally{
                        setProcessing(false);
                    }
                },
                options: confirmOptions,
                setOptions: (opts)=>setConfirmOptions(opts)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                lineNumber: 363,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(AdminPharmaciesPage, "f6Sj48JhglXym1OQWMo2WVgxEU4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = AdminPharmaciesPage;
function InfoRow(param) {
    let { label, value, description, className, masked } = param;
    _s1();
    const [showValue, setShowValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!masked);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("space-y-1 rounded border p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs uppercase tracking-wide text-muted-foreground",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this),
                    masked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "text-xs text-blue-600 underline",
                        onClick: ()=>setShowValue((prev)=>!prev),
                        children: showValue ? "Hide" : "Show"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                        lineNumber: 467,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                lineNumber: 464,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm font-medium break-all",
                children: masked && !showValue ? "••••••••" : value
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-muted-foreground",
                children: description
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                lineNumber: 475,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
        lineNumber: 463,
        columnNumber: 5
    }, this);
}
_s1(InfoRow, "u2LiOxbDtASaXtyUTPOxFxvF4Fw=");
_c1 = InfoRow;
function StatusPill(param) {
    let { children, tone = "primary" } = param;
    const styles = tone === "primary" ? "bg-blue-100 text-blue-700" : tone === "danger" ? "bg-red-100 text-red-700" : tone === "outline" ? "border border-muted-foreground/40 text-muted-foreground" : "bg-muted text-muted-foreground";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-2 py-0.5 text-xs font-medium", styles),
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
        lineNumber: 489,
        columnNumber: 10
    }, this);
}
_c2 = StatusPill;
function ConfirmDialog(param) {
    let { action, onConfirm, onCancel, loading, options, setOptions } = param;
    const copy = {
        approve: {
            title: "Approve pharmacy",
            description: "Are you sure you want to approve ".concat(action.name, " and notify them to pay?"),
            confirm: "Yes, approve"
        },
        reject: {
            title: "Reject pharmacy",
            description: "Reject ".concat(action.name, "'s application? They will be notified immediately."),
            confirm: "Yes, reject"
        },
        verify: {
            title: "Verify payment",
            description: "Confirm that ".concat(action.name, " has paid and unblock their subscription?"),
            confirm: "Yes, verify"
        },
        rejectPayment: {
            title: "Reject payment",
            description: "Reject ".concat(action.name, "'s submitted payment and ask them to retry?"),
            confirm: "Yes, reject payment"
        }
    };
    const meta = copy[action.type];
    const paymentDetails = action.pendingPayment;
    var _options_tempPassword;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md rounded-lg bg-white p-6 shadow-xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg font-semibold",
                    children: meta.title
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                    lineNumber: 537,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-sm text-muted-foreground",
                    children: meta.description
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                    lineNumber: 538,
                    columnNumber: 9
                }, this),
                paymentDetails && (action.type === "verify" || action.type === "rejectPayment") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 rounded border bg-muted/30 p-3 text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-medium text-sm mb-1",
                            children: "Pending payment details"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 541,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Code:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 542,
                                    columnNumber: 51
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono",
                                    children: paymentDetails.code
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 542,
                                    columnNumber: 70
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 542,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Submitted:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 51
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: formatDateTime(paymentDetails.submitted_at)
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 75
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 543,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                    lineNumber: 540,
                    columnNumber: 11
                }, this),
                action.type === "approve" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 space-y-3 border rounded bg-muted/30 p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium",
                                    children: "Issue temporary password"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: Boolean(options.issueTempPassword),
                                    onChange: (e)=>setOptions({
                                            ...options,
                                            issueTempPassword: e.target.checked
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 550,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 548,
                            columnNumber: 13
                        }, this),
                        options.issueTempPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs uppercase tracking-wide text-muted-foreground",
                                    htmlFor: "temp-password-input",
                                    children: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 558,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "temp-password-input",
                                    type: "text",
                                    value: (_options_tempPassword = options.tempPassword) !== null && _options_tempPassword !== void 0 ? _options_tempPassword : "",
                                    onChange: (e)=>setOptions({
                                            ...options,
                                            tempPassword: e.target.value
                                        }),
                                    className: "w-full rounded border border-border px-2 py-1 text-sm",
                                    placeholder: "Auto-generate if left blank"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 559,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "text-xs text-blue-600 underline",
                                    onClick: ()=>setOptions({
                                            ...options,
                                            tempPassword: generatePassword()
                                        }),
                                    children: "Generate strong password"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                                    lineNumber: 567,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 557,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                    lineNumber: 547,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 flex justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: onCancel,
                            disabled: loading,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 579,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: onConfirm,
                            disabled: loading,
                            children: loading ? "Processing..." : meta.confirm
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                            lineNumber: 582,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
                    lineNumber: 578,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
            lineNumber: 536,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/dashboard/admin/pharmacies/page.tsx",
        lineNumber: 535,
        columnNumber: 5
    }, this);
}
_c3 = ConfirmDialog;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "AdminPharmaciesPage");
__turbopack_context__.k.register(_c1, "InfoRow");
__turbopack_context__.k.register(_c2, "StatusPill");
__turbopack_context__.k.register(_c3, "ConfirmDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_de7d32a2._.js.map