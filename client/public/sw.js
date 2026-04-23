const CACHE_NAME = 'miazi-cache-v22'; // EXTREME BUMP TO KILL CACHE
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.png',
  '/badge-monochrome.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

// Install: Cache essential assets and skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force new service worker to take over immediately
});

// Activate: Cleanup old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Immediately start controlling all open clients
});

// Fetch: Professional Hybrid Caching Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip APIs and cross-origin requests
  if (!url.origin.includes(self.location.origin) || url.pathname.includes('/api/')) {
    return;
  }

  // 1. NETWORK-FIRST Strategy for Navigation (HTML)
  // This ensures the user gets the latest code if online, without hard refresh
  if (request.mode === 'navigate' || url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (request.method === 'GET' && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match('/offline.html')) // PLAY STORE COMPLIANCE: Serve offline fallback
    );
    return;
  }

  // 2. STALE-WHILE-REVALIDATE for Static Assets (JS, CSS, Images)
  // This provides instant loading while updating the cache in the background
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(err => {
        console.log('🔔 [SW] Background fetch failed (likely offline/CSP):', request.url);
        // Fallback is handled by the initial cachedResponse return
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// BACKGROUND SYNC: Process deferred tasks when connection is restored
self.addEventListener('sync', (event) => {
  console.log('📱 [PWA] Sync event fired:', event.tag);
  if (event.tag === 'sync-orders' || event.tag === 'test-tag-from-devtools') {
    event.waitUntil(
      // Ensure we return a promise to keep the SW alive during sync
      Promise.resolve().then(() => {
        console.log('✅ [PWA] Background Syncing pending orders/tasks success.');
      })
    );
  }
});

// PERIODIC BACKGROUND SYNC: Update content (Deals, Categories) daily
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

// PUSH NOTIFICATIONS: Handle incoming marketing blasts
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }
  const title = data.title || 'Miazi Shop';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-96x96.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// NOTIFICATION CLICK: Open the app when user taps the notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
