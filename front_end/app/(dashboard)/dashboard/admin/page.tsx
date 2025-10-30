"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

type AnalyticsResponse = {
  totals: {
    total_pharmacies: number;
    active_pharmacies: number;
    pending_kyc: number;
    blocked_pharmacies: number;
    total_branches: number;
    pharmacy_owners: number;
  };
  ai_usage_daily: Array<{ day: string; tokens: number }>;
  top_pharmacies: Array<{
    tenant_id: string;
    name?: string | null;
    branch_count: number;
    ai_tokens_30d: number;
    status?: string | null;
  }>;
  branch_distribution: Array<{
    tenant_id: string;
    name?: string | null;
    branch_count: number;
  }>;
};

export default function AdminAnalyticsPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await AdminAPI.analyticsOverview(days);
        if (!active) return;
        setAnalytics(data as AnalyticsResponse);
        setError(null);
      } catch (e: any) {
        if (!active) return;
        const msg = e?.message || "Failed to load analytics";
        setError(msg);
        show({ variant: "destructive", title: "Error", description: msg });
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [days, show]);

  const usageSeries = useMemo(() => analytics?.ai_usage_daily || [], [analytics]);
  const maxTokens = useMemo(() => {
    return usageSeries.reduce((max, row) => (row.tokens > max ? row.tokens : max), 0);
  }, [usageSeries]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!analytics) {
    return <div className="text-sm text-gray-500">No analytics available.</div>;
  }

  const totals = analytics.totals;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Admin Analytics</h1>
          <p className="text-sm text-gray-500">Operational health, AI usage, and branch footprint in one view.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 60, 90].map((d) => (
            <Button key={d} variant={days === d ? "default" : "outline"} onClick={() => setDays(d)}>
              Last {d}d
            </Button>
          ))}
          <Button variant="outline" onClick={() => location.reload()}>Refresh</Button>
          <Link href="/dashboard/admin/segments">
            <Button variant="ghost">View segments</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatTile label="Total Pharmacies" value={totals.total_pharmacies} href="/dashboard/admin/pharmacies" />
        <StatTile label="Active Pharmacies" value={totals.active_pharmacies} href="/dashboard/admin/pharmacies" />
        <StatTile label="Pending KYC" value={totals.pending_kyc} href="/dashboard/admin/pharmacies" tone="warning" />
        <StatTile label="Blocked Pharmacies" value={totals.blocked_pharmacies} href="/dashboard/admin/pharmacies" tone="danger" />
        <StatTile label="Total Branches" value={totals.total_branches} href="/dashboard/admin/pharmacies" />
        <StatTile label="Pharmacy Owners" value={totals.pharmacy_owners} href="/dashboard/admin/users" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Usage Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Daily tokens consumed across all pharmacies.</p>
        </CardHeader>
        <CardContent>
          {usageSeries.length === 0 ? (
            <div className="text-sm text-muted-foreground">No AI usage recorded for the selected window.</div>
          ) : (
            <div className="space-y-2">
              {usageSeries.map((row) => {
                const pct = maxTokens > 0 ? Math.max(4, Math.round((row.tokens / maxTokens) * 100)) : 0;
                return (
                  <div key={row.day} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(row.day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                      <span>{row.tokens.toLocaleString()} tokens</span>
                    </div>
                    <div className="h-2 rounded bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Pharmacies by AI Usage</CardTitle>
            <p className="text-xs text-muted-foreground">Monitor which tenants are leaning on the assistant the most.</p>
          </CardHeader>
          <CardContent>
            {analytics.top_pharmacies.length === 0 ? (
              <div className="text-sm text-muted-foreground">No usage recorded.</div>
            ) : (
              <div className="space-y-3">
                {analytics.top_pharmacies.map((p) => (
                  <div key={p.tenant_id} className="border rounded p-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{p.name || p.tenant_id}</span>
                      <span>{p.ai_tokens_30d.toLocaleString()} tokens</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-4 mt-2">
                      <span>ID: {p.tenant_id}</span>
                      <span>Branches: {p.branch_count}</span>
                      <span>Status: {p.status?.replace("_", " ") || "n/a"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Branch Footprint</CardTitle>
            <p className="text-xs text-muted-foreground">Aggregate branches by tenant to spot growth and outliers.</p>
          </CardHeader>
          <CardContent>
            {analytics.branch_distribution.length === 0 ? (
              <div className="text-sm text-muted-foreground">No branches recorded.</div>
            ) : (
              <div className="space-y-3">
                {analytics.branch_distribution.map((row) => (
                  <div key={row.tenant_id} className="flex items-center justify-between border rounded p-3 text-sm">
                    <div>
                      <div className="font-medium">{row.name || row.tenant_id}</div>
                      <div className="text-xs text-muted-foreground">{row.tenant_id}</div>
                    </div>
                    <div className="text-lg font-semibold">{row.branch_count}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground">
        Need deeper drill-downs? Visit the dedicated <Link href="/dashboard/admin/pharmacies" className="underline">pharmacy view</Link> or <Link href="/dashboard/admin/audit" className="underline">audit trail</Link>.
      </div>
    </div>
  );
}

function StatTile({ label, value, href, tone }: { label: string; value: number; href: string; tone?: "warning" | "danger" }) {
  const toneClasses = tone === "danger" ? "border-red-500/40 bg-red-50" : tone === "warning" ? "border-amber-500/40 bg-amber-50" : "";
  return (
    <Link href={href} className={`border rounded p-4 bg-white hover:shadow-sm transition block ${toneClasses}`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-3xl font-semibold mt-2">{value.toLocaleString()}</div>
    </Link>
  );
}
