"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

type Payout = {
  id: string;
  affiliate_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
  approved_at?: string;
  paid_at?: string;
  reference?: string;
};

export default function AdminPayoutsPage() {
  const { show } = useToast();
  const [meLoading, setMeLoading] = useState(true);
  const [me, setMe] = useState<{ id: string; tenant_id?: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Payout[]>([]);
  const [q, setQ] = useState("");

  const [creating, setCreating] = useState(false);
  const [affiliateId, setAffiliateId] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const m = await getAuthJSON<{ id: string; tenant_id?: string }>("/api/v1/auth/me");
        if (!active) return;
        setMe(m);
      } finally {
        if (active) setMeLoading(false);
      }
    }
    load();
    return () => { active = false };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadPayouts() {
      setLoading(true);
      try {
        const token = getAccessToken();
        const res = await fetch(`${API_BASE}/api/v1/admin/payouts`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(await res.text().catch(()=>"Failed to load payouts"));
        const data = await res.json();
        if (!active) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Failed to load payouts", description: e.message || "" });
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPayouts();
    return () => { active = false };
  }, [show]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(r =>
      r.id.toLowerCase().includes(query) ||
      r.affiliate_id.toLowerCase().includes(query) ||
      (r.reference || "").toLowerCase().includes(query) ||
      r.status.toLowerCase().includes(query)
    );
  }, [rows, q]);

  async function createPayout(e: React.FormEvent) {
    e.preventDefault();
    if (!affiliateId || !amount) return;
    setCreating(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/admin/payouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ affiliate_id: affiliateId, amount: Number(amount), reference }),
      });
      if (!res.ok) throw new Error(await res.text().catch(()=>"Failed to create payout"));
      show({ variant: "success", title: "Payout created" });
      setAffiliateId(""); setAmount(""); setReference("");
      // refresh
      const r = await fetch(`${API_BASE}/api/v1/admin/payouts`, { headers: { ...(getAccessToken()? { Authorization: `Bearer ${getAccessToken()}` } : {}), "Content-Type": "application/json" } });
      setRows(await r.json());
    } catch (e: any) {
      show({ variant: "destructive", title: "Create failed", description: e.message || "" });
    } finally {
      setCreating(false);
    }
  }

  async function approve(id: string) {
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/admin/payouts/approve/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text().catch(()=>"Approve failed"));
      show({ variant: "success", title: "Payout approved" });
      setRows((prev)=> prev.map(p=> p.id===id ? { ...p, status: "approved", approved_at: new Date().toISOString() } : p));
    } catch (e: any) {
      show({ variant: "destructive", title: "Approve failed", description: e.message || "" });
    }
  }

  async function markPaid(id: string) {
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/admin/payouts/paid/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text().catch(()=>"Mark paid failed"));
      show({ variant: "success", title: "Payout marked paid" });
      setRows((prev)=> prev.map(p=> p.id===id ? { ...p, status: "paid", paid_at: new Date().toISOString() } : p));
    } catch (e: any) {
      show({ variant: "destructive", title: "Mark paid failed", description: e.message || "" });
    }
  }

  if (meLoading || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => (<Skeleton key={i} className="h-14" />))}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payouts</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search id/affiliate/status/reference" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
        </div>
      </div>

      <form onSubmit={createPayout} className="border rounded bg-white p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label className="text-sm">Affiliate ID</label>
          <Input value={affiliateId} onChange={(e)=>setAffiliateId(e.target.value)} placeholder="aff-uuid" required />
        </div>
        <div>
          <label className="text-sm">Amount</label>
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e)=>setAmount(e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Reference (optional)</label>
          <Input value={reference} onChange={(e)=>setReference(e.target.value)} placeholder="eg. August commissions" />
        </div>
        <div className="flex items-end justify-end">
          <Button type="submit" disabled={creating}>{creating?"Creating...":"Create Payout"}</Button>
        </div>
      </form>

      <div className="border rounded bg-white divide-y">
        <div className="grid grid-cols-12 p-3 text-xs text-gray-600">
          <div className="col-span-3">ID</div>
          <div className="col-span-2">Affiliate ID</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">Currency</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.map((p)=> (
          <div key={p.id} className="grid grid-cols-12 p-3 items-center">
            <div className="col-span-3 truncate text-xs text-gray-600">{p.id}</div>
            <div className="col-span-2 truncate text-xs text-gray-600">{p.affiliate_id}</div>
            <div className="col-span-2">{p.amount.toFixed(2)}</div>
            <div className="col-span-1">{p.currency}</div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 rounded ${p.status==="pending"?"bg-amber-50 text-amber-700":p.status==="approved"?"bg-emerald-50 text-emerald-700":"bg-blue-50 text-blue-700"}`}>{p.status}</span>
            </div>
            <div className="col-span-2 text-right flex justify-end gap-2">
              {p.status === "pending" && <Button variant="outline" onClick={()=>approve(p.id)}>Approve</Button>}
              {p.status !== "paid" && <Button onClick={()=>markPaid(p.id)}>Mark Paid</Button>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-6 text-gray-500">No payouts yet.</div>}
      </div>
    </div>
  );
}
