import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check, Loader, Crosshair, Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    const [position, setPosition] = useState(initialPos || [23.8103, 90.4125]); // Default Dhaka
    const [addressData, setAddressData] = useState(null);
    const [isResolving, setIsResolving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
                    headers: { 'User-Agent': 'Miazi-Shop-Client' }
                });
                const data = await response.json();
                setAddressData(data);
            } catch (error) {
                console.error('Reverse Geocode failed:', error);
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
            });
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Select Precise Location</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Move the pin to your exact delivery point</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Map Area */}
                    <div className="relative flex-1 min-h-[400px]">
                        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={position} />
                            <MapEvents />
                            <ChangeView center={position} />
                        </MapContainer>

                        {/* Floating Buttons */}
                        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
                            <button 
                                onClick={findMe}
                                className="w-12 h-12 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all hover:scale-110 active:scale-95"
                                title="Find My Location"
                            >
                                <Crosshair size={24} />
                            </button>
                        </div>

                        {/* Overlay Address Preview */}
                        <div className="absolute top-6 left-6 right-6 z-[1000]">
                            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl">
                                {isResolving ? (
                                    <div className="flex items-center gap-3 text-slate-400 py-1">
                                        <Loader className="animate-spin" size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Pinpointing Location...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1"><MapPin size={16} className="text-yellow-500" /></div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">
                                            {addressData?.display_name || 'Generic Location'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coordinates Locked</p>
                            <p className="text-xs font-mono font-bold text-slate-600">{position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={isResolving}
                            className="bg-slate-900 text-yellow-400 px-8 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            <Check size={20} />
                            Confirm Location
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Helper component to fix map not centering after state update
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default LocationPickerModal;
