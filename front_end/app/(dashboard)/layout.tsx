// Dashboard layout (sidebar, nav)
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE, getAccessToken, getAuthJSON } from "@/utils/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Me = {
  id: string;
  email: string;
  username: string;
  tenant_id?: string;
  roles?: { role: { name: string } }[];
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subBanner, setSubBanner] = useState<{ inactive: boolean; in_trial: boolean; trial_days_left?: number } | null>(null);

  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const me = await getAuthJSON<Me>("/api/v1/auth/me");
        if (!active) return;
        setUser(me);
        // One-time referral track
        try {
          const ref = typeof window !== "undefined" ? localStorage.getItem("referral_code") : null;
          if (ref && me?.id) {
            const token = getAccessToken();
            await fetch(`${API_BASE}/api/v1/affiliate/referrals/track`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(me?.tenant_id ? { "X-Tenant-ID": me.tenant_id } : {}),
              },
              body: JSON.stringify({ referral_code: ref, referred_user_id: me.id }),
            });
            localStorage.removeItem("referral_code");
          }
        } catch {}
      } catch (e: any) {
        if (!active) return;
        setError("Unauthorized");
        router.replace("/login");
      } finally {
        if (active) setLoading(false);
      }
    }
    // If no token, redirect immediately
    if (typeof window !== "undefined" && !localStorage.getItem("access_token")) {
      setLoading(false);
      router.replace("/login");
      return;
    }
    check();
    // Fetch subscription status to show banner if inactive (non-blocking UX hint)
    (async () => {
      try {
        const token = getAccessToken();
        const tenant = typeof window !== "undefined" ? localStorage.getItem("tenant_id") : null;
        if (!token || !tenant) return;
        const res = await fetch(`${API_BASE}/api/v1/subscriptions/current?tenant_id=${encodeURIComponent(tenant)}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        const inactive = !data?.in_trial && String(data?.status || "").toLowerCase() !== "active";
        setSubBanner({ inactive, in_trial: !!data?.in_trial, trial_days_left: data?.trial_days_left });
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [router]);

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return null; // Redirected
  }

  return (
    <Shell user={user} onLogout={logout}>
      {subBanner?.inactive && (
        <div className="mb-4 p-3 border rounded bg-amber-50 text-amber-800 text-sm">
          Subscription inactive. Please go to Billing to activate and restore full access.
          <a href="/dashboard/settings" className="ml-3 underline">Go to Billing</a>
        </div>
      )}
      {children}
    </Shell>
  );
}

function Shell({
  user,
  onLogout,
  children,
}: {
  user: Me | null;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOwnerOrManager = (user?.roles || []).some(r => {
    const n = (r?.role?.name || "").toLowerCase();
    return n === "owner" || n === "manager";
  });
  const nav = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/inventory", label: "Inventory" },
    { href: "/dashboard/pos", label: "POS" },
    { href: "/dashboard/affiliate", label: "Affiliate" },
    ...(isOwnerOrManager ? [{ href: "/dashboard/admin/payouts", label: "Payouts" }] : []),
    { href: "/dashboard/settings", label: "Settings" },
    { href: "/dashboard/about", label: "About" },
  ];

  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-2 border-r p-4 space-y-6 bg-white">
        <div className="space-y-1">
          <div className="text-lg font-semibold">Zemen Dashboard</div>
          <div className="text-xs text-gray-500">Secure area</div>
        </div>

        <div className="space-y-1 text-sm">
          {user ? (
            <div>
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          ) : null}
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "block rounded px-3 py-2 text-sm " +
                  (active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "hover:bg-gray-50 text-gray-700")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4">
          <Button variant="outline" onClick={onLogout} className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Logout
          </Button>
        </div>
      </aside>

      <div className="col-span-12 md:col-span-10 flex flex-col min-h-screen bg-gray-50">
        <header className="border-b bg-white p-4 flex items-center justify-between">
          <div className="font-medium">{nav.find(n => pathname?.startsWith(n.href))?.label || "Overview"}</div>
          <div className="text-sm text-gray-500">Tenant: {user?.tenant_id || "N/A"}</div>
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
