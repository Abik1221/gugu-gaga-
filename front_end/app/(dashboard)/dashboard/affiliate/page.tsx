"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AffiliateAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type Dashboard = {
  referrals_count: number;
  amount?: number;
  payouts?: { pending_total: number; paid_total: number };
};

type LinkItem = { token: string; url: string; active: boolean };

export default function AffiliateOverviewPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dash, setDash] = useState<Dashboard | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [canCreateMore, setCanCreateMore] = useState(true);

  async function refreshAll() {
    setLoading(true);
    try {
      const [d, l] = await Promise.all([
        AffiliateAPI.dashboard(),
        AffiliateAPI.getLinks(),
      ]);
      setDash(d as any);
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-24" />))}
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
        <h1 className="text-xl font-semibold">Affiliate Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={onCreateLink} disabled={!canCreateMore} variant={canCreateMore ? "default" : "outline"}>
            {canCreateMore ? "Create Link" : "Max 2 links reached"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardStat title="Referrals" value={stats.referrals} />
        <CardStat title="Pending Payout" value={`$${stats.pendingPayout.toFixed(2)}`} />
        <CardStat title="Paid Payout" value={`$${stats.paidPayout.toFixed(2)}`} />
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
