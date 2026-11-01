import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { DollarSign, Check, } from 'lucide-react';
import { apiRequest, formatCurrency } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
export const AdminPayments = () => {
    const { admin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // Manual Advance Verification Modal
    const [verifyingOrder, setVerifyingOrder] = useState(null);
    const [verifiedAmountRupees, setVerifiedAmountRupees] = useState(0);
    const [verificationNote, setVerificationNote] = useState('');
    const [customRef, setCustomRef] = useState('');
    // Delivery Collection Modal
    const [collectingOrder, setCollectingOrder] = useState(null);
    const [collectAmountRupees, setCollectAmountRupees] = useState(0);
    const [collectMethod, setCollectMethod] = useState('CASH');
    const [collectNotes, setCollectNotes] = useState('');
    const fetchPaymentOrders = async () => {
        setLoading(true);
        try {
            const data = await apiRequest('/orders');
            if (data.orders)
                setOrders(data.orders);
        }
        catch (err) {
            console.error('Failed to load orders for payments:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPaymentOrders();
    }, []);
    const openVerifyModal = (ord) => {
        setVerifyingOrder(ord);
        setVerifiedAmountRupees(ord.pricing.onlineAdvanceRequired / 100);
        setVerificationNote(`Verified in bank by ${admin?.name}`);
        setCustomRef('');
    };
    const openCollectModal = (ord) => {
        setCollectingOrder(ord);
        setCollectAmountRupees(ord.pricing.remainingBalance / 100);
        setCollectMethod('CASH');
        setCollectNotes(`Remaining balance collected at delivery by ${admin?.name}`);
    };
    const handleConfirmVerify = async () => {
        if (!verifyingOrder)
            return;
        try {
            await apiRequest(`/payments/order/${verifyingOrder._id}/verify-advance`, {
                method: 'POST',
                body: JSON.stringify({
                    verifiedAmountPaise: Math.round(verifiedAmountRupees * 100),
                    paymentMethod: 'UPI',
                    note: verificationNote,
                    reference: customRef,
                }),
            });
            setVerifyingOrder(null);
            fetchPaymentOrders();
        }
        catch (err) {
            alert(err.message || 'Payment verification failed');
        }
    };
    const handleConfirmCollection = async () => {
        if (!collectingOrder)
            return;
        try {
            await apiRequest(`/payments/order/${collectingOrder._id}/record-collection`, {
                method: 'POST',
                body: JSON.stringify({
                    amountPaise: Math.round(collectAmountRupees * 100),
                    paymentMethod: collectMethod,
                    notes: collectNotes,
                }),
            });
            setCollectingOrder(null);
            fetchPaymentOrders();
        }
        catch (err) {
            alert(err.message || 'Collection recording failed');
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-20", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Payment & Settlement Ledger" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Manual advance payment verification and remaining delivery collection tracking." })] }), loading ? (_jsx("div", { className: "py-20 text-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" }) })) : (_jsx("div", { className: "space-y-4", children: orders.map((ord) => {
                    const isAwaitingPayment = ord.status === 'AWAITING_PAYMENT';
                    const isDeliveredOrOut = ord.status === 'OUT_FOR_DELIVERY' || ord.status === 'DELIVERED';
                    return (_jsxs("div", { className: "p-5 rounded-3xl bg-night-900 border border-night-750 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-mono text-xs font-bold text-purple-400", children: ord.orderNumber }), _jsxs("span", { className: "text-[10px] text-slate-400", children: ["\u2022 ", ord.customerSnapshot.name] }), _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-night-800 text-slate-300", children: ord.status.replace(/_/g, ' ') })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs pt-1", children: [_jsxs("span", { className: "text-slate-300", children: ["Total: ", _jsx("strong", { className: "text-white", children: formatCurrency(ord.pricing.orderTotal) })] }), _jsx("span", { className: "text-slate-400", children: "|" }), _jsxs("span", { className: "text-amber-300", children: ["Advance: ", _jsx("strong", { children: formatCurrency(ord.pricing.onlineAdvanceRequired) })] }), _jsx("span", { className: "text-slate-400", children: "|" }), _jsxs("span", { className: "text-emerald-300", children: ["Remaining on Delivery: ", _jsx("strong", { children: formatCurrency(ord.pricing.remainingBalance) })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [isAwaitingPayment && (_jsxs("button", { onClick: () => openVerifyModal(ord), className: "px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5", children: [_jsx(Check, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Manually Verify Advance" })] })), isDeliveredOrOut && ord.pricing.remainingBalance > 0 && (_jsxs("button", { onClick: () => openCollectModal(ord), className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5", children: [_jsx(DollarSign, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Record Delivery Collection" })] }))] })] }, ord._id));
                }) })), verifyingOrder && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsxs("h3", { className: "font-extrabold text-lg text-white", children: ["Verify UPI Advance for #", verifyingOrder.orderNumber] }), _jsxs("div", { className: "p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1", children: [_jsx("span", { className: "font-bold", children: "Required Advance:" }), " ", formatCurrency(verifyingOrder.pricing.onlineAdvanceRequired), _jsx("br", {}), _jsxs("span", { className: "text-[11px] text-amber-300/80", children: ["Check your UPI bank app (", admin?.upiId, ") to ensure funds arrived before confirming."] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Verified Amount (\u20B9)" }), _jsx("input", { type: "number", step: "0.01", value: verifiedAmountRupees, onChange: (e) => setVerifiedAmountRupees(Number(e.target.value)), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Customer Payment Reference / UTR" }), _jsx("input", { type: "text", value: customRef, onChange: (e) => setCustomRef(e.target.value), placeholder: "e.g. Bank UTR / UPI Ref", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Verification Note" }), _jsx("input", { type: "text", value: verificationNote, onChange: (e) => setVerificationNote(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { onClick: () => setVerifyingOrder(null), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { onClick: handleConfirmVerify, className: "flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md", children: "Confirm Verified & Unlock WhatsApp" })] })] }) })), collectingOrder && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: "Record Remaining Balance on Delivery" }), _jsxs("div", { className: "p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300", children: ["Expected Remaining Balance: ", formatCurrency(collectingOrder.pricing.remainingBalance)] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Amount Collected (\u20B9)" }), _jsx("input", { type: "number", step: "0.01", value: collectAmountRupees, onChange: (e) => setCollectAmountRupees(Number(e.target.value)), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Collection Method" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { type: "button", onClick: () => setCollectMethod('CASH'), className: `py-2 rounded-xl text-xs font-bold ${collectMethod === 'CASH'
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-night-800 text-slate-400'}`, children: "Cash" }), _jsx("button", { type: "button", onClick: () => setCollectMethod('UPI'), className: `py-2 rounded-xl text-xs font-bold ${collectMethod === 'UPI'
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-night-800 text-slate-400'}`, children: "UPI" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Ledger Note" }), _jsx("input", { type: "text", value: collectNotes, onChange: (e) => setCollectNotes(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { onClick: () => setCollectingOrder(null), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { onClick: handleConfirmCollection, className: "flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md", children: "Record in Ledger" })] })] }) }))] }));
};
