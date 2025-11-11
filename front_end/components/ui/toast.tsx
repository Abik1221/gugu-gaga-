"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export default function Toast() {
  return null;
}

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, duration: 3000, variant: "default", ...t };
      setToasts((prev) => [...prev, toast]);
      const duration = toast.duration ?? 3000;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
