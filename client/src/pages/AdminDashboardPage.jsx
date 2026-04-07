import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api, { BASE_URL } from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { Package, Users, ShoppingBag, Layers, Plus, Trash2, Edit, Loader, X, Upload } from 'lucide-react';

const AdminDashboardPage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Product Form State
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', price: '', discountPrice: '', description: '', brand: '', countInStock: '', category: '', images: ['']
    });

    // Category Form State
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', image: '' });

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [userInfo, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes, ordRes] = await Promise.all([
                api.get('/api/products'),
                api.get('/api/categories'),
                api.get('/api/orders'),
            ]);
            setProducts(prodRes.data.products || []);
            setCategories(catRes.data || []);
            setOrders(ordRes.data || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // ============== PRODUCT CRUD ==============
    const resetProductForm = () => {
        setProductForm({ name: '', price: '', discountPrice: '', description: '', brand: '', countInStock: '', category: '', images: [''] });
        setEditingProduct(null);
        setShowProductForm(false);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...productForm,
                price: Number(productForm.price),
                discountPrice: Number(productForm.discountPrice) || 0,
                countInStock: Number(productForm.countInStock),
                slug: productForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
                images: productForm.images.filter(img => img.trim() !== ''),
            };

            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, payload);
                toast.success('Product updated!');
            } else {
                // Create and then update
                const res = await api.post('/api/products', { categoryId: payload.category });
                await api.put(`/api/products/${res.data._id}`, payload);
                toast.success('Product created!');
            }
            resetProductForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const editProduct = (p) => {
        setProductForm({
            name: p.name, price: p.price, discountPrice: p.discountPrice || '', description: p.description,
            brand: p.brand, countInStock: p.countInStock, category: p.category?._id || p.category || '',
            images: p.images?.length ? p.images : ['']
        });
        setEditingProduct(p);
        setShowProductForm(true);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            toast.success('Product deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setProductForm(prev => ({ ...prev, images: [data.image, ...prev.images.filter(i => i)] }));
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    // ============== CATEGORY CRUD ==============
    const resetCategoryForm = () => {
        setCategoryForm({ name: '', slug: '', image: '' });
        setEditingCategory(null);
        setShowCategoryForm(false);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...categoryForm, slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-') };
            if (editingCategory) {
                await api.put(`/api/categories/${editingCategory._id}`, payload);
                toast.success('Category updated!');
            } else {
                await api.post('/api/categories', payload);
                toast.success('Category created!');
            }
            resetCategoryForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/api/categories/${id}`);
            toast.success('Category deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    // ============== ORDER STATUS ==============
    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, { status });
            toast.success(`Order marked as ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader size={40} className="animate-spin text-[#fed700]" />
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-extrabold mb-6">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="bg-[#fed700] p-4 rounded-2xl shadow-sm transform hover:-translate-y-1 transition duration-300">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#333e48] opacity-60 mb-1">Products</p>
                    <p className="text-2xl sm:text-3xl font-black text-[#333e48]">{products.length}</p>
                </div>
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm transform hover:-translate-y-1 transition duration-300">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Categories</p>
                    <p className="text-2xl sm:text-3xl font-black text-blue-600">{categories.length}</p>
                </div>
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm transform hover:-translate-y-1 transition duration-300">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Orders</p>
                    <p className="text-2xl sm:text-3xl font-black text-green-600">{orders.length}</p>
                </div>
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm transform hover:-translate-y-1 transition duration-300">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Revenue</p>
                    <p className="text-2xl sm:text-3xl font-black text-purple-600">৳{orders.reduce((a, o) => a + (o.totalPrice || 0), 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b pb-0 overflow-x-auto">
                {[
                    { key: 'products', label: 'Products', icon: <Package size={16} /> },
                    { key: 'categories', label: 'Categories', icon: <Layers size={16} /> },
                    { key: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition whitespace-nowrap ${activeTab === tab.key ? 'border-b-2 border-[#fed700] text-[#333e48]' : 'text-gray-400 hover:text-gray-600'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ============== PRODUCTS TAB ============== */}
            {activeTab === 'products' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">All Products ({products.length})</h2>
                        <button onClick={() => { resetProductForm(); setShowProductForm(true); }}
                            className="bg-[#333e48] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-black transition">
                            <Plus size={16} /> Add Product
                        </button>
                    </div>

                    {/* Product Form Modal */}
                    {showProductForm && (
                        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-2 sm:p-4">
                            <div className="bg-white rounded-2xl p-5 sm:p-8 max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-xl sm:text-2xl text-[#333e48]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <button onClick={resetProductForm} className="text-gray-400 hover:text-gray-600 transition p-1"><X size={24} /></button>
                                </div>
                                <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
                                        <input type="text" required placeholder="e.g. iPhone 15 Pro" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})}
                                            className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Price (৳)</label>
                                            <input type="number" required placeholder="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})}
                                                className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Discount (Optional)</label>
                                            <input type="number" placeholder="0" value={productForm.discountPrice} onChange={e => setProductForm({...productForm, discountPrice: e.target.value})}
                                                className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Stock</label>
                                            <input type="number" required placeholder="0" value={productForm.countInStock} onChange={e => setProductForm({...productForm, countInStock: e.target.value})}
                                                className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Brand</label>
                                            <input type="text" required placeholder="Apple, Samsung..." value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})}
                                                className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                                            <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}
                                                className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition bg-white">
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                                        <textarea required placeholder="Detailed description..." rows="4" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                                            className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-[#fed700] transition resize-none" />
                                    </div>
                                    
                                    {/* Image Upload */}
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50/50">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3 text-center">Visual Assets</label>
                                        <div className="flex flex-col items-center gap-3">
                                            <label className="w-full flex items-center justify-center gap-2 bg-[#333e48] text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-black transition text-sm font-bold shadow-md">
                                                <Upload size={18} /> Choose File Local
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                            <p className="text-xs text-gray-400 font-bold">— OR —</p>
                                            <input type="text" placeholder="Paste Image URL" value={productForm.images[0] || ''} onChange={e => setProductForm({...productForm, images: [e.target.value]})}
                                                className="w-full border-2 border-gray-100 p-3 rounded-xl text-sm outline-none bg-white font-semibold" />
                                        </div>
                                        {productForm.images[0] && (
                                            <div className="mt-4 flex justify-center">
                                                <div className="relative group">
                                                    <img src={productForm.images[0]?.startsWith('http') ? productForm.images[0] : `${BASE_URL}${productForm.images[0]}`} alt="Preview" className="w-24 h-24 object-contain border-2 border-[#fed700] rounded-xl bg-white shadow-sm" />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                                                        <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded">Preview</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button type="submit" className="bg-[#fed700] text-[#333e48] font-black text-lg py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg mt-2 mb-2">
                                        {editingProduct ? 'Save Changes' : 'Launch Product'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white border rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3">Image</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Stock</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-400">No products yet. Click "Add Product" to create one.</td></tr>
                                ) : products.map(p => (
                                    <tr key={p._id} className="border-t hover:bg-gray-50">
                                        <td className="p-3"><img src={p.images?.[0]?.startsWith('http') ? p.images[0] : `${BASE_URL}${p.images?.[0]}` || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 object-contain rounded" /></td>
                                        <td className="p-3 font-semibold max-w-[200px] truncate">{p.name}</td>
                                        <td className="p-3 font-bold">৳{p.price}</td>
                                        <td className="p-3"><span className={`font-bold ${p.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.countInStock}</span></td>
                                        <td className="p-3 text-gray-500">{p.category?.name || '—'}</td>
                                        <td className="p-3 flex gap-2">
                                            <button onClick={() => editProduct(p)} className="text-blue-600 hover:text-blue-800 p-1"><Edit size={16} /></button>
                                            <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ============== CATEGORIES TAB ============== */}
            {activeTab === 'categories' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">All Categories ({categories.length})</h2>
                        <button onClick={() => { resetCategoryForm(); setShowCategoryForm(true); }}
                            className="bg-[#333e48] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-black transition">
                            <Plus size={16} /> Add Category
                        </button>
                    </div>

                    {showCategoryForm && (
                        <div className="bg-white border rounded-xl p-6 mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                                <button onClick={resetCategoryForm} className="text-gray-400"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleCategorySubmit} className="flex flex-col sm:flex-row gap-3">
                                <input type="text" required placeholder="Category Name" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                                    className="border p-3 rounded-lg outline-none flex-1 focus:border-[#fed700]" />
                                <input type="text" placeholder="Slug (auto)" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})}
                                    className="border p-3 rounded-lg outline-none flex-1 focus:border-[#fed700]" />
                                <button type="submit" className="bg-[#fed700] text-[#333e48] font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition whitespace-nowrap">
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.length === 0 ? (
                            <p className="text-gray-400 col-span-full text-center py-8">No categories yet. Create one first before adding products.</p>
                        ) : categories.map(c => (
                            <div key={c._id} className="bg-white border rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{c.name}</h3>
                                    <p className="text-xs text-gray-400">{c.slug}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setCategoryForm({ name: c.name, slug: c.slug, image: c.image || '' }); setEditingCategory(c); setShowCategoryForm(true); }}
                                        className="text-blue-600 hover:text-blue-800 p-1"><Edit size={16} /></button>
                                    <button onClick={() => deleteCategory(c._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============== ORDERS TAB ============== */}
            {activeTab === 'orders' && (
                <div>
                    <h2 className="font-bold mb-4">All Orders ({orders.length})</h2>
                    <div className="bg-white border rounded-xl overflow-x-auto">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Order ID</th>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Customer</th>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Date</th>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Total</th>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Paid</th>
                                        <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center py-12 text-gray-400 font-bold italic">No orders yet.</td></tr>
                                    ) : orders.map(o => (
                                        <tr key={o._id} className="border-t hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-mono text-xs font-bold text-gray-400">#{o._id.slice(-8)}</td>
                                            <td className="p-4 font-bold text-[#333e48]">{o.user?.name || 'Guest User'}</td>
                                            <td className="p-4 text-gray-500 font-semibold">{new Date(o.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 font-black">৳{o.totalPrice?.toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                                                    o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    o.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>{o.orderStatus || 'Processing'}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${o.isPaid ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>
                                                    {o.isPaid ? 'PAID' : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select onChange={(e) => updateOrderStatus(o._id, e.target.value)} defaultValue=""
                                                    className="border-2 border-gray-100 rounded-lg px-2 py-1 text-xs outline-none focus:border-[#fed700] transition font-bold bg-white cursor-pointer">
                                                    <option value="" disabled>Status</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Orders Grid */}
                        <div className="md:hidden divide-y">
                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 font-bold px-6">No orders yet.</div>
                            ) : orders.map(o => (
                                <div key={o._id} className="p-5 flex flex-col gap-3 bg-white hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 mb-1 leading-none uppercase">Order ID: #{o._id.slice(-8)}</p>
                                            <h4 className="font-bold text-[#333e48] text-base">{o.user?.name || 'Guest User'}</h4>
                                            <p className="text-xs text-gray-400 font-semibold">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-[#333e48] mb-1 leading-none">৳{o.totalPrice?.toLocaleString()}</p>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${o.isPaid ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>
                                                {o.isPaid ? 'PAID' : 'UNPAID'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                                            o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            o.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>{o.orderStatus || 'Processing'}</span>
                                        <select onChange={(e) => updateOrderStatus(o._id, e.target.value)} defaultValue=""
                                            className="border-2 border-gray-100 rounded-lg px-2 py-1 text-xs outline-none focus:border-[#fed700] transition font-bold bg-white cursor-pointer min-w-[120px]">
                                            <option value="" disabled>Change Status</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
