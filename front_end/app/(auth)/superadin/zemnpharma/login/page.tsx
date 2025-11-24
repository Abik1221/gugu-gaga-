"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const highlights = [
  "Full oversight across every tenant and branch",
  "AI-driven anomaly alerts for compliance and security",
  "Privileged tooling for super admin orchestration",
];

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { show } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await AuthAPI.login(username, password);
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token ?? "");
      }
      const me = await AuthAPI.me();
      if (typeof window !== "undefined") {
        if (me?.tenant_id) localStorage.setItem("tenant_id", me.tenant_id);
        else localStorage.removeItem("tenant_id");
        if (me?.role) localStorage.setItem("user_role", me.role);
      }
      if (me.role === "affiliate") router.replace("/dashboard/affiliate");
      else if (me.role === "pharmacy_owner" || me.role === "cashier") router.replace("/dashboard/owner");
      else if (me.role === "admin") router.replace("/dashboard/admin");
      else router.replace("/dashboard");
      show({ variant: "success", title: "Authenticated", description: "Login successful" });
    } catch (err: any) {
      const message = err.message || "Login failed";
      setError(message);
      show({ variant: "destructive", title: "Login failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-12 left-24 h-[22rem] w-[22rem] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-16 right-20 h-[24rem] w-[24rem] rounded-full bg-blue-600/25 blur-3xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600/60 via-blue-700/70 to-slate-800/60 p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 blur opacity-70" />
              <div className="relative rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6 text-white"
                >
                  <path d="M12 3c2.755 0 5 2.175 5 4.857 0 2.143-1.444 3.824-3.556 5.467-1.11.884-.799 2.676-.799 4.43h-1.29c0-1.754.311-3.546-.8-4.43C8.444 11.68 7 9.999 7 7.857 7 5.175 9.245 3 12 3z" />
                  <path d="M6.343 17.657a8 8 0 0 1 11.314 0L12 23l-5.657-5.343z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-semibold tracking-wide text-white/90">
              Zemen Pharma Super Admin
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-tight text-white">
            Secure access to the control core
          </h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            Monitor every tenant, approve escalations, and intervene instantly with privileged tooling designed for guardians of the network.
          </p>

          <ul className="mt-10 space-y-4 text-emerald-50/70">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-4 text-sm text-emerald-50/70"
        >
          <p>
            “The super admin console lets us flag anomalies and keep pharmacies compliant without exposing the system.”
          </p>
          <div className="h-px w-24 bg-white/20" />
          <p>
            Need help? {" "}
            <Link href="mailto:support@zemenpharma.com" className="text-white hover:underline">
              Email the platform team
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[520px] lg:px-12">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-black/65 p-8 shadow-[0_25px_80px_-40px_rgba(16,185,129,0.6)] backdrop-blur"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Super admin sign in</h2>
            <p className="mt-2 text-sm text-emerald-100/70">
              Enter your credentials to unlock privileged controls.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-emerald-100/80">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-emerald-100/80">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-emerald-400/40"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-xs text-emerald-100/70">
            Pharmacy owner or cashier? {" "}
            <Link href="/auth?tab=signin" className="font-medium text-white hover:underline">
              Use the owner portal
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
