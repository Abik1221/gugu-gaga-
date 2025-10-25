"use client";
import React from "react";
import { useToast } from "./toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed z-[1000] bottom-4 right-4 space-y-2 w-[320px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "rounded border p-3 shadow bg-white text-sm " +
            (t.variant === "success"
              ? "border-emerald-200"
              : t.variant === "destructive"
              ? "border-red-200"
              : "border-gray-200")
          }
        >
          {t.title && <div className="font-medium mb-1">{t.title}</div>}
          {t.description && <div className="text-gray-700">{t.description}</div>}
          <button
            onClick={() => dismiss(t.id)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
