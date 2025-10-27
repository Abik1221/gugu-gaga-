// POS page
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getAccessToken, getAuthJSON, postAuthJSON } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  name: string;
  sku: string;
  sale_price: number;
  stock_qty: number;
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export default function POSPage() {
  const router = useRouter();
  const { show } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastTxn, setLastTxn] = useState<any | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [branchId, setBranchId] = useState<string>("");
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  function extractReceiptId(tx: any): string | null {
    if (!tx) return null;
    if (tx.receipt_id) return String(tx.receipt_id);
    if (tx.receipt && tx.receipt.id) return String(tx.receipt.id);
    if (Array.isArray(tx.receipts) && tx.receipts.length > 0) {
      const r = tx.receipts[0];
      if (r && r.id) return String(r.id);
    }

  function authHeaders(): HeadersInit {
    const t = getAccessToken();
    return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  }

  function mapCartResponseToLocal(resp: any): CartLine[] {
    const lines = Array.isArray(resp?.items) ? resp.items : [];
    return lines.map((ln: any) => ({
      id: String(ln.item_id),
      name: String(ln.name || ""),
      price: Number(ln.unit_price || 0),
      qty: Number(ln.quantity || 0),
    }));
  }

  async function serverGetCart(sid: string) {
    const res = await fetch(`${API_BASE}/api/v1/pos/sessions/${sid}/cart`, { headers: authHeaders() });
    if (!res.ok) return;
    const data = await res.json();
    setCart(mapCartResponseToLocal(data));
  }

  async function serverAddToCart(sid: string, itemId: string, quantity: number) {
    const res = await fetch(`${API_BASE}/api/v1/pos/sessions/${sid}/cart`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ item_id: itemId, quantity }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      show({ variant: "destructive", title: "Cart update failed", description: msg });
      return;
    }
    const data = await res.json();
    setCart(mapCartResponseToLocal(data));
  }

  async function serverRemoveFromCart(sid: string, itemId: string) {
    const res = await fetch(`${API_BASE}/api/v1/pos/sessions/${sid}/cart/${encodeURIComponent(itemId)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) return;
    await serverGetCart(sid);
  }

  async function clearCart() {
    if (cart.length === 0) return;
    if (typeof window !== "undefined" && !window.confirm("Clear all items from cart?")) return;
    try {
      if (sessionId) {
        await postAuthJSON(`/api/v1/pos/sessions/${sessionId}/clear`, {});
      }
    } catch (e) {
      // non-fatal; still clear local cart
    }
    setCart([]);
    show({ variant: "success", title: "Cart cleared" });
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAuthJSON<Item[]>("/api/v1/inventory/items");
        if (!active) return;
        setItems(data);
      } catch (e: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Failed to load items", description: e.message || "" });
      } finally {
        if (active) setLoading(false);
      }
    }
    async function loadBranches() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/admin/branches`, { headers: { ...(getAccessToken()? { Authorization: `Bearer ${getAccessToken()}` } : {}) } });
        if (!res.ok) return;
        const b = await res.json();
        if (!active) return;
        if (Array.isArray(b)) setBranches(b);
      } catch {}
    }
    // restore existing POS session id if present
    try {
      const sid = typeof window !== "undefined" ? localStorage.getItem("pos_session_id") : null;
      if (sid) setSessionId(sid);
    } catch {}
    load();
    loadBranches();
    // hydrate cart from server if we have a session id
    (async () => {
      const sid = typeof window !== "undefined" ? localStorage.getItem("pos_session_id") : null;
      if (sid) await serverGetCart(sid);
    })();
    return () => {
      active = false;
    };
  }, [show]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)
    );
  }, [items, query]);

  async function addToCart(item: Item) {
    const sid = await ensureSession();
    if (sid) {
      await serverAddToCart(sid, item.id, 1);
    } else {
      // Fallback local if session cannot be created
      setCart((prev) => {
        const found = prev.find((l) => l.id === item.id);
        if (found) return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
        return [...prev, { id: item.id, name: item.name, price: item.sale_price, qty: 1 }];
      });
    }
  }

  async function removeFromCart(id: string) {
    if (sessionId) {
      await serverRemoveFromCart(sessionId, id);
    }
    setCart((prev) => prev.filter((l) => l.id !== id));
  }

  async function updateQty(id: string, qty: number) {
    if (qty <= 0) return removeFromCart(id);
    const sid = await ensureSession();
    if (sid) {
      await serverAddToCart(sid, id, qty);
    }
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  }

  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.price * l.qty, 0), [cart]);
  const tax = 0; // adjust when tax rules available
  const total = subtotal + tax;

  async function ensureSession(): Promise<string | null> {
    if (sessionId) return sessionId;
    try {
      // Create session with cashier context
      const me = await getAuthJSON<{ id: string }>("/api/v1/auth/me");
      const payload: any = { cashier_id: me?.id };
      if (branchId.trim()) payload.branch_id = branchId.trim();
      const res = await postAuthJSON<{ id: string }>("/api/v1/pos/sessions", payload);
      const id = (res as any)?.id;
      if (id) {
        setSessionId(id);
        try {
          if (typeof window !== "undefined") localStorage.setItem("pos_session_id", id);
        } catch {}
        // Initialize fresh cart state from server
        await serverGetCart(id);
        return id;
      }
      return null;
    } catch (e: any) {
      show({ variant: "destructive", title: "Session creation failed", description: e.message || "Provide POS session schema to finalize" });
      return null;
    }
  }

  async function checkout() {
    if (cart.length === 0) {
      show({ variant: "destructive", title: "Cart is empty", description: "Add items to proceed" });
      return;
    }
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    const sid = await ensureSession();
    if (!sid) {
      setIsCheckingOut(false);
      return;
    }
    const payload = {
      items: cart.map((l) => ({ item_id: l.id, quantity: l.qty })),
    };
    try {
      const tx = await postAuthJSON(`/api/v1/pos/sessions/${sid}/checkout`, payload);
      show({ variant: "success", title: "Checkout completed" });
      setCart([]);
      setLastTxn(tx);
      const rid = extractReceiptId(tx);
      if (rid) {
        router.push(`/dashboard/receipts/${rid}`);
      }
    } catch (e: any) {
      const msg = String(e?.message || "");
      const variant = msg.includes("409") ? "destructive" : "destructive";
      show({ variant: variant as any, title: "Checkout failed", description: msg || "Please try again" });
    }
    setIsCheckingOut(false);
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12 md:col-span-7">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Point of Sale</h1>
          {loading ? (
            <Skeleton className="h-9 w-64" />
          ) : (
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or SKU"
              className="w-64"
            />
          )}
        </div>
        <div className="border rounded bg-white overflow-hidden">
          {loading ? (
            <div className="max-h-[520px] overflow-auto divide-y">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-[520px] overflow-auto divide-y">
              {filtered.map((it) => (
                <div key={it.id} className="flex items-center justify-between p-3">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">SKU: {it.sku}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-700">${it.sale_price.toFixed(2)}</div>
                    <Button variant="outline" onClick={() => addToCart(it)}>
                      Add
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-6 text-gray-500">No matching items.</div>
              )}
            </div>
          )}
        </div>
      </section>

      <aside className="col-span-12 md:col-span-5">
        <div className="border rounded bg-white">
          <div className="border-b p-3 font-medium flex items-center justify-between">
            <span>Cart</span>
            <button
              className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
              onClick={() => {
                setSessionId(null);
                try {
                  if (typeof window !== "undefined") localStorage.removeItem("pos_session_id");
                } catch {}
                show({ variant: "success", title: "New session ready" });
              }}
            >
              New Session
            </button>
          </div>
          <div className="p-3 border-b flex items-center gap-2">
            <div className="text-xs text-gray-600">Branch</div>
            <select
              value={branchId}
              onChange={(e)=>setBranchId(e.target.value)}
              className="border rounded px-2 py-2 text-sm w-80"
            >
              <option value="">Select a branch</option>
              {branches.map((b)=> (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <div className="text-xs text-gray-500">Choose before creating a new session</div>
          </div>
          {loading ? (
            <div className="divide-y max-h-[420px] overflow-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="divide-y max-h-[420px] overflow-auto">
                {cart.map((l) => (
                  <div key={l.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate">{l.name}</div>
                      <div className="text-xs text-gray-500">${l.price.toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={l.qty}
                        onChange={(e) => updateQty(l.id, Number(e.target.value))}
                        className="w-20"
                      />
                      <div className="w-20 text-right font-medium">${(l.price * l.qty).toFixed(2)}</div>
                      <Button variant="outline" onClick={() => removeFromCart(l.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="p-6 text-gray-500">No items in cart.</div>
                )}
              </div>
              <div className="border-t p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                <div className="flex gap-2 mt-2">
                  <Button className="flex-1" onClick={checkout} disabled={isCheckingOut}>
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>
                  <Button variant="outline" className="w-36" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {lastTxn && (
          <div className="border rounded bg-white mt-4">
            <details>
              <summary className="cursor-pointer p-3 border-b font-medium">Last Transaction</summary>
              <div className="p-3 space-y-2">
                <pre className="text-xs overflow-auto max-h-64 bg-gray-50 p-2 rounded">{JSON.stringify(lastTxn, null, 2)}</pre>
                {extractReceiptId(lastTxn) && (
                  <Button
                    onClick={() => router.push(`/dashboard/receipts/${extractReceiptId(lastTxn)}`)}
                  >
                    View Receipt
                  </Button>
                )}
                <Button variant="outline" onClick={() => setLastTxn(null)}>Clear</Button>
              </div>
            </details>
          </div>
        )}
      </aside>
    </div>
  );
}
