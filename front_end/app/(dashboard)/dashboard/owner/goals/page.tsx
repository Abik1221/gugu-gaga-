"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GoalsAPI, BusinessGoal, GoalStatus, GoalType } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import { Target, TrendingUp, Calendar, DollarSign, Trophy, CheckCircle2, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<BusinessGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<BusinessGoal | null>(null);

    const fetchGoals = async () => {
        if (!user?.tenant_id) return;
        setLoading(true);
        try {
            const data = await GoalsAPI.list(user.tenant_id, { status: GoalStatus.ACTIVE });
            setGoals(data);
        } catch (error) {
            console.error("Failed to fetch goals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user?.tenant_id]);

    const activeGoals = goals.filter((g) => g.status === GoalStatus.ACTIVE);
    const achievedCount = goals.filter((g) => g.status === GoalStatus.ACHIEVED).length;
    const avgProgress =
        activeGoals.length > 0
            ? activeGoals.reduce((sum, g) => sum + (g.progress_percentage || 0), 0) / activeGoals.length
            : 0;
    const totalTarget = activeGoals.reduce((sum, g) => sum + g.target_amount, 0);

    const getStatusBadge = (goal: BusinessGoal) => {
        if (goal.status === GoalStatus.ACHIEVED) {
            return <Badge className="bg-emerald-500">Achieved</Badge>;
        }
        if (goal.status === GoalStatus.MISSED) {
            return <Badge variant="destructive">Missed</Badge>;
        }
        if (goal.is_on_track) {
            return <Badge className="bg-blue-500">On Track</Badge>;
        }
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Behind</Badge>;
    };

    const getGoalTypeIcon = (type: GoalType) => {
        switch (type) {
            case GoalType.REVENUE:
                return <DollarSign className="h-4 w-4" />;
            case GoalType.PROFIT:
                return <TrendingUp className="h-4 w-4" />;
            case GoalType.SALES_COUNT:
                return <Target className="h-4 w-4" />;
            default:
                return <Target className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Business Goals</h1>
                    <p className="text-sm text-muted-foreground">Set targets and track your business performance</p>
                </div>
                <Button onClick={() => { setEditingGoal(null); setIsAddDialogOpen(true); }}>
                    <Target className="mr-2 h-4 w-4" /> Create Goal
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeGoals.length}</div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Achieved</CardTitle>
                        <Trophy className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{achievedCount}</div>
                        <p className="text-xs text-muted-foreground">Goals completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgProgress.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Across active goals</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Target</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTarget.toLocaleString()} ETB</div>
                        <p className="text-xs text-muted-foreground">Combined targets</p>
                    </CardContent>
                </Card>
            </div>

            {/* Goals List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading goals...</div>
                </div>
            ) : activeGoals.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No active goals</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start by creating your first business goal</p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Target className="mr-2 h-4 w-4" /> Create Your First Goal
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeGoals.map((goal) => (
                        <Card key={goal.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                            {getGoalTypeIcon(goal.goal_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base font-semibold truncate">{goal.title}</CardTitle>
                                            <p className="text-xs text-muted-foreground capitalize">{goal.goal_type}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(goal)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-semibold">{goal.progress_percentage?.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={goal.progress_percentage || 0} className="h-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Current</p>
                                        <p className="font-semibold">{goal.current_amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs">Target</p>
                                        <p className="font-semibold">{goal.target_amount.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {goal.days_remaining !== undefined && goal.days_remaining > 0
                                            ? `${goal.days_remaining} days left`
                                            : "Deadline passed"}
                                    </span>
                                </div>

                                {goal.milestones && goal.milestones.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Milestones: {goal.milestones.filter((m) => m.achieved).length}/{goal.milestones.length}
                                        </p>
                                        <div className="flex gap-1">
                                            {goal.milestones.map((milestone) => (
                                                <div
                                                    key={milestone.id}
                                                    className={cn(
                                                        "h-2 flex-1 rounded-full",
                                                        milestone.achieved ? "bg-emerald-500" : "bg-gray-200"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AddGoalDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={fetchGoals}
                goalToEdit={editingGoal}
            />
        </div>
    );
}
