"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { getHardcodedRoute } from "@/utils/hardcoded-routing";
import { AuthAPI } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function SupplierStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const user = await AuthAPI.me();
      setStatus(user);
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: string) => {
    if (!status) return 'pending';
    
    switch (step) {
      case 'kyc':
        if (status.kyc_status === 'approved') return 'completed';
        if (status.kyc_status === 'rejected') return 'rejected';
        if (status.kyc_status === 'pending') return 'pending';
        return 'not_started';
      case 'payment':
        if (status.payment_status === 'verified') return 'completed';
        if (status.payment_status === 'rejected') return 'rejected';
        if (status.payment_status === 'pending') return 'pending';
        return 'not_started';
      case 'dashboard':
        return status.can_access_dashboard ? 'completed' : 'not_started';
      default:
        return 'not_started';
    }
  };

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Supplier Onboarding Status</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress through the supplier verification process
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {getStatusIcon(getStepStatus('kyc'))}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">KYC Verification</h3>
                  {getStatusBadge(getStepStatus('kyc'))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Submit your business documents for verification
                </p>
              </div>
              {getStepStatus('kyc') !== 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/supplier-kyc')}
                >
                  {getStepStatus('kyc') === 'not_started' ? 'Start' : 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {getStatusIcon(getStepStatus('payment'))}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Payment Verification</h3>
                  {getStatusBadge(getStepStatus('payment'))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Submit payment code for account activation
                </p>
              </div>
              {getStepStatus('kyc') === 'completed' && getStepStatus('payment') !== 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/supplier-payment')}
                >
                  {getStepStatus('payment') === 'not_started' ? 'Start' : 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {getStatusIcon(getStepStatus('dashboard'))}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Dashboard Access</h3>
                  {getStatusBadge(getStepStatus('dashboard'))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Access your supplier dashboard and manage products
                </p>
              </div>
              {status?.can_access_dashboard && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push('/dashboard/supplier')}
                >
                  Access Dashboard
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {status && (
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Step:</span>
                  <Badge variant="secondary">{status.step.replace('_', ' ').toUpperCase()}</Badge>
                </div>
                {status.next_action && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Next Action:</span>
                    <span className="text-sm text-muted-foreground">{status.next_action}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    onClick={() => {
                      const redirectPath = getHardcodedRoute(status);
                      router.push(redirectPath);
                    }}
                    className="w-full"
                  >
                    Continue Onboarding
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}