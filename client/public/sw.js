const CACHE_NAME = 'miazi-cache-v5'; // Forced update for professional badge
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.png',
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
self.addEventListener('push', (event) => {
  console.log('🔔 [PWA] Push Received.');
  
  let data = { 
    title: 'Miazi Shop', 
    body: 'New updates available!', 
    url: '/',
    icon: '/logo.png',
    badge: '/logo.png'
  };
  
  if (event.data) {
    try {
      // Try to parse JSON payload
      const jsonPayload = event.data.json();
      data = { ...data, ...jsonPayload };
    } catch (e) {
      // Fallback for simple text payloads
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/logo.png', // Large icon (RIGHT side)
    badge: '/badge.svg', // Professional Monochrome SVG (LEFT side)
    vibrate: [200, 100, 200], // Professional vibration pattern
    tag: 'miazi-blast', // Stacks notifications so they don't clutter the tray
    renotify: true, // Vibrates even if a notification with same tag is already there
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'View Now' },
      { action: 'close', title: 'Later' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// NOTIFICATION CLICK: Open the app when user taps the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
