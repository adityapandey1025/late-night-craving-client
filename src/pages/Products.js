import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Flame, Package, Sparkles } from 'lucide-react';
import { apiRequest } from '../services/api';
import { ProductCard } from '../components/ProductCard';
export const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    // Filters
    const activeCategory = searchParams.get('category') || 'all';
    const activeType = searchParams.get('type') || 'all';
    const searchQuery = searchParams.get('search') || '';
    useEffect(() => {
        const fetchCatalog = async () => {
            setLoading(true);
            try {
                let endpoint = '/products?';
                const params = [];
                if (activeCategory !== 'all')
                    params.push(`category=${activeCategory}`);
                if (activeType !== 'all')
                    params.push(`type=${activeType}`);
                if (searchQuery)
                    params.push(`search=${encodeURIComponent(searchQuery)}`);
                const [prodData, catData] = await Promise.all([
                    apiRequest(`${endpoint}${params.join('&')}`),
                    apiRequest('/products/categories'),
                ]);
                if (prodData.products)
                    setProducts(prodData.products);
                if (catData.categories)
                    setCategories(catData.categories);
            }
            catch (err) {
                console.error('Failed to fetch products:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCatalog();
    }, [activeCategory, activeType, searchQuery]);
    const handleCategorySelect = (slug) => {
        const params = new URLSearchParams(searchParams);
        if (slug === 'all')
            params.delete('category');
        else
            params.set('category', slug);
        setSearchParams(params);
    };
    const handleTypeSelect = (type) => {
        const params = new URLSearchParams(searchParams);
        if (type === 'all')
            params.delete('type');
        else
            params.set('type', type);
        setSearchParams(params);
    };
    const handleSearchChange = (val) => {
        const params = new URLSearchParams(searchParams);
        if (!val.trim())
            params.delete('search');
        else
            params.set('search', val);
        setSearchParams(params);
    };
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Midnight Craving Menu" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-1", children: "Browse packaged essentials and fresh hot fast-food. No minimum order." })] }), _jsxs("div", { className: "relative w-full md:w-72", children: [_jsx("input", { type: "text", value: searchQuery, onChange: (e) => handleSearchChange(e.target.value), placeholder: "Search cravings...", className: "w-full bg-night-900 border border-night-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500" }), _jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none", children: [_jsx("button", { onClick: () => handleTypeSelect('all'), className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${activeType === 'all'
                                    ? 'bg-craving-500 text-white shadow-glow-orange'
                                    : 'bg-night-900 text-slate-300 hover:text-white border border-night-750'}`, children: _jsx("span", { children: "All Items" }) }), _jsxs("button", { onClick: () => handleTypeSelect('FAST_FOOD'), className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${activeType === 'FAST_FOOD'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-night-900 text-slate-300 hover:text-white border border-night-750'}`, children: [_jsx(Flame, { className: "w-3.5 h-3.5 text-rose-400" }), _jsx("span", { children: "Fast Food" })] }), _jsxs("button", { onClick: () => handleTypeSelect('PACKAGED'), className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${activeType === 'PACKAGED'
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-night-900 text-slate-300 hover:text-white border border-night-750'}`, children: [_jsx(Package, { className: "w-3.5 h-3.5 text-sky-400" }), _jsx("span", { children: "Packaged & Drinks" })] })] }), _jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-night-800", children: [_jsx("button", { onClick: () => handleCategorySelect('all'), className: `text-xs font-semibold px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${activeCategory === 'all'
                                    ? 'text-craving-400 bg-night-800 border border-craving-500/30'
                                    : 'text-slate-400 hover:text-slate-200'}`, children: "All Categories" }), categories.map((cat) => (_jsx("button", { onClick: () => handleCategorySelect(cat.slug), className: `text-xs font-semibold px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${activeCategory === cat.slug
                                    ? 'text-craving-400 bg-night-800 border border-craving-500/30'
                                    : 'text-slate-400 hover:text-slate-200'}`, children: cat.name }, cat._id)))] })] }), loading ? (_jsxs("div", { className: "py-20 flex flex-col items-center justify-center text-center", children: [_jsx("div", { className: "w-10 h-10 border-4 border-craving-500 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-xs text-slate-400 mt-3", children: "Loading fresh cravings..." })] })) : products.length === 0 ? (_jsxs("div", { className: "py-16 text-center rounded-2xl bg-night-900 border border-night-750 p-6 space-y-3", children: [_jsx(Sparkles, { className: "w-8 h-8 text-slate-400 mx-auto" }), _jsx("h3", { className: "font-bold text-white text-base", children: "No items found" }), _jsx("p", { className: "text-xs text-slate-400 max-w-sm mx-auto", children: "Try adjusting your search query or switching categories." }), _jsx("button", { onClick: () => setSearchParams(new URLSearchParams()), className: "px-4 py-2 rounded-xl bg-night-800 hover:bg-night-750 text-xs font-bold text-craving-400 border border-night-700", children: "Clear All Filters" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: products.map((product) => (_jsx(ProductCard, { product: product }, product._id))) }))] }));
};
