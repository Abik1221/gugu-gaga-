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
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-green-600 text-xl">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6" />
            </div>
            Code Sent Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-6">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-semibold text-green-800">
                Check your email inbox
              </p>
              <p className="text-sm text-green-700">
                We've sent a 6-digit verification code to:
              </p>
              <p className="text-sm font-bold text-green-900 bg-white px-3 py-1 rounded-lg break-all">
                {email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
            <div className="p-2 bg-orange-100 rounded-full flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-orange-800">
                Don't see the email?
              </p>
              <p className="text-sm text-orange-700">
                Check your <strong>spam/junk folder</strong> - sometimes emails end up there
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>Code expires in <strong>{expiryMinutes} minutes</strong></span>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button 
            onClick={onClose} 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}