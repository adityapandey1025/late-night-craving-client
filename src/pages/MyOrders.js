import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, MapPin } from 'lucide-react';
import { apiRequest, formatCurrency } from '../services/api';
import { useAuth } from '../context/AuthContext';
export const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await apiRequest('/orders/my');
                if (data.orders)
                    setOrders(data.orders);
            }
            catch (err) {
                console.error('Failed to fetch my orders:', err);
            }
            finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchOrders();
        }
    }, [user]);
    if (!user) {
        return (_jsxs("div", { className: "py-20 text-center space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Please log in to see your orders" }), _jsx(Link, { to: "/login", className: "px-5 py-2.5 rounded-xl bg-craving-500 text-white font-bold text-xs inline-block", children: "Go to Login" })] }));
    }
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-6 pb-20", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "My Orders" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Track active cravings or review previous midnight meals." })] }), loading ? (_jsx("div", { className: "py-20 text-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-craving-500 border-t-transparent rounded-full animate-spin mx-auto" }) })) : orders.length === 0 ? (_jsxs("div", { className: "py-16 text-center rounded-3xl bg-night-900 border border-night-750 p-6 space-y-3", children: [_jsx(ShoppingBag, { className: "w-10 h-10 text-slate-400 mx-auto" }), _jsx("h3", { className: "font-bold text-white text-base", children: "No orders placed yet" }), _jsx("p", { className: "text-xs text-slate-400 max-w-sm mx-auto", children: "Ready for your first midnight craving? Check out our burgers, pizzas, and snacks." }), _jsx(Link, { to: "/products", className: "inline-flex px-5 py-2.5 rounded-xl bg-craving-500 text-white font-bold text-xs shadow-glow-orange", children: "Explore Menu" })] })) : (_jsx("div", { className: "space-y-3", children: orders.map((ord) => (_jsxs(Link, { to: `/order/${ord._id}`, className: "block p-4 sm:p-5 rounded-2xl bg-night-900 border border-night-750 hover:border-night-600 transition-all hover:bg-night-850 shadow-md group", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-mono text-xs font-bold text-craving-400", children: ord.orderNumber }), _jsxs("span", { className: "text-[10px] text-slate-400", children: ["\u2022 ", new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }), " at", ' ', new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${ord.status === 'DELIVERED'
                                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                : ord.status === 'REJECTED' || ord.status === 'CANCELLED'
                                                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                                    : 'bg-craving-500/15 text-craving-300 border border-craving-500/30 animate-pulse'}`, children: ord.status.replace(/_/g, ' ') }), _jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" })] })] }), _jsx("div", { className: "mt-2.5 text-xs text-slate-300 line-clamp-1", children: ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ') }), _jsxs("div", { className: "mt-3 pt-2.5 border-t border-night-800/80 flex items-center justify-between text-xs", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-slate-400 text-[11px]", children: [_jsx(MapPin, { className: "w-3.5 h-3.5 text-craving-500" }), _jsx("span", { children: ord.deliveryAddress.locationName })] }), _jsxs("div", { className: "font-black text-white", children: ["Total: ", formatCurrency(ord.pricing.orderTotal)] })] })] }, ord._id))) }))] }));
};
