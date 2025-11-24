import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { api } from "@/utils/api";

interface AddSingleItemFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddSingleItemForm({ onSuccess, onCancel }: AddSingleItemFormProps) {
    const { show } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicine_name: "",
        quantity: "",
        unit_type: "unit",
        sku: "",
        expiry_date: "",
        lot_number: "",
        sell_price: "",
        reorder_level: "",
        branch: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/inventory/items/single", {
                ...formData,
                quantity: parseInt(formData.quantity),
                sell_price: formData.sell_price ? parseFloat(formData.sell_price) : null,
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
                        placeholder="e.g. Paracetamol"
                        className="text-black bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sku" className="text-black">SKU (Optional)</Label>
                    <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g. PARA500"
                        className="text-black bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-black">Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                        min="1"
                        className="text-black bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit_type" className="text-black">Unit Type</Label>
                    <Select
                        value={formData.unit_type}
                        onValueChange={(val) => setFormData({ ...formData, unit_type: val })}
                    >
                        <SelectTrigger className="text-black bg-white">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="unit">Unit (Default)</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="capsule">Capsule</SelectItem>
                            <SelectItem value="bottle">Bottle</SelectItem>
                            <SelectItem value="tube">Tube</SelectItem>
                            <SelectItem value="vial">Vial</SelectItem>
                            <SelectItem value="ampoule">Ampoule</SelectItem>
                            <SelectItem value="sachet">Sachet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
                    <Label htmlFor="reorder_level" className="text-black">Reorder Level</Label>
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
