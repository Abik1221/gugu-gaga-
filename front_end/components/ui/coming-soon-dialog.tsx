"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Construction, Clock } from "lucide-react";

interface ComingSoonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function ComingSoonDialog({
    open,
    onOpenChange,
    title = "Coming Soon",
    description = "This feature is currently under development and will be available soon. Stay tuned for updates!",
}: ComingSoonDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white p-6">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl text-gray-900 flex items-center justify-center gap-2">
                        <Construction className="w-6 h-6 text-emerald-600" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-10 h-10 text-emerald-600 animate-pulse" />
                        </div>
                        <p className="text-center text-gray-600 text-sm leading-relaxed max-w-sm">
                            {description}
                        </p>
                    </div>
                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => onOpenChange(false)}
                    >
                        Got it
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
