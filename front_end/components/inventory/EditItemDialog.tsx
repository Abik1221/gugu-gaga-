import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { api } from "@/utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface InventoryItem {
    id: number;
    medicine_name: string;
    quantity: number;
    reorder_level: number;
    sell_price: number | null;
    expiry_date: string | null;
    lot_number: string | null;
}

interface EditItemDialogProps {
    item: InventoryItem;
    onSuccess: () => void;
}

export function EditItemDialog({ item, onSuccess }: EditItemDialogProps) {
    const { show } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("replace"); // replace, add, remove
    const [adjustmentQty, setAdjustmentQty] = useState("");
    const [reason, setReason] = useState("");

    const [formData, setFormData] = useState({
        reorder_level: item.reorder_level.toString(),
        sell_price: item.sell_price?.toString() || "",
        expiry_date: item.expiry_date || "",
        lot_number: item.lot_number || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Update basic details
            await api.patch(`/inventory/items/${item.id}`, {
                reorder_level: parseInt(formData.reorder_level) || 0,
                sell_price: formData.sell_price ? parseFloat(formData.sell_price) : null,
                expiry_date: formData.expiry_date || null,
                lot_number: formData.lot_number || null
            });

            // 2. Handle quantity adjustment if needed
            // If mode is replace and user entered a value, or if mode is add/remove and user entered value
            if (adjustmentQty) {
                const qty = parseInt(adjustmentQty);
                // Only call adjust if it makes sense (e.g. replace with different value, or add/remove > 0)
                if (mode !== "replace" || (mode === "replace" && qty !== item.quantity)) {
                    await api.post(`/inventory/items/${item.id}/adjust`, {
                        mode: mode,
                        quantity: qty,
                        reason: reason || "Manual adjustment"
                    });
                }
            }

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
                description: err?.response?.data?.detail || "Unable to update inventory item",
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
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-black">Edit {item.medicine_name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
                        <Label className="text-black font-medium">Stock Adjustment</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-gray-500">Mode</Label>
                                <Select value={mode} onValueChange={setMode}>
                                    <SelectTrigger className="bg-white text-black h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="replace">Set Quantity</SelectItem>
                                        <SelectItem value="add">Add Stock</SelectItem>
                                        <SelectItem value="remove">Remove Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500">
                                    {mode === "replace" ? "New Quantity" : "Quantity to " + (mode === "add" ? "Add" : "Remove")}
                                </Label>
                                <Input
                                    type="number"
                                    value={adjustmentQty}
                                    onChange={(e) => setAdjustmentQty(e.target.value)}
                                    placeholder={mode === "replace" ? item.quantity.toString() : "0"}
                                    className="bg-white text-black h-8"
                                />
                            </div>
                        </div>
                        {adjustmentQty && (
                            <div>
                                <Label className="text-xs text-gray-500">Reason</Label>
                                <Textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Why are you changing stock?"
                                    className="bg-white text-black h-16 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="reorder_level" className="text-black">Reorder Level</Label>
                            <Input
                                id="reorder_level"
                                type="number"
                                value={formData.reorder_level}
                                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                                className="text-black bg-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="sell_price" className="text-black">Sell Price</Label>
                            <Input
                                id="sell_price"
                                type="number"
                                step="0.01"
                                value={formData.sell_price}
                                onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                                className="text-black bg-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="expiry_date" className="text-black">Expiry Date</Label>
                            <Input
                                id="expiry_date"
                                type="date"
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="text-black bg-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lot_number" className="text-black">Lot Number</Label>
                            <Input
                                id="lot_number"
                                value={formData.lot_number}
                                onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                                className="text-black bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Updating..." : "Update Item"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
