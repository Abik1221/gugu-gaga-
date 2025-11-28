"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { EditItemDialog } from "@/components/inventory/EditItemDialog";
import { Trash2 } from "lucide-react";
import { api } from "@/utils/api";

interface InventoryItem {
  id: number;
  medicine_id: number;
  medicine_name: string;
  sku: string;
  branch: string;
  quantity: number;
  pack_size: number;
  packs: number;
  singles: number;
  reorder_level: number;
  expiry_date: string | null;
  lot_number: string | null;
  sell_price: number | null;
}

export default function StaffInventory() {
  const { show } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inventory/items", {
        params: {
          q: searchQuery,
          low_stock_only: lowStockOnly
        }
      });
      setItems(res.data.items);
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to load inventory",
        description: err?.message || "Unable to fetch inventory data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [lowStockOnly]); // Reload when filter changes

  // Add debounce for search query if needed, or just add a search button

  const isLowStock = (item: InventoryItem) => {
    return item.quantity <= item.reorder_level;
  };

  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/inventory/items/${itemId}`);
      show({
        title: "Item deleted",
        description: "Inventory item has been removed",
      });
      loadInventory();
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to delete item",
        description: err?.message || "Unable to delete inventory item",
      });
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </d iv >
      );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inventory Management</h2>
            <p className="text-gray-600">Manage stock levels and medicine information</p>
          </div>
          <AddItemDialog onSuccess={loadInventory} />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Medicine
            </label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or SKU"
                className="text-black"
                onKeyDown={(e) => e.key === 'Enter' && loadInventory()}
              />
              <Button onClick={loadInventory} variant="secondary">Search</Button>
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Low stock only</span>
            </label>
          </div>
          <div className="flex items-end">
            <Button onClick={loadInventory} variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.medicine_name}</p>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        {item.lot_number && (
                          <p className="text-xs text-gray-500">Lot: {item.lot_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.quantity} units
                        </p>
                        <p className="text-xs text-gray-500">
                          Reorder at: {item.reorder_level}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {item.sell_price ? `$${item.sell_price.toFixed(2)}` : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${isExpiringSoon(item) ? "text-red-600 font-medium" : "text-gray-900"
                        }`}>
                        {formatDate(item.expiry_date)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {isLowStock(item) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        )}
                        {isExpiringSoon(item) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Expiring Soon
                          </span>
                        )}
                        {!isLowStock(item) && !isExpiringSoon(item) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Good
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <EditItemDialog item={item} onSuccess={loadInventory} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}