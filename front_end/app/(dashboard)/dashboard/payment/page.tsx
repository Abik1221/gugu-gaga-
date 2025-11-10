"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LogOut, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getAuthJSON, postForm } from "@/utils/api";
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

function OwnerPaymentSidebar() {
  const router = useRouter();
  const { show } = useToast();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
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
            <SidebarMenuButton onClick={handleSignOut} className="text-white hover:text-white hover:bg-gray-800">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function OwnerPaymentPage() {
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentCode, setPaymentCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const me = await getAuthJSON("/api/v1/auth/me");
      
      if (me.kyc_status !== "approved") {
        router.replace("/dashboard/kyc");
        return;
      }
      
      setTenantId(me.tenant_id);
      setSubscriptionStatus(me.subscription_status || "awaiting_payment");
      
      if (me.subscription_status === "active") {
        router.replace("/dashboard/owner");
        return;
      }
    } catch (error) {
      console.error("Failed to load status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentCode.trim()) {
      show({ title: "Error", description: "Please enter a payment code", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await postForm(`/api/v1/billing/payment-code?tenant_id=${tenantId}`, { code: paymentCode });
      show({ title: "Success", description: "Payment code submitted successfully. Awaiting admin verification.", variant: "success" });
      setPaymentCode("");
      await loadStatus();
    } catch (error) {
      console.error("Submit error:", error);
      show({ title: "Error", description: error?.message || "Failed to submit payment code", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (subscriptionStatus) {
      case "pending_verification":
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-300"><Clock className="h-3 w-3 mr-1" />Pending Verification</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800 border border-green-300"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "payment_rejected":
        return <Badge className="bg-red-100 text-red-800 border border-red-300"><AlertCircle className="h-3 w-3 mr-1" />Payment Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Awaiting Payment</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <SidebarProvider>
          <OwnerPaymentSidebar />
          <SidebarInset className="p-3 bg-white">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading payment status...</p>
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
        <OwnerPaymentSidebar />
        <SidebarInset className="bg-white min-h-screen">
          <div className="bg-white px-6 py-4 flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-900">Payment Verification</h1>
          </div>
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Submit your payment code to activate your subscription</p>
                </div>
                {getStatusBadge()}
              </div>
            </div>

            {subscriptionStatus === "payment_rejected" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Payment Rejected</h3>
                    <p className="text-red-700 text-sm">Your previous payment submission was rejected. Please submit a valid payment code.</p>
                  </div>
                </div>
              </div>
            )}

            {subscriptionStatus === "pending_verification" && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Verification in Progress</h3>
                    <p className="text-blue-700 text-sm">Your payment is being verified by our admin team. You'll be notified once approved.</p>
                  </div>
                </div>
              </div>
            )}

            <Card className="border border-gray-200">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <DollarSign className="h-5 w-5" />
                  Submit Payment Code
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="payment_code" className="text-gray-900 font-semibold">Payment Code *</Label>
                    <Input
                      id="payment_code"
                      value={paymentCode}
                      onChange={(e) => setPaymentCode(e.target.value)}
                      placeholder="Enter your payment receipt code"
                      className="mt-2"
                      required
                      disabled={subscriptionStatus === "pending_verification"}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the payment code provided after completing your payment</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || subscriptionStatus === "pending_verification"} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Payment Code"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              After submitting your payment code, our admin team will verify it. Once approved, you'll have full access to your dashboard.
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
