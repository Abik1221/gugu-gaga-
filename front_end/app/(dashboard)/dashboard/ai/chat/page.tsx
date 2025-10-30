"use client";
import React, { useEffect, useRef, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const ROLE_TONE = {
  user: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
  assistant: "bg-white/90 border border-white/40 text-slate-900 backdrop-blur",
} as const;

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

  if (loading)
    return (
      <div className="space-y-4 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_32px_120px_-60px_rgba(16,185,129,0.75)] backdrop-blur-xl">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex h-full max-h-[calc(100vh-140px)] flex-col gap-4">
      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_28px_120px_-60px_rgba(16,185,129,0.75)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold leading-tight text-white">Zemen AI Operations Assistant</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100/80">
          Ask the agent for sales breakdowns, inventory alerts, and compliance insights. Responses are powered
          by safe, read-only analytics across your tenant data.
        </p>
      </div>

      <div className="flex-1 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.7)] backdrop-blur-xl">
        <div className="flex h-full flex-col gap-3 overflow-auto p-5">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-emerald-100/80">
              Ask the Zemen AI Agent anything about your inventory, sales, or operations.
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${ROLE_TONE[m.role]} whitespace-pre-wrap`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!sending) void sendMessage();
        }}
        className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
      >
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
          Type a message
        </label>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-2xl border border-white/15 bg-white/10 text-emerald-100/90 shadow-inner backdrop-blur focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-200/40"
          />
          <Button type="submit" disabled={sending || !input.trim()}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
