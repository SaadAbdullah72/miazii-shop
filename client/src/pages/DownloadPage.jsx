import React, { useState } from 'react';
import { Download, ShieldCheck, Smartphone, Cpu, CheckCircle, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

const DownloadPage = () => {
    const [downloading, setDownloading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('apk');

    const handleInstallClick = () => {
        setDownloading(true);
        const fileName = selectedTab === 'apk' ? 'Miazi Shop.apk' : 'Miazi Shop.aab';
        
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
                                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedTab === 'apk' ? 'bg-white text-slate-900 shadow-md shadow-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    APK File (Direct)
                                </button>
                                <button 
                                    onClick={() => setSelectedTab('aab')}
                                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedTab === 'aab' ? 'bg-white text-slate-900 shadow-md shadow-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
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
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                                    <p className="text-sm font-black text-slate-800 mt-1">5.0 ★</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Format</p>
                                    <p className="text-sm font-black text-slate-800 mt-1 uppercase">{selectedTab}</p>
                                </div>
                            </div>

                            {/* Main CTA */}
                            <button
                                onClick={handleInstallClick}
                                disabled={downloading}
                                className={`w-full py-4.5 bg-yellow-400 hover:bg-slate-900 hover:text-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/10 hover:shadow-slate-900/10 transition-all duration-300 scale-100 active:scale-95 ${downloading ? 'opacity-80 pointer-events-none' : ''}`}
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
        </div>
    );
};

export default DownloadPage;
