"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionCard, MiniStat } from "@/app/(dashboard)/dashboard/affiliate/_components/cards";
import { useAffiliateDashboardContext } from "@/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

export default function PayoutsPage() {
  const {
    dash,
    payouts,
    payoutMonth,
    setPayoutMonth,
    payoutPercent,
    setPayoutPercent,
    requestingPayout,
    actions,
    stats,
    monthLabel,
  } = useAffiliateDashboardContext();

  const [refreshing, setRefreshing] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");

  const tenantsCount = dash?.tenants?.length ?? 0;
  const currentPeriodLabel = useMemo(() => {
    if (dash?.year && dash?.month) {
      try {
        return new Date(dash.year, dash.month - 1).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } catch {
        return `${dash.year}-${String(dash.month).padStart(2, "0")}`;
      }
    }
    return monthLabel || "current period";
  }, [dash?.month, dash?.year, monthLabel]);

  const canRequestPayout = Math.max(stats.currentCommission, dash?.amount ?? 0) > 0;
  const payoutGuardMessage = "You haven't earned any commission yet. Share your referral link to start earning before requesting a payout.";

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await actions.refresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Commission payouts</h1>
          <p className="text-sm text-slate-500">Track requests, statuses, and submit new payout claims.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            void handleRefresh();
          }}
          disabled={refreshing}
          className="h-10 rounded-2xl border border-emerald-200/70 bg-white px-4 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait"
        >
          {refreshing ? "Refreshing..." : "Refresh data"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        >
          <SectionCard
            title="This period at a glance"
            description={`Commission summary for ${currentPeriodLabel}.`}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniStat label="Percent" value={`${dash?.percent ?? payoutPercent}%`} />
              <MiniStat label="Commission" value={formatCurrency(dash?.amount ?? stats.currentCommission)} />
              <MiniStat label="Referred Pharmacies" value={tenantsCount.toString()} />
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Tenant IDs credited
              </p>
              <div className="mt-3 max-h-40 overflow-auto rounded-xl border border-emerald-100 bg-white p-3 text-xs font-mono text-slate-700 shadow-sm">
                {tenantsCount === 0 ? (
                  <p>No pharmacies referred yet this month. Share your link to get started.</p>
                ) : (
                  <ul className="space-y-2">
                    {(dash?.tenants ?? []).map((tenant) => (
                      <li key={tenant} className="flex items-center justify-between">
                        <span>{tenant}</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
                          Credited
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
        >
          <SectionCard
            title="Request payout"
            description="Submit a commission payout request for a specific month."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  Month (YYYY-MM)
                </label>
                <Input
                  value={payoutMonth}
                  onChange={(e) => setPayoutMonth(e.target.value)}
                  placeholder="2025-10"
                  className="rounded-2xl border border-emerald-100/40 bg-white/80 text-emerald-900 placeholder:text-emerald-300 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  Commission percent
                </label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  step={0.5}
                  value={payoutPercent}
                  onChange={(e) => setPayoutPercent(Number(e.target.value))}
                  className="rounded-2xl border border-emerald-100/40 bg-white/80 text-emerald-900 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  Bank name*
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                  required
                  className="rounded-2xl border border-emerald-100/40 bg-white/80 text-emerald-900 placeholder:text-emerald-300 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  Account holder name*
                </label>
                <Input
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Enter account holder name"
                  required
                  className="rounded-2xl border border-emerald-100/40 bg-white/80 text-emerald-900 placeholder:text-emerald-300 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                  Account number*
                </label>
                <Input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  required
                  className="rounded-2xl border border-emerald-100/40 bg-white/80 text-emerald-900 placeholder:text-emerald-300 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                if (!payoutMonth || !bankName.trim() || !bankAccountName.trim() || !bankAccountNumber.trim()) return;
                if (!canRequestPayout) return;
                void actions.requestPayout({
                  month: payoutMonth,
                  percent: payoutPercent,
                  bank_name: bankName,
                  bank_account_name: bankAccountName,
                  bank_account_number: bankAccountNumber,
                });
              }}
              disabled={requestingPayout || !payoutMonth || !canRequestPayout || !bankName.trim() || !bankAccountName.trim() || !bankAccountNumber.trim()}
              className="mt-6 h-11 w-full rounded-2xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestingPayout ? "Submitting..." : "Submit payout request"}
            </Button>
            {!canRequestPayout && (
              <p className="mt-3 text-xs font-medium text-rose-600">{payoutGuardMessage}</p>
            )}
            {(!bankName.trim() || !bankAccountName.trim() || !bankAccountNumber.trim()) && (
              <p className="mt-3 text-xs font-medium text-rose-600">All bank details are required for payout requests.</p>
            )}
          </SectionCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
      >
        <SectionCard title="Payout history" description="Latest payout requests with status updates.">
          {payouts.length === 0 ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-sm text-emerald-700">
              No payout requests yet. Submit your first payout to see it listed here.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-emerald-50 text-xs uppercase tracking-[0.25em] text-emerald-600">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Percent</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-t border-emerald-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{payout.month || "—"}</td>
                      <td className="px-4 py-3">{`${payout.percent}%`}</td>
                      <td className="px-4 py-3">{formatCurrency(payout.amount)}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${payout.status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : payout.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </motion.div>
    </div>
  );
}