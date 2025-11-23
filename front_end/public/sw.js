// Version will be auto-updated on each deployment
// Update this when you release a new version
const VERSION = "v2.0.0";
const BUILD_TIME = "2025-11-23T17:52:00";
const CACHE_NAME = `mesobai-cache-${VERSION}-${BUILD_TIME}`;
const RUNTIME_CACHE = `mesobai-runtime-${VERSION}`;

const ASSET_CACHE = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-icon.png",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  console.log(`[SW] Installing version ${VERSION} (${BUILD_TIME})`);
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching app shell");
        return cache.addAll(ASSET_CACHE).catch((err) => {
          console.warn("[SW] Cache failed for some assets", err);
          // Don't fail installation if some assets fail to cache
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log("[SW] Skip waiting - activate immediately");
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log(`[SW] Activating version ${VERSION}`);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        console.log("[SW] Clearing old caches");
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete any cache that doesn't match current version
            if (cacheName.startsWith("mesobai-") && cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
            return undefined;
          })
        );
      })
      .then(() => {
        console.log("[SW] Claiming clients");
        return self.clients.claim();
      })
      .then(() => {
        // Notify all clients about the update
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "SW_UPDATED",
              version: VERSION,
              buildTime: BUILD_TIME,
            });
          });
        });
      })
  );
});

// Fetch event - network first, then cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip caching for API requests
  if (request.url.includes("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Navigation requests (page loads)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone).catch(() => {
                /* noop */
              });
            });
          }
          return response;
        })
        .catch(async () => {
          // Try cache if network fails
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          // Fallback to offline page
          return caches.match("/offline") || new Response("Offline", { status: 503 });
        })
    );
    return;
  }

  // For all other requests - cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached version if available
      if (cached) {
        // Fetch in background to update cache
        fetch(request).then((response) => {
          if (response.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, response).catch(() => {
                /* noop */
              });
            });
          }
        }).catch(() => {
          /* noop */
        });
        return cached;
      }

      // Fetch from network if not cached
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone).catch(() => {
                /* noop */
              });
            });
          }
          return response;
        })
        .catch(() => {
          return new Response("Resource not available offline", { status: 503 });
        });
    })
  );
});

// Message event - handle messages from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
