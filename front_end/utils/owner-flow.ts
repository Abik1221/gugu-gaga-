import { getAuthJSON } from "./api";

export type OwnerFlowStatus = "kyc_pending" | "payment_pending" | "approved";

export async function getOwnerFlowStatus(): Promise<OwnerFlowStatus> {
  try {
    const response = await getAuthJSON("/api/v1/auth/me");
    
    // Check if user is verified first
    if (!response.is_verified) {
      return "kyc_pending"; // Will redirect to verification
    }
    
    // Check KYC status
    if (!response.kyc_status || response.kyc_status === "not_submitted" || response.kyc_status === "pending" || response.kyc_status === "rejected") {
      return "kyc_pending";
    }
    
    // Check subscription/payment status
    if (response.subscription_status === "awaiting_kyc" || 
        response.subscription_status === "pending_verification" ||
        response.subscription_status === "blocked" ||
        response.subscription_blocked) {
      return "payment_pending";
    }
    
    return "approved";
  } catch (error) {
    return "kyc_pending";
  }
}

export function getRedirectPath(status: OwnerFlowStatus): string {
  switch (status) {
    case "kyc_pending":
      return "/dashboard/kyc";
    case "payment_pending":
      return "/dashboard/payment";
    case "approved":
      return "/dashboard/owner";
    default:
      return "/dashboard/kyc";
  }
}
