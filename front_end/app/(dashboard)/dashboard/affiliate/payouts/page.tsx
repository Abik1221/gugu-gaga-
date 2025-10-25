"use client";
import React, { useEffect, useState } from "react";
import { AffiliateAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function AffiliatePayoutsPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [items, setItems] = useState<Array<{ id:number; month?:string; percent?:number; amount:number; status:string }>>([]);
  const [month, setMonth] = useState("");
  const [percent, setPercent] = useState("5");

  async function refresh() {
    setLoading(true);
    try {
      const rows = await AffiliateAPI.payouts(status || undefined);
      setItems(rows || []);
      setError(null);
    } catch (e:any) {
      setError(e.message || "Failed to load");
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, [status]);

  async function requestPayout() {
    try {
      const p = Number(percent) || 5;
      await AffiliateAPI.requestPayout(month || undefined, p);
      show({ variant: "success", title: "Payout requested" });
      setMonth("");
      refresh();
    } catch (e:any) {
      show({ variant: "destructive", title: "Request failed", description: e.message });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Affiliate · Payouts</h1>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-3 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <div>
            <div className="text-xs text-gray-600 mb-1">Month (YYYY-MM)</div>
            <Input placeholder="2025-10" value={month} onChange={(e)=>setMonth(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Percent</div>
            <Input type="number" min="1" max="20" step="0.5" value={percent} onChange={(e)=>setPercent(e.target.value)} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={requestPayout}>Request Payout</Button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">Note: Admin manually approves and pays after verifying your referred pharmacies generate revenue.</div>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Month</th>
                <th className="px-3 py-2 text-left">Percent</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((r)=> (
                <tr key={r.id}>
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.month || "-"}</td>
                  <td className="px-3 py-2">{r.percent ?? "-"}</td>
                  <td className="px-3 py-2">{r.amount?.toFixed?.(2) ?? r.amount}</td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="px-3 py-4 text-gray-500" colSpan={5}>No payouts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
