"use client";
import React, { useState } from "react";
import { API_BASE } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) return "Please enter your name";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (!message.trim() || message.trim().length < 5) return "Please enter a message (min 5 chars)";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const t = await res.text().catch(()=>"");
        throw new Error(t || `Failed with ${res.status}`);
      }
      setSuccess("Thanks! Your message has been sent. We'll get back to you soon.");
      setName(""); setEmail(""); setMessage("");
    } catch (e: any) {
      setError(e.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-10 pb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Run your inventory operations with confidence</h1>
          <p className="mt-4 text-gray-600 text-lg">Zemen Inventory unifies stock control, POS, AI insights, and affiliate growth into one modern platform—designed for speed, accuracy, and scale.</p>
          <div className="mt-6 flex gap-3">
            <Button asChild><a href="/register/pharmacy">Get Started</a></Button>
            <a href="#about" className="text-emerald-700 border border-emerald-200 rounded px-3 py-2 text-sm hover:bg-emerald-50">Learn More</a>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            title="Multi-location management"
            desc="Coordinate stock and sales across every branch with shared catalogs, centralized purchases, and location-level insights."
          />
          <FeatureCard
            title="AI copilots for growth"
            desc="Let intelligent assistants forecast demand, flag anomalies, and surface the next best actions for your teams."
          />
          <FeatureCard
            title="Enterprise-grade security"
            desc="Role-based controls, audit trails, and encrypted data flows keep patient information and revenue streams protected."
          />
          <FeatureCard
            title="Mobile command center"
            desc="Approve orders, reconcile payouts, and monitor KPIs from your phone—no matter where the day takes you."
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold">Who is Zemen Inventory for?</h2>
          <p className="mt-3 text-gray-600">Whether you oversee a growing retail network or lead a single high-performing operation, Zemen Inventory adapts to your workflow. Harness AI copilots, secure infrastructure, and mobile controls to keep every location aligned and profitable.</p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Bullet title="Branch and network owners" desc="Synchronize purchasing, pricing, and stock visibility across multiple locations." />
          <Bullet title="AI-driven operations" desc="Empower managers with predictive analytics, smart alerts, and guided actions fueled by AI." />
          <Bullet title="Compliance-focused teams" desc="Protect sensitive data with role-based permissions, audit history, and encryption by default." />
          <Bullet title="On-the-go executives" desc="Track KPIs, approve payouts, and resolve issues from any device—no tools or laptops required." />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="max-w-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-gray-600 mt-2">Have questions about Zemen Inventory? Send us a message and we’ll respond promptly.</p>
          </div>

          <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-r from-emerald-500/15 via-white to-blue-500/15 p-5 shadow-[0_18px_55px_-35px_rgba(16,185,129,0.45)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Call us directly</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">+251 983 446 134</p>
                <p className="mt-1 text-sm text-emerald-700/80">Available every day • 8:00 – 21:00 GMT+3</p>
              </div>
              <a
                href="tel:+251983446134"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_-30px_rgba(16,185,129,0.55)] transition hover:scale-[1.02]"
              >
                Tap to call now
              </a>
            </div>
          </div>

          {success && <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded text-sm">{success}</div>}
          {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm">Your Name</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm">Message</label>
              <textarea
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                className="w-full border rounded px-3 py-2 min-h-[140px]"
                placeholder="How can we help you?"
                required
              />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border rounded bg-white p-4">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </div>
  );
}

function Bullet({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border rounded bg-white p-4">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </div>
  );
}
