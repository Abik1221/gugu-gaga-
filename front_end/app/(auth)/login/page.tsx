// Login page
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { show } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await AuthAPI.login(username, password);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token ?? "");
      // Determine role and redirect
      const me = await AuthAPI.me();
      if (me.role === "affiliate") router.replace("/dashboard/affiliate");
      else if (me.role === "pharmacy_owner" || me.role === "cashier") router.replace("/dashboard/owner");
      else if (me.role === "admin") router.replace("/dashboard/admin");
      else router.replace("/dashboard");
      show({ variant: "success", title: "Welcome back", description: "Login successful" });
    } catch (err: any) {
      setError(err.message || "Login failed");
      show({ variant: "destructive", title: "Login failed", description: err.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login to Zemen Pharma</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-1">
          <label className="text-sm">Username</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
