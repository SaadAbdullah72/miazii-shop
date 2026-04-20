import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';

const AboutUsPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200 mb-8">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-800 font-bold">About Us</span>
                </div>
            </div>

            <div className="container-custom max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-10">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                            <Info size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">About Miazii Shop</h1>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Our Story & Mission</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm">
                        <p>Welcome to Miazii Shop, your number one source for all things related to Consumer Electronics, Smartwatches, Smartphones, and premium tech accessories.</p>
                        
                        <p>We're dedicated to providing you the very best of genuine electronic products, with an emphasis on authentic quality, fast nationwide delivery, and top-tier customer service.</p>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2 mt-8">Our Mission</h2>
                            <p>Founded with a passion for technology, Miazii Shop has come a long way from its beginnings. When we first started out, our passion for "bringing premium technology closer to everyone" drove us to start our own business.</p>
                            <p>We now serve customers all over the country and are thrilled that we're able to turn our passion into our own application and website.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2 mt-8">Customer Commitment</h2>
                            <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us through our Contact Form or support email listed in the footer.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
