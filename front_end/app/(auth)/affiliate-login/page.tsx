"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const highlights = [
  "Track referrals and payouts in real time",
  "Secure two-step sign-in protects your commissions",
  "Dedicated partner support to help you scale",
];

export default function AffiliateLoginPage() {
  const router = useRouter();
  const { show } = useToast();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await AuthAPI.loginRequestCode(email, password);
      setStep("verify");
      show({
        variant: "success",
        title: "Code sent",
        description: "Check your email for your login code.",
      });
    } catch (e: any) {
      const message = e.message || "Failed to send code";
      setError(message);
      show({ variant: "destructive", title: "Error", description: message });
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await AuthAPI.loginVerify(email, code);
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access_token);
      }
      show({ variant: "success", title: "Welcome", description: "Login successful" });
      router.replace("/dashboard/affiliate");
    } catch (e: any) {
      const message = e.message || "Verification failed";
      setError(message);
      show({ variant: "destructive", title: "Error", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-[26rem] w-[26rem] rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-700/60 via-blue-700/60 to-emerald-600/60 p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400 to-emerald-400 blur opacity-70" />
              <div className="relative rounded-xl bg-gradient-to-br from-purple-400 to-emerald-400 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-6 w-6 text-white"
                >
                  <path d="M12 5v14m-7-7h14" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-semibold tracking-wide text-white/90">
              Zemen Pharma Affiliate Network
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-tight text-white">
            Welcome back, partner
          </h1>
          <p className="mt-4 text-lg text-purple-50/80">
            Securely access your referral analytics, payouts, and marketing assets with our two-step sign-in.
          </p>

          <ul className="mt-10 space-y-4 text-purple-50/70">
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
          className="space-y-4 text-sm text-purple-50/70"
        >
          <p>
            “Login is seamless and secure. I can track every pharmacy I sign with real-time transparency.”
          </p>
          <div className="h-px w-24 bg-white/20" />
          <p>
            Need help signing in? {" "}
            <Link href="/contact" className="text-white hover:underline">
              Contact affiliate support
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[520px] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-black/65 p-8 shadow-[0_25px_80px_-40px_rgba(124,58,237,0.6)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Affiliate sign in</h2>
            <p className="mt-2 text-sm text-purple-100/70">
              Use your credentials to receive a one-time code.
            </p>
          </div>

          <div className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-purple-200/60">
            <span className={`relative overflow-hidden rounded-full px-3 py-1 ${step === "request" ? "bg-purple-500/30 text-white" : "bg-white/5"}`}>
              Step 1
            </span>
            <span className={`relative overflow-hidden rounded-full px-3 py-1 ${step === "verify" ? "bg-emerald-500/30 text-white" : "bg-white/5"}`}>
              Step 2
            </span>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {step === "request" ? (
            <form onSubmit={requestCode} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Email*
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Password*
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-purple-400/40"
              >
                {loading ? (
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : null}
                {loading ? "Sending code..." : "Send login code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className="mt-2 border-white/10 bg-white/5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Login code*
                </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-emerald-400/40"
              >
                {loading ? (
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : null}
                {loading ? "Verifying..." : "Sign in"}
              </Button>

              <button
                type="button"
                className="w-full text-center text-xs font-medium text-purple-200/80 underline-offset-4 hover:underline"
                onClick={() => {
                  setStep("request");
                  setCode("");
                }}
              >
                Use a different email
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-purple-100/70">
            Need an affiliate account? {" "}
            <Link href="/register/affiliate" className="font-medium text-white hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
