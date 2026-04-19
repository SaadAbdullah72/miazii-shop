import React from 'react';
import { Shield, Lock, Eye, Trash2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Clean Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-8 md:p-16">
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 hover:text-yellow-600 transition-all group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Go Back
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <Shield size={28} className="text-yellow-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Privacy Policy</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Global Data Safety Standards • April 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Introduction */}
                <section>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 text-sm">01</span>
                        Introduction
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Welcome to <strong>Miazi Shop</strong>. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile application and website services. By using Miazi Shop, you agree to the terms outlined here.
                    </p>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0 animate-pulse" />
                        <p className="text-emerald-800 text-sm font-bold uppercase tracking-tight">
                            Strict Data Protection: We NEVER sell, rent, or trade your personal data to any third parties under any circumstances.
                        </p>
                    </div>
                </section>

                {/* Data Collection */}
                <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                        <Lock size={20} className="text-yellow-500" /> Information We Collect
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Personal Data</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you create an account or place an order.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Usage Data</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                We automatically collect data about your interactions with our app, including your device type, IP address, browsing patterns, and unique device identifiers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Usage */}
                <section>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 text-sm">02</span>
                        How We Use Your Data
                    </h2>
                    <ul className="grid grid-cols-1 gap-4">
                        {[
                            'To process and fulfill your orders accurately',
                            'To provide customer support and technical assistance',
                            'To personalize your shopping experience',
                            'To send transaction notifications and promotional updates',
                            'To detect and prevent fraudulent activities'
                        ].map((item, idx) => (
                            <li key={idx} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 shrink-0" />
                                <span className="text-slate-700 text-sm font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Cookies */}
                <section className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                        <Eye size={20} className="text-yellow-600" /> Cookies & Tracking
                    </h2>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        Miazi Shop uses cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                        You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                    </p>
                </section>

                {/* Data Deletion */}
                <section>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3 text-red-600">
                        <Trash2 size={20} /> Data Deletion & Rights
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        In compliance with global data protection regulations and <strong>Google Play Store policies</strong>, you have the right to access, update, or delete your personal data at any time.
                    </p>
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-red-900 text-sm mb-2 uppercase tracking-tight">How to delete your account:</h3>
                        <p className="text-red-700 text-xs leading-loose">
                            To permanently delete your account and all associated data, navigate to your <strong>Profile &gt; Security &gt; Delete Account</strong>. This action is irreversible and will immediately remove your orders, reviews, and profile details from our active production database.
                        </p>
                    </div>
                </section>

                {/* Third Party */}
                <section>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 text-sm">03</span>
                        Third-Party Services
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        We may employ third-party companies and individuals to facilitate our Service (e.g., Payment Processors, Analytics Providers). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>
                </section>

                {/* Contact */}
                <section className="pt-12 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Contact Our Privacy Team</p>
                    <h3 className="text-lg font-black text-slate-900">saad489254@gmail.com</h3>
                    <p className="text-slate-500 text-sm mt-2">Miazi Shop HQ, Dhaka, Bangladesh</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
