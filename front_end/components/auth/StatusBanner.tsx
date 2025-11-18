"use client";

import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface StatusBannerProps {
  user: {
    role: string;
    kyc_status?: string | null;
    subscription_status?: string | null;
    subscription_blocked?: boolean;
    latest_payment_status?: string | null;
  };
}

export function StatusBanner({ user }: StatusBannerProps) {
  const router = useRouter();

  const getStatusInfo = () => {
    const { role, kyc_status, subscription_status, subscription_blocked } = user;

    if (role === 'affiliate') {
      return {
        type: 'success' as const,
        icon: CheckCircle,
        message: 'Your affiliate account is active',
        action: null
      };
    }

    if (role === 'pharmacy_owner') {
      if (kyc_status === 'not_submitted' || kyc_status === 'rejected') {
        return {
          type: 'error' as const,
          icon: XCircle,
          message: 'KYC verification required to access your dashboard',
          action: { label: 'Complete KYC', path: '/dashboard/kyc' }
        };
      }
      if (kyc_status === 'pending') {
        return {
          type: 'warning' as const,
          icon: Clock,
          message: 'KYC under review - you can edit your submission if needed',
          action: { label: 'View KYC Status', path: '/dashboard/kyc-pending' }
        };
      }
      if (subscription_blocked) {
        return {
          type: 'error' as const,
          icon: XCircle,
          message: 'Subscription blocked - submit payment to continue',
          action: { label: 'Submit Payment', path: '/dashboard/payment' }
        };
      }
      if (subscription_status === 'pending_verification') {
        return {
          type: 'warning' as const,
          icon: Clock,
          message: 'Payment submitted - awaiting admin verification',
          action: { label: 'View Status', path: '/dashboard/payment-pending' }
        };
      }
      return {
        type: 'success' as const,
        icon: CheckCircle,
        message: 'Your pharmacy account is fully active',
        action: null
      };
    }

    if (role === 'supplier') {
      if (kyc_status === 'not_submitted' || kyc_status === 'rejected') {
        return {
          type: 'error' as const,
          icon: XCircle,
          message: 'Supplier verification required to access your dashboard',
          action: { label: 'Complete Verification', path: '/dashboard/supplier-kyc' }
        };
      }
      if (kyc_status === 'pending') {
        return {
          type: 'warning' as const,
          icon: Clock,
          message: 'Verification under review - you can edit your submission if needed',
          action: { label: 'View Status', path: '/dashboard/supplier-kyc-pending' }
        };
      }
      return {
        type: 'success' as const,
        icon: CheckCircle,
        message: 'Your supplier account is fully active',
        action: null
      };
    }

    return {
      type: 'info' as const,
      icon: AlertCircle,
      message: 'Welcome to your dashboard',
      action: null
    };
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  };

  const iconColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  };

  const buttonColors = {
    success: 'bg-green-600 hover:bg-green-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    error: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className={`rounded-lg border p-4 ${bgColors[statusInfo.type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${iconColors[statusInfo.type]}`} />
          <span className={`text-sm font-medium ${textColors[statusInfo.type]}`}>
            {statusInfo.message}
          </span>
        </div>
        {statusInfo.action && (
          <Button
            size="sm"
            onClick={() => router.push(statusInfo.action!.path)}
            className={`${buttonColors[statusInfo.type]} text-white`}
          >
            {statusInfo.action.label}
          </Button>
        )}
      </div>
    </div>
  );
}