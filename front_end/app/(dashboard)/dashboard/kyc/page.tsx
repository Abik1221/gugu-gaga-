"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LogOut, Clock, CheckCircle, AlertCircle, FileText, Building2, Phone, MapPin, CreditCard, Hash, MessageSquare, Upload, RefreshCw } from "lucide-react";
import { getAuthJSON, postAuthJSON, API_BASE } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
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

function OwnerKYCSidebar() {
  const router = useRouter();
  const { show } = useToast();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    router.push('/');
    show({ title: "Success", description: "Signed out successfully", variant: "success" });
  };

  return (
    <Sidebar className="!bg-white border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex justify-center">
          <Image
            height={80}
            width={80}
            src={logoImage}
            alt="Mesob Logo"
            className="rounded-lg shadow-sm"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer font-medium">
              <LogOut className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function OwnerKYCPage() {
  const router = useRouter();
  const { show } = useToast();
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    pharmacy_name: "",
    pharmacy_address: "",
    owner_phone: "",
    id_number: "",
    tin_number: "",
    notes: "",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [existingLicense, setExistingLicense] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadKYCData();
  }, []);

  const loadKYCData = async () => {
    try {
      setLoading(true);
      const me = await getAuthJSON("/api/v1/auth/me");
      const tenantId = me.tenant_id;

      if (!tenantId) {
        show({ title: "Error", description: "No tenant ID found", variant: "destructive" });
        return;
      }

      if (me.kyc_status === "approved") {
        if (me.subscription_status !== "active") {
          router.push("/dashboard/payment");
        } else {
          router.push("/dashboard/owner");
        }
        return;
      }

      try {
        const data = await getAuthJSON(`/api/v1/owner/kyc/status?tenant_id=${tenantId}`);
        setKycData(data);

        setFormData({
          pharmacy_name: data.pharmacy_name || "",
          pharmacy_address: data.pharmacy_address || "",
          owner_phone: data.owner_phone || "",
          id_number: data.id_number || "",
          tin_number: data.pharmacy_license_number || "",
          notes: data.notes || "",
        });
        setExistingLicense(data.license_document_name || data.pharmacy_license_document_path || "");
      } catch (error) {
        setKycData({ status: "not_submitted" });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      show({ title: "Error", description: "Failed to load user information", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!existingLicense && !licenseFile) {
      show({ title: "Error", description: "Business license document is required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const me = await getAuthJSON("/api/v1/auth/me");
      const tenantId = me.tenant_id;

      const payload = {
        pharmacy_name: formData.pharmacy_name,
        pharmacy_address: formData.pharmacy_address,
        owner_phone: formData.owner_phone,
        id_number: formData.id_number,
        pharmacy_license_number: formData.tin_number,
        notes: formData.notes,
      };
      const response = await fetch(`${API_BASE}/owner/kyc/status?tenant_id=${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update KYC');
      }
      show({ title: "Success", description: "KYC information updated successfully. Redirecting...", variant: "success" });
      setTimeout(() => router.push("/dashboard/owner"), 1500);
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
        return <Badge className="bg-amber-100 text-amber-800 border-0 px-4 py-2 text-sm font-semibold"><Clock className="h-4 w-4 mr-2" />Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-emerald-100 text-emerald-800 border-0 px-4 py-2 text-sm font-semibold"><CheckCircle className="h-4 w-4 mr-2" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-rose-100 text-rose-800 border-0 px-4 py-2 text-sm font-semibold"><AlertCircle className="h-4 w-4 mr-2" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0 px-4 py-2 text-sm font-semibold">Not Submitted</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <SidebarProvider>
          <OwnerKYCSidebar />
          <SidebarInset className="bg-neutral-50">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-800 font-medium">Loading your information...</p>
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
        <OwnerKYCSidebar />
        <SidebarInset className="bg-neutral-50 min-h-screen">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-6 flex items-center gap-4 sticky top-0 z-10 shadow-lg">
            <SidebarTrigger className="text-white" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">KYC Verification</h1>
              <p className="text-sm text-emerald-100 mt-0.5">Complete your business verification to get started</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              <Button
                onClick={() => loadKYCData()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </div>

          <div className="p-6 max-w-6xl mx-auto space-y-6">
            {kycData?.status === "rejected" && kycData?.admin_notes && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-rose-900 mb-1">Application Rejected</h3>
                    <p className="text-sm text-rose-700">{kycData.admin_notes}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{kycData?.status === "not_submitted" ? "Submit Verification Documents" : "Update Your Information"}</div>
                      <div className="text-emerald-50 text-sm font-normal mt-1">Provide accurate information for quick approval</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-emerald-600" />
                          Business Name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.pharmacy_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, pharmacy_name: e.target.value }))}
                          placeholder="Enter your registered business name"
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          Phone Number <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.owner_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, owner_phone: e.target.value }))}
                          placeholder="+251..."
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label className="text-gray-900 font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        Business Address <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={formData.pharmacy_address}
                        onChange={(e) => setFormData(prev => ({ ...prev, pharmacy_address: e.target.value }))}
                        placeholder="Full business location address"
                        className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-emerald-600" />
                          National ID Number <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.id_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, id_number: e.target.value }))}
                          placeholder="Government-issued ID"
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <Hash className="h-4 w-4 text-emerald-600" />
                          TIN Number <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.tin_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, tin_number: e.target.value }))}
                          placeholder="Tax Identification Number"
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-2"
                    >
                      <Label className="text-gray-900 font-semibold flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-emerald-600" />
                        Additional Notes
                      </Label>
                      <Input
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional information (optional)"
                        className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <Label className="text-gray-900 font-semibold flex items-center gap-2">
                        <Upload className="h-4 w-4 text-emerald-600" />
                        Business License Document <span className="text-rose-500">*</span>
                      </Label>
                      {existingLicense && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-sm text-emerald-900 font-semibold mb-2">✓ Current License Document</p>
                          {existingLicense.startsWith('data:image') ? (
                            <div className="relative w-full max-w-md">
                              <img
                                src={existingLicense}
                                alt="Current Business License"
                                className="w-full h-auto rounded-lg border border-emerald-300 shadow-sm"
                              />
                            </div>
                          ) : (
                            <p className="text-xs text-emerald-700 break-all font-mono bg-white px-3 py-2 rounded border border-emerald-200">{existingLicense}</p>
                          )}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          id="license-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <label
                          htmlFor="license-upload"
                          className="flex items-center justify-between px-5 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition hover:border-emerald-500 hover:bg-emerald-50 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${licenseFile ? 'bg-emerald-100' : 'bg-gray-100 group-hover:bg-emerald-100'}`}>
                              <FileText className={`w-6 h-6 ${licenseFile ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-600'}`} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {licenseFile ? licenseFile.name : existingLicense ? "Upload new document (optional)" : "Click to upload license"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {existingLicense ? "Leave empty to keep current document" : "PDF, JPG, JPEG or PNG (max 10MB)"}
                              </p>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition">
                            BROWSE
                          </div>
                        </label>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-12 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                          </span>
                        ) : kycData?.status === "not_submitted" ? "Submit KYC Application" : "Update KYC Information"}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-xl bg-amber-50 border border-amber-200"
            >
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">What happens next?</h4>
                  <p className="text-sm text-amber-800">After submitting your KYC information, our admin team will review it within 24-48 hours. Once approved, you'll proceed to payment verification and unlock your dashboard.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
