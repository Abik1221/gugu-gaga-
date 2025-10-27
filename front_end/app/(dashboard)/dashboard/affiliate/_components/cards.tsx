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
    <Card className={cn("border border-emerald-100/60 bg-white/85 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-900">{value}</p>
          {description && <p className="mt-3 text-xs text-emerald-700/80">{description}</p>}
        </div>
        {icon && <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</span>}
      </CardContent>
    </Card>
  );
}

export function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card className="border border-emerald-100/60 bg-white/80 shadow-sm">
      <CardContent className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-500">{label}</p>
        <p className="mt-2 text-lg font-semibold text-emerald-900">{value}</p>
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
      ? "border-amber-100 bg-amber-50 text-amber-700"
      : "border-emerald-100 bg-emerald-50 text-emerald-700";
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${classes}`}>
      <p className="text-[11px] uppercase tracking-widest opacity-80">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
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
    <Card className="border border-emerald-100/60 bg-white/85 shadow-md backdrop-blur">
      <CardHeader className="mb-0 space-y-1 pb-0">
        <CardTitle className="text-lg text-emerald-900">{title}</CardTitle>
        {description && <p className="text-xs text-emerald-700/80">{description}</p>}
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}
