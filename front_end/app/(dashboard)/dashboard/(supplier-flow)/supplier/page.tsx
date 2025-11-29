"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Package, DollarSign, ShoppingCart, TrendingUp, Users, Truck, Star, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

interface SupplierDashboardData {
  total_products: number;
  total_orders: number;
  monthly_revenue: number;
  pending_shipments: number;
  customer_satisfaction: number;
  order_fulfillment_rate: number;
  performance_score?: number;
}

export default function SupplierDashboard() {
  const { show } = useToast();
  const { t } = useLanguage();
  const suppT = t.supplierDashboard.dashboard;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupplierDashboardData | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          total_products: 245,
          total_orders: 1847,
          monthly_revenue: 125750.50,
          pending_shipments: 23,
          customer_satisfaction: 94.5,
          order_fulfillment_rate: 98.2,
          performance_score: 92,
        });
      } catch (error: any) {
        show({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load dashboard statistics',
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [show]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: suppT.totalProducts,
      value: stats?.total_products ?? 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: suppT.totalOrders,
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: suppT.monthlyRevenue,
      value: `ETB ${stats?.monthly_revenue?.toLocaleString() ?? '0'}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: suppT.pendingShipments,
      value: stats?.pending_shipments ?? 0,
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const performanceCards = [
    {
      title: suppT.customerSatisfaction,
      value: `${stats?.customer_satisfaction ?? 0}%`,
      icon: Star,
      color: 'text-yellow-600',
    },
    {
      title: suppT.orderFulfillmentRate,
      value: `${stats?.order_fulfillment_rate ?? 0}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: suppT.performanceScore,
      value: `${stats?.performance_score ?? 0}%`,
      icon: BarChart3,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{suppT.title}</h2>
        <p className="text-gray-600">{suppT.subtitle}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {performanceCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{suppT.businessInsights}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{suppT.activeCustomers}</span>
              </div>
              <p className="text-2xl font-bold">248</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{suppT.inventoryTurnover}</span>
              </div>
              <p className="text-2xl font-bold">4.2x</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">{suppT.overdueInvoices}</span>
              </div>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{suppT.quickActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/supplier/products">
              <Button className="w-full" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                {suppT.manageProducts}
              </Button>
            </Link>
            <Link href="/dashboard/supplier/orders">
              <Button className="w-full" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {suppT.processOrders}
              </Button>
            </Link>
            <Button className="w-full" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              {suppT.viewAnalytics}
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              {suppT.aiAssistant}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{suppT.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}