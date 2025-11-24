"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { AuthAPI, ChatAPI, PharmaciesAPI } from "@/utils/api";

export default function ChatThreadsPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [threads, setThreads] = useState<Array<{ id: number; title: string }>>(
    []
  );
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh(tid: string) {
    setLoading(true);
    try {
      const rows = await ChatAPI.listThreads(tid);
      setThreads(rows || []);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load threads");
      show({
        variant: "destructive",
        title: "Error",
        description: e.message || "Failed",
      });
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
        if (defaultTid) {
          setTenantId(defaultTid);
          await refresh(defaultTid);
        } else {
          setError("No tenant context");
          setLoading(false);
        }
      } catch (e: any) {
        setError(e.message || "Failed");
        setLoading(false);
      }
    })();
  }, []);

  async function createThread() {
    if (!tenantId) return;
    try {
      const t = title.trim() || "New chat";
      await ChatAPI.createThread(tenantId, t);
      setTitle("");
      await refresh(tenantId);
    } catch (e: any) {
      show({
        variant: "destructive",
        title: "Create failed",
        description: e.message,
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Chat Threads</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Ask about your business data..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-64 border-slate-300 focus:border-emerald-500"
            />
            <Button 
              onClick={createThread} 
              disabled={!tenantId}
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Start Chat
            </Button>
          </div>
        </div>

      </div>
      
      {loading ? (
        <Skeleton className="h-32 rounded-lg" />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      ) : (
        <div className="grid gap-2">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/owner/chat/${t.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <div className="font-medium text-slate-900">{t.title}</div>
              <div className="text-xs text-slate-600">Thread #{t.id}</div>
            </Link>
          ))}
          {threads.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
              No threads yet. Create your first chat thread.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
