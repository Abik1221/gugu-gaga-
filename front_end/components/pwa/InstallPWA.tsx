"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      <Button
        onClick={handleInstall}
        className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Download className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}

export function InstallButton({ className = "", fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (isInstalled) return null;
  
  // If no prompt available, show not supported message
  if (!deferredPrompt) {
    return (
      <Button
        disabled
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 border-gray-200 text-gray-400 ${fullWidth ? 'w-full' : ''} ${className}`}
        title="PWA not supported on this browser"
      >
        <Download className="w-4 h-4" />
        <span className={fullWidth ? "Not Supported" : "hidden sm:inline"}>Not Supported</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <Download className="w-4 h-4" />
      <span className={fullWidth ? "" : "hidden sm:inline"}>Install App</span>
    </Button>
  );
}