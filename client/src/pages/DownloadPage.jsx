import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Smartphone, Cpu, CheckCircle, AlertTriangle, ArrowRight, ExternalLink, Bell, X, Star } from 'lucide-react';
import api from '../utils/axiosConfig';

const DownloadPage = () => {
    const [downloading, setDownloading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('apk');
    const [downloadsCount, setDownloadsCount] = useState(5876); // Beautiful default
    const [isNoticeOpen, setIsNoticeOpen] = useState(false);
    
    // Configurations fetched from backend
    const [config, setConfig] = useState({
        notificationTitle: "Notification",
        notificationMessage: "সেরা পারফরম্যান্স ও নির্ভরযোগ্য সার্ভিসের জন্য X KING V2RAY চালান — আমাদের ভিপিএন সম্পূর্ণ অটো-আপডেট সিস্টেম।",
        notificationActive: true,
        slides: [
            '/electro_slider_watch.png',
            '/slider-phone.png',
            '/splash-hand.png'
        ]
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    // Fetch config and count on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await api.get('/api/download-count');
                if (data) {
                    setDownloadsCount(data.count);
                    setConfig({
                        notificationTitle: data.notificationTitle || "Notification",
                        notificationMessage: data.notificationMessage || "",
                        notificationActive: data.notificationActive !== false,
                        slides: data.slides || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch download page configuration", err);
            }
        };

        fetchConfig();
    }, []);

    // Automatic slide transitions every 5 seconds
    useEffect(() => {
        if (!config.slides || config.slides.length < 2) return;
        
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % config.slides.length);
        }, 5000);

        return () => clearInterval(slideTimer);
    }, [config.slides]);

    const handleInstallClick = async () => {
        setDownloading(true);
        const fileName = selectedTab === 'apk' ? 'Miazi Shop.apk' : 'Miazi Shop.aab';
        
        // Trigger download count increment on the server
        try {
            const { data } = await api.post('/api/download-count');
            if (data && data.count !== undefined) {
                setDownloadsCount(data.count);
            }
        } catch (err) {
            console.error("Error updating download count:", err);
        }

        // Trigger the file download
        const link = document.createElement('a');
        link.href = `/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setDownloading(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Elegant Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-400/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-300/10 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 text-slate-800 rounded-full mb-6 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-xs font-black uppercase tracking-widest">Official Release v1.0.0</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Experience <span className="bg-gradient-to-r from-slate-900 to-yellow-600 bg-clip-text text-transparent">Miazi Shop</span> on Mobile
                    </h1>
                    <p className="text-slate-500 mt-4 text-base sm:text-lg max-w-2xl mx-auto font-medium">
                        Download our ultra-fast and lightweight official Android app for a seamless, secured, and premium shopping experience.
                    </p>
                </div>

                {/* Hero Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16">
                    {/* Device Showcase (Left Column) */}
                    <div className="md:col-span-5 flex justify-center order-2 md:order-1">
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-yellow-400/20 rounded-[2.5rem] blur-xl opacity-75 group-hover:scale-105 transition-transform duration-500" />
                            {/* Device Frame Mockup */}
                            <div className="relative w-[240px] h-[480px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 overflow-hidden">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                                    <div className="w-12 h-1 bg-slate-800 rounded-full" />
                                </div>
                                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden bg-slate-950 flex flex-col justify-between p-6">
                                    {/* App Mock Interface */}
                                    <div className="flex justify-between items-center mt-3">
                                        <img src="/logo.png" alt="Miazi Shop Logo" className="h-6 object-contain filter brightness-0 invert" />
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-[10px] text-white font-bold">M</span>
                                        </div>
                                    </div>
                                    <div className="my-auto text-center py-6">
                                        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-4 transform -rotate-6">
                                            <span className="text-slate-900 text-3xl font-black">M</span>
                                        </div>
                                        <p className="text-white text-base font-black">Miazi Shop</p>
                                        <p className="text-slate-400 text-[10px] mt-1 tracking-wider uppercase">Online Store</p>
                                    </div>
                                    <div className="space-y-2 mb-2">
                                        <div className="w-full h-8 bg-yellow-400 text-slate-900 text-[11px] font-bold rounded-xl flex items-center justify-center">
                                            Premium UI
                                        </div>
                                        <div className="w-full h-8 bg-white/5 text-white/70 text-[10px] font-medium rounded-xl flex items-center justify-center">
                                            Lightning Fast
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Download Config Panel (Right Column) */}
                    <div className="md:col-span-7 space-y-6 order-1 md:order-2">
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden">
                            {/* Top Accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-400" />
                            
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6">Download Package</h3>

                            {/* Package selector tabs */}
                            <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-1.5 rounded-2xl">
                                <button 
                                    onClick={() => setSelectedTab('apk')}
                                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedTab === 'apk' ? 'bg-white text-slate-900 shadow-md shadow-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    APK File (Direct)
                                </button>
                                <button 
                                    onClick={() => setSelectedTab('aab')}
                                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedTab === 'aab' ? 'bg-white text-slate-900 shadow-md shadow-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    AAB File (Bundle)
                                </button>
                            </div>

                            {/* Download Specs */}
                            <div className="grid grid-cols-3 gap-4 py-4 px-5 bg-slate-50/50 rounded-2xl mb-8 border border-slate-100/30">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</p>
                                    <p className="text-sm font-black text-slate-800 mt-1">{selectedTab === 'apk' ? '1.4 MB' : '1.5 MB'}</p>
                                </div>
                                <div className="text-center border-x border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Downloads</p>
                                    <p className="text-sm font-black text-slate-800 mt-1">{downloadsCount.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                                    <p className="text-sm font-black text-slate-800 mt-1 flex items-center justify-center gap-0.5">5.0 <Star size={12} className="fill-yellow-400 text-yellow-400" /></p>
                                </div>
                            </div>

                            {/* Main CTA */}
                            <button
                                onClick={handleInstallClick}
                                disabled={downloading}
                                className={`w-full py-4.5 bg-yellow-400 hover:bg-slate-900 hover:text-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/10 hover:shadow-slate-900/10 transition-all duration-300 scale-100 active:scale-95 cursor-pointer ${downloading ? 'opacity-80 pointer-events-none' : ''}`}
                            >
                                {downloading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                        Preparing Download...
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        Install Now
                                    </>
                                )}
                            </button>

                            {/* Security Notice */}
                            <div className="flex items-start gap-3 mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-500/10">
                                <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wide">100% Safe & Secure</p>
                                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5 leading-relaxed">
                                        This package is directly signed by Miazi Shop's official developer certificate. Checked clean of any malware or modifications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PREMIUM PREVIEW POSTER / SLIDESHOW */}
                {config.slides && config.slides.length > 0 && (
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl shadow-slate-100/50 mb-16 overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#fed700]" />
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 text-center">App Previews</h3>
                        <div className="relative aspect-video max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-[#fed700] group">
                            {config.slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                                >
                                    <img
                                        src={slide}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-contain bg-[#fed700]"
                                        style={{ 
                                            mixBlendMode: 'multiply',
                                            ...(slide.includes('splash-hand') ? { clipPath: 'inset(0 0 22% 0)', transform: 'scale(1.02) translateY(3%)' } : {})
                                        }}
                                        onError={(e) => {
                                            e.target.src = '/splash-hand.png';
                                            e.target.onerror = null;
                                        }}
                                    />
                                </div>
                            ))}
                            {/* Slide indicators */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                {config.slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                                            index === currentSlide ? 'bg-slate-900 w-6' : 'bg-slate-900/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Features & Specs Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white border border-slate-100/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4 border border-slate-100">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Feather Light</h4>
                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                                Extremely small size footprint. Installs instantly and uses minimal device storage and RAM.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4 border border-slate-100">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Optimized Engine</h4>
                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                                Crafted specifically for smooth rendering, quick interactions, and frictionless browsing on Android.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4 border border-slate-100">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Enhanced Security</h4>
                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                                Isolated data sandboxing keeps your personal profile details, orders, and payment keys perfectly secure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Installation Guide */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 mb-8">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-8 text-center sm:text-left">
                        Easy Installation Steps
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                                    01
                                </span>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Download Package</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed pl-10">
                                Click the <span className="font-bold text-slate-800">Install Now</span> button above to fetch the certified APK file.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                                    02
                                </span>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Enable Source</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed pl-10">
                                If prompted, click "Settings" and toggle <span className="font-bold text-slate-800">"Allow installation from this source"</span>.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                                    03
                                </span>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Install & Open</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed pl-10">
                                Once downloaded, open the file and click <span className="font-bold text-slate-800">"Install"</span> to launch the app!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer status link */}
                <div className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    Official App Hub for Miazi Shop
                </div>
            </div>

            {/* FLOATING NOTIFICATION BELL BUTTON */}
            {config.notificationActive && (
                <button
                    onClick={() => setIsNoticeOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer z-50 animate-[pulseTheme_2s_infinite_ease-in-out] hover:scale-110 active:scale-95 transition-transform"
                >
                    <Bell size={24} className="animate-[wiggleBell_1s_infinite_ease-in-out]" />
                </button>
            )}

            {/* FIXED CENTER BEZEL NOTICE MODAL */}
            {isNoticeOpen && (
                <div 
                    className="fixed inset-0 w-screen h-screen bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[99999] p-4 animate-[fadeIn_0.3s_ease_forwards]"
                    onClick={() => setIsNoticeOpen(false)}
                >
                    <div 
                        className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative text-center border-l-4 border-r-4 border-b-8 border-t border-[#fed700] border-t-white shadow-2xl animate-[modalEnter_0.4s_cubic-bezier(0.18,0.89,0.32,1.28)_forwards]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 rounded-3xl flex items-center justify-center mb-4">
                                <Bell size={32} className="animate-[bounceBell_1.5s_infinite]" />
                            </div>
                            <h3 className="font-['Outfit'] text-lg font-black text-slate-900 uppercase tracking-widest mb-3">
                                {config.notificationTitle}
                            </h3>
                        </div>
                        
                        <div className="max-h-[50vh] overflow-y-auto mb-6 px-1 py-1 scrollbar-thin">
                            <p className="text-slate-600 text-sm font-bold leading-relaxed whitespace-pre-line text-center">
                                {config.notificationMessage}
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsNoticeOpen(false)}
                            className="w-full py-4.5 bg-yellow-400 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-yellow-400/10 cursor-pointer animate-[btnBreathing_2s_infinite_ease-in-out] hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}

            {/* Embedded styles for advanced notice effects */}
            <style>{`
                @keyframes pulseTheme {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(254, 215, 0, 0.6); }
                    70% { transform: scale(1.08); box-shadow: 0 0 0 15px rgba(254, 215, 0, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(254, 215, 0, 0); }
                }
                @keyframes wiggleBell {
                    0%, 100% { transform: rotate(0deg); }
                    15% { transform: rotate(12deg); }
                    30% { transform: rotate(-12deg); }
                    45% { transform: rotate(8deg); }
                    60% { transform: rotate(-8deg); }
                    75% { transform: rotate(4deg); }
                    90% { transform: rotate(-4deg); }
                }
                @keyframes bounceBell {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                    60% { transform: translateY(-3px); }
                }
                @keyframes modalEnter {
                    from { transform: scale(0.85); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes btnBreathing {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default DownloadPage;
