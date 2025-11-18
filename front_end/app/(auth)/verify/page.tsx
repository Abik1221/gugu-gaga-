"use client";
import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useEmailVerificationToast } from "@/components/ui/email-verification-toast";
import { AuthAPI } from "@/utils/api";
import { SimpleLoading } from "@/components/ui/simple-loading";

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

function VerifyRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const { showEmailSentNotification, showResendCooldown } = useEmailVerificationToast();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Pre-fill email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  async function handleResendCode() {
    if (!email || resendCooldown > 0) return;
    
    setResendLoading(true);
    try {
      const purpose = searchParams.get("purpose") || "register";
      const response = await fetch("/api/v1/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose })
      });
      
      if (response.status === 429) {
        const errorData = await response.json();
        const match = errorData.detail?.match(/(\d+) seconds/);
        const seconds = match ? parseInt(match[1]) : 120;
        setResendCooldown(seconds);
        showResendCooldown(seconds);
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to resend code");
      }
      
      showEmailSentNotification(email, purpose as any);
      setResendCooldown(120); // 2 minute cooldown
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Resend Failed",
        description: err.message || "Failed to resend verification code"
      });
    } finally {
      setResendLoading(false);
    }
  }

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

      console.log('Verifying with:', { email, code });
      const verifyRes = await AuthAPI.registerVerify(email, code);
      console.log('Verify response:', verifyRes);
      const accessToken = verifyRes?.access_token;
      const refreshToken = verifyRes?.refresh_token;

      if (accessToken) {
        console.log('Storing access token:', accessToken.substring(0, 20) + '...');
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token", accessToken); // Also store as 'token' for compatibility
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
          if (me?.role) localStorage.setItem("user_role", me.role);
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

      // Redirect to appropriate dashboard based on user role and status
      setTimeout(async () => {
        const userRole = verifyRes?.user?.role;
        if (userRole === "affiliate") {
          window.location.href = "/dashboard/affiliate";
        } else if (userRole === "pharmacy_owner") {
          // Use owner flow logic
          try {
            const { getOwnerFlowStatus, getRedirectPath } = await import("@/utils/owner-flow");
            const status = await getOwnerFlowStatus();
            const redirectPath = getRedirectPath(status);
            window.location.href = redirectPath;
          } catch (error) {
            window.location.href = "/dashboard/kyc";
          }
        } else if (userRole === "supplier") {
          // Use supplier flow logic
          try {
            const { getSupplierFlowStatus, getRedirectPath } = await import("@/utils/supplier-flow");
            const status = await getSupplierFlowStatus();
            const redirectPath = getRedirectPath(status);
            window.location.href = redirectPath;
          } catch (error) {
            window.location.href = "/dashboard/supplier-kyc";
          }
        } else {
          window.location.href = "/dashboard";
        }
      }, 1000);
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6 text-slate-900">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-4 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute bottom-6 right-1/3 h-72 w-72 translate-x-1/2 rounded-full bg-blue-200/35 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl border border-emerald-100/80 bg-white/95 p-10 text-center shadow-[0_35px_100px_-55px_rgba(15,118,110,0.45)] backdrop-blur"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">Account verified!</h1>
          <p className="mt-3 text-sm text-slate-600">
            Your account has been activated. We'll send you to the affiliate dashboard in a moment.
          </p>
          <Button
            onClick={async () => {
              const userRole = localStorage.getItem("user_role") || "affiliate";
              if (userRole === "affiliate") {
                window.location.href = "/dashboard/affiliate";
              } else if (userRole === "pharmacy_owner") {
                // Use owner flow logic
                try {
                  const { getOwnerFlowStatus, getRedirectPath } = await import("@/utils/owner-flow");
                  const status = await getOwnerFlowStatus();
                  const redirectPath = getRedirectPath(status);
                  window.location.href = redirectPath;
                } catch (error) {
                  window.location.href = "/dashboard/kyc";
                }
              } else if (userRole === "supplier") {
                // Use supplier flow logic
                try {
                  const { getSupplierFlowStatus, getRedirectPath } = await import("@/utils/supplier-flow");
                  const status = await getSupplierFlowStatus();
                  const redirectPath = getRedirectPath(status);
                  window.location.href = redirectPath;
                } catch (error) {
                  window.location.href = "/dashboard/supplier-kyc";
                }
              } else {
                window.location.href = "/dashboard";
              }
            }}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 text-sm font-semibold text-white shadow-[0_25px_70px_-50px_rgba(15,118,110,0.45)] hover:translate-y-[-1px]"
          >
            Go now
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-[-5rem] right-[-3rem] h-[26rem] w-[26rem] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute inset-x-0 top-[40%] h-24 bg-gradient-to-r from-emerald-100/40 via-transparent to-blue-100/40 blur-2xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden rounded-r-[48px] border border-emerald-100 bg-white/80 p-12 shadow-[0_60px_160px_-90px_rgba(14,116,144,0.45)] backdrop-blur lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg space-y-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Secure verification
          </div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900">
            Confirm your email and unlock the partner dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Enter the one-time code sent to your inbox. Once it matches, we&rsquo;ll activate your affiliate portal and load your referral toolkit.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-slate-600">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm"
              >
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-xs text-slate-500">
            <p>
              Need help? {" "}
              <Link href="/contact" className="text-emerald-600 hover:underline">
                Partner support is a message away
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-xs text-slate-500"
        >
          <p>Verification keeps your earnings protected.</p>
          <p className="mt-1">© {new Date().getFullYear()} Mesob Partners.</p>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[520px] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md rounded-3xl border border-emerald-100/80 bg-white/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,118,110,0.45)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Verify your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter the six-digit code we just emailed to finish activating your partner access.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
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
                className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-[0_25px_70px_-50px_rgba(15,118,110,0.45)] transition duration-300 hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify account"}
            </Button>
          </form>

          <div className="mt-8 space-y-3 text-center text-xs text-slate-500">
            <p>
              Didn't get the code? <strong>Check your spam folder</strong> or{" "}
              <button
                onClick={handleResendCode}
                disabled={resendLoading || resendCooldown > 0 || !email}
                className="text-emerald-600 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {resendLoading ? "Sending..." : resendCooldown > 0 ? `resend in ${resendCooldown}s` : "resend code"}
              </button>
            </p>
            <p>
              Your verification code expires after 10 minutes for security.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyRegistrationPage() {
  return (
    <Suspense fallback={<SimpleLoading />}>
      <VerifyRegistrationContent />
    </Suspense>
  );
}