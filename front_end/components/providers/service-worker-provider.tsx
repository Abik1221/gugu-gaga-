"use client";

import { useEffect } from "react";

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | undefined;

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Check for updates every 60 seconds
        setInterval(() => {
          registration?.update();
        }, 60000);

        registration.addEventListener?.("updatefound", () => {
          const installing = registration?.installing;
          installing?.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              // New version available - automatically reload after 3 seconds
              console.info("[SW] New version detected! Reloading in 3 seconds...");
              setTimeout(() => {
                window.location.reload();
              }, 3000);
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
