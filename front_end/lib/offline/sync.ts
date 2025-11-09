"use client";

import { useEffect, useRef } from "react";
import {
  listOfflineRequests,
  removeOfflineRequest,
  updateOfflineRequest,
  type OfflineRequestRecord,
} from "./queue";
import { authFetch } from "@/utils/api";

const ONLINE_EVENT = "online";

async function pushRecord(record: OfflineRequestRecord): Promise<boolean> {
  try {
    const init: RequestInit = {
      method: record.method,
      headers: record.headers ? new Headers(record.headers) : undefined,
      body: record.body ?? undefined,
    };

    const response = record.requiresAuth
      ? await authFetch(record.path, init, true, record.tenantId ?? undefined)
      : await fetch(record.path, init);

    if (!response.ok) {
      record.attempts += 1;
      record.lastError = `HTTP ${response.status}`;
      await updateOfflineRequest(record);
      return false;
    }

    await removeOfflineRequest(record.id);
    return true;
  } catch (error: any) {
    record.attempts += 1;
    record.lastError = error?.message || "Network error";
    await updateOfflineRequest(record);
    return false;
  }
}

async function pushPending(): Promise<void> {
  const items = await listOfflineRequests();
  for (const record of items) {
    const success = await pushRecord(record);
    if (!success) {
      break;
    }
  }
}

export function useOfflineSync(intervalMs = 20_000): void {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const runSync = async () => {
      if (!navigator.onLine || cancelled) return;
      await pushPending();
    };

    const handleOnline = () => {
      void runSync();
    };

    window.addEventListener(ONLINE_EVENT, handleOnline);

    if (navigator.onLine) {
      void runSync();
    }

    if (intervalMs > 0) {
      timerRef.current = window.setInterval(() => {
        if (!navigator.onLine) return;
        void runSync();
      }, intervalMs);
    }

    return () => {
      cancelled = true;
      window.removeEventListener(ONLINE_EVENT, handleOnline);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [intervalMs]);
}
