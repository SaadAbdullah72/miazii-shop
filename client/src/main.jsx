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
