"use client";
import React, { useState } from "react";
import Link from "next/link";
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

  const sellingPoints = [
    {
      title: "Unified operations",
      description: "Monitor inventory, revenue, and KYC from a single secure workspace for every branch.",
    },
    {
      title: "AI copilots",
      description: "Receive predictive alerts and recommendations tailored to your pharmacy’s performance.",
    },
    {
      title: "Granular security",
      description: "Role-based controls, audit trails, and encryption safeguard patient data by default.",
    },
    {
      title: "Mobile command",
      description: "Approve payouts, review KPIs, and resolve issues from your phone in real-time.",
    },
  ];

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
      if (!username.trim() || !password.trim()) {
        const missing: string[] = [];
        if (!username.trim()) missing.push("Email or username");
        if (!password.trim()) missing.push("Password");
        const message = `${missing.join(" and ")} required.`;
        setError(message);
        show({
          variant: "destructive",
          title: "Missing information",
          description: message,
        });
        return;
      }
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
      const details = err?.body?.errors || err?.body;
      let description = err.message || "Login failed";
      if (Array.isArray(details)) {
        description = details.join("\n");
      } else if (details && typeof details === "object") {
        const entries = Object.entries(details as Record<string, unknown>);
        if (entries.length > 0) {
          description = entries
            .map(([field, value]) => `${field.replace(/_/g, " ")}: ${String(value)}`)
            .join("\n");
        }
      }
      setError(description);
      show({ variant: "destructive", title: "Login failed", description });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-black to-slate-900 px-6 py-16 text-white">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-[26rem] w-[26rem] rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_35px_120px_-40px_rgba(16,185,129,0.55)] backdrop-blur-xl md:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100/80">
                Unified access
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Sign in or launch your Zemen Pharma workspace
                </h1>
                <p className="text-sm text-emerald-100/80 sm:text-base">
                  Manage every branch, empower teams with AI insights, and keep compliance tight—all from a single, secure dashboard experience.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {sellingPoints.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-[0_15px_45px_-35px_rgba(16,185,129,0.45)] backdrop-blur"
                  >
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs text-emerald-100/70">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-emerald-100/70 sm:text-sm">
                Need help? Call <a href="tel:+251983446134" className="font-semibold text-emerald-200">+251 983 446 134</a> or email <a href="mailto:support@zemenpharma.com" className="font-semibold text-emerald-200">support@zemenpharma.com</a>.
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/15 bg-black/60 p-6 shadow-[0_25px_70px_-45px_rgba(59,130,246,0.55)] backdrop-blur">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100/70">
                  <button
                    type="button"
                    onClick={() => setTab("signin")}
                    className={`flex-1 rounded-lg py-2 transition ${
                      tab === "signin"
                        ? "bg-gradient-to-r from-emerald-500/70 to-blue-500/70 text-white shadow-[0_12px_35px_-25px_rgba(16,185,129,0.8)]"
                        : "text-emerald-100/70 hover:text-white"
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("signup")}
                    className={`flex-1 rounded-lg py-2 transition ${
                      tab === "signup"
                        ? "bg-gradient-to-r from-emerald-500/70 to-blue-500/70 text-white shadow-[0_12px_35px_-25px_rgba(59,130,246,0.8)]"
                        : "text-emerald-100/70 hover:text-white"
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                <div className="mt-6">
                  {tab === "signin" ? (
                    <form onSubmit={onLogin} className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-white">Welcome back</h2>
                        <p className="mt-2 text-sm text-emerald-100/70">
                          Enter your credentials to access the control center. New pharmacy owners can switch to the Sign up tab.
                        </p>
                      </div>
                      {error && (
                        <div className="rounded-xl border border-red-300/40 bg-red-500/15 p-3 text-sm text-red-100">
                          {error}
                        </div>
                      )}
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100/80">
                          Username
                        </label>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          autoComplete="username"
                          placeholder="owner@pharmacy.com"
                          className="border-white/20 bg-white/10 text-white placeholder:text-emerald-100/50 focus-visible:border-emerald-300 focus-visible:ring-emerald-300"
                        />
                        <p className="text-[11px] text-emerald-100/70">Use the email or username linked to your workspace. Input is case-sensitive.</p>
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100/80">
                          Password
                        </label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          placeholder="At least 6 characters with a capital letter"
                          className="border-white/20 bg-white/10 text-white placeholder:text-emerald-100/50 focus-visible:border-emerald-300 focus-visible:ring-emerald-300"
                        />
                        <p className="text-[11px] text-emerald-100/70">Passwords are case-sensitive. Include at least one capital letter and number.</p>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 py-3 font-semibold text-white shadow-[0_18px_55px_-30px_rgba(16,185,129,0.75)] transition hover:from-emerald-500/90 hover:to-blue-500/90"
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </Button>
                      <p className="text-center text-xs text-emerald-100/70">
                        Need an account?{" "}
                        <button
                          type="button"
                          onClick={() => setTab("signup")}
                          className="font-semibold text-emerald-200 hover:text-white"
                        >
                          Create a workspace
                        </button>
                      </p>
                    </form>
                  ) : (
                    <div className="space-y-6 text-left">
                      <div>
                        <h2 className="text-xl font-semibold text-white">Create your access</h2>
                        <p className="mt-2 text-sm text-emerald-100/70">
                          Choose the path that matches your role. You can always return to the Sign in tab once registration is complete.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-emerald-100/80 shadow-[0_18px_55px_-35px_rgba(16,185,129,0.55)]">
                          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">Pharmacy owners</div>
                          <h3 className="mt-2 text-lg font-semibold text-white">Launch registration & KYC</h3>
                          <p className="mt-2 text-sm text-emerald-100/70">
                            Submit business details, upload compliance documents, and set up your tenant to unlock the full dashboard.
                          </p>
                          <Button asChild className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-[0_18px_55px_-35px_rgba(16,185,129,0.65)] hover:from-emerald-500/90 hover:to-blue-500/90">
                            <Link href="/register/pharmacy">Start owner registration</Link>
                          </Button>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-emerald-100/80 shadow-[0_18px_55px_-35px_rgba(59,130,246,0.55)]">
                          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">Affiliates</div>
                          <h3 className="mt-2 text-lg font-semibold text-white">Earn by referring pharmacies</h3>
                          <p className="mt-2 text-sm text-emerald-100/70">
                            Sign in with your credentials and open <span className="font-semibold">Dashboard → Affiliate → Register</span> to activate your referral tools.
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4 w-full rounded-xl border-emerald-300/30 bg-transparent text-emerald-200 hover:border-emerald-200 hover:bg-emerald-500/10"
                            onClick={() => setTab("signin")}
                          >
                            Return to sign in
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-emerald-100/70">
                        Duplicate emails are blocked for security. If you submitted KYC before, switch back to Sign in and continue from the dashboard.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
