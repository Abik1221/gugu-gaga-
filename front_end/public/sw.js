const CACHE_NAME = "zemen-pharma-cache-v1";
const ASSET_CACHE = [
  "/",
  "/offline",
  "/icons/icon-192x192.jpg",
  "/icons/icon-512x512.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSET_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
            return undefined;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch(() => {
              /* noop */
            });
          });

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);

          if (cached) {
            return cached;
          }

          return caches.match("/offline");
        })
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch(() => {
              /* noop */
            });
          });

          return response;
        })
        .catch(() => cached);
    })
  );
});
