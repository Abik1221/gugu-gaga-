"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chrome, Globe, Share, MoreVertical, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";

interface PWAInstructionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PWAInstructionsDialog({
    open,
    onOpenChange,
}: PWAInstructionsDialogProps) {
    const [browser, setBrowser] = useState<"chrome" | "safari" | "firefox" | "edge" | "other">("other");
    const [os, setOs] = useState<"ios" | "android" | "desktop">("desktop");
    const { t } = useLanguage();

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();

        // Detect OS
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setOs("ios");
        } else if (/android/.test(userAgent)) {
            setOs("android");
        } else {
            setOs("desktop");
        }

        // Detect Browser
        if (/edg/.test(userAgent)) {
            setBrowser("edge");
        } else if (/chrome/.test(userAgent) && !/edg/.test(userAgent)) {
            setBrowser("chrome");
        } else if (/firefox/.test(userAgent)) {
            setBrowser("firefox");
        } else if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
            setBrowser("safari");
        } else {
            setBrowser("other");
        }
    }, []);

    const getInstructions = () => {
        if (os === "ios") {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Share className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-black">{t.pwaInstall.iosStep1}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-xl text-green-600">+</div>
                        </div>
                        <p className="text-black">{t.pwaInstall.iosStep2}</p>
                    </div>
                </div>
            );
        }

        if (browser === "firefox" && os === "android") {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <MoreVertical className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-black">{t.pwaInstall.androidStep1}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Globe className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-black">{t.pwaInstall.androidStep2}</p>
                    </div>
                </div>
            );
        }

        if (browser === "firefox" && os === "desktop") {
            return (
                <div className="space-y-4">
                    <p className="text-black">
                        {t.pwaInstall.firefoxMessage}
                    </p>
                </div>
            );
        }

        if (browser === "edge" || browser === "chrome") {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <MoreVertical className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-black">{t.pwaInstall.desktopStep1} {t.pwaInstall.desktopStep2}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Chrome className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-black">{t.pwaInstall.androidStep2}</p>
                    </div>
                </div>
            );
        }

        // Default/Other
        return (
            <div className="space-y-4">
                <p className="text-black">{t.pwaInstall.defaultMessage}</p>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white text-black border-green-100" showCloseButton={false}>
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-red-50 transition-colors z-50"
                    aria-label="Close"
                >
                    <X className="h-6 w-6 text-red-600" />
                </button>
                <DialogHeader>
                    <DialogTitle className="text-black text-xl">{t.pwaInstall.installTitle}</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {t.pwaInstall.installDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {getInstructions()}
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)} className="bg-green-600 hover:bg-green-700 text-white">{t.pwaInstall.gotIt}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
