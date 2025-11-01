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
"[project]/app/(dashboard)/dashboard/owner/agent/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OwnerAgentPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const ROLE_LABELS = {
    user: "You",
    owner: "You",
    assistant: "Assistant"
};
const ROLE_TONE = {
    user: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
    owner: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
    assistant: "bg-white/90 border border-white/40 text-slate-900 backdrop-blur"
};
function normalizeThreadTitle(thread, index) {
    const raw = (thread.title || "").trim();
    if (raw) return raw;
    return "Conversation #".concat(index + 1);
}
function parseAssistantPayload(content) {
    if (!content) return null;
    try {
        return JSON.parse(content);
    } catch (e) {
        if (content.startsWith("{") && content.includes("'")) {
            try {
                const sanitized = content.replace(/'/g, '"');
                return JSON.parse(sanitized);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
}
function AssistantContent(param) {
    let { payload } = param;
    if (!payload || typeof payload !== "object") {
        return null;
    }
    const rows = Array.isArray(payload.rows) ? payload.rows : null;
    const hasRows = rows && rows.length > 0;
    const remaining = MAX_PROMPT_LENGTH - messageDraft.length;
    const isOverLimit = remaining < 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3 text-sm",
        children: [
            payload.intent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 rounded border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-semibold uppercase tracking-wide",
                        children: "Intent"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium",
                        children: String(payload.intent)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this),
            payload.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700",
                children: [
                    "Unable to run the analysis at the moment. (",
                    String(payload.error),
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this),
            payload.answer && typeof payload.answer === "string" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "whitespace-pre-wrap leading-relaxed text-gray-800",
                children: payload.answer
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this),
            hasRows ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full divide-y divide-gray-200 text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: Object.keys(rows[0]).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-3 py-2 text-left font-semibold uppercase tracking-wide text-gray-500",
                                        children: key
                                    }, key, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-gray-100 bg-white",
                            children: rows.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: Object.keys(rows[0]).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2 text-gray-700",
                                            children: row[key] === null || row[key] === undefined ? "—" : typeof row[key] === "number" ? row[key].toLocaleString("en-US") : String(row[key])
                                        }, key, false, {
                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 21
                                        }, this))
                                }, idx, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                    lineNumber: 91,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this) : null,
            !payload.error && rows && rows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600",
                children: "The query completed but returned no rows."
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c = AssistantContent;
function OwnerAgentPage() {
    _s();
    const { show } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [tenantId, setTenantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [threads, setThreads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [threadsLoading, setThreadsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedThreadId, setSelectedThreadId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messagesLoading, setMessagesLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messageDraft1, setMessageDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [creatingThread, setCreatingThread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assistantThinking, setAssistantThinking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bootstrapLoading, setBootstrapLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [globalError, setGlobalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selectedThread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OwnerAgentPage.useMemo[selectedThread]": ()=>threads.find({
                "OwnerAgentPage.useMemo[selectedThread]": (thread)=>thread.id === selectedThreadId
            }["OwnerAgentPage.useMemo[selectedThread]"]) || null
    }["OwnerAgentPage.useMemo[selectedThread]"], [
        threads,
        selectedThreadId
    ]);
    const loadThreads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OwnerAgentPage.useCallback[loadThreads]": async (tid)=>{
            setThreadsLoading(true);
            try {
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].listThreads(tid);
                const safe = Array.isArray(data) ? data : [];
                setThreads(safe);
                if (safe.length === 0) {
                    setSelectedThreadId(null);
                }
                setGlobalError(null);
                return safe;
            } catch (error) {
                setThreads([]);
                setSelectedThreadId(null);
                setGlobalError((error === null || error === void 0 ? void 0 : error.message) || "Unable to load conversations");
                return [];
            } finally{
                setThreadsLoading(false);
            }
        }
    }["OwnerAgentPage.useCallback[loadThreads]"], []);
    const loadMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OwnerAgentPage.useCallback[loadMessages]": async (tid, threadId)=>{
            setMessagesLoading(true);
            try {
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].listMessages(tid, threadId);
                const safe = Array.isArray(data) ? data : [];
                setMessages(safe);
            } catch (error) {
                show({
                    variant: "destructive",
                    title: "Failed to load thread",
                    description: (error === null || error === void 0 ? void 0 : error.message) || "Unable to fetch messages."
                });
            } finally{
                setMessagesLoading(false);
            }
        }
    }["OwnerAgentPage.useCallback[loadMessages]"], [
        show
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OwnerAgentPage.useEffect": ()=>{
            let active = true;
            async function bootstrap() {
                setBootstrapLoading(true);
                try {
                    const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthAPI"].me();
                    if (!active) return;
                    const tid = (profile === null || profile === void 0 ? void 0 : profile.tenant_id) || null;
                    if (!tid) {
                        setGlobalError("You do not have an active tenant to chat against.");
                        return;
                    }
                    setTenantId(tid);
                    await loadThreads(tid);
                } catch (error) {
                    if (!active) return;
                    setGlobalError((error === null || error === void 0 ? void 0 : error.message) || "Unable to load owner profile.");
                } finally{
                    if (active) setBootstrapLoading(false);
                }
            }
            bootstrap();
            return ({
                "OwnerAgentPage.useEffect": ()=>{
                    active = false;
                }
            })["OwnerAgentPage.useEffect"];
        }
    }["OwnerAgentPage.useEffect"], [
        loadThreads
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OwnerAgentPage.useEffect": ()=>{
            if (selectedThreadId && !threads.some({
                "OwnerAgentPage.useEffect": (thread)=>thread.id === selectedThreadId
            }["OwnerAgentPage.useEffect"])) {
                var _threads_;
                var _threads__id;
                setSelectedThreadId((_threads__id = (_threads_ = threads[0]) === null || _threads_ === void 0 ? void 0 : _threads_.id) !== null && _threads__id !== void 0 ? _threads__id : null);
            } else if (!selectedThreadId && threads.length > 0) {
                setSelectedThreadId(threads[0].id);
            }
        }
    }["OwnerAgentPage.useEffect"], [
        threads,
        selectedThreadId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OwnerAgentPage.useEffect": ()=>{
            if (!tenantId || !selectedThreadId) {
                setMessages([]);
                return;
            }
            loadMessages(tenantId, selectedThreadId);
        }
    }["OwnerAgentPage.useEffect"], [
        tenantId,
        selectedThreadId,
        loadMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OwnerAgentPage.useEffect": ()=>{
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    }["OwnerAgentPage.useEffect"], [
        messages,
        assistantThinking
    ]);
    const handleCreateThread = async ()=>{
        if (!tenantId) return;
        setCreatingThread(true);
        try {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].createThread(tenantId);
            await loadThreads(tenantId);
            if (created === null || created === void 0 ? void 0 : created.id) {
                setSelectedThreadId(created.id);
            }
            setMessages([]);
        } catch (error) {
            show({
                variant: "destructive",
                title: "Could not create thread",
                description: (error === null || error === void 0 ? void 0 : error.message) || "Please try again."
            });
        } finally{
            setCreatingThread(false);
        }
    };
    const MAX_PROMPT_LENGTH1 = 300;
    const remaining = MAX_PROMPT_LENGTH1 - messageDraft1.length;
    const isOverLimit = remaining < 0;
    const handleSendMessage = async ()=>{
        if (!tenantId) return;
        const prompt = messageDraft1.trim();
        if (!prompt) return;
        if (prompt.length > MAX_PROMPT_LENGTH1) {
            show({
                variant: "destructive",
                title: "Prompt too long",
                description: "Limit is ".concat(MAX_PROMPT_LENGTH1, " characters. Please shorten your question.")
            });
            return;
        }
        setMessageDraft("");
        setSending(true);
        setAssistantThinking(true);
        try {
            let threadIdToUse = selectedThreadId;
            if (!threadIdToUse) {
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].createThread(tenantId);
                const refreshed = await loadThreads(tenantId);
                var _ref;
                threadIdToUse = (_ref = created && typeof created.id === "number" ? created.id : undefined) !== null && _ref !== void 0 ? _ref : refreshed.length > 0 ? refreshed[0].id : undefined;
                if (threadIdToUse) {
                    setSelectedThreadId(threadIdToUse);
                }
            }
            if (!threadIdToUse) {
                throw new Error("Unable to start a new conversation");
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].sendMessage(tenantId, threadIdToUse, prompt);
            await loadMessages(tenantId, threadIdToUse);
            await loadThreads(tenantId);
        } catch (error) {
            show({
                variant: "destructive",
                title: "Message failed",
                description: (error === null || error === void 0 ? void 0 : error.message) || "Unable to send message."
            });
            setMessageDraft(prompt);
        } finally{
            setSending(false);
            setAssistantThinking(false);
        }
    };
    const handleComposerKeyDown = (event)=>{
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };
    const isLoadingThreads = threadsLoading || bootstrapLoading;
    const isLoadingMessages = messagesLoading || bootstrapLoading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_28px_120px_-60px_rgba(16,185,129,0.75)] backdrop-blur-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-semibold leading-tight text-white",
                        children: "Zemen AI Assistant"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "max-w-3xl text-sm leading-relaxed text-emerald-100/80",
                        children: "Ask questions about sales, inventory, and staff performance. The assistant runs read-only analytics on your tenant data and summarises the results for quick insight."
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this),
            globalError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700",
                children: globalError
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 341,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-[320px,1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-5 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_24px_90px_-50px_rgba(14,165,233,0.45)] backdrop-blur-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-emerald-100/80",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100",
                                        children: "Conversations"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 349,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                variant: "outline",
                                                onClick: ()=>setShowHistory((prev)=>!prev),
                                                children: showHistory ? "Hide history" : "Show history"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                variant: "outline",
                                                onClick: ()=>tenantId && loadThreads(tenantId),
                                                disabled: !tenantId || isLoadingThreads,
                                                children: "Refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleCreateThread,
                                    disabled: !tenantId || creatingThread,
                                    children: creatingThread ? "Creating…" : "Start new conversation"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 368,
                                columnNumber: 11
                            }, this),
                            showHistory ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-px w-full bg-gray-100"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this),
                                    isLoadingThreads ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: Array.from({
                                            length: 5
                                        }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-12 w-full"
                                            }, index, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 379,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 377,
                                        columnNumber: 17
                                    }, this) : threads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-white/15 bg-white/5 p-4 text-center text-sm text-emerald-100/80",
                                        children: "No conversations yet. Start a new one to ask the assistant anything about your pharmacy."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 383,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: threads.map((thread, index)=>{
                                            const title = normalizeThreadTitle(thread, index);
                                            const isActive = thread.id === selectedThreadId;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setSelectedThreadId(thread.id),
                                                className: "group w-full rounded-2xl border px-3 py-2 text-left text-sm font-medium transition ".concat(isActive ? "border-transparent bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-sky-500/25 text-white shadow-lg" : "border-white/15 bg-white/5 text-emerald-100/80 hover:border-emerald-200/50 hover:bg-white/10"),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-semibold text-white/90",
                                                        children: title
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs uppercase tracking-[0.3em] text-emerald-100/60",
                                                        children: [
                                                            "Thread #",
                                                            thread.id
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, thread.id, true, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 392,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 387,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-white/15 bg-white/5 p-4 text-center text-sm text-emerald-100/80",
                                children: "Tap “Show history” to browse your previous conversations."
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 411,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-5 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.7)] backdrop-blur-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100",
                                                children: selectedThread ? normalizeThreadTitle(selectedThread, 0) : "Conversation"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 420,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "sm",
                                                    variant: "outline",
                                                    onClick: ()=>tenantId && selectedThreadId && loadMessages(tenantId, selectedThreadId),
                                                    disabled: !tenantId || !selectedThreadId || isLoadingMessages,
                                                    children: "Refresh"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 419,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-emerald-100/70",
                                        children: "The assistant uses safe, read-only queries. Ask for sales summaries, inventory gaps, or staff performance insights."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 418,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-hidden rounded-3xl border border-white/15 bg-white/5",
                                children: isLoadingMessages ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 space-y-3",
                                    children: Array.from({
                                        length: 5
                                    }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-16 w-full"
                                        }, index, false, {
                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                            lineNumber: 444,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                    lineNumber: 442,
                                    columnNumber: 15
                                }, this) : !selectedThreadId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-full items-center justify-center p-6 text-sm text-emerald-100/70",
                                    children: "Select a conversation to view messages."
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                    lineNumber: 448,
                                    columnNumber: 15
                                }, this) : messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-full items-center justify-center p-6 text-sm text-emerald-100/70",
                                    children: "Ask your first question to begin."
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                    lineNumber: 452,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-[55vh] flex-col gap-3 overflow-y-auto p-4 pr-6",
                                    children: [
                                        messages.map((message)=>{
                                            const roleClass = ROLE_TONE[message.role] || ROLE_TONE.assistant;
                                            const label = ROLE_LABELS[message.role] || message.role;
                                            const assistantPayload = message.role === "assistant" ? parseAssistantPayload(message.content) : null;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex ".concat(message.role === "assistant" ? "justify-start" : "justify-end"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-w-xl rounded-2xl px-3 py-2 text-sm shadow ".concat(roleClass),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-1 text-xs font-semibold uppercase tracking-wide opacity-70",
                                                            children: label
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                            lineNumber: 472,
                                                            columnNumber: 25
                                                        }, this),
                                                        assistantPayload ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssistantContent, {
                                                            payload: assistantPayload
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                            lineNumber: 476,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "whitespace-pre-wrap leading-relaxed",
                                                            children: message.content
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                            lineNumber: 478,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                    lineNumber: 469,
                                                    columnNumber: 23
                                                }, this)
                                            }, message.id, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 463,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        assistantThinking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-start",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "max-w-xs rounded-2xl border border-white/20 bg-white/80 px-3 py-2 text-sm text-emerald-800 shadow",
                                                children: "Assistant is analysing your data…"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 488,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                            lineNumber: 487,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: messagesEndRef
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                            lineNumber: 493,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                    lineNumber: 456,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 440,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: "flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Ask a question"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 502,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tracking-normal ".concat(isOverLimit ? "text-red-300" : "text-emerald-200"),
                                                children: remaining >= 0 ? "".concat(remaining, " characters left") : "".concat(Math.abs(remaining), " over limit")
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                                lineNumber: 503,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "min-h-[120px] w-full resize-y rounded-2xl border border-white/15 bg-white/10 p-3 text-sm text-emerald-100/90 shadow-inner backdrop-blur focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-200/40",
                                        placeholder: "e.g. Show me the top selling medicines this week",
                                        value: messageDraft1,
                                        maxLength: MAX_PROMPT_LENGTH1 + 100,
                                        onChange: (event)=>setMessageDraft(event.target.value),
                                        onKeyDown: handleComposerKeyDown
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 507,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleSendMessage,
                                        disabled: !tenantId || !selectedThreadId || sending || isOverLimit,
                                        children: sending ? "Sending…" : "Send"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                        lineNumber: 515,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                                lineNumber: 498,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/dashboard/owner/agent/page.tsx",
        lineNumber: 331,
        columnNumber: 5
    }, this);
}
_s(OwnerAgentPage, "G4Hfb4NDeCwFBQJkpNQI1QWoPqU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c1 = OwnerAgentPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "AssistantContent");
__turbopack_context__.k.register(_c1, "OwnerAgentPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_ceab8a88._.js.map