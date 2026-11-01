import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Plus, Minus, Flame, Package, Sparkles } from 'lucide-react';
import { formatCurrency } from '../services/api';
import { useCart } from '../context/CartContext';
export const ProductCard = ({ product }) => {
    const { cart, addToCart, updateQuantity } = useCart();
    const cartItem = cart.find((item) => item.product._id === product._id);
    const currentQuantity = cartItem?.quantity || 0;
    const isFastFood = product.productType === 'FAST_FOOD';
    const hasDiscount = product.originalPrice && product.originalPrice > product.sellingPrice;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
        : 0;
    // Policy text helper
    const getPolicyBadge = () => {
        switch (product.paymentPolicy) {
            case 'FULL_PAYMENT':
                return { label: '100% Online', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
            case 'PARTIAL_PAYMENT':
                return {
                    label: `${product.partialPaymentPercentage}% Advance`,
                    color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                };
            case 'NO_ONLINE_PAYMENT':
                return { label: 'Pay on Delivery', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
        }
    };
    const policy = getPolicyBadge();
    return (_jsxs("div", { className: "group relative flex flex-col bg-night-900 rounded-2xl border border-night-750 hover:border-night-600 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl", children: [_jsxs("div", { className: "relative aspect-[4/3] w-full overflow-hidden bg-night-950", children: [_jsx("img", { src: product.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', alt: product.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", loading: "lazy" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent opacity-80" }), _jsxs("div", { className: "absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10", children: [_jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${isFastFood
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                    : 'bg-sky-500/20 text-sky-300 border-sky-500/30'}`, children: [isFastFood ? _jsx(Flame, { className: "w-3 h-3 text-rose-400" }) : _jsx(Package, { className: "w-3 h-3 text-sky-400" }), isFastFood ? 'Fast Food' : 'Packaged'] }), product.isFeatured && (_jsxs("span", { className: "inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md", children: [_jsx(Sparkles, { className: "w-3 h-3" }), "Bestseller"] }))] }), _jsx("div", { className: "absolute bottom-2.5 left-2.5 z-10", children: _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${policy.color}`, children: policy.label }) }), hasDiscount && (_jsx("div", { className: "absolute top-2.5 right-2.5 z-10", children: _jsxs("span", { className: "bg-craving-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg shadow", children: [discountPercent, "% OFF"] }) })), !product.availability && (_jsx("div", { className: "absolute inset-0 bg-night-950/85 backdrop-blur-[2px] flex items-center justify-center z-20", children: _jsx("span", { className: "px-3 py-1.5 rounded-xl bg-night-900/90 text-rose-400 border border-rose-500/40 text-xs font-black uppercase tracking-wider", children: "Sold Out Tonight" }) }))] }), _jsxs("div", { className: "p-4 flex flex-col flex-1 justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-base text-slate-100 group-hover:text-craving-400 transition-colors line-clamp-1", children: product.name }), _jsx("p", { className: "mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed", children: product.description || 'Prepared fresh for your midnight craving.' })] }), _jsxs("div", { className: "mt-4 pt-3 border-t border-night-800/80 flex items-center justify-between", children: [_jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-baseline gap-1.5", children: [_jsx("span", { className: "text-lg font-black text-white", children: formatCurrency(product.sellingPrice) }), hasDiscount && (_jsx("span", { className: "text-xs text-slate-400 line-through", children: formatCurrency(product.originalPrice) }))] }), _jsx("span", { className: "text-[10px] text-slate-400", children: product.paymentPolicy === 'PARTIAL_PAYMENT'
                                            ? `Pay ${formatCurrency(Math.round((product.sellingPrice * product.partialPaymentPercentage) / 100))} now`
                                            : product.paymentPolicy === 'FULL_PAYMENT'
                                                ? 'Pay online in full'
                                                : 'Pay on delivery' })] }), product.availability ? (currentQuantity > 0 ? (_jsxs("div", { className: "flex items-center bg-night-800 border border-craving-500/50 rounded-xl overflow-hidden shadow-sm", children: [_jsx("button", { onClick: () => updateQuantity(product._id, currentQuantity - 1), className: "p-1.5 text-slate-300 hover:text-white hover:bg-night-700 transition-colors", "aria-label": "Decrease quantity", children: _jsx(Minus, { className: "w-3.5 h-3.5" }) }), _jsx("span", { className: "px-2.5 text-xs font-black text-craving-400", children: currentQuantity }), _jsx("button", { onClick: () => updateQuantity(product._id, currentQuantity + 1), className: "p-1.5 text-slate-300 hover:text-white hover:bg-night-700 transition-colors", "aria-label": "Increase quantity", children: _jsx(Plus, { className: "w-3.5 h-3.5" }) })] })) : (_jsxs("button", { onClick: () => addToCart(product, 1), className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white font-extrabold text-xs shadow-glow-orange hover:scale-105 active:scale-95 transition-all", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add" })] }))) : (_jsx("button", { disabled: true, className: "px-3 py-1.5 rounded-xl bg-night-800 text-slate-400 font-bold text-xs cursor-not-allowed", children: "Unavailable" }))] })] })] }));
};
