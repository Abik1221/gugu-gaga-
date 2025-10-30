"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI } from "@/utils/api";

const highlights = [
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: "Two-step security",
    copy: "Every affiliate login is protected with verification codes for peace of mind.",
  },
  {
    icon: <MailCheck className="h-4 w-4" />,
    title: "Fast email delivery",
    copy: "Codes arrive within seconds. Having trouble? Resend or reach partner support.",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "Access partner perks",
    copy: "Once verified you can generate referral links and track commissions instantly.",
  },
];

export default function VerifyRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      if (!code || code.length < 4) {
        throw new Error("Please enter the verification code");
      }

      const verifyRes = await AuthAPI.registerVerify(email, code);
      const accessToken = verifyRes?.access_token;
      const refreshToken = verifyRes?.refresh_token;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      } else {
        localStorage.removeItem("refresh_token");
      }

      try {
        const me = await AuthAPI.me();
        if (typeof window !== "undefined") {
          if (me?.tenant_id) localStorage.setItem("tenant_id", me.tenant_id);
          else localStorage.removeItem("tenant_id");
        }
      } catch (meErr) {
        console.warn("[verify] unable to fetch profile after verification", meErr);
      }

      if (!accessToken) {
        throw new Error("Verification succeeded but no access token was returned");
      }
      setSuccess(true);
      show({
        variant: "success",
        title: "Verification Successful",
        description:
          "Your account has been verified. Redirecting to your dashboard.",
      });

      // Redirect to affiliate dashboard after a short delay
      setTimeout(() => {
        router.replace("/dashboard/affiliate");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Verification failed");
      show({
        variant: "destructive",
        title: "Verification Failed",
        description: err.message || "Please check your code and try again",
      });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute bottom-10 right-1/3 h-80 w-80 translate-x-1/2 rounded-full bg-blue-500/25 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-[0_30px_100px_-40px_rgba(16,185,129,0.65)] backdrop-blur-lg"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-300" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white">Account verified!</h1>
          <p className="mt-3 text-sm text-emerald-100/80">
            Your account has been activated. We&rsquo;ll send you to the affiliate dashboard in a moment.
          </p>
          <Button
            onClick={() => router.replace("/dashboard/affiliate")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 text-sm font-semibold shadow-[0_15px_45px_-25px_rgba(16,185,129,0.65)]"
          >
            Go now
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-[26rem] w-[26rem] rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600/50 via-blue-700/50 to-slate-800/60 p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg space-y-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
            Secure verification
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Confirm your email and unlock the partner dashboard
          </h1>
          <p className="text-sm text-emerald-100/80">
            Enter the one-time code sent to your inbox. Once it matches, we&rsquo;ll activate your affiliate portal and load your referral toolkit.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-emerald-100/80">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-200">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white/90">{item.title}</p>
                  <p className="text-xs text-emerald-100/70">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-xs text-emerald-100/60">
            <p>
              Need help? {" "}
              <Link href="/contact" className="text-white hover:underline">
                Partner support is a message away
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-xs text-emerald-100/60"
        >
          <p>Verification keeps your earnings protected.</p>
          <p className="mt-1">© {new Date().getFullYear()} Zemen Pharma Partners.</p>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[520px] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-black/65 p-8 shadow-[0_25px_80px_-40px_rgba(124,58,237,0.6)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Verify your account</h2>
            <p className="mt-2 text-sm text-emerald-100/75">
              Enter the six-digit code we just emailed to finish activating your partner access.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-emerald-100/80">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-emerald-100/80">
                Verification code
              </label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit code"
                required
                autoComplete="one-time-code"
                maxLength={6}
                className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-[0_15px_45px_-25px_rgba(16,185,129,0.65)] transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify account"}
            </Button>
          </form>

          <div className="mt-8 space-y-3 text-center text-xs text-emerald-100/70">
            <p>
              Didn’t get the code? Check spam or {" "}
              <Link href="/register/affiliate" className="text-white hover:underline">
                resend from registration
              </Link>
              .
            </p>
            <p>
              Your login code expires after 10 minutes for security.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
