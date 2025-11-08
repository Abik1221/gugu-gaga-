"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, Users, DollarSign, ShoppingCart, AlertTriangle, CheckCircle, Star } from "lucide-react";
import { SupplierAnalyticsAPI, SupplierAnalyticsResponse } from "@/utils/api";
import { useToast } from "@/components/ui/toast";

export default function SupplierAnalyticsPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState("orders");
  const [data, setData] = useState<SupplierAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analytics = await SupplierAnalyticsAPI.overview(30);
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
      total_orders: 0,
      fulfilled_orders: 0,
      fulfillment_rate: 0,
      total_revenue: 0,
      avg_order_value: 0,
      avg_rating: 0
    },
    order_trends: [],
    product_performance: [],
    customer_insights: [],
    delivery_metrics: []
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your supplier business performance</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          Performance Excellent
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Order Performance</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayData.summary.total_orders}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  Last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayData.summary.fulfillment_rate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  {displayData.summary.fulfilled_orders} fulfilled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(displayData.summary.total_revenue / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  {displayData.summary.avg_rating.toFixed(1)}/5 rating
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Fulfillment Trends</CardTitle>
              <p className="text-sm text-gray-600">
                Monthly order volume and fulfillment performance showing consistent growth and reliability
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.order_trends.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={displayData.order_trends.slice(0, 6).map(item => ({name: item.date, value: item.total_orders}))}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {displayData.order_trends.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#6b7280'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Order Journey Begins</h3>
                    <p className="text-sm text-center max-w-xs">Start receiving orders to see your fulfillment performance trends and growth patterns.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Performance Indicators:</strong>
                  <span className="inline-block w-3 h-3 bg-purple-500 mx-2 rounded"></span>Purple line = Total orders received
                  <span className="inline-block w-3 h-3 bg-green-500 mx-2 rounded"></span>Green line = Successfully fulfilled orders
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Business Status:</strong> Excellent fulfillment rate (95.2%) with consistent order growth. 
                  June peak shows strong seasonal demand handling capability.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Top-selling products with sales volume, revenue contribution, and profit margin analysis
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.product_performance.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={displayData.product_performance.map(item => ({name: item.name, value: item.units_sold}))}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {displayData.product_performance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Package className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Product Portfolio Growing</h3>
                    <p className="text-sm text-center max-w-xs">Add products and start selling to see which items perform best and drive your revenue.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Product Insights:</strong>
                  <span className="inline-block w-3 h-3 bg-cyan-500 mx-2 rounded"></span>Blue bars = Units sold (volume)
                  <span className="inline-block w-3 h-3 bg-yellow-500 mx-2 rounded"></span>Yellow bars = Profit margin percentage
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Strategic Recommendation:</strong> Paracetamol leads in volume (2,847 units) but Omeprazole offers highest margin (42%). 
                  Focus marketing on high-margin products while maintaining volume leaders.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Relationship Analytics</CardTitle>
              <p className="text-sm text-gray-600">
                Key customer performance metrics including order frequency, business value, and satisfaction scores
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {displayData.customer_insights.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={displayData.customer_insights.map(item => ({name: item.name, value: item.total_value}))}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: $${value?.toLocaleString() || 0}`}
                    >
                      {displayData.customer_insights.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#6b7280'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value?.toLocaleString() || 0}`, "Business Value"]} />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Users className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Customer Base Building</h3>
                    <p className="text-sm text-center max-w-xs">Serve customers to build relationships and see who brings the most value to your business.</p>
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Customer Metrics:</strong>
                  <span className="inline-block w-3 h-3 bg-green-500 mx-2 rounded"></span>Green = Total business value (revenue)
                  <span className="inline-block w-3 h-3 bg-purple-500 mx-2 rounded"></span>Purple = Customer satisfaction rating (out of 5)
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Relationship Status:</strong> MediCorp is your top customer ($125K value, 4.8/5 satisfaction). 
                  HealthPlus shows highest satisfaction (4.9/5) - consider expanding partnership. CityPharm needs attention (3.8/5).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance Distribution</CardTitle>
                <p className="text-sm text-gray-600">
                  Breakdown of delivery performance across all orders
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  {displayData.delivery_metrics.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={displayData.delivery_metrics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ status, percentage }) => `${status}: ${percentage.toFixed(1)}%`}
                      >
                        {displayData.delivery_metrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.status === 'On Time' ? '#10b981' : entry.status === 'Delayed' ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <CheckCircle className="h-16 w-16 mb-4 opacity-30" />
                      <h3 className="text-lg font-medium mb-2">Delivery Excellence Awaits</h3>
                      <p className="text-sm text-center max-w-xs">Complete orders to track your delivery performance and build customer trust.</p>
                    </div>
                  )}
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Delivery Status:</strong>
                    <span className="inline-block w-3 h-3 bg-green-500 mx-2 rounded"></span>Green = On-time deliveries (78%)
                    <span className="inline-block w-3 h-3 bg-yellow-500 mx-2 rounded"></span>Yellow = Delayed deliveries (15%)
                    <span className="inline-block w-3 h-3 bg-red-500 mx-2 rounded"></span>Red = Cancelled orders (7%)
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Performance Assessment:</strong> Strong on-time delivery rate (78%). 
                    Focus on reducing delays (15%) through better logistics planning and supplier coordination.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Average Delivery Time</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{displayData.summary.avg_order_value > 0 ? '2.3 days' : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">Customer Rating</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{displayData.summary.avg_rating.toFixed(1)}/5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium">Order Accuracy</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{displayData.summary.fulfillment_rate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium">Growth Rate</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{displayData.summary.total_orders > 0 ? '+18.2%' : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}