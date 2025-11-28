import Link from "next/link";
import React, { Suspense } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  nav: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  pathname?: string;
  user?: {
    tenant_id?: string;
    name?: string;
    email?: string;
  };
  isAffiliate?: boolean;
  isAdmin?: boolean;
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
    </div>
  );
}

function LayoutContent({
  children,
  nav,
  pathname,
  user,
  isAffiliate,
  isAdmin,
}: LayoutProps) {
  // Hook to control sidebar state (open/close)
  const { setOpenMobile } = useSidebar();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Sidebar className="border-r fixed !bg-white border-neutral-200">
        <SidebarHeader className="flex h-16 items-center justify-center border-b px-6 border-neutral-200">
          {isAffiliate ? (
            <Link href="/">
              <img src="/mesoblogo.jpeg" alt="Mesob Logo" width={80} height={80} className="rounded cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 py-3 font-semibold text-black cursor-pointer hover:opacity-80 transition-opacity">
              Mesob
            </Link>
          )}
        </SidebarHeader>

        <SidebarGroupContent className="p-4">
          <SidebarMenu className="space-y-2">
            {nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard/affiliate" && pathname?.startsWith(item.href));
              const activeClasses = "bg-emerald-600 text-white hover:bg-emerald-700";
              const inactiveClasses = item.label === "Sign out" ? "text-emerald-600 hover:bg-emerald-50" : "text-black hover:bg-gray-100";

              const handleClick = (e: React.MouseEvent) => {
                // Close mobile sidebar when any navigation link is clicked
                // This only affects mobile/tablet (<md breakpoint)
                // On desktop, sidebar stays open permanently
                setOpenMobile(false);

                if (item.label === "Sign out") {
                  e.preventDefault();
                  // Use centralized signOut function
                  const { signOut } = require("@/utils/api");
                  signOut();
                }
              };

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-sm cursor-pointer ${isActive ? activeClasses : inactiveClasses
                      }`}
                  >
                    <Link
                      href={item.href}
                      onClick={handleClick}
                      className="flex w-full items-center gap-3"
                    >
                      {item?.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        {/* User section at bottom */}
        <div className="mt-auto p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate text-black font-semibold">
                {user?.name || "User"}
              </p>
              <p className="text-xs truncate text-gray-600">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </Sidebar>

      <SidebarInset>
        <div className="overflow-auto h-screen">
          <Suspense fallback={<Loading />}>
            <div className="flex-1 bg-white shadow-sm">
              {/* Sticky header - stays at top when scrolling within SidebarInset */}
              {/* z-50 ensures header stays above all content */}
              {/* Solid background (no alpha/transparency) prevents flickering */}
              {/* No backdrop-blur to avoid transparency issues */}
              <header className={`sticky top-0 z-50 flex flex-col gap-3 border-b p-6 sm:flex-row sm:items-center sm:justify-between transition-shadow duration-300 ${isAffiliate
                  ? "bg-emerald-600 border-emerald-800 shadow-lg"
                  : "bg-white border-neutral-200"
                }`}>
                <div className="flex items-center gap-4">
                  <SidebarTrigger className={isAffiliate ? "text-white" : "text-neutral-600"} />
                  <div>
                    <h1 className={`text-2xl font-bold ${isAffiliate ? "text-white" : "text-neutral-900"
                      }`}>
                      {nav.find((n) => pathname?.startsWith(n.href))?.label || "Overview"}
                    </h1>
                    {isAffiliate && (
                      <p className="text-emerald-100 text-sm mt-1">Welcome back, {user?.name || "User"}!</p>
                    )}
                  </div>
                </div>

                {isAffiliate && pathname?.includes('/payouts') && (
                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-white text-sm font-medium">Refresh Data</span>
                  </button>
                )}
              </header>
              <main className="p-6 text-neutral-900">{children}</main>
            </div>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}

export function Layout(props: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50">
      <SidebarProvider>
        <LayoutContent {...props} />
      </SidebarProvider>
    </div>
  );
}
