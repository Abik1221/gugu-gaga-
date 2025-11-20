"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ErrorDialog } from "@/components/ui/error-dialog";
import AuthNavBar from "@/components/layout/AuthNavBar";
import { OtpSentDialog } from "@/components/ui/otp-sent-dialog";
import Navbar from "@/components/sections/Navbar";
import Head from "next/head";

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
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "error" | "warning" | "success";
  }>({ isOpen: false, title: "", message: "", type: "error" });

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await AuthAPI.loginRequestCode(email, password);
      setStep("verify");
      setShowOtpDialog(true);
    } catch (e: any) {
      const message = e.message || "Failed to send code";
      setError(null);

      if (message.includes("No account")) {
        setErrorDialog({
          isOpen: true,
          title: "Account Not Found",
          message: `We couldn't find an affiliate account with the email "${email}". Please check your email address and try again.`,
          type: "error",
        });
      } else if (message.includes("password")) {
        setErrorDialog({
          isOpen: true,
          title: "Incorrect Password",
          message:
            "The password you entered is incorrect. Please try again or reset your password.",
          type: "error",
        });
      } else {
        setErrorDialog({
          isOpen: true,
          title: "Login Failed",
          message: message,
          type: "error",
        });
      }
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

      // Helper function to set cookies
      const setCookie = (name: string, value: string, days: number) => {
        if (typeof document === "undefined") return;
        let expires = "";
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_role", "affiliate");
        // Set cookie for middleware authentication
        setCookie("access_token", data.access_token, 7);
      }
      try {
        await AuthAPI.me();
      } catch (profileError) {
        console.warn(
          "[affiliate-login] unable to load profile after login",
          profileError
        );
      }
      setErrorDialog({
        isOpen: true,
        title: "Welcome Back!",
        message: "Login successful. Redirecting to your affiliate dashboard...",
        type: "success",
      });
      setTimeout(() => (window.location.href = "/dashboard/affiliate"), 1500);
    } catch (e: any) {
      const message = e.message || "Verification failed";
      setError(null);

      if (message.includes("Invalid") || message.includes("expired")) {
        setErrorDialog({
          isOpen: true,
          title: "Invalid Code",
          message:
            "The verification code you entered is invalid or has expired. Please request a new code and try again.",
          type: "error",
        });
      } else {
        setErrorDialog({
          isOpen: true,
          title: "Verification Failed",
          message: message,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Affiliate Sign In - Partner Dashboard</title>
        <meta
          name="description"
          content="Sign in to your affiliate account and access your referral dashboard securely."
        />
        <meta
          name="keywords"
          content="affiliate sign in, partner login, referral tracking, affiliate dashboard"
        />
      </Head>
      <AuthNavBar />
      <OtpSentDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={email}
        purpose="login"
      />
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        type={errorDialog.type}
      />
      <div className="relative flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-slate-900">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute bottom-[-5rem] right-[-3rem] h-[26rem] w-[26rem] rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute inset-x-0 top-[38%] h-24 bg-gradient-to-r from-emerald-100/40 via-transparent to-blue-100/40 blur-2xl" />
        </div>

        <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden rounded-r-[48px] border border-emerald-100 bg-white/80 p-12 shadow-[0_60px_160px_-90px_rgba(14,116,144,0.55)] backdrop-blur lg:flex mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl font-semibold tracking-wide text-emerald-700">
                Mesob AI Affiliate Network
              </span>
            </div>

            <h1 className="mt-10 text-4xl font-bold leading-tight text-slate-900">
              Welcome back, partner
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Securely access your referral analytics, payouts, and marketing
              assets with our two-step sign-in.
            </p>

            <ul className="mt-10 space-y-4 text-slate-600">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4 text-sm text-slate-600"
          >
            <p>
              “Mesob AI makes login seamless and secure. I can track every
              business I refer with real-time transparency.”
            </p>
            <div className="h-px w-24 bg-emerald-100" />
            <p>
              Need help signing in?{" "}
              <Link
                href="/contact"
                className="text-emerald-600 hover:underline"
              >
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
            className="mx-auto w-full max-w-md rounded-3xl border border-emerald-100/80 bg-white/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,118,110,0.55)] backdrop-blur"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Affiliate sign in
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Use your credentials to receive a one-time code.
              </p>
            </div>

            <div className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-emerald-600">
              <span
                className={`relative overflow-hidden rounded-full px-3 py-1 ${step === "request"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-emerald-50 text-emerald-400"
                  }`}
              >
                Step 1
              </span>
              <span
                className={`relative overflow-hidden rounded-full px-3 py-1 ${step === "verify"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-50 text-emerald-400"
                  }`}
              >
                Step 2
              </span>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {step === "request" ? (
              <form onSubmit={requestCode} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Email*
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                      Password*
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
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
                  {loading ? "Sending code..." : "Send login code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="mt-2 border border-emerald-100 bg-emerald-50 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Login code*
                  </label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="mt-2 border border-emerald-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:translate-y-[-1px] hover:shadow-emerald-400/40"
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
                  {loading ? "Verifying..." : "Sign in"}
                </Button>

                <button
                  type="button"
                  className="w-full text-center text-xs font-medium text-emerald-600 underline-offset-4 hover:underline"
                  onClick={() => {
                    setStep("request");
                    setCode("");
                  }}
                >
                  Use a different email
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-xs text-slate-500">
              Need an affiliate account?{" "}
              <Link
                href="/auth?tab=affiliate"
                className="font-medium text-emerald-600 hover:underline"
              >
                Register here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
