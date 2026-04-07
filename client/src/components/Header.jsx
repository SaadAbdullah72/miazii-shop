import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import {
    ShoppingBag, Search, Menu, User, MapPin,
    Truck, RefreshCw, Heart, ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
        toast.info('Signed out successfully.');
    };

    const departments = [
        'Value of the Day', 'Top 100 Offers', 'New Arrivals', 'Computers & Accessories',
        'Cameras, Audio & Video', 'Mobiles & Tablets', 'Movies, Music & Video Games',
        'TV & Audio', 'Watches & Eyewear', 'Car, Motorbike & Industrial', 'Accessories'
    ];

    return (
        <header className="w-full bg-white font-sans">
            {/* TIER 1: TOP BAR (Matches Image Top Right) */}
           {/* TIER 1: TOP BAR (Hidden on mobile, visible on md and up) */}
<div className="border-b border-gray-100 hidden md:block">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-2 text-[12px] text-gray-500">
        <div>Welcome to Worldwide Electronics Store</div>
        <div className="flex items-center gap-4">
            <Link to="#" className="flex items-center gap-1 hover:text-yellow-500"><MapPin size={14} /> Store Locator</Link>
            <span className="text-gray-200">|</span>
            <Link to="/orders" className="flex items-center gap-1 hover:text-yellow-500"><Truck size={14} /> Track Your Order</Link>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-1">Dollar (US) <ChevronDown size={10} /></div>
            <span className="text-gray-200">|</span>
            {userInfo ? (
                <button onClick={logoutHandler} className="hover:text-yellow-500">Logout</button>
            ) : (
                <Link to="/login" className="hover:text-yellow-500">Register or Sign in</Link>
            )}
        </div>
    </div>
</div>

            {/* TIER 2: LOGO & SEARCH (Main Header) */}
            <div className="max-w-7xl mx-auto px-4 py-3 md:py-5 flex items-center justify-between gap-4 md:gap-10">
                {/* Logo Area */}
                <Link to="/" className="flex items-center flex-shrink-0 group">
                    {/* 1. Increased background circle size to h-16 w-16 */}
                    <div className=" h-16 w-16 rounded-full flex items-center justify-center shadow-md">
                        {/* 2. Increased image size to h-12 w-12 and kept blend mode */}
                        <img src="logo.png" alt="Logo" className="h-12 w-12 object-contain mix-blend-multiply" />
                    </div>
                    {/* 3. Text name removed as requested */}
                </Link>

                {/* Mobile Menu Trigger */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden text-gray-800 p-2"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar (Matches Electro Style) */}
                <div className="flex-1 max-w-2xl hidden md:block">
                    <form onSubmit={handleSearch} className="flex border-2 border-yellow-400 rounded-full h-11">
                        <input
                            type="text"
                            className="flex-1 bg-transparent px-5 text-sm focus:outline-none"
                            placeholder="Search for Products"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="border-l border-gray-200 px-4 flex items-center text-sm text-gray-500 cursor-pointer">
                            All Categories <ChevronDown size={14} className="ml-1" />
                        </div>
                        <button type="submit" className="bg-yellow-400 px-6 rounded-r-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors">
                            <Search size={20} />
                        </button>
                    </form>
                </div>

                {/* Icons */}
                <div className="hidden md:flex items-center gap-5 text-gray-700">
                    <RefreshCw size={22} className="cursor-pointer hover:text-yellow-500" />
                    <Heart size={22} className="cursor-pointer hover:text-yellow-500" />
                    <div className="relative group">
                        <User size={22} className="cursor-pointer hover:text-yellow-500" />
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

            {/* TIER 3: NAV BAR (Matches Image Lower Nav) */}
            <div className="border-t border-gray-100 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
                    {/* Dept Menu - Matches Home Page Sidebar Alignment */}
                    <div className="relative w-64 h-full" onMouseEnter={() => setIsDeptOpen(true)} onMouseLeave={() => setIsDeptOpen(false)}>
                        <button className="bg-yellow-400 w-full h-full flex items-center gap-3 px-5 font-bold text-sm text-gray-800 rounded-t-md">
                            <Menu size={18} /> All Departments
                        </button>

                        {/* Dropdown Content */}
                        <div className={`absolute top-full left-0 w-full bg-white border border-gray-100 shadow-xl z-50 transition-all ${isDeptOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <ul className="py-2">
                                {departments.map(dept => (
                                    <li key={dept}>
                                        <Link to={`/?category=${dept.toLowerCase()}`} className="block px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-600">
                                            {dept}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Horizontal Links */}
                    <nav className="flex-1 flex items-center gap-8 px-8 h-full">
                        <Link to="/" className="text-sm font-bold text-red-500">Super Deals</Link>
                        <Link to="/" className="text-sm font-bold text-gray-700 hover:text-yellow-500">Featured Brands</Link>
                        <Link to="/" className="text-sm font-bold text-gray-700 hover:text-yellow-500">Trending Styles</Link>
                        <Link to="/" className="text-sm font-bold text-gray-700 hover:text-yellow-500">Gift Cards</Link>
                    </nav>

                    <div className="text-sm font-bold text-gray-700">
                        Free Shipping on Orders <span className="text-red-500">৳50,000+</span>
                    </div>
                </div>
            </div>

            {/* MOBILE NAVIGATION DRAWER */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl animate-slide-in">
                        <div className="p-5 border-b border-gray-100 bg-yellow-400 flex justify-between items-center">
                            <span className="font-bold text-sm">MENU</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>X</button>
                        </div>
                        <ul className="p-4 space-y-4">
                            {departments.slice(0, 8).map(dept => (
                                <li key={dept}>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="text-sm font-medium block">{dept}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* MOBILE SEARCH (Visible only on mobile) */}
            <div className="md:hidden px-4 pb-4">
                <form onSubmit={handleSearch} className="flex border-2 border-yellow-400 rounded-full h-10">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-4 text-xs focus:outline-none"
                        placeholder="Search..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="bg-yellow-400 px-4 rounded-r-full">
                        <Search size={16} />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;