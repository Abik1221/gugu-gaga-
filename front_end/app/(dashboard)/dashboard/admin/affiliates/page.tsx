"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminAffiliatesPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [usage, setUsage] = useState<Array<{ day: string; tokens: number }>>([]);

  async function refresh(page = 1) {
    setLoading(true);
    try {
      const data = await AdminAPI.affiliates(page, 20, q);
      setItems(data.items || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load affiliates");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, []);

  useEffect(() => {
    (async () => {
      try { const u = await AdminAPI.usage(14); setUsage(Array.isArray(u) ? u : []); } catch {}
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin · Affiliates</h1>
        <div className="flex gap-2">
          <Input placeholder="Search by email" value={q} onChange={(e)=>setQ(e.target.value)} />
          <Button onClick={()=>refresh(1)}>Search</Button>
        </div>
      </div>
      {usage.length > 0 && (
        <div className="border rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">AI Usage (last 14 days)</div>
            <div className="text-xs text-gray-500">tokens</div>
          </div>
          <div className="flex items-end gap-1 h-20">
            {usage.map((d)=>{
              const max = Math.max(...usage.map(x=>x.tokens || 0)) || 1;
              const h = Math.max(2, Math.round((d.tokens / max) * 80));
              return (
                <div key={d.day} className="flex flex-col items-center" title={`${d.day}: ${d.tokens}`}>
                  <div className="bg-indigo-500 w-3" style={{ height: `${h}px` }} />
                  <div className="text-[10px] text-gray-500 mt-1">{d.day.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {loading ? (
        <Skeleton className="h-64" />
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Full Name</th>
                <th className="px-3 py-2 text-left">Bank</th>
                <th className="px-3 py-2 text-left">Referrals</th>
                <th className="px-3 py-2 text-left">Payouts</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((r) => (
                <tr key={r.user_id}>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.full_name || "-"}</td>
                  <td className="px-3 py-2">{r.bank_name || "-"} <div className="text-xs text-gray-500">{r.bank_account_name} · {r.bank_account_number}</div></td>
                  <td className="px-3 py-2">{r.referrals}</td>
                  <td className="px-3 py-2 text-xs">Pending ${r.payouts?.pending_total?.toFixed?.(2) || 0} · Paid ${r.payouts?.paid_total?.toFixed?.(2) || 0}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={async ()=>{ try { await AdminAPI.approveAffiliate(r.user_id); show({ variant: "success", title: "Approved", description: r.email }); refresh(); } catch (e:any){ show({ variant:"destructive", title:"Failed", description:e.message }); } }}>Approve</Button>
                      <Button variant="outline" onClick={async ()=>{ try { await AdminAPI.rejectAffiliate(r.user_id); show({ variant: "success", title: "Rejected", description: r.email }); refresh(); } catch (e:any){ show({ variant:"destructive", title:"Failed", description:e.message }); } }}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="px-3 py-4 text-gray-500" colSpan={6}>No affiliates</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
