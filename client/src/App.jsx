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

// High-performance loading fallback
const PageLoader = () => (
    <div className="flex flex-col justify-center items-center py-64 bg-slate-50 min-h-screen text-center">
        <Loader size={40} className="animate-spin text-yellow-500 mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading App Experience...</p>
    </div>
);

import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './slices/authSlice';

function App() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    // Sync profile data on app mount to ensure cross-device consistency
    React.useEffect(() => {
        if (userInfo) {
            dispatch(getProfile());
        }
    }, [dispatch]); // Only on mount, don't depend on userInfo to avoid loops

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
