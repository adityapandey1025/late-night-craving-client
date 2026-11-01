import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
export const ETACounter = ({ estimatedDeliveryTime, status }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    useEffect(() => {
        if (!estimatedDeliveryTime || status === 'DELIVERED') {
            setTimeLeft(null);
            return;
        }
        const calculateTime = () => {
            const target = new Date(estimatedDeliveryTime).getTime();
            const now = new Date().getTime();
            const difference = target - now;
            if (difference <= 0) {
                setTimeLeft({ minutes: 0, seconds: 0, isPast: true });
            }
            else {
                const minutes = Math.floor(difference / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ minutes, seconds, isPast: false });
            }
        };
        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [estimatedDeliveryTime, status]);
    if (status === 'DELIVERED') {
        return (_jsxs("div", { className: "p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 text-emerald-400" }), _jsxs("div", { children: [_jsx("span", { className: "font-extrabold text-sm text-emerald-200", children: "Order Delivered" }), _jsx("p", { className: "text-xs text-emerald-300/80 mt-0.5", children: "Hope you loved your late-night meal!" })] })] }));
    }
    if (!estimatedDeliveryTime) {
        return (_jsxs("div", { className: "p-4 rounded-2xl bg-night-900 border border-night-750 flex items-center gap-3 text-slate-300", children: [_jsx(Clock, { className: "w-5 h-5 text-craving-500 animate-pulse" }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-white", children: "ETA Calculation in Progress" }), _jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: "Admin will assign your delivery timer once payment is confirmed." })] })] }));
    }
    return (_jsxs("div", { className: "p-4 rounded-2xl bg-gradient-to-r from-night-900 to-night-850 border border-night-700 shadow-xl flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-craving-500/10 border border-craving-500/20 flex items-center justify-center text-craving-500", children: _jsx(Clock, { className: "w-5 h-5 animate-spin-slow" }) }), _jsxs("div", { children: [_jsx("span", { className: "text-[11px] font-extrabold tracking-wider uppercase text-slate-400", children: "Estimated Delivery" }), _jsxs("div", { className: "text-xs text-slate-300", children: ["Expected by ", new Date(estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] })] }), timeLeft && (_jsx("div", { className: "text-right", children: timeLeft.isPast ? (_jsx("span", { className: "px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase", children: "Arriving Any Moment" })) : (_jsxs("div", { className: "flex items-baseline gap-1 text-craving-400 font-black", children: [_jsx("span", { className: "text-2xl font-mono", children: String(timeLeft.minutes).padStart(2, '0') }), _jsx("span", { className: "text-xs text-slate-400", children: "m" }), _jsx("span", { className: "text-2xl font-mono", children: String(timeLeft.seconds).padStart(2, '0') }), _jsx("span", { className: "text-xs text-slate-400", children: "s" })] })) }))] }));
};
