"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function AffiliateLoginPage() {
  const router = useRouter();
  const { show } = useToast();
  const [step, setStep] = useState<"request"|"verify">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      await AuthAPI.loginRequestCode(email, password);
      setStep("verify");
      show({ variant: "success", title: "Code sent", description: "Check your email for your login code." });
    } catch (e:any) {
      setError(e.message || "Failed to send code");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed" });
    } finally { setLoading(false); }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const data = await AuthAPI.loginVerify(email, code);
      localStorage.setItem("access_token", data.access_token);
      show({ variant: "success", title: "Welcome", description: "Login successful" });
      router.replace("/dashboard/affiliate");
    } catch (e:any) {
      setError(e.message || "Verification failed");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed" });
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 border rounded p-6 bg-white">
        <h1 className="text-2xl font-semibold">Affiliate Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {step === "request" ? (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Sending..." : "Send Login Code"}</Button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" value={email} disabled readOnly />
            </div>
            <div>
              <label className="text-sm">Login Code</label>
              <Input value={code} onChange={e=>setCode(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Verifying..." : "Sign In"}</Button>
          </form>
        )}
        <div className="text-xs text-gray-500 mt-2">No account? <a href="/register" className="underline">Register as Affiliate</a></div>
      </div>
    </div>
  );
}
