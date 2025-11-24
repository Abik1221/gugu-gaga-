```javascript
"use client"
import { OwnerSidebar } from "@/components/custom/owner-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function OwnerLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && user) {
            if (user.kyc_status !== "approved") {
                router.replace("/dashboard/kyc");
            } else if (user.subscription_status !== "active") {
                router.replace("/dashboard/payment");
            }
        } else if (!loading && !user) {
             // If not logged in or failed to fetch user, redirect to login
             // However, middleware should catch this, but good to have as backup
             router.replace("/auth/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // If we are redirecting, we might still render for a split second before the router acts.
    // So we should return null or loader if the conditions aren't met.
    if (user?.kyc_status !== "approved" || user?.subscription_status !== "active") {
         return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-slate-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
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
    );
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <OwnerLayoutContent>{children}</OwnerLayoutContent>
        </AuthProvider>
    );
}
```