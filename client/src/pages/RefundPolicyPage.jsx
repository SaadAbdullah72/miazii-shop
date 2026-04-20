import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCcw } from 'lucide-react';

const RefundPolicyPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-800 font-bold">Refund Policy</span>
                </div>
            </div>

            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-10">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <RefreshCcw size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Refund & Cancellation Policy</h1>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Effective Date: April 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm">
                        <p>Thank you for shopping at Miazii Shop.</p>
                        
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-xl">
                            <h3 className="text-blue-900 font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                                <RefreshCcw size={20} />
                                The Miazii 7-Day Quality Promise
                            </h3>
                            <p className="text-blue-800 font-medium">
                                We want you to love your tech. If you are not 100% satisfied with your purchase, you can return your item for a full refund within **7 days** of delivery. No hidden catches, just simple and fair.
                            </p>
                        </div>

                        <p>If, for any reason, You are not completely satisfied with a purchase, We invite You to review our policy on refunds and returns.</p>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">1. Order Cancellations</h2>
                            <p>You are entitled to cancel Your Order within 24 hours without giving any reason for doing so.</p>
                            <p>The deadline for canceling an Order is 24 hours from the time you place the order. In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement via our Contact Form or Email.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">2. Conditions for Returns</h2>
                            <p>In order for the Goods to be eligible for a return, please make sure that:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>The Goods were purchased in the last 7 days</li>
                                <li>The Goods are in the original packaging</li>
                                <li>The Goods are unused and in the same condition that you received them</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">3. Non-Refundable Items</h2>
                            <p>The following Goods cannot be returned:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Goods made to Your specifications or clearly personalized.</li>
                                <li>Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.</li>
                                <li>Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">4. Returning Goods</h2>
                            <p>You are responsible for the cost and risk of returning the Goods to Us. We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
