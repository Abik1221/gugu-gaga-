"use client";
import React, { useState } from "react";
import { API_BASE } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Headphones, MapPin } from "lucide-react";

type ContactChannel = {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
  href?: string;
};

const contactChannels: ContactChannel[] = [
  {
    icon: Mail,
    label: "Support",
    value: "support@zemenpharma.com",
    description: "For product questions or onboarding assistance.",
    href: "mailto:support@zemenpharma.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+251 987 654 321",
    description: "Available Monday to Friday, 9am – 6pm EAT.",
    href: "tel:+251987654321",
  },
  {
    icon: Headphones,
    label: "Live support",
    value: "Dedicated success manager",
    description: "Customers on paid plans get priority assistance.",
  },
  {
    icon: MapPin,
    label: "HQ",
    value: "Addis Ababa, Ethiopia",
    description: "Enterprise Zone, Innovation District",
  },
];

export default function ContactPage() {
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
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed with ${res.status}`);
      }
      setSuccess("Thanks! Your message has been sent. We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e: any) {
      setError(e.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 text-emerald-50"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
            Contact
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
            Let's build the future of pharmacy operations together
          </h1>
          <p className="mt-4 text-base text-emerald-100/80">
            Talk with our team about pilots, integrations, or partnership opportunities. We’ll respond within one business day.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,360px),minmax(0,1fr)]">
          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_-50px_rgba(16,185,129,0.55)] backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Connect directly</h2>
            <p className="text-sm text-emerald-100/75">
              Prefer a personal touch? Reach out using any of the channels below. We’re happy to guide you through onboarding or enterprise needs.
            </p>
            <div className="space-y-4">
              {contactChannels.map((channel) => (
                <div
                  key={channel.label}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-300/40 hover:bg-white/10"
                >
                  <span className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 text-emerald-200">
                    <channel.icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{channel.label}</p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="text-sm text-emerald-200 transition hover:text-emerald-100"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="text-sm text-emerald-200">{channel.value}</p>
                    )}
                    <p className="text-xs text-emerald-100/60">{channel.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-emerald-100/70">
              <p className="font-semibold text-emerald-100">Looking for product support?</p>
              <p className="mt-2">
                Tenants can open in-app tickets from the dashboard. We respond within four business hours for priority plans.
              </p>
            </div>
          </aside>

          <div className="rounded-3xl border border-white/10 bg-white/8 p-8 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.7)] backdrop-blur-xl">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-emerald-100">
                  Your name
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="h-12 rounded-2xl border border-white/15 bg-white/10 text-white placeholder:text-emerald-100/60 focus:border-emerald-300/60 focus:ring-emerald-200/40"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-emerald-100">
                  Email
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-12 rounded-2xl border border-white/15 bg-white/10 text-white placeholder:text-emerald-100/60 focus:border-emerald-300/60 focus:ring-emerald-200/40"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-emerald-100">
                How can we help?
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a bit about your pharmacy operations or goals..."
                  required
                  className="min-h-[180px] w-full resize-y rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white placeholder:text-emerald-100/60 shadow-inner focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-200/40"
                />
              </label>

              {success && (
                <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <span className="text-xs text-emerald-100/70">
                  We’ll only use your details to follow up on this enquiry.
                </span>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-600 hover:to-sky-600 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
