"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, ChatAPI, PharmaciesAPI } from "@/utils/api";

export default function ChatThreadPage() {
  const { show } = useToast();
  const params = useParams();
  const threadId = Number(params?.threadId);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Array<{id:number; role:string; content:string}>>([]);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  async function refresh(tid: string) {
    setLoading(true);
    try {
      const rows = await ChatAPI.listMessages(tid, threadId);
      setMessages(rows || []);
      setError(null);
    } catch (e:any) {
      setError(e.message || "Failed to load messages");
    } finally { setLoading(false); }
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
  }, [threadId]);

  async function send() {
    if (!tenantId || !prompt.trim()) return;
    try {
      const p = prompt.trim();
      setPrompt("");
      setStreaming(true);
      await ChatAPI.sendStream(tenantId, threadId, p, (evt)=>{
        // Optional: we could add partial UI updates here if backend sent tokens
        // We stream only lifecycle events and final payload right now
        if (evt.event === "final") {
          refresh(tenantId);
          setStreaming(false);
        }
      });
    } catch (e:any) {
      setStreaming(false);
      show({ variant: "destructive", title: "Send failed", description: e.message });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chat #{threadId}</h1>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1"
            value={tenantId ?? ""}
            onChange={async (e)=>{ const tid = e.target.value || null; setTenantId(tid); if (tid) await refresh(tid); }}
          >
            {pharmacies.map((p:any)=>(<option key={p.tenant_id} value={p.tenant_id}>{p.name} ({p.tenant_id})</option>))}
          </select>
        </div>
      </div>
      {loading ? (<Skeleton className="h-64" />) : error ? (<div className="text-sm text-red-600">{error}</div>) : (
        <div className="space-y-3">
          <div className="border rounded p-3 h-[60vh] overflow-auto bg-white">
            {messages.map((m)=> (
              <div key={m.id} className="mb-3">
                <div className="text-xs text-gray-500">{m.role}</div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet.</div>}
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Type your message" value={prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=>{ if (e.key === 'Enter') send(); }} />
            <Button onClick={send} disabled={!tenantId || !prompt.trim() || streaming}>{streaming ? "Sending..." : "Send"}</Button>
            {streaming && <div className="text-xs text-gray-500 animate-pulse">Assistant is typing…</div>}
          </div>
        </div>
      )}
    </div>
  );
}
