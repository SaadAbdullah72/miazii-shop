import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

const TermsConditionsPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-800 font-bold">Terms & Conditions</span>
                </div>
            </div>

            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-10">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Terms & Conditions</h1>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Last Updated: April 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm">
                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">1. Agreement to Terms</h2>
                            <p>By accessing or using the Miazii Shop web application and related mobile applications, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">2. Intellectual Property</h2>
                            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Miazii Shop and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Miazii Shop.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">3. Purchases & Payment</h2>
                            <p>We accept Cash on Delivery and direct Bank Transfers. By placing an order, you warrant that you are legally capable of entering into binding contracts. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">4. Digital Products & Billing</h2>
                            <p>Miazii Shop operates exclusively as an online retailer for physical goods. We do not sell digital products or subscriptions that circumvent Google Play Billing policies. All physical goods are delivered offline.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">5. Changes to Terms</h2>
                            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditionsPage;
