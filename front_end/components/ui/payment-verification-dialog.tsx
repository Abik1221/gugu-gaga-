"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface PaymentVerificationDialogProps {
  orderId: string;
  paymentCode: string;
  onVerify: () => void;
  onReject: () => void;
  children: React.ReactNode;
}

export function PaymentVerificationDialog({
  orderId,
  paymentCode,
  onVerify,
  onReject,
  children
}: PaymentVerificationDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const handleVerify = () => {
    onVerify();
    setOpen(false);
  };

  const handleReject = () => {
    onReject();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.dialogs.verifyPaymentTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{t.dialogs.orderIdLabel}</p>
            <p className="font-medium">{orderId}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-2">{t.dialogs.paymentCodeLabel}</p>
            <Badge variant="outline" className="font-mono text-lg px-3 py-1">
              {paymentCode}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {t.dialogs.verifyPaymentMessage}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.dialogs.cancelButton}
            </Button>
            <Button variant="destructive" onClick={handleReject} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              {t.dialogs.rejectPaymentButton}
            </Button>
            <Button onClick={handleVerify} className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              {t.dialogs.verifyPaymentButton}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}