"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PWAInstructionsDialog } from "./PWAInstructionsDialog";
import { useLanguage } from "@/contexts/language-context";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check localStorage first
    const installedFromStorage = localStorage.getItem('pwa-installed');
    if (installedFromStorage === 'true') {
      setIsInstalled(true);
      return;
    }

    // Check if already installed (running in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
    }

    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (isInstalled) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={handleInstall}
          className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
          title={t.pwaInstall.installFloating}
        >
          <Download className="w-6 h-6 text-white" />
        </Button>
      </div>
      <PWAInstructionsDialog
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
    </>
  );
}

export function InstallButton({ className = "", fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check localStorage first
    const installedFromStorage = localStorage.getItem('pwa-installed');
    if (installedFromStorage === 'true') {
      setIsInstalled(true);
      return;
    }

    // Check if already installed (running in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
    }

    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (isInstalled) return null;

  return (
    <>
      <Button
        onClick={handleInstall}
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        <Download className="w-4 h-4" />
        <span className={fullWidth ? "" : "hidden sm:inline"}>{t.pwaInstall.installButton}</span>
      </Button>
      <PWAInstructionsDialog
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
    </>
  );
}