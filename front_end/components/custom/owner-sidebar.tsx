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
  Truck,
  ClipboardList,
  BarChart3,
  Receipt,
  Bell,
  Target,
} from "lucide-react";
import { InstallButton } from "@/components/pwa/InstallPWA";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  showBadge?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard/owner", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/dashboard/owner/analytics", label: "Analytics", icon: <BarChart3 /> },
  { href: "/dashboard/owner/goals", label: "Business Goals", icon: <Target /> },
  { href: "/dashboard/owner/notifications", label: "Notifications", icon: <Bell />, showBadge: true },
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
  { href: "/dashboard/owner/suppliers", label: "Suppliers", icon: <Truck /> },
  { href: "/dashboard/owner/order-status", label: "Order Status", icon: <ClipboardList /> },
  { href: "/dashboard/owner/expenses", label: "Expenses", icon: <Receipt /> },
  { href: "/dashboard/owner/settings", label: "Settings", icon: <Settings /> },
];

// { href: "/dashboard/owner/kyc", label: "KYC" },
// { href: "/dashboard/owner/payment", label: "Payment" },
// { href: "/dashboard/owner/pharmacies", label: "Pharmacies" },

export function OwnerSidebar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

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
                      <Link href={item.href} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </span>
                        {item.showBadge && unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PWA Install Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2">
              <InstallButton fullWidth className="w-full" />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
