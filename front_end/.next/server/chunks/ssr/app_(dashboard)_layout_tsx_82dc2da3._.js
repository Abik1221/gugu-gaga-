module.exports = [
"[project]/app/(dashboard)/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function App({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
} // // Dashboard layout (sidebar, nav)
 // "use client";
 // import React, { Suspense, useEffect, useState } from "react";
 // import { useRouter } from "next/navigation";
 // import { AuthAPI, type AuthProfile } from "@/utils/api";
 // import Link from "next/link";
 // import { usePathname } from "next/navigation";
 // import { Button } from "@/components/ui/button";
 // import { motion } from "framer-motion";
 // import { Activity, Coins, DollarSign, LayoutDashboard, LinkIcon, LogOut, Settings2 } from "lucide-react";
 // {/*////////////////////////////*/ }
 // import { AppSidebar } from "@/components/app-sidebar"
 // import {
 //   Breadcrumb,
 //   BreadcrumbItem,
 //   BreadcrumbLink,
 //   BreadcrumbList,
 //   BreadcrumbPage,
 //   BreadcrumbSeparator,
 // } from "@/components/ui/breadcrumb"
 // import { Separator } from "@/components/ui/separator"
 // import {
 //   Sidebar,
 //   SidebarContent,
 //   SidebarFooter,
 //   SidebarGroup,
 //   SidebarGroupContent,
 //   SidebarHeader,
 //   SidebarInset,
 //   SidebarMenu,
 //   SidebarMenuButton,
 //   SidebarMenuItem,
 //   SidebarProvider,
 //   SidebarSeparator,
 //   SidebarTrigger,
 // } from "@/components/ui/sidebar"
 // import Loading from "./Loading";
 // {/*////////////////////////////*/ }
 // type RoleAssignment = {
 //   role?: {
 //     name?: string | null;
 //   } | null;
 // };
 // type Me = AuthProfile & {
 //   username?: string | null;
 //   roles?: RoleAssignment[] | null;
 // };
 // function deriveRoles(user: Me | null | undefined): string[] {
 //   const roles = new Set<string>();
 //   if (user?.role) roles.add(user.role.toLowerCase());
 //   user?.roles?.forEach((entry) => {
 //     const name = entry?.role?.name;
 //     if (name) roles.add(name.toLowerCase());
 //   });
 //   return Array.from(roles);
 // }
 // export default function DashboardLayout({
 //   children,
 // }: {
 //   children: React.ReactNode;
 // }) {
 //   const router = useRouter();
 //   const pathname = usePathname();
 //   const isAdminRoute = pathname?.startsWith("/dashboard/admin");
 //   const loginPath = isAdminRoute
 //     ? "/superadin/zemnpharma/login"
 //     : `/auth?tab=signin&next=${encodeURIComponent(pathname || "/dashboard")}`;
 //   const [loading, setLoading] = useState(true);
 //   const [user, setUser] = useState<Me | null>(null);
 //   const [error, setError] = useState<string | null>(null);
 //   const [banner, setBanner] = useState<
 //     | null
 //     | {
 //       kind: "kyc_pending" | "payment";
 //       title: string;
 //       description: string;
 //       actionHref?: string;
 //       actionLabel?: string;
 //     }
 //   >(null);
 //   const roles = deriveRoles(user);
 //   const roleName = roles[0] || "";
 //   const isAffiliate = roles.includes("affiliate");
 //   useEffect(() => {
 //     let cancelled = false;
 //     async function check() {
 //       try {
 //         const response = await AuthAPI.me();
 //         const me = response as Me;
 //         if (cancelled) return;
 //         setUser(me);
 //         // If KYC is pending and user is an owner/staff, keep them on status page only
 //         const primaryRole = (me?.role || me?.roles?.[0]?.role?.name || "").toLowerCase();
 //         const roleSet = deriveRoles(me);
 //         const isOwnerRole = roleSet.includes("pharmacy_owner") || roleSet.includes("owner");
 //         const isCashierRole = roleSet.includes("cashier");
 //         const isManagerRole = roleSet.includes("manager");
 //         const isStaffRole = isCashierRole || isManagerRole;
 //         if (isOwnerRole && pathname.startsWith("/dashboard/pos")) {
 //           router.replace("/dashboard/owner");
 //           return;
 //         }
 //         if (!isOwnerRole && pathname.startsWith("/dashboard/owner/staff")) {
 //           router.replace(isCashierRole ? "/dashboard/pos" : "/dashboard");
 //           return;
 //         }
 //         if (!isOwnerRole && pathname.startsWith("/dashboard/owner")) {
 //           router.replace(isCashierRole ? "/dashboard/pos" : isManagerRole ? "/dashboard/inventory" : "/dashboard");
 //           return;
 //         }
 //         if (primaryRole !== "admin" && pathname.startsWith("/dashboard/admin")) {
 //           router.replace("/dashboard/owner");
 //           return;
 //         }
 //         if (["pharmacy_owner", "owner", "cashier", "manager"].includes(primaryRole)) {
 //           const needsKyc = me?.kyc_status !== "approved";
 //           const needsPayment = me?.kyc_status === "approved" && me?.subscription_status && me.subscription_status !== "active";
 //           const ownerKycPath = "/dashboard/owner/kyc";
 //           const ownerPaymentPath = "/dashboard/owner/payment";
 //           if (needsKyc && pathname !== ownerKycPath) {
 //             router.replace(ownerKycPath);
 //             return;
 //           }
 //           if (!needsKyc && needsPayment && pathname !== ownerPaymentPath) {
 //             router.replace(ownerPaymentPath);
 //             return;
 //           }
 //           if (!needsKyc && !needsPayment && (pathname === ownerKycPath || pathname === ownerPaymentPath)) {
 //             router.replace("/dashboard/owner");
 //             return;
 //           }
 //           if (!needsKyc && !needsPayment && (pathname === "/dashboard" || pathname === "/dashboard/overview")) {
 //             router.replace("/dashboard/owner");
 //             return;
 //           }
 //         }
 //         // One-time referral track removed (handled server-side)
 //       } catch (e: any) {
 //         if (cancelled) return;
 //         setError("Unauthorized");
 //         router.replace(loginPath);
 //       } finally {
 //         if (!cancelled) setLoading(false);
 //       }
 //     }
 //     // If no token, redirect immediately
 //     if (typeof window !== "undefined" && !localStorage.getItem("access_token")) {
 //       setLoading(false);
 //       router.replace(loginPath);
 //       return;
 //     }
 //     check();
 //     return () => {
 //       cancelled = true;
 //     };
 //   }, [router, pathname, loginPath]);
 //   useEffect(() => {
 //     if (!user) {
 //       setBanner(null);
 //       return;
 //     }
 //     const userRoles = deriveRoles(user);
 //     const isOwner = userRoles.includes("pharmacy_owner") || userRoles.includes("owner");
 //     const isCashier = userRoles.includes("cashier");
 //     if (!(isOwner || isCashier)) {
 //       setBanner(null);
 //       return;
 //     }
 //     if (user.kyc_status && user.kyc_status !== "approved") {
 //       setBanner({
 //         kind: "kyc_pending",
 //         title: "KYC review in progress",
 //         description: "Thanks for submitting your application. Our compliance team is reviewing your documents — you will receive an email once it is approved.",
 //       });
 //       return;
 //     }
 //     const status = user.subscription_status || "active";
 //     if (["awaiting_payment", "pending_verification", "payment_rejected"].includes(status)) {
 //       const copies: Record<string, { title: string; description: string }> = {
 //         awaiting_payment: {
 //           title: "Subscription payment required",
 //           description: "Complete your first subscription payment and submit the receipt code so the admin team can activate your access.",
 //         },
 //         pending_verification: {
 //           title: "Payment awaiting verification",
 //           description: "We have received your payment code. The admin team is verifying it — you will be notified once access is restored.",
 //         },
 //         payment_rejected: {
 //           title: "Payment could not be verified",
 //           description: "The last payment submission was rejected. Please double-check the receipt code and submit it again.",
 //         },
 //       };
 //       const copy = copies[status];
 //       setBanner({
 //         kind: "payment",
 //         title: copy.title,
 //         description: copy.description,
 //         actionHref: "/dashboard/owner/payment",
 //         actionLabel: "Submit payment",
 //       });
 //       return;
 //     }
 //     setBanner(null);
 //   }, [user]);
 //   function logout() {
 //     if (typeof window !== "undefined") {
 //       localStorage.removeItem("access_token");
 //       localStorage.removeItem("refresh_token");
 //     }
 //     if (isAffiliate) {
 //       router.replace("/auth?tab=signin");
 //       return;
 //     }
 //     if (roleName === "admin") {
 //       router.replace("/superadin/zemnpharma/login");
 //       return;
 //     }
 //     router.replace("/auth?tab=signin");
 //   }
 //   if (loading) {
 //     return (
 //       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
 //         <div className="animate-pulse text-emerald-200/70">Loading dashboard...</div>
 //       </div>
 //     );
 //   }
 //   if (error) {
 //     return null; // Redirected
 //   }
 //   return (
 //     <Shell user={user} onLogout={logout}>
 //       {banner && (
 //         <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100 backdrop-blur">
 //           <div>
 //             <div className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">{banner.title}</div>
 //             <div className="mt-1 text-xs md:text-sm text-amber-100/80">{banner.description}</div>
 //           </div>
 //           {banner.actionHref && banner.actionLabel && (
 //             <a
 //               href={banner.actionHref}
 //               className="inline-flex items-center justify-center rounded-full border border-amber-300/40 bg-amber-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-500/25"
 //             >
 //               {banner.actionLabel}
 //             </a>
 //           )}
 //         </div>
 //       )}
 //       {children}
 //     </Shell>
 //   );
 // }
 // function Shell({
 //   user,
 //   onLogout,
 //   children,
 // }: {
 //   user: Me | null;
 //   onLogout: () => void;
 //   children: React.ReactNode;
 // }) {
 //   const router = useRouter();
 //   const pathname = usePathname();
 //   const roles = deriveRoles(user);
 //   const baseRole = (user?.role || "").toLowerCase();
 //   const primaryRole = baseRole || roles[0] || "";
 //   const isOwner = baseRole === "pharmacy_owner" || baseRole === "owner" || roles.includes("pharmacy_owner") || roles.includes("owner");
 //   const isCashier = baseRole === "cashier" || roles.includes("cashier");
 //   const isManager = baseRole === "manager" || roles.includes("manager");
 //   const isAffiliate = baseRole === "affiliate" || roles.includes("affiliate");
 //   const isAdmin = baseRole === "admin";
 //   const isTenantStaff = isOwner || isManager || isCashier;
 //   const subscriptionStatus = user?.subscription_status || "active";
 //   const requiresPayment = isTenantStaff && user?.kyc_status === "approved" && subscriptionStatus !== "active";
 //   const kycPending = isTenantStaff && user?.kyc_status && user.kyc_status !== "approved";
 //   const ownerKycPath = "/dashboard/owner/kyc";
 //   const ownerPaymentPath = "/dashboard/owner/payment";
 //   if (user && isTenantStaff) {
 //     if (kycPending && pathname !== ownerKycPath) {
 //       router.replace(ownerKycPath);
 //       return null;
 //     }
 //     if (!kycPending && requiresPayment && pathname !== ownerPaymentPath) {
 //       router.replace(ownerPaymentPath);
 //       return null;
 //     }
 //   }
 //   let nav: { href: string; label: string, icon: React.ReactNode }[];
 //   if (isAffiliate) {
 //     nav = [{ href: "/dashboard/affiliate", label: "Affiliate Dashboard", icon: <LayoutDashboard /> },
 //     { href: "/dashboard/affiliate/generate-link", label: "Generate Link", icon: <LinkIcon /> },
 //     { href: "/dashboard/affiliate/commissions", label: "Commissions", icon: <Coins /> },
 //     { href: "/dashboard/affiliate/payouts", label: "Payouts", icon: <DollarSign /> },
 //     { href: "/dashboard/affiliate/activities", label: "Activities", icon: <Activity /> }
 //     ];
 //   } else if (isAdmin) {
 //     nav = [
 //       { href: "/dashboard/admin", label: "Admin Overview" },
 //       { href: "/dashboard/admin/segments", label: "Pharmacy Segments" },
 //       { href: "/dashboard/admin/users", label: "Users" },
 //       { href: "/dashboard/admin/pharmacies", label: "Pharmacies" },
 //       { href: "/dashboard/admin/affiliates", label: "Affiliates" },
 //       { href: "/dashboard/admin/payouts", label: "Payouts" },
 //       { href: "/dashboard/admin/audit", label: "Audit Log" },
 //     ];
 //   } else if (isOwner) {
 //     if (kycPending) {
 //       nav = [{ href: "/dashboard/owner/kyc", label: "KYC" }];
 //     } else if (requiresPayment) {
 //       nav = [{ href: "/dashboard/owner/payment", label: "Payment" }];
 //     } else {
 //       nav = [
 //         { href: "/dashboard/owner", label: "Owner Overview" },
 //         { href: "/dashboard/owner/agent", label: "AI Assistant" },
 //         { href: "/dashboard/owner/branches", label: "Branches" },
 //         { href: "/dashboard/inventory", label: "Inventory" },
 //         { href: "/dashboard/owner/settings", label: "Settings" },
 //         { href: "/dashboard/owner/staff", label: "Staff Management" },
 //       ];
 //     }
 //   } else if ((isManager || isCashier)) {
 //     if (kycPending) {
 //       nav = [{ href: "/dashboard/owner/kyc", label: "KYC" }];
 //     } else if (requiresPayment) {
 //       nav = [{ href: "/dashboard/owner/payment", label: "Payment" }];
 //     } else {
 //       nav = [
 //         { href: "/dashboard/pos", label: "Point of Sale" },
 //         { href: "/dashboard/inventory", label: "Inventory" },
 //         { href: "/dashboard/settings", label: "Settings" },
 //       ];
 //     }
 //   } else {
 //     nav = [
 //       { href: "/dashboard", label: "Overview" },
 //       { href: "/dashboard/inventory", label: "Inventory" },
 //       { href: "/dashboard/pos", label: "POS" },
 //       { href: "/dashboard/affiliate", label: "Affiliate" },
 //       { href: "/dashboard/settings", label: "Settings" },
 //       { href: "/dashboard/about", label: "About" },
 //     ];
 //   }
 //   console.log('nav: ', nav);
 //   return (
 //     <div className="relative min-h-screen overflow-hidden bg-white text-white">
 //       <SidebarProvider>
 //         <Sidebar className="border-r fixed">
 //           <SidebarHeader className="flex h-16 items-center border-b px-6">
 //             <div className="flex items-center gap-2 font-semibold">
 //               <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary">
 //                 <span className="text-xs font-bold text-primary-foreground">Z</span>
 //               </div>
 //               <span className="text-lg">Zemen Pharma</span>
 //             </div>
 //           </SidebarHeader>
 //           <SidebarGroupContent className="p-6">
 //             <SidebarMenu>
 //               {nav.map((item) => (
 //                 <SidebarMenuItem key={item.label}>
 //                   <SidebarMenuButton>
 //                     {item?.icon}
 //                     <a href={item.href}>{item.label}</a>
 //                   </SidebarMenuButton>
 //                 </SidebarMenuItem>
 //               ))}
 //             </SidebarMenu>
 //           </SidebarGroupContent>
 //         </Sidebar>
 //         <SidebarInset>
 //           <Suspense fallback={<Loading />}>
 //             <motion.div
 //               initial={{ opacity: 0, y: 24 }}
 //               animate={{ opacity: 1, y: 0 }}
 //               transition={{ duration: 0.45, ease: "easeOut" }}
 //               className="flex-1 bg-slate-900/70 shadow-[0_40px_120px_-50px_rgba(14,116,144,0.6)] backdrop-blur-2xl"
 //             >
 //               <header className="flex flex-col gap-3 border-b border-white/10 p-6 text-sm text-emerald-100/80 sm:flex-row sm:items-center sm:justify-between">
 //                 <SidebarTrigger className="" />
 //                 <span className="text-base font-semibold text-white">
 //                   {nav.find((n) => pathname?.startsWith(n.href))?.label || "Overview"}
 //                 </span>
 //                 {!isAffiliate && !isAdmin && (
 //                   <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-emerald-200">
 //                     Tenant: {user?.tenant_id || "N/A"}
 //                   </span>
 //                 )}
 //               </header>
 //               <main className="p-6 text-emerald-50/90">{children}</main>
 //             </motion.div>
 //           </Suspense>
 //         </SidebarInset>
 //       </SidebarProvider>
 //     </div>
 //   );
 // }
}),
];

//# sourceMappingURL=app_%28dashboard%29_layout_tsx_82dc2da3._.js.map