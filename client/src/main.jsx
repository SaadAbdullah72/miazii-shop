import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'
import App from './App.jsx'

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
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
}
