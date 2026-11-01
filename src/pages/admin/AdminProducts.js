import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, } from 'lucide-react';
import { apiRequest, formatCurrency } from '../../services/api';
export const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    // Form Fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [productType, setProductType] = useState('FAST_FOOD');
    const [sellingPriceRupees, setSellingPriceRupees] = useState(149);
    const [originalPriceRupees, setOriginalPriceRupees] = useState(179);
    const [availability, setAvailability] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [paymentPolicy, setPaymentPolicy] = useState('PARTIAL_PAYMENT');
    const [partialPercentage, setPartialPercentage] = useState(40);
    const fetchCatalog = async () => {
        setLoading(true);
        try {
            const [prodData, catData] = await Promise.all([
                apiRequest('/products'),
                apiRequest('/products/categories'),
            ]);
            if (prodData.products)
                setProducts(prodData.products);
            if (catData.categories) {
                setCategories(catData.categories);
                if (catData.categories.length > 0 && !categoryId) {
                    setCategoryId(catData.categories[0]._id);
                }
            }
        }
        catch (err) {
            console.error('Failed to load products/categories:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCatalog();
    }, []);
    const openCreateModal = () => {
        setEditingProduct(null);
        setName('');
        setDescription('');
        setImageUrl('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');
        setProductType('FAST_FOOD');
        setSellingPriceRupees(149);
        setOriginalPriceRupees(179);
        setAvailability(true);
        setIsFeatured(false);
        setPaymentPolicy('PARTIAL_PAYMENT');
        setPartialPercentage(40);
        setShowModal(true);
    };
    const openEditModal = (p) => {
        setEditingProduct(p);
        setName(p.name);
        setDescription(p.description);
        setImageUrl(p.images[0] || '');
        setCategoryId(typeof p.categoryId === 'string' ? p.categoryId : p.categoryId._id);
        setProductType(p.productType);
        setSellingPriceRupees(p.sellingPrice / 100);
        setOriginalPriceRupees(p.originalPrice ? p.originalPrice / 100 : 0);
        setAvailability(p.availability);
        setIsFeatured(p.isFeatured);
        setPaymentPolicy(p.paymentPolicy);
        setPartialPercentage(p.partialPaymentPercentage || 40);
        setShowModal(true);
    };
    const handleToggleStock = async (p) => {
        try {
            await apiRequest(`/products/${p._id}/availability`, { method: 'PATCH' });
            fetchCatalog();
        }
        catch (err) {
            alert(err.message || 'Failed to toggle availability');
        }
    };
    const handleDeleteProduct = async (p) => {
        if (!confirm(`Delete product ${p.name}?`))
            return;
        try {
            await apiRequest(`/products/${p._id}`, { method: 'DELETE' });
            fetchCatalog();
        }
        catch (err) {
            alert(err.message || 'Failed to delete');
        }
    };
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                description,
                images: [imageUrl],
                categoryId,
                productType,
                sellingPrice: Math.round(sellingPriceRupees * 100),
                originalPrice: originalPriceRupees > 0 ? Math.round(originalPriceRupees * 100) : undefined,
                availability,
                isFeatured,
                paymentPolicy,
                partialPaymentPercentage: partialPercentage,
            };
            if (editingProduct) {
                await apiRequest(`/products/${editingProduct._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
            }
            else {
                await apiRequest('/products', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }
            setShowModal(false);
            fetchCatalog();
        }
        catch (err) {
            alert(err.message || 'Failed to save product');
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-20", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Product Management" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Create, edit, manage payment policies, and toggle stock availability." })] }), _jsxs("button", { onClick: openCreateModal, className: "px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add New Product" })] })] }), loading ? (_jsx("div", { className: "py-20 text-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: products.map((p) => (_jsxs("div", { className: "p-4 rounded-3xl bg-night-900 border border-night-750 flex flex-col justify-between space-y-3 shadow-lg", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("img", { src: p.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', alt: p.name, className: "w-20 h-20 rounded-2xl object-cover bg-night-950 flex-shrink-0 border border-night-800" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-bold text-sm text-white truncate", children: p.name }), _jsx("div", { className: "text-xs font-black text-purple-400 mt-0.5", children: formatCurrency(p.sellingPrice) }), _jsxs("div", { className: "flex flex-wrap items-center gap-1.5 mt-1.5", children: [_jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-night-800 text-slate-300", children: p.productType }), _jsx("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300", children: p.paymentPolicy.replace(/_/g, ' ') })] })] })] }), _jsxs("div", { className: "pt-2 border-t border-night-800 flex items-center justify-between", children: [_jsxs("button", { onClick: () => handleToggleStock(p), className: `px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${p.availability
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-rose-500/20 text-rose-300'}`, children: [p.availability ? _jsx(CheckCircle2, { className: "w-3 h-3" }) : _jsx(XCircle, { className: "w-3 h-3" }), _jsx("span", { children: p.availability ? 'In Stock' : 'Out of Stock' })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => openEditModal(p), className: "p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-night-800", title: "Edit", children: _jsx(Edit, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => handleDeleteProduct(p), className: "p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-night-800", title: "Delete", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] })] }, p._id))) })), showModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: editingProduct ? 'Edit Product' : 'Add New Product' }), _jsxs("form", { onSubmit: handleSaveProduct, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Product Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Smoky BBQ Double Patty Burger", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Description" }), _jsx("textarea", { rows: 2, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Appetizing description...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Image URL" }), _jsx("input", { type: "url", value: imageUrl, onChange: (e) => setImageUrl(e.target.value), placeholder: "https://...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Category" }), _jsx("select", { value: categoryId, onChange: (e) => setCategoryId(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true, children: categories.map((c) => (_jsx("option", { value: c._id, children: c.name }, c._id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Product Type" }), _jsxs("select", { value: productType, onChange: (e) => setProductType(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", children: [_jsx("option", { value: "FAST_FOOD", children: "FAST_FOOD" }), _jsx("option", { value: "PACKAGED", children: "PACKAGED" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Selling Price (\u20B9)" }), _jsx("input", { type: "number", step: "1", value: sellingPriceRupees, onChange: (e) => setSellingPriceRupees(Number(e.target.value)), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Original Price (\u20B9, Opt)" }), _jsx("input", { type: "number", step: "1", value: originalPriceRupees, onChange: (e) => setOriginalPriceRupees(Number(e.target.value)), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block", children: "Payment Policy" }), _jsxs("select", { value: paymentPolicy, onChange: (e) => setPaymentPolicy(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", children: [_jsx("option", { value: "PARTIAL_PAYMENT", children: "PARTIAL_PAYMENT (40% default advance)" }), _jsx("option", { value: "FULL_PAYMENT", children: "FULL_PAYMENT (100% advance online)" }), _jsx("option", { value: "NO_ONLINE_PAYMENT", children: "NO_ONLINE_PAYMENT (0% advance, pay at delivery)" })] })] }), paymentPolicy === 'PARTIAL_PAYMENT' && (_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Advance Percentage (%)" }), _jsx("input", { type: "number", min: "1", max: "99", value: partialPercentage, onChange: (e) => setPartialPercentage(Number(e.target.value)), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] })), _jsxs("div", { className: "flex gap-4 pt-1", children: [_jsxs("label", { className: "flex items-center gap-2 text-xs text-slate-300 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: availability, onChange: (e) => setAvailability(e.target.checked), className: "rounded bg-night-950 border-night-700 text-purple-600" }), _jsx("span", { children: "Available Tonight" })] }), _jsxs("label", { className: "flex items-center gap-2 text-xs text-slate-300 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: isFeatured, onChange: (e) => setIsFeatured(e.target.checked), className: "rounded bg-night-950 border-night-700 text-purple-600" }), _jsx("span", { children: "Featured / Bestseller" })] })] }), _jsxs("div", { className: "flex gap-2 pt-3", children: [_jsx("button", { type: "button", onClick: () => setShowModal(false), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black shadow-md", children: "Save Product" })] })] })] }) }))] }));
};
