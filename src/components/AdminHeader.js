import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ShoppingBag, CreditCard, UtensilsCrossed, MapPin, QrCode, Power, LogOut, Moon, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { apiRequest } from '../services/api';
export const AdminHeader = () => {
    const { admin, logout } = useAuth();
    const { storeStatus, refreshStatus } = useStore();
    const [toggling, setToggling] = useState(false);
    const navigate = useNavigate();
    const handleToggleMyAvailability = async () => {
        if (!admin)
            return;
        setToggling(true);
        try {
            const newStatus = admin.availabilityStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
            await apiRequest('/admin/availability/toggle', {
                method: 'POST',
                body: JSON.stringify({ status: newStatus }),
            });
            await refreshStatus();
            window.location.reload(); // update state immediately
        }
        catch (err) {
            alert(err.message || 'Failed to toggle availability');
        }
        finally {
            setToggling(false);
        }
    };
    const navLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { to: '/admin/payments', label: 'Payments', icon: CreditCard },
        { to: '/admin/products', label: 'Menu & Products', icon: UtensilsCrossed },
        { to: '/admin/locations', label: 'Locations', icon: MapPin },
        { to: '/admin/profile', label: 'My UPI & QR', icon: QrCode },
    ];
    return (_jsx("div", { className: "bg-night-900 border-b border-night-700/80 mb-6", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between py-3 border-b border-night-800", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/admin/dashboard", className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center", children: _jsx(Shield, { className: "w-4 h-4 text-white" }) }), _jsxs("span", { className: "font-extrabold text-white text-sm", children: ["Admin Console ", _jsxs("span", { className: "text-slate-400 font-normal", children: ["| ", admin?.name] })] })] }), _jsxs("button", { onClick: handleToggleMyAvailability, disabled: toggling, className: `ml-3 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${admin?.availabilityStatus === 'OPEN'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'}`, title: "Click to switch your independent availability status", children: [_jsx(Power, { className: "w-3.5 h-3.5" }), _jsxs("span", { children: [admin?.name, ": ", admin?.availabilityStatus] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/", className: "text-xs text-slate-400 hover:text-white flex items-center gap-1", children: [_jsx(Moon, { className: "w-3.5 h-3.5 text-craving-500" }), _jsx("span", { children: "View Customer Store" })] }), _jsxs("button", { onClick: logout, className: "text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 pl-2 border-l border-night-750", children: [_jsx(LogOut, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Logout" })] })] })] }), _jsx("nav", { className: "flex items-center gap-1 overflow-x-auto py-2 scrollbar-none", children: navLinks.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${isActive
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-night-800'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: label })] }, to))) })] }) }));
};
