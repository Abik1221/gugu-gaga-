"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighlightPill } from "./cards";
import { cn } from "@/lib/utils";
import { DollarSign, Sparkles, Users, Wallet, ChevronRight } from "lucide-react";
import { InstallButton } from "@/components/pwa/InstallPWA";
import type { AffiliateStats } from "../_hooks/use-affiliate-dashboard";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard/affiliate",
    description: "Snapshot of current performance and actions",
  },
  {
    label: "Payouts",
    href: "/dashboard/affiliate/payouts",
    description: "Track requests and statuses",
  },
  {
    label: "Commissions",
    href: "/dashboard/affiliate/commissions",
    description: "Review earned commissions",
  },
  {
    label: "Affiliates",
    href: "/dashboard/affiliate/affiliates",
    description: "Manage referred pharmacies",
  },
];

export function AffiliateSidebar({
  stats,
  monthLabel,
  payoutPercent,
}: {
  stats: AffiliateStats;
  monthLabel: string;
  payoutPercent: number;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),transparent_55%)]" />
        <CardHeader className="relative space-y-4 pb-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.38em] text-white/80">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span>Partner hub</span>
          </div>
          <CardTitle className="text-2xl font-semibold leading-tight">Your partner performance</CardTitle>
          <p className="text-sm text-emerald-50/85">
            Track payouts and commissions without losing momentum. {monthLabel} is on pace with a {payoutPercent}% rate.
          </p>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile label="Referrals" value={stats.referrals.toLocaleString()} icon={<Users className="h-4 w-4" />} />
            <MetricTile label="Paid to date" value={formatCurrency(stats.paidPayout)} icon={<DollarSign className="h-4 w-4" />} />
            <MetricTile label="This month" value={formatCurrency(stats.currentCommission)} icon={<Wallet className="h-4 w-4" />} />
            <MetricTile label="Pending payout" value={formatCurrency(stats.pendingPayout)} icon={<Sparkles className="h-4 w-4" />} />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-emerald-100/60 bg-emerald-50/60 shadow-md backdrop-blur">
        <CardHeader className="space-y-2 pb-0">
          <CardTitle className="text-base font-semibold text-emerald-900">Performance highlights</CardTitle>
          <p className="text-xs text-emerald-800/80">Stick to the numbers that reflect your pipeline health.</p>
        </CardHeader>
        <CardContent className="space-y-2 pt-5">
          <HighlightPill label="Active pharmacies" value={stats.referrals.toLocaleString()} />
          <HighlightPill label="Current commission" value={formatCurrency(stats.currentCommission)} />
          <HighlightPill label="Pending payout" value={formatCurrency(stats.pendingPayout)} tone="warning" />
        </CardContent>
      </Card>

      <Card className="border border-emerald-100/60 bg-white/95 shadow-md backdrop-blur">
        <CardHeader className="space-y-2 pb-0">
          <CardTitle className="text-base font-semibold text-emerald-900">Quick navigation</CardTitle>
          <p className="text-xs text-emerald-700/80">Jump to detail views for payouts, commissions, and referrals.</p>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <nav className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                    active
                      ? "border-transparent bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-900 shadow-sm"
                      : "border-emerald-100/40 bg-white/80 text-emerald-800 hover:border-emerald-200 hover:bg-emerald-50/80"
                  )}
                >
                  <span>
                    <span className="block font-semibold tracking-tight">{item.label}</span>
                    <span className="text-xs text-emerald-600/70">{item.description}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* PWA Install Button */}
      <Card className="border border-emerald-100/60 bg-white/95 shadow-md backdrop-blur">
        <CardContent className="p-4">
          <InstallButton fullWidth className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/12 p-3 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/65">{label}</p>
        <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      </div>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">{icon}</span>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
}
