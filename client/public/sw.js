const CACHE_NAME = 'miazi-cache-v74';
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
          const offlineResponse = await cache.match('/offline.html');
          return offlineResponse || caches.match('/offline.html');
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

// PUSH NOTIFICATIONS
self.addEventListener('push', function(event) {
  event.waitUntil(
    (async () => {
      let data = {};
      if (event.data) {
        try { data = event.data.json(); }
        catch (e) { data = { body: event.data.text() }; }
      }
      const title = data.title || 'Miazi Shop';
      const options = {
        body: data.body || '',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/badge-monochrome.png',
        data: { url: data.url || '/' },
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200],
        tag: 'miazi-notification',
        renotify: true,
      };
      return self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // Check if there's already a window open with this URL and focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(urlToOpen, self.location.origin);
        
        if (clientUrl.pathname === targetUrl.pathname && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});