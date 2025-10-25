"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Me = { id: string; tenant_id?: string };

type AffiliateRow = {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  verified: boolean;
};

export default function AffiliatesListPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [rows, setRows] = useState<AffiliateRow[]>([]);

  const [q, setQ] = useState("");
  const [verified, setVerified] = useState<"all" | "verified" | "unverified">("all");
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
        const res = await fetch(`${API_BASE}/api/v1/admin/affiliates`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(m?.tenant_id ? { "X-Tenant-ID": m.tenant_id } : {}),
          },
        });
        if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load"));
        const data = (await res.json()) as AffiliateRow[];
        if (!active) return;
        setRows(data);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load affiliates");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = rows;
    if (verified !== "all") {
      list = list.filter(r => (verified === "verified" ? r.verified : !r.verified));
    }
    if (query) {
      list = list.filter(r =>
        r.full_name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.referral_code.toLowerCase().includes(query)
      );
    }
    return list;
  }, [rows, q, verified]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  useEffect(() => { setPage(1); }, [q, verified, pageSize]);

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
        <h1 className="text-xl font-semibold">Affiliates</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search name, email, code" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
          <select value={verified} onChange={e=>setVerified(e.target.value as any)} className="border rounded px-2 py-2 text-sm">
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
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
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Referral Code</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        {paged.map((r)=> (
          <div key={r.id} className="grid grid-cols-12 p-3 items-center">
            <div className="col-span-4 truncate">{r.full_name}</div>
            <div className="col-span-4 truncate text-gray-700">{r.email}</div>
            <div className="col-span-3 font-mono text-sm">{r.referral_code}</div>
            <div className="col-span-1 text-right">
              <span className={`text-xs px-2 py-1 rounded ${r.verified ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-600"}`}>{r.verified ? "Verified" : "Waiting"}</span>
            </div>
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
