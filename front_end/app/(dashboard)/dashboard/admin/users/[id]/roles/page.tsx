"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function UserRolesPage() {
  const { show } = useToast();
  const params = useParams();
  const userId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        await getAuthJSON("/api/v1/auth/me");
        const token = getAccessToken();
        const [uRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
          fetch(`${API_BASE}/api/v1/roles`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
        ]);
        if (!uRes.ok) throw new Error(await uRes.text().catch(() => "Failed to load user"));
        if (!rRes.ok) throw new Error(await rRes.text().catch(() => "Failed to load roles"));
        const u = await uRes.json();
        const r = await rRes.json();
        if (!active) return;
        setUser(u);
        setRoles(Array.isArray(r) ? r : []);
      } catch (e: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Failed to load", description: e.message || "" });
      } finally {
        if (active) setLoading(false);
      }
    }
    if (userId) load();
    return () => { active = false };
  }, [show, userId]);

  const assignedIds = new Set<string>((user?.roles || []).map((ur: any) => String(ur.role?.id || ur.id)));
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = roles as any[];
    if (q) list = list.filter((r)=> String(r.name||"").toLowerCase().includes(q));
    return list;
  }, [roles, filter]);

  async function assign(roleId: string) {
    setAssigning(roleId);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}/assign-role/${encodeURIComponent(roleId)}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text().catch(()=>"Failed to assign"));
      // Refresh user
      const uRes = await fetch(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const u = await uRes.json();
      setUser(u);
      show({ variant: "success", title: "Role assigned" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Assign failed", description: e.message || "" });
    } finally {
      setAssigning(null);
    }
  }

  async function remove(roleId: string) {
    setAssigning(roleId);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}/remove-role/${encodeURIComponent(roleId)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text().catch(()=>"Failed to remove"));
      // Refresh user
      const uRes = await fetch(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const u = await uRes.json();
      setUser(u);
      show({ variant: "success", title: "Role removed" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Remove failed", description: e.message || "" });
    } finally {
      setAssigning(null);
    }
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><div className="space-y-2">{Array.from({ length: 6 }).map((_,i)=>(<Skeleton key={i} className="h-14"/>))}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">User Roles</h1>
        <Link href="/dashboard/admin/users" className="text-sm border rounded px-2 py-1 hover:bg-gray-50">Back</Link>
      </div>

      <div className="border rounded bg-white p-4">
        <div className="text-sm"><span className="font-medium">User:</span> {user?.username || "-"} ({user?.email || "-"})</div>
        <div className="text-xs text-gray-600">ID: {user?.id}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="font-medium">Available Roles</div>
        <Input placeholder="Filter roles" value={filter} onChange={(e)=>setFilter(e.target.value)} className="w-64" />
      </div>

      <div className="border rounded bg-white divide-y">
        <div className="grid grid-cols-12 p-3 text-xs text-gray-600">
          <div className="col-span-4">Role Name</div>
          <div className="col-span-6">ID</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        {filtered.map((r) => {
          const rid = String(r.id);
          const has = assignedIds.has(rid);
          return (
            <div key={rid} className="grid grid-cols-12 p-3 items-center">
              <div className="col-span-4">{r.name}</div>
              <div className="col-span-6 text-xs text-gray-600 truncate">{rid}</div>
              <div className="col-span-2 text-right">
                {has ? (
                  <Button variant="outline" disabled={assigning===rid} onClick={()=>remove(rid)}>
                    {assigning===rid?"Removing...":"Remove"}
                  </Button>
                ) : (
                  <Button disabled={assigning===rid} onClick={()=>assign(rid)}>
                    {assigning===rid?"Assigning...":"Assign"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div className="p-6 text-gray-500">No roles.</div>}
      </div>
    </div>
  );
}
