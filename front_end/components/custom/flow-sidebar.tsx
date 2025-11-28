"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Home } from "lucide-react";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import logoImage from "@/public/mesoblogo.jpeg";
import { signOut } from "@/utils/api";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/language-context";

interface FlowSidebarProps {
    showBackButton?: boolean;
}

/**
 * Shared sidebar component for KYC/Payment/Onboarding flow pages.
 * Provides consistent branding and navigation with minimal options.
 */
export function FlowSidebar({ showBackButton = true }: FlowSidebarProps) {
    const router = useRouter();
    const { t } = useLanguage();

    const handleBackToHome = () => {
        // Set a temporary cookie to allow homepage access for logged-in users
        // This cookie expires in 10 seconds and allows bypassing the auto-redirect
        document.cookie = "allow_homepage=true; path=/; max-age=10; SameSite=Lax";
        router.push("/");
    };

    return (
        <Sidebar className="!bg-white border-r border-gray-200">
            <SidebarHeader className="p-6 border-b border-gray-200">
                <div className="flex justify-center">
                    <Image
                        height={80}
                        width={80}
                        src={logoImage}
                        alt="Mesob Logo"
                        className="rounded-lg shadow-sm"
                    />
                </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem className="mb-2">
                        <div className="w-full flex justify-start px-2">
                            <LanguageSelector variant="ghost" fullWidth={true} className="justify-start px-2" showLabel={true} />
                        </div>
                    </SidebarMenuItem>
                    {showBackButton && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleBackToHome}
                                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer font-medium"
                            >
                                <Home className="h-4 w-4 text-gray-700" />
                                <span className="text-gray-700">{t.nav.home}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={signOut}
                            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer font-medium"
                        >
                            <LogOut className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-600">{t.nav.signOut}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
