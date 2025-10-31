(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/offline/queue.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addOfflineRequest",
    ()=>addOfflineRequest,
    "clearOfflineRequests",
    ()=>clearOfflineRequests,
    "getOfflineQueueSummary",
    ()=>getOfflineQueueSummary,
    "listOfflineRequests",
    ()=>listOfflineRequests,
    "queueRequest",
    ()=>queueRequest,
    "removeOfflineRequest",
    ()=>removeOfflineRequest,
    "subscribeToOfflineQueue",
    ()=>subscribeToOfflineQueue,
    "updateOfflineRequest",
    ()=>updateOfflineRequest
]);
(()=>{
    const e = new Error("Cannot find module 'idb'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const DB_NAME = "zemen-offline";
const STORE_NAME = "pending_requests";
async function queueRequest(path) {
    let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const headersArray = init.headers ? Array.from(new Headers(init.headers).entries()) : undefined;
    const body = typeof init.body === "string" ? init.body : null;
    var _options_requiresAuth, _options_tenantId, _options_description;
    return addOfflineRequest({
        path,
        method: (init.method || "GET").toUpperCase(),
        body,
        headers: headersArray !== null && headersArray !== void 0 ? headersArray : null,
        requiresAuth: (_options_requiresAuth = options.requiresAuth) !== null && _options_requiresAuth !== void 0 ? _options_requiresAuth : false,
        tenantId: (_options_tenantId = options.tenantId) !== null && _options_tenantId !== void 0 ? _options_tenantId : null,
        description: (_options_description = options.description) !== null && _options_description !== void 0 ? _options_description : null
    });
}
let dbPromise = null;
async function getDb() {
    if ("object" === "undefined" || !("indexedDB" in window)) {
        throw new Error("IndexedDB is not available in this environment");
    }
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 1, {
            upgrade (db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: "id"
                    });
                    store.createIndex("by-createdAt", "createdAt");
                }
            }
        });
    }
    return dbPromise;
}
function getEventTarget() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!("CustomEvent" in window)) return null;
    return queueEventTarget;
}
const queueEventTarget = ("TURBOPACK compile-time truthy", 1) ? new EventTarget() : "TURBOPACK unreachable";
function safeRandomId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return "".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2));
}
async function emitQueueChange() {
    const target = getEventTarget();
    if (!target) return;
    try {
        const summary = await getOfflineQueueSummary();
        target.dispatchEvent(new CustomEvent("change", {
            detail: summary
        }));
    } catch (e) {
        target.dispatchEvent(new CustomEvent("change", {
            detail: {
                pending: 0
            }
        }));
    }
}
async function addOfflineRequest(data) {
    const record = {
        id: safeRandomId(),
        createdAt: Date.now(),
        attempts: 0,
        lastError: null,
        ...data
    };
    try {
        const db = await getDb();
        await db.put(STORE_NAME, record);
        await emitQueueChange();
    } catch (error) {
        console.error("Failed to add offline request", error);
    }
    return record;
}
async function listOfflineRequests() {
    try {
        const db = await getDb();
        const items = await db.getAllFromIndex(STORE_NAME, "by-createdAt");
        return items.sort((a, b)=>a.createdAt - b.createdAt);
    } catch (error) {
        console.error("Failed to list offline requests", error);
        return [];
    }
}
async function removeOfflineRequest(id) {
    try {
        const db = await getDb();
        await db.delete(STORE_NAME, id);
        await emitQueueChange();
    } catch (error) {
        console.error("Failed to remove offline request", error);
    }
}
async function updateOfflineRequest(record) {
    try {
        const db = await getDb();
        await db.put(STORE_NAME, record);
        await emitQueueChange();
    } catch (error) {
        console.error("Failed to update offline request", error);
    }
}
async function clearOfflineRequests() {
    try {
        const db = await getDb();
        const tx = db.transaction(STORE_NAME, "readwrite");
        await tx.store.clear();
        await tx.done;
        await emitQueueChange();
    } catch (error) {
        console.error("Failed to clear offline requests", error);
    }
}
async function getOfflineQueueSummary() {
    try {
        const db = await getDb();
        const pending = await db.count(STORE_NAME);
        return {
            pending
        };
    } catch (e) {
        return {
            pending: 0
        };
    }
}
function subscribeToOfflineQueue(callback) {
    const target = getEventTarget();
    if (!target) {
        callback({
            pending: 0
        });
        return ()=>undefined;
    }
    const handler = (event)=>{
        const detail = event.detail;
        callback(detail);
    };
    target.addEventListener("change", handler);
    void getOfflineQueueSummary().then(callback).catch(()=>callback({
            pending: 0
        }));
    return ()=>{
        target.removeEventListener("change", handler);
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_offline_queue_ts_fe8b6387._.js.map