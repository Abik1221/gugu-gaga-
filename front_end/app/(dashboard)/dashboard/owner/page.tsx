"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  OwnerAnalyticsAPI,
  type OwnerAnalyticsResponse,
} from "@/utils/api";
import { useAuth } from "@/components/auth/auth-provider";
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
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${positive
        ? "bg-emerald-100 text-emerald-800"
        : "bg-red-100 text-red-800"
        }`}
    >
      {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
      <div className="text-base font-semibold text-slate-800">{title}</div>
      <p className="max-w-sm text-xs leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

import { RoleSpecificGuard } from "@/components/auth/role-specific-guard";

export default function OwnerDashboardPage() {
  return (
    <RoleSpecificGuard allowedRoles={["pharmacy_owner"]}>
      <OwnerDashboardContent />
    </RoleSpecificGuard>
  );
}

function OwnerDashboardContent() {
  const { show } = useToast();

  const { user } = useAuth();
  const tenantId = user?.tenant_id || null;
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
    if (!user) return;
    
    if (tenantId) {
      loadAnalytics(tenantId);
    }
  }, [user, tenantId, loadAnalytics]);

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
      {
        label: "Customers on file",
        value: (totals?.total_customers ?? 0).toLocaleString("en-US"),
        delta: undefined,
      },
      {
        label: "Active customers",
        value: (totals?.active_customers ?? 0).toLocaleString("en-US"),
        delta: undefined,
      },
      {
        label: "Upcoming refills (7d)",
        value: (totals?.upcoming_refills ?? 0).toLocaleString("en-US"),
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

  const loading = analyticsLoading;
  const displayName = useMemo(() => {
    if (!user) return "owner";
    const firstName = (user.first_name || "").trim();
    if (firstName) return firstName;
    const fallback = (user.username || user.email || "owner").trim();
    return fallback || "owner";
  }, [user]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-md lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-black">
            {!user ? "Loading..." : `Welcome back, ${displayName}`}
          </h1>
          <p className="max-w-xl text-sm text-slate-900">
            Monitor revenue, compare branches, and coach your pharmacy team from a single command center.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Horizon picker */}
          <div className="flex rounded-full border border-slate-200 bg-white p-1 text-xs shadow-sm">
            {HORIZONS.map((item) => {
              const active = horizon === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleHorizonChange(item.value)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${active ? "bg-emerald-700 text-white shadow-lg" : "text-slate-800 hover:bg-slate-100"
                    }`}
                  disabled={analyticsLoading}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Trend weeks */}
          <select
            value={trendWeeks}
            onChange={(event) => handleTrendWeeksChange(Number(event.target.value) || DEFAULT_TREND_WEEKS)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-200"
            disabled={analyticsLoading}
          >
            <option value={4}>4 weeks</option>
            <option value={8}>8 weeks</option>
            <option value={12}>12 weeks</option>
            <option value={24}>24 weeks</option>
          </select>

          {/* Actions */}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={analyticsLoading || !tenantId}>
            Refresh
          </Button>

          <Link href="/dashboard/owner/integrations">
            <Button variant="outline" size="sm">Connect tools</Button>
          </Link>

          <Link href="/dashboard/owner/staff/new">
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-md">Invite staff</Button>
          </Link>
        </div>
      </header>

      {analyticsError && (
        <div className="rounded border border-red-300 bg-red-100 p-3 text-sm text-red-800">
          {analyticsError}
        </div>
      )}

      {/* Top metrics */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
        {revenueCards.map((card) => (
          <Card
            key={card.label}
            className="border border-slate-200 bg-white text-black shadow-md transition transform-gpu hover:-translate-y-0.5"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-900">{card.label}</CardTitle>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-semibold text-black">{card.value}</div>
              )}
              {!loading && <TrendPill delta={card.delta} />}
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Revenue trend + Inventory */}
      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-slate-200 bg-white text-black shadow-md">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-black">Revenue trend</CardTitle>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {trendWeeks} week trajectory
            </span>
          </CardHeader>

          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : revenueTrend.length === 0 ? (
              <EmptyState title="No sales recorded" description="Capture a sale from the POS to start building your revenue history." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 16, bottom: 8, left: -4 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#065f46" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#065f46" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6eef4" />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickFormatter={(val) => `ETB ${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => label} />
                  <Area type="monotone" dataKey="revenue" stroke="#065f46" strokeWidth={2} fill="url(#trendGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-slate-200 bg-white text-black shadow-md">
          <CardHeader>
            <CardTitle className="text-black">Inventory health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-32" />
            ) : inventorySlices.length === 0 ? (
              <EmptyState title="No inventory audits" description="Sync your inventory lots so owners know which medicines need attention." />
            ) : (
              inventorySlices.map((slice) => (
                <div key={slice.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="text-sm font-medium text-slate-800">{slice.label}</div>
                  <span className="text-sm font-semibold text-emerald-700">{slice.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* Branch comparison + staff productivity */}
      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-slate-200 bg-white text-black shadow-md">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-black">Branch comparison</CardTitle>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">Revenue, transactions, and units sold</span>
          </CardHeader>

          <CardContent className="space-y-2 overflow-x-auto">
            {loading ? (
              <Skeleton className="h-32" />
            ) : branchComparison.length === 0 ? (
              <EmptyState title="No branches on record" description="Add the branch field when creating sales to see how each site performs." />
            ) : (
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
                <thead className="bg-white">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Branch</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Revenue</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Sales</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Units sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {branchComparison.map((row) => (
                    <tr key={row.branch ?? "_default"}>
                      <td className="px-3 py-2">{row.branch || "Unassigned"}</td>
                      <td className="px-3 py-2 text-emerald-700">{formatCurrency(row.revenue)}</td>
                      <td className="px-3 py-2">{row.sale_count.toLocaleString("en-US")}</td>
                      <td className="px-3 py-2">{row.units_sold.toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-slate-200 bg-white text-black shadow-md">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-black">Staff productivity</CardTitle>
            <Link href="/dashboard/owner/staff" className="text-xs font-semibold text-emerald-700 hover:underline">View staff list</Link>
          </CardHeader>

          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-32" />
            ) : productivity.length === 0 ? (
              <EmptyState title="No staff sales captured" description="Record a sale from the POS to start ranking your cashiers." />
            ) : (
              <ul className="space-y-2">
                {productivity.map((item) => {
                  const fallback = item as typeof item & { transaction_count?: number; avg_ticket?: number; };
                  const transactions = item.transactions ?? fallback.transaction_count ?? 0;
                  const avgTicketValue = fallback.avg_ticket ?? (transactions ? item.total_sales / transactions : 0);

                  return (
                    <li key={item.user_id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>{item.name}</span>
                        <span className="text-emerald-700">{formatCurrency(item.total_sales)}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {transactions.toLocaleString("en-US")} sales • {formatCurrency(avgTicketValue)} avg ticket
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Staff activity + recent payments */}
      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-slate-200 bg-white text-black shadow-md">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-black">Staff activity</CardTitle>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">Most recent inventory & POS changes</span>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-40" />
            ) : activityStream.length === 0 ? (
              <EmptyState title="No recent activity" description="Inventory updates, POS sales and staff audits will show here." />
            ) : (
              <ul className="space-y-2">
                {activityStream.map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{entry.action.replace(/_/g, " ")}</span>
                      <span className="text-xs text-slate-600">{new Date(entry.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-700">
                      {(() => {
                        const raw = entry as typeof entry & { description?: string };
                        if (raw.description) return raw.description;
                        if (entry.metadata) {
                          try {
                            return typeof entry.metadata === "string" ? entry.metadata : JSON.stringify(entry.metadata);
                          } catch {
                            return String(entry.metadata);
                          }
                        }
                        return "No additional details";
                      })()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-slate-200 bg-white text-black shadow-md">
          <CardHeader>
            <CardTitle className="text-black">Recent payment activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-32" />
            ) : recentPayments.length === 0 ? (
              <EmptyState title="No submissions yet" description="Payment uploads appear here for the owner’s records." />
            ) : (
              <ul className="space-y-2 text-sm text-slate-800">
                {recentPayments.map((payment) => {
                  const raw = payment as typeof payment & { amount_formatted?: string; amount?: number; method?: string; };
                  const amountDisplay = raw.amount_formatted ?? (raw.amount != null ? formatCurrency(raw.amount) : "—");
                  const methodDisplay = raw.method ?? "N/A";

                  return (
                    <li key={payment.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span className="font-semibold uppercase text-slate-800">{payment.status_label || payment.status}</span>
                        <span>{payment.created_at_formatted || new Date(payment.created_at).toLocaleString()}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-700">
                        {amountDisplay} • {methodDisplay}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Top products */}
      <section className="space-y-3">
        <Card className="border border-slate-200 bg-white text-black shadow-md">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-black">Top products</CardTitle>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">Most recent best sellers</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-32" />
            ) : topProducts.length === 0 ? (
              <EmptyState title="No product insights yet" description="Run more sales through the POS to see which medicines drive revenue." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Product</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Revenue</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Sales</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-900">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {topProducts.map((item) => (
                      <tr key={item.name}>
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 text-emerald-700">{formatCurrency(item.revenue)}</td>
                        <td className="px-3 py-2">{item.quantity.toLocaleString("en-US")}</td>
                        <td className="px-3 py-2">{item.quantity.toLocaleString("en-US")}</td>
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

//  <div className="space-y-8">
//       <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
//         <div className="space-y-1">
//           <h1 className="text-2xl font-semibold text-black">
//             {loadingUser ? "Loading..." : `Welcome back, ${displayName}`}
//           </h1>
//           <p className="max-w-xl text-sm text-slate-600">
//             Monitor revenue, compare branches, and coach your pharmacy team from a single command center.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           {/* Horizon picker */}
//           <div className="flex rounded-full border border-slate-200 bg-white p-1 text-xs shadow-sm">
//             {HORIZONS.map((item) => {
//               const active = horizon === item.value;
//               return (
//                 <button
//                   key={item.value}
//                   type="button"
//                   onClick={() => handleHorizonChange(item.value)}
//                   className={`rounded-full px-3 py-1 font-semibold transition ${active
//                       ? "bg-emerald-700 text-white shadow"
//                       : "text-slate-700 hover:bg-slate-50"
//                     }`}
//                   disabled={analyticsLoading}
//                 >
//                   {item.label}
//                 </button>
//               );
//             })}
//           </div>

{/* Trend weeks */ }
// <select
//   value={trendWeeks}
//   onChange={(event) => handleTrendWeeksChange(Number(event.target.value) || DEFAULT_TREND_WEEKS)}
//   className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-200"
//   disabled={analyticsLoading}
// >
//   <option value={4}>4 weeks</option>
//   <option value={8}>8 weeks</option>
//   <option value={12}>12 weeks</option>
//   <option value={24}>24 weeks</option>
// </select>

{/* Actions */ }
//     <Button variant="outline" size="sm" onClick={handleRefresh} disabled={analyticsLoading || !tenantId}>
//       Refresh
//     </Button>

//     <Link href="/dashboard/owner/integrations">
//       <Button variant="outline" size="sm">Connect tools</Button>
//     </Link>

//     <Link href="/dashboard/owner/staff/new">
//       <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white">Invite staff</Button>
//     </Link>
//   </div>
// </header>

// {analyticsError && (
//   <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//     {analyticsError}
//   </div>
// )}

{/* Top metrics */ }
// <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
//   {revenueCards.map((card) => (
//     <Card
//       key={card.label}
//       className="border border-slate-100 bg-white text-black shadow-sm transition hover:translate-y-0.5"
//     >
//       <CardHeader className="space-y-2">
//         <CardTitle className="text-xs uppercase tracking-wider text-slate-600">{card.label}</CardTitle>
//         {loading ? (
//           <Skeleton className="h-8 w-24" />
//         ) : (
//           <div className="text-2xl font-semibold text-black">{card.value}</div>
//         )}
//         {!loading && <TrendPill delta={card.delta} />}
//       </CardHeader>
//     </Card>
//   ))}
// </section>

{/* Revenue trend + Inventory */ }
// <section className="grid gap-6 lg:grid-cols-5">
//   <Card className="lg:col-span-3 border border-slate-100 bg-white text-black shadow-sm">
//     <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//       <CardTitle className="text-black">Revenue trend</CardTitle>
//       <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
//         {trendWeeks} week trajectory
//       </span>
//     </CardHeader>

//     <CardContent className="h-72">
//       {loading ? (
//         <Skeleton className="h-full w-full" />
//       ) : revenueTrend.length === 0 ? (
//         <EmptyState
//           title="No sales recorded"
//           description="Capture a sale from the POS to start building your revenue history."
//         />
//       ) : (
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={revenueTrend} margin={{ top: 10, right: 16, bottom: 8, left: -4 }}>
//             <defs>
//               <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#065f46" stopOpacity={0.18} />
//                 <stop offset="95%" stopColor="#065f46" stopOpacity={0.04} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//             <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
//             <YAxis
//               tickFormatter={(val) => `ETB ${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
//               width={90}
//               axisLine={false}
//               tickLine={false}
//               fontSize={12}
//             />
//             <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => label} />
//             <Area type="monotone" dataKey="revenue" stroke="#065f46" strokeWidth={2} fill="url(#trendGradient)" />
//           </AreaChart>
//         </ResponsiveContainer>
//       )}
//     </CardContent>
//   </Card>

//   <Card className="lg:col-span-2 border border-slate-100 bg-white text-black shadow-sm">
//     <CardHeader>
//       <CardTitle className="text-black">Inventory health</CardTitle>
//     </CardHeader>
//     <CardContent className="space-y-3">
//       {loading ? (
//         <Skeleton className="h-32" />
//       ) : inventorySlices.length === 0 ? (
//         <EmptyState
//           title="No inventory audits"
//           description="Sync your inventory lots so owners know which medicines need attention."
//         />
//       ) : (
//         inventorySlices.map((slice) => (
//           <div key={slice.label} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
//             <div className="text-sm font-medium text-slate-800">{slice.label}</div>
//             <span className="text-sm font-semibold text-emerald-700">{slice.count}</span>
//           </div>
//         ))
//       )}
//     </CardContent>
//   </Card>
// </section>

{/* Branch comparison + staff productivity */ }
// <section className="grid gap-6 lg:grid-cols-5">
//   <Card className="lg:col-span-3 border border-slate-100 bg-white text-black shadow-sm">
//     <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//       <CardTitle className="text-black">Branch comparison</CardTitle>
//       <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Revenue, transactions, and units sold</span>
//     </CardHeader>

//     <CardContent className="space-y-2 overflow-x-auto">
//       {loading ? (
//         <Skeleton className="h-32" />
//       ) : branchComparison.length === 0 ? (
//         <EmptyState
//           title="No branches on record"
//           description="Add the branch field when creating sales to see how each site performs."
//         />
//       ) : (
//         <table className="min-w-full divide-y divide-slate-100 text-sm text-slate-800">
//           <thead className="bg-white">
//             <tr>
//               <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Branch</th>
//               <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Revenue</th>
//               <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Sales</th>
//               <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Units sold</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100 bg-white">
//             {branchComparison.map((row) => (
//               <tr key={row.branch ?? "_default"}>
//                 <td className="px-3 py-2">{row.branch || "Unassigned"}</td>
//                 <td className="px-3 py-2 text-emerald-700">{formatCurrency(row.revenue)}</td>
//                 <td className="px-3 py-2">{row.sale_count.toLocaleString("en-US")}</td>
//                 <td className="px-3 py-2">{row.units_sold.toLocaleString("en-US")}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </CardContent>
//   </Card>

//   <Card className="lg:col-span-2 border border-slate-100 bg-white text-black shadow-sm">
//     <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//       <CardTitle className="text-black">Staff productivity</CardTitle>
//       <Link href="/dashboard/owner/staff" className="text-xs font-semibold text-emerald-700 hover:underline">View staff list</Link>
//     </CardHeader>

//     <CardContent className="space-y-2">
//       {loading ? (
//         <Skeleton className="h-32" />
//       ) : productivity.length === 0 ? (
//         <EmptyState
//           title="No staff sales captured"
//           description="Record a sale from the POS to start ranking your cashiers."
//         />
//       ) : (
//         <ul className="space-y-2">
//           {productivity.map((item) => {
//             const fallback = item as typeof item & { transaction_count?: number; avg_ticket?: number; };
//             const transactions = item.transactions ?? fallback.transaction_count ?? 0;
//             const avgTicketValue = fallback.avg_ticket ?? (transactions ? item.total_sales / transactions : 0);

//             return (
//               <li key={item.user_id} className="rounded-lg border border-slate-100 bg-white px-3 py-2">
//                 <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
//                   <span>{item.name}</span>
//                   <span className="text-emerald-700">{formatCurrency(item.total_sales)}</span>
//                 </div>
//                 <div className="mt-1 text-xs text-slate-600">
//                   {transactions.toLocaleString("en-US")} sales • {formatCurrency(avgTicketValue)} avg ticket
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </CardContent>
//   </Card>
// </section>

{/* Staff activity + recent payments */ }
// <section className="grid gap-6 lg:grid-cols-5">
//   <Card className="lg:col-span-3 border border-slate-100 bg-white text-black shadow-sm">
//     <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//       <CardTitle className="text-black">Staff activity</CardTitle>
//       <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Most recent inventory & POS changes</span>
//     </CardHeader>

//     <CardContent className="space-y-3">
//       {loading ? (
//         <Skeleton className="h-40" />
//       ) : activityStream.length === 0 ? (
//         <EmptyState
//           title="No recent activity"
//           description="Inventory updates, POS sales and staff audits will show here."
//         />
//       ) : (
//         <ul className="space-y-2">
//           {activityStream.map((entry) => (
//             <li key={entry.id} className="rounded-lg border border-slate-100 bg-white p-3 text-sm">
//               <div className="flex items-center justify-between">
//                 <span className="font-semibold text-slate-800">{entry.action.replace(/_/g, " ")}</span>
//                 <span className="text-xs text-slate-500">{new Date(entry.created_at).toLocaleString()}</span>
//               </div>
//               <div className="mt-1 text-xs text-slate-600">
//                 {(() => {
//                   const raw = entry as typeof entry & { description?: string };
//                   if (raw.description) return raw.description;
//                   if (entry.metadata) {
//                     try {
//                       return typeof entry.metadata === "string" ? entry.metadata : JSON.stringify(entry.metadata);
//                     } catch {
//                       return String(entry.metadata);
//                     }
//                   }
//                   return "No additional details";
//                 })()}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </CardContent>
//   </Card>

//   <Card className="lg:col-span-2 border border-slate-100 bg-white text-black shadow-sm">
//     <CardHeader>
//       <CardTitle className="text-black">Recent payment activity</CardTitle>
//     </CardHeader>
//     <CardContent className="space-y-2">
//       {loading ? (
//         <Skeleton className="h-32" />
//       ) : recentPayments.length === 0 ? (
//         <EmptyState
//           title="No submissions yet"
//           description="Payment uploads appear here for the owner’s records."
//         />
//       ) : (
//         <ul className="space-y-2 text-sm text-slate-800">
//           {recentPayments.map((payment) => {
//             const raw = payment as typeof payment & { amount_formatted?: string; amount?: number; method?: string; };
//             const amountDisplay = raw.amount_formatted ?? (raw.amount != null ? formatCurrency(raw.amount) : "—");
//             const methodDisplay = raw.method ?? "N/A";

//             return (
//               <li key={payment.id} className="rounded-lg border border-slate-100 bg-white px-3 py-2">
//                 <div className="flex items-center justify-between text-xs text-slate-600">
//                   <span className="font-semibold uppercase text-slate-700">{payment.status_label || payment.status}</span>
//                   <span>{payment.created_at_formatted || new Date(payment.created_at).toLocaleString()}</span>
//                 </div>
//                 <div className="mt-1 text-xs text-slate-600">
//                   {amountDisplay} • {methodDisplay}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </CardContent>
//   </Card>
// </section>

{/* Top products */ }
//   <section className="space-y-3">
//     <Card className="border border-slate-100 bg-white text-black shadow-sm">
//       <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//         <CardTitle className="text-black">Top products</CardTitle>
//         <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Most recent best sellers</span>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <Skeleton className="h-32" />
//         ) : topProducts.length === 0 ? (
//           <EmptyState
//             title="No product insights yet"
//             description="Run more sales through the POS to see which medicines drive revenue."
//           />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-100 text-sm text-slate-800">
//               <thead className="bg-white">
//                 <tr>
//                   <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Product</th>
//                   <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Revenue</th>
//                   <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Sales</th>
//                   <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-700">Quantity</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 bg-white">
//                 {topProducts.map((item) => (
//                   <tr key={item.name}>
//                     <td className="px-3 py-2">{item.name}</td>
//                     <td className="px-3 py-2 text-emerald-700">{formatCurrency(item.revenue)}</td>
//                     <td className="px-3 py-2">{item.quantity.toLocaleString("en-US")}</td>
//                     <td className="px-3 py-2">{item.quantity.toLocaleString("en-US")}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   </section>
// </div> */}