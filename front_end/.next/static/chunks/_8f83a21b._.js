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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/idb/build/index.js [app-client] (ecmascript)");
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
        dbPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openDB"])(DB_NAME, 1, {
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
"[project]/node_modules/idb/build/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteDB",
    ()=>deleteDB,
    "openDB",
    ()=>openDB,
    "unwrap",
    ()=>unwrap,
    "wrap",
    ()=>wrap
]);
const instanceOfAny = (object, constructors)=>constructors.some((c)=>object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
        IDBDatabase,
        IDBObjectStore,
        IDBIndex,
        IDBCursor,
        IDBTransaction
    ]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey
    ]);
}
const transactionDoneMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject)=>{
        const unlisten = ()=>{
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = ()=>{
            resolve(wrap(request.result));
            unlisten();
        };
        const error = ()=>{
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    // This mapping exists in reverseTransformCache but doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx)) return;
    const done = new Promise((resolve, reject)=>{
        const unlisten = ()=>{
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = ()=>{
            resolve();
            unlisten();
        };
        const error = ()=>{
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get (target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done') return transactionDoneMap.get(target);
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set (target, prop, value) {
        target[prop] = value;
        return true;
    },
    has (target, prop) {
        if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    }
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(this.request);
        };
    }
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function') return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest) return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value)) return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value)=>reverseTransformCache.get(value);
/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */ function openDB(name, version) {
    let { blocked, upgrade, blocking, terminated } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event)=>{
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event)=>blocked(// Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event.newVersion, event));
    }
    openPromise.then((db)=>{
        if (terminated) db.addEventListener('close', ()=>terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event)=>blocking(event.oldVersion, event.newVersion, event));
        }
    }).catch(()=>{});
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */ function deleteDB(name) {
    let { blocked } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event)=>blocked(// Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event));
    }
    return wrap(request).then(()=>undefined);
}
const readMethods = [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
];
const writeMethods = [
    'put',
    'add',
    'delete',
    'clear'
];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop)) return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (// Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function(storeName) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex) target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps)=>({
        ...oldTraps,
        get: (target, prop, receiver)=>getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop)=>!!getMethod(target, prop) || oldTraps.has(target, prop)
    }));
const advanceMethodProps = [
    'continue',
    'continuePrimaryKey',
    'advance'
];
const methodMap = {};
const advanceResults = new WeakMap();
const ittrProxiedCursorToOriginalProxy = new WeakMap();
const cursorIteratorTraps = {
    get (target, prop) {
        if (!advanceMethodProps.includes(prop)) return target[prop];
        let cachedFunc = methodMap[prop];
        if (!cachedFunc) {
            cachedFunc = methodMap[prop] = function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
            };
        }
        return cachedFunc;
    }
};
async function* iterate() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    // tslint:disable-next-line:no-this-assignment
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
        cursor = await cursor.openCursor(...args);
    }
    if (!cursor) return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    // Map this double-proxy back to the original, so other cursor methods work.
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while(cursor){
        yield proxiedCursor;
        // If one of the advancing methods was not called, call continue().
        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
        advanceResults.delete(proxiedCursor);
    }
}
function isIteratorProp(target, prop) {
    return prop === Symbol.asyncIterator && instanceOfAny(target, [
        IDBIndex,
        IDBObjectStore,
        IDBCursor
    ]) || prop === 'iterate' && instanceOfAny(target, [
        IDBIndex,
        IDBObjectStore
    ]);
}
replaceTraps((oldTraps)=>({
        ...oldTraps,
        get (target, prop, receiver) {
            if (isIteratorProp(target, prop)) return iterate;
            return oldTraps.get(target, prop, receiver);
        },
        has (target, prop) {
            return isIteratorProp(target, prop) || oldTraps.has(target, prop);
        }
    }));
;
}),
]);

//# sourceMappingURL=_8f83a21b._.js.map