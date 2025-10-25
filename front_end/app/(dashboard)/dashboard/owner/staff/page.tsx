"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, StaffAPI, PharmaciesAPI } from "@/utils/api";

export default function StaffListPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh(tid: string) {
    setLoading(true);
    try {
      const rows = await StaffAPI.list(tid);
      setItems(rows || []);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load staff");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const me = await AuthAPI.me();
        const ph = await PharmaciesAPI.list(1, 100);
        const items = ph?.items || [];
        setPharmacies(items);
        const defaultTid = me?.tenant_id || (items[0]?.tenant_id ?? null);
        if (defaultTid) { setTenantId(defaultTid); await refresh(defaultTid); }
        else { setError("No tenant context. Please ensure you are an owner."); setLoading(false); }
      } catch (e:any) {
        setError(e.message || "Failed to load user");
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Staff</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/owner/staff/new"><Button>Create Cashier</Button></Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">Active Pharmacy</div>
        <select
          className="border rounded px-2 py-1"
          value={tenantId ?? ""}
          onChange={async (e)=>{ const tid = e.target.value || null; setTenantId(tid); if (tid) await refresh(tid); }}
        >
          {pharmacies.map((p:any)=>(<option key={p.tenant_id} value={p.tenant_id}>{p.name} ({p.tenant_id})</option>))}
        </select>
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
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((u)=> (
                <tr key={u.id}>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.phone || "-"}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={async ()=>{
                        if (!tenantId) return;
                        try { await StaffAPI.update(tenantId, u.id, { is_active: false }); show({ variant:"success", title:"Suspended", description:u.email }); await refresh(tenantId); } catch(e:any){ show({ variant:"destructive", title:"Failed", description:e.message }); }
                      }}>Suspend</Button>
                      <Button variant="outline" onClick={async ()=>{
                        if (!tenantId) return;
                        try { await StaffAPI.update(tenantId, u.id, { is_active: true }); show({ variant:"success", title:"Activated", description:u.email }); await refresh(tenantId); } catch(e:any){ show({ variant:"destructive", title:"Failed", description:e.message }); }
                      }}>Activate</Button>
                      <Button variant="destructive" onClick={async ()=>{
                        if (!tenantId) return;
                        if (!confirm(`Remove ${u.email}?`)) return;
                        try { await StaffAPI.remove(tenantId, u.id); show({ variant:"success", title:"Removed", description:u.email }); await refresh(tenantId); } catch(e:any){ show({ variant:"destructive", title:"Failed", description:e.message }); }
                      }}>Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (<tr><td className="px-3 py-4 text-gray-500" colSpan={4}>No staff yet.</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
