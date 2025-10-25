"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AdminAPI, AuthAPI } from "@/utils/api";

type Payout = {
  id: number;
  affiliate_user_id: number;
  tenant_id?: string | null;
  month?: string | null;
  percent?: number | null;
  amount: number;
  status: string;
};

export default function AdminPayoutsPage() {
  const { show } = useToast();
  const [meLoading, setMeLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Payout[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async function loadMe() {
      try { const m = await AuthAPI.me(); if (active) setMe(m); } finally { if (active) setMeLoading(false); }
    })();
    return () => { active = false };
  }, []);

  async function loadPayouts() {
    setLoading(true);
    try {
      const data = await AdminAPI.listAffiliatePayouts(status || undefined);
      setRows(Array.isArray(data) ? data : []);
    } catch (e:any) {
      show({ variant: "destructive", title: "Failed to load payouts", description: e.message });
    } finally { setLoading(false); }
  }

  useEffect(() => { loadPayouts(); }, [status]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(r =>
      String(r.id).toLowerCase().includes(query) ||
      String(r.affiliate_user_id).toLowerCase().includes(query) ||
      (r.tenant_id || "").toLowerCase().includes(query) ||
      (r.month || "").toLowerCase().includes(query) ||
      (r.status || "").toLowerCase().includes(query)
    );
  }, [rows, q]);

  async function markPaid(id: number) {
    try { await AdminAPI.markPayoutPaid(id); show({ variant: "success", title: "Payout marked paid" }); await loadPayouts(); }
    catch(e:any){ show({ variant:"destructive", title:"Mark paid failed", description:e.message }); }
  }

  async function approve(id: number) {
    try { await AdminAPI.approvePayout(id); show({ variant: "success", title: "Payout approved" }); await loadPayouts(); }
    catch(e:any){ show({ variant:"destructive", title:"Approve failed", description:e.message }); }
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
          <select className="border rounded px-2 py-1" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
          <Input placeholder="Search id/affiliate/tenant/month/status" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
        </div>
      </div>

      <div className="border rounded bg-white divide-y">
        <div className="grid grid-cols-12 p-3 text-xs text-gray-600">
          <div className="col-span-3">ID</div>
          <div className="col-span-2">Affiliate User</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">Percent</div>
          <div className="col-span-2">Month</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.map((p)=> (
          <div key={p.id} className="grid grid-cols-12 p-3 items-center">
            <div className="col-span-3 truncate text-xs text-gray-600">{p.id}</div>
            <div className="col-span-2 truncate text-xs text-gray-600">{p.affiliate_user_id}</div>
            <div className="col-span-2">{p.amount?.toFixed?.(2) ?? p.amount}</div>
            <div className="col-span-1">{p.percent ?? "-"}</div>
            <div className="col-span-2">{p.month || "-"}</div>
            <div className="col-span-1">
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
