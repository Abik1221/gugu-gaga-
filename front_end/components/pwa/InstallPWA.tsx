"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, X, Smartphone } from "lucide-react";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
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
      
      // Show popup after 30 seconds of browsing
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallDialog(true);
        }
      }, 30000);
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
    setShowInstallDialog(false);
  };

  const handleDismiss = () => {
    setShowInstallDialog(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Image
              src={logoImage}
              alt="Mesob Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <DialogTitle className="text-xl">Install Mesob App</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Get the full Mesob experience! Install our app for:
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Faster loading and offline access</li>
              <li>• Native app experience</li>
              <li>• Quick access from your home screen</li>
              <li>• Push notifications for updates</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-4">
          <Button onClick={handleInstall} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InstallButton() {
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

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="hidden lg:flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
    >
      <Smartphone className="w-4 h-4" />
      Install App
    </Button>
  );
}