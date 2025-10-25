"use client";
import React, { useEffect, useRef, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIChatPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ id: string; tenant_id?: string } | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const m = await getAuthJSON<{ id: string; tenant_id?: string }>("/api/v1/auth/me");
        if (!active) return;
        setMe(m);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || !me) return;
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/ai/agent/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(me?.tenant_id ? { "X-Tenant-ID": me.tenant_id } : {}),
          "X-User-ID": me.id,
        },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed with ${res.status}`);
      }
      const data = await res.json();
      const reply: string = data?.response || "";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", text: e.message || "Agent error" }]);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="p-6"><Skeleton className="h-8 w-64" /><div className="mt-4 space-y-2">{Array.from({ length: 6 }).map((_,i)=>(<Skeleton key={i} className="h-6"/>))}</div></div>;

  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-140px)]">
      <div className="border rounded bg-white flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-gray-600">Ask the Zemen AI Agent anything about your inventory, sales, or operations.</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`${m.role === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"} px-3 py-2 rounded max-w-[80%] whitespace-pre-wrap`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e)=>{ e.preventDefault(); if (!sending) void sendMessage(); }}
        className="mt-3 flex items-center gap-2"
      >
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || !input.trim()}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
