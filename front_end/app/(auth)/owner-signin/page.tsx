"use client";
import React, { useState, FormEvent, JSX } from "react";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";
import { ErrorDialog } from "@/components/ui/error-dialog";
import { API_BASE } from "@/utils/api";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import AuthNavBar from "@/components/layout/AuthNavBar";
import { OtpSentDialog } from "@/components/ui/otp-sent-dialog";
import { getOwnerFlowStatus, getRedirectPath } from "@/utils/owner-flow";
import Link from "next/link";
import Head from "next/head";

type Errors = {
  identifier?: string;
  password?: string;
  form?: string;
};

export default function PharmacySignInPage(): JSX.Element {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(true);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "error" | "warning" | "success";
  }>({ isOpen: false, title: "", message: "", type: "error" });

  function validate(): Errors {
    const e: Errors = {};
    if (!identifier.trim()) e.identifier = "Email or phone is required";
    else if (
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier) &&
      !/^\+?[0-9]{7,15}$/.test(identifier)
    ) {
      e.identifier = "Enter a valid email or phone number";
    }
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be 6+ characters";
    return e;
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", identifier.trim());
      formData.append("password", password);
      formData.append("grant_type", "password");

      const response = await fetch(`${API_BASE}/auth/login/request-code?expected_role=pharmacy_owner`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || "Invalid credentials";

        if (message.includes("registered as a")) {
          setErrorDialog({
            isOpen: true,
            title: "Wrong Login Page",
            message: message,
            type: "warning",
          });
        } else if (message.includes("No account")) {
          setErrorDialog({
            isOpen: true,
            title: "Account Not Found",
            message: `We couldn't find an account with "${identifier.trim()}". Please check your email/phone and try again.`,
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
        return;
      }

      setOtpSent(true);
      setShowOtpDialog(true);
    } catch (err: any) {
      // Error already handled above
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!otp || otp.length < 4) {
      setErrors({ form: "Please enter the verification code." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier.trim(), code: otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || "Invalid verification code";

        if (message.includes("Invalid") || message.includes("expired")) {
          setErrorDialog({
            isOpen: true,
            title: "Invalid Code",
            message:
              "The verification code you entered is invalid or has expired. Please request a new code.",
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
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_role", "pharmacy_owner");

      setErrorDialog({
        isOpen: true,
        title: "Welcome Back!",
        message: "Login successful. Redirecting to your dashboard...",
        type: "success",
      });

      setTimeout(async () => {
        try {
          const status = await getOwnerFlowStatus();
          const redirectPath = getRedirectPath(status);
          window.location.replace(redirectPath);
        } catch (error) {
          // Fallback to KYC page if status check fails
          window.location.replace("/dashboard/kyc");
        }
      }, 1000);
    } catch (err: any) {
      // Error already handled above
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthRedirect>
      <Head>
        <title>Owner Sign In - Manage Your Business</title>
        <meta
          name="description"
          content="Sign in to your business owner account and manage your operations securely."
        />
        <meta
          name="keywords"
          content="owner sign in, business management, secure login, business dashboard"
        />
      </Head>
      <AuthNavBar />
      <OtpSentDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={identifier.trim()}
        purpose="login"
      />
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        type={errorDialog.type}
      />
      <div className="min-h-screen bg-white text-slate-800 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl shadow-2xl overflow-hidden bg-white border border-slate-200">
          {/* Left: brand area */}
          <aside className="hidden md:flex flex-col justify-center items-start p-10 bg-gradient-to-br from-emerald-100 to-emerald-50">
            <div className="rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  height={80}
                  width={80}
                  src={logoImage}
                  alt="Mesob Logo"
                  className="rounded"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-emerald-700">
                    Mesob
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage — Grow — Succeed
                  </p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Access your business dashboard, manage operations, and track
                performance. Sign in to continue to your business management
                platform.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>• Business operations management</li>
                <li>• Inventory & stock control</li>
                <li>• Staff & team management</li>
              </ul>
            </div>
          </aside>

          {/* Right: sign-in form */}
          <main className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Business Owner Sign In
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Welcome back — enter your credentials to continue.
              </p>
            </div>

            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSubmit}
              className="space-y-5"
            >
              {errors.form && (
                <div className="text-sm text-red-600 bg-red-100 border border-red-300 p-3 rounded">
                  {errors.form}
                </div>
              )}

              {!otpSent ? (
                <>
                  <div>
                    <label
                      htmlFor="identifier"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Email or phone
                    </label>
                    <input
                      id="identifier"
                      name="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={`w-full bg-white border ${
                        errors.identifier
                          ? "border-red-500"
                          : "border-slate-300"
                      } rounded-lg px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                      placeholder="you@business.com or +251900000000"
                      aria-invalid={!!errors.identifier}
                      aria-describedby={
                        errors.identifier ? "identifier-error" : undefined
                      }
                      autoComplete="username"
                      inputMode="email"
                    />
                    {errors.identifier && (
                      <p
                        id="identifier-error"
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.identifier}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-white border ${
                          errors.password
                            ? "border-red-500"
                            : "border-slate-300"
                        } rounded-lg px-4 py-3 pr-12 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                        placeholder="••••••••"
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-md"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && (
                      <p
                        id="password-error"
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <p className="mt-2 text-sm text-slate-600">
                    Check your email for the verification code
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-xl px-4 py-3 font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                >
                  {loading
                    ? otpSent
                      ? "Verifying..."
                      : "Sending code..."
                    : otpSent
                    ? "Verify Code"
                    : "Sign in"}
                </button>
              </div>

              <div className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/register/owner"
                  className="text-emerald-600 hover:underline"
                >
                  Create one
                </Link>
              </div>
            </form>

            <div className="mt-6 text-xs text-slate-400">
              <p>
                By signing in you agree to our{" "}
                <a href="/terms" className="text-emerald-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-emerald-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </main>
        </div>
      </div>
    </AuthRedirect>
  );
}
