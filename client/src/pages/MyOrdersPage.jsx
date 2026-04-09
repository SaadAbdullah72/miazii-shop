import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { Loader, Package, ChevronRight, Calendar, CreditCard, Truck, Eye, ArrowRight, ShoppingCart, Info, CheckCircle2, Clock } from 'lucide-react';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrders();
        }
    }, [userInfo]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center py-64 bg-electro-bg h-screen text-center">
            <Loader size={40} className="animate-spin text-electro-yellow mb-4" />
            <span className="text-electro-text font-bold animate-pulse">Accessing Order Registry...</span>
        </div>
    );

    if (error) return (
        <div className="container-custom py-20 text-center">
            <div className="bg-red-50 text-red-600 p-12 rounded-2xl border border-red-100 max-w-2xl mx-auto shadow-sm">
                <Info size={48} className="mx-auto mb-6 opacity-20" />
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Access Denied / Failure</h2>
                <p className="mb-10 text-sm font-medium">{error}</p>
                <Link to="/" className="bg-electro-dark text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors inline-block">Return To Store</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-electro-bg min-h-screen pb-32">
            {/* BREADCRUMB */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-12">
                <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-electro-blue transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-electro-dark font-bold">Order History</span>
                </div>
            </div>

            <div className="container-custom">
                <header className="mb-12 text-center md:text-left relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-electro-yellow rounded-full flex items-center justify-center text-electro-dark shadow-sm">
                           <Package size={24} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-electro-dark tracking-tight">Order History</h1>
                    </div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest ml-16">Review and track your premium tech deployments.</p>
                </header>

                {orders.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-20 text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none rotate-12">
                           <ShoppingCart size={300} />
                        </div>
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-gray-100 italic">
                           <ShoppingCart size={40} className="text-gray-200" />
                        </div>
                        <h2 className="text-3xl font-bold text-electro-dark mb-4">No order data found.</h2>
                        <p className="text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">It looks like you haven't initialized any logistics dispatches yet. Visit the catalog to begin your premium tech acquisition journey.</p>
                        <Link to="/" className="btn-electro bg-electro-yellow text-electro-dark px-12 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition flex items-center gap-4 mx-auto w-fit">
                            Return To Shop <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                    <th className="py-6 px-10">Deployment ID</th>
                                    <th className="py-6 px-10">Timestamp</th>
                                    <th className="py-6 px-10">Logistics Total</th>
                                    <th className="py-6 px-10">Payment Condition</th>
                                    <th className="py-6 px-10">Delivery Status</th>
                                    <th className="py-6 px-10 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="py-6 px-10">
                                            <span className="font-bold text-electro-dark tracking-tighter">#{order._id.toUpperCase()}</span>
                                        </td>
                                        <td className="py-6 px-10">
                                            <div className="flex items-center gap-3 text-gray-500 font-medium">
                                                <Calendar size={14} className="text-gray-300" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-6 px-10">
                                            <span className="font-bold text-electro-dark text-lg italic">৳{order.totalPrice.toLocaleString()}</span>
                                        </td>
                                        <td className="py-6 px-10 text-sm">
                                            {order.isPaid ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full w-fit border border-green-100">
                                                    <CheckCircle2 size={12} /> COMPLETED
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full w-fit border border-red-100">
                                                    <Clock size={12} /> PENDING
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 px-10 text-sm">
                                            {order.isDelivered ? (
                                                <div className="flex items-center gap-2 text-electro-blue font-bold bg-blue-50 px-3 py-1 rounded-full w-fit border border-blue-100">
                                                    <Truck size={12} /> ARRIVED
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full w-fit border border-amber-100 uppercase tracking-widest text-[9px]">
                                                        <Truck size={12} className="animate-pulse" /> Shipping
                                                    </div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                                        Arriving Before: {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 px-10 text-right">
                                            <Link 
                                                to={`/order/${order._id}`} 
                                                className="inline-flex items-center gap-2 bg-gray-50 group-hover:bg-electro-yellow text-gray-400 group-hover:text-electro-dark px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all duration-300"
                                            >
                                                Details <Eye size={12} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
