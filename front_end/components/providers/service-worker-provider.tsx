"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export function ServiceWorkerProvider() {
  const { show } = useToast();

  useEffect(() => {
    // Allow in both development and production for testing
    // if (process.env.NODE_ENV !== "production") {
    //   return;
    // }

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | undefined;

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[SW] Service worker registered successfully");

        // Listen for updates from the service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "SW_UPDATED") {
            console.log(`[SW] New version detected: ${event.data.version}`);
            show({
              variant: "default",
              title: "🎉 New version available!",
              description: "Click to refresh and get the latest features.",
              duration: 10000,
              onClick: () => {
                window.location.reload();
              },
            });
          }
        });

        // Check for updates more frequently (every 30 seconds)
        setInterval(() => {
          registration?.update();
        }, 30000);

        registration.addEventListener?.("updatefound", () => {
          const installing = registration?.installing;
          console.log("[SW] Update found! Installing new version...");

          installing?.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              // New version available
              console.log("[SW] New version installed! Ready to activate.");

              // Show notification to user
              show({
                variant: "success",
                title: "✨ App Updated!",
                description: "A new version is ready. Refresh to update.",
                duration: 15000,
                onClick: () => {
                  // Tell service worker to skip waiting and activate immediately
                  installing.postMessage({ type: "SKIP_WAITING" });
                  window.location.reload();
                },
              });
            }
          });
        });

        // Force immediate update check
        registration.update();
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
  }, [show]);

  return null;
}
