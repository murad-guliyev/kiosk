const CACHE_NAME = 'cbar-currency-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Only cache same-origin http(s) requests, skip extensions and dev resources
  if (!url.startsWith('http') || url.includes('chrome-extension') || url.includes('/@') || url.includes('node_modules')) {
    return;
  }
  // Only cache image assets for offline use
  if (url.includes('/assets/money/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
  }
});
