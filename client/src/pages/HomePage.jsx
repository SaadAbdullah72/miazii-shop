import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice'; // Added import
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Search, Menu, ChevronDown, MapPin, 
  User, Heart, Star, List, ChevronRight, Clock, 
  Truck, Shield, Headphones, Eye, Plus
} from 'lucide-react';
import { BASE_URL } from '../utils/axiosConfig';
import { toast } from 'react-toastify'; // Added for feedback

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Featured');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');
  const category = searchParams.get('category');

  // Add to Cart Handler
  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay - now;
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(listProducts({ keyword: keyword || '', category: category || '' }));
  }, [dispatch, keyword, category]);

  const dealBanners = [
    { title: 'Catch Big Deals on the Cameras', icon: '📷' },
    { title: 'Catch Big Deals on the Laptops', icon: '💻' },
    { title: 'Catch Big Deals on the Cameras', icon: '📷' },
    { title: 'Catch Big Deals on the Headphones', icon: '🎧' }
  ];

  const tabs = ['Featured', 'On Sale', 'Top Rated'];
  const bestDealCategories = ['Best Deals', 'TV & Video', 'Cameras', 'Audio', 'Smartphones', 'GPS & Navi', 'Computers', 'Portable Audio', 'Accessories'];
  const formatTime = (num) => num.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* HERO SECTION WITH SIDEBAR */}
      {!keyword && !category && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Hero Slider */}
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center min-h-[400px] px-6 md:px-12 py-8 md:py-0">
                <div className="flex-1 max-w-md text-center md:text-left">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">The New Standard</p>
                  <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-2">
                    Under Favorable <br />
                    <span className="font-bold">Smartwatches</span>
                  </h2>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                    FROM <span className="text-3xl md:text-4xl">$749<sup>99</sup></span>
                  </p>
                  <Link to="/?category=smartwatch" className="inline-block bg-yellow-400 text-gray-800 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 hover:text-white transition-all">
                    Start Buying
                  </Link>
                </div>
                <div className="flex-1 flex justify-center mt-8 md:mt-0">
                  <img src="/hero_watch.png" alt="Smartwatch" className="max-h-[250px] md:max-h-[350px] object-contain drop-shadow-2xl" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DEAL BANNERS */}
      {!keyword && !category && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dealBanners.map((deal, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
                  {deal.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Catch Big</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{deal.title}</p>
                  <Link to="/deals" className="text-xs text-yellow-600 font-bold flex items-center gap-1 mt-1 hover:underline">
                    Shop now <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN CONTENT AREA */}
      <section id="shop-section" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT SIDEBAR - Special Offer */}
          {!keyword && !category && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white border-2 border-yellow-400 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-yellow-400 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800 uppercase">Special</p>
                    <p className="text-lg font-bold text-gray-800">Offer</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    Save<br/>$120
                  </div>
                </div>

                <div className="p-4 text-center">
                  <div className="relative mb-4">
                    <img src="/gamepad.png" alt="Game Console" className="w-full h-48 object-contain" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=300&q=80'} />
                  </div>
                  <p className="text-xs text-blue-600 font-medium mb-1">Game Console Controller</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-gray-400 line-through text-sm">$99.00</span>
                    <span className="text-red-600 font-bold text-xl">$79.00</span>
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    {[{ val: formatTime(timeLeft.hours), label: 'HOURS' }, { val: formatTime(timeLeft.minutes), label: 'MINS' }, { val: formatTime(timeLeft.seconds), label: 'SECS' }].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-800 mb-1">{item.val}</div>
                        <span className="text-[10px] text-gray-500">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* RIGHT CONTENT - Product Tabs */}
          <div className="flex-1">
            <div className="flex items-center justify-between border-b-2 border-gray-200 mb-6 overflow-x-auto">
              <div className="flex gap-4 md:gap-8 min-w-max">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((p) => (
                  <div key={p._id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-yellow-400 transition-all duration-300">
                    <div className="relative bg-gray-50 p-4 aspect-square">
                      <img src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${BASE_URL}${p.images[0]}`) : 'https://placehold.co/300x300'} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      {/* ADD TO CART BUTTON */}
                      <button 
                        onClick={() => addToCartHandler(p)}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-yellow-400 rounded-full shadow flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-gray-800 hover:text-white"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-gray-400 uppercase mb-1">{p.category?.name || 'Electronics'}</p>
                      <Link to={`/product/${p.slug}`}>
                        <h3 className="text-sm font-medium text-blue-600 hover:underline line-clamp-2 mb-2 min-h-[2.5rem]">{p.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">${p.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BEST DEALS SECTION */}
      {!keyword && !category && (
        <section className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200">
          <div className="flex items-center gap-6 mb-6 overflow-x-auto pb-2">
            <div className="flex gap-6 min-w-max">
              {bestDealCategories.map((cat, idx) => (
                <button key={cat} className={`text-sm font-bold whitespace-nowrap pb-2 border-b-2 transition-colors ${idx === 0 ? 'text-gray-800 border-yellow-400' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products?.slice(0, 6).map((p) => (
              <div key={p._id} className="group">
                <div className="bg-gray-50 rounded-lg p-3 mb-2 aspect-square overflow-hidden relative">
                  <img src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${BASE_URL}${p.images[0]}`) : 'https://placehold.co/200x200'} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                  {/* MINI ADD TO CART BUTTON */}
                  <button 
                    onClick={() => addToCartHandler(p)}
                    className="absolute bottom-2 right-2 w-7 h-7 bg-yellow-400 rounded-full shadow flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Link to={`/product/${p.slug}`}>
                  <h4 className="text-xs font-medium text-blue-600 hover:underline line-clamp-2 mb-1">{p.name}</h4>
                </Link>
                <p className="text-sm font-bold text-gray-800">${p.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;