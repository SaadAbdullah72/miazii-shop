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

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>,
)

// Registering Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW Registered', reg);
        // Automatic update logic:
        // If a new SW has been installed and is waiting (skipWaiting handled in sw.js)
        // force the page to reload once to ensure fresh assets.
        reg.onupdatefound = () => {
          const newSW = reg.installing;
          newSW.onstatechange = () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content available, reloading...');
              window.location.reload();
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
