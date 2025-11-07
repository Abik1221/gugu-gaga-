"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  Package,
  Plug,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navItems = [
  { href: "/dashboard/owner", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/dashboard/owner/agent", label: "Agent", icon: <Users /> },
  { href: "/dashboard/owner/branches", label: "Branches", icon: <Building2 /> },
  { href: "/dashboard/owner/chat", label: "Chat", icon: <MessageSquare /> },
  {
    href: "/dashboard/owner/integrations",
    label: "Integrations",
    icon: <Plug />,
  },
  { href: "/dashboard/owner/staff", label: "Staff", icon: <UserCog /> },
  { href: "/dashboard/owner/inventory", label: "Inventory", icon: <Package /> },
  { href: "/dashboard/owner/settings", label: "Settings", icon: <Settings /> },
];

// { href: "/dashboard/owner/kyc", label: "KYC" },
// { href: "/dashboard/owner/payment", label: "Payment" },
// { href: "/dashboard/owner/pharmacies", label: "Pharmacies" },

export function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>Mesob AI</SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (pathname?.startsWith(`${item.href}/`) &&
                    item.href !== "/dashboard/owner");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        {item.icon}
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
