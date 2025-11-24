"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chrome, Globe, Share, MoreVertical, Menu } from "lucide-react";
import { useEffect, useState } from "react";

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
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Share className="w-6 h-6 text-blue-500" />
                        </div>
                        <p>1. Tap the <strong>Share</strong> button in the menu bar.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-xl">+</div>
                        </div>
                        <p>2. Scroll down and select <strong>Add to Home Screen</strong>.</p>
                    </div>
                </div>
            );
        }

        if (browser === "firefox" && os === "android") {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <MoreVertical className="w-6 h-6 text-orange-500" />
                        </div>
                        <p>1. Tap the <strong>Menu</strong> icon (three dots).</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Globe className="w-6 h-6 text-orange-500" />
                        </div>
                        <p>2. Select <strong>Install</strong>.</p>
                    </div>
                </div>
            );
        }

        if (browser === "firefox" && os === "desktop") {
            return (
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Firefox on desktop doesn't support automatic app installation.
                    </p>
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        <strong>Tip:</strong> For the best experience, we recommend using <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
                    </div>
                </div>
            );
        }

        if (browser === "edge" || browser === "chrome") {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <MoreVertical className="w-6 h-6 text-gray-600" />
                        </div>
                        <p>1. Click the <strong>Menu</strong> icon (three dots) or the <strong>App Available</strong> icon in the address bar.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Chrome className="w-6 h-6 text-gray-600" />
                        </div>
                        <p>2. Select <strong>Install MesobAI</strong>.</p>
                    </div>
                </div>
            );
        }

        // Default/Other
        return (
            <div className="space-y-4">
                <p>To install this app:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                    <li>Look for an <strong>Install</strong> or <strong>Add to Home Screen</strong> option in your browser menu.</li>
                    <li>Or try using <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> for the best experience.</li>
                </ul>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Install MesobAI</DialogTitle>
                    <DialogDescription>
                        Follow these steps to install the app on your device for a better experience.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {getInstructions()}
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)}>Got it</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
