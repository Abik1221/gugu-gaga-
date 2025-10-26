// Dashboard layout (sidebar, nav)
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthJSON } from "@/utils/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Me = {
  id: string;
  email: string;
  username: string;
  role?: string;
  tenant_id?: string;
  roles?: { role: { name: string } }[];
  kyc_status?: string | null;
  subscription_status?: string | null;
  subscription_blocked?: boolean | null;
  subscription_next_due_date?: string | null;
  latest_payment_status?: string | null;
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
  const [banner, setBanner] = useState<
    | null
    | {
        kind: "kyc_pending" | "payment";
        title: string;
        description: string;
        actionHref?: string;
        actionLabel?: string;
      }
  >(null);
  const roleName = (user?.role || user?.roles?.[0]?.role?.name || "").toLowerCase();
  const isAffiliate = roleName === "affiliate";

  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const me = await getAuthJSON<Me>("/auth/me");
        if (!active) return;
        setUser(me);
        // One-time referral track removed (handled server-side)
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
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!user) {
      setBanner(null);
      return;
    }
    const roleName = (user?.role || user?.roles?.[0]?.role?.name || "").toLowerCase();
    const isOwner = roleName === "pharmacy_owner" || roleName === "owner";
    const isCashier = roleName === "cashier";
    if (!(isOwner || isCashier)) {
      setBanner(null);
      return;
    }

    if (user.kyc_status && user.kyc_status !== "approved") {
      setBanner({
        kind: "kyc_pending",
        title: "KYC review in progress",
        description: "Thanks for submitting your application. Our compliance team is reviewing your documents — you will receive an email once it is approved.",
      });
      return;
    }

    const status = user.subscription_status || "active";
    if (["awaiting_payment", "pending_verification", "payment_rejected"].includes(status)) {
      const copies: Record<string, { title: string; description: string }> = {
        awaiting_payment: {
          title: "Subscription payment required",
          description: "Complete your first subscription payment and submit the receipt code so the admin team can activate your access.",
        },
        pending_verification: {
          title: "Payment awaiting verification",
          description: "We have received your payment code. The admin team is verifying it — you will be notified once access is restored.",
        },
        payment_rejected: {
          title: "Payment could not be verified",
          description: "The last payment submission was rejected. Please double-check the receipt code and submit it again.",
        },
      };
      const copy = copies[status];
      setBanner({
        kind: "payment",
        title: copy.title,
        description: copy.description,
        actionHref: "/dashboard/owner/billing",
        actionLabel: "View payment guide",
      });
      return;
    }

    setBanner(null);
  }, [user]);

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    router.replace(isAffiliate ? "/auth/affiliate-login" : "/login");
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
      {banner && (
        <div className="mb-4 p-3 border rounded bg-amber-50 text-amber-800 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-medium">{banner.title}</div>
            <div className="text-xs md:text-sm">{banner.description}</div>
          </div>
          {banner.actionHref && banner.actionLabel && (
            <a href={banner.actionHref} className="inline-flex items-center justify-center rounded border border-amber-600 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100">
              {banner.actionLabel}
            </a>
          )}
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
  const roleName = (user?.role || user?.roles?.[0]?.role?.name || "").toLowerCase();
  const isOwner = roleName === "pharmacy_owner" || roleName === "owner";
  const isCashier = roleName === "cashier";
  const isManager = roleName === "manager";
  const isAffiliate = roleName === "affiliate";
  const isAdmin = roleName === "admin";
  const isOwnerOrManager = isOwner || isManager || isCashier;

  const nav = isAffiliate
    ? [{ href: "/dashboard/affiliate", label: "Affiliate Dashboard" }]
    : isAdmin
    ? [
        { href: "/dashboard/admin", label: "Admin Overview" },
        { href: "/dashboard/admin/users", label: "Users" },
        { href: "/dashboard/admin/pharmacies", label: "Pharmacies" },
        { href: "/dashboard/admin/affiliates", label: "Affiliates" },
        { href: "/dashboard/admin/payouts", label: "Payouts" },
        { href: "/dashboard/admin/audit", label: "Audit Log" },
      ]
    : isOwnerOrManager
    ? [
        { href: "/dashboard/owner", label: "Owner Overview" },
        { href: "/dashboard/owner/billing", label: "Billing" },
        { href: "/dashboard/inventory", label: "Inventory" },
        { href: "/dashboard/pos", label: "POS" },
        { href: "/dashboard/affiliate", label: "Affiliate" },
        { href: "/dashboard/admin/payouts", label: "Payouts" },
        { href: "/dashboard/settings", label: "Settings" },
        { href: "/dashboard/about", label: "About" },
      ]
    : [
        { href: "/dashboard", label: "Overview" },
        { href: "/dashboard/inventory", label: "Inventory" },
        { href: "/dashboard/pos", label: "POS" },
        { href: "/dashboard/affiliate", label: "Affiliate" },
        { href: "/dashboard/settings", label: "Settings" },
        { href: "/dashboard/about", label: "About" },
      ];

  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-2 border-r p-4 space-y-6 bg-white">
        <div className="space-y-1">
          <div className="text-lg font-semibold">
            {isAffiliate ? "Affiliate Portal" : isAdmin ? "Admin Console" : "Zemen Dashboard"}
          </div>
          <div className="text-xs text-gray-500">
            {isAffiliate ? "Track referrals & payouts" : isAdmin ? "Manage platform data" : "Secure area"}
          </div>
        </div>

        <div className="space-y-1 text-sm">
          {user ? (
            <div>
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
              {roleName && <div className="text-2xs uppercase text-gray-400">{roleName}</div>}
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
          {!isAffiliate && !isAdmin && <div className="text-sm text-gray-500">Tenant: {user?.tenant_id || "N/A"}</div>}
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
