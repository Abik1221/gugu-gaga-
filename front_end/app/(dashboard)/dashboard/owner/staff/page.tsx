"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { AuthAPI, StaffAPI } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type StaffMember = {
  id: number;
  email: string;
  phone?: string | null;
  role: string;
  is_active?: boolean;
  created_at?: string;
};

export default function StaffListPage() {
  const { show } = useToast();

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [search, setSearch] = useState(""
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [mutatingId, setMutatingId] = useState<number | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const loadStaff = useCallback(
    async (tid: string, options?: { silent?: boolean }) => {
      if (options?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const rows = await StaffAPI.list(tid);
        setStaff(Array.isArray(rows) ? rows : []);
      } catch (err: any) {
        const message = err?.message || "Unable to load staff";
        setError(message);
        show({ variant: "destructive", title: "Failed to load staff", description: message });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [show],
  );

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      setLoading(true);
      try {
        const me = await AuthAPI.me();
        if (!active) return;
        setProfile(me);
        const tid = me?.tenant_id || null;
        setTenantId(tid);
        if (tid) {
          await loadStaff(tid);
        } else {
          setError("No tenant attached to this account. Please contact support.");
        }
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Unable to load user profile");
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [loadStaff]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staff
      .filter((member) => {
        if (statusFilter === "active" && member.is_active === false) return false;
        if (statusFilter === "inactive" && member.is_active !== false) return false;
        if (!query) return true;
        return (
          member.email?.toLowerCase().includes(query) ||
          member.phone?.toLowerCase().includes(query) ||
          member.role?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => a.email.localeCompare(b.email));
  }, [staff, search, statusFilter]);

  const stats = useMemo(() => {
    const activeCount = staff.filter((m) => m.is_active !== false).length;
    const inactiveCount = staff.length - activeCount;
    return {
      total: staff.length,
      active: activeCount,
      inactive: inactiveCount,
    };
  }, [staff]);

  const handleToggleActive = async (member: StaffMember, nextActive: boolean) => {
    if (!tenantId) return;
    setMutatingId(member.id);
    try {
      await StaffAPI.update(tenantId, member.id, { is_active: nextActive });
      show({
        variant: "success",
        title: nextActive ? "Staff activated" : "Staff suspended",
        description: member.email,
      });
      await loadStaff(tenantId, { silent: true });
    } catch (err: any) {
      show({ variant: "destructive", title: "Update failed", description: err?.message || "Please try again." });
    } finally {
      setMutatingId(null);
    }
  };

  const handleRemove = async (member: StaffMember) => {
    if (!tenantId) return;
    const confirmed = window.confirm(`Remove ${member.email}? This cannot be undone.`);
    if (!confirmed) return;
    setMutatingId(member.id);
    try {
      await StaffAPI.remove(tenantId, member.id);
      show({ variant: "success", title: "Staff removed", description: member.email });
      await loadStaff(tenantId, { silent: true });
    } catch (err: any) {
      show({ variant: "destructive", title: "Removal failed", description: err?.message || "Please try again." });
    } finally {
      setMutatingId(null);
    }
  };

  const isBusy = loading && !refreshing;

  return (
    <div className="space-y-10 text-emerald-50">
      <header className="rounded-3xl border border-white/10 bg-white/10 px-6 py-6 shadow-[0_36px_140px_-70px_rgba(16,185,129,0.7)] backdrop-blur-xl lg:flex lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Team management</h1>
          <p className="text-sm text-emerald-100/75">
            Invite cashiers or managers, grant the right permissions, and keep your operations compliant at all times.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => tenantId && loadStaff(tenantId, { silent: true })}
            disabled={!tenantId || refreshing}
            className="rounded-full border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40 hover:bg-white/15 hover:text-white"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            size="sm"
            onClick={() => setInviteOpen(true)}
            disabled={!tenantId}
            className="rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_22px_60px_-30px_rgba(16,185,129,0.75)] transition hover:from-emerald-500/90 hover:to-sky-500/90"
          >
            Invite staff
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-white/15 bg-white/10 text-emerald-50 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.6)] backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
              Total team members
            </CardTitle>
            {isBusy ? <Skeleton className="h-7 w-12" /> : <div className="text-3xl font-semibold text-white">{stats.total}</div>}
          </CardHeader>
        </Card>
        <Card className="border border-white/15 bg-white/10 text-emerald-50 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.6)] backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
              Active
            </CardTitle>
            {isBusy ? <Skeleton className="h-7 w-12" /> : <div className="text-3xl font-semibold text-white">{stats.active}</div>}
          </CardHeader>
        </Card>
        <Card className="border border-amber-400/30 bg-amber-500/15 text-amber-50 shadow-[0_28px_110px_-60px_rgba(245,158,11,0.55)] backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
              Suspended
            </CardTitle>
            {isBusy ? <Skeleton className="h-7 w-10" /> : <div className="text-3xl font-semibold text-amber-100">{stats.inactive}</div>}
          </CardHeader>
        </Card>
      </section>

      <section>
        <Card className="border border-white/10 bg-white/10 text-emerald-50 shadow-[0_36px_140px_-70px_rgba(59,130,246,0.55)] backdrop-blur-xl">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-white">Directory</CardTitle>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/60">Search, filter, and manage access in seconds</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search email, phone, role"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-60 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-emerald-100/50 focus-visible:border-emerald-300 focus-visible:ring-emerald-300"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-100/80 shadow-[0_14px_45px_-30px_rgba(16,185,129,0.55)] transition focus:outline-none focus:ring focus:ring-emerald-300/40"
              >
                <option className="bg-slate-900 text-emerald-100" value="all">All statuses</option>
                <option className="bg-slate-900 text-emerald-100" value="active">Active only</option>
                <option className="bg-slate-900 text-emerald-100" value="inactive">Suspended only</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0">
            {isBusy ? (
              <Skeleton className="h-64 w-full" />
            ) : error ? (
              <div className="p-6 text-sm text-red-200">{error}</div>
            ) : filteredStaff.length === 0 ? (
              <div className="p-6 text-sm text-emerald-100/70">
                No staff match your filters. Invite a teammate to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-sm text-emerald-100/85">
                  <thead className="bg-white/5 text-emerald-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em]">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em]">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em]">Role</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em]">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-white/5">
                    {filteredStaff.map((member) => {
                      const active = member.is_active !== false;
                      return (
                        <tr key={member.id}>
                          <td className="px-3 py-3 font-semibold text-white">{member.email}</td>
                          <td className="px-3 py-3 text-emerald-100/70">{member.phone || "—"}</td>
                          <td className="px-3 py-3 text-emerald-100/70">{member.role}</td>
                          <td className="px-3 py-3">
                            <Badge
                              variant={active ? "default" : "secondary"}
                              className={active ? "border border-emerald-300/40 bg-emerald-500/15 text-emerald-100" : "border border-white/20 bg-white/10 text-emerald-100"}
                            >
                              {active ? "Active" : "Suspended"}
                            </Badge>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(member, !active)}
                                disabled={mutatingId === member.id}
                                className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300/40 hover:bg-white/20 hover:text-white"
                              >
                                {active ? "Suspend" : "Activate"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemove(member)}
                                disabled={mutatingId === member.id}
                                className="rounded-full border border-red-400/40 bg-red-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:bg-red-500/30"
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t border-white/10 bg-white/5 p-4 text-xs text-emerald-100/70 md:flex-row md:items-center md:justify-between">
            <div>Showing {filteredStaff.length} of {staff.length} team members</div>
            <div>Tenant: {profile?.tenant_id || "—"}</div>
          </CardFooter>
        </Card>
      </section>

      <InviteStaffSheet
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        tenantId={tenantId ?? undefined}
        onInvited={async () => tenantId && loadStaff(tenantId, { silent: true })}
      />
    </div>
  );
}

type InviteStaffSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId?: string;
  onInvited: () => void;
};

function InviteStaffSheet({ open, onOpenChange, tenantId, onInvited }: InviteStaffSheetProps) {
  const { show } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("cashier");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setRole("cashier");
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!tenantId) {
      show({ variant: "destructive", title: "No tenant context", description: "Reload and try again." });
      return;
    }
    if (!email || !password) {
      show({ variant: "destructive", title: "Missing fields", description: "Email and password are required." });
      return;
    }
    setSubmitting(true);
    try {
      await StaffAPI.createCashier(tenantId, {
        email,
        password,
        phone: phone || undefined,
        role,
      });
      show({ variant: "success", title: "Invitation sent", description: email });
      resetForm();
      onOpenChange(false);
      onInvited();
    } catch (err: any) {
      show({ variant: "destructive", title: "Failed to invite", description: err?.message || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <SheetContent
        side="right"
        className="max-w-md space-y-5 overflow-y-auto border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 p-6 text-emerald-50 backdrop-blur-2xl shadow-[0_36px_140px_-70px_rgba(16,185,129,0.6)]"
      >
        <SheetHeader className="space-y-2 text-left">
          <SheetTitle className="text-2xl font-semibold text-white">Invite staff member</SheetTitle>
          <SheetDescription className="text-sm text-emerald-100/70">
            Create credentials for a cashier or manager. They will update their profile on first login.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Tenant ID</label>
            <Input
              value={tenantId ?? ""}
              readOnly
              disabled
              className="rounded-2xl border border-white/10 bg-white/10 text-sm text-emerald-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="cashier@branch.com"
              className="rounded-2xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-emerald-100/50 focus-visible:border-emerald-300 focus-visible:ring-emerald-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Temporary password</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Min 6 characters with a capital letter"
              className="rounded-2xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-emerald-100/50 focus-visible:border-emerald-300 focus-visible:ring-emerald-300"
            />
            <p className="text-xs text-emerald-100/60">Share securely and remind them to reset on first sign-in.</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Phone (optional)</label>
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="e.g. +2519..."
              className="rounded-2xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-emerald-100/50 focus-visible:border-emerald-300 focus-visible:ring-emerald-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-emerald-100/80 shadow-[0_18px_55px_-35px_rgba(16,185,129,0.5)] focus:outline-none focus:ring focus:ring-emerald-300/40"
            >
              <option className="bg-slate-900 text-emerald-100" value="cashier">Cashier</option>
              <option className="bg-slate-900 text-emerald-100" value="manager">Manager</option>
            </select>
          </div>
          <SheetFooter className="gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="rounded-full border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40 hover:bg-white/15 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_22px_60px_-30px_rgba(16,185,129,0.75)] transition hover:from-emerald-500/90 hover:to-sky-500/90"
            >
              {submitting ? "Sending..." : "Send invite"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
