"use client";
import React, { useState } from "react";
import { API_BASE } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <section id="contact" className="py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-6">Have questions about Zemen Pharma? Send us a message and we’ll respond promptly.</p>

        {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded text-sm">{success}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
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
  );
}
