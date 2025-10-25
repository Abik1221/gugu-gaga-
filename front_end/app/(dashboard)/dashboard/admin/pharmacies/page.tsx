"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminPharmaciesPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [tenantId, setTenantId] = useState("");

  async function refresh(page = 1) {
    setLoading(true);
    try {
      const data = await AdminAPI.pharmacies(page, 20, q);
      setItems(data.items || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load pharmacies");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin · Pharmacies</h1>
        <div className="flex gap-2">
          <Input placeholder="Search by name" value={q} onChange={(e)=>setQ(e.target.value)} />
          <Button onClick={()=>refresh(1)}>Search</Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Tenant ID for actions</label>
        <Input placeholder="tenant-id" value={tenantId} onChange={(e)=>setTenantId(e.target.value)} className="max-w-sm" />
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
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Tenant</th>
                <th className="px-3 py-2 text-left">Owner</th>
                <th className="px-3 py-2 text-left">KYC</th>
                <th className="px-3 py-2 text-left">Subscription</th>
                <th className="px-3 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.tenant_id}</td>
                  <td className="px-3 py-2">{r.owner_email} <div className="text-xs text-gray-500">{r.owner_phone}</div></td>
                  <td className="px-3 py-2">{r.kyc_status || "-"}</td>
                  <td className="px-3 py-2">{r.subscription?.blocked ? "Blocked" : "Active"} <div className="text-xs text-gray-500">Due: {r.subscription?.next_due_date || "-"}</div></td>
                  <td className="px-3 py-2 text-xs">{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((r) => (
                <tr key={`actions-${r.id}`}>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={async ()=>{
                          try {
                            if (!tenantId) { show({ variant: "destructive", title: "Missing Tenant", description: "Set Tenant ID first" }); return; }
                            if (!r.kyc_id) { show({ variant: "destructive", title: "No KYC", description: "No pending KYC for this pharmacy" }); return; }
                            await AdminAPI.approvePharmacy(tenantId, r.kyc_id);
                            show({ variant: "success", title: "Approved", description: r.name });
                            refresh();
                          } catch (e:any) { show({ variant: "destructive", title: "Approve failed", description: e.message }); }
                        }}
                      >Approve</Button>
                      <Button
                        variant="outline"
                        onClick={async ()=>{
                          try {
                            if (!tenantId) { show({ variant: "destructive", title: "Missing Tenant", description: "Set Tenant ID first" }); return; }
                            if (!r.kyc_id) { show({ variant: "destructive", title: "No KYC", description: "No pending KYC for this pharmacy" }); return; }
                            await AdminAPI.rejectPharmacy(tenantId, r.kyc_id);
                            show({ variant: "success", title: "Rejected", description: r.name });
                            refresh();
                          } catch (e:any) { show({ variant: "destructive", title: "Reject failed", description: e.message }); }
                        }}
                      >Reject</Button>
                      <Button
                        variant="outline"
                        onClick={async ()=>{
                          try {
                            const code = prompt("Enter payment code to verify");
                            if (!tenantId || !code) { show({ variant: "destructive", title: "Missing", description: "Tenant ID and code required" }); return; }
                            await AdminAPI.verifyPayment(tenantId, code);
                            show({ variant: "success", title: "Payment verified", description: code });
                          } catch (e:any) { show({ variant: "destructive", title: "Verify failed", description: e.message }); }
                        }}
                      >Verify Payment</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="px-3 py-4 text-gray-500" colSpan={1}>No pharmacies</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
