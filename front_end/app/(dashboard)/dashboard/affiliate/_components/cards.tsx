"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
}: {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "border border-emerald-100 bg-white text-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
          {description && <p className="mt-3 text-sm text-slate-500">{description}</p>}
        </div>
        {icon && (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {icon}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="border border-emerald-100 bg-emerald-50 text-emerald-900 shadow-sm">
      <CardContent className="space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600/80">{label}</p>
        <div className="break-words text-xl font-semibold leading-tight text-emerald-900">{value}</div>
      </CardContent>
    </Card>
  );
}

export function HighlightPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "warning";
}) {
  const classes =
    tone === "warning"
      ? "border-amber-300/40 bg-amber-500/10 text-amber-100"
      : "border-emerald-300/30 bg-emerald-500/10 text-emerald-100";
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-[0_14px_40px_-30px_rgba(16,185,129,0.7)] ${classes}`}>
      <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-emerald-100 bg-white text-slate-900 shadow-sm">
      <CardHeader className="mb-0 space-y-1 pb-0">
        <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}
