"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { StaffSidebar } from "@/components/custom/staff-sidebar";
import { StaffGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth/auth-provider";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <StaffGuard>
      <SidebarProvider>
        <StaffSidebar user={user} />
        <SidebarInset className="bg-white text-black">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
            <SidebarTrigger className="-ml-1 text-black" />
            <div className="flex-1">
              <h1 className="font-semibold text-black text-lg">
                Staff Dashboard
              </h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </StaffGuard>
  );
}
