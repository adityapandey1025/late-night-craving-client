import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle2, Check, ChefHat, Bike, MapPin, ExternalLink, } from 'lucide-react';
import { apiRequest, formatCurrency } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
export const AdminOrders = () => {
    const { admin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const activeTab = searchParams.get('status') || 'ALL';
    // Modals state
    const [acceptingOrder, setAcceptingOrder] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [rejectingOrder, setRejectingOrder] = useState(null);
    const [rejectReason, setRejectReason] = useState('High kitchen rush tonight');
    const [etaOrder, setEtaOrder] = useState(null);
    const [etaMinutes, setEtaMinutes] = useState(25);
    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = '/orders';
            if (activeTab !== 'ALL') {
                url += `?status=${activeTab}`;
            }
            const data = await apiRequest(url);
            if (data.orders)
                setOrders(data.orders);
        }
        catch (err) {
            console.error('Failed to fetch admin orders:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
        const socket = getSocket();
        const handleNewOrder = () => fetchOrders();
        const handleStatusUpdate = () => fetchOrders();
        socket.on('order:new', handleNewOrder);
        socket.on('order:status_updated', handleStatusUpdate);
        return () => {
            socket.off('order:new', handleNewOrder);
            socket.off('order:status_updated', handleStatusUpdate);
        };
    }, [activeTab]);
    const handleTabChange = (status) => {
        const params = new URLSearchParams(searchParams);
        if (status === 'ALL')
            params.delete('status');
        else
            params.set('status', status);
        setSearchParams(params);
    };
    const handleConfirmAccept = async () => {
        if (!acceptingOrder)
            return;
        setIsAccepting(true);
        try {
            await apiRequest(`/orders/${acceptingOrder._id}/accept`, {
                method: 'POST',
                body: JSON.stringify({}),
            });
            setAcceptingOrder(null);
            fetchOrders();
        }
        catch (err) {
            alert(err.message || 'Failed to accept order');
        }
        finally {
            setIsAccepting(false);
        }
    };
    const handleConfirmReject = async () => {
        if (!rejectingOrder)
            return;
        try {
            await apiRequest(`/orders/${rejectingOrder._id}/reject`, {
                method: 'POST',
                body: JSON.stringify({ reason: rejectReason }),
            });
            setRejectingOrder(null);
            fetchOrders();
        }
        catch (err) {
            alert(err.message || 'Failed to reject order');
        }
    };
    const handleStatusTransition = async (orderId, nextStatus) => {
        try {
            await apiRequest(`/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ nextStatus }),
            });
            fetchOrders();
        }
        catch (err) {
            alert(err.message || 'Status transition failed');
        }
    };
    const handleSetETA = async () => {
        if (!etaOrder)
            return;
        try {
            await apiRequest(`/orders/${etaOrder._id}/eta`, {
                method: 'PATCH',
                body: JSON.stringify({ minutes: etaMinutes }),
            });
            setEtaOrder(null);
            fetchOrders();
        }
        catch (err) {
            alert(err.message || 'Failed to set ETA');
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-20", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Order Management" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Accept orders, generate UPI QR codes, set delivery timers and dispatch midnight orders." })] }) }), _jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-night-800", children: [
                    { id: 'ALL', label: 'All Orders' },
                    { id: 'PENDING_ADMIN_ACCEPTANCE', label: 'Pending Acceptance' },
                    { id: 'AWAITING_PAYMENT', label: 'Awaiting Payment' },
                    { id: 'PAYMENT_CONFIRMED', label: 'Paid / Confirmed' },
                    { id: 'PREPARING', label: 'Preparing' },
                    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                    { id: 'DELIVERED', label: 'Delivered' },
                ].map((tab) => (_jsx("button", { onClick: () => handleTabChange(tab.id), className: `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-night-900 text-slate-400 hover:text-white border border-night-750'}`, children: tab.label }, tab.id))) }), loading ? (_jsx("div", { className: "py-20 text-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" }) })) : orders.length === 0 ? (_jsxs("div", { className: "py-16 text-center rounded-3xl bg-night-900 border border-night-750 p-6 space-y-3", children: [_jsx(ShoppingBag, { className: "w-10 h-10 text-slate-400 mx-auto" }), _jsx("h3", { className: "font-bold text-white text-base", children: "No orders in this category" }), _jsx("p", { className: "text-xs text-slate-400", children: "All caught up on late-night orders." })] })) : (_jsx("div", { className: "space-y-4", children: orders.map((ord) => {
                    const isPendingAcceptance = ord.status === 'PENDING_ADMIN_ACCEPTANCE';
                    const isAwaitingPayment = ord.status === 'AWAITING_PAYMENT';
                    const isConfirmed = ord.status === 'PAYMENT_CONFIRMED';
                    const isPreparing = ord.status === 'PREPARING';
                    const isReady = ord.status === 'READY_FOR_DELIVERY';
                    const isOut = ord.status === 'OUT_FOR_DELIVERY';
                    return (_jsxs("div", { className: "p-5 sm:p-6 rounded-3xl bg-night-900 border border-night-750 shadow-lg space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-night-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "font-mono text-sm font-black text-purple-400", children: ord.orderNumber }), _jsxs("span", { className: "text-xs text-slate-400", children: ["Customer: ", _jsx("strong", { className: "text-white", children: ord.customerSnapshot.name }), " (", ord.customerSnapshot.phone, ")"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ord.status === 'DELIVERED'
                                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                    : ord.status === 'REJECTED'
                                                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                                        : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'}`, children: ord.status.replace(/_/g, ' ') }), _jsxs("span", { className: "text-[10px] text-slate-400", children: ["Assigned: ", _jsx("strong", { className: "text-slate-200", children: ord.assignedAdminSnapshot?.name || 'Unassigned' })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs", children: [_jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-slate-300 mb-1.5", children: ["Order Items (", ord.items.length, ")"] }), _jsx("div", { className: "space-y-1", children: ord.items.map((it, idx) => (_jsxs("div", { className: "flex justify-between text-slate-300", children: [_jsxs("span", { children: [it.quantity, "x ", it.name, ' ', _jsxs("span", { className: "text-[10px] text-slate-400", children: ["(", it.productType, ")"] })] }), _jsx("span", { className: "font-bold text-white", children: formatCurrency(it.itemTotal) })] }, idx))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("h4", { className: "font-bold text-slate-300 mb-1.5 flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3.5 h-3.5 text-purple-400" }), "Delivery Address"] }), _jsx("p", { className: "text-slate-200", children: ord.deliveryAddress.fullAddress }), _jsx("span", { className: "text-purple-400 font-semibold block", children: ord.deliveryAddress.locationName }), ord.deliveryInstructions && (_jsxs("p", { className: "text-[11px] text-slate-400 italic mt-1", children: ["Note: \"", ord.deliveryInstructions, "\""] }))] })] }), _jsxs("div", { className: "p-3 rounded-2xl bg-night-850 border border-night-800 flex flex-wrap items-center justify-between gap-3 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Order Total: " }), _jsx("strong", { className: "text-white text-sm", children: formatCurrency(ord.pricing.orderTotal) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Online Advance: " }), _jsx("strong", { className: "text-amber-400", children: formatCurrency(ord.pricing.onlineAdvanceRequired) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Remaining Balance: " }), _jsx("strong", { className: "text-emerald-400", children: formatCurrency(ord.pricing.remainingBalance) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Surcharge: " }), _jsx("strong", { className: "text-purple-300", children: formatCurrency(ord.pricing.fastFoodSurcharge) })] })] }), _jsxs("div", { className: "pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-night-800", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs(Link, { to: `/order/${ord._id}`, target: "_blank", className: "text-xs text-slate-400 hover:text-white flex items-center gap-1", children: [_jsx(ExternalLink, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "View Customer Tracker" })] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [isPendingAcceptance && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setRejectingOrder(ord), className: "px-3 py-1.5 rounded-xl bg-night-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-night-700 text-xs font-bold", children: "Reject" }), _jsxs("button", { onClick: () => setAcceptingOrder(ord), className: "px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-black shadow-md flex items-center gap-1", children: [_jsx(Check, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Accept & Apply Surcharge" })] })] })), isAwaitingPayment && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-amber-300 font-semibold", children: "Awaiting Customer UPI Payment" }), _jsx(Link, { to: "/admin/payments", className: "px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold", children: "Verify in Payments Tab" })] })), isConfirmed && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setEtaOrder(ord), className: "px-3 py-1.5 rounded-xl bg-night-800 hover:bg-night-750 text-slate-200 border border-night-700 text-xs font-bold flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-purple-400" }), _jsx("span", { children: "Set ETA" })] }), _jsxs("button", { onClick: () => handleStatusTransition(ord._id, 'PREPARING'), className: "px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1", children: [_jsx(ChefHat, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Start Preparing" })] })] })), isPreparing && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setEtaOrder(ord), className: "px-3 py-1.5 rounded-xl bg-night-800 text-slate-200 border border-night-700 text-xs font-bold flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-purple-400" }), _jsx("span", { children: "Update ETA" })] }), _jsx("button", { onClick: () => handleStatusTransition(ord._id, 'READY_FOR_DELIVERY'), className: "px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold", children: "Mark Ready / Packed" })] })), isReady && (_jsxs("button", { onClick: () => handleStatusTransition(ord._id, 'OUT_FOR_DELIVERY'), className: "px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-night-950 font-black text-xs flex items-center gap-1.5 shadow-sm", children: [_jsx(Bike, { className: "w-4 h-4" }), _jsx("span", { children: "Dispatch (Out for Delivery)" })] })), isOut && (_jsxs("button", { onClick: () => handleStatusTransition(ord._id, 'DELIVERED'), className: "px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-night-950 font-black text-xs flex items-center gap-1.5 shadow-sm", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), _jsx("span", { children: "Mark Delivered" })] }))] })] })] }, ord._id));
                }) })), acceptingOrder && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl", children: [_jsxs("h3", { className: "font-extrabold text-lg text-white", children: ["Accept Order #", acceptingOrder.orderNumber] }), _jsxs("div", { className: "p-4 rounded-2xl bg-night-850 border border-night-750 text-xs text-slate-300 space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { className: "text-white", children: "Administrator:" }), " ", admin?.name] }), _jsxs("p", { children: ["Your configured UPI ID (", admin?.upiId, ") will be used to generate the customer's QR."] }), _jsx("p", { children: "Automatic quantity pricing: first unit at 1x, each additional unit at 1.5x." })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setAcceptingOrder(null), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { type: "button", disabled: isAccepting, onClick: handleConfirmAccept, className: "flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black shadow-md", children: isAccepting ? 'Accepting...' : 'Accept Order' })] })] }) })), rejectingOrder && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: "Reject Order" }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Reason for Rejection" }), _jsx("textarea", { rows: 2, value: rejectReason, onChange: (e) => setRejectReason(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setRejectingOrder(null), className: "flex-1 py-2 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Back" }), _jsx("button", { onClick: handleConfirmReject, className: "flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md", children: "Confirm Reject" })] })] }) })), etaOrder && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: "Set Estimated Delivery Time" }), _jsx("p", { className: "text-xs text-slate-400", children: "Customer tracker will display a live synchronized countdown." }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-bold text-slate-200 block", children: "Minutes from now:" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: [15, 20, 25, 35].map((m) => (_jsxs("button", { type: "button", onClick: () => setEtaMinutes(m), className: `py-2 rounded-xl text-xs font-bold ${etaMinutes === m ? 'bg-purple-600 text-white' : 'bg-night-800 text-slate-300'}`, children: [m, " mins"] }, m))) })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { onClick: () => setEtaOrder(null), className: "flex-1 py-2 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsxs("button", { onClick: handleSetETA, className: "flex-1 py-2 rounded-xl bg-purple-600 text-white text-xs font-black shadow-md", children: ["Set ", etaMinutes, " Mins ETA"] })] })] }) }))] }));
};
