"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, CheckCircle, CreditCard, Truck, X, Check } from "lucide-react";
import { PaymentVerificationDialog } from "@/components/ui/payment-verification-dialog";
import { getAuthJSON, putAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";

export default function SupplierOrders() {
  const { show } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getAuthJSON("/api/v1/suppliers/orders");
      setOrders(ordersData || []);
    } catch (error) {
      show({ title: "Error", description: "Failed to load orders", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      await putAuthJSON(`/api/v1/suppliers/orders/${orderId}/approve`, {});
      show({ title: "Success", description: "Order approved successfully", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to approve order", variant: "destructive" });
      console.error(error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await putAuthJSON(`/api/v1/suppliers/orders/${orderId}/reject`, {});
      show({ title: "Success", description: "Order rejected", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to reject order", variant: "destructive" });
      console.error(error);
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      await putAuthJSON(`/api/v1/suppliers/orders/${orderId}/verify-payment`, {});
      show({ title: "Success", description: "Payment verified successfully", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to verify payment", variant: "destructive" });
      console.error(error);
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    try {
      show({ title: "Success", description: "Payment rejected", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to reject payment", variant: "destructive" });
      console.error(error);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await putAuthJSON(`/api/v1/suppliers/orders/${orderId}/mark-delivered`, {});
      show({ title: "Success", description: "Order marked as delivered", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to mark order as delivered", variant: "destructive" });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Approve orders and manage deliveries</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't received any orders yet. Orders will appear here when customers place them.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending Approval", variant: "secondary" as const, icon: Clock },
      approved: { label: "Approved", variant: "default" as const, icon: CheckCircle },
      payment_received: { label: "Payment Received", variant: "default" as const, icon: CreditCard },
      delivered: { label: "Delivered", variant: "default" as const, icon: Truck },
      cancelled: { label: "Cancelled", variant: "destructive" as const, icon: X },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">Approve orders and manage deliveries</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const statusConfig = getStatusBadge(order.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.order_number || order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.customer?.email || order.customerName}</p>
                  </div>
                  <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Product</p>
                    <p className="text-muted-foreground">{order.items?.[0]?.product?.name || order.productName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quantity</p>
                    <p className="text-muted-foreground">{order.items?.[0]?.quantity || order.quantity} units</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Amount</p>
                    <p className="text-muted-foreground">${order.total_amount || order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="font-medium">Order Date</p>
                    <p className="text-muted-foreground">{new Date(order.created_at || order.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {order.payment_code && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Payment Code: {order.payment_code}</p>
                  </div>
                )}

                {/* Status-specific actions */}
                {order.status === "pending" && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveOrder(order.id)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Approve Order
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRejectOrder(order.id)}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}

                {order.status === "approved" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        {order.payment_code 
                          ? "Payment code received. Please verify to proceed."
                          : "Order approved. Waiting for customer payment."
                        }
                      </p>
                    </div>
                    {order.payment_code && (
                      <PaymentVerificationDialog
                        orderId={order.id}
                        paymentCode={order.payment_code}
                        onVerify={() => handleVerifyPayment(order.id)}
                        onReject={() => handleRejectPayment(order.id)}
                      >
                        <Button size="sm" className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          Verify Payment
                        </Button>
                      </PaymentVerificationDialog>
                    )}
                  </div>
                )}

                {order.status === "payment_received" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Payment received. Ready to ship.
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkDelivered(order.id)}
                      className="flex items-center gap-1"
                    >
                      <Truck className="h-4 w-4" />
                      Mark as Delivered
                    </Button>
                  </div>
                )}

                {order.status === "delivered" && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Order delivered successfully on {new Date(order.delivered_at || order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}