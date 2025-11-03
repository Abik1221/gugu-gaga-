"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Coins, Copy, DollarSign, Link as LinkIcon, Pointer, RefreshCw, Target, Users } from "lucide-react";
import { AffiliateAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { StatCard, SectionCard, MiniStat } from "./_components/cards";

type Dashboard = {
  referrals_count: number;
  amount: number;
  percent: number;
  year: number;
  month: number;
  tenants: string[];
  payouts: { pending_total: number; paid_total: number };
};

type LinkItem = { token: string; url: string; active: boolean };

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

export default function AffiliateOverviewPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dash, setDash] = useState<Dashboard | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [canCreateMore, setCanCreateMore] = useState(true);
  const [payoutMonth, setPayoutMonth] = useState("");
  const [payoutPercent, setPayoutPercent] = useState<number>(5);
  const [requestingPayout, setRequestingPayout] = useState(false);

  async function refreshAll() {
    setLoading(true);
    try {
      const [d, l] = await Promise.all([
        AffiliateAPI.dashboard(),
        AffiliateAPI.getLinks(),
      ]);
      const dashData = d as Dashboard;
      setDash(dashData);
      if (dashData?.year && dashData?.month) {
        const monthStr = `${dashData.year}-${String(dashData.month).padStart(2, "0")}`;
        setPayoutMonth(monthStr);
      }
      if (dashData?.percent) {
        setPayoutPercent(dashData.percent);
      }
      setLinks((l as any).links || []);
      setCanCreateMore(Boolean((l as any).can_create_more));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load affiliate data");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const stats = useMemo(() => ({
    referrals: dash?.referrals_count || 0,
    currentCommission: dash?.amount || 0,
    pendingPayout: dash?.payouts?.pending_total || 0,
    paidPayout: dash?.payouts?.paid_total || 0,
  }), [dash]);

  const statCards = useMemo(
    () => [
      {
        title: "Active referrals",
        value: stats.referrals.toLocaleString(),
        description: "Pharmacies you’ve successfully onboarded",
        icon: Users as LucideIcon,
      },
      {
        title: "Current commission",
        value: formatCurrency(stats.currentCommission),
        description: "Projected payout for this period",
        icon: Coins as LucideIcon,
      },
      {
        title: "Pending payouts",
        value: formatCurrency(stats.pendingPayout),
        description: "Awaiting review & processing",
        icon: DollarSign as LucideIcon,
      },
      {
        title: "Paid to date",
        value: formatCurrency(stats.paidPayout),
        description: "Total earnings transferred to you",
        icon: Target as LucideIcon,
      },
    ],
    [stats]
  );

  const currentPeriodLabel = useMemo(() => {
    if (!dash?.month || !dash?.year) return "current period";
    try {
      return new Date(dash.year, dash.month - 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return `${dash.year}-${String(dash.month).padStart(2, "0")}`;
    }
  }, [dash?.month, dash?.year]);

  const createLinkLabel = canCreateMore ? "Generate referral link" : "Link limit reached";
  const tenantsCount = dash?.tenants?.length ?? 0;
  const canRequestPayout = (dash?.amount ?? 0) > 0;
  const payoutGuardMessage = "You haven't earned any commission yet. Share your referral link to start earning before requesting a payout.";

  async function onCreateLink() {
    try {
      await AffiliateAPI.createLink();
      await refreshAll();
      show({ variant: "success", title: "Link created" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Failed to create link", description: e.message });
    }
  }

  async function onDeactivate(token: string) {
    try {
      await AffiliateAPI.deactivate(token);
      await refreshAll();
      show({ variant: "success", title: "Link deactivated" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Failed to deactivate", description: e.message });
    }
  }

  async function onRotate(token: string) {
    try {
      await AffiliateAPI.rotate(token);
      await refreshAll();
      show({ variant: "success", title: "Link rotated" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Failed to rotate", description: e.message });
    }
  }

  async function copyLink(url: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        show({ variant: "success", title: "Link copied", description: "Referral link copied to clipboard." });
      } else {
        throw new Error("Clipboard not available");
      }
    } catch (e: any) {
      show({
        variant: "destructive",
        title: "Copy failed",
        description: e?.message || "Unable to copy link on this device",
      });
    }
  }

  async function onRequestPayout() {
    if (!payoutMonth) {
      show({ variant: "destructive", title: "Missing month", description: "Select a month to request payment for." });
      return;
    }
    if (!canRequestPayout) {
      show({ variant: "default", title: "No earnings yet", description: payoutGuardMessage });
      return;
    }
    setRequestingPayout(true);
    try {
      await AffiliateAPI.requestPayout(payoutMonth, payoutPercent || 5);
      show({ variant: "success", title: "Payout requested", description: "We will review and notify you once processed." });
      await refreshAll();
    } catch (e: any) {
      show({ variant: "destructive", title: "Failed to request payout", description: e.message || "Try again later" });
    } finally {
      setRequestingPayout(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-24" />))}
        </div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-10 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-emerald-100/40  p-8 text-white shadow-[0_25px_80px_-40px_rgba(255,255,255,0.55)]"
      >
        <div className="absolute inset-0">
          <div className="absolute -top-16 right-10 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100/80">
              Affiliate control hub
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Welcome back, partner. Let’s grow your pharmacy network.
            </h1>
            <p className="text-sm text-emerald-100/80 sm:text-base">
              Monitor conversions, unlock commissions, and manage referral links in one streamlined experience designed to match the new Zemen aesthetic.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Button
                onClick={onCreateLink}
                disabled={!canCreateMore}
                className="group h-12 cursor-pointer rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 px-7 text-sm font-semibold text-white shadow-[0_18px_55px_-30px_rgba(16,185,129,0.7)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-35px_rgba(16,185,129,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/15 text-white transition group-hover:scale-105">
                  <Pointer className="h-4 w-4" />
                </span>
                <LinkIcon className="mr-2 h-4 w-4 transition-transform group-hover:-rotate-6" />
                {createLinkLabel}
              </Button>
              <Button
                onClick={refreshAll}
                variant="outline"
                className="h-11 cursor-pointer rounded-2xl border-white/30 bg-white/5 px-5 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white/15"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh data
              </Button>
            </div>
            <p className="text-xs text-emerald-100/70">
              {links.length} of 2 active links in use · {canCreateMore ? "Generate a new link to start sharing" : "Deactivate one to free a slot"}
            </p>
            <div className="mt-5 space-y-3">
              {links.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-emerald-100/70">
                  <LinkIcon className="h-8 w-8 text-emerald-300" />
                  <p>No referral links yet. Generate one to start sharing.</p>
                </div>
              ) : (
                links.map((l) => {
                  const statusClass = l.active
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-slate-200/30 text-slate-200";
                  return (
                    <div
                      key={l.token}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                          <LinkIcon className="h-4 w-4" /> Referral link
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusClass}`}
                          >
                            {l.active ? "Active" : "Inactive"}
                          </span>
                        </p>
                        <p className="font-mono text-xs text-emerald-100/80 break-all">{l.url}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyLink(l.url)}
                          className="cursor-pointer rounded-xl border-emerald-300/30 bg-emerald-500/10 text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-500/20"
                        >
                          <Copy className="mr-1.5 h-4 w-4" /> Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeactivate(l.token)}
                          disabled={!l.active}
                          className="cursor-pointer rounded-xl border-rose-300/30 bg-rose-500/10 text-rose-100 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Deactivate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRotate(l.token)}
                          className="cursor-pointer rounded-xl border-cyan-300/30 bg-cyan-500/10 text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-500/20"
                        >
                          <RefreshCw className="mr-1.5 h-4 w-4" /> Rotate
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-3 rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur lg:max-w-xs">
            <MiniStat label="Verified pharmacies" value={tenantsCount.toString()} />
            <MiniStat label="Current commission" value={formatCurrency(stats.currentCommission)} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map(({ title, value, description, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * index }}
          >
            <StatCard
              title={title}
              value={value}
              description={description}
              icon={<Icon className="h-5 w-5" />}
            />
          </motion.div>
        ))}
      </motion.div>

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
              <MiniStat label="Percent" value={`${dash?.percent ?? 5}%`} />
              <MiniStat label="Commission" value={formatCurrency(dash?.amount || 0)} />
              <MiniStat label="Referred Pharmacies" value={tenantsCount.toString()} />
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-100/30 bg-emerald-500/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600/80">
                Tenant IDs credited
              </p>
              <div className="mt-3 max-h-40 overflow-auto rounded-xl border border-white/10 p-3 text-white text-xs font-mono shadow-inner">
                {(dash?.tenants || []).length === 0 ? (
                  <p>No pharmacies referred yet this month. Share your link to get started.</p>
                ) : (
                  <ul className="space-y-2">
                    {dash?.tenants?.map((tenant) => (
                      <li key={tenant} className="flex items-center justify-between">
                        <span>{tenant}</span>
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-600">Credited</span>
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
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white">
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
                <label className="text-[11px] font-semibold uppercase tracking-widest text-white">
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
            </div>
            <Button
              onClick={onRequestPayout}
              disabled={requestingPayout || !canRequestPayout}
              className="mt-6 h-11 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 text-sm font-semibold text-white shadow-[0_15px_45px_-25px_rgba(16,185,129,0.65)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestingPayout ? "Submitting..." : "Submit payout request"}
            </Button>
            {!canRequestPayout && (
              <p className="mt-3 text-xs font-medium text-white">
                {payoutGuardMessage}
              </p>
            )}
          </SectionCard>
        </motion.div>
      </div>

      <div className="pb-4" />
    </div>
  );
}
