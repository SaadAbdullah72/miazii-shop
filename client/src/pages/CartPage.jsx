import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft, 
  ChevronRight, ShieldCheck, Truck
} from 'lucide-react';
import { BASE_URL } from '../utils/axiosConfig';

// --- CURRENCY FORMATTER CONFIG ---
// Change 'USD' to 'PKR', 'EUR', 'GBP', etc. to change the symbol globally.
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT', 
});

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Selecting cart state from Redux
    const { cartItems, itemsPrice, shippingPrice, totalPrice } = useSelector((state) => state.cart);

    const updateQtyHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/shipping');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* BREADCRUMB */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-[10px] md:text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
                    <Link to="/" className="hover:text-blue-600 transition-colors shrink-0">Home</Link>
                    <ChevronRight size={12} className="shrink-0" />
                    <span className="text-gray-800 font-bold shrink-0">Shopping Cart</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight text-center md:text-left">Your Cart</h1>
                        <p className="text-gray-500 text-xs md:text-sm mt-1 text-center md:text-left">
                            You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your basket
                        </p>
                    </div>
                    <Link to="/" className="text-xs md:text-sm font-bold text-blue-600 hover:underline flex items-center justify-center md:justify-start gap-2">
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </header>
                
                {cartItems.length === 0 ? (
                    <div className="text-center py-16 md:py-20 bg-white border border-gray-200 rounded-xl shadow-sm px-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={32} className="text-gray-300" strokeWidth={1.5}/>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">Looks like you haven't added any tech deals yet.</p>
                        <Link to="/" className="inline-block bg-yellow-400 text-gray-800 px-8 md:px-10 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 hover:text-white transition-all text-sm">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product Details</th>
                                                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Quantity</th>
                                                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {cartItems.map((item) => (
                                                <tr key={item._id} className="group hover:bg-gray-50/30 transition-colors">
                                                    <td className="py-6 px-6">
                                                        <div className="flex gap-4 items-center">
                                                            <div className="w-20 h-20 bg-white border border-gray-100 rounded-lg p-1 shrink-0">
                                                                <img 
                                                                    src={item.images?.[0]?.startsWith('http') ? item.images[0] : `${BASE_URL}${item.images?.[0]}`} 
                                                                    alt={item.name} 
                                                                    className="w-full h-full object-contain mix-blend-multiply" 
                                                                />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <Link to={`/product/${item.slug}`} className="text-sm font-bold text-blue-600 hover:underline truncate">
                                                                    {item.name}
                                                                </Link>
                                                                <span className="text-xs font-bold text-gray-800 mt-1">
                                                                    {formatter.format(item.discountPrice > 0 ? item.discountPrice : item.price)}
                                                                </span>
                                                                <button 
                                                                    onClick={() => removeHandler(item._id)} 
                                                                    className="text-red-500 hover:text-red-700 transition-colors text-[10px] font-bold flex items-center gap-1 mt-2 uppercase"
                                                                >
                                                                    <Trash2 size={12} /> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-6">
                                                        <div className="flex items-center mx-auto bg-gray-100 rounded-full h-9 w-24 overflow-hidden">
                                                            <button onClick={() => item.qty > 1 && updateQtyHandler(item, item.qty - 1)} className="flex-1 h-full flex items-center justify-center hover:bg-gray-200 text-gray-500"><Minus size={14} /></button>
                                                            <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.qty}</span>
                                                            <button onClick={() => item.qty < item.countInStock && updateQtyHandler(item, item.qty + 1)} className="flex-1 h-full flex items-center justify-center hover:bg-gray-200 text-gray-500"><Plus size={14} /></button>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-6 text-right font-bold text-gray-800 text-sm">
                                                        {formatter.format((item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile List View */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="p-4 flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-white border border-gray-100 rounded-lg p-1 shrink-0">
                                                    <img src={item.images?.[0]?.startsWith('http') ? item.images[0] : `${BASE_URL}${item.images?.[0]}`} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link to={`/product/${item.slug}`} className="text-sm font-bold text-blue-600 block truncate">{item.name}</Link>
                                                    <span className="text-xs font-bold text-gray-800 mt-1 block">
                                                        {formatter.format(item.discountPrice > 0 ? item.discountPrice : item.price)}
                                                    </span>
                                                    <button onClick={() => removeHandler(item._id)} className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-2 uppercase"><Trash2 size={12} /> Remove</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                                <div className="flex items-center bg-white rounded-full h-8 w-24 border border-gray-200">
                                                    <button onClick={() => item.qty > 1 && updateQtyHandler(item, item.qty - 1)} className="flex-1 flex items-center justify-center text-gray-500"><Minus size={12} /></button>
                                                    <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.qty}</span>
                                                    <button onClick={() => item.qty < item.countInStock && updateQtyHandler(item, item.qty + 1)} className="flex-1 flex items-center justify-center text-gray-500"><Plus size={12} /></button>
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">
                                                    Total: {formatter.format((item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Panel */}
                        <div className="lg:col-span-4 lg:sticky lg:top-6">
                            <div className="bg-white border-2 border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                <div className="bg-gray-800 px-6 py-4">
                                    <h2 className="text-lg font-bold text-white">Cart Totals</h2>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                        <span className="font-bold text-gray-800">{formatter.format(itemsPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping</span>
                                            <span className="text-[10px] text-gray-400">Standard Delivery</span>
                                        </div>
                                        <span className="font-bold text-gray-800">
                                            {shippingPrice === 0 ? 'FREE' : formatter.format(shippingPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-tighter">Total</span>
                                        <span className="text-xl md:text-2xl font-bold text-gray-800">{formatter.format(totalPrice)}</span>
                                    </div>

                                    <button 
                                        onClick={checkoutHandler} 
                                        className="w-full bg-yellow-400 text-gray-800 hover:bg-gray-800 hover:text-white py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        Proceed to Checkout <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                                    <Truck size={20} className="text-blue-600" />
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-800 leading-none">Fast Delivery</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Orders processed within 24h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                                    <ShieldCheck size={20} className="text-green-600" />
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-800 leading-none">Safe Payment</p>
                                        <p className="text-[10px] text-gray-400 mt-1">100% Secure Checkout</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;