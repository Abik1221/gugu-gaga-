"use client";
import React, { useEffect, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";

export default function AffiliateRegisterPage() {
  const show = ({ title, description }: { title: string; description: string; variant?: string }) => {
    console.log(`${title}: ${description}`);
  };
  const [me, setMe] = useState<{ id: string; tenant_id?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [full_name, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bank_account_name, setBankAccountName] = useState("");
  const [bank_account_number, setBankAccountNumber] = useState("");
  const [bank_name, setBankName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const m = await getAuthJSON<{ id: string; tenant_id?: string }>("/api/v1/auth/me");
        if (!active) return;
        setMe(m);
      } catch (e: any) {
        show({ variant: "destructive", title: "Auth required", description: "Please login" });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false };
  }, [show]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!full_name.trim()) errs.full_name = "Full name is required";
    if (!username.trim() || username.trim().length < 3) errs.username = "Username must be at least 3 characters";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email is required";
    if (!bank_account_name.trim()) errs.bank_account_name = "Bank account name is required";
    if (!bank_account_number.trim() || bank_account_number.replace(/\D/g, '').length < 6) errs.bank_account_number = "Enter a valid account number";
    if (!bank_name.trim()) errs.bank_name = "Bank name is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      show({ variant: "destructive", title: "Fix form errors", description: "Please review highlighted fields" });
      return;
    }
    if (!me?.tenant_id || !me?.id) {
      show({ variant: "destructive", title: "Missing context", description: "Tenant/User missing" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        full_name,
        username,
        email,
        phone: phone || null,
        bank_account_name,
        bank_account_number,
        bank_name,
        country: country || null,
        city: city || null,
        address: address || null,
      };
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/affiliate/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "X-Tenant-ID": me.tenant_id as string,
          "X-User-ID": me.id,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed with ${res.status}`);
      }
      const data = (await res.json()) as { affiliate_id: string; referral_code: string };
      setReferralCode(data.referral_code);
      show({ variant: "success", title: "Affiliate registered", description: "Referral code generated" });
    } catch (err: any) {
      show({ variant: "destructive", title: "Registration failed", description: err.message || "" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">Loading...</div>;

  const shareUrl = referralCode && typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}` : "";

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-1">Affiliate Registration</h1>
      <p className="text-sm text-gray-600 mb-4">Earn commissions by referring new pharmacies. Fill in your payout details to get started.</p>

      {referralCode ? (
        <div className="border rounded bg-white p-4 space-y-2">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded text-sm">
            Verification email sent. Please check your inbox and click the link to verify your affiliate account.
          </div>
          <div className="font-medium">Your referral code</div>
          <div className="text-2xl font-mono">{referralCode}</div>
          <div className="text-sm text-gray-600">Share this link:</div>
          <div className="p-2 border rounded bg-gray-50 break-all text-sm">{shareUrl}</div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Full Name</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={full_name} onChange={(e)=>setFullName(e.target.value)} required aria-invalid={!!errors.full_name} />
              {errors.full_name && <div className="text-xs text-red-600 mt-1">{errors.full_name}</div>}
            </div>
            <div>
              <label className="text-sm">Username</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={username} onChange={(e)=>setUsername(e.target.value)} required aria-invalid={!!errors.username} />
              <div className="text-xs text-gray-500 mt-1">Public handle for your affiliate profile</div>
              {errors.username && <div className="text-xs text-red-600 mt-1">{errors.username}</div>}
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input className="w-full border rounded px-3 py-2 text-sm" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required aria-invalid={!!errors.email} />
              {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="text-sm">Phone</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="e.g. +2519..." />
              <div className="text-xs text-gray-500 mt-1">Optional, used for payout queries</div>
            </div>
            <div>
              <label className="text-sm">Bank Account Name</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={bank_account_name} onChange={(e)=>setBankAccountName(e.target.value)} required aria-invalid={!!errors.bank_account_name} />
              {errors.bank_account_name && <div className="text-xs text-red-600 mt-1">{errors.bank_account_name}</div>}
            </div>
            <div>
              <label className="text-sm">Bank Account Number</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={bank_account_number} onChange={(e)=>setBankAccountNumber(e.target.value)} required aria-invalid={!!errors.bank_account_number} />
              {errors.bank_account_number && <div className="text-xs text-red-600 mt-1">{errors.bank_account_number}</div>}
            </div>
            <div>
              <label className="text-sm">Bank Name</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={bank_name} onChange={(e)=>setBankName(e.target.value)} required aria-invalid={!!errors.bank_name} />
              {errors.bank_name && <div className="text-xs text-red-600 mt-1">{errors.bank_name}</div>}
            </div>
            <div>
              <label className="text-sm">Country</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={country} onChange={(e)=>setCountry(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">City</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={city} onChange={(e)=>setCity(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Address</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={address} onChange={(e)=>setAddress(e.target.value)} />
              <div className="text-xs text-gray-500 mt-1">Include branch details if applicable</div>
            </div>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Register as Affiliate"}
          </button>
        </form>
      )}
    </div>
  );
}
