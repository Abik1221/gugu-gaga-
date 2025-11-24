"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Clock, CheckCircle, AlertCircle, DollarSign, RefreshCw } from "lucide-react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function SupplierPaymentPage() {
  const router = useRouter();
  const { show } = useToast();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    amount: "",
    payment_method: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPaymentStatus();
  }, []);

  const loadPaymentStatus = async () => {
    try {
      setLoading(true);
      const status = await getAuthJSON("/api/v1/supplier-onboarding/payment/status");
      setPaymentStatus(status);

      // If payment is verified, redirect to dashboard
      if (status.status === 'verified') {
        router.push('/dashboard/supplier');
      }
    } catch (error) {
      console.error("Failed to load payment status:", error);
      setPaymentStatus({ status: "not_submitted" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        code: formData.code,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        payment_method: formData.payment_method || null,
        notes: formData.notes || null,
      };
      await postAuthJSON("/api/v1/supplier-onboarding/payment/submit", payload);
      show({ title: "Success", description: "Payment code submitted successfully", variant: "success" });
      loadPaymentStatus();
    } catch (error) {
      show({ title: "Error", description: "Failed to submit payment code", variant: "destructive" });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (paymentStatus?.status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending Verification
        </Badge>;
      case "verified":
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Verified
        </Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="outline">Not Submitted</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus?.status) {
      case "pending":
        return {
          title: "Payment Under Verification",
          message: "Your payment code is being verified by our admin team. You will be notified once verification is complete.",
          color: "bg-yellow-50 text-yellow-800"
        };
      case "verified":
        return {
          title: "Payment Verified",
          message: "Your payment has been verified! Your supplier account is now fully activated.",
          color: "bg-green-50 text-green-800"
        };
      case "rejected":
        return {
          title: "Payment Rejected",
          message: "Your payment submission has been rejected. Please check the admin notes and submit a valid payment code.",
          color: "bg-red-50 text-red-800"
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus?.status === "verified") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-green-600">Account Activated!</h1>
          <p className="text-muted-foreground mt-2">
            Your supplier account is now fully activated and ready to use.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You can now access your supplier dashboard and start managing your products and orders.
              </p>
              <Button asChild>
                <a href="/dashboard/supplier">Go to Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <DollarSign className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold">Payment Submission</h1>
        <p className="text-muted-foreground mt-2">
          Submit your payment code to activate your supplier account
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Status</CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {getStatusMessage() && (
            <div className={`p-4 rounded-lg ${getStatusMessage()?.color}`}>
              <h3 className="font-semibold">{getStatusMessage()?.title}</h3>
              <p className="text-sm mt-1">{getStatusMessage()?.message}</p>
              {paymentStatus?.admin_notes && (
                <div className="mt-3 p-3 bg-white/50 rounded border">
                  <p className="text-sm">
                    <strong>Admin Notes:</strong> {paymentStatus.admin_notes}
                  </p>
                </div>
              )}
              {paymentStatus?.code && (
                <div className="mt-3 p-3 bg-white/50 rounded border">
                  <p className="text-sm">
                    <strong>Submitted Code:</strong> <code className="font-mono">{paymentStatus.code}</code>
                  </p>
                </div>
              )}
            </div>
          )}

          {(paymentStatus?.status === "not_submitted" || paymentStatus?.status === "rejected") && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code">Payment Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    code: e.target.value
                  }))}
                  placeholder="Enter your payment code"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the payment code you received after making the payment
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    amount: e.target.value
                  }))}
                  placeholder="Payment amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    payment_method: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Any additional payment details..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Payment Code"}
              </Button>
            </form>
          )}

          {paymentStatus?.status === "pending" && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Verification in Progress</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Please wait while our admin team verifies your payment. This usually takes 1-2 business days.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">How to make payment:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Contact our admin team for payment details</li>
              <li>Make the payment using your preferred method</li>
              <li>Obtain the payment confirmation code</li>
              <li>Submit the code using the form above</li>
              <li>Wait for admin verification</li>
            </ol>
          </div>
          <p className="text-muted-foreground">
            <strong>Note:</strong> Your supplier account will be activated only after payment verification is complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}