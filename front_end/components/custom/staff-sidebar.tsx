"use client";

import { Home, ShoppingCart, Package, Receipt, User, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard/staff",
    icon: Home,
  },
  {
    title: "Point of Sale",
    url: "/dashboard/staff/pos",
    icon: ShoppingCart,
  },
  {
    title: "Sales History",
    url: "/dashboard/staff/sales",
    icon: Receipt,
  },
  {
    title: "Inventory",
    url: "/dashboard/staff/inventory",
    icon: Package,
  },
  {
    title: "Notifications",
    url: "/dashboard/staff/notifications",
    icon: Bell,
  },
];

export function StaffSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Staff Portal</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.title === "Notifications" && unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] h-4 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          <p>Branch: {user?.assigned_branch_name || "Main"}</p>
          <p>Status: Active</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}