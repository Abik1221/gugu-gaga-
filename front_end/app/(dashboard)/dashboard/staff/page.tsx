"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Receipt, Package, TrendingUp } from "lucide-react";

export default function StaffDashboard() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to Staff Portal
        </h2>
        <p className="text-gray-600">
          Manage sales transactions and view inventory
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Point of Sale</h3>
              <p className="text-sm text-gray-600">Process transactions</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard/staff/pos")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Open POS
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Sales History</h3>
              <p className="text-sm text-gray-600">View transactions</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard/staff/sales")}
            variant="outline"
            className="w-full"
          >
            View Sales
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Inventory</h3>
              <p className="text-sm text-gray-600">Check stock levels</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard/staff/inventory")}
            variant="outline"
            className="w-full"
          >
            View Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sales Count</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={() => router.push("/dashboard/staff/pos")}
              variant="outline"
              className="w-full justify-start"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Sale
            </Button>
            <Button
              onClick={() => router.push("/dashboard/staff/inventory")}
              variant="outline"
              className="w-full justify-start"
            >
              <Package className="w-4 h-4 mr-2" />
              Check Stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
