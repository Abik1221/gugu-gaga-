"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthAPI } from "@/utils/api";

interface CartItem {
  medicine_id: number;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function StaffPOS() {
  const { show } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await AuthAPI.me();
        setUser(me);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    })();
  }, []);

  const addToCart = () => {
    if (!searchQuery.trim() || !unitPrice || quantity <= 0) {
      show({
        variant: "destructive",
        title: "Invalid input",
        description: "Please fill all fields correctly",
      });
      return;
    }

    const price = parseFloat(unitPrice);
    if (isNaN(price) || price <= 0) {
      show({
        variant: "destructive",
        title: "Invalid price",
        description: "Please enter a valid price",
      });
      return;
    }

    const newItem: CartItem = {
      medicine_id: Date.now(), // Temporary ID
      name: searchQuery,
      sku: searchQuery,
      quantity,
      unit_price: price,
      total: quantity * price,
    };

    setCart([...cart, newItem]);
    setSearchQuery("");
    setQuantity(1);
    setUnitPrice("");
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    const updatedCart = cart.map((item, i) =>
      i === index
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unit_price }
        : item
    );
    setCart(updatedCart);
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      show({
        variant: "destructive",
        title: "Empty cart",
        description: "Add items to cart before processing sale",
      });
      return;
    }

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      show({
        variant: "success",
        title: "Sale completed",
        description: `Transaction processed successfully. Total: $${getTotalAmount().toFixed(2)}`,
      });

      setCart([]);
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Sale failed",
        description: err?.message || "Failed to process sale",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Point of Sale</h2>
        <p className="text-gray-600">Process customer transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Search & Add */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Items</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name/SKU
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine by name or SKU"
                className="text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  className="text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="0.00"
                  className="text-black"
                />
              </div>
            </div>

            <Button
              onClick={addToCart}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Cart ({cart.length} items)
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z" />
              </svg>
              Cart is empty
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.unit_price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <span className="w-16 text-right font-medium">
                      ${item.total.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={processSale}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                {processing ? "Processing..." : "Complete Sale"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}