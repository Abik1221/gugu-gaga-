"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

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
        const m = await getAuthJSON<{ id: string; tenant_id?: string }>("/auth/me");
        if (!active) return;
        setMe(m);
        const token = getAccessToken();
        const res = await fetch(`${API_BASE}/admin/users`, {
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
      const res = await fetch(`${API_BASE}/admin/users`, {
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
      const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(id)}`, {
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            <div className="flex items-center gap-3">
              <Input 
                placeholder="Search username or email..." 
                value={q} 
                onChange={(e)=>setQ(e.target.value)} 
                className="w-80 rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500" 
              />
            </div>
          </div>
        </div>

        <form onSubmit={createUser} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Create New User</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
                className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <Input 
                value={username} 
                onChange={(e)=>setUsername(e.target.value)} 
                required 
                className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
                className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit" 
                disabled={creating} 
                className="w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {creating ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">All Users ({filtered.length})</h2>
          </div>
          
          <div className="overflow-hidden">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600">
              <div className="col-span-4">Username</div>
              <div className="col-span-4">Email Address</div>
              <div className="col-span-2">User ID</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-slate-400">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No users found</h3>
                <p className="text-slate-500">Try adjusting your search criteria or create a new user.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((u)=> (
                  <div key={u.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                    <div className="col-span-4">
                      <div className="font-medium text-slate-900">{u.username || "-"}</div>
                    </div>
                    <div className="col-span-4">
                      <div className="text-slate-700">{u.email || "-"}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-slate-500 font-mono">{u.id}</div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Link 
                        href={`/dashboard/admin/users/${encodeURIComponent(u.id)}/roles`} 
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Manage Roles
                      </Link>
                      <button 
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors" 
                        onClick={()=>deleteUser(String(u.id))}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
