"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postForm, getAuthJSON } from "@/utils/api";

export default function LoginPage() {
    const router = useRouter();
    const [identity, setIdentity] = useState(""); // email or username
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const data = await postForm<{
                access_token: string;
                refresh_token: string;
                token_type: string;
                expires_in: number;
            }>("/api/v1/auth/login", {
                username: identity,
                password,
            });
            if (typeof window !== "undefined") {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
            }
            // Fetch user profile to decide destination (affiliate vs general)
            try {
                const me: any = await getAuthJSON("/api/v1/auth/me");
                if (typeof window !== "undefined" && me?.tenant_id) {
                    localStorage.setItem("tenant_id", String(me.tenant_id));
                }
                // Detect affiliate via JWT roles claim (more reliable than /me)
                let isAffiliate = false;
                try {
                    const [, payloadB64] = data.access_token.split(".");
                    const json = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
                    const rolesClaim: string[] = Array.isArray(json?.roles) ? json.roles : [];
                    isAffiliate = rolesClaim.map((r: any) => String(r).toLowerCase()).includes("affiliate");
                } catch {}
                if (typeof window !== "undefined") {
                    localStorage.setItem("is_affiliate", isAffiliate ? "true" : "false");
                }
                if (isAffiliate) {
                    router.replace("/dashboard/affiliate");
                } else {
                    router.replace("/dashboard");
                }
            } catch {
                // Fallback to general dashboard if profile fetch fails
                router.replace("/dashboard");
            }
        } catch (e: any) {
            setErr(e?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="mx-auto w-full sm:w-[520px]">
                <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100 px-6 py-5">
                        <h1 className="text-xl font-semibold text-emerald-800">Welcome back</h1>
                        <p className="text-sm text-emerald-700/80 mt-1">
                            Login to access your dashboard and tools.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="p-6 space-y-6">
                        {err && <div className="text-sm text-red-600">{err}</div>}

                        <div className="space-y-1">
                            <label className="text-sm text-emerald-700">Email or Username</label>
                            <Input
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="you@example.com or your-username"
                                className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-emerald-700">Password</label>
                                <a href="/forgot-password" className="text-xs text-emerald-700 underline">
                                    Forgot?
                                </a>
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <p className="text-sm text-emerald-700/80">
                                Don’t have an account?{" "}
                                <Link href="/signup" className="underline text-emerald-700">
                                    Create one
                                </Link>
                            </p>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="min-w-36 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}