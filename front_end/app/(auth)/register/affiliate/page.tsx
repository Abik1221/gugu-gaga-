"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI } from "@/utils/api";
import Image from "next/image";
import affiliateRegistrationImage from "@/public/affiliateregistration.jpeg";
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
        () => window.location.href = `/verify?email=${encodeURIComponent(affEmail)}`,
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
    <div className="relative flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-[-5rem] right-[-3rem] h-[28rem] w-[28rem] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute inset-x-0 top-[38%] h-24 bg-gradient-to-r from-emerald-100/40 via-transparent to-blue-100/40 blur-2xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden rounded-r-[48px] border border-emerald-100 bg-white/80 p-12 shadow-[0_60px_160px_-90px_rgba(14,116,144,0.55)] backdrop-blur lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 opacity-30 blur" />
              <div className="relative rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 p-3 text-white shadow-lg">
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
            <span className="text-2xl font-semibold tracking-wide text-emerald-700">
              Mesob AI Affiliate Network
            </span>
          </div>

          <Image
            src={affiliateRegistrationImage}
            alt="affiliate registration image"
            className="my-10"
          />
          <p className="mt-4 text-lg text-slate-600">
            Become a trusted partner for bussiness digitization. Unlock
            recurring earnings with every successful registration.
          </p>

          <ul className="mt-10 space-y-4 text-slate-600">
            {programHighlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[520px] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-emerald-100/80 bg-white/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,118,110,0.55)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Join the affiliate program
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Earn commissions every time a pharmacy goes live.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={submitAffiliate} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Email*
                </label>
                <Input
                  type="email"
                  value={affEmail}
                  onChange={(e) => setAffEmail(e.target.value)}
                  required
                  className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Password*
                </label>
                <Input
                  type="password"
                  value={affPassword}
                  onChange={(e) => setAffPassword(e.target.value)}
                  required
                  className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Full name (for payouts)
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Bank name
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Account name
                </label>
                <Input
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Account number
                </label>
                <Input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-black px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:translate-y-[-1px] hover:shadow-emerald-400/40"
            >
              {loading ? (
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            <p className="text-center text-xs text-slate-500">
              Already part of the network?{" "}
              <Link
                href="/auth?tab=signin"
                className="font-medium text-emerald-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-[11px] text-slate-400">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
