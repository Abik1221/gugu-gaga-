"use client";

import { useEffect, useState } from "react";
import { UpdateDialog } from "@/components/ui/update-dialog";

export function ServiceWorkerProvider() {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Allow in both development and production for testing
    // if (process.env.NODE_ENV !== "production") {
    //   return;
    // }

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        setRegistration(reg);

        console.log("[SW] Service worker registered successfully");

        // Listen for updates from the service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "SW_UPDATED") {
            console.log(`[SW] New version detected: ${event.data.version}`);
            setShowUpdateDialog(true);
          }
        });

        // Check for updates more frequently (every 30 seconds)
        setInterval(() => {
          reg.update();
        }, 30000);

        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          console.log("[SW] Update found! Installing new version...");

          installing?.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              // New version available
              console.log("[SW] New version installed! Ready to activate.");
              setShowUpdateDialog(true);
            }
          });
        });

        // Force immediate update check
        reg.update();
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    void registerServiceWorker();

    return () => {
      registration?.update().catch(() => {
        /* noop */
      });
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateDialog(false);
  };

  return (
    <UpdateDialog
      open={showUpdateDialog}
      onUpdate={handleUpdate}
      onDismiss={handleDismiss}
    />
  );
}
