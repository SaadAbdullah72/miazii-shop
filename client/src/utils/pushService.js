import api from './axiosConfig';

/**
 * Utility to handle PWA Push Notification registration and permissions
 */

// Helper to convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeToPush = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
      
      const registration = await navigator.serviceWorker.ready;
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
  
      // Check existing subscription
      let subscription = await registration.pushManager.getSubscription();
      
      // Re-subscribe if expired or missing
      if (!subscription) {
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
            console.error('VITE_VAPID_PUBLIC_KEY is missing');
            return;
        }
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
      }
  
      // Send to backend
      await api.post('/api/push/subscribe', subscription);
      console.log('🚀 [Push] Successfully synced subscription with backend.');
  
    } catch (err) {
      console.error('Push registration failed:', err);
    }
};

