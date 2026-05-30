import axios from 'axios';

export const BASE_URL = (
    (typeof window !== 'undefined' && window.Capacitor) || 
    (typeof window !== 'undefined' && window.location.origin.includes('capacitor://'))
)
  ? 'https://miazi-shop.vercel.app' // Native mobile Capacitor points to remote production server
  : ''; // Web app uses relative paths/Vite proxy

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Important for cookies (JWT) on web
});

// AUTOMATIC JWT HEADER INJECTION FOR MOBILE AUTHORIZATION
api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem('userInfo') 
            ? JSON.parse(localStorage.getItem('userInfo')) 
            : null;
        const token = userInfo?.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        console.error('[AxiosConfig] Error reading token from localStorage', e);
    }
    return config;
}, (error) => Promise.reject(error));

// ROBUST INTERCEPTOR CACHE MANAGER
const CACHE_TTL = 60 * 1000; // 1 minute cache lifetime for snappy navigation

// Clean cache on mutating requests (POST, PUT, DELETE)
api.interceptors.request.use((config) => {
    const method = config.method?.toLowerCase();
    const url = config.url;

    if (method !== 'get') {
        // Clear all cached API responses when user creates/updates anything
        console.log(`[Cache] Mutating request (${method} ${url}) detected. Flushing cache...`);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('api_cache_')) {
                localStorage.removeItem(key);
                i--; // Adjust index after removal
            }
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Serve from cache if fresh
api.interceptors.request.use(async (config) => {
    if (config.method?.toLowerCase() === 'get') {
        const cacheKey = `api_cache_${config.url}_${JSON.stringify(config.params || '')}`;
        const cachedItem = localStorage.getItem(cacheKey);

        if (cachedItem) {
            try {
                const { data, timestamp } = JSON.parse(cachedItem);
                const age = Date.now() - timestamp;

                if (age < CACHE_TTL) {
                    console.log(`[Cache] Instant Load from Cache: ${config.url}`);
                    // Return a fake resolved promise containing the cached data
                    config.adapter = () => {
                        return Promise.resolve({
                            data,
                            status: 200,
                            statusText: 'OK',
                            headers: {},
                            config,
                            request: {}
                        });
                    };
                } else {
                    localStorage.removeItem(cacheKey);
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Save to cache after successful GET response
api.interceptors.response.use((response) => {
    if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
        const cacheKey = `api_cache_${response.config.url}_${JSON.stringify(response.config.params || '')}`;
        try {
            localStorage.setItem(cacheKey, JSON.stringify({
                data: response.data,
                timestamp: Date.now()
            }));
            console.log(`[Cache] Response cached: ${response.config.url}`);
        } catch (e) {
            console.warn('[Cache] Could not save to localStorage (quota or private mode)', e);
        }
    }
    return response;
}, (error) => Promise.reject(error));

export default api;
