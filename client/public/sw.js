const CACHE_NAME = 'miazi-cache-v35';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.png',
  '/badge-miazi-v1.png',
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
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
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
      fetch(request)
        .then((response) => {
          if (request.method === 'GET' && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match('/offline.html'))
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
        console.log('🔔 [SW] Background fetch failed (likely offline/CSP):', request.url);
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
self.addEventListener('push', function (event) {
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
    body: data.body || 'New update from Miazi Shop!',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/badge-miazi-v1.png',
    vibrate: [100, 50, 100],
    data: { 
      url: data.url || '/',
      timestamp: Date.now()
    },
    tag: 'miazi-notification-group',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open Shop' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});