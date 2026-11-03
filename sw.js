const CACHE_NAME = 'cit-ops-v4';

// Install event - force active immediately
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Activate event - delete old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy for live updates
self.addEventListener('fetch', (e) => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  // Don't intercept API requests
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const resCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resCopy));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
