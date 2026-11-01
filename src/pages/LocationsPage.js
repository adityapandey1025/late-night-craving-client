import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../services/api';
export const LocationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchLocs = async () => {
            try {
                const data = await apiRequest('/locations');
                if (data.locations)
                    setLocations(data.locations);
            }
            catch (err) {
                console.error('Failed to load locations:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchLocs();
    }, []);
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6 pb-20", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5", children: [_jsx(MapPin, { className: "w-7 h-7 text-craving-500" }), "Active Delivery Locations"] }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-1", children: "Hyperlocal delivery coverage across college campuses, hostels, and residential tech zones." })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-night-900 border border-night-750 flex items-center gap-3 text-xs text-slate-300", children: [_jsx(ShieldCheck, { className: "w-5 h-5 text-craving-500 flex-shrink-0" }), _jsx("span", { children: "Deliveries are carried out directly by our dedicated courier riders between 11:00 PM and 4:00 AM." })] }), loading ? (_jsx("div", { className: "py-20 text-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-craving-500 border-t-transparent rounded-full animate-spin mx-auto" }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: locations.map((loc) => (_jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 hover:border-craving-500/50 transition-all flex flex-col justify-between space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-base text-white", children: loc.name }), _jsxs("span", { className: "px-2 py-0.5 rounded-lg bg-craving-500/10 text-craving-400 border border-craving-500/20 text-[10px] font-black uppercase flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), "~", loc.estimatedDeliveryMinutes, " mins"] })] }), _jsx("p", { className: "text-xs text-slate-400 mt-2 leading-relaxed", children: loc.description || 'Full coverage within this perimeter.' })] }), _jsxs("div", { className: "pt-3 border-t border-night-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Currently Active & Serviced" })] })] }, loc._id))) }))] }));
};
