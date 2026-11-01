import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Power, ArrowRight, } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { apiRequest, formatCurrency } from '../../services/api';
export const AdminDashboard = () => {
    const { admin } = useAuth();
    const { storeStatus, refreshStatus } = useStore();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchAnalytics = async () => {
        try {
            const data = await apiRequest('/admin/analytics');
            if (data.analytics)
                setAnalytics(data.analytics);
        }
        catch (err) {
            console.error('Failed to load analytics:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAnalytics();
    }, []);
    const handleAdminToggle = async (targetStatus) => {
        try {
            await apiRequest('/admin/availability/toggle', {
                method: 'POST',
                body: JSON.stringify({ status: targetStatus }),
            });
            await refreshStatus();
            await fetchAnalytics();
            window.location.reload();
        }
        catch (err) {
            alert(err.message || 'Failed to toggle availability');
        }
    };
    const isStoreGloballyOpen = storeStatus?.orderingEnabled ?? true;
    return (_jsxs("div", { className: "space-y-6 pb-20", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Operations Command Center" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Real-time order workflow, dual-admin availability switch, and fulfillment metrics." })] }), _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-700 shadow-xl space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-base font-extrabold text-white flex items-center gap-2", children: [_jsx(Power, { className: "w-5 h-5 text-purple-400" }), "Two-Administrator Availability Network"] }), _jsx("p", { className: "text-xs text-slate-400", children: "Ordering is enabled if either Aditya or Amlesh is OPEN. Disabled only when both are CLOSED." })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isStoreGloballyOpen
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`, children: isStoreGloballyOpen ? 'Ordering LIVE' : 'Ordering CLOSED' }) })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2", children: storeStatus?.admins?.map((adm) => {
                            const isMe = adm.id === admin?.id;
                            const isOpen = adm.availabilityStatus === 'OPEN';
                            return (_jsx("div", { className: `p-4 rounded-2xl border transition-all ${isMe ? 'bg-night-850 border-purple-500/50' : 'bg-night-950 border-night-800'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-night-800 flex items-center justify-center font-bold text-sm text-purple-400", children: adm.name.charAt(0) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "font-extrabold text-sm text-white", children: adm.name }), isMe && (_jsx("span", { className: "text-[10px] font-bold text-purple-400 bg-purple-500/20 px-1.5 py-0.2 rounded", children: "You" }))] }), _jsxs("span", { className: "text-[10px] text-slate-400", children: ["Status: ", _jsx("strong", { className: isOpen ? 'text-emerald-400' : 'text-rose-400', children: adm.availabilityStatus })] })] })] }), isMe ? (_jsx("button", { onClick: () => handleAdminToggle(isOpen ? 'CLOSED' : 'OPEN'), className: `px-3 py-1.5 rounded-xl font-black text-xs transition-all ${isOpen
                                                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                                                : 'bg-emerald-500 hover:bg-emerald-600 text-night-950 shadow-sm'}`, children: isOpen ? 'Go Offline' : 'Go Online' })) : (_jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Independent" }))] }) }, adm.id));
                        }) })] }), analytics && (_jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-1", children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Total Revenue" }), _jsx("div", { className: "text-2xl font-black text-emerald-400", children: formatCurrency(analytics.totalRevenuePaise) }), _jsx("span", { className: "text-[10px] text-slate-500", children: "Delivered & settled" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-1", children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Pending Acceptance" }), _jsx("div", { className: "text-2xl font-black text-amber-400", children: analytics.pendingAcceptance }), _jsx("span", { className: "text-[10px] text-slate-500", children: "Needs admin assignment" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-1", children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "Awaiting Payment" }), _jsx("div", { className: "text-2xl font-black text-purple-400", children: analytics.awaitingPayment }), _jsx("span", { className: "text-[10px] text-slate-500", children: "Pending customer UPI / UTR" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-1", children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400", children: "In Delivery Flow" }), _jsx("div", { className: "text-2xl font-black text-sky-400", children: analytics.inProgress }), _jsx("span", { className: "text-[10px] text-slate-500", children: "Preparing or en route" })] })] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs(Link, { to: "/admin/orders?status=PENDING_ADMIN_ACCEPTANCE", className: "p-5 rounded-2xl bg-gradient-to-r from-night-900 to-night-850 border border-night-750 hover:border-purple-500/50 transition-all flex items-center justify-between group", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors", children: "Review New Orders" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Accept order & generate UPI QR" })] }), _jsx(ArrowRight, { className: "w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" })] }), _jsxs(Link, { to: "/admin/payments", className: "p-5 rounded-2xl bg-gradient-to-r from-night-900 to-night-850 border border-night-750 hover:border-purple-500/50 transition-all flex items-center justify-between group", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors", children: "Verify Payments" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Manual check & settlement" })] }), _jsx(ArrowRight, { className: "w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" })] }), _jsxs(Link, { to: "/admin/products", className: "p-5 rounded-2xl bg-gradient-to-r from-night-900 to-night-850 border border-night-750 hover:border-purple-500/50 transition-all flex items-center justify-between group", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors", children: "Manage Products" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Add items & toggle stock" })] }), _jsx(ArrowRight, { className: "w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" })] })] })] }));
};
