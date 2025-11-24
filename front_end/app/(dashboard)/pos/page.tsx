"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  AuthAPI,
  InventoryAPI,
  type InventoryItem,
  SalesAPI,
  type MedicineListItem,
  MedicinesAPI,
} from "@/utils/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

type CartLine = {
  key: string;
  medicine: MedicineListItem & { price?: number | null };
  lot?: InventoryItem | null;
  quantity: number;
  unitPrice: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export default function POSPage() {
  const { show } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryBranchFilter, setInventoryBranchFilter] = useState<string>("");
  const [inventorySearch, setInventorySearch] = useState<string>("");
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const [medicines, setMedicines] = useState<MedicineListItem[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);

  const [branch, setBranch] = useState<string>("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        const me = await AuthAPI.me();
        if (!active) return;
        setProfile(me);
        setTenantId(me?.tenant_id || null);
      } catch (error: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Unable to load POS", description: error?.message || "Please try again." });
      } finally {
        if (active) setInitializing(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [show]);

  const loadInventory = useCallback(
    async (tid: string) => {
      setLoadingInventory(true);
      setInventoryError(null);
      try {
        const { items } = await InventoryAPI.list(tid, {
          q: inventorySearch || undefined,
          branch: inventoryBranchFilter || undefined,
          lowStockOnly: false,
          pageSize: 100,
        });
        setInventory(items);
      } catch (error: any) {
        setInventory([]);
        setInventoryError(error?.message || "Unable to load inventory");
      } finally {
        setLoadingInventory(false);
      }
    },
    [inventorySearch, inventoryBranchFilter],
  );

  const loadMedicines = useCallback(
    async (tid: string) => {
      setLoadingMedicines(true);
      try {
        const { items } = await MedicinesAPI.list(tid, { pageSize: 200 });
        setMedicines(items);
      } catch (error: any) {
        show({ variant: "destructive", title: "Unable to load medicines", description: error?.message || "Try again." });
      } finally {
        setLoadingMedicines(false);
      }
    },
    [show],
  );

  useEffect(() => {
    if (!tenantId) return;
    loadMedicines(tenantId);
  }, [tenantId, loadMedicines]);

  useEffect(() => {
    if (!tenantId) return;
    loadInventory(tenantId);
  }, [tenantId, loadInventory]);

  const inventoryBranches = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((item) => {
      if (item.branch) set.add(item.branch);
    });
    return Array.from(set).sort();
  }, [inventory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }, [cart]);

  const handleAddLine = (lot: InventoryItem) => {
    const med = medicines.find((m) => m.id === lot.medicine_id);
    const unitPrice = lot.sell_price ?? 0;
    if (!med) {
      show({ variant: "destructive", title: "Medicine not found", description: "Unable to match medicine for this lot." });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((line) => line.lot?.id === lot.id);
      if (existing) {
        return prev.map((line) =>
          line.key === existing.key
            ? { ...line, quantity: Math.min(line.quantity + 1, lot.quantity || 0), unitPrice: unitPrice || line.unitPrice }
            : line,
        );
      }
      return [
        ...prev,
        {
          key: `${lot.id}-${Date.now()}`,
          medicine: { ...med, price: unitPrice },
          lot,
          quantity: 1,
          unitPrice: unitPrice || 0,
        },
      ];
    });
  };

  const handleAddBySearch = (medicine: MedicineListItem) => {
    setCart((prev) => [
      ...prev,
      {
        key: `${medicine.id}-${Date.now()}`,
        medicine,
        lot: null,
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleUpdateLine = (key: string, updater: (line: CartLine) => CartLine) => {
    setCart((prev) => prev.map((line) => (line.key === key ? updater(line) : line)));
  };

  const handleRemoveLine = (key: string) => {
    setCart((prev) => prev.filter((line) => line.key !== key));
  };

  const resetSale = () => {
    setCart([]);
    setBranch("");
  };

  const handleSubmit = async () => {
    if (!tenantId) return;
    if (cart.length === 0) {
      show({ variant: "destructive", title: "Cart empty", description: "Add at least one item." });
      return;
    }
    const linesPayload = cart.map((line) => ({
      name_or_sku: line.medicine.sku || line.medicine.name,
      quantity_units: line.quantity,
      unit_price: line.unitPrice,
    }));
    setSubmitting(true);
    try {
      const receipt = await SalesAPI.pos(tenantId, {
        lines: linesPayload,
        branch: branch || undefined,
      });
      show({
        variant: "success",
        title: "Sale completed",
        description: `Receipt #${receipt.id} • Total ${formatCurrency(receipt.total)}`,
      });
      resetSale();
      if (tenantId) loadInventory(tenantId);
    } catch (error: any) {
      show({ variant: "destructive", title: "Sale failed", description: error?.message || "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales console</h1>
          <p className="text-sm text-gray-500">
            Look up medicine lots, build the cart, and issue receipts that sync with owner analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>Cashier:</span>
          <span className="font-medium text-gray-900">{profile?.username || "—"}</span>
          <span className="hidden sm:inline">•</span>
          <span>Tenant:</span>

        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-col gap-3">
            <CardTitle>Lot lookup</CardTitle>
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                value={inventorySearch}
                onChange={(event) => setInventorySearch(event.target.value)}
                placeholder="Search medicine name or SKU"
              />
              <select
                value={inventoryBranchFilter}
                onChange={(event) => setInventoryBranchFilter(event.target.value)}
                className="rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
              >
                <option value="">All branches</option>
                {inventoryBranches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => {
                  if (tenantId) loadInventory(tenantId);
                }}
                disabled={loadingInventory}
              >
                Refresh lots
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryError && (
              <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {inventoryError}
              </div>
            )}
            {loadingInventory ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="max-h-[420px] space-y-2 overflow-auto rounded border border-gray-200 bg-white">
                {inventory.map((lot) => (
                  <div
                    key={lot.id}
                    className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-b-0"
                  >
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-gray-900">{lot.medicine_name}</div>
                      <div className="text-xs text-gray-500">
                        SKU: {lot.sku || "—"} • Branch: {lot.branch || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {lot.quantity} • Reorder: {lot.reorder_level} • Exp: {lot.expiry_date || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(lot.sell_price ?? 0)}
                      </div>
                      <Button size="sm" onClick={() => handleAddLine(lot)}>
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
                {inventory.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No lots match your filters.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Quick-add medicine</CardTitle>
            <p className="text-xs text-gray-500">
              Use this when the lot is not tracked yet. You’ll enter the sale price manually.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingMedicines ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <select
                value=""
                onChange={(event) => {
                  const id = Number(event.target.value);
                  const med = medicines.find((m) => m.id === id);
                  if (med) handleAddBySearch(med);
                }}
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring"
              >
                <option value="">Select medicine...</option>
                {medicines.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} {med.sku ? `(${med.sku})` : ""}
                  </option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Sale builder</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
                placeholder="Branch / till (optional)"
                className="w-60"
              />
              <Button variant="ghost" size="sm" onClick={resetSale}>
                Clear sale
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="rounded border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                Add items from the left or quick-add a medicine to begin building the cart.
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((line) => (
                  <div key={line.key} className="rounded border border-gray-200 bg-white p-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{line.medicine.name}</div>
                        <div className="text-xs text-gray-500">
                          {line.medicine.sku ? `SKU ${line.medicine.sku}` : "Manual entry"}
                          {line.lot ? ` • Lot ${line.lot.lot_number || line.lot.id}` : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <label className="text-xs uppercase tracking-wide text-gray-500">Qty</label>
                        <Input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(event) => {
                            const value = Math.max(1, Number(event.target.value) || 1);
                            handleUpdateLine(line.key, (l) => ({ ...l, quantity: value }));
                          }}
                          className="w-24"
                        />
                        {line.lot && (
                          <span className="text-xs text-gray-500">
                            Stock: {line.lot.quantity} units
                          </span>
                        )}
                        <label className="text-xs uppercase tracking-wide text-gray-500">Price</label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(event) => {
                            const value = Math.max(0, Number(event.target.value) || 0);
                            handleUpdateLine(line.key, (l) => ({ ...l, unitPrice: value }));
                          }}
                          className="w-28"
                        />
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(line.quantity * line.unitPrice)}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveLine(line.key)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Cart lines: {cart.length} • Total quantity: {cart.reduce((sum, l) => sum + l.quantity, 0)}
            </div>
            <div className="flex flex-col gap-2 text-right">
              <div className="text-lg font-semibold text-gray-900">
                Total due: {formatCurrency(cartTotal)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetSale}>
                  Reset
                </Button>
                <Button onClick={handleSubmit} disabled={submitting || cart.length === 0}>
                  {submitting ? "Processing..." : "Complete sale"}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
