"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function AdminUsersPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ id: string; tenant_id?: string } | null>(null);
  const [rows, setRows] = useState<any[]>([]);

  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const m = await getAuthJSON<{ id: string; tenant_id?: string }>("/api/v1/auth/me");
        if (!active) return;
        setMe(m);
        const token = getAccessToken();
        const res = await fetch(`${API_BASE}/api/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load"));
        const data = await res.json();
        if (!active) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Failed to load users", description: e.message || "" });
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false };
  }, [show]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((r) =>
      String(r.username || "").toLowerCase().includes(query) ||
      String(r.email || "").toLowerCase().includes(query)
    );
  }, [rows, q]);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !username || !password) return;
    setCreating(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email, username, password }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create"));
      const u = await res.json();
      setRows((prev) => [u, ...prev]);
      setEmail(""); setUsername(""); setPassword("");
      show({ variant: "success", title: "User created" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Create failed", description: e.message || "" });
    } finally {
      setCreating(false);
    }
  }

  async function deleteUser(id: string) {
    if (typeof window !== "undefined" && !window.confirm("Delete this user?")) return;
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok && res.status !== 204) throw new Error(await res.text().catch(() => "Failed to delete"));
      setRows((prev) => prev.filter((r) => String(r.id) !== String(id)));
      show({ variant: "success", title: "User deleted" });
    } catch (e: any) {
      show({ variant: "destructive", title: "Delete failed", description: e.message || "" });
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => (<Skeleton key={i} className="h-14" />))}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search username/email" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
        </div>
      </div>

      <form onSubmit={createUser} className="border rounded bg-white p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Username</label>
          <Input value={username} onChange={(e)=>setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <div className="md:col-span-2 flex items-end justify-end">
          <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create User"}</Button>
        </div>
      </form>

      <div className="border rounded bg-white divide-y">
        <div className="grid grid-cols-12 p-3 text-xs text-gray-600">
          <div className="col-span-4">Username</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">ID</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.map((u)=> (
          <div key={u.id} className="grid grid-cols-12 p-3 items-center">
            <div className="col-span-4 truncate">{u.username || "-"}</div>
            <div className="col-span-4 truncate">{u.email || "-"}</div>
            <div className="col-span-2 truncate text-xs text-gray-600">{u.id}</div>
            <div className="col-span-2 text-right flex justify-end gap-2">
              <Link href={`/dashboard/admin/users/${encodeURIComponent(u.id)}/roles`} className="text-sm border rounded px-2 py-1 hover:bg-gray-50">Roles</Link>
              <button className="text-sm border rounded px-2 py-1 hover:bg-gray-50" onClick={()=>deleteUser(String(u.id))}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-6 text-gray-500">No users found.</div>}
      </div>
    </div>
  );
}
