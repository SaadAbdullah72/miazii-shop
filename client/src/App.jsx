import React, { lazy, Suspense } from 'react'; // Deployment Sync for Commit 7099b82
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';

// Lazy loading pages for mobile performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const OtpVerificationPage = lazy(() => import('./pages/OtpVerificationPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const PlaceOrderPage = lazy(() => import('./pages/PlaceOrderPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const DownloadPage = lazy(() => import('./pages/DownloadPage'));

// High-performance loading fallback
const PageLoader = () => <div className="min-h-screen bg-[#f5f5f5]" />;

import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './slices/authSlice';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [deferredPrompt, setDeferredPrompt] = React.useState(null);
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);
    const [showOnlineStatus, setShowOnlineStatus] = React.useState(!navigator.onLine);

    React.useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowOnlineStatus(true);
            
            // Clear API cache on reconnect so fresh data is loaded
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('api_cache_')) {
                    localStorage.removeItem(key);
                    i--;
                }
            }
            
            // Auto hide online success notification after 3 seconds
            const timer = setTimeout(() => {
                setShowOnlineStatus(false);
            }, 3000);
            return () => clearTimeout(timer);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowOnlineStatus(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const hasSyncedProfile = React.useRef(false);
    // Sync profile data and handle PWA installation prompt
    React.useEffect(() => {
        if (userInfo && !hasSyncedProfile.current) {
            dispatch(getProfile());
            hasSyncedProfile.current = true;
        }

        // --- OneSignal Identity Sync ---
        if (userInfo && userInfo._id) {
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.login(userInfo._id.toString());
                console.log('✅ [OneSignal] User identity synced:', userInfo._id);
            });
        }

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(reg => {
                if (reg.active) {
                    reg.active.postMessage({ type: 'KEEP_ALIVE' });
                }
            });
        }
    }, [dispatch, userInfo]);

    React.useEffect(() => {


        // Keep-Alive Ping for Service Worker
        const keepAlive = () => {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'KEEP_ALIVE' });
            }
        };
        const interval = setInterval(keepAlive, 50000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, [dispatch, userInfo]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-[#f5f5f5] relative">
                {/* DYNAMIC OFFLINE / RECONNECT BAR */}
                {showOnlineStatus && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-xs animate-in slide-in-from-top duration-300">
                        {isOnline ? (
                            <div className="bg-emerald-950/95 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
                                <div className="flex items-center gap-2.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-wider">Back Online — Synced</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900/95 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
                                <div className="flex items-center gap-2.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-wider">Offline — Serving Cache</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <Header />
                <main className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/category/:slug" element={<CategoryPage />} />
                            <Route path="/product/:id" element={<ProductDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/verify-otp" element={<OtpVerificationPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                            <Route path="/refund-policy" element={<RefundPolicyPage />} />
                            <Route path="/about-us" element={<AboutUsPage />} />
                            <Route path="/download" element={<DownloadPage />} />

                            {/* Registered User Protected Routes */}
                            <Route path="" element={<PrivateRoute />}>
                                <Route path="/shipping" element={<ShippingPage />} />
                                <Route path="/placeorder" element={<PlaceOrderPage />} />
                                <Route path="/order/:id" element={<OrderDetailsPage />} />
                                <Route path="/myorders" element={<MyOrdersPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>

                            {/* Admin ONLY Protected Routes */}
                            <Route path="" element={<AdminRoute />}>
                                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </main>
                <Suspense fallback={null}>
                    <ContactPage />
                </Suspense>
                <BottomNavigation />
                <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
        </Router>
    );
}

export default App;
