import Link from "next/link";
import { Suspense } from "react";
import { motion } from "framer-motion";
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

export function Layout({ children, nav, pathname, user, isAffiliate, isAdmin }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50">
      <SidebarProvider>
        <Sidebar className="border-r border-neutral-200 bg-white fixed">
          <SidebarHeader className="flex h-16 items-center border-b border-neutral-200 px-6">
            <div className="flex items-center gap-2 py-3">
              {isAffiliate ? "Affiliate Console" : "Mesob AI"}
            </div>
          </SidebarHeader>

          <SidebarGroupContent className="p-4">
            <SidebarMenu>
              {nav.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const activeClasses = isAffiliate
                  ? "bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50"
                  : "bg-neutral-900 text-white hover:bg-neutral-800";
                const inactiveClasses = isAffiliate
                  ? "text-neutral-600 hover:bg-neutral-50"
                  : "text-neutral-600 hover:bg-neutral-100";

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses
                        }`}
                    >
                      <Link href={item.href} className="flex w-full items-center gap-3">
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
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-neutral-900 text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-neutral-500 text-xs truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </Sidebar>

        <SidebarInset>
          <Suspense fallback={<Loading />}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex-1 bg-white shadow-sm"
            >
              <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-neutral-600" />
                  <span className="text-neutral-900">
                    {nav.find((n) => pathname?.startsWith(n.href))?.label || "Overview"}
                  </span>
                </div>
                {!isAffiliate && !isAdmin && user?.tenant_id && (
                  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600">
                    Tenant: {user.tenant_id}
                  </span>
                )}
              </header>
              <main className="p-6 text-neutral-900">{children}</main>
            </motion.div>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
