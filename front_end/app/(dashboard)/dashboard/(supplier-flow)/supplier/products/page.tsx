"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, Trash2 } from "lucide-react";

export default function SupplierProducts() {
  const [products, setProducts] = useState([
    { id: 1, name: "Sample Product", description: "Product description here", price: 99.99 }
  ]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price)
    };
    setProducts([...products, newProduct]);
    setFormData({ name: "", description: "", price: "" });
    setOpen(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString()
    });
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts(products.map(p => 
      p.id === editingProduct.id 
        ? { ...p, name: formData.name, description: formData.description, price: parseFloat(formData.price) }
        : p
    ));
    setFormData({ name: "", description: "", price: "" });
    setEditingProduct(null);
    setEditOpen(false);
  };

  const handleDelete = (product: any) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== deletingProduct.id));
    setDeletingProduct(null);
    setDeleteOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <p className="text-gray-600">Manage your product catalog</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Add New Product</h3>
                <p className="text-sm text-gray-600 mb-4">Create a new product listing</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle className="text-black">Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-black">Product Name</Label>
                <Input
                  id="name"
                  className="bg-white text-black border-gray-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-black">Description</Label>
                <Textarea
                  id="description"
                  className="bg-white text-black border-gray-300"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-black">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  className="bg-white text-black border-gray-300"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Product</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">${product.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-black">Product Name</Label>
              <Input
                id="edit-name"
                className="bg-white text-black border-gray-300"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-black">Description</Label>
              <Textarea
                id="edit-description"
                className="bg-white text-black border-gray-300"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price" className="text-black">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                className="bg-white text-black border-gray-300"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Update Product</Button>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">Delete Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-black">Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}