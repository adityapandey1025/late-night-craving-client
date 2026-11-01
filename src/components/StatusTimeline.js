import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Check, Clock, AlertCircle, ChefHat, Bike, CheckCircle2, ShieldAlert } from 'lucide-react';
const standardSteps = [
    {
        id: 'PENDING_ADMIN_ACCEPTANCE',
        label: 'Order Placed',
        description: 'Awaiting administrator acceptance',
        icon: Clock,
    },
    {
        id: 'AWAITING_PAYMENT',
        label: 'Accepted & Assigned',
        description: 'UPI QR ready for advance payment',
        icon: Clock,
    },
    {
        id: 'PAYMENT_CONFIRMED',
        label: 'Payment Verified',
        description: 'Advance verified by administrator',
        icon: CheckCircle2,
    },
    {
        id: 'PREPARING',
        label: 'Preparing Cravings',
        description: 'Hot food being prepared fresh',
        icon: ChefHat,
    },
    {
        id: 'READY_FOR_DELIVERY',
        label: 'Packed & Ready',
        description: 'Inspected and handed to courier',
        icon: Check,
    },
    {
        id: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        description: 'On the way to your location',
        icon: Bike,
    },
    {
        id: 'DELIVERED',
        label: 'Delivered & Settled',
        description: 'Enjoy your midnight meal!',
        icon: CheckCircle2,
    },
];
const statusOrderIndex = {
    PENDING_ADMIN_ACCEPTANCE: 0,
    REJECTED: -1,
    AWAITING_PAYMENT: 1,
    PAYMENT_CONFIRMED: 2,
    PREPARING: 3,
    READY_FOR_DELIVERY: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
    CANCELLED: -2,
};
export const StatusTimeline = ({ status, statusHistory }) => {
    const currentIndex = statusOrderIndex[status];
    if (status === 'REJECTED') {
        return (_jsxs("div", { className: "p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300", children: [_jsx(ShieldAlert, { className: "w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm text-rose-200", children: "Order Rejected by Administrator" }), _jsx("p", { className: "text-xs text-rose-300/90 mt-1", children: "Our midnight delivery team was unable to fulfill this order at this time." })] })] }));
    }
    if (status === 'CANCELLED') {
        return (_jsxs("div", { className: "p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start gap-3 text-slate-300", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 text-slate-400 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm text-slate-200", children: "Order Cancelled" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "This order was cancelled." })] })] }));
    }
    return (_jsx("div", { className: "py-2", children: _jsx("div", { className: "relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-night-700", children: standardSteps.map((step, idx) => {
                const isCompleted = currentIndex > idx;
                const isCurrent = currentIndex === idx;
                const isUpcoming = currentIndex < idx;
                const StepIcon = step.icon;
                return (_jsxs("div", { className: "relative flex items-start gap-3", children: [_jsx("div", { className: `absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-night-950 transition-all ${isCompleted
                                ? 'bg-emerald-500 text-night-950'
                                : isCurrent
                                    ? 'bg-craving-500 text-white animate-pulse shadow-glow-orange'
                                    : 'bg-night-800 text-slate-500 border border-night-700'}`, children: isCompleted ? (_jsx(Check, { className: "w-3 h-3 stroke-[3]" })) : (_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white' : 'bg-slate-500'}` })) }), _jsxs("div", { className: "flex-1 min-w-0 -mt-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: `text-xs font-bold ${isCurrent
                                                ? 'text-craving-400 text-sm'
                                                : isCompleted
                                                    ? 'text-white'
                                                    : 'text-slate-500'}`, children: step.label }), isCurrent && (_jsx("span", { className: "px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-craving-500/20 text-craving-400 border border-craving-500/30", children: "In Progress" }))] }), _jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: step.description })] })] }, step.id));
            }) }) }));
};
