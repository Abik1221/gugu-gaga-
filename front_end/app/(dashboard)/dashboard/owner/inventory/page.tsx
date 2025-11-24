"use client";

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  AuthAPI,
  InventoryAPI,
  type InventoryItem,
} from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle, Clock, DollarSign } from "lucide-react";

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handle = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
      return () => window.clearTimeout(handle);
    }
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

    // Calculate total value if possible (using purchase price if available, else sell price)
    // Note: purchase_price is not in InventoryItem type in api.ts but might be in backend response
    // We will use sell_price for estimated retail value
    const totalValue = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.sell_price || 0)), 0);

    return {
      totalLots: meta.total,
      totalUnits,
      lowStockLots,
      expiringSoon,
      totalValue
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

  // Helper to render packaging info
  const renderPackagingInfo = (item: InventoryItem) => {
    if (item.unit_type === 'packet' && item.packaging_data?.levels) {
      const levels = item.packaging_data.levels;
      // e.g. "Box (10 Strip) -> Strip (10 Tablet)"
      // Or just show the top level quantity and breakdown
      // Let's show: "5 Box" (Total: 500 Tablet)
      const topLevel = levels[0];
      const baseLevel = levels[levels.length - 1];

      // Calculate top level quantity
      // Total units = item.quantity
      // Top level qty = item.quantity / (product of all contains)
      // Actually, let's just show the total units and the hierarchy hint
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{numberFormatter.format(item.quantity)} {baseLevel.name}s</span>
          <span className="text-xs text-gray-500">
            Structure: {levels.map((l: any) => l.name).join(" > ")}
          </span>
        </div>
      );
    }

    // Fallback for old items or single items
    const packsDisplay = item.pack_size > 1
      ? `${Math.floor((item.quantity || 0) / item.pack_size)} packs`
      : null;
    const singlesDisplay = item.pack_size > 1
      ? `${(item.quantity || 0) % item.pack_size} singles`
      : `${item.quantity || 0} units`;

    return (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{numberFormatter.format(item.quantity)} units</span>
        {packsDisplay && <span className="text-xs text-gray-500">{packsDisplay}, {singlesDisplay}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Overview</h1>
          <p className="text-sm text-gray-500">
            View your pharmacy's stock levels, value, and status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshInventory()}
            disabled={fetching || !tenantId}
          >
            Refresh Data
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
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-emerald-700/70 flex items-center gap-2">
              <Package className="h-4 w-4" /> Total Items
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">
                {numberFormatter.format(stats.totalLots)}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Distinct products/lots</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-blue-700/70 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Est. Retail Value
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Based on sell price</p>
          </CardContent>
        </Card>

        <Card className="border border-amber-200 bg-amber-50/30 shadow-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-amber-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Low Stock
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-14" />
            ) : (
              <div className="text-2xl font-bold text-amber-800">
                {numberFormatter.format(stats.lowStockLots)}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600/80">Items below reorder level</p>
          </CardContent>
        </Card>

        <Card className="border border-rose-200 bg-rose-50/30 shadow-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xs uppercase tracking-wide text-rose-700 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Expiring Soon
            </CardTitle>
            {initializing ? (
              <Skeleton className="h-7 w-14" />
            ) : (
              <div className="text-2xl font-bold text-rose-800">
                {numberFormatter.format(stats.expiringSoon)}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-rose-600/80">Within next 30 days</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Filter Inventory</CardTitle>
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
                placeholder="Name, SKU, Lot..."
                className="bg-white"
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
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any time</option>
                <option value="7">Expiring in 7 days</option>
                <option value="30">Expiring in 30 days</option>
                <option value="90">Expiring in 90 days</option>
              </select>
            </div>
            <div className="space-y-3 md:col-span-1 flex flex-col justify-end">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
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
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="w-full justify-start px-0 text-blue-600 hover:text-blue-800 hover:bg-transparent">
                Reset all filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="overflow-hidden border-t-4 border-t-blue-600">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between bg-gray-50/50">
            <CardTitle>Inventory List</CardTitle>
            <div className="text-xs text-gray-500">
              Page {meta.page} of {totalPages}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Medicine Details</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Branch</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock Level</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Pricing</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.map((item) => {
                    const lowStock = (item.quantity || 0) <= (item.reorder_level ?? 0);
                    const isExpiring = (() => {
                      if (!item.expiry_date) return false;
                      const expiry = new Date(item.expiry_date);
                      const now = new Date();
                      const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                      return diffDays <= 30;
                    })();

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 text-base">{item.medicine_name}</div>
                          <div className="flex flex-col gap-1 mt-1">
                            {item.sku && <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit">SKU: {item.sku}</span>}
                            {item.lot_number && <span className="text-xs text-gray-500">Lot: {item.lot_number}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <Badge variant="outline" className="font-normal">
                            {item.branch || "Main"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {renderPackagingInfo(item)}
                          <div className="text-xs text-gray-400 mt-1">
                            Reorder at: {numberFormatter.format(item.reorder_level || 0)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <div className="font-medium text-gray-900">{item.sell_price != null ? formatCurrency(item.sell_price) : "—"}</div>
                          {item.price_per_unit && (
                            <div className="text-xs text-gray-500">
                              {formatCurrency(item.price_per_unit)} / unit
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2 items-start">
                            {lowStock && (
                              <Badge variant="destructive" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                                Low Stock
                              </Badge>
                            )}
                            {isExpiring && (
                              <Badge variant="destructive" className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">
                                Expiring {formatDate(item.expiry_date)}
                              </Badge>
                            )}
                            {!lowStock && !isExpiring && (
                              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                Healthy
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td className="px-4 py-12 text-center text-sm text-gray-500" colSpan={5}>
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-8 w-8 text-gray-300" />
                          <p>{fetching ? "Loading inventory..." : "No inventory items found matching your filters."}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {fetching && items.length > 0 && <Skeleton className="h-10 w-full" />}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 bg-gray-50">
              <div>
                Showing {(meta.page - 1) * meta.pageSize + 1} -
                {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} items
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="bg-white"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= totalPages}
                  className="bg-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
