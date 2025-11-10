"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Truck, 
  Eye,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { getAuthJSON, putAuthJSON } from "@/utils/api";
import { toast } from "sonner";

function getTenantId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tenant_id");
}

interface Order {
  id: number;
  order_number: string;
  supplier_name: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: "pending" | "approved" | "payment_required" | "paid" | "shipped" | "delivered" | "cancelled";
  order_date: string;
  delivery_address: string;
  payment_method: string;
  transaction_code?: string;
  supplier_notes?: string;
  estimated_delivery?: string;
}

interface Notification {
  id: number;
  order_id: number;
  type: "order_approved" | "payment_required" | "payment_confirmed" | "shipped" | "delivered";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function OrdersPage() {
  const { show } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionCode, setTransactionCode] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      
      const ordersData = await getAuthJSON("/api/v1/orders", tenantId);
      setOrders(ordersData || []);
      
      // Load notifications (mock for now)
      const mockNotifications: Notification[] = [
        {
          id: 1,
          order_id: 1,
          type: "payment_required",
          title: "Payment Required",
          message: "Your order has been approved. Please proceed with payment.",
          timestamp: new Date().toISOString(),
          read: false
        }
      ];
      setNotifications(mockNotifications);
      
      // Fallback to mock data if API returns empty
      if (!ordersData || ordersData.length === 0) {
        const mockOrders: Order[] = [
          {
            id: 1,
            order_number: "ORD-2024-001",
            supplier_name: "MediSupply Global",
            product_name: "Paracetamol 500mg",
            product_image: "/api/placeholder/100/100",
            quantity: 500,
            unit_price: 0.25,
            total_amount: 125.00,
            status: "payment_required",
            order_date: "2024-01-15",
            delivery_address: "123 Main St, City, State",
            payment_method: "bank_transfer",
            supplier_notes: "Order approved. Please proceed with payment to complete the order.",
            estimated_delivery: "2024-01-25"
          },
          {
            id: 2,
            order_number: "ORD-2024-002",
            supplier_name: "PharmaCore Solutions",
            product_name: "Ibuprofen 200mg",
            product_image: "/api/placeholder/100/100",
            quantity: 300,
            unit_price: 0.18,
            total_amount: 54.00,
            status: "shipped",
            order_date: "2024-01-12",
            delivery_address: "456 Oak Ave, City, State",
            payment_method: "credit_card",
            transaction_code: "TXN123456789",
            estimated_delivery: "2024-01-20"
          }
        ];
        setOrders(mockOrders);
      }
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to load orders",
        description: err?.message || "Unable to fetch orders data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId: number) => {
    if (!transactionCode.trim()) {
      show({
        variant: "destructive",
        title: "Transaction code required",
        description: "Please enter your transaction code",
      });
      return;
    }

    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      
      await putAuthJSON(`/api/v1/orders/${orderId}/payment-code`, 
        { code: transactionCode }, 
        tenantId
      );
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: "paid", transaction_code: transactionCode }
          : order
      ));

      show({
        title: "Payment submitted successfully!",
        description: "Your payment has been submitted for verification.",
      });

      setTransactionCode("");
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to submit payment",
        description: err?.message || "Unable to submit payment",
      });
    }
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "payment_required": return "bg-orange-100 text-orange-800";
      case "paid": return "bg-green-100 text-green-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "payment_required": return <CreditCard className="w-4 h-4" />;
      case "paid": return <DollarSign className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <Package className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Orders & Notifications</h2>
        <p className="text-gray-600">Track your orders and manage notifications</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={order.product_image} 
                          alt={order.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA0MEw2MCA1MEg0MEw1MCA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{order.order_number}</h3>
                        <p className="text-sm text-gray-600">{order.supplier_name}</p>
                        <p className="text-sm text-gray-800">{order.product_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace("_", " ")}
                        </span>
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{order.order_date}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium text-black">{order.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unit Price</p>
                      <p className="font-medium text-black">${order.unit_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-green-600">${order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-black">{order.payment_method.replace("_", " ")}</p>
                    </div>
                  </div>

                  {order.supplier_notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Supplier Note:</strong> {order.supplier_notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-black">Order Details - {order.order_number}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-black">Supplier</Label>
                              <p className="text-black">{order.supplier_name}</p>
                            </div>
                            <div>
                              <Label className="text-black">Order Date</Label>
                              <p className="text-black">{order.order_date}</p>
                            </div>
                            <div>
                              <Label className="text-black">Delivery Address</Label>
                              <p className="text-black">{order.delivery_address}</p>
                            </div>
                            <div>
                              <Label className="text-black">Estimated Delivery</Label>
                              <p className="text-black">{order.estimated_delivery || "TBD"}</p>
                            </div>
                          </div>
                          {order.transaction_code && (
                            <div>
                              <Label className="text-black">Transaction Code</Label>
                              <p className="text-black font-mono">{order.transaction_code}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {order.status === "payment_required" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Submit Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-black">Submit Payment - {order.order_number}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-2xl font-bold text-green-600">${order.total_amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <Label className="text-black">Transaction Code *</Label>
                              <Input
                                placeholder="Enter your transaction/reference code"
                                value={transactionCode}
                                onChange={(e) => setTransactionCode(e.target.value)}
                                className="text-black"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Enter the transaction code from your payment confirmation
                              </p>
                            </div>
                            <Button 
                              onClick={() => handlePayment(order.id)}
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={!transactionCode.trim()}
                            >
                              Submit Payment Confirmation
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all ${!notification.read ? 'border-blue-200 bg-blue-50' : 'hover:shadow-md'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-black">{notification.title}</h4>
                        {!notification.read && (
                          <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      {notification.type === "payment_required" && <CreditCard className="w-5 h-5 text-orange-500" />}
                      {notification.type === "order_approved" && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {notification.type === "shipped" && <Truck className="w-5 h-5 text-purple-500" />}
                      {notification.type === "delivered" && <Package className="w-5 h-5 text-emerald-500" />}
                    </div>
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