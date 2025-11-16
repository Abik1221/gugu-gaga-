"use client";
import { AdminSideBar } from "@/components/custom/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminGuard } from "@/components/auth/admin-guard";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div>
        <SidebarProvider>
          <AdminSideBar />
          <SidebarInset className="p-3 bg-white">
            <SidebarHeader className="p-3">
              <SidebarTrigger />
            </SidebarHeader>
            <Separator className="mb-4" />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminGuard>
  );
}
