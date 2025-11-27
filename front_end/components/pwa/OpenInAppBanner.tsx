"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function OpenInAppBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [appUrl, setAppUrl] = useState("");
    const { t } = useLanguage();

    useEffect(() => {
        // Check if app is installed (running in standalone mode)
        const isInstalled =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true ||
            document.referrer.includes('android-app://');

        // Check if user dismissed the banner
        const dismissed = localStorage.getItem('open-in-app-dismissed');

        // Only show banner if:
        // 1. App is NOT installed (user is viewing in browser)
        // 2. User hasn't dismissed it
        // 3. Device likely supports PWA install
        const canInstallPWA = 'serviceWorker' in navigator;

        if (!isInstalled && !dismissed && canInstallPWA) {
            setShowBanner(false); // Don't show for non-installed users
        } else if (isInstalled) {
            // App is installed, hide banner
            setShowBanner(false);
        }

        // Get the current URL for "Open in App" functionality
        setAppUrl(window.location.href);
    }, []);

    const handleOpenInApp = () => {
        // Try to open in installed PWA
        const url = new URL(window.location.href);
        url.searchParams.set('source', 'open-in-app');
        window.location.href = url.toString();
    };

    const handleDismiss = () => {
        localStorage.setItem('open-in-app-dismissed', 'true');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed top-0 left-0 right-0 bg-emerald-600 text-white py-3 px-4 shadow-lg z-50 animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <ExternalLink className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        Get a better experience - Open in the Mesob app
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleOpenInApp}
                        size="sm"
                        className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold"
                    >
                        Open
                    </Button>
                    <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-emerald-700 rounded transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
