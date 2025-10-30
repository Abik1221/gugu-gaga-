"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI } from "@/utils/api";

export default function AffiliateRegisterPage() {
  const router = useRouter();
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [affEmail, setAffEmail] = useState("");
  const [affPassword, setAffPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");

  async function submitAffiliate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!affEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(affEmail))
        throw new Error("Valid email required");
      if (!affPassword || affPassword.length < 6)
        throw new Error("Password must be at least 6 characters");

      await AuthAPI.registerAffiliate({
        email: affEmail,
        password: affPassword,
        affiliate_full_name: fullName || undefined,
        bank_name: bankName || undefined,
        bank_account_name: bankAccountName || undefined,
        bank_account_number: bankAccountNumber || undefined,
      });

      setSuccess("Affiliate registered. Please verify your email.");
      show({
        variant: "success",
        title: "Registered",
        description: "Check your email for verification code.",
      });
      setTimeout(
        () => router.replace(`/verify?email=${encodeURIComponent(affEmail)}`),
        1200
      );
    } catch (err: any) {
      const message = err?.message || "Registration failed";
      setError(message);
      show({ variant: "destructive", title: "Failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  const programHighlights = [
    "Earn commission for every pharmacy you onboard",
    "Real-time tracking of referrals and payouts",
    "Dedicated success manager and training toolkit",
    "Fast payouts to the bank account you choose",
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-12 left-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-[28rem] w-[28rem] translate-y-1/3 rounded-full bg-emerald-500/20 blur-3xl" />
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
            Grow with the pharmacies you onboard
          </h1>
          <p className="mt-4 text-lg text-purple-50/80">
            Become a trusted partner for pharmacy digitization. Unlock recurring earnings with every successful
            registration.
          </p>

          <ul className="mt-10 space-y-4 text-purple-50/70">
            {programHighlights.map((item) => (
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
          className="space-y-4 text-sm text-purple-50/80"
        >
          <p>
            “The affiliate dashboard keeps payouts transparent and the training resources help us close pharmacies fast.”
          </p>
          <div className="h-px w-24 bg-white/20" />
          <p>
            Questions? {" "}
            <Link href="/contact" className="text-white hover:underline">
              Chat with our partner success team
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
            <h2 className="text-3xl font-bold text-white">Join the affiliate program</h2>
            <p className="mt-2 text-sm text-purple-100/70">
              Earn commissions every time a pharmacy goes live.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {success}
            </div>
          )}

          <form onSubmit={submitAffiliate} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Email*
                </label>
                <Input
                  type="email"
                  value={affEmail}
                  onChange={(e) => setAffEmail(e.target.value)}
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
                  value={affPassword}
                  onChange={(e) => setAffPassword(e.target.value)}
                  required
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Full name (for payouts)
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Bank name
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Account name
                </label>
                <Input
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-purple-100/80">
                  Account number
                </label>
                <Input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-purple-100/40 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-purple-400/40"
            >
              {loading ? (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {loading ? "Registering..." : "Register as affiliate"}
            </Button>

            <p className="text-center text-xs text-purple-100/70">
              Already part of the network?{" "}
              <Link href="/affiliate-login" className="font-medium text-white hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-[11px] text-purple-100/60">
            By continuing you agree to our {" "}
            <Link href="/terms" className="text-white hover:underline">
              Terms
            </Link>{" "}
            and {" "}
            <Link href="/privacy" className="text-white hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
