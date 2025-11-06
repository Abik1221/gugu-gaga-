"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, LogOut, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  navItems: NavItem[]
  user?: {
    username?: string | null
    email?: string | null
  }
  primaryRole?: string
  onLogout: () => void
  isAdmin?: boolean
  isAffiliate?: boolean
}

export function SidebarNav({
  className,
  navItems,
  user,
  primaryRole,
  onLogout,
  isAdmin = false,
  isAffiliate = false,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <Sidebar className="w-[280px] border-r border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-0" {...props}>
      <SidebarHeader className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100/90">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
            <Activity className="h-5 w-5" />
          </span>
          <span>{isAffiliate ? "Affiliate Portal" : isAdmin ? "Admin Console" : "Zemen Dashboard"}</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-0 text-xs font-medium text-emerald-100/70">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2 space-y-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              {user ? (
                <>
                  <p className="text-sm font-semibold text-white">{user.username}</p>
                  <p className="truncate text-xs text-emerald-100/70">{user.email}</p>
                  {primaryRole && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                      {primaryRole}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-xs text-emerald-100/60">Not authenticated</p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-0 text-xs font-medium text-emerald-100/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-emerald-100 transition hover:border-emerald-200/40 hover:bg-white/10"
                    >
                      <Link href={item.href}>
                        <span className="flex items-center justify-between gap-2">
                          {item.label}
                          <span className="text-xs uppercase tracking-[0.3em] text-emerald-200/70 transition group-hover:translate-x-1">
                            •
                          </span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-6">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-emerald-100/70">
          <p className="font-semibold text-emerald-100">Need help?</p>
          <p className="mt-1">Explore the resource center or contact support if something feels off.</p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200 hover:text-emerald-100"
          >
            <Settings2 className="h-4 w-4" /> Support
          </Link>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full rounded-2xl border-red-400/30 bg-red-500/15 text-sm font-semibold text-red-100 shadow-[0_12px_40px_-25px_rgba(248,113,113,0.6)] transition hover:bg-red-500/25 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
