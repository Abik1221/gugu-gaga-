"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface PharmaciesResponse {
  total: number;
  items: Array<{ tenant_id: string; name: string; kyc_status?: string | null; subscription?: { blocked?: boolean | null } }>;
}

interface AffiliatesResponse {
  total: number;
  items: Array<{ user_id: number; email: string; referrals: number; payouts?: { pending_total?: number; paid_total?: number } }>;
}

interface PayoutRow {
  id: number;
  status: string;
  amount: number;
  month: string;
}

export default function AdminOverviewPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmaciesResponse | null>(null);
  const [affiliates, setAffiliates] = useState<AffiliatesResponse | null>(null);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [ph, af, pay] = await Promise.all([
          AdminAPI.pharmacies(1, 5),
          AdminAPI.affiliates(1, 5),
          AdminAPI.listAffiliatePayouts("pending"),
        ]);
        if (!active) return;
        setPharmacies(ph as PharmaciesResponse);
        setAffiliates(af as AffiliatesResponse);
        setPayouts(Array.isArray(pay) ? (pay as PayoutRow[]) : []);
        setError(null);
      } catch (e: any) {
        if (!active) return;
        const msg = e?.message || "Failed to load admin overview";
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
  }, [show]);

  const metrics = {
    pharmacies: pharmacies?.total ?? 0,
    affiliates: affiliates?.total ?? 0,
    payoutQueue: payouts.filter((p) => p.status === "pending").length,
    blockedTenants: (pharmacies?.items || []).filter((p) => p.subscription?.blocked).length,
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
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
          <h1 className="text-xl font-semibold">Admin Overview</h1>
          <p className="text-sm text-gray-500">At-a-glance snapshot of tenants, affiliates, and payouts.</p>
        </div>
        <Button variant="outline" onClick={() => location.reload()}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard title="Total Pharmacies" value={metrics.pharmacies} href="/dashboard/admin/pharmacies" />
        <SummaryCard title="Total Affiliates" value={metrics.affiliates} href="/dashboard/admin/affiliates" />
        <SummaryCard title="Pending Payouts" value={metrics.payoutQueue} href="/dashboard/admin/payouts" />
        <SummaryCard title="Blocked Tenants" value={metrics.blockedTenants} href="/dashboard/admin/pharmacies" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="border rounded bg-white">
          <header className="p-3 border-b flex items-center justify-between">
            <div className="font-medium">Recently Registered Pharmacies</div>
            <Link href="/dashboard/admin/pharmacies" className="text-xs text-emerald-600 underline">View all</Link>
          </header>
          <div className="divide-y">
            {(pharmacies?.items || []).length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No pharmacies yet.</div>
            ) : (
              pharmacies!.items.map((p) => (
                <div key={p.tenant_id} className="p-3">
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500 flex gap-3 mt-1">
                    <span>KYC: {p.kyc_status ?? "pending"}</span>
                    <span>Status: {p.subscription?.blocked ? "Blocked" : "Active"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="border rounded bg-white">
          <header className="p-3 border-b flex items-center justify-between">
            <div className="font-medium">Active Affiliates</div>
            <Link href="/dashboard/admin/affiliates" className="text-xs text-emerald-600 underline">Manage</Link>
          </header>
          <div className="divide-y">
            {(affiliates?.items || []).length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No affiliates yet.</div>
            ) : (
              affiliates!.items.map((a) => (
                <div key={a.user_id} className="p-3">
                  <div className="font-medium text-sm">{a.email}</div>
                  <div className="text-xs text-gray-500 flex gap-3 mt-1">
                    <span>Referrals: {a.referrals}</span>
                    <span>Pending ${a.payouts?.pending_total?.toFixed?.(2) ?? "0.00"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="border rounded bg-white p-4 block hover:shadow-sm transition">
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </Link>
  );
}
