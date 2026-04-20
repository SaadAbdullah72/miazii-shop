const CACHE_NAME = 'miazi-cache-v3'; // Incremented version to force update
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
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
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
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================
// PUSH NOTIFICATIONS (WEB PUSH API)
// ==========================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'You have a new update from Miazii Shop!',
      icon: data.icon || '/logo.png',
      badge: data.badge || '/icons.svg',
      vibrate: [200, 100, 200, 100, 200, 100, 200], // Premium triple-pulse vibration
      data: {
        url: data.url || '/' // Store the URL to navigate when clicked
      },
      requireInteraction: true // Stays on screen until user interacts
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Miazii Shop', options)
    );
  } catch (err) {
    console.error('Push Event JSON parsing error:', err);
  }
});

// Handle Notification Clicks (Open App)
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification popup

  // Check if the payload contains a URL to redirect to
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
