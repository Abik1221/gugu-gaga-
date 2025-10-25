"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Me = { id: string; tenant_id?: string };

type CommissionRow = {
  id: string;
  affiliate: string;
  amount: number;
  currency: string;
  status: string;
  earned_at: string;
};

export default function CommissionsListPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [rows, setRows] = useState<CommissionRow[]>([]);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "approved" | "paid">("all");
  const [range, setRange] = useState<"all" | "7" | "30" | "90">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const m = await getAuthJSON<Me>("/api/v1/auth/me");
        if (!active) return;
        setMe(m);
        const token = getAccessToken();
        const res = await fetch(`${API_BASE}/api/v1/admin/commissions`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(m?.tenant_id ? { "X-Tenant-ID": m.tenant_id } : {}),
          },
        });
        if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load"));
        const data = (await res.json()) as CommissionRow[];
        if (!active) return;
        setRows(data);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load commissions");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const now = Date.now();
    let list = rows;
    if (status !== "all") list = list.filter(r => r.status.toLowerCase() === status);
    if (range !== "all") {
      const days = Number(range);
      const since = now - days * 24 * 60 * 60 * 1000;
      list = list.filter(r => new Date(r.earned_at).getTime() >= since);
    }
    if (query) list = list.filter(r => r.affiliate.toLowerCase().includes(query));
    return list;
  }, [rows, q, status, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  useEffect(() => { setPage(1); }, [q, status, range, pageSize]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => (<Skeleton key={i} className="h-14" />))}</div>
      </div>
    );
  }
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Commissions</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search affiliate" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
          <select value={status} onChange={e=>setStatus(e.target.value as any)} className="border rounded px-2 py-2 text-sm">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
          <select value={range} onChange={e=>setRange(e.target.value as any)} className="border rounded px-2 py-2 text-sm">
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} className="border rounded px-2 py-2 text-sm">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="border rounded bg-white divide-y">
        <div className="grid grid-cols-12 p-3 text-xs text-gray-600">
          <div className="col-span-4">Affiliate</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Currency</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Earned At</div>
        </div>
        {paged.map((r)=> (
          <div key={r.id} className="grid grid-cols-12 p-3 items-center">
            <div className="col-span-4 truncate">{r.affiliate}</div>
            <div className="col-span-2">{Number(r.amount).toFixed(2)}</div>
            <div className="col-span-2">{r.currency}</div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 rounded ${r.status.toLowerCase()==="pending"?"bg-amber-50 text-amber-700":r.status.toLowerCase()==="approved"?"bg-emerald-50 text-emerald-700":"bg-blue-50 text-blue-700"}`}>{r.status}</span>
            </div>
            <div className="col-span-2 text-xs text-gray-600">{new Date(r.earned_at).toLocaleDateString()}</div>
          </div>
        ))}
        {paged.length === 0 && <div className="p-6 text-gray-500">No results.</div>}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>Page {pageSafe} of {totalPages} • {filtered.length} result(s)</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={pageSafe<=1}>Previous</Button>
          <Button variant="outline" onClick={()=>setPage(p=>Math.min(totalPages, p+1))} disabled={pageSafe>=totalPages}>Next</Button>
        </div>
      </div>
    </div>
  );
}
