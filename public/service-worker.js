const CACHE_NAME = 'farmetra-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event: cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching application shell assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: clear old caches to prevent stale bundles
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing deprecated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: apply Cache-First with Network fallback for assets, Network-Only for dynamic APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Always bypass cache for POST requests and backend API endpoints
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Cache-First (with Stale-While-Revalidate background sync) for client-side assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve cached version immediately, but refresh cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => { /* No-op on network failure while offline */ });
        
        return cachedResponse;
      }

      // If cache miss, fetch from network and dynamically cache
      return fetch(event.request).then((networkResponse) => {
        // Cache only standard valid responses from local origin
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((err) => {
        // Offline navigation fallback: serve root index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        throw err;
      });
    })
  );
});
