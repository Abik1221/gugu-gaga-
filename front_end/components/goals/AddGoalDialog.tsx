"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GoalsAPI, GoalType, BusinessGoal } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddGoalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    goalToEdit?: BusinessGoal | null;
}

export function AddGoalDialog({ open, onOpenChange, onSuccess, goalToEdit }: AddGoalDialogProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [formData, setFormData] = useState({
        title: "",
        goal_type: GoalType.REVENUE,
        target_amount: "",
        description: "",
    });

    const [milestones, setMilestones] = useState<Array<{ title: string; target_value: string }>>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.tenant_id || !startDate || !endDate) return;

        if (endDate <= startDate) {
            toast({ title: "Error", description: "End date must be after start date", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                goal_type: formData.goal_type,
                target_amount: parseFloat(formData.target_amount),
                start_date: format(startDate, "yyyy-MM-dd"),
                end_date: format(endDate, "yyyy-MM-dd"),
                description: formData.description || undefined,
                milestones: milestones
                    .filter((m) => m.title && m.target_value)
                    .map((m) => ({
                        title: m.title,
                        target_value: parseFloat(m.target_value),
                    })),
            };

            if (goalToEdit) {
                await GoalsAPI.update(user.tenant_id, goalToEdit.id, payload);
                toast({ title: "Success", description: "Goal updated successfully" });
            } else {
                await GoalsAPI.create(user.tenant_id, payload);
                toast({ title: "Success", description: "Goal created successfully" });
            }

            onSuccess();
            onOpenChange(false);
            // Reset form
            setFormData({ title: "", goal_type: GoalType.REVENUE, target_amount: "", description: "" });
            setMilestones([]);
            setStartDate(undefined);
            setEndDate(undefined);
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to save goal", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const addMilestone = () => {
        setMilestones([...milestones, { title: "", target_value: "" }]);
    };

    const removeMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{goalToEdit ? "Edit Goal" : "Create New Goal"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Goal Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Q1 2025 Revenue Target"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="goal_type">Goal Type *</Label>
                            <Select
                                value={formData.goal_type}
                                onValueChange={(val) => setFormData({ ...formData, goal_type: val as GoalType })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={GoalType.REVENUE}>Revenue</SelectItem>
                                    <SelectItem value={GoalType.PROFIT}>Profit</SelectItem>
                                    <SelectItem value={GoalType.SALES_COUNT}>Sales Count</SelectItem>
                                    <SelectItem value={GoalType.CUSTOMERS}>Customers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="target_amount">Target Amount *</Label>
                            <Input
                                id="target_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Start Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-2">
                            <Label>End Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Additional details about this goal..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Milestones (Optional)</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                                <Plus className="h-4 w-4 mr-1" /> Add Milestone
                            </Button>
                        </div>
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <Input
                                    placeholder="Milestone title"
                                    value={milestone.title}
                                    onChange={(e) => {
                                        const newMilestones = [...milestones];
                                        newMilestones[index].title = e.target.value;
                                        setMilestones(newMilestones);
                                    }}
                                />
                                <Input
                                    type="number"
                                    placeholder="Value"
                                    className="w-32"
                                    value={milestone.target_value}
                                    onChange={(e) => {
                                        const newMilestones = [...milestones];
                                        newMilestones[index].target_value = e.target.value;
                                        setMilestones(newMilestones);
                                    }}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : goalToEdit ? "Update Goal" : "Create Goal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
