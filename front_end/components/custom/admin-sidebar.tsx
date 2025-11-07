import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Building2,
  FileSearch,
  Handshake,
  LayoutDashboard,
  Users,
  Wallet,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: <LayoutDashboard />,
  },
  {
    label: "Affiliates",
    href: "/dashboard/admin/affiliates",
    icon: <Handshake />, // represents partnerships or affiliates
  },
  {
    label: "Audit",
    href: "/dashboard/admin/audit",
    icon: <FileSearch />, // for reviewing or analyzing data
  },
  {
    label: "Payouts",
    href: "/dashboard/admin/payouts",
    icon: <Wallet />, // for payments or finance
  },
  {
    label: "Pharmacies",
    href: "/dashboard/admin/pharmacies",
    icon: <Building2 />, // represents a business/place
  },
  {
    label: "Segments",
    href: "/dashboard/admin/segments",
    icon: <Boxes />, // for grouping, categorization, or segments
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: <Users />, // user management
  },
];
export function AdminSideBar() {
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
                    item.href !== "/dashboard/admin");
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
