"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ExpensesAPI, Expense, ExpenseStatus, ExpenseCategory } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, DollarSign, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function ExpensesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const fetchExpenses = async () => {
        if (!user?.tenant_id) return;
        setLoading(true);
        try {
            const data = await ExpensesAPI.list(user.tenant_id);
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [user?.tenant_id]);

    const handleDelete = async (id: number) => {
        if (!user?.tenant_id) return;
        if (!confirm("Are you sure you want to delete this expense?")) return;
        try {
            await ExpensesAPI.delete(user.tenant_id, id);
            toast({ title: "Success", description: "Expense deleted" });
            fetchExpenses();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete expense", variant: "destructive" });
        }
    };

    const filteredExpenses = expenses.filter((ex) =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPending = expenses
        .filter((e) => e.status === ExpenseStatus.PENDING || e.status === ExpenseStatus.OVERDUE)
        .reduce((sum, e) => sum + e.amount, 0);

    const totalPaid = expenses
        .filter((e) => e.status === ExpenseStatus.PAID)
        .reduce((sum, e) => sum + e.amount, 0);

    const getStatusBadge = (status: ExpenseStatus) => {
        switch (status) {
            case ExpenseStatus.PAID:
                return <Badge className="bg-emerald-500">Paid</Badge>;
            case ExpenseStatus.PENDING:
                return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
            case ExpenseStatus.OVERDUE:
                return <Badge variant="destructive">Overdue</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-muted-foreground">Manage your business expenses and payments.</p>
                </div>
                <Button onClick={() => { setEditingExpense(null); setIsAddDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPending.toLocaleString()} ETB</div>
                        <p className="text-xs text-muted-foreground">Unpaid expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPaid.toLocaleString()} ETB</div>
                        <p className="text-xs text-muted-foreground">Settled expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {expenses
                                .filter(e => new Date(e.created_at).getMonth() === new Date().getMonth())
                                .reduce((sum, e) => sum + e.amount, 0)
                                .toLocaleString()} ETB
                        </div>
                        <p className="text-xs text-muted-foreground">Expenses added this month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search expenses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : filteredExpenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No expenses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-medium">{expense.title}</TableCell>
                                    <TableCell className="capitalize">{expense.category}</TableCell>
                                    <TableCell>{expense.amount.toLocaleString()} ETB</TableCell>
                                    <TableCell>
                                        {expense.due_date ? format(new Date(expense.due_date), "MMM d, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setEditingExpense(expense); setIsAddDialogOpen(true); }}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(expense.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AddExpenseDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={fetchExpenses}
                expenseToEdit={editingExpense}
            />
        </div>
    );
}
