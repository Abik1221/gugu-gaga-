"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postForm } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function AuthPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") || "/dashboard";
  const { show } = useToast();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign in state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await postForm<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
      }>("/api/v1/auth/login", { username, password });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      show({ variant: "success", title: "Welcome", description: "Login successful" });
      router.replace(next);
    } catch (err: any) {
      setError(err.message || "Login failed");
      show({ variant: "destructive", title: "Login failed", description: err.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-emerald-700 font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
            <span>Zemen Pharma</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/" className="hover:text-emerald-700">Home</a>
            <a href="/about" className="hover:text-emerald-700">About</a>
            <a href="/contact" className="hover:text-emerald-700">Contact</a>
            <a href="/register" className="text-emerald-700">Owner Register</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl border rounded bg-white shadow-sm animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        <div className="p-3 border-b flex items-center gap-3 text-sm">
          <button className={`px-3 py-1 rounded ${tab==="signin"?"bg-emerald-600 text-white":"hover:bg-gray-50"}`} onClick={()=>setTab("signin")}>Sign In</button>
          <button className={`px-3 py-1 rounded ${tab==="signup"?"bg-emerald-600 text-white":"hover:bg-gray-50"}`} onClick={()=>setTab("signup")}>Sign Up</button>
        </div>
        <div className="p-6">
          {tab === "signin" ? (
            <form onSubmit={onLogin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl font-semibold">Sign in to Zemen Pharma</h1>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <Input type="email" value={username} onChange={(e)=>setUsername(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <label className="text-sm">Password</label>
                  <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <Button type="submit" disabled={loading} className="w-full md:w-auto">{loading?"Signing in...":"Sign In"}</Button>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="font-medium">Want to register as an Affiliate?</div>
                <p>
                  Sign in (or create an account) and then open <span className="font-medium">Dashboard → Affiliate → Register</span> to enroll as a marketing partner and get your referral link.
                </p>
                <div className="font-medium mt-4">New pharmacy owner?</div>
                <p>
                  If you are a pharmacy owner, use the Sign Up tab to access the full registration with KYC.
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <h1 className="text-xl font-semibold">Create an Account</h1>
              <p className="text-gray-600 text-sm">Choose your path below:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4">
                  <div className="font-medium">Pharmacy Owner Registration</div>
                  <p className="text-sm text-gray-600 mt-1">Register your pharmacy, complete KYC, and set up your tenant.</p>
                  <Button asChild className="mt-3"><a href="/register">Go to Owner Registration</a></Button>
                </div>
                <div className="border rounded p-4">
                  <div className="font-medium">Become an Affiliate</div>
                  <p className="text-sm text-gray-600 mt-1">Create an account without pharmacy KYC, then complete your Affiliate profile.</p>
                  <div className="flex gap-2 mt-3">
                    <Button asChild><a href="/affiliate-signup">Affiliate Sign Up</a></Button>
                    <Button variant="outline" onClick={()=>setTab("signin")}>Sign In</Button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Note: Duplicate emails are prevented by the backend. If you already registered, please sign in.</div>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
