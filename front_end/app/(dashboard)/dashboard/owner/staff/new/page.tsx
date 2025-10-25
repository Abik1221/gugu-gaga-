"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { StaffAPI } from "@/utils/api";

export default function CreateCashierPage() {
  const { show } = useToast();
  const [tenantId, setTenantId] = useState<string | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        // Use AuthAPI.me to get owner's tenant
        const me = await import("@/utils/api").then(m => m.AuthAPI.me());
        setTenantId(me.tenant_id || "");
      } catch {}
    })();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("cashier");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tenantId) { show({ variant: "destructive", title: "Missing Tenant", description: "No tenant context. Please reload or contact admin." }); return; }
    setLoading(true);
    try {
      await StaffAPI.createCashier(tenantId, { email, password, phone, role: "cashier" });
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
          <Input value={tenantId ?? ""} readOnly disabled />
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
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
      </form>
    </div>
  );
}
