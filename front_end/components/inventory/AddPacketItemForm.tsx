import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { PackagingLevelBuilder, PackagingLevel } from "./PackagingLevelBuilder";

interface AddPacketItemFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddPacketItemForm({ onSuccess, onCancel }: AddPacketItemFormProps) {
    const { show } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicine_name: "",
        sku: "",
        expiry_date: "",
        lot_number: "",
        sell_price_per_unit: "",
        reorder_level: "",
        branch: ""
    });

    const [packagingLevels, setPackagingLevels] = useState<PackagingLevel[]>([
        { name: "Box", quantity: 1, contains: 10 },
        { name: "Strip", quantity: 1, contains: 10 },
        { name: "Tablet", quantity: 1, contains: 1 }
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/inventory/items/packet", {
                ...formData,
                packaging_levels: packagingLevels,
                sell_price_per_unit: formData.sell_price_per_unit ? parseFloat(formData.sell_price_per_unit) : null,
                reorder_level: formData.reorder_level ? parseInt(formData.reorder_level) : 0,
                expiry_date: formData.expiry_date || null,
                lot_number: formData.lot_number || null,
                branch: formData.branch || null
            });

            show({
                title: "Item added",
                description: "Inventory item has been created successfully",
            });
            onSuccess();
        } catch (err: any) {
            show({
                variant: "destructive",
                title: "Failed to add item",
                description: err?.response?.data?.detail || "Unable to create inventory item",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="medicine_name" className="text-black">Medicine Name</Label>
                    <Input
                        id="medicine_name"
                        value={formData.medicine_name}
                        onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                        required
                        placeholder="e.g. Amoxicillin"
                        className="text-black bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sku" className="text-black">SKU (Optional)</Label>
                    <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g. AMOX500"
                        className="text-black bg-white"
                    />
                </div>
            </div>

            <div className="border-t border-b py-4 my-2">
                <PackagingLevelBuilder
                    levels={packagingLevels}
                    onChange={setPackagingLevels}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="sell_price_per_unit" className="text-black">Sell Price (Per Base Unit)</Label>
                    <Input
                        id="sell_price_per_unit"
                        type="number"
                        step="0.01"
                        value={formData.sell_price_per_unit}
                        onChange={(e) => setFormData({ ...formData, sell_price_per_unit: e.target.value })}
                        className="text-black bg-white"
                        placeholder="Price for 1 tablet/unit"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reorder_level" className="text-black">Reorder Level (Total Units)</Label>
                    <Input
                        id="reorder_level"
                        type="number"
                        value={formData.reorder_level}
                        onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                        className="text-black bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="expiry_date" className="text-black">Expiry Date</Label>
                    <Input
                        id="expiry_date"
                        type="date"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                        className="text-black bg-white"
                    />
                </div>
                <div className="space-y-2">
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
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? "Adding..." : "Add Item"}
                </Button>
            </div>
        </form>
    );
}
