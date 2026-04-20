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
        // 1. Check if Service Worker and Push are supported
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push messaging is not supported in this browser.');
            return;
        }

        // 2. Wait for service worker registration to be ready
        const registration = await navigator.serviceWorker.ready;

        // 3. Check for existing subscription
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // 4. Request Permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied.');
                return;
            }

            // 5. Subscribe to Push Service
            const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
            if (!publicVapidKey) {
                console.error('VITE_VAPID_PUBLIC_KEY is not defined in .env');
                return;
            }

            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
        }

        // 6. Send subscription to our backend
        await api.post('/api/push/subscribe', subscription);
        console.log('🚀 [Push] Successfully subscribed to marketing notifications.');
        
    } catch (error) {
        console.error('❌ [Push] Failed to subscribe to push notifications:', error);
    }
};
