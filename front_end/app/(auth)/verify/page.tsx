"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI } from "@/utils/api";

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
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="text-emerald-600 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-semibold text-emerald-600">
            Account Verified!
          </h1>
          <p className="text-gray-600">
            Your account has been successfully verified. Redirecting you to
            your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verify Your Account</h1>
          <p className="text-gray-600 text-sm mt-2">
            Enter the verification code sent to your email to complete your
            registration.
          </p>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">Verification Code</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              autoComplete="one-time-code"
              maxLength={6}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify Account"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>Didn't receive the code?</p>
          <p>Check your spam folder or try registering again.</p>
        </div>
      </div>
    </div>
  );
}
