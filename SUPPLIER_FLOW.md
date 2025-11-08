# Supplier Onboarding Flow

## Overview
Professional supplier onboarding system with strict flow control ensuring users complete each step before accessing the next.

## Flow Steps

### 1. Registration → KYC Pending
- User registers as supplier
- Automatically redirected to `/dashboard/supplier-kyc`
- Must submit KYC documents
- Status: `kyc_pending`

### 2. KYC Approval → Payment Pending  
- Admin reviews and approves KYC
- User automatically redirected to `/dashboard/supplier-payment`
- Must submit payment code
- Status: `payment_pending`

### 3. Payment Verification → Dashboard Access
- Admin verifies payment code
- User gains access to `/dashboard/supplier`
- Full supplier functionality unlocked
- Status: `approved`

## Key Components

### Flow Control
- `utils/supplier-flow.ts` - Status checking and redirect logic
- `components/supplier-flow-guard.tsx` - Route protection component
- `app/(dashboard)/dashboard/(supplier-flow)/layout.tsx` - Flow wrapper

### Pages
- `/dashboard/supplier-status` - Progress tracking page
- `/dashboard/supplier-kyc` - KYC submission and status
- `/dashboard/supplier-payment` - Payment code submission
- `/dashboard/supplier` - Full supplier dashboard (only after approval)

### Backend Integration
- `SupplierOnboardingAPI.getKYCStatus()` - Check KYC status
- `SupplierOnboardingAPI.getPaymentStatus()` - Check payment status
- Admin APIs for approval/rejection

## Flow Logic

```typescript
// Status determination
if (kyc_status !== 'approved') {
  redirect('/dashboard/supplier-kyc')
} else if (payment_status !== 'verified') {
  redirect('/dashboard/supplier-payment')  
} else {
  allow_dashboard_access = true
}
```

## Admin Actions Required

1. **KYC Approval**: Admin must approve KYC in admin panel
2. **Payment Verification**: Admin must verify payment code

## User Experience

- Clear progress tracking on status page
- Automatic redirects prevent skipping steps
- Status badges show current progress
- Next action guidance provided
- Professional error handling

## Security Features

- Route-level protection via flow guard
- Status validation on every page load
- Automatic redirects prevent unauthorized access
- Multi-step verification process