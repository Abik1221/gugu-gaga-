"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Affiliate Payouts</h1>
            <div className="flex items-center gap-3">
              <select 
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:border-emerald-500 focus:ring-emerald-500" 
                value={status} 
                onChange={(e)=>setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
              <Input 
                placeholder="Search payouts..." 
                value={q} 
                onChange={(e)=>setQ(e.target.value)} 
                className="w-80 rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500" 
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">All Payouts ({filtered.length})</h2>
          </div>
          
          <div className="overflow-hidden">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600">
              <div className="col-span-2">Payout ID</div>
              <div className="col-span-2">Affiliate User</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1">Percent</div>
              <div className="col-span-2">Month</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-slate-400">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No payouts found</h3>
                <p className="text-slate-500">No affiliate payouts match your current filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((p)=> (
                  <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                    <div className="col-span-2">
                      <div className="font-mono text-sm text-slate-900">#{p.id}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-700">User #{p.affiliate_user_id}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-lg font-semibold text-slate-900">${p.amount?.toFixed?.(2) ?? p.amount}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-slate-700">{p.percent ? `${p.percent}%` : "-"}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-700">{p.month || "-"}</div>
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.status==="pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                        p.status==="approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                        "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      {p.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={()=>approve(p.id)}
                          className="rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        >
                          Approve
                        </Button>
                      )}
                      {p.status !== "paid" && (
                        <Button 
                          size="sm"
                          onClick={()=>markPaid(p.id)}
                          className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
