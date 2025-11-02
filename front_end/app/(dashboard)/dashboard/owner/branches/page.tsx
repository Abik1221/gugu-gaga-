"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { AuthAPI, BranchAPI, PharmaciesAPI } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { PharmaciesListResponse } from "@/utils/api";

type BranchRecord = {
  id: number;
  pharmacy_id: number;
  tenant_id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
};

type PharmacySummary = PharmaciesListResponse["items"][number];

export default function BranchManagementPage() {
  const { show } = useToast();

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesRefreshing, setBranchesRefreshing] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  const [pharmacies, setPharmacies] = useState<PharmacySummary[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(true);
  const [pharmacyError, setPharmacyError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [trialLimitMessage, setTrialLimitMessage] = useState<string | null>(null);

  const filteredBranches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((branch) => {
      return (
        branch.name.toLowerCase().includes(query) ||
        (branch.address ?? "").toLowerCase().includes(query) ||
        (branch.phone ?? "").toLowerCase().includes(query)
      );
    });
  }, [branches, search]);

  const primaryPharmacy = useMemo(() => pharmacies[0] || null, [pharmacies]);

  const loadBranches = useCallback(
    async (tid: string, opts?: { silent?: boolean }) => {
      if (opts?.silent) {
        setBranchesRefreshing(true);
      } else {
        setBranchesLoading(true);
      }
      setBranchesError(null);
      try {
        const list = await BranchAPI.list(tid, { page_size: 200 });
        setBranches(list?.items ?? []);
      } catch (error: any) {
        const message = error?.message || "Unable to load branches";
        setBranchesError(message);
        show({
          variant: "destructive",
          title: "Failed to load branches",
          description: message,
        });
      } finally {
        setBranchesLoading(false);
        setBranchesRefreshing(false);
      }
    },
    [show]
  );

  const loadPharmacies = useCallback(async (tid: string) => {
    setPharmacyLoading(true);
    setPharmacyError(null);
    try {
      const response = await PharmaciesAPI.list(tid, { page_size: 20 });
      setPharmacies(response?.items ?? []);
    } catch (error: any) {
      const message = error?.message || "Unable to load pharmacies";
      setPharmacyError(message);
      show({ variant: "destructive", title: "Unable to load pharmacies", description: message });
    } finally {
      setPharmacyLoading(false);
    }
  }, [show]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const profile = await AuthAPI.me();
        if (cancelled) return;
        const tid = profile?.tenant_id ?? null;
        setTenantId(tid);
        if (tid) {
          await Promise.all([loadBranches(tid), loadPharmacies(tid)]);
        }
      } catch (error: any) {
        if (cancelled) return;
        show({
          variant: "destructive",
          title: "Unable to load owner profile",
          description: error?.message || "Please sign in again.",
        });
      } finally {
        if (!cancelled) setProfileLoaded(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadBranches, loadPharmacies, show]);

  const handleDelete = async (branch: BranchRecord) => {
    if (!tenantId) return;
    const confirmed = window.confirm(
      `Remove branch "${branch.name}"? Associated sales will remain attributed to this branch.`
    );
    if (!confirmed) return;
    setMutatingId(branch.id);
    try {
      await BranchAPI.remove(tenantId, branch.id);
      show({
        variant: "success",
        title: "Branch removed",
        description: branch.name,
      });
      await loadBranches(tenantId, { silent: true });
    } catch (error: any) {
      show({
        variant: "destructive",
        title: "Failed to remove branch",
        description: error?.message || "Please try again.",
      });
    } finally {
      setMutatingId(null);
    }
  };

  const stats = useMemo(
    () => ({
      total: branches.length,
      withPhone: branches.filter((b) => (b.phone ?? "").trim().length > 0).length,
    }),
    [branches]
  );

  const isBusy = branchesLoading && !branchesRefreshing;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_32px_120px_-60px_rgba(16,185,129,0.7)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Branch management</h1>
          <p className="text-sm text-emerald-100/80">
            Organise your locations, keep contact information up to date, and control where sales are attributed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => tenantId && loadBranches(tenantId, { silent: true })}
            disabled={!tenantId || branchesRefreshing}
          >
            {branchesRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            disabled={!tenantId || pharmacyLoading}
          >
            New branch
          </Button>
        </div>
      </header>

      {trialLimitMessage && (
        <div className="rounded-3xl border border-amber-300/40 bg-amber-500/15 p-4 text-sm text-amber-100">
          <div className="font-semibold uppercase tracking-[0.25em] text-amber-200">Free trial notice</div>
          <p className="mt-2 text-amber-50/90">{trialLimitMessage}</p>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-white/10 bg-white/10 text-emerald-50 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.6)] backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
              Total branches
            </CardTitle>
            {isBusy ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-semibold text-white">{stats.total}</div>
            )}
          </CardHeader>
        </Card>
        <Card className="border border-white/10 bg-white/10 text-emerald-50 shadow-[0_28px_110px_-60px_rgba(16,185,129,0.6)] backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
              Contact-ready
            </CardTitle>
            {isBusy ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-semibold text-white">{stats.withPhone}</div>
            )}
          </CardHeader>
          <CardFooter className="pt-0 text-xs text-emerald-100/70">
            Branches with a phone number recorded
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card className="border border-white/10 bg-white/10 text-emerald-50 shadow-[0_32px_120px_-60px_rgba(59,130,246,0.55)] backdrop-blur-xl">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-white">Branch directory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search branch name, address, phone"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-64 rounded-full border border-white/20 bg-white/10 text-sm text-white placeholder:text-emerald-100/60"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isBusy ? (
              <Skeleton className="h-64 w-full" />
            ) : branchesError ? (
              <div className="p-6 text-sm text-red-200">{branchesError}</div>
            ) : filteredBranches.length === 0 ? (
              <div className="space-y-2 p-6 text-sm text-emerald-100/75">
                <p>No branches yet. Create a branch to start allocating sales across locations.</p>
                {pharmacies.length === 0 && !pharmacyLoading && (
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-500/15 p-3 text-xs text-amber-100">
                    We couldn't find a primary location record for this tenant. Please complete your business profile (Settings → Locations) before adding branches.
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-sm text-emerald-100/80">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Address</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Primary location</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-white/5 text-emerald-50">
                    {filteredBranches.map((branch) => {
                      const pharmacy = pharmacies.find((p) => p.id === branch.pharmacy_id);
                      return (
                        <tr key={branch.id}>
                          <td className="px-3 py-2 font-semibold text-white">{branch.name}</td>
                          <td className="px-3 py-2 text-emerald-100/70">{branch.address || "—"}</td>
                          <td className="px-3 py-2 text-emerald-100/70">{branch.phone || "—"}</td>
                          <td className="px-3 py-2 text-emerald-100/80">
                            <Badge variant="outline" className="border-emerald-300/40 bg-emerald-500/10 text-emerald-100">
                              {pharmacy?.name ?? `#${branch.pharmacy_id}`}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(branch)}
                                disabled={mutatingId === branch.id}
                              >
                                Delete
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
          <CardFooter className="justify-between text-xs text-gray-500">
            <div>Showing {filteredBranches.length} of {branches.length} branches</div>
            <div>Tenant: {tenantId ?? "—"}</div>
          </CardFooter>
        </Card>
      </section>

      <CreateBranchSheet
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) setCreateOpen(false);
          else setCreateOpen(true);
        }}
        tenantId={tenantId ?? undefined}
        pharmacies={pharmacies}
        loadingPharmacies={pharmacyLoading}
        disabled={!tenantId || pharmacyLoading || pharmacies.length === 0}
        onCreated={async () => tenantId && loadBranches(tenantId, { silent: true })}
        trialLimitMessage={trialLimitMessage}
        onTrialLimit={(message) => setTrialLimitMessage(message)}
        onTrialCleared={() => setTrialLimitMessage(null)}
      />
    </div>
  );
}

type CreateBranchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId?: string;
  pharmacies: PharmacySummary[];
  loadingPharmacies: boolean;
  disabled?: boolean;
  onCreated: () => void;
  trialLimitMessage?: string | null;
  onTrialLimit?: (message: string) => void;
  onTrialCleared?: () => void;
};

function CreateBranchSheet({
  open,
  onOpenChange,
  tenantId,
  pharmacies,
  loadingPharmacies,
  disabled,
  onCreated,
  trialLimitMessage,
  onTrialLimit,
  onTrialCleared,
}: CreateBranchSheetProps) {
  const { show } = useToast();

  const [pharmacyId, setPharmacyId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (loadingPharmacies) return;
    if (pharmacies.length === 0) {
      setPharmacyId(null);
    } else {
      setPharmacyId((prev) => prev ?? pharmacies[0]?.id ?? null);
    }
  }, [open, pharmacies, loadingPharmacies]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setPhone("");
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!tenantId) {
      show({ variant: "destructive", title: "No tenant context", description: "Reload and try again." });
      return;
    }
    if (!pharmacyId) {
      show({ variant: "destructive", title: "Select a pharmacy", description: "A primary pharmacy record is required." });
      return;
    }
    if (!name.trim()) {
      show({ variant: "destructive", title: "Branch name required", description: "Please provide a branch name." });
      return;
    }

    setSubmitting(true);
    try {
      await BranchAPI.create(tenantId, {
        pharmacy_id: pharmacyId,
        name: name.trim(),
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      show({ variant: "success", title: "Branch created", description: name.trim() });
      resetForm();
      onOpenChange(false);
      onCreated();
      onTrialCleared?.();
    } catch (error: any) {
      const rawMessage: string = error?.message || "";
      const isTrialLimit = /free trial plan supports only one location/i.test(rawMessage);
      if (isTrialLimit) {
        const friendly = "Free trial plan supports only one location. Upgrade to add additional branches.";
        onTrialLimit?.(friendly);
        show({ variant: "warning", title: "Upgrade required", description: friendly });
      } else {
        show({ variant: "destructive", title: "Failed to create branch", description: rawMessage || "Please try again." });
      }
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
          <SheetTitle>Create branch</SheetTitle>
          <SheetDescription>
            Add a new location. Branch names appear in POS sales reports and analytics.
          </SheetDescription>
        </SheetHeader>
        {trialLimitMessage && (
          <div className="rounded-2xl border border-amber-300/40 bg-amber-500/10 p-3 text-xs text-amber-100">
            {trialLimitMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Primary location</label>
            <select
              value={pharmacyId ?? ""}
              onChange={(event) => setPharmacyId(Number(event.target.value) || null)}
              disabled={loadingPharmacies || pharmacies.length === 0 || Boolean(trialLimitMessage)}
              className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
            >
              {pharmacies.length === 0 ? (
                <option value="">No locations found</option>
              ) : (
                pharmacies.map((pharmacy) => (
                  <option key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Branch name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} required placeholder="e.g. Bole Branch" disabled={Boolean(trialLimitMessage)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Address (optional)</label>
            <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, city" disabled={Boolean(trialLimitMessage)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Phone (optional)</label>
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="e.g. +251-911-000000" disabled={Boolean(trialLimitMessage)} />
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
              <Button type="submit" disabled={submitting || disabled || Boolean(trialLimitMessage)}>
                {submitting ? "Creating..." : "Create branch"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
