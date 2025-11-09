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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Phone, Mail, ShoppingCart, Package, Clock, Award, Filter } from "lucide-react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";

function getTenantId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tenant_id");
}

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  products_count: number;
  delivery_time: string;
  min_order: number;
  verified: boolean;
  logo?: string;
  description: string;
  certifications: string[];
  upfront_payment_percent?: number;
  after_delivery_percent?: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  min_quantity: number;
  availability: "in_stock" | "low_stock" | "out_of_stock";
  supplier_id: number;
  image?: string;
  description: string;
  brand: string;
  sku: string;
  stock_quantity: number;
  upfront_percent?: number;
  after_delivery_percent?: number;
}

export default function SuppliersMarketplace() {
  const { show } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedInventoryType, setSelectedInventoryType] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [orderItems, setOrderItems] = useState<{[key: number]: number}>({});
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState({
    delivery_address: "",
    city: "",
    postal_code: "",
    phone: "",
    notes: "",
    delivery_date: "",
    payment_method: "bank_transfer"
  });

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      
      const [suppliersData, allProducts] = await Promise.all([
        getAuthJSON("/api/v1/suppliers/browse", tenantId),
        Promise.all(
          // We'll get products for each supplier
          [1, 2, 3].map(async (supplierId) => {
            try {
              return await getAuthJSON(`/api/v1/suppliers/${supplierId}/products`, tenantId);
            } catch {
              return [];
            }
          })
        )
      ]);
      
      // Flatten products array
      const allProductsFlat = allProducts.flat();
      
      setSuppliers(suppliersData || []);
      setProducts(allProductsFlat || []);
      
      // Fallback to mock data if API returns empty
      if (!suppliersData || suppliersData.length === 0) {
        const mockSuppliers: Supplier[] = [
        {
          id: 1,
          name: "MediSupply Global",
          email: "orders@medisupply.com",
          phone: "+1-555-0123",
          location: "New York, USA",
          rating: 4.8,
          reviews: 247,
          specialties: ["Pharmaceuticals", "Medical Devices", "Vaccines"],
          products_count: 1250,
          delivery_time: "2-3 days",
          min_order: 500,
          verified: true,
          description: "Leading pharmaceutical supplier with 20+ years experience. ISO certified with global distribution network.",
          certifications: ["ISO 9001", "FDA Approved", "WHO GMP"],
          upfront_payment_percent: 50,
          after_delivery_percent: 50
        },
        {
          id: 2,
          name: "PharmaCore Solutions",
          email: "sales@pharmacore.com",
          phone: "+1-555-0456",
          location: "California, USA",
          rating: 4.6,
          reviews: 189,
          specialties: ["Generic Medicines", "OTC Products", "Supplements"],
          products_count: 890,
          delivery_time: "1-2 days",
          min_order: 300,
          verified: true,
          description: "Specialized in generic pharmaceuticals and over-the-counter medications. Fast delivery and competitive pricing.",
          certifications: ["FDA Approved", "cGMP Certified"],
          upfront_payment_percent: 30,
          after_delivery_percent: 70
        },
        {
          id: 3,
          name: "BioMed Distributors",
          email: "info@biomed.com",
          phone: "+1-555-0789",
          location: "Texas, USA",
          rating: 4.7,
          reviews: 156,
          specialties: ["Biologics", "Specialty Drugs", "Cold Chain"],
          products_count: 650,
          delivery_time: "3-5 days",
          min_order: 1000,
          verified: true,
          description: "Specialized in temperature-sensitive biologics and specialty pharmaceuticals. Advanced cold chain logistics.",
          certifications: ["ISO 15378", "GDP Certified", "IATA Certified"],
          upfront_payment_percent: 60,
          after_delivery_percent: 40
        }
      ];

      const mockProducts: Product[] = [
        { 
          id: 1, 
          name: "Paracetamol 500mg", 
          category: "Pain Relief", 
          price: 0.25, 
          unit: "tablet", 
          min_quantity: 100, 
          availability: "in_stock", 
          supplier_id: 1,
          image: "/api/placeholder/150/150",
          description: "Fast-acting pain relief tablets for headaches, fever, and minor aches",
          brand: "MediCore",
          sku: "MC-PAR-500",
          stock_quantity: 5000,
          upfront_percent: 40,
          after_delivery_percent: 60
        },
        { 
          id: 2, 
          name: "Ibuprofen 200mg", 
          category: "Anti-inflammatory", 
          price: 0.18, 
          unit: "tablet", 
          min_quantity: 100, 
          availability: "in_stock", 
          supplier_id: 1,
          image: "/api/placeholder/150/150",
          description: "Non-steroidal anti-inflammatory drug for pain and inflammation",
          brand: "PharmaTech",
          sku: "PT-IBU-200",
          stock_quantity: 3200,
          upfront_percent: 50,
          after_delivery_percent: 50
        },
        { 
          id: 3, 
          name: "Amoxicillin 250mg", 
          category: "Antibiotics", 
          price: 0.45, 
          unit: "capsule", 
          min_quantity: 50, 
          availability: "low_stock", 
          supplier_id: 2,
          image: "/api/placeholder/150/150",
          description: "Broad-spectrum antibiotic for bacterial infections",
          brand: "BioMed",
          sku: "BM-AMX-250",
          stock_quantity: 150,
          upfront_percent: 30,
          after_delivery_percent: 70
        },
        { 
          id: 4, 
          name: "Omeprazole 20mg", 
          category: "Gastric", 
          price: 0.35, 
          unit: "capsule", 
          min_quantity: 50, 
          availability: "in_stock", 
          supplier_id: 2,
          image: "/api/placeholder/150/150",
          description: "Proton pump inhibitor for acid reflux and gastric ulcers",
          brand: "GastroMed",
          sku: "GM-OME-20",
          stock_quantity: 800,
          upfront_percent: 25,
          after_delivery_percent: 75
        },
        { 
          id: 5, 
          name: "Insulin Glargine", 
          category: "Diabetes", 
          price: 25.50, 
          unit: "vial", 
          min_quantity: 10, 
          availability: "in_stock", 
          supplier_id: 3,
          image: "/api/placeholder/150/150",
          description: "Long-acting insulin for diabetes management",
          brand: "DiabetCare",
          sku: "DC-INS-GLR",
          stock_quantity: 200,
          upfront_percent: 60,
          after_delivery_percent: 40
        },
      ];
      
        setSuppliers(mockSuppliers);
        setProducts(mockProducts);
      }
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to load suppliers",
        description: err?.message || "Unable to fetch suppliers data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !selectedSupplier) return;
    
    try {
      const tenantId = getTenantId();
      if (!tenantId) {
        throw new Error("No tenant ID found");
      }
      
      const orderData = {
        supplier_id: selectedSupplier.id,
        items: [{
          product_id: selectedProduct.id,
          quantity: productQuantity,
          unit_price: selectedProduct.price
        }],
        delivery_address: orderForm.delivery_address,
        city: orderForm.city,
        phone: orderForm.phone,
        payment_method: orderForm.payment_method,
        notes: orderForm.notes || null
      };
      
      await postAuthJSON("/api/v1/orders", orderData, tenantId);
      
      const totalAmount = selectedProduct.price * productQuantity;

      show({
        title: "Order placed successfully!",
        description: `Order for ${productQuantity}x ${selectedProduct.name} ($${totalAmount.toFixed(2)}) has been sent to ${selectedSupplier.name}`,
      });

      setSelectedProduct(null);
      setSelectedSupplier(null);
      setProductQuantity(1);
      setOrderForm({
        delivery_address: "",
        city: "",
        postal_code: "",
        phone: "",
        notes: "",
        delivery_date: "",
        payment_method: "bank_transfer"
      });
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to place order",
        description: err?.message || "Unable to place order",
      });
    }
  };



  const getSupplierProducts = (supplierId: number) => {
    return products.filter(p => p.supplier_id === supplierId);
  };

  const getFilteredSupplierProducts = (supplierId: number) => {
    const supplierProducts = products.filter(p => p.supplier_id === supplierId);
    if (!productSearchQuery) return supplierProducts;
    
    return supplierProducts.filter(product =>
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearchQuery.toLowerCase())
    );
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    loadSuppliers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Supplier Marketplace</h2>
        <p className="text-gray-600">Find and order from verified pharmaceutical suppliers</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search suppliers by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-black"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="h-5 w-5 text-gray-400 mt-2" />
                <span className="text-sm text-gray-600 mt-2">Filters:</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Product Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                  <SelectItem value="medical_devices">Medical Devices</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="vaccines">Vaccines</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedInventoryType} onValueChange={setSelectedInventoryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Business Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Business Types</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="retail_shop">Retail Shop</SelectItem>
                  <SelectItem value="shoes_store">Shoes Store</SelectItem>
                  <SelectItem value="clothing_store">Clothing Store</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="grocery">Grocery Store</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="beauty_salon">Beauty Salon</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="hardware">Hardware Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(selectedCategory !== "all" || selectedLocation !== "all" || selectedInventoryType !== "all") && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedCategory}
                  </Badge>
                )}
                {selectedLocation !== "all" && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {selectedLocation}
                  </Badge>
                )}
                {selectedInventoryType !== "all" && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {selectedInventoryType.replace("_", " ")}
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                    setSelectedInventoryType("all");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {supplier.name}
                    {supplier.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                    <span className="text-sm text-gray-500">({supplier.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{supplier.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span>{supplier.products_count} products</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{supplier.delivery_time} delivery</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.certifications.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setProductSearchQuery("");
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Order Products
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden bg-white">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-black text-xl">{supplier.name} - Product Catalog</DialogTitle>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mt-2">
                        <span>Min Order: <strong className="text-black">${supplier.min_order}</strong></span>
                        <span>Delivery: <strong className="text-black">{supplier.delivery_time}</strong></span>
                        <span>Contact: <strong className="text-black">{supplier.email}</strong></span>
                      </div>
                      {supplier.upfront_payment_percent !== undefined && supplier.after_delivery_percent !== undefined && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-1">Payment Terms:</p>
                          <div className="flex gap-4 text-sm text-blue-800">
                            <span>Upfront: <strong>{supplier.upfront_payment_percent}%</strong></span>
                            <span>After Delivery: <strong>{supplier.after_delivery_percent}%</strong></span>
                          </div>
                        </div>
                      )}
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Search */}
                      <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search products..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          className="pl-10 text-black"
                        />
                      </div>

                      {/* Products List */}
                      <div className="overflow-y-auto max-h-[60vh]">
                        <div className="space-y-3">
                          {getFilteredSupplierProducts(supplier.id).map((product) => (
                            <Card key={product.id} className="w-full hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA2MEw5MCA3NUg2MEw3NSA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                      }}
                                    />
                                  </div>
                                  
                                  <div className="flex-1 flex justify-between items-center">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-3">
                                        <h5 className="font-semibold text-black text-lg">{product.name}</h5>
                                        <Badge 
                                          variant={product.availability === "in_stock" ? "secondary" : "destructive"}
                                          className={`text-xs ${product.availability === "in_stock" ? "bg-green-100 text-green-800" : ""}`}
                                        >
                                          {product.availability === "in_stock" ? "In Stock" : product.availability.replace("_", " ")}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                                      <p className="text-sm text-gray-700">{product.description}</p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>Stock: {product.stock_quantity}</span>
                                        <span>Min Order: {product.min_quantity}</span>
                                      </div>
                                      {product.upfront_percent !== undefined && product.after_delivery_percent !== undefined && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                          <p className="text-xs font-medium text-blue-900 mb-1">Payment Terms:</p>
                                          <div className="flex gap-3 text-xs text-blue-800">
                                            <span>Upfront: <strong>{product.upfront_percent}%</strong></span>
                                            <span>After Delivery: <strong>{product.after_delivery_percent}%</strong></span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="text-right space-y-2">
                                      <div>
                                        <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">per {product.unit}</p>
                                      </div>
                                      <Button 
                                        className="bg-emerald-600 hover:bg-emerald-700 px-6"
                                        onClick={() => setSelectedProduct(product)}
                                        disabled={product.availability === "out_of_stock"}
                                      >
                                        Order This
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {getFilteredSupplierProducts(supplier.id).length === 0 && (
                        <div className="text-center py-16">
                          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                          <p className="text-gray-500 mb-4">Try adjusting your search terms or browse all products</p>
                          {productSearchQuery && (
                            <Button 
                              variant="outline" 
                              onClick={() => setProductSearchQuery("")}
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Individual Product Order Dialog */}
                <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden bg-white">
                    {selectedProduct && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-black text-lg">Place Order</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
                          {/* Product Summary */}
                          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={selectedProduct.image} 
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA2MEw5MCA3NUg2MEw3NSA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-black">{selectedProduct.name}</h3>
                              <p className="text-sm text-gray-600">{selectedProduct.brand}</p>
                              <p className="text-lg font-bold text-green-600">${selectedProduct.price.toFixed(2)} per {selectedProduct.unit}</p>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div>
                            <Label className="text-black font-medium">Quantity</Label>
                            <div className="flex items-center gap-3 mt-2">
                              <Input
                                type="number"
                                min="1"
                                value={productQuantity || ""}
                                onChange={(e) => setProductQuantity(Math.max(1, Number(e.target.value) || 1))}
                                className="w-24 text-black"
                              />
                              <span className="text-sm text-gray-600">units</span>
                            </div>
                          </div>

                          {/* Delivery Address */}
                          <div>
                            <Label className="text-black font-medium">Delivery Address *</Label>
                            <Textarea
                              placeholder="Enter your delivery address"
                              value={orderForm.delivery_address}
                              onChange={(e) => setOrderForm({...orderForm, delivery_address: e.target.value})}
                              className="text-black mt-2"
                              rows={3}
                            />
                          </div>

                          {/* Contact Info */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-black font-medium">City *</Label>
                              <Input
                                placeholder="City"
                                value={orderForm.city}
                                onChange={(e) => setOrderForm({...orderForm, city: e.target.value})}
                                className="text-black mt-2"
                              />
                            </div>
                            <div>
                              <Label className="text-black font-medium">Phone *</Label>
                              <Input
                                placeholder="Phone number"
                                value={orderForm.phone}
                                onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                                className="text-black mt-2"
                              />
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div>
                            <Label className="text-black font-medium">Payment Method</Label>
                            <Select value={orderForm.payment_method} onValueChange={(value) => setOrderForm({...orderForm, payment_method: value})}>
                              <SelectTrigger className="text-black mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Order Total */}
                          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-black">Total Amount:</span>
                              <span className="text-2xl font-bold text-emerald-600">
                                ${(selectedProduct.price * productQuantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-2">
                            <Button 
                              variant="outline"
                              onClick={() => setSelectedProduct(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handlePlaceOrder}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              disabled={!orderForm.delivery_address || !orderForm.city || !orderForm.phone}
                            >
                              Place Order
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No suppliers found matching your search</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}