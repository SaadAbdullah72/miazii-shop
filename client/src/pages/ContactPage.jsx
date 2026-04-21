import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { 
    Mail, User, Phone, 
    MessageSquare, Tag, Send, 
    X, ChevronRight, UserCircle,
    Loader2
} from 'lucide-react';

const FloatingContactForm = () => {
    const location = useLocation();
    const { userInfo } = useSelector((state) => state.auth);

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: ''
    });

    // Auto-fill user data if logged in
    useEffect(() => {
        if (userInfo) {
            setFormData(prev => ({
                ...prev,
                name: userInfo.name || '',
                email: userInfo.email || ''
            }));
        }
    }, [userInfo]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/api/users/contact', formData);
            if (data.success) {
                toast.success('Your message was transmitted to the Support Hub.');
                setFormData({
                    ...formData,
                    subject: '',
                    message: ''
                });
                setIsOpen(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Communication link failed. Please retry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-25 right-6 z-[2000] font-sans">
            
            {/* THE FORM POPUP */}
            <div className={`absolute bottom-20 right-0 w-[90vw] sm:w-[400px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
                
                {/* Header */}
                <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none">Support Hub</h3>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-tighter">Online • Monitoring active inquiries</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="relative">
                        <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="FULL NAME *"
                            value={formData.name}
                            required
                            className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-yellow-400 focus:outline-none transition-all"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS *"
                            value={formData.email}
                            required
                            className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-yellow-400 focus:outline-none transition-all"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="flex bg-slate-50 rounded-2xl overflow-hidden focus-within:border-yellow-400 border border-transparent transition-all">
                        <div className="px-4 py-4 bg-slate-100 border-r border-gray-200 text-[10px] font-black">+880</div>
                        <input 
                            type="tel" 
                            placeholder="MOBILE NUMBER *"
                            value={formData.phone}
                            className="w-full bg-transparent py-4 px-4 text-xs font-bold uppercase tracking-widest focus:outline-none"
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>

                    <div className="relative">
                        <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="SUBJECT / ISSUE *"
                            value={formData.subject}
                            required
                            className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-yellow-400 focus:outline-none transition-all"
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                    </div>

                    <textarea 
                        rows="3"
                        placeholder="DESCRIBE YOUR COMPLAINT OR ISSUE... *"
                        value={formData.message}
                        required
                        className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 px-5 text-xs font-bold uppercase tracking-widest focus:bg-white focus:border-yellow-400 focus:outline-none transition-all resize-none"
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-yellow-400 hover:bg-slate-900 hover:text-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send Request <Send size={14} /></>}
                    </button>
                </form>
            </div>

            {/* THE FLOATING ACTION BUTTON */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-yellow-400 text-slate-900 hover:scale-110'}`}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20"></span>
                )}
            </button>
        </div>
    );
};

export default FloatingContactForm;