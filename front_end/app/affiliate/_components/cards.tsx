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
        "border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-950/70 to-blue-600/10 text-white shadow-[0_18px_55px_-35px_rgba(255,255,255,0.55)] transition hover:-translate-y-1 hover:shadow-[0_28px_85px_-40px_rgba(255,255,255,0.55)] backdrop-blur-xl",
        className
      )}
    >
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-200">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          {description && <p className="mt-3 text-xs text-emerald-100/70">{description}</p>}
        </div>
        {icon && (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-emerald-200 shadow-inner shadow-emerald-500/10">
            {icon}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="border border-white/10 bg-gradient-to-br from-slate-900/70 via-emerald-600/10 to-blue-600/10 text-white shadow-[0_12px_45px_-30px_rgba(59,130,246,0.45)]">
      <CardContent className="space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-200/80">{label}</p>
        <div className="text-xl font-semibold leading-tight text-white break-words">{value}</div>
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
    <Card className="border border-black/40 bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white shadow-[0_20px_60px_-35px_rgba(255,255,255,0.6)] backdrop-blur-xl">
      <CardHeader className="mb-0 space-y-1 pb-0">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        {description && <p className="text-xs text-emerald-100/70">{description}</p>}
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}
