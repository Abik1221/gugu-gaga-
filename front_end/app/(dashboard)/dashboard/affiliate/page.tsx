"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AffiliateAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

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

  async function onRequestPayout() {
    if (!payoutMonth) {
      show({ variant: "destructive", title: "Missing month", description: "Select a month to request payment for." });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Affiliate Dashboard</h1>
          <p className="text-sm text-gray-500">Track referrals, commissions, and payouts.</p>
        </div>
        <Button onClick={onCreateLink} disabled={!canCreateMore} variant={canCreateMore ? "default" : "outline"}>
          {canCreateMore ? "Create Link" : "Max 2 links reached"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardStat title="Referrals" value={stats.referrals} />
        <CardStat title="Current Month Commission" value={formatCurrency(stats.currentCommission)} />
        <CardStat title="Pending Payouts" value={formatCurrency(stats.pendingPayout)} />
        <CardStat title="Paid To Date" value={formatCurrency(stats.paidPayout)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded bg-white p-4 space-y-3">
          <div>
            <h2 className="text-lg font-semibold">This Month</h2>
            <p className="text-xs text-gray-500">Commission summary for {dash?.month ? `${String(dash.month).padStart(2, "0")}/${dash?.year}` : "current period"}.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStat label="Percent" value={`${dash?.percent ?? 5}%`} />
            <MiniStat label="Commission" value={formatCurrency(dash?.amount || 0)} />
            <MiniStat label="Referred Pharmacies" value={(dash?.tenants?.length || 0).toString()} />
          </div>
          <div className="rounded border bg-slate-50 p-3">
            <p className="text-xs text-gray-600 mb-1">Tenant IDs credited this month:</p>
            <ul className="text-xs text-gray-800 space-y-1 max-h-32 overflow-auto">
              {(dash?.tenants || []).length === 0 ? (
                <li>No pharmacies referred yet this month.</li>
              ) : (
                dash?.tenants?.map((tenant) => <li key={tenant} className="font-mono">{tenant}</li>)
              )}
            </ul>
          </div>
        </div>

        <div className="border rounded bg-white p-4 space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Request Payout</h2>
            <p className="text-xs text-gray-500">Submit a commission payout request for a specific month.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Month (YYYY-MM)</label>
            <Input value={payoutMonth} onChange={(e)=>setPayoutMonth(e.target.value)} placeholder="2025-10" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Commission Percent</label>
            <Input type="number" min={1} max={20} step={0.5} value={payoutPercent} onChange={(e)=>setPayoutPercent(Number(e.target.value))} />
          </div>
          <Button onClick={onRequestPayout} disabled={requestingPayout} className="w-full">
            {requestingPayout ? "Submitting..." : "Submit Payout Request"}
          </Button>
        </div>
      </div>

      <div className="border rounded bg-white">
        <div className="p-3 border-b font-medium flex items-center justify-between">
          <div>Your Referral Links</div>
          <div className="text-xs text-gray-500">Limit: 2 active</div>
        </div>
        <div className="divide-y">
          {links.map((l) => (
            <div key={l.token} className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-mono text-sm break-all">{l.url}</div>
                <div className={`text-xs ${l.active ? "text-emerald-600" : "text-gray-500"}`}>{l.active ? "Active" : "Inactive"}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onDeactivate(l.token)} disabled={!l.active}>Deactivate</Button>
                <Button size="sm" variant="outline" onClick={() => onRotate(l.token)}>Rotate</Button>
              </div>
            </div>
          ))}
          {links.length === 0 && <div className="p-6 text-gray-500">No links yet. Create one to get started.</div>}
        </div>
      </div>
    </div>
  );
}

function CardStat({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="border rounded bg-white p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border rounded bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
