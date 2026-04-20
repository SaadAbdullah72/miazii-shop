import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { ChevronRight, Truck, MapPin, CheckCircle2, Navigation, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

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
            if (!country) setCountry(data.countryName || 'Bangladesh');
            setLat(data.latitude || null);
            setLng(data.longitude || null);
            if (!address) setAddress(`${data.cityName || ''}, ${data.countryName || ''}`);
        } catch (error) {
            console.log('Quiet auto-detect failed');
        }
    };

    const detectLocation = async () => {
        setDetecting(true);
        
        // Tier 1: High-Speed IP Detection (Professional, no permission prompt)
        try {
            const response = await fetch('https://freeipapi.com/api/json');
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            setCity(data.cityName || '');
            setPostalCode(data.zipCode || '');
            setCountry(data.countryName || ''); 
            setLat(data.latitude || null);
            setLng(data.longitude || null);
            setAddress(`${data.cityName || ''}, ${data.regionName || ''}, ${data.countryName || ''}`);
            
            toast.success('Location synchronized via Network IP');
            setDetecting(false);
        } catch (error) {
            console.error('IP failed, fallback to GPS:', error);
            
            // Tier 2: GPS Detection with "Friendly Prompt" logic
            if (!navigator.geolocation) {
                toast.error('Browser does not support GPS detection');
                setDetecting(false);
                return;
            }

            toast.info('Requesting GPS permission for higher accuracy...', { autoClose: 2000 });

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLat(latitude);
                    setLng(longitude);
                    toast.success('GPS Coordinates Locked!');
                    setDetecting(false);
                },
                (err) => {
                    console.error('Geo error:', err);
                    if (err.code === 1) toast.warning('Permission Denied. Please allow location in your browser settings.');
                    else toast.error('Detection failed. Please enter address manually.');
                    setDetecting(false);
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
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
                const query = `${address}, ${city}, Bangladesh`.trim();
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=bd`, {
                    headers: {
                        'User-Agent': 'Miazii-Shop-Logistics-Bot'
                    }
                });
                const data = await response.json();

                if (data && data.length > 0) {
                    finalLat = parseFloat(data[0].lat);
                    finalLng = parseFloat(data[0].lon);
                    toast.success('Address coordinates resolved successfully!');
                } else {
                    // Fallback Tier 2: Search just the city
                    console.log('Tier 1 failed, trying Tier 2 (City only)');
                    const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", Bangladesh")}&format=json&limit=1&countrycodes=bd`);
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
                                    <div 
                                        onClick={detectLocation}
                                        className={`group relative overflow-hidden border-2 rounded-2xl p-6 cursor-pointer transition-all ${detecting ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:border-yellow-400 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${detecting ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400 group-hover:bg-yellow-400 group-hover:text-slate-900 group-hover:rotate-12'}`}>
                                                    <Navigation size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                                                        {detecting ? 'Analyzing Satellite Data...' : 'Detect My Location'}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {lat && lng ? 'Coordinates Locked (Highest Accuracy)' : 'Automated Address Synchronization'}
                                                    </p>
                                                </div>
                                            </div>
                                            {!detecting && (lat && lng ? <CheckCircle2 size={24} className="text-emerald-500" /> : <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />)}
                                        </div>
                                        {detecting && <div className="absolute bottom-0 left-0 h-1 bg-blue-600 animate-progress" style={{ width: '100%' }}></div>}
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
            </div>
    );
};

export default ShippingPage;
