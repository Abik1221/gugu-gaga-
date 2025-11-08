"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, Users, DollarSign, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react";
import { OwnerAnalyticsAPI, OwnerAnalyticsResponse, AuthAPI } from "@/utils/api";
import { useToast } from "@/components/ui/toast";

export default function OwnerAnalyticsPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState("revenue");
  const [data, setData] = useState<OwnerAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const me = await AuthAPI.me();
      const tid = me?.tenant_id;
      if (!tid) {
        show({ variant: "destructive", title: "Error", description: "No tenant context found" });
        return;
      }
      setTenantId(tid);
      
      const analytics = await OwnerAnalyticsAPI.overview(tid, { days: 30 });
      setData(analytics);
    } catch (error: any) {
      show({ variant: "destructive", title: "Error", description: error.message || "Failed to load analytics" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Create empty data structure if no data
  const displayData = data || {
    summary: {
      total_revenue: 0,
      total_orders: 0,
      unique_customers: 0,
      avg_order_value: 0,
      low_stock_items: 0
    },
    revenue_trends: [],
    inventory_health: [],
    supplier_performance: [],
    staff_performance: []
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          All Systems Healthy
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100">
          <TabsTrigger value="revenue" className="cursor-pointer text-sm font-medium text-gray-700 data-[state=active]:text-white data-[state=active]:bg-emerald-600">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="inventory" className="cursor-pointer text-sm font-medium text-gray-700 data-[state=active]:text-white data-[state=active]:bg-emerald-600">Inventory Health</TabsTrigger>
          <TabsTrigger value="suppliers" className="cursor-pointer text-sm font-medium text-gray-700 data-[state=active]:text-white data-[state=active]:bg-emerald-600">Supplier Performance</TabsTrigger>
          <TabsTrigger value="staff" className="cursor-pointer text-sm font-medium text-gray-700 data-[state=active]:text-white data-[state=active]:bg-emerald-600">Staff Productivity</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${displayData.summary.total_revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  Last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayData.summary.total_orders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {displayData.summary.unique_customers} unique customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${displayData.summary.avg_order_value.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {displayData.summary.low_stock_items > 0 ? (
                    <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  )}
                  {displayData.summary.low_stock_items} low stock items
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Monthly revenue performance showing consistent growth with seasonal variations
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.revenue_trends.length > 0 ? (
                  <AreaChart data={displayData.revenue_trends.slice(0, 15).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <TrendingUp className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Revenue Journey Awaits</h3>
                    <p className="text-sm text-center max-w-xs">Your revenue story is about to begin. Start making sales to see beautiful trends unfold here.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Chart Insights:</strong> Area chart shows revenue trends over time. 
                  The flowing curve reveals your business growth patterns and seasonal variations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Health Dashboard</CardTitle>
              <p className="text-sm text-gray-600">
                Real-time inventory status across all product categories with reorder alerts
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.inventory_health.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={displayData.inventory_health.map(item => ({name: item.category, value: item.current_stock}))}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {displayData.inventory_health.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Package className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Inventory Awaiting Stock</h3>
                    <p className="text-sm text-center max-w-xs">Your warehouse is ready! Add products to see a colorful breakdown of your inventory categories.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Inventory Distribution:</strong> Pie chart shows current stock levels across all product categories. 
                  Each colorful slice represents the proportion of inventory in each category.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Supplier Performance</CardTitle>
              <p className="text-sm text-gray-600">
                Performance analysis of suppliers you've ordered from - track delivery reliability and quality for your business
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.supplier_performance.length > 0 ? (
                  <BarChart data={displayData.supplier_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'on_time_rate' ? `${value}%` : `${value}/5 ⭐`, 
                      name === 'on_time_rate' ? 'On-Time Rate' : 'Quality Rating'
                    ]} />
                    <Legend />
                    <Bar dataKey="on_time_rate" fill="#10b981" name="On-Time Delivery %" />
                    <Bar dataKey="avg_rating" fill="#8b5cf6" name="Quality Rating (out of 5)" />
                  </BarChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Start Ordering from Suppliers</h3>
                    <p className="text-sm text-center max-w-xs">Place orders with suppliers to track their performance and build your preferred supplier network.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Your Supplier Insights:</strong> This shows performance of suppliers you've actually ordered from. 
                  Green bars = delivery reliability for YOUR orders. Purple bars = quality ratings from YOUR received orders.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Use This Data To:</strong> Decide which suppliers to reorder from, negotiate better terms with top performers, or find alternatives for underperforming suppliers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Productivity Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Individual performance metrics including sales volume, transaction efficiency, and productivity scores
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.staff_performance.length > 0 ? (
                  <LineChart data={displayData.staff_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [name === 'efficiency' ? `${value}%` : `$${value.toLocaleString()}`, name]} />
                    <Legend />
                    <Line type="monotone" dataKey="total_sales" stroke="#06b6d4" strokeWidth={3} name="Total Sales ($)" />
                    <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} name="Efficiency %" />
                  </LineChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Users className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Team Performance Tracking</h3>
                    <p className="text-sm text-center max-w-xs">Add team members to track their sales performance and efficiency metrics over time.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Staff Performance Trends:</strong> Line chart tracks sales performance and efficiency over time. 
                  Blue line shows sales volume, orange line shows efficiency percentage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}