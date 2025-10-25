"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminAuditPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [action, setAction] = useState("");
  const [limit, setLimit] = useState("50");

  async function refresh() {
    setLoading(true);
    try {
      const lim = Math.max(1, Math.min(200, Number(limit) || 50));
      const rows = await AdminAPI.audit({ tenant_id: tenantId || undefined, action: action || undefined, limit: lim });
      setItems(rows || []);
      setError(null);
    } catch (e:any) {
      setError(e.message || "Failed to load audit");
      show({ variant:"destructive", title:"Error", description: e.message });
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin · Audit Trail</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Tenant ID (optional)" value={tenantId} onChange={(e)=>setTenantId(e.target.value)} />
          <Input placeholder="Action (optional)" value={action} onChange={(e)=>setAction(e.target.value)} />
          <Input placeholder="Limit" value={limit} onChange={(e)=>setLimit(e.target.value)} className="w-24" />
          <Button onClick={refresh}>Filter</Button>
        </div>
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
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Tenant</th>
                <th className="px-3 py-2 text-left">Actor</th>
                <th className="px-3 py-2 text-left">Action</th>
                <th className="px-3 py-2 text-left">Target</th>
                <th className="px-3 py-2 text-left">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((r)=> (
                <tr key={r.id}>
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.created_at || '-'}</td>
                  <td className="px-3 py-2">{r.tenant_id || '-'}</td>
                  <td className="px-3 py-2">{r.actor_user_id ?? '-'}</td>
                  <td className="px-3 py-2">{r.action}</td>
                  <td className="px-3 py-2">{r.target_type || '-'} {r.target_id ? `#${r.target_id}` : ''}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 whitespace-pre-wrap">{JSON.stringify(r.metadata || {}, null, 0)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="px-3 py-4 text-gray-500" colSpan={7}>No events</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
