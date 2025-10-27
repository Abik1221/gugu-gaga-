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
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Team management</h1>
          <p className="text-sm text-gray-500">
            Invite new cashiers or managers, monitor access, and deactivate accounts in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => tenantId && loadStaff(tenantId, { silent: true })}
            disabled={!tenantId || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button size="sm" onClick={() => setInviteOpen(true)} disabled={!tenantId}>
            Invite staff
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-emerald-700/70">
              Total team members
            </CardTitle>
            {isBusy ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>}
          </CardHeader>
        </Card>
        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-emerald-700/70">
              Active
            </CardTitle>
            {isBusy ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-semibold text-gray-900">{stats.active}</div>}
          </CardHeader>
        </Card>
        <Card className="border border-amber-200 bg-amber-50/60 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-amber-700">
              Suspended
            </CardTitle>
            {isBusy ? <Skeleton className="h-7 w-10" /> : <div className="text-2xl font-semibold text-amber-800">{stats.inactive}</div>}
          </CardHeader>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Directory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search email, phone, role"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-60"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
              >
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="inactive">Suspended only</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isBusy ? (
              <Skeleton className="h-64 w-full" />
            ) : error ? (
              <div className="p-6 text-sm text-red-600">{error}</div>
            ) : filteredStaff.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                No staff match your filters. Invite a teammate to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Email</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Phone</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Role</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Status</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredStaff.map((member) => {
                      const active = member.is_active !== false;
                      return (
                        <tr key={member.id}>
                          <td className="px-3 py-2 text-gray-900">{member.email}</td>
                          <td className="px-3 py-2 text-gray-600">{member.phone || "—"}</td>
                          <td className="px-3 py-2 text-gray-600">{member.role}</td>
                          <td className="px-3 py-2">
                            <Badge variant={active ? "default" : "secondary"} className={active ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"}>
                              {active ? "Active" : "Suspended"}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(member, !active)}
                                disabled={mutatingId === member.id}
                              >
                                {active ? "Suspend" : "Activate"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemove(member)}
                                disabled={mutatingId === member.id}
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
          <CardFooter className="justify-between">
            <div className="text-xs text-gray-500">Showing {filteredStaff.length} of {staff.length} team members</div>
            <div className="text-xs text-gray-500">Tenant: {profile?.tenant_id || "—"}</div>
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
      <SheetContent side="right" className="max-w-md space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Invite staff member</SheetTitle>
          <SheetDescription>
            Create credentials for a cashier or manager. They will be prompted to update their profile on first login.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Tenant ID</label>
            <Input value={tenantId ?? ""} readOnly disabled />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Email</label>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Temporary password</label>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <p className="text-xs text-gray-500">Share this temporary password securely with the staff member.</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Phone (optional)</label>
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="e.g. +2519..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
            >
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <SheetFooter>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send invite"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
