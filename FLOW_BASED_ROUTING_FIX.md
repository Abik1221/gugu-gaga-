# Flow-Based Routing Fix for Owner and Supplier Multi-Step Approval

## Problem
After registration/login, owners and suppliers were being redirected directly to their dashboards, but they should follow a multi-step approval process:

1. **Registration** → Email Verification
2. **KYC Submission** → Wait for Admin KYC Approval  
3. **Payment Submission** → Wait for Admin Payment Approval
4. **Dashboard Access** → Full functionality

Only **affiliates** get immediate dashboard access after email verification.

## Solution Applied

### 1. Updated Verification Page (`app/(auth)/verify/page.tsx`)
**Before**: Hardcoded redirects to dashboard
```javascript
// OLD - Wrong approach
if (userRole === "pharmacy_owner") {
  window.location.replace("/dashboard/kyc");
}
```

**After**: Uses flow logic to determine correct step
```javascript
// NEW - Flow-based routing
if (userRole === "pharmacy_owner") {
  const { getOwnerFlowStatus, getRedirectPath } = await import("@/utils/owner-flow");
  const status = await getOwnerFlowStatus();
  const redirectPath = getRedirectPath(status);
  window.location.replace(redirectPath);
}
```

### 2. Updated Login Pages
- **Owner Signin**: Uses `getOwnerFlowStatus()` to determine redirect
- **Supplier Signin**: Uses `getSupplierFlowStatus()` to determine redirect
- **Affiliate Signin**: Direct to dashboard (no approval needed)

### 3. Updated AuthRedirect Component
Added supplier flow logic similar to existing owner flow logic:
```javascript
if (user.role === "supplier") {
  const { getSupplierFlowStatus, getRedirectPath } = await import("@/utils/supplier-flow");
  const status = await getSupplierFlowStatus();
  const redirectPath = getRedirectPath(status);
  router.replace(redirectPath);
}
```

### 4. Updated Middleware
- Fixed path matching for supplier routes
- Proper fallback redirects for flow-based routing

## Flow Logic Details

### Owner Flow (`utils/owner-flow.ts`)
```javascript
// Checks user status and returns appropriate step
getOwnerFlowStatus() → "kyc_pending" | "payment_pending" | "approved"

// Maps status to correct page
getRedirectPath(status) → {
  "kyc_pending": "/dashboard/kyc",
  "payment_pending": "/dashboard/payment", 
  "approved": "/dashboard/owner"
}
```

### Supplier Flow (`utils/supplier-flow.ts`)
```javascript
// Checks KYC and payment status
getSupplierFlowStatus() → {
  step: "kyc_pending" | "payment_pending" | "approved",
  can_access_dashboard: boolean
}

// Maps status to correct page  
getRedirectPath(status) → {
  "kyc_pending": "/dashboard/supplier-kyc",
  "payment_pending": "/dashboard/supplier-payment",
  "approved": "/dashboard/supplier"
}
```

## User Journey Now

### 🏪 **Pharmacy Owner Journey**
1. Register → Email Verification
2. **KYC Page** (`/dashboard/kyc`) → Submit documents
3. **Payment Page** (`/dashboard/payment`) → Submit payment code (after admin approves KYC)
4. **Dashboard** (`/dashboard/owner`) → Full access (after admin verifies payment)

### 🚚 **Supplier Journey**  
1. Register → Email Verification
2. **KYC Page** (`/dashboard/supplier-kyc`) → Submit documents
3. **Payment Page** (`/dashboard/supplier-payment`) → Submit payment (after admin approves KYC)
4. **Dashboard** (`/dashboard/supplier`) → Full access (after admin verifies payment)

### 👥 **Affiliate Journey**
1. Register → Email Verification  
2. **Dashboard** (`/dashboard/affiliate`) → Immediate access ✅

## Backend Integration
The flow logic reads from the backend API (`/api/v1/auth/me`) to check:
- `kyc_status`: "not_submitted" | "pending" | "approved" | "rejected"
- `subscription_status`: "awaiting_kyc" | "pending_verification" | "blocked" | "active"
- `subscription_blocked`: boolean

## Benefits
- ✅ **Proper approval workflow** - Users see correct step based on admin approvals
- ✅ **No premature dashboard access** - Owners/suppliers can't bypass approval process
- ✅ **Clear user guidance** - Each page shows what action is needed
- ✅ **Admin control** - Dashboard access only after both KYC and payment approval
- ✅ **Consistent routing** - Same logic across verification, login, and navigation

## Files Modified
- `front_end/app/(auth)/verify/page.tsx` - Flow-based verification redirects
- `front_end/app/(auth)/owner-signin/page.tsx` - Owner flow integration
- `front_end/app/(auth)/supplier-signin/page.tsx` - Supplier flow integration  
- `front_end/components/auth/auth-redirect.tsx` - Added supplier flow logic
- `front_end/middleware.ts` - Updated path matching

The fix ensures owners and suppliers follow the proper multi-step approval process instead of getting immediate dashboard access.