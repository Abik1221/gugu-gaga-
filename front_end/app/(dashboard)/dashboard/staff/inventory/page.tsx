"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockItems: InventoryItem[] = [
        {
          id: 1,
          medicine_id: 1,
          medicine_name: "Paracetamol 500mg",
          sku: "PARA500",
          branch: "Main",
          quantity: 150,
          pack_size: 10,
          packs: 15,
          singles: 0,
          reorder_level: 50,
          expiry_date: "2025-12-31",
          lot_number: "LOT123",
          sell_price: 2.50
        },
        {
          id: 2,
          medicine_id: 2,
          medicine_name: "Ibuprofen 200mg",
          sku: "IBU200",
          branch: "Main",
          quantity: 25,
          pack_size: 20,
          packs: 1,
          singles: 5,
          reorder_level: 40,
          expiry_date: "2024-06-15",
          lot_number: "LOT456",
          sell_price: 1.90
        }
      ];
      
      setItems(mockItems);
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
  }, []);

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
      // API call would go here
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

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
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
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name or SKU"
              className="text-black"
            />
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
                        <p className="text-sm text-gray-600">
                          {item.packs} packs + {item.singles} singles
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
                      <p className={`text-sm ${
                        isExpiringSoon(item) ? "text-red-600 font-medium" : "text-gray-900"
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

function AddItemDialog({ onSuccess }: { onSuccess: () => void }) {
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicine_name: "",
    sku: "",
    branch: "",
    quantity: "",
    reorder_level: "",
    sell_price: "",
    expiry_date: "",
    lot_number: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      show({
        title: "Item added",
        description: "New inventory item has been created",
      });
      
      setOpen(false);
      setFormData({
        medicine_name: "",
        sku: "",
        branch: "",
        quantity: "",
        reorder_level: "",
        sell_price: "",
        expiry_date: "",
        lot_number: ""
      });
      onSuccess();
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to add item",
        description: err?.message || "Unable to create inventory item",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Add Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicine_name" className="text-black font-medium">Medicine Name</Label>
            <Input
              id="medicine_name"
              value={formData.medicine_name}
              onChange={(e) => setFormData({...formData, medicine_name: e.target.value})}
              className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-black font-medium">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-black font-medium">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sell_price" className="text-black font-medium">Sell Price</Label>
            <Input
              id="sell_price"
              type="number"
              step="0.01"
              value={formData.sell_price}
              onChange={(e) => setFormData({...formData, sell_price: e.target.value})}
              className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry_date" className="text-black font-medium">Expiry Date</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
              className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditItemDialog({ item, onSuccess }: { item: InventoryItem; onSuccess: () => void }) {
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: item.quantity.toString(),
    reorder_level: item.reorder_level.toString(),
    sell_price: item.sell_price?.toString() || "",
    expiry_date: item.expiry_date || "",
    lot_number: item.lot_number || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      show({
        title: "Item updated",
        description: "Inventory item has been updated",
      });
      
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to update item",
        description: err?.message || "Unable to update inventory item",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {item.medicine_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="text-black"
              required
            />
          </div>
          <div>
            <Label htmlFor="reorder_level">Reorder Level</Label>
            <Input
              id="reorder_level"
              type="number"
              value={formData.reorder_level}
              onChange={(e) => setFormData({...formData, reorder_level: e.target.value})}
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="sell_price">Sell Price</Label>
            <Input
              id="sell_price"
              type="number"
              step="0.01"
              value={formData.sell_price}
              onChange={(e) => setFormData({...formData, sell_price: e.target.value})}
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
              className="text-black"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}