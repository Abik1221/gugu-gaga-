import { SupplierOnboardingAPI } from './api';

export type SupplierFlowStatus = {
  step: 'kyc_pending' | 'payment_pending' | 'approved' | 'rejected';
  kyc_status?: string;
  payment_status?: string;
  can_access_dashboard: boolean;
  next_action?: string;
};

export async function getSupplierFlowStatus(): Promise<SupplierFlowStatus> {
  try {
    const [kycStatus, paymentStatus] = await Promise.all([
      SupplierOnboardingAPI.getKYCStatus().catch(() => ({ status: 'not_submitted' })),
      SupplierOnboardingAPI.getPaymentStatus().catch(() => ({ status: 'not_submitted' }))
    ]);

    // KYC not submitted or rejected
    if (!kycStatus.status || kycStatus.status === 'not_submitted' || kycStatus.status === 'rejected') {
      return {
        step: 'kyc_pending',
        kyc_status: kycStatus.status,
        can_access_dashboard: false,
        next_action: 'Submit KYC documents'
      };
    }

    // KYC pending approval
    if (kycStatus.status === 'pending') {
      return {
        step: 'kyc_pending',
        kyc_status: kycStatus.status,
        can_access_dashboard: false,
        next_action: 'Wait for KYC approval'
      };
    }

    // KYC approved, but payment not submitted or rejected
    if (kycStatus.status === 'approved') {
      if (!paymentStatus.status || paymentStatus.status === 'not_submitted' || paymentStatus.status === 'rejected') {
        return {
          step: 'payment_pending',
          kyc_status: kycStatus.status,
          payment_status: paymentStatus.status,
          can_access_dashboard: false,
          next_action: 'Submit payment verification'
        };
      }

      // Payment pending approval
      if (paymentStatus.status === 'pending') {
        return {
          step: 'payment_pending',
          kyc_status: kycStatus.status,
          payment_status: paymentStatus.status,
          can_access_dashboard: false,
          next_action: 'Wait for payment verification'
        };
      }

      // Both approved - can access dashboard
      if (paymentStatus.status === 'verified') {
        return {
          step: 'approved',
          kyc_status: kycStatus.status,
          payment_status: paymentStatus.status,
          can_access_dashboard: true
        };
      }
    }

    // Default fallback
    return {
      step: 'kyc_pending',
      can_access_dashboard: false,
      next_action: 'Complete onboarding process'
    };
  } catch (error) {
    console.error('Error checking supplier flow status:', error);
    return {
      step: 'kyc_pending',
      can_access_dashboard: false,
      next_action: 'Complete onboarding process'
    };
  }
}

export function getRedirectPath(status: SupplierFlowStatus): string {
  switch (status.step) {
    case 'kyc_pending':
      return '/register/supplier';
    case 'payment_pending':
      return '/dashboard/supplier-payment';
    case 'approved':
      return '/dashboard/supplier';
    default:
      return '/register/supplier';
  }
}