"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Search, Eye, Star, Package } from "lucide-react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";

export default function AdminSuppliersPage() {
  const { show } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("suppliers");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [suppliersData, paymentsData] = await Promise.all([
        getAuthJSON("/api/v1/admin/suppliers"),
        getAuthJSON("/api/v1/admin/suppliers/payments")
      ]);
      setSuppliers(suppliersData.items || []);
      setPayments(paymentsData.items || []);
    } catch (error) {
      show({ title: "Error", description: "Failed to load supplier data", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSupplier = async (supplierId: number) => {
    try {
      await postAuthJSON(`/api/v1/admin/suppliers/${supplierId}/approve`, {});
      show({ title: "Success", description: "Supplier approved successfully", variant: "success" });
      loadData();
    } catch (error) {
      show({ title: "Error", description: "Failed to approve supplier", variant: "destructive" });
      console.error(error);
    }
  };

  const handleRejectSupplier = async (supplierId: number) => {
    try {
      await postAuthJSON(`/api/v1/admin/suppliers/${supplierId}/reject`, {});
      show({ title: "Success", description: "Supplier rejected", variant: "success" });
      loadData();
    } catch (error) {
      show({ title: "Error", description: "Failed to reject supplier", variant: "destructive" });
      console.error(error);
    }
  };

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await postAuthJSON(`/api/v1/admin/suppliers/payments/${paymentId}/verify`, {});
      show({ title: "Success", description: "Payment verified successfully", variant: "success" });
      loadData();
    } catch (error) {
      show({ title: "Error", description: "Failed to verify payment", variant: "destructive" });
      console.error(error);
    }
  };

  const handleRejectPayment = async (paymentId: number) => {
    try {
      await postAuthJSON(`/api/v1/admin/suppliers/payments/${paymentId}/reject`, {});
      show({ title: "Success", description: "Payment rejected", variant: "success" });
      loadData();
    } catch (error) {
      show({ title: "Error", description: "Failed to reject payment", variant: "destructive" });
      console.error(error);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingSuppliers = filteredSuppliers.filter(s => !s.is_verified);
  const approvedSuppliers = filteredSuppliers.filter(s => s.is_verified);
  const pendingPayments = payments.filter(p => p.status === "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supplier Management</h1>
        <p className="text-muted-foreground">Manage supplier applications and payments</p>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="suppliers">
            Suppliers ({filteredSuppliers.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending KYC ({pendingSuppliers.length})
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payment Verification ({pendingPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.company_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={supplier.is_verified ? "default" : "secondary"}>
                        {supplier.is_verified ? "Verified" : "Pending"}
                      </Badge>
                      <Badge variant={supplier.is_active ? "default" : "destructive"}>
                        {supplier.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{supplier.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-muted-foreground">{supplier.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Total Orders</p>
                      <p className="text-muted-foreground">{supplier.total_orders}</p>
                    </div>
                    <div>
                      <p className="font-medium">Joined</p>
                      <p className="text-muted-foreground">
                        {new Date(supplier.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {!supplier.is_verified && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveSupplier(supplier.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Approve KYC
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectSupplier(supplier.id)}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}

                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.company_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                    </div>
                    <Badge variant="secondary">Pending Review</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{supplier.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium">Applied</p>
                      <p className="text-muted-foreground">
                        {new Date(supplier.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      KYC application pending admin review
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveSupplier(supplier.id)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Approve KYC
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRejectSupplier(supplier.id)}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {pendingPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{payment.company_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{payment.supplier_email}</p>
                    </div>
                    <Badge variant="secondary">Payment Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Payment Code</p>
                      <p className="text-muted-foreground font-mono">{payment.code}</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount</p>
                      <p className="text-muted-foreground">${payment.amount}</p>
                    </div>
                    <div>
                      <p className="font-medium">Method</p>
                      <p className="text-muted-foreground">{payment.payment_method}</p>
                    </div>
                    <div>
                      <p className="font-medium">Submitted</p>
                      <p className="text-muted-foreground">
                        {new Date(payment.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {payment.notes && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {payment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleVerifyPayment(payment.id)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Verify Payment
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRejectPayment(payment.id)}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}