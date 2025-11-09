import { openDB, type DBSchema, type IDBPDatabase } from "idb";

const DB_NAME = "zemen-offline";
const STORE_NAME = "pending_requests";

interface OfflineDbSchema extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: OfflineRequestRecord;
    indexes: { "by-createdAt": number };
  };
}

export async function queueRequest(
  path: string,
  init: RequestInit = {},
  options: QueueRequestOptions = {}
): Promise<OfflineRequestRecord> {
  const headersArray = init.headers
    ? Array.from(new Headers(init.headers).entries())
    : undefined;
  const body = typeof init.body === "string" ? init.body : null;

  return addOfflineRequest({
    path,
    method: (init.method || "GET").toUpperCase(),
    body,
    headers: headersArray ?? null,
    requiresAuth: options.requiresAuth ?? false,
    tenantId: options.tenantId ?? null,
    description: options.description ?? null,
  });
}

export type OfflineRequestRecord = {
  id: string;
  path: string;
  method: string;
  body?: string | null;
  requiresAuth: boolean;
  tenantId?: string | null;
  headers?: [string, string][] | null;
  createdAt: number;
  attempts: number;
  lastError?: string | null;
  description?: string | null;
};

export type OfflineQueueSummary = {
  pending: number;
};

export type QueueRequestOptions = {
  tenantId?: string | null;
  requiresAuth?: boolean;
  description?: string | null;
};

let dbPromise: Promise<IDBPDatabase<OfflineDbSchema>> | null = null;

async function getDb(): Promise<IDBPDatabase<OfflineDbSchema>> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    throw new Error("IndexedDB is not available in this environment");
  }

  if (!dbPromise) {
    dbPromise = openDB<OfflineDbSchema>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("by-createdAt", "createdAt");
        }
      },
    });
  }

  return dbPromise;
}

function getEventTarget(): EventTarget | null {
  if (typeof window === "undefined") return null;
  if (!("CustomEvent" in window)) return null;
  return queueEventTarget;
}

const queueEventTarget: EventTarget | null =
  typeof window !== "undefined" ? new EventTarget() : null;

function safeRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function emitQueueChange(): Promise<void> {
  const target = getEventTarget();
  if (!target) return;
  try {
    const summary = await getOfflineQueueSummary();
    target.dispatchEvent(
      new CustomEvent<OfflineQueueSummary>("change", { detail: summary })
    );
  } catch {
    target.dispatchEvent(
      new CustomEvent<OfflineQueueSummary>("change", { detail: { pending: 0 } })
    );
  }
}

export async function addOfflineRequest(
  data: Omit<
    OfflineRequestRecord,
    "id" | "createdAt" | "attempts" | "lastError"
  >
): Promise<OfflineRequestRecord> {
  const record: OfflineRequestRecord = {
    id: safeRandomId(),
    createdAt: Date.now(),
    attempts: 0,
    lastError: null,
    ...data,
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

export async function listOfflineRequests(): Promise<OfflineRequestRecord[]> {
  try {
    const db = await getDb();
    const items = await db.getAllFromIndex(STORE_NAME, "by-createdAt");
    return items.sort((a, b) => a.createdAt - b.createdAt);
  } catch (error) {
    console.error("Failed to list offline requests", error);
    return [];
  }
}

export async function removeOfflineRequest(id: string): Promise<void> {
  try {
    const db = await getDb();
    await db.delete(STORE_NAME, id);
    await emitQueueChange();
  } catch (error) {
    console.error("Failed to remove offline request", error);
  }
}

export async function updateOfflineRequest(
  record: OfflineRequestRecord
): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE_NAME, record);
    await emitQueueChange();
  } catch (error) {
    console.error("Failed to update offline request", error);
  }
}

export async function clearOfflineRequests(): Promise<void> {
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

export async function getOfflineQueueSummary(): Promise<OfflineQueueSummary> {
  try {
    const db = await getDb();
    const pending = await db.count(STORE_NAME);
    return { pending };
  } catch {
    return { pending: 0 };
  }
}

export function subscribeToOfflineQueue(
  callback: (summary: OfflineQueueSummary) => void
): () => void {
  const target = getEventTarget();
  if (!target) {
    callback({ pending: 0 });
    return () => undefined;
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<OfflineQueueSummary>).detail;
    callback(detail);
  };

  target.addEventListener("change", handler);
  void getOfflineQueueSummary()
    .then(callback)
    .catch(() => callback({ pending: 0 }));

  return () => {
    target.removeEventListener("change", handler);
  };
}
