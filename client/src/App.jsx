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

// High-performance loading fallback
const PageLoader = () => (
    <div className="flex flex-col justify-center items-center py-64 bg-slate-50 min-h-screen text-center">
        <Loader size={40} className="animate-spin text-yellow-500 mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading App Experience...</p>
    </div>
);

import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './slices/authSlice';
import { subscribeToPush } from './utils/pushService';

function App() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [deferredPrompt, setDeferredPrompt] = React.useState(null);

    const hasSyncedProfile = React.useRef(false);
    // Sync profile data and handle PWA installation prompt
    React.useEffect(() => {
        if (userInfo && !hasSyncedProfile.current) {
            dispatch(getProfile());
            hasSyncedProfile.current = true;
        }

        // Initialize Push Notification Subscription
        subscribeToPush();

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
            <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
                <Header />
                <main className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/category/:slug" element={<CategoryPage />} />
                            <Route path="/product/:id" element={<ProductDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/verify-otp" element={<OtpVerificationPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/shipping" element={<ShippingPage />} />
                            <Route path="/placeorder" element={<PlaceOrderPage />} />
                            <Route path="/order/:id" element={<OrderDetailsPage />} />
                            <Route path="/myorders" element={<MyOrdersPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                            <Route path="/refund-policy" element={<RefundPolicyPage />} />
                            <Route path="/about-us" element={<AboutUsPage />} />
                            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
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
