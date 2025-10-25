"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, ChatAPI, PharmaciesAPI } from "@/utils/api";

export default function ChatThreadsPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [threads, setThreads] = useState<Array<{id:number; title:string}>>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh(tid: string) {
    setLoading(true);
    try {
      const rows = await ChatAPI.listThreads(tid);
      setThreads(rows || []);
      setError(null);
    } catch (e:any) {
      setError(e.message || "Failed to load threads");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async ()=>{
      try {
        const me = await AuthAPI.me();
        const ph = await PharmaciesAPI.list(1, 100);
        const items = ph?.items || [];
        setPharmacies(items);
        const defaultTid = me?.tenant_id || (items[0]?.tenant_id ?? null);
        if (defaultTid) { setTenantId(defaultTid); await refresh(defaultTid); }
        else { setError("No tenant context"); setLoading(false); }
      } catch (e:any) { setError(e.message || "Failed"); setLoading(false); }
    })();
  }, []);

  async function createThread() {
    if (!tenantId) return;
    try {
      const t = title.trim() || "New chat";
      await ChatAPI.createThread(tenantId, t);
      setTitle("");
      await refresh(tenantId);
    } catch (e:any) { show({ variant: "destructive", title: "Create failed", description: e.message }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chat Threads</h1>
        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-2 py-1"
            value={tenantId ?? ""}
            onChange={async (e)=>{ const tid = e.target.value || null; setTenantId(tid); if (tid) await refresh(tid); }}
          >
            {pharmacies.map((p:any)=>(<option key={p.tenant_id} value={p.tenant_id}>{p.name} ({p.tenant_id})</option>))}
          </select>
          <Input placeholder="Thread title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <Button onClick={createThread} disabled={!tenantId}>Create</Button>
        </div>
      </div>
      {tenantId && (<div className="text-xs text-gray-600">Tenant: <span className="font-mono">{tenantId}</span></div>)}
      {loading ? (<Skeleton className="h-64" />) : error ? (<div className="text-sm text-red-600">{error}</div>) : (
        <div className="grid gap-2">
          {threads.map((t)=> (
            <Link key={t.id} href={`/dashboard/owner/chat/${t.id}`} className="border rounded p-3 hover:bg-gray-50">
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-500">Thread #{t.id}</div>
            </Link>
          ))}
          {threads.length === 0 && <div className="text-sm text-gray-500">No threads yet.</div>}
        </div>
      )}
    </div>
  );
}
