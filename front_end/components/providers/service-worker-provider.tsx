"use client";

import { useEffect } from "react";

export function ServiceWorkerProvider() {
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

            // Show native notification instead of toast to avoid SSR issues
            if (confirm("🎉 New version available! Click OK to refresh and get the latest features.")) {
              window.location.reload();
            }
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

              // Show native notification
              if (confirm("✨ App Updated! A new version is ready. Click OK to refresh now.")) {
                // Tell service worker to skip waiting and activate immediately
                installing.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              }
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
  }, []);

  return null;
}
