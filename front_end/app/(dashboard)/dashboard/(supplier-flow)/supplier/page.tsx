"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { RoleSpecificGuard } from "@/components/auth/role-specific-guard";
import { SupplierAnalyticsAPI } from "@/utils/api";
import { Package, DollarSign, ShoppingCart, AlertTriangle, TrendingUp, Users, Truck, Target, MessageSquare, Calendar, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SupplierDashboardData {
  total_products: number;
  total_orders: number;
  monthly_revenue: number;
  pending_shipments: number;
  customer_satisfaction: number;
  order_fulfillment_rate: number;
  inventory_turnover: number;
  active_customers: number;
  overdue_invoices: number;
  performance_score: number;
}

export default function SupplierDashboard() {
  return (
    <RoleSpecificGuard allowedRoles={["supplier"]}>
      <SupplierDashboardContent />
    </RoleSpecificGuard>
  );
}

function SupplierDashboardContent() {
  const { show } = useToast();
  const [data, setData] = useState<SupplierDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await SupplierAnalyticsAPI.overview();
      setData({
        total_products: response.summary?.total_products || 0,
        total_orders: response.summary?.total_orders || 0,
        monthly_revenue: response.summary?.total_revenue || 0,
        pending_shipments: response.delivery_metrics?.find(m => m.status === 'pending')?.count || 0,
        customer_satisfaction: response.summary?.avg_rating * 20 || 0,
        order_fulfillment_rate: response.summary?.fulfillment_rate || 0,
        inventory_turnover: 0,
        active_customers: response.customer_insights?.length || 0,
        overdue_invoices: 0,
        performance_score: response.summary?.avg_rating * 20 || 0
      });
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to load dashboard",
        description: err?.message || "Unable to fetch dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Supplier Dashboard</h2>
        <p className="text-gray-600">Comprehensive business overview and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_products || 0}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_orders || 0}</div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.monthly_revenue?.toLocaleString() || "0"}</div>
            <p className="text-xs text-green-600">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data?.pending_shipments || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting dispatch</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data?.customer_satisfaction || 0}%</div>
            <Progress value={data?.customer_satisfaction || 0} className="mb-2" />
            <p className="text-xs text-muted-foreground">Based on customer feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Order Fulfillment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data?.order_fulfillment_rate || 0}%</div>
            <Progress value={data?.order_fulfillment_rate || 0} className="mb-2" />
            <p className="text-xs text-muted-foreground">On-time delivery rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data?.performance_score || 0}%</div>
            <Progress value={data?.performance_score || 0} className="mb-2" />
            <p className="text-xs text-muted-foreground">Overall supplier rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <a href="/dashboard/supplier/products">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/dashboard/supplier/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Process Orders
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/dashboard/supplier/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/dashboard/supplier/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Customers</span>
                <span className="font-medium">{data?.active_customers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inventory Turnover</span>
                <span className="font-medium">{data?.inventory_turnover || 0}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue Invoices</span>
                <span className="font-medium text-red-600">{data?.overdue_invoices || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="font-medium">${data?.monthly_revenue && data?.total_orders ? Math.round(data.monthly_revenue / data.total_orders).toLocaleString() : '0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.total_orders ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Orders processed</p>
                      <p className="text-xs text-gray-500">{data.total_orders} total orders</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Revenue generated</p>
                      <p className="text-xs text-gray-500">${data.monthly_revenue?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Products available</p>
                      <p className="text-xs text-gray-500">{data.total_products} products</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Active customers</p>
                      <p className="text-xs text-gray-500">{data.active_customers} customers</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}