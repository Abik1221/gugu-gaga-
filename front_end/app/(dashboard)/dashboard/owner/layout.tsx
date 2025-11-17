"use client"
import { OwnerSidebar } from "@/components/custom/owner-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OwnerGuard } from "@/components/auth/role-guard";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return (
        <OwnerGuard>
            <SidebarProvider>
                <OwnerSidebar />
                <SidebarInset className="p-3 bg-white">
                    <SidebarHeader className="p-3">
                        <SidebarTrigger />
                    </SidebarHeader>
                    <Separator className="mb-4" />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </OwnerGuard>
    );
}