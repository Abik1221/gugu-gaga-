"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, FileText, Building2, Phone, MapPin, CreditCard, Hash, Upload, RefreshCw } from "lucide-react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FlowSidebar } from "@/components/custom/flow-sidebar";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/language-context";

export default function SupplierKYCPage() {
  const router = useRouter();


  const { t } = useLanguage();
  const { show } = useToast();
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    supplier_name: string;
    national_id: string;
    tin_number: string;
    business_license_image: File | null;
    phone: string;
    address: string;
  }>({
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
      setKycData(data);

      const newFormData = {
        supplier_name: data.supplier_name || "",
        national_id: data.national_id || "",
        tin_number: data.tin_number || "",
        business_license_image: null,
        phone: data.phone || "",
        address: data.address || "",
      };
      setFormData(newFormData);
      setExistingLicenseImage(data.business_license_image || "");
    } catch (error) {
      console.error("Failed to load KYC data:", error);
      setKycData({ status: "not_submitted" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      await postAuthJSON("/api/v1/supplier-onboarding/kyc/submit", payload);
      show({ title: "Success", description: "KYC information updated successfully", variant: "success" });
      await loadKYCData();
    } catch (error) {
      console.error("Submit error:", error);
      show({ title: "Error", description: (error as any)?.message || "Failed to update KYC information", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (kycData?.status) {
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-sm font-semibold"><Clock className="h-3.5 w-3.5 mr-1.5" />{t.supplierOnboarding.pendingReview}</Badge>;
      case "approved":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm font-semibold"><CheckCircle className="h-3.5 w-3.5 mr-1.5" />{t.supplierOnboarding.approved}</Badge>;
      case "rejected":
        return <Badge className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 text-sm font-semibold"><AlertCircle className="h-3.5 w-3.5 mr-1.5" />{t.supplierOnboarding.rejected}</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1 text-sm font-semibold">{t.supplierOnboarding.notSubmitted}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <SidebarProvider>
          <FlowSidebar />
          <SidebarInset className="bg-neutral-50 min-h-screen">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading KYC data...</p>
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
        <FlowSidebar />
        <SidebarInset className="bg-neutral-50 min-h-screen">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-6 flex items-center gap-4 sticky top-0 z-10 shadow-lg">
            <SidebarTrigger className="text-white" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{t.supplierOnboarding.kycTitle}</h1>
              <p className="text-sm text-emerald-100 mt-0.5">{t.supplierOnboarding.kycSubtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector variant="ghost" className="text-white hover:bg-white/20 hover:text-white" />
              {getStatusBadge()}
              <Button
                onClick={() => loadKYCData()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.supplierOnboarding.refreshStatus}
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
                    <h3 className="font-bold text-rose-900 mb-1">{t.supplierOnboarding.applicationRejected}</h3>
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
                      <div className="font-bold text-lg">{kycData?.status === "not_submitted" ? t.supplierOnboarding.submitVerification : t.supplierOnboarding.updateInformation}</div>
                      <div className="text-emerald-50 text-sm font-normal mt-1">{t.supplierOnboarding.provideAccurateInfo}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-emerald-600" />
                          {t.supplierOnboarding.supplierName} <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.supplier_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))}
                          placeholder="Enter your registered business name"
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-emerald-600" />
                          {t.supplierOnboarding.nationalId} <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.national_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, national_id: e.target.value }))}
                          placeholder="Government-issued ID number"
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <Hash className="h-4 w-4 text-emerald-600" />
                          {t.supplierOnboarding.tinNumber} <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          value={formData.tin_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, tin_number: e.target.value }))}
                          placeholder="Tax Identification Number"
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-900 font-semibold flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          {t.supplierOnboarding.phoneNumber}
                        </Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+251..."
                          className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label className="text-gray-900 font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        {t.supplierOnboarding.businessAddress}
                      </Label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Business location"
                        className="h-11 rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-3"
                    >
                      <Label className="text-gray-900 font-semibold flex items-center gap-2">
                        <Upload className="h-4 w-4 text-emerald-600" />
                        {t.supplierOnboarding.licenseDocument} <span className="text-rose-500">*</span>
                      </Label>
                      {existingLicenseImage && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-sm text-emerald-900 font-semibold mb-2">✓ {t.supplierOnboarding.currentLicense}</p>
                          {existingLicenseImage.startsWith('data:image') ? (
                            <div className="relative w-full max-w-md">
                              <img
                                src={existingLicenseImage}
                                alt="Current License"
                                className="w-full h-auto rounded-lg border border-emerald-300 shadow-sm"
                              />
                            </div>
                          ) : (
                            <p className="text-xs text-emerald-700 break-all font-mono bg-white px-3 py-2 rounded border border-emerald-200">{existingLicenseImage}</p>
                          )}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          id="license-upload"
                          accept=".pdf,.jpg,.jpeg,.png,image/*"
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            business_license_image: e.target.files?.[0] || null
                          }))}
                          className="hidden"
                        />
                        <label
                          htmlFor="license-upload"
                          className="flex items-center justify-between px-5 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition hover:border-emerald-500 hover:bg-emerald-50 group"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {formData.business_license_image && (
                              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-emerald-600" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition">
                                {formData.business_license_image
                                  ? formData.business_license_image.name
                                  : existingLicenseImage
                                    ? t.supplierOnboarding.replaceLicense
                                    : t.supplierOnboarding.clickToUpload
                                }
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {existingLicenseImage
                                  ? t.supplierOnboarding.uploadHint
                                  : t.supplierOnboarding.uploadHint
                                }
                              </p>
                            </div>
                          </div>
                          <div className="px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg group-hover:bg-emerald-700 transition">
                            {formData.business_license_image ? t.supplierOnboarding.change : t.supplierOnboarding.browse}
                          </div>
                        </label>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t.supplierOnboarding.submitting}
                          </>
                        ) : (
                          kycData?.status === "not_submitted" ? t.supplierOnboarding.submitApplication : t.supplierOnboarding.updateApplication
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
