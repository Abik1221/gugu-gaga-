"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

interface ComingSoonDialogProps {
  children: React.ReactNode;
}

export function ComingSoonDialog({ children }: ComingSoonDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Rocket className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Coming Soon!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-gray-600">
              We're currently in testing phase and will be launching soon.
            </p>
            <p className="text-center text-sm text-gray-500">
              Stay tuned for updates!
            </p>
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Got it!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
