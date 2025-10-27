// Inventory page
"use client";
import React, { useEffect, useState } from "react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { TableSkeletonRows } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

type Item = {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
  category?: string | null;
  supplier_id?: string | null;
  cost_price: number;
  sale_price: number;
  tax: number;
  units: string;
  lot_no?: string | null;
  expiry_date?: string | null;
  stock_qty: number;
};

type InventoryResponse = {
  items: Item[];
  total: number;
  page: number;
  page_size: number;
};

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    cost_price: "",
    sale_price: "",
    stock_qty: "",
    units: "pcs",
    barcode: "",
    lot_no: "",
    expiry_date: "",
  });
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<string>("");
  const [adjustReason, setAdjustReason] = useState<string>("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAuthJSON<InventoryResponse>("/api/v1/inventory/items");
        const list = Array.isArray(data?.items) ? data.items : [];
        if (!active) return;
        setItems(list);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load inventory");
        setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">Inventory Management</div>
          <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="overflow-x-auto border rounded bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-right px-3 py-2">Stock</th>
                <th className="text-right px-3 py-2">Sale Price</th>
                <th className="text-right px-3 py-2">Cost</th>
                <th className="text-left px-3 py-2">Expiry</th>
              </tr>
            </thead>
            <TableSkeletonRows rows={6} cols={7} />
          </table>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      it.sku.toLowerCase().includes(q) ||
      (it.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search name/SKU/category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <button
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setCreating((v) => !v)}
          >
            {creating ? "Close" : "Add Item"}
          </button>
        </div>
      </div>
      {creating && (
        <div className="border rounded bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
            <Input placeholder="SKU" value={form.sku} onChange={(e)=>setForm({...form,sku:e.target.value})} />
            <Input placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} />
            <Input placeholder="Cost Price" type="number" min="0" step="0.01" value={form.cost_price} onChange={(e)=>setForm({...form,cost_price:e.target.value})} />
            <Input placeholder="Sale Price" type="number" min="0" step="0.01" value={form.sale_price} onChange={(e)=>setForm({...form,sale_price:e.target.value})} />
            <Input placeholder="Stock Qty" type="number" min="0" step="0.01" value={form.stock_qty} onChange={(e)=>setForm({...form,stock_qty:e.target.value})} />
            <Input placeholder="Units (e.g. pcs)" value={form.units} onChange={(e)=>setForm({...form,units:e.target.value})} />
            <Input placeholder="Barcode (optional)" value={form.barcode} onChange={(e)=>setForm({...form,barcode:e.target.value})} />
            <Input placeholder="Lot No (optional)" value={form.lot_no} onChange={(e)=>setForm({...form,lot_no:e.target.value})} />
            <Input placeholder="Expiry Date (YYYY-MM-DD optional)" value={form.expiry_date} onChange={(e)=>setForm({...form,expiry_date:e.target.value})} />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="border rounded px-3 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={async () => {
                try {
                  const payload: any = {
                    name: form.name.trim(),
                    sku: form.sku.trim(),
                    category: form.category.trim() || undefined,
                    barcode: form.barcode.trim() || undefined,
                    units: form.units.trim() || "pcs",
                    lot_no: form.lot_no.trim() || undefined,
                    expiry_date: form.expiry_date.trim() || undefined,
                    cost_price: Number(form.cost_price),
                    sale_price: Number(form.sale_price),
                    stock_qty: Number(form.stock_qty),
                  };
                  if (!payload.name || !payload.sku || isNaN(payload.cost_price) || isNaN(payload.sale_price) || isNaN(payload.stock_qty)) {
                    show({ variant: "destructive", title: "Invalid input", description: "Fill required fields correctly" });
                    return;
                  }
                  await postAuthJSON("/api/v1/inventory/items", payload);
                  show({ variant: "success", title: "Item created" });
                  setCreating(false);
                  setForm({ name:"", sku:"", category:"", cost_price:"", sale_price:"", stock_qty:"", units:"pcs", barcode:"", lot_no:"", expiry_date:"" });
                  // refresh list
                  setLoading(true);
                  try {
                    const data = await getAuthJSON<InventoryResponse>("/api/v1/inventory/items");
                    setItems(Array.isArray(data?.items) ? data.items : []);
                  } finally {
                    setLoading(false);
                  }
                } catch (e: any) {
                  show({ variant: "destructive", title: "Create failed", description: e.message || "" });
                }
              }}
            >
              Save Item
            </button>
            <button className="border rounded px-3 py-2 text-sm hover:bg-gray-50" onClick={()=>setCreating(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto border rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">SKU</th>
              <th className="text-left px-3 py-2">Category</th>
              <th className="text-right px-3 py-2">Stock</th>
              <th className="text-right px-3 py-2">Sale Price</th>
              <th className="text-right px-3 py-2">Cost</th>
              <th className="text-left px-3 py-2">Expiry</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it.id} className="border-t align-top">
                <td className="px-3 py-2">{it.name}</td>
                <td className="px-3 py-2 text-gray-600">{it.sku}</td>
                <td className="px-3 py-2 text-gray-600">{it.category || "-"}</td>
                <td className="px-3 py-2 text-right">{it.stock_qty}</td>
                <td className="px-3 py-2 text-right">{it.sale_price.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{it.cost_price.toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-600">{it.expiry_date || "-"}</td>
                <td className="px-3 py-2">
                  <button
                    className="text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs rounded px-2 py-1"
                    onClick={() => {
                      setAdjustId(it.id);
                      setAdjustDelta("");
                      setAdjustReason("");
                    }}
                  >
                    Adjust Stock
                  </button>
                  {adjustId === it.id && (
                    <div className="mt-2 border rounded p-2 bg-gray-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          className="w-32"
                          placeholder="Delta (+/-)"
                          value={adjustDelta}
                          onChange={(e) => setAdjustDelta(e.target.value)}
                        />
                        <Input
                          placeholder="Reason"
                          value={adjustReason}
                          onChange={(e) => setAdjustReason(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="border rounded px-3 py-1 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={async () => {
                            const delta = Number(adjustDelta);
                            if (!adjustReason.trim() || isNaN(delta) || delta === 0) {
                              show({ variant: "destructive", title: "Invalid adjustment", description: "Enter non-zero delta and reason" });
                              return;
                            }
                            const confirmMsg = delta < 0
                              ? `Decrease stock by ${Math.abs(delta)}?`
                              : `Increase stock by ${delta}?`;
                            if (typeof window !== "undefined" && !window.confirm(confirmMsg)) {
                              return;
                            }
                            try {
                              await postAuthJSON(`/api/v1/inventory/items/${it.id}/adjust-stock`, {
                                delta,
                                reason: adjustReason.trim(),
                              });
                              show({ variant: "success", title: "Stock adjusted" });
                              setAdjustId(null);
                              // refresh list
                              setLoading(true);
                              try {
                                const data = await getAuthJSON<InventoryResponse>("/api/v1/inventory/items");
                                setItems(Array.isArray(data?.items) ? data.items : []);
                              } finally {
                                setLoading(false);
                              }
                            } catch (e: any) {
                              show({ variant: "destructive", title: "Adjust failed", description: e.message || "" });
                            }
                          }}
                        >
                          Save
                        </button>
                        <button className="border rounded px-3 py-1 text-xs hover:bg-white" onClick={() => setAdjustId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>
                  No items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
