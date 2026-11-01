import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
export const BottomNav = () => {
    const { totalItemCount, setIsCartOpen } = useCart();
    const { role, user } = useAuth();
    // Hide bottom nav on admin routes
    if (role === 'admin')
        return null;
    return (_jsxs("nav", { className: "sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-night-950/95 backdrop-blur-lg border-t border-night-750 px-2 py-1.5 flex items-center justify-around", children: [_jsxs(NavLink, { to: "/", className: ({ isActive }) => `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${isActive ? 'text-craving-500' : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(Home, { className: "w-5 h-5" }), _jsx("span", { className: "text-[10px] font-bold", children: "Home" })] }), _jsxs(NavLink, { to: "/products", className: ({ isActive }) => `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${isActive ? 'text-craving-500' : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(UtensilsCrossed, { className: "w-5 h-5" }), _jsx("span", { className: "text-[10px] font-bold", children: "Menu" })] }), _jsxs("button", { onClick: () => setIsCartOpen(true), className: "flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 relative", children: [_jsxs("div", { className: "relative", children: [_jsx(ShoppingBag, { className: "w-5 h-5 text-craving-500" }), totalItemCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-2 bg-craving-500 text-night-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center", children: totalItemCount }))] }), _jsx("span", { className: "text-[10px] font-bold text-slate-300", children: "Cart" })] }), _jsxs(NavLink, { to: user ? '/my-orders' : '/login', className: ({ isActive }) => `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${isActive ? 'text-craving-500' : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(Clock, { className: "w-5 h-5" }), _jsx("span", { className: "text-[10px] font-bold", children: "Orders" })] }), _jsxs(NavLink, { to: user ? '/profile' : '/login', className: ({ isActive }) => `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${isActive ? 'text-craving-500' : 'text-slate-400 hover:text-slate-200'}`, children: [_jsx(User, { className: "w-5 h-5" }), _jsx("span", { className: "text-[10px] font-bold", children: user ? 'Account' : 'Login' })] })] }));
};
