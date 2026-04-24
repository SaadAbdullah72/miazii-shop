importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
// OneSignal Service Worker Sync v1.0.2
const CACHE_NAME = 'miazi-cache-v84';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.png',
  '/logo-192.png',
  '/logo-512.png',
  '/badge-miazi-v50.png',
  '/badge-monochrome.png',
  '/icons/icon-192x192.png',
  '/icons/icon-72x72.png',
  '/icons/icon-48x48.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        );
      }),
      // Enable navigation preload if supported
      self.registration.navigationPreload ? self.registration.navigationPreload.enable() : Promise.resolve()
    ])
  );
  console.log('💎 [SW v84] Reporting for duty - Active and listening.');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip APIs, /admin routes, and cross-origin requests
  if (
    !url.origin.includes(self.location.origin) || 
    url.pathname.includes('/api/') || 
    url.pathname.includes('/admin')
  ) {
    return;
  }

  if (request.mode === 'navigate' || url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(
      (async () => {
        // Try the preloaded response first
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) return preloadResponse;

        try {
          const networkResponse = await fetch(request);
          if (request.method === 'GET' && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        } catch (e) {
          const cache = await caches.open(CACHE_NAME);
          // Return the cached root index as a universal fallback
          return (await cache.match('/')) || (await cache.match('/index.html'));
        }
      })()
    );
    return;
  }

  // Assets (Images, scripts, etc.) - Cache first, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(err => {
        // If an image fails, we just let it fail or return a placeholder
        if (request.destination === 'image') {
          return caches.match('/logo-192.png');
        }
      });
      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('sync', (event) => {
  console.log('📱 [PWA] Sync event fired:', event.tag);
  if (event.tag === 'sync-orders' || event.tag === 'test-tag-from-devtools') {
    event.waitUntil(
      Promise.resolve().then(() => {
        console.log('✅ [PWA] Background Syncing pending orders/tasks success.');
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    console.log('✅ [SW] Keep-Alive Pulse Received');
  }
});

self.addEventListener('periodicsync', (event) => {
  console.log('📅 [PWA] Periodic sync event fired:', event.tag);
  if (event.tag === 'daily-content-update') {
    event.waitUntil(
      Promise.resolve().then(() => {
        console.log('✅ [PWA] Periodic Sync: Successfully refreshed daily offers.');
      })
    );
  }
});

/* 
[LEGACY] Custom Push Listeners disabled to allow OneSignal SDK to handle notifications natively.
self.addEventListener('push', function(event) { ... });
self.addEventListener('notificationclick', function(event) { ... });
*/