"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, Clock, CheckCircle, AlertCircle, FileText, Upload, Shield } from "lucide-react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

function SupplierKYCSidebar() {
  const router = useRouter();
  const { show } = useToast();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
    show({ title: "Success", description: "Signed out successfully", variant: "success" });
  };

  return (
    <Sidebar className="bg-gray-900">
      <SidebarHeader className="p-6 border-b border-gray-800">
        <div className="flex justify-center">
          <Image
            height={80}
            width={80}
            src={logoImage}
            alt="Mesob Logo"
            className="rounded"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-50 cursor-pointer">
              <LogOut className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function SupplierKYCPage() {
  const router = useRouter();
  const { show } = useToast();
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    supplier_name: "",
    national_id: "",
    tin_number: "",
    business_license_image: null,
    phone: "",
    address: "",
  });
  const [existingLicenseImage, setExistingLicenseImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadKYCData();
  }, []);

  const loadKYCData = async () => {
    try {
      setLoading(true);
      const data = await getAuthJSON("/api/v1/supplier-onboarding/kyc/status");
      console.log("=== KYC API Response ===");
      console.log("Full data:", JSON.stringify(data, null, 2));
      console.log("Status:", data.status);
      console.log("Supplier name:", data.supplier_name);
      console.log("TIN:", data.tin_number);
      console.log("Phone:", data.phone);
      console.log("Address:", data.address);
      console.log("License:", data.business_license_image);
      
      setKycData(data);
      
      // Always populate form with data from backend
      const newFormData = {
        supplier_name: data.supplier_name || "",
        national_id: data.national_id || "",
        tin_number: data.tin_number || "",
        business_license_image: null,
        phone: data.phone || "",
        address: data.address || "",
      };
      console.log("Setting form data:", newFormData);
      setFormData(newFormData);
      setExistingLicenseImage(data.business_license_image || "");
    } catch (error) {
      console.error("Failed to load KYC data:", error);
      setKycData({ status: "not_submitted" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!existingLicenseImage && !formData.business_license_image) {
      show({ title: "Error", description: "Business license image is required", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload: any = {
        supplier_name: formData.supplier_name,
        national_id: formData.national_id,
        tin_number: formData.tin_number,
        phone: formData.phone,
        address: formData.address,
      };
      
      if (formData.business_license_image) {
        payload.business_license_image = `/uploads/${formData.business_license_image.name}`;
      }
      
      console.log("Submitting payload:", payload);
      await postAuthJSON("/api/v1/supplier-onboarding/kyc/submit", payload);
      show({ title: "Success", description: "KYC information updated successfully", variant: "success" });
      await loadKYCData();
    } catch (error) {
      console.error("Submit error:", error);
      show({ title: "Error", description: error?.message || "Failed to update KYC information", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (kycData?.status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border border-green-300"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border border-red-300"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-300">Not Submitted</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <SidebarProvider>
          <SupplierKYCSidebar />
          <SidebarInset className="p-3 bg-white">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading KYC data...</p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  console.log("Rendering form with data:", formData);

  return (
    <div>
      <SidebarProvider>
        <SupplierKYCSidebar />
        <SidebarInset className="bg-white min-h-screen">
          <div className="bg-white px-6 py-4 flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-900">KYC Verification</h1>
          </div>
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Complete your verification to start supplying</p>
                </div>
                {getStatusBadge()}
              </div>
            </div>

            {kycData?.status === "rejected" && kycData?.admin_notes && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Application Rejected</h3>
                    <p className="text-red-700 text-sm">{kycData.admin_notes}</p>
                  </div>
                </div>
              </div>
            )}

            <Card className="border border-gray-200">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5" />
                  {kycData?.status === "not_submitted" ? "Submit Verification Documents" : "Edit Verification Documents"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="supplier_name" className="text-gray-900 font-semibold">Supplier/Company Name *</Label>
                    <Input
                      id="supplier_name"
                      value={formData.supplier_name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        supplier_name: e.target.value
                      }))}
                      placeholder="Enter your registered business name"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="national_id" className="text-gray-900 font-semibold">National ID Number *</Label>
                    <Input
                      id="national_id"
                      value={formData.national_id}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        national_id: e.target.value
                      }))}
                      placeholder="Government-issued identification number"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tin_number" className="text-gray-900 font-semibold">TIN Number *</Label>
                    <Input
                      id="tin_number"
                      value={formData.tin_number}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        tin_number: e.target.value
                      }))}
                      placeholder="Tax Identification Number"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-900 font-semibold mb-2 block">
                      Supplier License Image {!existingLicenseImage && "*"}
                    </Label>
                    {existingLicenseImage && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900 font-medium mb-1">Current License:</p>
                        <p className="text-xs text-blue-700 break-all">{existingLicenseImage}</p>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        id="license-upload"
                        accept="image/*"
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          business_license_image: e.target.files?.[0] || null
                        }))}
                        className="hidden"
                      />
                      <label
                        htmlFor="license-upload"
                        className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg cursor-pointer transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {formData.business_license_image && (
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {formData.business_license_image ? formData.business_license_image.name : existingLicenseImage ? "Upload new license image (optional)" : "No file selected"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {existingLicenseImage ? "Leave empty to keep current image" : "Upload official supplier license image"}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded hover:bg-emerald-700 transition ml-3">
                          BROWSE
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-900 font-semibold">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      placeholder="+251..."
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional contact number</p>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-900 font-semibold">Business Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                      placeholder="Business location"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional business location</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold"
                  >
                    {isSubmitting ? "Updating..." : kycData?.status === "not_submitted" ? "Submit KYC Application" : "Update KYC Information"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
