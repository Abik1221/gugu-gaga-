import { AuthProfile } from './api';

export interface UserStatus {
  role: string;
  is_verified: boolean;
  kyc_status?: string | null;
  subscription_status?: string | null;
  subscription_blocked?: boolean;
  latest_payment_status?: string | null;
}

/**
 * Determines the correct redirect path based on user status and role
 */
export function getAuthRedirectPath(user: UserStatus): string {
  const { role, is_verified, kyc_status, subscription_status, subscription_blocked } = user;

  // If not verified, redirect to verification
  if (!is_verified) {
    return '/verify';
  }

  switch (role) {
    case 'affiliate':
      // Affiliates go directly to dashboard after verification
      return '/dashboard/affiliate';

    case 'pharmacy_owner':
      // Owner flow: verification -> KYC -> payment -> dashboard
      if (kyc_status === 'not_submitted' || kyc_status === 'rejected') {
        return '/dashboard/kyc';
      }
      if (kyc_status === 'pending') {
        return '/dashboard/kyc'; // Allow editing while pending
      }
      if (subscription_status === 'blocked' || subscription_blocked) {
        return '/dashboard/payment';
      }
      if (subscription_status === 'pending_verification') {
        return '/dashboard/payment'; // Allow submitting new payment while pending
      }
      // KYC approved and payment complete -> dashboard
      return '/dashboard/owner';

    case 'supplier':
      // Supplier flow: verification -> KYC -> dashboard
      if (kyc_status === 'not_submitted' || kyc_status === 'rejected') {
        return '/dashboard/supplier-kyc';
      }
      if (kyc_status === 'pending') {
        return '/dashboard/supplier-kyc'; // Allow editing while pending
      }
      // KYC approved -> dashboard
      return '/dashboard/supplier';

    case 'cashier':
      // Cashiers follow owner flow but with different dashboard
      if (subscription_status === 'blocked' || subscription_blocked) {
        return '/dashboard/payment';
      }
      return '/dashboard/staff';

    case 'admin':
      return '/secure-admin-zmp-7x9k';

    default:
      return '/dashboard';
  }
}

/**
 * Checks if user can access a specific dashboard route
 */
export function canAccessRoute(user: UserStatus, route: string): boolean {
  const allowedRoute = getAuthRedirectPath(user);
  
  // Allow access to the determined route and any sub-routes
  if (route.startsWith(allowedRoute)) {
    return true;
  }

  // Special cases for flexible access
  switch (user.role) {
    case 'pharmacy_owner':
      // Owners can access KYC routes if they need to update
      if (route.startsWith('/dashboard/kyc') && user.kyc_status !== 'approved') {
        return true;
      }
      // Owners can access payment routes if needed
      if (route.startsWith('/dashboard/payment') && (user.subscription_blocked || user.subscription_status === 'pending_verification')) {
        return true;
      }
      break;

    case 'supplier':
      // Suppliers can access KYC routes if they need to update
      if (route.startsWith('/dashboard/supplier-kyc') && user.kyc_status !== 'approved') {
        return true;
      }
      break;
  }

  return false;
}

/**
 * Gets user-friendly status message for current state
 */
export function getUserStatusMessage(user: UserStatus): string {
  const { role, is_verified, kyc_status, subscription_status, subscription_blocked } = user;

  if (!is_verified) {
    return 'Please verify your email to continue';
  }

  switch (role) {
    case 'affiliate':
      return 'Welcome! You can start generating referral links';

    case 'pharmacy_owner':
      if (kyc_status === 'not_submitted' || kyc_status === 'rejected') {
        return 'Please complete your KYC verification to continue';
      }
      if (kyc_status === 'pending') {
        return 'Your KYC is under review. You can edit your submission if needed';
      }
      if (subscription_blocked) {
        return 'Your subscription is blocked. Please submit payment to continue';
      }
      if (subscription_status === 'pending_verification') {
        return 'Your payment is being verified. You\'ll have access once approved';
      }
      return 'Welcome to your pharmacy dashboard';

    case 'supplier':
      if (kyc_status === 'not_submitted' || kyc_status === 'rejected') {
        return 'Please complete your supplier verification to continue';
      }
      if (kyc_status === 'pending') {
        return 'Your verification is under review. You can edit your submission if needed';
      }
      return 'Welcome to your supplier dashboard';

    case 'cashier':
      if (subscription_blocked) {
        return 'Subscription blocked. Please contact your pharmacy owner';
      }
      return 'Welcome to the cashier dashboard';

    default:
      return 'Welcome to your dashboard';
  }
}

/**
 * Determines if user should be redirected on login/verification
 */
export function shouldRedirectUser(user: UserStatus, currentPath: string): boolean {
  const targetPath = getAuthRedirectPath(user);
  
  // Don't redirect if already on the correct path
  if (currentPath === targetPath || currentPath.startsWith(targetPath)) {
    return false;
  }

  // Don't redirect if user can access current route
  if (canAccessRoute(user, currentPath)) {
    return false;
  }

  return true;
}