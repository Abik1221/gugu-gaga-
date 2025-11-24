"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type AnalyticsResponse = {
  totals: {
    total_pharmacies: number;
    active_pharmacies: number;
    pending_kyc: number;
    blocked_pharmacies: number;
    total_branches: number;
    pharmacy_owners: number;
    total_revenue: number;
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Analytics</h1>
              <p className="mt-2 text-slate-600">Operational health, AI usage, and branch footprint in one view.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[7, 30, 60, 90].map((d) => (
                <Button
                  key={d}
                  variant={days === d ? "default" : "outline"}
                  onClick={() => setDays(d)}
                  className={days === d ? "bg-emerald-600 hover:bg-emerald-700" : "border-slate-300 text-slate-700 hover:bg-slate-50"}
                >
                  Last {d}d
                </Button>
              ))}
              <Button variant="outline" onClick={() => location.reload()} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Refresh
              </Button>
              <Link href="/dashboard/admin/segments">
                <Button variant="ghost" className="text-slate-600 hover:bg-slate-100">
                  View Segments
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatTile label="Total Revenue" value={`ETB ${totals.total_revenue.toLocaleString()}`} href="/dashboard/admin/payouts" />
          <StatTile label="Total Pharmacies" value={totals.total_pharmacies} href="/dashboard/admin/pharmacies" />
          <StatTile label="Active Pharmacies" value={totals.active_pharmacies} href="/dashboard/admin/pharmacies" />
          <StatTile label="Pending KYC" value={totals.pending_kyc} href="/dashboard/admin/pharmacies" tone="warning" />
          <StatTile label="Blocked Pharmacies" value={totals.blocked_pharmacies} href="/dashboard/admin/pharmacies" tone="danger" />
          <StatTile label="Total Branches" value={totals.total_branches} href="/dashboard/admin/pharmacies" />
          <StatTile label="Pharmacy Owners" value={totals.pharmacy_owners} href="/dashboard/admin/users" />
        </div>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">AI Usage Trend</CardTitle>
            <p className="text-slate-600">Daily tokens consumed across all pharmacies.</p>
          </CardHeader>
          <CardContent>
            {usageSeries.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
                <div className="text-slate-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No AI usage data</h3>
                <p className="text-slate-500">No AI usage recorded for the selected window.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usageSeries.map((row) => {
                  const pct = maxTokens > 0 ? Math.max(4, Math.round((row.tokens / maxTokens) * 100)) : 0;
                  return (
                    <div key={row.day} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{new Date(row.day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        <span className="text-slate-600">{row.tokens.toLocaleString()} tokens</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900">Top Pharmacies by AI Usage</CardTitle>
              <p className="text-slate-600">Monitor which tenants are leaning on the assistant the most.</p>
            </CardHeader>
            <CardContent>
              {analytics.top_pharmacies.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No usage recorded</h3>
                  <p className="text-slate-500">No pharmacy usage data available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.top_pharmacies.map((p) => (
                    <div key={p.tenant_id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{p.name || p.tenant_id}</span>
                        <span className="text-lg font-bold text-emerald-600">{p.ai_tokens_30d.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>ID: {p.tenant_id}</span>
                        <span>Branches: {p.branch_count}</span>
                        <span className="capitalize">Status: {p.status?.replace("_", " ") || "n/a"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900">Branch Footprint</CardTitle>
              <p className="text-slate-600">Aggregate branches by tenant to spot growth and outliers.</p>
            </CardHeader>
            <CardContent>
              {analytics.branch_distribution.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No branches recorded</h3>
                  <p className="text-slate-500">No branch data available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.branch_distribution.map((row) => (
                    <div key={row.tenant_id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition-colors">
                      <div>
                        <div className="font-semibold text-slate-900">{row.name || row.tenant_id}</div>
                        <div className="text-sm text-slate-500 font-mono">{row.tenant_id}</div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{row.branch_count}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">
            Need deeper drill-downs? Visit the dedicated <Link href="/dashboard/admin/pharmacies" className="font-medium text-emerald-600 hover:text-emerald-700 underline">pharmacy view</Link> or <Link href="/dashboard/admin/audit" className="font-medium text-emerald-600 hover:text-emerald-700 underline">audit trail</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, href, tone }: { label: string; value: number | string; href: string; tone?: "warning" | "danger" }) {
  const toneClasses = tone === "danger"
    ? "border-red-200 bg-red-50 hover:bg-red-100"
    : tone === "warning"
      ? "border-amber-200 bg-amber-50 hover:bg-amber-100"
      : "border-slate-200 bg-white hover:bg-slate-50";

  const textClasses = tone === "danger"
    ? "text-red-900"
    : tone === "warning"
      ? "text-amber-900"
      : "text-slate-900";

  return (
    <Link href={href} className={`rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md block ${toneClasses}`}>
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className={`text-4xl font-bold mt-2 ${textClasses}`}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </Link>
  );
}
