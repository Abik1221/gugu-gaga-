import { getAuthJSON } from "./api";

export type OwnerFlowStatus = "kyc_pending" | "payment_pending" | "approved";

export async function getOwnerFlowStatus(): Promise<OwnerFlowStatus> {
  try {
    const response = await getAuthJSON("/api/v1/auth/me");
    
    if (response.kyc_status !== "approved") {
      return "kyc_pending";
    }
    
    if (response.subscription_status === "awaiting_payment" || 
        response.subscription_status === "pending_verification" ||
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
      return "/dashboard/owner-kyc";
    case "payment_pending":
      return "/dashboard/owner-payment";
    case "approved":
      return "/dashboard/owner";
    default:
      return "/dashboard/owner-kyc";
  }
}
