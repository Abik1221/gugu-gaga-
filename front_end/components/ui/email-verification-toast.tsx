"use client";
import React from "react";
import { Mail, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "./toast";

export function useEmailVerificationToast() {
  const { show } = useToast();

  const showEmailSentNotification = (email: string, purpose: "register" | "login" | "password_reset" = "register") => {
    const purposeText = {
      register: "registration",
      login: "login",
      password_reset: "password reset"
    }[purpose];

    show({
      title: (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-600" />
          <span>Check Your Email</span>
        </div>
      ) as any,
      description: (
        <div className="space-y-2">
          <p>We've sent a verification code to <strong>{email}</strong></p>
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span><strong>Check your spam folder</strong> if you don't see the email</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <Clock className="h-3 w-3" />
            <span>Code expires in {purpose === "password_reset" ? "30" : "10"} minutes</span>
          </div>
        </div>
      ) as any,
      variant: "success",
      duration: 8000
    });
  };

  const showResendCooldown = (secondsLeft: number) => {
    show({
      title: "Please Wait",
      description: `You can request a new code in ${secondsLeft} seconds`,
      variant: "default",
      duration: 3000
    });
  };

  return {
    showEmailSentNotification,
    showResendCooldown
  };
}