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

function deriveRoles(user: Me | null | undefined): string[] {
  const roles = new Set<string>();
  if (user?.role) roles.add(user.role.toLowerCase());
  user?.roles?.forEach((entry) => {
    const name = entry?.role?.name;
    if (name) roles.add(name.toLowerCase());
  });
  return Array.from(roles);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard/admin");
  const loginPath = isAdminRoute
    ? "/login"
    : `/auth?tab=signin&next=${encodeURIComponent(pathname || "/dashboard")}`;
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
  const roles = deriveRoles(user);
  const roleName = roles[0] || "";
  const isAffiliate = roles.includes("affiliate");

  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const me = await getAuthJSON<Me>("/auth/me");
        if (!active) return;
        setUser(me);
        // If KYC is pending and user is an owner/staff, keep them on status page only
        const primaryRole = (me?.role || me?.roles?.[0]?.role?.name || "").toLowerCase();
        const roleSet = deriveRoles(me);
        const isOwnerRole = roleSet.includes("pharmacy_owner") || roleSet.includes("owner");
        const isCashierRole = roleSet.includes("cashier");
        if (isOwnerRole && pathname.startsWith("/dashboard/pos")) {
          router.replace("/dashboard/owner");
          return;
        }
        if (!isOwnerRole && pathname.startsWith("/dashboard/owner/staff")) {
          router.replace(isCashierRole ? "/dashboard/pos" : "/dashboard");
          return;
        }
        if (primaryRole !== "admin" && pathname.startsWith("/dashboard/admin")) {
          router.replace("/dashboard/owner");
          return;
        }
        if (["pharmacy_owner", "owner", "cashier", "manager"].includes(primaryRole)) {
          const needsKyc = me?.kyc_status !== "approved";
          const needsPayment = me?.kyc_status === "approved" && me?.subscription_status && me.subscription_status !== "active";
          const ownerKycPath = "/dashboard/owner/kyc";
          const ownerPaymentPath = "/dashboard/owner/payment";
          if (needsKyc && pathname !== ownerKycPath) {
            router.replace(ownerKycPath);
            return;
          }
          if (!needsKyc && needsPayment && pathname !== ownerPaymentPath) {
            router.replace(ownerPaymentPath);
            return;
          }
          if (!needsKyc && !needsPayment && (pathname === ownerKycPath || pathname === ownerPaymentPath)) {
            router.replace("/dashboard/owner");
            return;
          }
        }
        // One-time referral track removed (handled server-side)
      } catch (e: any) {
        if (!active) return;
        setError("Unauthorized");
        router.replace(loginPath);
      } finally {
        if (active) setLoading(false);
      }
    }
    // If no token, redirect immediately
    if (typeof window !== "undefined" && !localStorage.getItem("access_token")) {
      setLoading(false);
      router.replace(loginPath);
      return;
    }
    check();
    return () => {
      active = false;
    };
  }, [router, pathname, loginPath]);

  useEffect(() => {
    if (!user) {
      setBanner(null);
      return;
    }
    const userRoles = deriveRoles(user);
    const isOwner = userRoles.includes("pharmacy_owner") || userRoles.includes("owner");
    const isCashier = userRoles.includes("cashier");
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
        actionHref: "/dashboard/owner/payment",
        actionLabel: "Submit payment",
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
    if (isAffiliate) {
      router.replace("/auth/affiliate-login");
      return;
    }
    if (roleName === "admin") {
      router.replace("/login");
      return;
    }
    router.replace("/auth?tab=signin");
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
  const roles = deriveRoles(user);
  const baseRole = (user?.role || "").toLowerCase();
  const primaryRole = baseRole || roles[0] || "";
  const isOwner = baseRole === "pharmacy_owner" || baseRole === "owner" || roles.includes("pharmacy_owner") || roles.includes("owner");
  const isCashier = baseRole === "cashier" || roles.includes("cashier");
  const isManager = baseRole === "manager" || roles.includes("manager");
  const isAffiliate = baseRole === "affiliate" || roles.includes("affiliate");
  const isAdmin = baseRole === "admin";
  const isTenantStaff = isOwner || isManager || isCashier;
  const subscriptionStatus = user?.subscription_status || "active";
  const requiresPayment = isTenantStaff && user?.kyc_status === "approved" && subscriptionStatus !== "active";
  const kycPending = isTenantStaff && user?.kyc_status && user.kyc_status !== "approved";

  let nav: { href: string; label: string }[];
  if (isAffiliate) {
    nav = [{ href: "/dashboard/affiliate", label: "Affiliate Dashboard" }];
  } else if (isAdmin) {
    nav = [
      { href: "/dashboard/admin", label: "Admin Overview" },
      { href: "/dashboard/admin/users", label: "Users" },
      { href: "/dashboard/admin/pharmacies", label: "Pharmacies" },
      { href: "/dashboard/admin/affiliates", label: "Affiliates" },
      { href: "/dashboard/admin/payouts", label: "Payouts" },
      { href: "/dashboard/admin/audit", label: "Audit Log" },
    ];
  } else if (isOwner) {
    if (kycPending) {
      nav = [{ href: "/dashboard/owner/kyc", label: "KYC" }];
    } else if (requiresPayment) {
      nav = [{ href: "/dashboard/owner/payment", label: "Payment" }];
    } else {
      nav = [
        { href: "/dashboard/owner", label: "Owner Overview" },
        { href: "/dashboard/inventory", label: "Inventory" },
        { href: "/dashboard/settings", label: "Settings" },
        { href: "/dashboard/owner/staff", label: "Staff Management" },
      ];
    }
  } else if ((isManager || isCashier)) {
    if (kycPending) {
      nav = [{ href: "/dashboard/owner/kyc", label: "KYC" }];
    } else if (requiresPayment) {
      nav = [{ href: "/dashboard/owner/payment", label: "Payment" }];
    } else {
      nav = [
        { href: "/dashboard/pos", label: "Point of Sale" },
        { href: "/dashboard/inventory", label: "Inventory" },
        { href: "/dashboard/settings", label: "Settings" },
      ];
    }
  } else {
    nav = [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/inventory", label: "Inventory" },
      { href: "/dashboard/pos", label: "POS" },
      { href: "/dashboard/affiliate", label: "Affiliate" },
      { href: "/dashboard/settings", label: "Settings" },
      { href: "/dashboard/about", label: "About" },
    ];
  }

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
              {primaryRole && <div className="text-2xs uppercase text-gray-400">{primaryRole}</div>}
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
