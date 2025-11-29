"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatCard, MiniStat, SectionCard } from "./_components/cards";
import { useAffiliateDashboardContext } from "./_context/affiliate-dashboard-context";
import { useLanguage } from "@/contexts/language-context";

export default function AffiliateOverviewPage() {
  const { stats, dash, monthLabel, payoutPercent, actions, canCreateMore } =
    useAffiliateDashboardContext();
  const { t } = useLanguage();
  const affT = t.affiliateDashboard;

  const highlightItems = [
    `You’re earning a ${payoutPercent}% commission rate this month.`,
    `${stats.referrals.toLocaleString()} referred pharmacies are being tracked in real-time.`,
    `${formatCurrency(
      stats.paidPayout
    )} has already been paid out – keep sharing links to grow it.`,
  ];

  const summaryCards = useMemo(
    () => [
      {
        title: "Current commission",
        value: formatCurrency(stats.currentCommission),
        description: `${monthLabel} projected payout`,
      },
      {
        title: "Pending review",
        value: formatCurrency(stats.pendingPayout),
        description: "Awaiting finance approval",
      },
      {
        title: "Paid to date",
        value: formatCurrency(stats.paidPayout),
        description: "Lifetime transferred earnings",
      },
      {
        title: "Active referrals",
        value: stats.referrals.toLocaleString(),
        description: "Pharmacies onboarded via your links",
      },
    ],
    [
      monthLabel,
      stats.currentCommission,
      stats.paidPayout,
      stats.pendingPayout,
      stats.referrals,
    ]
  );

  const referredTenants = dash?.tenants ?? [];

  return (
    <div className="pb-16">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_40px_100px_-60px_rgba(15,118,110,0.45)] sm:p-10"
      >
        <div className="pointer-events-none absolute -top-28 right-[-10%] h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 left-[-12%] h-80 w-80 rounded-full bg-slate-100 blur-[120px]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-24 bg-gradient-to-r from-emerald-50 via-transparent to-emerald-100/60 blur-2xl" />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              {affT.badge}
            </p>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                {affT.heading}
              </h1>
              <p className="text-base text-slate-600">
                {affT.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Button
                onClick={() => {
                  void actions.createLink();
                }}
                className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                disabled={!canCreateMore}
              >
                {affT.createReferralLink}
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 hover:text-emerald-700"
              >
                <Link href="/dashboard/affiliate/payouts">{affT.requestPayout}</Link>
              </Button>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner shadow-emerald-100/60 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              {affT.whyTeamsStay}
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {highlightItems.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
}
