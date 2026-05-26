import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { listCategories } from '../slices/categorySlice';
import api from '../utils/axiosConfig';
import {
    ShoppingBag, Search, Menu, User, MapPin,
    Truck, RefreshCw, Heart, ChevronDown, LayoutDashboard,
    Bell, Check, X as CloseIcon, Info, AlertTriangle, ChevronRight,
    Trash2, Camera
} from 'lucide-react';
import { fetchNotifications, resetCount, deleteNotification, clearNotifications } from '../slices/notificationSlice';
import { updateProfile } from '../slices/authSlice';
import { uploadToCloudinaryDirect } from '../utils/cloudinary';
import { toast } from 'react-toastify';
import { BASE_URL } from '../utils/axiosConfig';
import { ERROR_IMAGE } from '../utils/imageUtils';

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { categories } = useSelector((state) => state.category);
    const { notifications, count } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(listCategories());
        dispatch(fetchNotifications());

        const interval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 120000);

        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (keyword.trim().length > 1) {
                try {
                    const { data } = await api.get(`/api/products/suggestions?keyword=${keyword}`);
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [keyword]);

    // Replace your old handleSearch with this:
    const handleSearch = (value) => {
        setKeyword(value); // Update the input field state

        if (value.trim()) {
            navigate(`/?keyword=${value}`); // Update URL instantly
        } else {
            navigate('/'); // Reset to all products when empty
        }
    };
    const logoutHandler = () => {
        dispatch(logout());
        dispatch(clearNotifications());
        navigate('/');
        toast.info('Signed out successfully.');
    };

    const handleDeleteNotification = (e, id) => {
        e.stopPropagation();
        dispatch(deleteNotification(id));
        toast.success('Notification removed');
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffHours < 48) return 'Yesterday';
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) {
            return '';
        }
    };

    const categoryItems = Array.isArray(categories)
        ? categories.map(c => ({ name: c.name, id: c._id }))
        : [];

    return (
        <header className="w-full bg-white font-sans relative">
            {/* TIER 1: TOP BAR */}
            <div className="border-b border-gray-100 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-2 text-[12px] text-gray-500">
                    <div>Welcome to Worldwide Electronics Store</div>
                    <div className="flex items-center gap-4">
                        <a href="https://www.google.com/maps?q=23.4055098,90.739426" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-yellow-500"><MapPin size={14} /> Store Locator</a>
                        <span className="text-gray-200">|</span>
                        <Link to="/myorders" className="flex items-center gap-1 hover:text-yellow-500"><Truck size={14} /> Track Your Order</Link>
                        <span className="text-gray-200">|</span>
                        <div className="flex items-center gap-1">BDT (Taka) <ChevronDown size={10} /></div>
                        <span className="text-gray-200">|</span>
                        {userInfo ? (
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 font-bold">{userInfo.email}</span>
                                <span className="text-gray-200">|</span>
                                <button onClick={logoutHandler} className="hover:text-yellow-500 font-bold">Sign Out</button>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-yellow-600 font-bold transition-colors">Register or Sign in</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* TIER 2: LOGO & SEARCH */}
            <div className="max-w-7xl mx-auto px-4 py-3 md:py-5 flex items-center justify-between gap-4 md:gap-10">
                <Link to="/" className="flex items-center flex-shrink-0 group">
                    <div className="h-16 md:h-20 flex items-center justify-center">
                        <img src="/logo.png" alt="Miazi Shop Logo" width="112" height="112" className="h-full w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
                    </div>
                </Link>

                {/* Mobile Icons Action Bar */}
                <div className="flex items-center gap-1 sm:gap-3 md:hidden">
                    <button
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        className={`p-2 transition-colors ${isMobileSearchOpen ? 'text-yellow-500' : 'text-gray-700'}`}
                    >
                        <Search size={22} />
                    </button>

                    <button
                        onClick={() => { setIsNotifOpen(true); dispatch(resetCount()); }}
                        className="p-2 text-gray-700 hover:text-yellow-500 transition-colors relative"
                    >
                        <Bell size={22} />
                        {count > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                {count}
                            </span>
                        )}
                    </button>

                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-800 p-2"><Menu size={24} /></button>
                </div>

                {/* Main Search Bar */}
                <div className="flex-1 max-w-2xl hidden md:block relative">
                    <form onSubmit={handleSearch} className="flex border-2 border-yellow-400 rounded-full h-11">
                        {/* Desktop Search */}
                        <input
                            type="text"
                            className="flex-1 bg-transparent px-5 text-sm focus:outline-none"
                            placeholder="Search for Products"
                            value={keyword}
                            // Change this line:
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => keyword.length > 1 && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        <button type="submit" className="bg-yellow-400 px-6 rounded-r-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors">
                            <Search size={20} />
                        </button>
                    </form>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white mt-1 border border-gray-100 shadow-2xl rounded-xl z-[100] overflow-hidden">
                            <div className="p-2 border-b border-gray-50 bg-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Suggestions</span>
                                <span className="text-[10px] text-gray-400 px-2">{suggestions.length} found</span>
                            </div>
                            <ul>
                                {suggestions.map((p) => (
                                    <li key={p._id}>
                                        <button
                                            onMouseDown={(e) => { e.preventDefault(); navigate(`/product/${p._id}`); setShowSuggestions(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center p-1 shrink-0">
                                                <img
                                                    src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${BASE_URL}${p.images[0]}`) : ERROR_IMAGE}
                                                    alt="" className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                    onError={(e) => {
                                                        e.target.src = ERROR_IMAGE;
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">৳{p.price.toLocaleString()}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-5 text-gray-700">
                    <button
                        onClick={() => { setIsNotifOpen(true); dispatch(resetCount()); }}
                        className="relative p-2 text-gray-700 hover:text-yellow-500 transition-colors group/bell"
                    >
                        <Bell size={22} className="group-hover/bell:animate-ring" />
                        {count > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                {count}
                            </span>
                        )}
                    </button>

                    <RefreshCw size={22} className="cursor-pointer hover:text-yellow-500" onClick={() => window.location.reload()} />
                    <div className="relative flex items-center gap-4">
                        {userInfo && userInfo.isAdmin && (
                            <Link to="/admin/dashboard" className="hidden lg:flex items-center gap-2 bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors shadow-lg">
                                <LayoutDashboard size={14} /> Dashboard
                            </Link>
                        )}
                        <button onClick={() => setIsUserDrawerOpen(true)}>
                            <User size={22} className="cursor-pointer hover:text-yellow-500" />
                        </button>
                    </div>
                    <Link to="/cart" className="flex items-center gap-2 group">
                        <div className="relative">
                            <ShoppingBag size={24} className="group-hover:text-yellow-500" />
                            <span className="absolute -top-1 -right-2 bg-yellow-400 text-gray-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        </div>
                        <span className="font-bold text-sm text-gray-800 hidden lg:block">
                            ৳{cartItems.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()}
                        </span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Row - Toggles with Search Icon */}
            <div className={`md:hidden bg-white border-b border-gray-100 px-4 py-2 transition-all duration-300 overflow-hidden ${isMobileSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 py-0 border-none'}`}>
                <form onSubmit={handleSearch} className="flex border-2 border-yellow-400 rounded-2xl h-10 overflow-hidden">
                    {/* Mobile Search */}
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-4 text-sm focus:outline-none"
                        placeholder="What are you looking for?"
                        value={keyword}
                        // Change this line:
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button type="submit" className="bg-yellow-400 px-4 flex items-center justify-center">
                        <Search size={18} />
                    </button>
                </form>
            </div>

            {/* TIER 3: NAV BAR */}
            <div className="border-t border-gray-100 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
                    <div className="relative w-64 h-full" onMouseEnter={() => setIsDeptOpen(true)} onMouseLeave={() => setIsDeptOpen(false)}>
                        <button className="bg-yellow-400 w-full h-full flex items-center gap-3 px-5 font-bold text-sm text-gray-800 rounded-t-md">
                            <Menu size={18} /> All Departments
                        </button>
                        <div className={`absolute top-full left-0 w-full bg-white border border-gray-100 shadow-xl z-50 transition-all ${isDeptOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <ul className="py-2">
                                {categoryItems.map(dept => (
                                    <li key={dept.id || dept.name}>
                                        <Link to={dept.id ? `/category/${dept.id}` : '#'} className="block px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-600">
                                            {dept.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <nav className="flex-1 flex items-center gap-8 px-8 h-full">
                        <a href="/#shop-section" className="text-sm font-bold text-gray-700 hover:text-yellow-500 font-black uppercase tracking-widest text-[10px]">Products Inventory</a>
                        <a href="/#shop-section" className="text-sm font-bold text-gray-700 hover:text-yellow-500 font-black uppercase tracking-widest text-[10px]">Featured Brands</a>
                    </nav>
                </div>
            </div>

            {/* SIDE DRAWERS - PLACED AT ROOT FOR RELIABLE MOBILE VISIBILITY */}

            {/* NOTIFICATION DRAWER - PREMIUM E-COMMERCE UPGRADE */}
            {isNotifOpen && (
                <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-[4px] transition-all" onClick={() => setIsNotifOpen(false)} />
            )}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[1001] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-900 relative overflow-hidden shrink-0">
                    {/* Golden accent bar */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400" />
                    <div className="relative z-10">
                        <h3 className="text-base font-bold tracking-wide text-white leading-none font-sans">Notifications</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                                {userInfo ? `${notifications.length} active updates` : 'Please sign in to view alerts'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsNotifOpen(false)} 
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white border border-white/10 group active:scale-95"
                    >
                        <CloseIcon size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {!userInfo ? (
                        /* Guest State */
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-slate-100 relative group">
                                <div className="absolute inset-0 bg-yellow-400/5 rounded-[2rem] scale-110 group-hover:scale-125 transition-transform duration-500" />
                                <Bell size={32} className="text-slate-400 relative z-10" />
                            </div>
                            <h4 className="text-base font-bold text-slate-800 tracking-tight">Stay Updated</h4>
                            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-normal max-w-[280px] mx-auto">
                                Sign in to view personalized order tracking updates, delivery statuses, and exclusive promotional offers.
                            </p>
                            <Link 
                                to="/login" 
                                onClick={() => setIsNotifOpen(false)}
                                className="mt-8 btn-electro w-full max-w-[200px] shadow-lg shadow-yellow-400/10 text-xs font-bold uppercase tracking-wider py-3 rounded-xl"
                            >
                                Sign in to View
                            </Link>
                        </div>
                    ) : notifications.length > 0 ? (
                        /* Notifications List */
                        <div className="p-4 space-y-3">
                            {notifications.map((n) => (
                                <div key={n._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden text-left">
                                     {/* Color indicator stripe */}
                                     <div className={`absolute top-0 left-0 w-1 h-full ${n.type === 'warning' ? 'bg-amber-400' : n.type === 'success' ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                                     
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.type === 'warning' ? 'bg-amber-50 text-amber-600' : n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                                            {n.type === 'warning' ? <AlertTriangle size={18} /> : n.type === 'success' ? <Check size={18} /> : <Info size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-[10px] font-bold uppercase tracking-wider ${n.type === 'warning' ? 'text-amber-600' : n.type === 'success' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                                    {n.type === 'success' ? 'Update Successful' : n.type === 'warning' ? 'Important Alert' : 'System Update'}
                                                </p>
                                                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                                                    {formatTime(n.createdAt)}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-800 mt-1 leading-snug">{n.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteNotification(e, n._id)}
                                        className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* All Clear Premium State */
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-emerald-50/50 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-100/50 shadow-sm relative">
                                <div className="absolute inset-0 bg-emerald-50 rounded-[2rem] animate-pulse" />
                                <Check size={28} className="text-emerald-500 relative z-10" />
                            </div>
                            <h4 className="text-base font-bold text-slate-800 tracking-tight">You're all caught up!</h4>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[260px] mx-auto">
                                No new notifications at the moment. We will notify you when your order status updates or when there are special promotions.
                            </p>
                            <div className="mt-6 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 inline-block">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">All messages read</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer Status Bar */}
                {userInfo && (
                     <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-center shrink-0">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Miazi Shop Customer Alerts Center
                        </p>
                    </div>
                )}
            </div>


            {/* ACCOUNT DRAWER */}
            {isUserDrawerOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md" onClick={() => setIsUserDrawerOpen(false)} />
            )}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[1001] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isUserDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-yellow-400 shrink-0 text-gray-900">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] leading-none">My Account</h3>
                        <p className="text-[10px] font-bold mt-1.5 opacity-80">Manage Your Profile</p>
                    </div>
                    <button onClick={() => setIsUserDrawerOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                        <CloseIcon size={20} />
                    </button>
                </div>
                <div className="p-10 border-b border-gray-50 bg-slate-50/50 text-center">
                    {userInfo ? (
                        <div className="space-y-4">
                            <div className="relative w-24 h-24 mx-auto group">
                                <div className="w-24 h-24 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center text-slate-900 font-black text-4xl shadow-2xl border-4 border-white rotate-3 overflow-hidden">
                                    {userInfo.avatar ? (
                                        <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        userInfo.email.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <label className={`absolute bottom-0 right-0 p-2 bg-slate-900 text-yellow-400 rounded-2xl border-4 border-white cursor-pointer shadow-lg hover:bg-yellow-400 hover:text-slate-900 transition-all ${isAvatarUploading ? 'animate-pulse opacity-50 pointer-events-none' : ''}`}>
                                    <Camera size={16} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isAvatarUploading} />
                                </label>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none mb-2">Signed In As</p>
                                <p className="text-sm font-black text-slate-800 truncate px-4">{userInfo.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 pb-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto border-2 border-dashed border-slate-100">
                                <User size={32} />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-10 space-y-4 custom-scrollbar">
                    {userInfo ? (
                        <>
                            <Link to="/profile" onClick={() => setIsUserDrawerOpen(false)} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:bg-yellow-50 hover:border-yellow-200 transition-all group shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <User size={22} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-700">Profile & History</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link to="/myorders" onClick={() => setIsUserDrawerOpen(false)} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:bg-yellow-50 hover:border-yellow-200 transition-all group shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <ShoppingBag size={22} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-700">Order Logs</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {userInfo.isAdmin && (
                                <Link to="/admin/dashboard" onClick={() => setIsUserDrawerOpen(false)} className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-yellow-500 hover:border-yellow-600 transition-all group shadow-xl">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white/10 rounded-2xl text-yellow-400 group-hover:text-slate-900 transition-colors">
                                            <LayoutDashboard size={22} />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-widest text-white group-hover:text-slate-900">Admin Dashboard</span>
                                    </div>
                                    <ChevronRight size={18} className="text-yellow-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsUserDrawerOpen(false)} className="w-full h-16 bg-yellow-400 text-slate-900 rounded-3xl font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center shadow-xl shadow-yellow-100 ring-4 ring-yellow-400/20 hover:scale-[1.02] transition-all">Sign In / Register</Link>
                    )}
                </div>
                {userInfo && (
                    <div className="p-8 border-t border-gray-50 bg-slate-50">
                        <button onClick={() => { setIsUserDrawerOpen(false); logoutHandler(); }} className="w-full py-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100">Sign Out</button>
                    </div>
                )}
            </div>

            {/* MOBILE MENU SYSTEM */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[1000] md:hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 overflow-hidden">
                        {/* Elegant Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white relative shrink-0">
                            {/* Thin vertical accent line */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400" />
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 leading-none">Departments</h3>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1.5">MIAZI SHOP CATALOG</p>
                            </div>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="p-2.5 hover:bg-slate-50 active:scale-95 rounded-full transition-all text-slate-500 border border-slate-100"
                            >
                                <CloseIcon size={16} />
                            </button>
                        </div>
                        
                        {/* Navigation Options */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-white">
                            <ul className="divide-y divide-slate-100">
                                {categories.map(dept => (
                                    <li key={dept._id || dept.name} className="group">
                                        <Link 
                                            onClick={() => setIsMobileMenuOpen(false)} 
                                            to={`/category/${dept.slug || dept._id}`} 
                                            className="flex items-center justify-between py-4 text-sm font-semibold text-slate-700 hover:text-yellow-600 hover:pl-2 transition-all duration-300 text-left"
                                        >
                                            <span className="tracking-wide uppercase text-[11px] font-black text-slate-700 hover:text-yellow-600">{dept.name}</span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-yellow-600 transition-colors" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {userInfo && userInfo.isAdmin && (
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <Link 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        to="/admin/dashboard" 
                                        className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-500 transition-all duration-300 group shadow-yellow-500/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LayoutDashboard size={18} className="text-yellow-400 group-hover:text-slate-900 transition-colors" />
                                            <span className="text-xs font-black uppercase tracking-wider">Admin Dashboard</span>
                                        </div>
                                        <ChevronRight size={14} className="text-yellow-400 group-hover:text-slate-900 transition-colors" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Miazi Shop Mobile Console</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;