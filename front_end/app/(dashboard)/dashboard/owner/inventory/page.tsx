"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  AuthAPI,
  InventoryAPI,
  type InventoryItem,
  MedicinesAPI,
  type MedicineListItem,
} from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";

const PAGE_SIZE = 20;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatCurrency(value?: number | null) {
  return currencyFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString();
}

type InventoryMeta = {
  page: number;
  total: number;
  pageSize: number;
};

export default function InventoryPage() {
  const { show } = useToast();

  const [me, setMe] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [meta, setMeta] = useState<InventoryMeta>({ page: 1, total: 0, pageSize: PAGE_SIZE });
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [expiringInDays, setExpiringInDays] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const profile = await AuthAPI.me();
        if (!active) return;
        setMe(profile);
        setTenantId(profile?.tenant_id || null);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Unable to load inventory");
      } finally {
        if (active) setInitializing(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const loadInventory = useCallback(
    async (tid: string) => {
      setFetching(true);
      setError(null);
      try {
        const response = await InventoryAPI.list(tid, {
          q: debouncedSearch || undefined,
          branch: branchFilter || undefined,
          lowStockOnly,
          expiringInDays,
          page,
          pageSize: PAGE_SIZE,
        });
        setItems(response.items);
        setMeta({ page: response.page, total: response.total, pageSize: response.page_size });
      } catch (err: any) {
        setItems([]);
        setMeta({ page: 1, total: 0, pageSize: PAGE_SIZE });
        setError(err?.message || "Failed to load inventory");
      } finally {
        setFetching(false);
      }
    },
    [debouncedSearch, branchFilter, lowStockOnly, expiringInDays, page],
  );

  useEffect(() => {
    if (!tenantId) return;
    loadInventory(tenantId);
  }, [tenantId, loadInventory]);

  const branchOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.branch) set.add(item.branch);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const stats = useMemo(() => {
    const now = new Date();
    const totalUnits = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const lowStockLots = items.filter(
      (item) => (item.quantity || 0) <= (item.reorder_level ?? 0),
    ).length;
    const expiringSoon = items.filter((item) => {
      if (!item.expiry_date) return false;
      const expiry = new Date(item.expiry_date);
      if (Number.isNaN(expiry.getTime())) return false;
      const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 30;
    }).length;

    return {
      totalLots: meta.total,
      totalUnits,
      lowStockLots,
      expiringSoon,
    };
  }, [items, meta.total]);

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

  const refreshInventory = useCallback(
    (options?: { resetPage?: boolean }) => {
      if (!tenantId) return;
      if (options?.resetPage && page !== 1) {
        setPage(1);
        return;
      }
      loadInventory(tenantId);
    },
    [tenantId, page, loadInventory],
  );

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setBranchFilter("");
    setLowStockOnly(false);
    setExpiringInDays(undefined);
    if (page !== 1) {
      setPage(1);
    } else if (tenantId) {
      loadInventory(tenantId);
    }
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const isEmpty = !fetching && items.length === 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory workspace</h1>
          <p className="text-sm text-gray-500">
            Track medicine lots, adjust reorder levels, and record new stock arrivals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshInventory()}
            disabled={fetching || !tenantId}
          >
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} disabled={!tenantId}>
            Add stock
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-emerald-700/70">
              Lots on file
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-xl font-semibold text-gray-900">
                {numberFormatter.format(stats.totalLots)}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-emerald-700/70">
              Total units on hand
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-xl font-semibold text-gray-900">
                {numberFormatter.format(stats.totalUnits)}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card className="border border-amber-200 bg-amber-50/60 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-amber-700">
              Low stock lots
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-14" />
            ) : (
              <div className="text-xl font-semibold text-amber-800">
                {numberFormatter.format(stats.lowStockLots)}
              </div>
            )}
          </CardHeader>
        </Card>
        <Card className="border border-sky-200 bg-sky-50/60 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xs uppercase tracking-wide text-sky-700">
              Expiring in 30 days
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-14" />
            ) : (
              <div className="text-xl font-semibold text-sky-800">
                {numberFormatter.format(stats.expiringSoon)}
              </div>
            )}
          </CardHeader>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-gray-600">Search medicine</label>
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  if (page !== 1) setPage(1);
                }}
                placeholder="Name, SKU..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Branch</label>
              <select
                value={branchFilter}
                onChange={(event) => {
                  setBranchFilter(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
              >
                <option value="">All branches</option>
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Expiry window</label>
              <select
                value={expiringInDays ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setExpiringInDays(value ? Number(value) : undefined);
                  setPage(1);
                }}
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
              >
                <option value="">Any time</option>
                <option value="7">Expiring in 7 days</option>
                <option value="30">Expiring in 30 days</option>
                <option value="90">Expiring in 90 days</option>
              </select>
            </div>
            <div className="space-y-3 md:col-span-1">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                  checked={lowStockOnly}
                  onChange={() => {
                    setLowStockOnly((prev) => !prev);
                    setPage(1);
                  }}
                />
                Show low stock only
              </label>
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                Reset filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <CardTitle>Inventory lots</CardTitle>
            <div className="text-xs text-gray-500">
              Page {meta.page} of {totalPages}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Medicine</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Branch</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Quantity</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Reorder level</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Expiry</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Sell price</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.map((item) => {
                    const lowStock = (item.quantity || 0) <= (item.reorder_level ?? 0);
                    const packsDisplay = item.pack_size
                      ? `${Math.floor((item.quantity || 0) / item.pack_size)} packs`
                      : "—";
                    const singlesDisplay = item.pack_size
                      ? `${(item.quantity || 0) % item.pack_size} singles`
                      : `${item.quantity || 0} units`;
                    return (
                      <tr key={item.id} className={lowStock ? "bg-red-50/60" : undefined}>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">{item.medicine_name}</div>
                          <div className="text-xs text-gray-500">
                            SKU: {item.sku || "—"} · Lot: {item.lot_number || "—"}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-700">{item.branch || "—"}</td>
                        <td className="px-3 py-2 text-gray-700">
                          <div className="font-medium text-gray-900">{numberFormatter.format(item.quantity || 0)} units</div>
                          <div className="text-xs text-gray-500">{packsDisplay}, {singlesDisplay}</div>
                        </td>
                        <td className="px-3 py-2 text-gray-700">{numberFormatter.format(item.reorder_level || 0)}</td>
                        <td className="px-3 py-2 text-gray-700">{formatDate(item.expiry_date)}</td>
                        <td className="px-3 py-2 text-gray-700">{item.sell_price != null ? formatCurrency(item.sell_price) : "—"}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingItem(item)}
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td className="px-3 py-12 text-center text-sm text-gray-500" colSpan={7}>
                        {fetching ? "Loading inventory..." : "No inventory lots match your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {fetching && items.length > 0 && <Skeleton className="h-10 w-full" />}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
              <div>
                Showing {(meta.page - 1) * meta.pageSize + 1} -
                {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} lots
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <AddStockSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        tenantId={tenantId ?? undefined}
        onCreated={() => refreshInventory({ resetPage: true })}
      />

      <EditLotSheet
        item={editingItem}
        tenantId={tenantId ?? undefined}
        onClose={() => setEditingItem(null)}
        onUpdated={() => refreshInventory()}
        onDeleted={() => refreshInventory({ resetPage: true })}
      />
    </div>
  );
}

type AddStockSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId?: string;
  onCreated: () => void;
};

function AddStockSheet({ open, onOpenChange, tenantId, onCreated }: AddStockSheetProps) {
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState<MedicineListItem[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);

  const [medicineId, setMedicineId] = useState(""
  );
  const [branch, setBranch] = useState("");
  const [packSize, setPackSize] = useState("1");
  const [packsCount, setPacksCount] = useState("0");
  const [singlesCount, setSinglesCount] = useState("0");
  const [expiryDate, setExpiryDate] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [reorderLevel, setReorderLevel] = useState("0");

  useEffect(() => {
    if (!open || !tenantId) return;
    setMedicinesLoading(true);
    MedicinesAPI.list(tenantId, { pageSize: 200 })
      .then((response) => {
        setMedicineOptions(response.items);
      })
      .catch((err: any) => {
        show({
          variant: "destructive",
          title: "Unable to load medicines",
          description: err?.message || "Please try again shortly.",
        });
      })
      .finally(() => setMedicinesLoading(false));
  }, [open, tenantId, show]);

  const resetForm = () => {
    setMedicineId("");
    setBranch("");
    setPackSize("1");
    setPacksCount("0");
    setSinglesCount("0");
    setExpiryDate("");
    setLotNumber("");
    setPurchasePrice("");
    setSellPrice("");
    setReorderLevel("0");
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!tenantId) return;
    const parsedMedicineId = Number(medicineId);
    if (!parsedMedicineId) {
      show({ variant: "destructive", title: "Select a medicine", description: "Choose a medicine to add stock for." });
      return;
    }
    const parsedPackSize = Math.max(1, Number(packSize) || 1);
    const parsedPacks = Math.max(0, Number(packsCount) || 0);
    const parsedSingles = Math.max(0, Number(singlesCount) || 0);
    if (parsedPacks === 0 && parsedSingles === 0) {
      show({ variant: "destructive", title: "Quantity required", description: "Enter packs or single units to record." });
      return;
    }

    setLoading(true);
    try {
      await InventoryAPI.create(tenantId, {
        medicine_id: parsedMedicineId,
        branch: branch || undefined,
        pack_size: parsedPackSize,
        packs_count: parsedPacks,
        singles_count: parsedSingles,
        expiry_date: expiryDate || undefined,
        lot_number: lotNumber || undefined,
        purchase_price: purchasePrice ? Number(purchasePrice) : undefined,
        sell_price: sellPrice ? Number(sellPrice) : undefined,
        reorder_level: reorderLevel ? Number(reorderLevel) : undefined,
      });
      show({ variant: "success", title: "Stock added", description: "The lot has been recorded successfully." });
      resetForm();
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Unable to add stock",
        description: err?.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetForm();
        }
        onOpenChange(next);
      }}
    >
      <SheetContent side="right" className="max-w-lg space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add stock lot</SheetTitle>
          <SheetDescription>Capture incoming inventory so the owner dashboard stays accurate.</SheetDescription>
        </SheetHeader>
        {!tenantId ? (
          <div className="p-4 text-sm text-gray-500">No tenant context available.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Medicine</label>
              <select
                value={medicineId}
                onChange={(event) => setMedicineId(event.target.value)}
                required
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
              >
                <option value="">Select medicine</option>
                {medicineOptions.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name} {medicine.sku ? `(${medicine.sku})` : ""}
                  </option>
                ))}
              </select>
              {medicinesLoading && <Skeleton className="h-6 w-full" />}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Branch</label>
                <Input
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  placeholder="e.g. Central"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Pack size (units)</label>
                <Input
                  type="number"
                  min={1}
                  value={packSize}
                  onChange={(event) => setPackSize(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Packs</label>
                <Input
                  type="number"
                  min={0}
                  value={packsCount}
                  onChange={(event) => setPacksCount(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Singles</label>
                <Input
                  type="number"
                  min={0}
                  value={singlesCount}
                  onChange={(event) => setSinglesCount(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Expiry date</label>
                <Input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Lot number</label>
                <Input value={lotNumber} onChange={(event) => setLotNumber(event.target.value)} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Purchase price</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={purchasePrice}
                  onChange={(event) => setPurchasePrice(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Sell price</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={sellPrice}
                  onChange={(event) => setSellPrice(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Reorder level</label>
              <Input
                type="number"
                min={0}
                value={reorderLevel}
                onChange={(event) => setReorderLevel(event.target.value)}
              />
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Add stock"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

type EditLotSheetProps = {
  item: InventoryItem | null;
  tenantId?: string;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
};

function EditLotSheet({ item, tenantId, onClose, onUpdated, onDeleted }: EditLotSheetProps) {
  const { show } = useToast();
  const open = !!item;

  const [quantity, setQuantity] = useState(""
  );
  const [reorderLevel, setReorderLevel] = useState(""
  );
  const [expiryDate, setExpiryDate] = useState(""
  );
  const [sellPrice, setSellPrice] = useState(""
  );
  const [lotNumber, setLotNumber] = useState(""
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!item) {
      setQuantity("");
      setReorderLevel("");
      setExpiryDate("");
      setSellPrice("");
      setLotNumber("");
      return;
    }
    setQuantity(String(item.quantity ?? ""));
    setReorderLevel(String(item.reorder_level ?? ""));
    setExpiryDate(item.expiry_date || "");
    setSellPrice(item.sell_price != null ? String(item.sell_price) : "");
    setLotNumber(item.lot_number || "");
  }, [item]);

  const handleUpdate: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!item || !tenantId) return;

    const payload: {
      quantity?: number;
      reorder_level?: number;
      expiry_date?: string | null;
      sell_price?: number | null;
      lot_number?: string | null;
    } = {};

    if (quantity.trim() !== "") {
      const parsed = Number(quantity);
      if (Number.isNaN(parsed) || parsed < 0) {
        show({ variant: "destructive", title: "Invalid quantity", description: "Quantity must be a non-negative number." });
        return;
      }
      payload.quantity = parsed;
    }
    if (reorderLevel.trim() !== "") {
      const parsed = Number(reorderLevel);
      if (Number.isNaN(parsed) || parsed < 0) {
        show({ variant: "destructive", title: "Invalid reorder level", description: "Reorder level must be zero or higher." });
        return;
      }
      payload.reorder_level = parsed;
    }
    if (expiryDate) {
      payload.expiry_date = expiryDate;
    } else {
      payload.expiry_date = null;
    }
    if (sellPrice.trim() !== "") {
      const parsed = Number(sellPrice);
      if (Number.isNaN(parsed) || parsed < 0) {
        show({ variant: "destructive", title: "Invalid sell price", description: "Sell price must be a positive number." });
        return;
      }
      payload.sell_price = parsed;
    }
    if (lotNumber.trim() !== "") {
      payload.lot_number = lotNumber;
    } else {
      payload.lot_number = null;
    }

    setSaving(true);
    try {
      await InventoryAPI.update(tenantId, item.id, payload);
      show({ variant: "success", title: "Lot updated", description: "Inventory counts refreshed." });
      onUpdated();
      onClose();
    } catch (err: any) {
      show({ variant: "destructive", title: "Update failed", description: err?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !tenantId) return;
    const confirmed = window.confirm(
      "Deleting this lot removes it from inventory history. Continue?",
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await InventoryAPI.remove(tenantId, item.id);
      show({ variant: "success", title: "Lot deleted", description: "Inventory lot removed." });
      onDeleted();
      onClose();
    } catch (err: any) {
      show({ variant: "destructive", title: "Delete failed", description: err?.message || "Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent side="right" className="max-w-lg space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit inventory lot</SheetTitle>
          <SheetDescription>
            Update lot details or adjust counts. All changes are audit logged for owner visibility.
          </SheetDescription>
        </SheetHeader>
        {!item ? (
          <div className="p-4 text-sm text-gray-500">Select a lot to edit.</div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
              <div className="font-medium text-gray-800">{item.medicine_name}</div>
              <div>Branch: {item.branch || "—"}</div>
              <div>Lot: {item.lot_number || "—"}</div>
              <div>Pack size: {item.pack_size || "—"}</div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Quantity (units)</label>
              <Input value={quantity} onChange={(event) => setQuantity(event.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Reorder level</label>
              <Input value={reorderLevel} onChange={(event) => setReorderLevel(event.target.value)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Expiry date</label>
                <Input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Sell price</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={sellPrice}
                  onChange={(event) => setSellPrice(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Lot number</label>
              <Input value={lotNumber} onChange={(event) => setLotNumber(event.target.value)} />
            </div>

            <SheetFooter>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex flex-1 justify-end gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
