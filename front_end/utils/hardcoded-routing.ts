// Hardcoded routing logic for production
export function getHardcodedRoute(user: any): string {
  if (!user) return '/';

  // If not verified, always go to verify page
  if (!user.is_verified) {
    return '/verify';
  }

  // Role-based routing after verification
  switch (user.role) {
    case 'affiliate':
      return '/dashboard/affiliate';

    case 'pharmacy_owner':
      // Check KYC status first
      if (user.kyc_status === 'not_submitted' || user.kyc_status === 'rejected') {
        return '/dashboard/kyc';
      }
      if (user.kyc_status === 'pending') {
        return '/dashboard/kyc';
      }
      // If KYC approved, check subscription
      if (user.subscription_status === 'pending_verification') {
        return '/dashboard/payment';
      }
      if (user.subscription_blocked) {
        return '/dashboard/payment';
      }
      // All good, go to dashboard
      return '/dashboard';

    case 'supplier':
      // Check KYC status first
      if (user.kyc_status === 'not_submitted' || user.kyc_status === 'rejected') {
        return '/dashboard/supplier/kyc';
      }
      if (user.kyc_status === 'pending') {
        return '/dashboard/supplier/kyc';
      }
      // If KYC approved, check subscription
      if (user.subscription_status === 'pending_verification') {
        return '/dashboard/payment';
      }
      if (user.subscription_blocked) {
        return '/dashboard/payment';
      }
      // All good, go to supplier dashboard
      return '/dashboard/supplier';

    case 'cashier':
      // Cashiers are created by approved owners, go directly to dashboard
      return '/dashboard';

    case 'admin':
      return '/secure-admin-zmp-7x9k';

    default:
      return '/';
  }
}

// Route protection - returns true if user can access the route
export function canAccessRoute(user: any, pathname: string): boolean {
  if (!user) return false;

  // Always allow verify page if not verified
  if (!user.is_verified && pathname === '/verify') {
    return true;
  }

  // Block all other routes if not verified
  if (!user.is_verified) {
    return false;
  }

  // Role-specific route protection
  switch (user.role) {
    case 'affiliate':
      return pathname.startsWith('/dashboard/affiliate') || pathname === '/dashboard/affiliate';

    case 'pharmacy_owner':
      // Block dashboard if KYC not approved
      if ((user.kyc_status !== 'approved') && pathname.startsWith('/dashboard') && !pathname.includes('/kyc')) {
        return false;
      }
      // Block dashboard if payment pending
      if ((user.subscription_status === 'pending_verification' || user.subscription_blocked) &&
        pathname.startsWith('/dashboard') && !pathname.includes('/payment')) {
        return false;
      }
      return pathname.startsWith('/dashboard') && !pathname.includes('/affiliate') && !pathname.includes('/supplier');

    case 'supplier':
      // Block dashboard if KYC not approved
      if ((user.kyc_status !== 'approved') && pathname.startsWith('/dashboard/supplier') && !pathname.includes('/kyc')) {
        return false;
      }
      // Block dashboard if payment pending
      if ((user.subscription_status === 'pending_verification' || user.subscription_blocked) &&
        pathname.startsWith('/dashboard') && !pathname.includes('/payment')) {
        return false;
      }
      // Allow payment page access
      if (pathname.includes('/payment')) {
        return true;
      }
      return pathname.startsWith('/dashboard/supplier');

    case 'cashier':
      // Cashiers can access dashboard (created by approved owners)
      return pathname.startsWith('/dashboard') && !pathname.includes('/affiliate') && !pathname.includes('/supplier');

    case 'admin':
      return pathname.startsWith('/secure-admin-zmp-7x9k');

    default:
      return false;
  }
}