"use client";

import {
  Package,
  Home,
  ShoppingCart,
  Settings,
  FileText,
  MessageSquare,
  DollarSign,
  BarChart3,
} from "lucide-react";
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
import { InstallButton } from "@/components/pwa/InstallPWA";

const menuItems = [
  { title: "Dashboard", url: "/dashboard/supplier", icon: Home },
  { title: "Analytics", url: "/dashboard/supplier/analytics", icon: BarChart3 },
  { title: "Products", url: "/dashboard/supplier/products", icon: Package },
  { title: "Orders", url: "/dashboard/supplier/orders", icon: ShoppingCart },
  // { title: "KYC", url: "/dashboard/supplier/kyc", icon: FileText },
  // { title: "Payment", url: "/dashboard/supplier/payment", icon: DollarSign },
  {
    title: "AI Assistant",
    url: "/dashboard/supplier/chat",
    icon: MessageSquare,
  },
  { title: "Settings", url: "/dashboard/supplier/settings", icon: Settings },
];

export function SupplierSidebar({ user }: { user: any }) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">Mesob</h2>
            <p className="text-xs text-gray-500">Supplier Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(0, 4).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(4).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 space-y-3">
        {/* PWA Install Button */}
        <InstallButton fullWidth className="w-full" />

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
