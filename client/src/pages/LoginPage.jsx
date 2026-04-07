import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';
// Switched to react-icons
import { FaUser, FaLock, FaFacebook, FaGoogle, FaUserPlus, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, loading } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="bg-[#f5f5f5] min-h-screen py-12 px-4 font-sans text-[#333e48]">
            <div className="max-w-[1200px] mx-auto">
                
                <div className="mb-10 border-b border-gray-200 pb-6">
                    {/* <h1 className="text-4xl font-bold tracking-tight text-[#333e48]">My Account</h1> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* LEFT COLUMN: LOGIN FORM */}
                    <div className="bg-white p-8 md:p-12 border border-gray-200 rounded-4xl shadow-sm mb-[34px]">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-medium text-[#333e48] mb-2">Welcome Back!</h2>
                            <p className="text-gray-500">Login to manage your account.</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className="space-y-5">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 border-r border-gray-200 text-gray-400 group-focus-within:text-[#fed700] transition-colors">
                                    <FaUser size={16} />
                                </div>
                                <input 
                                    type="email" 
                                    className="w-full pl-16 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:border-[#fed700] outline-none transition-all text-sm"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 border-r border-gray-200 text-gray-400 group-focus-within:text-[#fed700] transition-colors">
                                    <FaLock size={16} />
                                </div>
                                <input 
                                    type="password" 
                                    className="w-full pl-16 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:border-[#fed700] outline-none transition-all text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <Link to="#" className="text-sm text-gray-400 hover:text-[#333e48] underline decoration-dotted">Forgot Password?</Link>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-[#fed700] text-[#333e48] py-4 rounded-full font-bold text-lg hover:bg-[#333e48] hover:text-white transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50"
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin" size={22}/> : "Login"}
                            </button>

                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-300">
                                    Do not have an account? <Link to="/register" className="text-gray-600 hover:text-[#fed700] font-medium ml-1">Signup</Link>
                                </p>
                            </div>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold tracking-widest">OR</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-[#e9effa] text-[#3b5998] rounded-full text-sm font-bold hover:bg-[#dce5f7] transition-colors">
                                    <FaFacebook size={18} /> Facebook
                                </button>
                                <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f9e9e9] text-[#db4437] rounded-full text-sm font-bold hover:bg-[#f2dada] transition-colors">
                                    <FaGoogle size={16} /> Google
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: REGISTER INFORMATION */}
                    

                </div>
            </div>
        </div>
    );
};

export default LoginPage;