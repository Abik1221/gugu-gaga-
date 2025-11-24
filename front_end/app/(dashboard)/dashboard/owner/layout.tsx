"use client"
import { OwnerSidebar } from "@/components/custom/owner-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return <div>
        <AuthProvider>
            <NotificationProvider>
                <SidebarProvider>
                    <OwnerSidebar />
                    <SidebarInset className="p-3 bg-white">
                        <SidebarHeader className="p-3 flex flex-row items-center justify-between">
                            <SidebarTrigger />
                            <NotificationPanel />
                        </SidebarHeader>
                        <Separator className="mb-4" />
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </NotificationProvider>
        </AuthProvider>
    </div>;
}