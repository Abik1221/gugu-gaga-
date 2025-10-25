"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Me = { id: string; tenant_id?: string };

type AffiliateRow = {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  verified: boolean;
};

type CommissionRow = {
  id: string;
  affiliate: string;
  amount: number;
  currency: string;
  status: string;
  earned_at: string;
};

export default function AffiliateOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [stats, setStats] = useState<{ clicks: number; referrals: number; conversion_rate: number; commissions: number } | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const m = await getAuthJSON<Me>("/api/v1/auth/me");
        if (!active) return;
        setMe(m);
        const token = getAccessToken();
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(m?.tenant_id ? { "X-Tenant-ID": m.tenant_id } : {}),
        };
        const [affRes, comRes, stRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/admin/affiliates`, { headers }),
          fetch(`${API_BASE}/api/v1/admin/commissions`, { headers }),
          fetch(`${API_BASE}/api/v1/affiliate/stats`, { headers }),
        ]);
        if (!affRes.ok) throw new Error(await affRes.text().catch(() => "Failed to load affiliates"));
        if (!comRes.ok) throw new Error(await comRes.text().catch(() => "Failed to load commissions"));
        if (!stRes.ok) throw new Error(await stRes.text().catch(() => "Failed to load stats"));
        const affData = (await affRes.json()) as AffiliateRow[];
        const comData = (await comRes.json()) as CommissionRow[];
        const stData = (await stRes.json()) as { clicks: number; referrals: number; conversion_rate: number; commissions: number };
        if (!active) return;
        setAffiliates(affData);
        setCommissions(comData);
        setStats(stData);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load affiliate data");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false };
  }, []);

  const agg = useMemo(() => {
    const totalAff = affiliates.length;
    const verified = affiliates.filter(a => a.verified).length;
    const totalCom = commissions.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const pendingCom = commissions.filter(c => String(c.status).toLowerCase() === "pending").length;
    return { totalAff, verified, totalCom, pendingCom };
  }, [affiliates, commissions]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-24" />))}
        </div>
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  const recentAff = affiliates.slice(0, 5);
  const recentCom = commissions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Affiliate Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/affiliate/register"><Button variant="outline">Register as Affiliate</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardStat title="Total Affiliates" value={agg.totalAff} />
        <CardStat title="Verified Affiliates" value={agg.verified} />
        <CardStat title="Total Commissions" value={`$${agg.totalCom.toFixed(2)}`} />
        <CardStat title="Pending Commissions" value={agg.pendingCom} />
        {stats && (
          <>
            <CardStat title="Clicks" value={stats.clicks} />
            <CardStat title="Referrals" value={stats.referrals} />
            <CardStat title="Conversion Rate" value={`${stats.conversion_rate}%`} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded bg-white">
          <div className="p-3 border-b font-medium">Recent Affiliates</div>
          <div className="divide-y">
            {recentAff.map((a) => (
              <div key={a.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.full_name}</div>
                  <div className="text-xs text-gray-500">{a.email} · Code: {a.referral_code}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${a.verified ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-600"}`}>
                  {a.verified ? "Verified" : "Unverified"}
                </div>
              </div>
            ))}
            {recentAff.length === 0 && <div className="p-6 text-gray-500">No affiliates yet.</div>}
          </div>
        </div>
        <div className="border rounded bg-white">
          <div className="p-3 border-b font-medium">Recent Commissions</div>
          <div className="divide-y">
            {recentCom.map((c) => (
              <div key={c.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.affiliate}</div>
                  <div className="text-xs text-gray-500">{new Date(c.earned_at).toLocaleString()}</div>
                </div>
                <div className="text-sm font-medium">{c.currency} {Number(c.amount).toFixed(2)}</div>
              </div>
            ))}
            {recentCom.length === 0 && <div className="p-6 text-gray-500">No commissions yet.</div>}
          </div>
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
