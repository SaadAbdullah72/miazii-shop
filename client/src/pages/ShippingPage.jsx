import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { ChevronRight, Truck, MapPin, CheckCircle2, Navigation, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import LocationPickerModal from '../components/LocationPickerModal';

const ShippingPage = () => {
    const cart = useSelector((state) => state.cart || {});
    const { shippingAddress = {} } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');
    const [lat, setLat] = useState(shippingAddress?.lat || null);
    const [lng, setLng] = useState(shippingAddress?.lng || null);
    const [detecting, setDetecting] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    // Auto-detect on mount (Quietly)
    useEffect(() => {
        if (!lat || !lng) {
            autoDetectQuietly();
        }
    }, []);

    const autoDetectQuietly = async () => {
        try {
            const response = await fetch('https://freeipapi.com/api/json');
            if (!response.ok) return;
            const data = await response.json();
            
            if (!city) setCity(data.cityName || '');
            if (!postalCode) setPostalCode(data.zipCode || '');
            if (!country) setCountry(data.countryName || '');
            setLat(data.latitude || null);
            setLng(data.longitude || null);
            if (!address) setAddress(`${data.cityName || ''}, ${data.countryName || ''}`);
        } catch (error) {
            console.log('Quiet auto-detect failed');
        }
    };

    const detectLocation = async () => {
        setDetecting(true);
        
        // Tier 1: Hardware-Level GPS Detection (Secure & Precise)
        if (navigator.geolocation) {
            toast.info('Establishing Secure Satellite Connection...', { id: 'geo-lock', autoClose: 3000 });

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLng(longitude);

                    try {
                        // Professional Nominatim Request with proper headers
                        const revResponse = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
                            { headers: { 'User-Agent': 'Miazi-Shop-Logistics-Bot-v2' } }
                        );
                        const revData = await revResponse.json();
                        
                        if (revData && revData.address) {
                            // Smart Parsing: Prioritize neighborhood/road indicators over generic strings
                            const area = revData.address.suburb || revData.address.neighbourhood || revData.address.residential || '';
                            const road = revData.address.road || '';
                            const state = revData.address.state || '';
                            
                            const fullAddr = [road, area, state].filter(Boolean).join(', ');
                            
                            if (!address || address.includes('Bangladesh')) setAddress(fullAddr || revData.display_name.split(',').slice(0, 3).join(', '));
                            if (!city) setCity(revData.address.city || revData.address.town || revData.address.suburb || 'Dhaka');
                            if (!postalCode) setPostalCode(revData.address.postcode || '');
                            if (!country) setCountry(revData.address.country || '');
                        }
                        toast.update('geo-lock', { render: 'Professional Location Sync Complete!', type: 'success', autoClose: 3000 });
                    } catch (e) {
                        toast.warning('Coordinates Locked. Precision geocoding failed, using approximate mapping.');
                    } finally {
                        setDetecting(false);
                    }
                },
                async (err) => {
                    console.warn('GPS Signal Inhibited:', err);
                    
                    if (err.code === 1) { // PERMISSION_DENIED
                        toast.error('Location Access Denied. Please enable GPS in your browser settings to continue.', { id: 'geo-lock' });
                        setDetecting(false);
                        return;
                    }

                    // Tier 2: Encrypted IP-Based Fallback
                    try {
                        toast.info('Switching to Encrypted IP Detection...', { id: 'geo-lock' });
                        const response = await fetch('https://freeipapi.com/api/json');
                        if (!response.ok) throw new Error('IP service down');
                        const data = await response.json();

                        if (!city) setCity(data.cityName || '');
                        if (!postalCode) setPostalCode(data.zipCode || '');
                        setCountry(data.countryName || ''); 
                        setLat(data.latitude || null);
                        setLng(data.longitude || null);
                        if (!address) setAddress(`${data.cityName || ''}, ${data.regionName || ''}`);
                        
                        toast.update('geo-lock', { render: 'Location secured via Network IP.', type: 'success', autoClose: 3000 });
                    } catch (ipErr) {
                        toast.error('Automated sync failed. Please enter details manually.', { id: 'geo-lock' });
                    } finally {
                        setDetecting(false);
                    }
                },
                { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
            );
        } else {
            toast.warning('Hardware not supported. Please fill manually.');
            setDetecting(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        let finalLat = lat;
        let finalLng = lng;

        // "Full Functional" Logic: If coordinates are missing, resolve them from the typed address
        if (!finalLat || !finalLng) {
            setIsResolving(true);
            try {
                const query = `${address}, ${city}, ${country}`.trim();
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, {
                    headers: {
                        'User-Agent': 'Miazi-Shop-Logistics-Bot'
                    }
                });
                const data = await response.json();

                if (data && data.length > 0) {
                    finalLat = parseFloat(data[0].lat);
                    finalLng = parseFloat(data[0].lon);
                    toast.success('Address coordinates resolved successfully!');
                } else {
                    // Fallback Tier 2: Search just the city
                    const query2 = `${city}, ${country}`.trim();
                    const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query2)}&format=json&limit=1`);
                    const fallbackData = await fallbackResponse.json();
                    
                    if (fallbackData && fallbackData.length > 0) {
                        finalLat = parseFloat(fallbackData[0].lat);
                        finalLng = parseFloat(fallbackData[0].lon);
                        toast.success('City coordinates resolved!');
                    } else {
                        toast.warning('Location too vague. Using standard rate.');
                    }
                }
            } catch (error) {
                console.error('Geo-Resolution Error:', error);
            } finally {
                setIsResolving(false);
            }
        }

        dispatch(saveShippingAddress({ address, city, postalCode, country, phone, lat: finalLat, lng: finalLng }));
        navigate('/placeorder');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/cart" className="hover:text-blue-600">Cart</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-800 font-bold">Shipping</span>
                </div>
            </div>

            <div className="container-custom">
                {/* Checkout Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 size={16} /> <span>Cart</span>
                        </div>
                        <div className="w-12 h-px bg-gray-200" />
                        <div className="flex items-center gap-2 text-blue-600">
                            <MapPin size={16} /> <span>Shipping</span>
                        </div>
                        <div className="w-12 h-px bg-gray-200" />
                        <div className="flex items-center gap-2 text-gray-300">
                            <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">3</span> <span>Place Order</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
                                <Truck size={20} /> Shipping Details
                            </h1>
                        </div>
                        <div className="p-8">
                            <form onSubmit={submitHandler} className="space-y-6">
                                {/* Professional Location Interaction Card */}
                                <div className="space-y-4">
                                    {/* Elite Logistics-Grade Pinpoint Card */}
                                    <div 
                                        onClick={() => setIsMapOpen(true)}
                                        className="group relative overflow-hidden bg-slate-900 rounded-[32px] p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5"
                                    >
                                        {/* Animated Background Accent */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-[60px] group-hover:bg-yellow-400/20 transition-all duration-700" />
                                        
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center text-slate-900 shadow-[0_10px_20px_rgba(251,191,36,0.3)] group-hover:rotate-12 transition-all duration-500">
                                                    <Navigation size={32} className="fill-current" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                                        Pinpoint Delivery Location
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className={`w-2 h-2 rounded-full ${lat && lng ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                                            {lat && lng ? 'Satellite Lock Secured' : 'Precision Sync Required'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-yellow-400 transition-all">
                                                <ChevronRight size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Shipping Address</label>
                                        <input
                                            type="text"
                                            placeholder="Building, Street, Area..."
                                            className="w-full bg-white border-2 border-slate-100 p-4 rounded-xl outline-none focus:border-yellow-400 text-sm font-bold text-slate-700 transition-all shadow-sm"
                                            value={address}
                                            required
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                                setLat(null); 
                                                setLng(null);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">City</label>
                                        <input
                                            type="text"
                                            placeholder="Enter city"
                                            className="w-full bg-white border border-gray-200 p-3 rounded-lg outline-none focus:border-yellow-400 text-sm"
                                            value={city}
                                            required
                                            onChange={(e) => {
                                                setCity(e.target.value);
                                                setLat(null);
                                                setLng(null);
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500">Postal Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter postal code"
                                            className="w-full bg-white border border-gray-200 p-3 rounded-lg outline-none focus:border-yellow-400 text-sm"
                                            value={postalCode}
                                            required
                                            onChange={(e) => setPostalCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">Country</label>
                                    <input
                                        type="text"
                                        placeholder="Enter country"
                                        className="w-full bg-white border border-gray-200 p-3 rounded-lg outline-none focus:border-yellow-400 text-sm"
                                        value={country}
                                        required
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="Contact phone for courier"
                                            className="w-full bg-white border-2 border-slate-100 p-4 rounded-xl outline-none focus:border-yellow-400 text-sm font-bold text-slate-700 transition-all shadow-sm"
                                            value={phone}
                                            required
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isResolving}
                                        className="w-full h-14 bg-yellow-400 hover:bg-slate-900 hover:text-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-3 group mt-4 overflow-hidden relative"
                                    >
                                        {isResolving ? (
                                            <>
                                                <Loader size={20} className="animate-spin" />
                                                <span>Analyzing Route...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Continue to Checkout</span>
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <LocationPickerModal 
                    isOpen={isMapOpen}
                    onClose={() => setIsMapOpen(false)}
                    initialPos={lat && lng ? [lat, lng] : null}
                    onSave={(data) => {
                        setAddress(data.address);
                        setCity(data.city);
                        setPostalCode(data.postalCode);
                        setCountry(data.country);
                        setLat(data.lat);
                        setLng(data.lng);
                        toast.success('Location synced from Map pin!');
                    }}
                />
            </div>
    );
};

export default ShippingPage;
