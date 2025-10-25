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
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Run your pharmacy with confidence</h1>
          <p className="mt-4 text-gray-600 text-lg">Zemen Pharma unifies inventory, POS, AI insights, and affiliate growth into one modern platform—designed for speed, accuracy, and scale.</p>
          <div className="mt-6 flex gap-3">
            <Button asChild><a href="/register">Get Started</a></Button>
            <a href="#about" className="text-emerald-700 border border-emerald-200 rounded px-3 py-2 text-sm hover:bg-emerald-50">Learn More</a>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard title="Inventory & POS" desc="Fast item lookup, stock control, FEFO checks, and streamlined checkout with receipts." />
          <FeatureCard title="AI Assistance" desc="Ask the agent for sales insights, inventory predictions, and operational guidance." />
          <FeatureCard title="Affiliate Growth" desc="Register affiliates, share referral links, and track clicks, conversions, and commissions." />
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold">Built for modern pharmacies</h2>
          <p className="mt-3 text-gray-600">From single-branch shops to multi-branch operations, Zemen Pharma provides the tools to manage stock, process sales, and discover insights in real-time. Our POS is integrated with Inventory and Sales Services, while AI Services help you make smarter decisions. The affiliate program accelerates growth through verified partners.</p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Bullet title="Real-time stock & FEFO" desc="Validate availability and fulfill with First-Expire-First-Out for safe dispensing." />
          <Bullet title="Receipts & reports" desc="Generate receipts instantly and analyze sales with clear, actionable data." />
          <Bullet title="Secure & role-based" desc="Owner, Manager, and Cashier roles keep your data secure and workflows clean." />
          <Bullet title="Rapid onboarding" desc="Simple setup, intuitive UI, and support to get your team productive fast." />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-gray-600 mt-2">Have questions about Zemen Pharma? Send us a message and we’ll respond promptly.</p>
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
