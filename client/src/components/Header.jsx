import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Heart, Search, Menu, User, PhoneCall, ChevronDown, X } from 'lucide-react';
import { logout } from '../slices/authSlice';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [mobileMenu, setMobileMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
        setUserDropdown(false);
        navigate('/');
    };

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    const cartQty = cartItems.reduce((a, c) => a + c.qty, 0);
    const cartTotal = cartItems.reduce((a, c) => a + c.qty * c.price, 0).toFixed(2);

    return (
        <header className="w-full font-sans bg-white sticky top-0 z-50 shadow-sm">
            {/* Top Bar */}
            <div className="bg-[#333e48] text-xs text-gray-300 hidden md:block">
                <div className="container-custom flex justify-between items-center h-9">
                    <div>Welcome to MIAZI SHOP — Your One-Stop Electronics Store</div>
                    <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1">
                            <PhoneCall size={12} /> +880 1612-893871
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="py-4 border-b bg-white">
                <div className="container-custom flex items-center justify-between gap-4 md:gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center min-w-[140px] md:min-w-[160px] shrink-0">
                        <img src="/logo.png" alt="MIAZI SHOP" className="h-[40px] md:h-[50px] object-contain" />
                    </Link>

                    {/* Desktop Search Bar */}
                    <form onSubmit={searchHandler} className="hidden md:flex flex-grow max-w-2xl items-center border-2 border-[#fed700] rounded-full overflow-hidden bg-white h-11">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full px-5 py-2 outline-none text-gray-700 text-sm"
                        />
                        <button type="submit" className="bg-[#fed700] text-[#333e48] px-6 h-full flex justify-center items-center font-bold hover:bg-yellow-500 transition">
                            <Search size={18} />
                        </button>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Mobile Search Toggle (Only on mobile) */}
                        <button className="md:hidden text-[#333e48] p-2" onClick={() => setMobileMenu(false) || navigate('/') /* Fallback for now */}>
                            {/* In a real app, this might toggle a mobile search overlay */}
                        </button>

                        {/* User Account */}
                        <div className="relative">
                            {userInfo ? (
                                <>
                                    <button onClick={() => setUserDropdown(!userDropdown)} className="flex items-center gap-1 md:gap-2 text-[#333e48] hover:text-[#fed700] transition">
                                        <User size={22} className="md:w-6 md:h-6 w-5 h-5" />
                                        <span className="hidden lg:block text-sm font-semibold">{userInfo.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} className="hidden md:block" />
                                    </button>
                                    {userDropdown && (
                                        <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-xl w-48 py-2 z-50">
                                            <Link to="/profile" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 transition font-semibold">My Profile</Link>
                                            <Link to="/myorders" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 transition font-semibold">My Orders</Link>
                                            {userInfo.isAdmin && (
                                                <Link to="/admin/dashboard" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 transition font-bold text-blue-600">Admin Panel</Link>
                                            )}
                                            <hr className="my-1" />
                                            <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition font-bold">Logout</button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to="/login" className="flex items-center gap-1 md:gap-2 text-[#333e48] hover:text-[#fed700] transition">
                                    <User size={22} className="md:w-6 md:h-6 w-5 h-5" />
                                    <span className="hidden lg:block text-sm font-semibold">Login</span>
                                </Link>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="flex items-center gap-1 md:gap-2">
                            <div className="relative text-[#333e48] hover:text-[#fed700] transition">
                                <ShoppingBag size={24} className="md:w-7 md:h-7 w-6 h-6" />
                                {cartQty > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">{cartQty}</span>
                                )}
                            </div>
                            <span className="hidden lg:block text-sm font-bold text-[#333e48]">৳{cartTotal}</span>
                        </Link>

                        {/* Mobile menu toggle */}
                        <button className="md:hidden text-[#333e48] ml-1" onClick={() => setMobileMenu(!mobileMenu)}>
                            {mobileMenu ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar (Always visible on mobile below logo) */}
                <div className="md:hidden px-4 mt-4">
                    <form onSubmit={searchHandler} className="flex items-center border rounded-full overflow-hidden bg-gray-50 h-10 border-gray-200">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full px-4 py-2 outline-none text-gray-700 text-sm bg-transparent"
                        />
                        <button type="submit" className="bg-[#fed700] text-[#333e48] px-4 h-full flex justify-center items-center font-bold">
                            <Search size={16} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-[#fed700] hidden md:block">
                <div className="container-custom flex items-center h-12 text-[#333e48] font-semibold text-sm gap-8">
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <Link to="/?keyword=" className="hover:text-white transition">All Products</Link>
                    <Link to="/cart" className="hover:text-white transition">Cart</Link>
                    {userInfo && <Link to="/myorders" className="hover:text-white transition">My Orders</Link>}
                    {userInfo?.isAdmin && <Link to="/admin/dashboard" className="hover:text-white transition font-bold">Admin Panel</Link>}
                    <div className="ml-auto text-xs font-bold">Free Shipping on Orders ৳5000+</div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenu && (
                <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 transition-opacity" onClick={() => setMobileMenu(false)} />
            )}

            {/* Mobile Slider Menu */}
            <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <img src="/logo.png" alt="MIAZI SHOP" className="h-[40px] object-contain" />
                        <button onClick={() => setMobileMenu(false)} className="text-gray-500"><X size={24} /></button>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Link to="/" onClick={() => setMobileMenu(false)} className="text-lg font-bold flex items-center gap-3 text-[#333e48]">Home</Link>
                        <Link to="/?keyword=" onClick={() => setMobileMenu(false)} className="text-lg font-bold flex items-center gap-3 text-[#333e48]">All Products</Link>
                        <Link to="/cart" onClick={() => setMobileMenu(false)} className="text-lg font-bold flex items-center gap-3 text-[#333e48]">
                            Cart 
                            {cartQty > 0 && <span className="bg-red-500 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center ml-auto">{cartQty}</span>}
                        </Link>
                        
                        <div className="border-t pt-6 mt-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">My Account</h3>
                            {userInfo ? (
                                <>
                                    <Link to="/profile" onClick={() => setMobileMenu(false)} className="text-base font-semibold py-2 block text-[#333e48]">My Profile</Link>
                                    <Link to="/myorders" onClick={() => setMobileMenu(false)} className="text-base font-semibold py-2 block text-[#333e48]">My Orders</Link>
                                    {userInfo.isAdmin && <Link to="/admin/dashboard" onClick={() => setMobileMenu(false)} className="text-base font-bold py-2 block text-blue-600">Admin Panel</Link>}
                                    <button onClick={() => { logoutHandler(); setMobileMenu(false); }} className="text-base font-bold py-2 block text-red-500 text-left">Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenu(false)} className="text-base font-bold py-2 block text-[#333e48]">Login / Register</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
