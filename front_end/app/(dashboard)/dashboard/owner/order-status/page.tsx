"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, CreditCard, Truck, Star } from "lucide-react";
import { PaymentCodeDialog } from "@/components/ui/payment-code-dialog";
import { RatingFeedbackDialog } from "@/components/ui/rating-feedback-dialog";
import { getAuthJSON, putAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";

function getTenantId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tenant_id");
}

export default function OrderStatusPage() {
  const { show } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      const ordersData = await getAuthJSON("/api/v1/orders", tenantId);
      setOrders(ordersData || []);
    } catch (error) {
      show({ title: "Error", description: "Failed to load orders", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCodeSubmit = async (orderId: string, paymentCode: string) => {
    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      await putAuthJSON(`/api/v1/orders/${orderId}/payment-code`, { code: paymentCode }, tenantId);
      show({ title: "Success", description: "Payment code submitted successfully", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to submit payment code", variant: "destructive" });
      console.error(error);
    }
  };

  const handleRatingSubmit = async (orderId: string, rating: number, feedback: string) => {
    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      await postAuthJSON(`/api/v1/orders/${orderId}/review`, { rating, comment: feedback }, tenantId);
      show({ title: "Success", description: "Review submitted successfully", variant: "success" });
      loadOrders();
    } catch (error) {
      show({ title: "Error", description: "Failed to submit review", variant: "destructive" });
      console.error(error);
    }
  };

  const hasOrders = orders.length > 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending Approval", variant: "secondary" as const },
      approved: { label: "Approved", variant: "default" as const },
      payment_requested: { label: "Payment Required", variant: "destructive" as const },
      delivered: { label: "Delivered", variant: "default" as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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

  if (!hasOrders) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Status</h1>
          <p className="text-muted-foreground">Track your orders and manage deliveries</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet. Start by browsing our suppliers.
            </p>
            <Button asChild>
              <a href="/dashboard/owner/suppliers">Browse Suppliers</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Status</h1>
        <p className="text-muted-foreground">Track your orders and manage deliveries</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const statusConfig = getStatusBadge(order.status);
          
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.order_number || order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.supplier?.business_name || order.supplierName}</p>
                  </div>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
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

                {/* Status-specific content */}
                {order.status === "pending" && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <Package className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Waiting for supplier approval
                    </span>
                  </div>
                )}

                {order.status === "approved" && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Order approved by supplier
                    </span>
                  </div>
                )}

                {order.status === "payment_requested" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <CreditCard className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">
                        Payment required to proceed
                      </span>
                    </div>
                    <PaymentCodeDialog 
                      orderId={order.id}
                      onSubmit={(code) => handlePaymentCodeSubmit(order.id, code)}
                    >
                      <Button size="sm">Submit Payment Code</Button>
                    </PaymentCodeDialog>
                  </div>
                )}

                {order.status === "delivered" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Order delivered successfully
                      </span>
                    </div>
                    {!order.feedback ? (
                      <RatingFeedbackDialog
                        orderId={order.id}
                        supplierName={order.supplierName}
                        onSubmit={(rating, feedback) => handleRatingSubmit(order.id, rating, feedback)}
                      >
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4 mr-1" />
                          Rate & Review
                        </Button>
                      </RatingFeedbackDialog>
                    ) : (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (order.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">Your Rating</span>
                        </div>
                        {order.feedback && (
                          <p className="text-sm text-muted-foreground">"{order.feedback}"</p>
                        )}
                      </div>
                    )}
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