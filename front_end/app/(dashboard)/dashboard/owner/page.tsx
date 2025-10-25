"use client";
import React, { useEffect, useState } from "react";
import { AuthAPI, PharmaciesAPI, ChatAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function OwnerDashboardPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<Array<{ day: string; tokens: number }>>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const me = await AuthAPI.me();
        setUser(me);
        const ph = await PharmaciesAPI.list(1, 20);
        setPharmacies(ph.items || []);
        const tenantId = me?.tenant_id || (ph.items?.[0]?.tenant_id ?? null);
        if (tenantId) {
          try {
            const u = await ChatAPI.usage(tenantId, 14);
            setUsage(Array.isArray(u) ? u : []);
          } catch {}
        }
      } catch (e:any) {
        setError(e.message || "Failed to load dashboard");
        show({ variant: "destructive", title: "Error", description: e.message || "Failed" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Skeleton className="h-64" />;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Owner Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/owner/staff/new"><Button variant="outline">Create Cashier</Button></Link>
          <Link href="/dashboard/owner/chat"><Button variant="outline">Open Chat</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-xs text-gray-500">Role</div>
          <div className="text-lg font-medium">{user?.role}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs text-gray-500">Tenant</div>
          <div className="text-lg font-medium">{user?.tenant_id || "-"}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs text-gray-500">Pharmacies</div>
          <div className="text-lg font-medium">{pharmacies.length}</div>
        </div>
      </div>

      {usage.length > 0 && (
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">AI Usage (last 14 days)</div>
            <div className="text-xs text-gray-500">tokens</div>
          </div>
          <div className="flex items-end gap-1 h-24">
            {usage.map((d)=>{
              const max = Math.max(...usage.map(x=>x.tokens || 0)) || 1;
              const h = Math.max(2, Math.round((d.tokens / max) * 96));
              return (
                <div key={d.day} className="flex flex-col items-center" title={`${d.day}: ${d.tokens}`}>
                  <div className="bg-blue-500 w-4" style={{ height: `${h}px` }} />
                  <div className="text-[10px] text-gray-500 mt-1">{d.day.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Tenant</th>
              <th className="px-3 py-2 text-left">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pharmacies.map((p)=> (
              <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>location.href=`/dashboard/owner/pharmacies/${p.id}/settings`}>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.tenant_id}</td>
                <td className="px-3 py-2">{p.address || "-"}</td>
              </tr>
            ))}
            {pharmacies.length === 0 && (
              <tr><td className="px-3 py-4 text-gray-500" colSpan={3}>No pharmacies yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
