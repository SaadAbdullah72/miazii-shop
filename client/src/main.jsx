import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css';

import { GoogleOAuthProvider } from '@react-oauth/google'
import { initializeMobileApp } from './utils/mobileFixes.js'

// Initializing Mobile Optimizations
initializeMobileApp();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store.js'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>,
)

// Registering Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then(reg => {
        console.log('SW Registered', reg);
        
        // Check for updates every 5 minutes
        setInterval(() => {
          reg.update();
        }, 5 * 60 * 1000);

        // BACKGROUND SYNC REGISTRATION
        if ('sync' in reg) {
          reg.sync.register('sync-orders').catch(err => console.log('Sync Reg Failed', err));
        }

        // PERIODIC SYNC REGISTRATION
        if ('periodicSync' in reg) {
          // Intervals normally around 1 day (86400000 ms)
          reg.periodicSync.register('daily-content-update', {
            minInterval: 24 * 60 * 60 * 1000, 
          }).catch(err => console.log('Periodic Sync Reg Failed', err));
        }

        reg.onupdatefound = () => {
          const newSW = reg.installing;
          newSW.onstatechange = () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content available, reloading...');
              // Service worker skipWaiting is handled in sw.js
              // so we just need to wait for controllerchange to reload
            }
          };
        };
      })
      .catch(err => console.log('SW Registration Failed', err));
  });

  // Listen for the controlling service worker changing (on skipWaiting() success)
  // [MODIFICATION] Disabled auto-reload to prevent infinite loops during OneSignal/SW conflict
  /*
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
  */
}
