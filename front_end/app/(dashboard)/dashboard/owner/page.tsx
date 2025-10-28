"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  AuthAPI,
  OwnerAnalyticsAPI,
  type OwnerAnalyticsResponse,
} from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StaffActivityEntry = OwnerAnalyticsResponse["staff_activity"][number];

const HORIZONS: { value: string; label: string }[] = [
  { value: "day", label: "24h" },
  { value: "week", label: "7d" },
  { value: "month", label: "30d" },
  { value: "quarter", label: "90d" },
  { value: "year", label: "12m" },
];

const DEFAULT_TREND_WEEKS = 12;

function formatCurrency(value: number | undefined | null): string {
  const num = Number(value ?? 0);
  return `ETB ${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function TrendPill({ delta }: { delta: number | undefined | null }) {
  if (delta === undefined || delta === null || Number.isNaN(delta)) return null;
  const positive = delta >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 text-xs font-medium ${
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-gray-200 p-8 text-center text-sm text-muted-foreground">
      <div className="text-base font-medium text-gray-600">{title}</div>
      <p className="max-w-sm text-xs leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

export default function OwnerDashboardPage() {
  const { show } = useToast();

  const [me, setMe] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<OwnerAnalyticsResponse | null>(null);
  const [horizon, setHorizon] = useState<string>("month");
  const [trendWeeks, setTrendWeeks] = useState<number>(DEFAULT_TREND_WEEKS);

  const loadAnalytics = useCallback(
    async (tid: string, options?: { horizon?: string; trendWeeks?: number }) => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const data = await OwnerAnalyticsAPI.overview(tid, {
          horizon: options?.horizon || horizon,
          trendWeeks: options?.trendWeeks || trendWeeks,
        });
        setAnalytics(data);
      } catch (error: any) {
        setAnalytics(null);
        setAnalyticsError(error?.message || "Unable to load analytics data");
      } finally {
        setAnalyticsLoading(false);
      }
    },
    [horizon, trendWeeks],
  );

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      setLoadingUser(true);
      try {
        const profile = await AuthAPI.me();
        if (!active) return;
        setMe(profile);
        const tid = profile?.tenant_id || null;
        setTenantId(tid);
        if (tid) {
          await loadAnalytics(tid);
        }
      } catch (error: any) {
        if (!active) return;
        setMe(null);
        setTenantId(null);
        setAnalytics(null);
        setAnalyticsError(error?.message || "You are not authorised to view this dashboard");
      } finally {
        if (active) setLoadingUser(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [loadAnalytics]);

  const handleRefresh = async () => {
    if (!tenantId) return;
    await loadAnalytics(tenantId);
    show({ variant: "success", title: "Analytics refreshed", description: "Latest sales and inventory metrics are now visible." });
  };

  const handleHorizonChange = async (value: string) => {
    if (value === horizon) return;
    setHorizon(value);
    if (tenantId) {
      await loadAnalytics(tenantId, { horizon: value });
    }
  };

  const handleTrendWeeksChange = async (weeks: number) => {
    if (weeks === trendWeeks) return;
    setTrendWeeks(weeks);
    if (tenantId) {
      await loadAnalytics(tenantId, { trendWeeks: weeks });
    }
  };

  const revenueCards = useMemo(() => {
    const totals = analytics?.totals;
    const deltas = analytics?.deltas;
    return [
      {
        label: "Total revenue",
        value: formatCurrency(totals?.total_revenue),
        delta: deltas?.revenue_vs_last_period,
      },
      {
        label: "Average ticket",
        value: formatCurrency(totals?.average_ticket),
        delta: deltas?.avg_ticket_vs_last_period,
      },
      {
        label: "Units sold",
        value: (totals?.units_sold ?? 0).toLocaleString("en-US"),
        delta: deltas?.units_vs_last_period,
      },
      {
        label: "Completed sales",
        value: (totals?.sale_count ?? 0).toLocaleString("en-US"),
        delta: undefined,
      },
      {
        label: "Active cashiers",
        value: (totals?.active_cashiers ?? 0).toLocaleString("en-US"),
        delta: undefined,
      },
    ];
  }, [analytics]);

  const activityStream: StaffActivityEntry[] = useMemo(() => {
    return (analytics?.staff_activity || []).slice(0, 20);
  }, [analytics]);

  const revenueTrend = analytics?.revenue_trend || [];
  const branchComparison = analytics?.branch_comparison || [];
  const productivity = analytics?.staff_productivity || [];
  const topProducts = analytics?.top_products || [];
  const inventorySlices = analytics?.inventory_health || [];
  const recentPayments = analytics?.recent_payments || [];

  const loading = loadingUser || analyticsLoading;
  const displayName = useMemo(() => {
    if (!me) return "owner";
    const firstName = (me.first_name || "").trim();
    if (firstName) return firstName;
    const fallback = (me.username || me.email || "owner").trim();
    return fallback || "owner";
  }, [me]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            {loadingUser ? "Loading..." : `Welcome back, ${displayName}`}
          </h1>
          <p className="text-sm text-gray-500">
            Monitor revenue, compare branches, and coach your pharmacy team from a single command center.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded border border-gray-200 bg-white p-1 text-xs shadow-sm">
            {HORIZONS.map((item) => {
              const active = horizon === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleHorizonChange(item.value)}
                  className={`rounded px-3 py-1 font-medium transition ${
                    active ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  disabled={analyticsLoading}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <select
            value={trendWeeks}
            onChange={(event) => handleTrendWeeksChange(Number(event.target.value) || DEFAULT_TREND_WEEKS)}
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:ring"
            disabled={analyticsLoading}
          >
            <option value={4}>4 weeks</option>
            <option value={8}>8 weeks</option>
            <option value={12}>12 weeks</option>
            <option value={24}>24 weeks</option>
          </select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={analyticsLoading || !tenantId}>
            Refresh
          </Button>
          <Link href="/dashboard/owner/staff/new">
            <Button size="sm">Invite staff</Button>
          </Link>
        </div>
      </header>

      {analyticsError && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {analyticsError}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {revenueCards.map((card) => (
          <Card key={card.label} className="border border-emerald-100 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xs uppercase tracking-wide text-emerald-700/80">
                {card.label}
              </CardTitle>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-xl font-semibold text-gray-900">{card.value}</div>
              )}
              {!loading && <TrendPill delta={card.delta} />}
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle>Revenue trend</CardTitle>
            <span className="text-xs text-gray-500">{trendWeeks} week trajectory</span>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : revenueTrend.length === 0 ? (
              <EmptyState
                title="No sales recorded"
                description="Capture a sale from the POS to start building your revenue history."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 16, bottom: 8, left: -4 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickFormatter={(val) => `ETB ${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                    width={90}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => label}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#047857" strokeWidth={2} fill="url(#trendGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-32" />
            ) : inventorySlices.length === 0 ? (
              <EmptyState
                title="No inventory audits"
                description="Sync your inventory lots so owners know which medicines need attention."
              />
            ) : (
              inventorySlices.map((slice) => (
                <div key={slice.label} className="flex items-center justify-between rounded border border-gray-100 bg-white px-3 py-2">
                  <div className="text-sm font-medium text-gray-700">{slice.label}</div>
                  <span className="text-sm font-semibold text-gray-900">{slice.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle>Branch comparison</CardTitle>
            <span className="text-xs text-gray-500">Revenue, transactions, and units sold</span>
          </CardHeader>
          <CardContent className="space-y-2 overflow-x-auto">
            {loading ? (
              <Skeleton className="h-32" />
            ) : branchComparison.length === 0 ? (
              <EmptyState
                title="No branches on record"
                description="Add the branch field when creating sales to see how each site performs."
              />
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Branch</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Revenue</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Sales</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Units sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {branchComparison.map((row) => (
                    <tr key={row.branch ?? "_default"}>
                      <td className="px-3 py-2 text-gray-700">{row.branch || "Unassigned"}</td>
                      <td className="px-3 py-2 text-gray-900">{formatCurrency(row.revenue)}</td>
                      <td className="px-3 py-2 text-gray-700">{row.sale_count.toLocaleString("en-US")}</td>
                      <td className="px-3 py-2 text-gray-700">{row.units_sold.toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle>Staff productivity</CardTitle>
            <Link href="/dashboard/owner/staff" className="text-xs font-medium text-emerald-600 hover:underline">
              View staff list
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-32" />
            ) : productivity.length === 0 ? (
              <EmptyState
                title="No staff sales captured"
                description="Record a sale from the POS to start ranking your cashiers."
              />
            ) : (
              <ul className="space-y-2">
                {productivity.map((item) => (
                  <li key={item.user_id} className="rounded border border-gray-100 bg-white px-3 py-2">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                      <span>{item.name}</span>
                      <span>{formatCurrency(item.total_sales)}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>{item.role}</span>
                      <span>
                        {item.transactions} transactions · {item.units_sold} units
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle>Staff activity</CardTitle>
            <span className="text-xs text-gray-500">Most recent inventory & POS changes</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-40" />
            ) : activityStream.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Inventory updates, POS sales and staff audits will show here."
              />
            ) : (
              <ul className="space-y-2">
                {activityStream.map((entry) => (
                  <li key={entry.id} className="rounded border border-gray-100 bg-white p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{entry.action.replace(/_/g, " ")}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {entry.actor_name ? `${entry.actor_name} (${entry.actor_role || "staff"})` : "System"}
                    </div>
                    {entry.metadata && (
                      <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-600">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent payment activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-32" />
            ) : recentPayments.length === 0 ? (
              <EmptyState
                title="No submissions yet"
                description="Payment uploads appear here for the owner’s records."
              />
            ) : (
              <ul className="space-y-2 text-sm">
                {recentPayments.map((payment) => (
                  <li key={payment.id} className="rounded border border-gray-100 bg-white px-3 py-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium uppercase text-gray-600">{payment.status_label || payment.status}</span>
                      <span>{payment.created_at_formatted || new Date(payment.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{payment.code || "—"}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <Card>
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle>Top products</CardTitle>
            <span className="text-xs text-gray-500">Most recent best sellers</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-32" />
            ) : topProducts.length === 0 ? (
              <EmptyState
                title="No product insights yet"
                description="Run more sales through the POS to see which medicines drive revenue."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Product</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Revenue</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {topProducts.map((item) => (
                      <tr key={item.name}>
                        <td className="px-3 py-2 text-gray-700">{item.name}</td>
                        <td className="px-3 py-2 text-gray-900">{formatCurrency(item.revenue)}</td>
                        <td className="px-3 py-2 text-gray-700">{item.quantity.toLocaleString("en-US")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
