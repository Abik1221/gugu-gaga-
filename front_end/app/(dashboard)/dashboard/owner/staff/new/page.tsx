"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { StaffAPI } from "@/utils/api";

export default function CreateCashierPage() {
  const { show } = useToast();
  const [tenantId, setTenantId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("cashier");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tenantId) { show({ variant: "destructive", title: "Missing Tenant", description: "Provide X-Tenant-ID" }); return; }
    setLoading(true);
    try {
      await StaffAPI.createCashier(tenantId, { email, password, phone, role });
      show({ variant: "success", title: "Cashier created", description: email });
      setEmail(""); setPassword(""); setPhone("");
    } catch (e:any) {
      show({ variant: "destructive", title: "Failed", description: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Create Cashier</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Tenant ID</label>
          <Input placeholder="tenant-id" value={tenantId} onChange={(e)=>setTenantId(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <Input value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Role</label>
          <select className="w-full border rounded px-3 py-2" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="cashier">cashier</option>
            <option value="staff">staff</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
      </form>
    </div>
  );
}
