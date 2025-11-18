"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { API_BASE } from "@/utils/api";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import AuthNavBar from "@/components/layout/AuthNavBar";
import { OtpSentDialog } from "@/components/ui/otp-sent-dialog";
import Head from "next/head";

export default function SupplierSignInPage() {
  const router = useRouter();
  const show = (toast: any) => {
    if (typeof window !== 'undefined') {
      console.log('Toast:', toast.title, toast.description);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      show({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      show({
        variant: "destructive",
        title: "Invalid Password",
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", trimmedEmail);
      formData.append("password", password);
      formData.append("grant_type", "password");

      const response = await fetch(`${API_BASE}/auth/login/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Invalid credentials");
      }

      setOtpSent(true);
      setShowOtpDialog(true);
    } catch (err: any) {
      const message = err?.message || "Invalid credentials";
      setError(message);
      show({
        variant: "destructive",
        title: "Sign In Failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length < 4) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Invalid verification code");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_role", "supplier");

      show({
        variant: "success",
        title: "Welcome back!",
        description: "Redirecting to your supplier dashboard...",
      });

      // Redirect based on supplier status using flow logic
      setTimeout(async () => {
        try {
          const { getSupplierFlowStatus, getRedirectPath } = await import('@/utils/supplier-flow');
          const flowStatus = await getSupplierFlowStatus();
          const redirectPath = getRedirectPath(flowStatus);
          router.replace(redirectPath);
        } catch (error) {
          console.error('Error determining supplier redirect:', error);
          router.replace('/dashboard/supplier');
        }
      }, 1000);
    } catch (err: any) {
      const message = err?.message || "Invalid verification code";
      setError(message);
      show({
        variant: "destructive",
        title: "Verification Failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  const featureBullets = [
    "Manage your product catalog",
    "Track orders and shipments",
    "View performance analytics",
    "Connect with bussiness partners",
  ];

  return (
    <AuthRedirect>
      <Head>
        <title>Supplier Sign In - Access Your Dashboard</title>
        <meta
          name="description"
          content="Sign in to your supplier account and manage your business efficiently."
        />
        <meta
          name="keywords"
          content="supplier sign in, supplier login, business dashboard, manage orders"
        />
      </Head>
      <AuthNavBar />
      <OtpSentDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={email.trim()}
        purpose="login"
      />
      <div className="relative flex min-h-screen text-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        </div>

        <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-white p-12 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <h1 className="mt-10 text-4xl font-bold leading-tight text-black">
              Welcome back, supplier
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Access your supplier dashboard to manage orders, track
              performance, and grow your business.
            </p>

            <ul className="mt-10 space-y-4 text-slate-700">
              {featureBullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-black" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4 text-sm text-slate-700"
          >
            <p>
              "The supplier portal makes it easy to manage your bussiness from
              one place."
            </p>
            <div className="h-px w-24 bg-white/20" />
            <p>
              Need help?{" "}
              <Link href="/contact" className="text-black hover:underline">
                Contact supplier support
              </Link>
            </p>
          </motion.div>
        </div>

        <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[560px] lg:px-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_-40px_rgba(34,197,94,0.65)] backdrop-blur"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-black">
                Supplier Sign In
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Access your supplier dashboard and manage your business.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSignIn}
              className="space-y-5"
            >
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="supplier@company.com"
                      className="mt-2 border border-slate-200 bg-white/5 text-slate-700 placeholder:text-green-100/40 transition focus-visible:border-green-400 focus-visible:ring-green-400/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="mt-2 border border-slate-200 bg-white/5 text-slate-700 placeholder:text-green-100/40 transition focus-visible:border-green-400 focus-visible:ring-green-400/50"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="mt-2 border border-slate-200 bg-white/5 text-slate-700 placeholder:text-green-100/40 transition focus-visible:border-green-400 focus-visible:ring-green-400/50"
                    required
                    maxLength={6}
                  />
                  <p className="mt-2 text-xs text-slate-600">
                    Check your email for the verification code
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-slate-700">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-green-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-green-600 hover:bg-green-700 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-green-400/40"
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
                {loading
                  ? otpSent
                    ? "Verifying..."
                    : "Sending code..."
                  : otpSent
                  ? "Verify Code"
                  : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">
                    New to our platform?
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl border-slate-300 bg-white/5 text-slate-700 hover:bg-slate-50"
                onClick={() => router.push("/register/supplier")}
              >
                Register as Supplier
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-700">
                Different role?{" "}
                <Link
                  href="/owner-signin"
                  className="text-green-600 hover:underline"
                >
                  Business Owner
                </Link>{" "}
                |{" "}
                <Link
                  href="/affiliate-signin"
                  className="text-green-600 hover:underline"
                >
                  Affiliate
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-[11px] text-slate-700">
              Protected by industry-standard security.{" "}
              <Link href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AuthRedirect>
  );
}
