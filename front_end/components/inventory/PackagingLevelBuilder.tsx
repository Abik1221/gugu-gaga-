import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowRight, Package } from "lucide-react";

export interface PackagingLevel {
    name: string;
    quantity: number;
    contains: number;
}

interface PackagingLevelBuilderProps {
    levels: PackagingLevel[];
    onChange: (levels: PackagingLevel[]) => void;
}

export function PackagingLevelBuilder({ levels, onChange }: PackagingLevelBuilderProps) {
    const addLevel = () => {
        onChange([...levels, { name: "", quantity: 1, contains: 1 }]);
    };

    const removeLevel = (index: number) => {
        const newLevels = [...levels];
        newLevels.splice(index, 1);
        onChange(newLevels);
    };

    const updateLevel = (index: number, field: keyof PackagingLevel, value: string | number) => {
        const newLevels = [...levels];
        newLevels[index] = { ...newLevels[index], [field]: value };
        onChange(newLevels);
    };

    const calculateTotal = () => {
        if (levels.length === 0) return 0;
        let total = levels[0].quantity;
        for (const level of levels) {
            total *= level.contains;
        }
        return total;
    };

    const totalUnits = calculateTotal();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-black">Packaging Hierarchy</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLevel}>
                    <Plus className="h-4 w-4 mr-2" /> Add Level
                </Button>
            </div>

            <div className="space-y-3">
                {levels.map((level, index) => (
                    <div key={index} className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-gray-500">Unit Name</Label>
                            <Input
                                value={level.name}
                                onChange={(e) => updateLevel(index, "name", e.target.value)}
                                placeholder={index === 0 ? "e.g. Box" : index === levels.length - 1 ? "e.g. Tablet" : "e.g. Strip"}
                                className="h-8 bg-white text-black"
                            />
                        </div>

                        {index === 0 ? (
                            <div className="w-24 space-y-1">
                                <Label className="text-xs text-gray-500">Quantity</Label>
                                <Input
                                    type="number"
                                    value={level.quantity}
                                    onChange={(e) => updateLevel(index, "quantity", parseInt(e.target.value) || 0)}
                                    className="h-8 bg-white text-black"
                                    min="1"
                                />
                            </div>
                        ) : (
                            <div className="w-24 flex flex-col justify-end h-8 pb-2 text-center text-sm text-gray-500">
                                Auto
                            </div>
                        )}

                        <div className="flex items-center pb-2 text-gray-400">
                            <ArrowRight className="h-4 w-4" />
                        </div>

                        <div className="w-32 space-y-1">
                            <Label className="text-xs text-gray-500">
                                Contains {index < levels.length - 1 ? "Next" : "Base"}
                            </Label>
                            <div className="flex items-center">
                                <Input
                                    type="number"
                                    value={level.contains}
                                    onChange={(e) => updateLevel(index, "contains", parseInt(e.target.value) || 1)}
                                    className="h-8 bg-white text-black"
                                    min="1"
                                />
                                <span className="ml-1 text-xs text-gray-500">x</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLevel(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={levels.length <= 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center text-blue-800">
                    <Package className="h-5 w-5 mr-2" />
                    <span className="font-medium">Total Units:</span>
                </div>
                <span className="text-xl font-bold text-blue-700">
                    {totalUnits.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
