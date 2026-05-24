import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { logout } from '../slices/authSlice';
import { 
    Loader, Package, Mail, Calendar, 
    CreditCard, ChevronRight, Eye, Info, 
    Clock, CheckCircle2, User, Truck,
    LogOut, RefreshCw, Camera, Trash2, Shield
} from 'lucide-react';
import { updateProfile } from '../slices/authSlice';
import { uploadToCloudinaryDirect } from '../utils/cloudinary';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        setIsAvatarUploading(true);
        try {
            const secureUrl = await uploadToCloudinaryDirect(file, 'profile/avatars');
            await dispatch(updateProfile({ avatar: secureUrl })).unwrap();
            toast.success('Profile picture updated!');
        } catch (err) {
            toast.error(err.message || 'Avatar upload failed');
        } finally {
            setIsAvatarUploading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('WARNING: Are you sure you want to PERMANENTLY delete your account? This action cannot be undone and all your order history will be lost.')) {
            try {
                await api.delete('/api/users/profile');
                toast.success('Your account has been deleted.');
                dispatch(logout());
                navigate('/');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Deletion failed');
            }
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/orders/myorders');
                setOrders(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrders();
        }
    }, [userInfo]);

    // Global loader removed to achieve "Instant Loading" for profile identity.
    // The specific data sections (like Orders) will handle their own loading states.

    if (!userInfo) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-start justify-center font-sans p-6 pt-24 translate-y-[-20px]">
                <div className="bg-white border border-gray-100 rounded-[3rem] p-12 text-center shadow-xl max-w-md w-full">
                    <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-lg rotate-3">
                        <User size={48} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Login Required</h1>
                    <p className="text-sm text-gray-500 mb-10 leading-relaxed">Please sign in to view your profile, track orders, and manage your account settings.</p>
                    <Link to="/login" className="block w-full py-4 bg-yellow-400 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-100">Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-sans">
            {/* CLEAN HEADER SECTION */}
            <div className="bg-white border-b border-gray-100 shadow-sm relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center text-slate-900 font-black text-3xl shadow-2xl shadow-yellow-100 border-4 border-white overflow-hidden">
                                {userInfo?.avatar ? (
                                    <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userInfo?.email ? userInfo.email.charAt(0).toUpperCase() : 'U'
                                )}
                            </div>
                            <label className={`absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-yellow-400 rounded-2xl border-4 border-white cursor-pointer shadow-xl hover:bg-yellow-400 hover:text-slate-900 transition-all ${isAvatarUploading ? 'animate-pulse opacity-50 pointer-events-none' : ''}`}>
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isAvatarUploading} />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                User Profile
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Mail size={14} className="text-yellow-500" />
                                    <span className="text-sm font-bold tracking-tight uppercase">{userInfo?.email || 'Sign In Required'}</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        dispatch(logout());
                                        navigate('/');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all w-fit"
                                >
                                    <LogOut size={12} /> Sign Out Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                {/* ORDER HISTORY SECTION */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Order History</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Your Past Purchases</p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
                        <Loader size={30} className="animate-spin text-yellow-500 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Purchases...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-2">No Orders Yet</p>
                        <p className="text-sm text-gray-400">You haven't placed any orders yet.</p>
                        <Link to="/" className="mt-8 inline-block px-10 py-3 bg-yellow-400 text-slate-900 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
                                    {/* Left Side: Order Meta Info */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                                            <h3 className="font-semibold text-slate-700 tracking-wide text-xs font-mono uppercase bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                #{order._id.toUpperCase()}
                                            </h3>
                                        </div>
                                        <div className="flex items-center flex-wrap gap-3 sm:gap-5 text-xs text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" />
                                                <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block" />
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard size={14} className="text-slate-400" />
                                                <span className="font-semibold text-slate-800">৳{order.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Status Badges & Action */}
                                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                        {/* Payment Status Dot */}
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>

                                        {/* Delivery Status Dot */}
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <span className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'}`} />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                                {order.isDelivered ? 'Delivered' : 'Shipping'}
                                            </span>
                                        </div>

                                        {/* Estimated Delivery Date */}
                                        {!order.isDelivered && (
                                            <div className="text-xs text-slate-400 font-medium">
                                                Est: <span className="text-slate-600 font-semibold">{new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        )}

                                        {/* View Details Button */}
                                        <Link 
                                            to={`/order/${order._id}`}
                                            className="px-5 py-2.5 bg-slate-900 text-white hover:bg-yellow-400 hover:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ml-auto xl:ml-0"
                                        >
                                            View Report <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* SECURITY & PRIVACY SECTION */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Security & Privacy</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Manage Your Identity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                                <Trash2 size={16} className="text-red-500" /> Permanent Data Removal
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-6">
                                If you no longer wish to use Miazi Shop, you can permanently delete your account and all associated data. This action is irreversible.
                            </p>
                            <button 
                                onClick={handleDeleteAccount}
                                className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                Delete My Account
                            </button>
                        </div>
                        <Link 
                            to="/privacy-policy" 
                            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:border-yellow-400 transition-all group flex flex-col justify-center"
                        >
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 flex items-center gap-2 group-hover:text-gray-900">
                                <Shield size={16} className="text-green-600" /> Legal & Privacy Policy
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Google Play Compliance</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Review our global data protection standards and how we keep your identity secure and private.
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
