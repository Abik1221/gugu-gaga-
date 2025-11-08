"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
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
    router.push('/login');
    show({ title: "Success", description: "Signed out successfully", variant: "success" });
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-xl font-bold">Mesob</h2>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
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
    business_license_number: "",
    tax_certificate_number: "",
    documents_path: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadKYCData();
  }, []);

  const loadKYCData = async () => {
    try {
      setLoading(true);
      const data = await getAuthJSON("/api/v1/supplier-onboarding/kyc/status");
      setKycData(data);
      
      if (data) {
        setFormData({
          business_license_number: data.business_license_number || "",
          tax_certificate_number: data.tax_certificate_number || "",
          documents_path: data.documents_path || "",
          notes: data.notes || "",
        });
      }
    } catch (error) {
      console.error("Failed to load KYC data:", error);
      setKycData({ status: "not_submitted" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await postAuthJSON("/api/v1/supplier-onboarding/kyc/submit", formData);
      show({ title: "Success", description: "KYC information updated successfully", variant: "success" });
      loadKYCData();
    } catch (error) {
      show({ title: "Error", description: "Failed to update KYC information", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (kycData?.status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Submitted</Badge>;
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
                <p>Loading...</p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div>
      <SidebarProvider>
        <SupplierKYCSidebar />
        <SidebarInset className="p-3 bg-white">
          <SidebarHeader className="p-3">
            <SidebarTrigger />
            <h1 className="text-xl font-bold ml-2">Supplier KYC Application</h1>
          </SidebarHeader>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>KYC Information</CardTitle>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent>
                {kycData?.status === "rejected" && kycData?.admin_notes && (
                  <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800">Admin Feedback</h3>
                    <p className="text-red-700 text-sm mt-1">{kycData.admin_notes}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_license">Business License Number *</Label>
                      <Input
                        id="business_license"
                        value={formData.business_license_number}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          business_license_number: e.target.value
                        }))}
                        placeholder="Enter business license number"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="tax_certificate">Tax Certificate Number</Label>
                      <Input
                        id="tax_certificate"
                        value={formData.tax_certificate_number}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          tax_certificate_number: e.target.value
                        }))}
                        placeholder="Enter tax certificate number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="documents">Documents Path</Label>
                    <Input
                      id="documents"
                      value={formData.documents_path}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        documents_path: e.target.value
                      }))}
                      placeholder="Path to uploaded documents"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Updating..." : "Update KYC Information"}
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
