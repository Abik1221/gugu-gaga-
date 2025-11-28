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
import { useLanguage } from "@/contexts/language-context";

export default function SupplierPaymentPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
          {t.supplierOnboarding.pendingVerification}
        </Badge>;
      case "verified":
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {t.supplierOnboarding.verified}
        </Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {t.supplierOnboarding.rejected}
        </Badge>;
      default:
        return <Badge variant="outline">{t.supplierOnboarding.notSubmitted}</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus?.status) {
      case "pending":
        return {
          title: t.supplierOnboarding.paymentUnderVerification,
          message: t.supplierOnboarding.paymentUnderVerificationMsg,
          color: "bg-yellow-50 text-yellow-800"
        };
      case "verified":
        return {
          title: t.supplierOnboarding.paymentVerified,
          message: t.supplierOnboarding.paymentVerifiedMsg,
          color: "bg-green-50 text-green-800"
        };
      case "rejected":
        return {
          title: t.supplierOnboarding.paymentRejected,
          message: t.supplierOnboarding.paymentRejectedMsg,
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
          <h1 className="text-3xl font-bold text-green-600">{t.supplierOnboarding.accountActivated}</h1>
          <p className="text-muted-foreground mt-2">
            {t.supplierOnboarding.accountActivatedMsg}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {t.supplierOnboarding.paymentVerifiedMsg}
              </p>
              <Button asChild>
                <a href="/dashboard/supplier">{t.supplierOnboarding.goToDashboard}</a>
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
        <h1 className="text-3xl font-bold">{t.supplierOnboarding.paymentSubmission}</h1>
        <p className="text-muted-foreground mt-2">
          {t.supplierOnboarding.paymentSubmissionSubtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t.supplierOnboarding.paymentStatus}</CardTitle>
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
                    <strong>{t.supplierOnboarding.adminNotes}</strong> {paymentStatus.admin_notes}
                  </p>
                </div>
              )}
              {paymentStatus?.code && (
                <div className="mt-3 p-3 bg-white/50 rounded border">
                  <p className="text-sm">
                    <strong>{t.supplierOnboarding.submittedCode}</strong> <code className="font-mono">{paymentStatus.code}</code>
                  </p>
                </div>
              )}
            </div>
          )}

          {(paymentStatus?.status === "not_submitted" || paymentStatus?.status === "rejected") && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t.supplierOnboarding.paymentCode} *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    code: e.target.value
                  }))}
                  placeholder={t.supplierOnboarding.paymentCode}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t.supplierOnboarding.paymentCodeHint}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t.supplierOnboarding.amount}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    amount: e.target.value
                  }))}
                  placeholder={t.supplierOnboarding.amount}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">{t.supplierOnboarding.paymentMethod}</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    payment_method: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.supplierOnboarding.selectMethod} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">{t.supplierOnboarding.bankTransfer}</SelectItem>
                    <SelectItem value="cash">{t.supplierOnboarding.cash}</SelectItem>
                    <SelectItem value="check">{t.supplierOnboarding.check}</SelectItem>
                    <SelectItem value="other">{t.supplierOnboarding.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t.supplierOnboarding.additionalNotes}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder={t.supplierOnboarding.additionalNotesPlaceholder}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t.supplierOnboarding.submitting : t.supplierOnboarding.submitPayment}
              </Button>
            </form>
          )}

          {paymentStatus?.status === "pending" && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{t.supplierOnboarding.verificationInProgress}</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {t.supplierOnboarding.verificationInProgressMsg}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.supplierOnboarding.paymentInstructions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">{t.supplierOnboarding.howToPay}</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>{t.supplierOnboarding.step1}</li>
              <li>{t.supplierOnboarding.step2}</li>
              <li>{t.supplierOnboarding.step3}</li>
              <li>{t.supplierOnboarding.step4}</li>
              <li>{t.supplierOnboarding.step5}</li>
            </ol>
          </div>
          <p className="text-muted-foreground">
            <strong>{t.supplierOnboarding.note}</strong> {t.supplierOnboarding.noteMsg}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}