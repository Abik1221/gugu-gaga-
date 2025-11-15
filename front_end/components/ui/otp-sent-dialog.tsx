"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface OtpSentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  purpose?: "register" | "login" | "password_reset";
}

export function OtpSentDialog({ isOpen, onClose, email, purpose = "register" }: OtpSentDialogProps) {
  const purposeText = {
    register: "registration",
    login: "login", 
    password_reset: "password reset"
  }[purpose];

  const expiryMinutes = purpose === "password_reset" ? "30" : "10";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            Code Sent Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <Mail className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-800">
                Check your email inbox
              </p>
              <p className="text-sm text-emerald-700">
                We've sent a 6-digit verification code to:
              </p>
              <p className="text-sm font-semibold text-emerald-900 break-all">
                {email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">
                Don't see the email?
              </p>
              <p className="text-sm text-amber-700">
                Check your <strong>spam/junk folder</strong> - sometimes emails end up there
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock className="h-4 w-4" />
            <span>Code expires in {expiryMinutes} minutes</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700">
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}