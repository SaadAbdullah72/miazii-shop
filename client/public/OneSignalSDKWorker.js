importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
// OneSignal Service Worker Sync v1.0.5 (Aggressive Wakeup Edition)
const CACHE_NAME = 'miazi-cache-v91';
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
      self.registration.navigationPreload ? self.registration.navigationPreload.enable() : Promise.resolve()
    ])
  );
  console.log('💎 [SW v91] Active and listening for Push.');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.origin.includes(self.location.origin) || url.pathname.includes('/api/') || url.pathname.includes('/admin')) {
    return;
  }

  if (request.mode === 'navigate' || url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(
      (async () => {
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
          return (await cache.match('/')) || (await cache.match('/index.html'));
        }
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(err => {
        if (request.destination === 'image') return caches.match('/logo-192.png');
      });
      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    console.log('✅ [SW] Keep-Alive Pulse Received');
  }
});
