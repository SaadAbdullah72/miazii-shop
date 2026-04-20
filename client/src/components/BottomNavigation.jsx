import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Package, User, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useSelector } from 'react-redux';

const BottomNavigation = () => {
    const location = useLocation();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartItems.length },
        { icon: Package, label: 'Orders', path: '/myorders', auth: true },
        { icon: User, label: 'Profile', path: '/profile', auth: true },
    ];

    // Add Admin link if user is admin
    if (userInfo && userInfo.isAdmin) {
        navItems.splice(2, 0, { icon: LayoutDashboard, label: 'Admin', path: '/admin/dashboard' });
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-slate-100 px-2 pb-safe-area-inset-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 active:scale-90"
                        >
                            <div className={`p-2 rounded-2xl transition-all duration-500 ${active ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-200' : 'text-slate-400'}`}>
                                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                                
                                {item.badge > 0 && (
                                    <span className="absolute top-1.5 right-1/4 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full px-1 border-2 border-white shadow-sm animate-in zoom-in duration-300">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-[0.1em] mt-1 transition-colors duration-300 ${active ? 'text-slate-800' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default BottomNavigation;
