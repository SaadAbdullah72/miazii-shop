import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check, Loader, Crosshair, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPickerModal = ({ isOpen, onClose, onSave, initialPos }) => {
    const [position, setPosition] = useState(initialPos || [33.6844, 73.0479]); // Default Islamabad (Modern Global Context)
    const [addressData, setAddressData] = useState(null);
    const [isResolving, setIsResolving] = useState(false);

    // Handle map clicks to set position
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };

    // Auto-resolve address when position changes
    useEffect(() => {
        const resolveAddress = async () => {
            setIsResolving(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json&accept-language=en`, {
                    headers: { 'User-Agent': 'Miazi-Shop-Elite-Logistics-v2' }
                });
                const data = await response.json();
                setAddressData(data);
            } catch (error) {
                console.error('Field Resolution Inhibited:', error);
            } finally {
                setIsResolving(false);
            }
        };

        if (isOpen) {
            resolveAddress();
        }
    }, [position, isOpen]);

    const handleSave = () => {
        if (addressData) {
            const area = addressData.address.suburb || addressData.address.neighbourhood || addressData.address.residential || '';
            const road = addressData.address.road || '';
            const city = addressData.address.city || addressData.address.town || addressData.address.suburb || '';
            
            onSave({
                address: [road, area].filter(Boolean).join(', ') || addressData.display_name.split(',').slice(0, 2).join(', '),
                city: city,
                postalCode: addressData.address.postcode || '',
                country: addressData.address.country || '',
                lat: position[0],
                lng: position[1]
            });
            onClose();
        }
    };

    const findMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            }, (err) => {
                console.warn('GPS Signal Blocked', err);
            }, { enableHighAccuracy: true });
        }
    };

    // Auto-locate when modal opens for the first time if no initial position
    useEffect(() => {
        if (isOpen && !initialPos) {
            findMe();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 bg-slate-950/90 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 50, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white w-full h-full md:h-auto md:max-w-5xl md:rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col relative"
                >
                    {/* Elite Header */}
                    <div className="p-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-[1010]">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center text-yellow-400 shadow-xl shadow-slate-200">
                                <Navigation size={28} className="fill-current" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Set Delivery Location</h2>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Select your exact location for delivery</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all duration-300"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Interactive Map Area */}
                    <div className="relative flex-1 min-h-[50vh] bg-slate-50">
                        <MapContainer 
                            center={position} 
                            zoom={16} 
                            style={{ height: '100%', width: '100%' }} 
                            zoomControl={false}
                            className="z-[1000]"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={position} />
                            <MapEvents />
                            <MapGuard center={position} />
                        </MapContainer>

                        {/* Floating Action Buttons */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-3">
                            <button 
                                onClick={findMe}
                                className="h-14 px-6 bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                                <Crosshair size={20} className="text-blue-600" />
                                Use Current Location
                            </button>
                        </div>

                        {/* Premium Address Insight Overlay */}
                        <div className="absolute top-8 left-8 right-8 z-[1001]">
                            <motion.div 
                                layout
                                className="bg-white/95 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative"
                            >
                                {isResolving ? (
                                    <div className="flex items-center gap-4 text-slate-400 py-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                        <span className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Finding address...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <MapPin size={24} className="text-yellow-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Selected Address</p>
                                            <p className="text-sm font-black text-slate-800 leading-tight truncate">
                                                {addressData?.display_name || 'Select a point on the map...'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Premium Footer */}
                    <div className="p-8 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 relative z-[1010]">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 border border-slate-700">
                                <Check size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Location Details</p>
                                <p className="text-sm font-mono font-black text-white/90">Lat: {position[0].toFixed(4)} | Lng: {position[1].toFixed(4)}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={isResolving}
                            className="w-full md:w-auto bg-yellow-400 text-slate-900 px-12 h-16 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-yellow-400/20 hover:bg-white transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale group"
                        >
                            Confirm Location
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// MapGuard component to handle view refreshes and dimension fixes
function MapGuard({ center }) {
    const map = useMap();
    
    useEffect(() => {
        // Essential fix for blank tiles: invalidate size on mount and center change
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);

    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);

    return null;
}

export default LocationPickerModal;
