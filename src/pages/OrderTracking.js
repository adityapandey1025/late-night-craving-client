import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertTriangle, QrCode, Share2, ExternalLink, MessageCircle, Copy, Check, Star, ShieldCheck, MapPin, } from 'lucide-react';
import { apiRequest, formatCurrency } from '../services/api';
import { getSocket } from '../services/socket';
import { StatusTimeline } from '../components/StatusTimeline';
import { ETACounter } from '../components/ETACounter';
export const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    // Payment Reference submission
    const [referenceInput, setReferenceInput] = useState('');
    const [submittingRef, setSubmittingRef] = useState(false);
    const [refSuccessMsg, setRefSuccessMsg] = useState('');
    // WhatsApp Link
    const [whatsappUrl, setWhatsappUrl] = useState('');
    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [deliveryFeedback, setDeliveryFeedback] = useState('');
    const [hasReviewed, setHasReviewed] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    // Copy helper
    const [copiedUPI, setCopiedUPI] = useState(false);
    const fetchOrderDetails = async () => {
        if (!id)
            return;
        try {
            const data = await apiRequest(`/orders/${id}`);
            if (data.order) {
                setOrder(data.order);
                setPayment(data.payment);
                // If order has an assigned admin, fetch UPI QR data
                if (data.order.assignedAdminId) {
                    try {
                        const payInfo = await apiRequest(`/payments/order/${id}/info`);
                        setPaymentInfo(payInfo);
                    }
                    catch (pErr) {
                        console.error('Failed to load QR info:', pErr);
                    }
                }
                // If WhatsApp location is unlocked, get the official WhatsApp link
                if (data.order.whatsappSharingUnlocked) {
                    try {
                        const waData = await apiRequest(`/payments/order/${id}/whatsapp`);
                        if (waData.whatsappUrl) {
                            setWhatsappUrl(waData.whatsappUrl);
                        }
                    }
                    catch (waErr) {
                        console.error('Failed to load WhatsApp link:', waErr);
                    }
                }
                // Fetch payment ledger
                try {
                    const ledgerData = await apiRequest(`/payments/order/${id}/ledger`);
                    if (ledgerData.transactions) {
                        setLedger(ledgerData.transactions);
                    }
                }
                catch (lErr) {
                    console.error('Failed to load ledger:', lErr);
                }
            }
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to load order.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrderDetails();
        const socket = getSocket();
        if (id) {
            socket.emit('join_order', { orderId: id });
        }
        const handleStatusUpdate = (payload) => {
            fetchOrderDetails();
        };
        const handleETAUpdate = (payload) => {
            setOrder((prev) => (prev ? { ...prev, estimatedDeliveryTime: payload.estimatedDeliveryTime } : null));
        };
        const handlePaymentConfirmed = (payload) => {
            fetchOrderDetails();
            if (payload.whatsappUrl) {
                setWhatsappUrl(payload.whatsappUrl);
            }
        };
        socket.on('order:status_updated', handleStatusUpdate);
        socket.on('order:eta_updated', handleETAUpdate);
        socket.on('order:payment_confirmed', handlePaymentConfirmed);
        return () => {
            if (id) {
                socket.emit('leave_order', { orderId: id });
            }
            socket.off('order:status_updated', handleStatusUpdate);
            socket.off('order:eta_updated', handleETAUpdate);
            socket.off('order:payment_confirmed', handlePaymentConfirmed);
        };
    }, [id]);
    const handleSubmitReference = async (e) => {
        e.preventDefault();
        if (!referenceInput.trim())
            return;
        setSubmittingRef(true);
        try {
            const res = await apiRequest(`/payments/order/${id}/submit-reference`, {
                method: 'POST',
                body: JSON.stringify({ reference: referenceInput.trim() }),
            });
            if (res.success) {
                setRefSuccessMsg('Payment marked completed. Admin notified; verification is pending.');
                fetchOrderDetails();
            }
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to submit payment reference');
        }
        finally {
            setSubmittingRef(false);
        }
    };
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewText.trim())
            return;
        setSubmittingReview(true);
        try {
            const res = await apiRequest('/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    orderId: id,
                    rating,
                    reviewText,
                    deliveryFeedback,
                }),
            });
            if (res.success) {
                setHasReviewed(true);
                setShowReviewModal(false);
            }
        }
        catch (err) {
            alert(err.message || 'Failed to submit review');
        }
        finally {
            setSubmittingReview(false);
        }
    };
    const copyUPI = (upiId) => {
        navigator.clipboard.writeText(upiId);
        setCopiedUPI(true);
        setTimeout(() => setCopiedUPI(false), 2000);
    };
    if (loading) {
        return (_jsxs("div", { className: "py-24 text-center", children: [_jsx("div", { className: "w-10 h-10 border-4 border-craving-500 border-t-transparent rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-xs text-slate-400 mt-3", children: "Connecting to live order tracker..." })] }));
    }
    if (errorMsg || !order) {
        return (_jsxs("div", { className: "py-20 text-center max-w-md mx-auto space-y-4", children: [_jsx(AlertTriangle, { className: "w-10 h-10 text-rose-500 mx-auto" }), _jsx("h2", { className: "text-lg font-bold text-white", children: "Order Not Found" }), _jsx("p", { className: "text-xs text-slate-400", children: errorMsg || 'Could not find the requested order.' }), _jsx(Link, { to: "/my-orders", className: "inline-flex px-4 py-2 rounded-xl bg-night-800 text-craving-400 font-bold text-xs border border-night-700", children: "View My Orders" })] }));
    }
    const isAwaitingAcceptance = order.status === 'PENDING_ADMIN_ACCEPTANCE';
    const isAwaitingPayment = order.status === 'AWAITING_PAYMENT';
    const isPaymentConfirmed = order.status !== 'PENDING_ADMIN_ACCEPTANCE' && order.status !== 'AWAITING_PAYMENT' && order.status !== 'REJECTED';
    const isDelivered = order.status === 'DELIVERED';
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6 pb-20", children: [_jsxs("div", { className: "p-5 sm:p-6 rounded-3xl bg-night-900 border border-night-750 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-mono font-bold text-craving-400", children: order.orderNumber }), _jsxs("span", { className: "text-[10px] text-slate-400", children: ["\u2022 ", new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] }), _jsx("h1", { className: "text-xl sm:text-2xl font-black text-white", children: "Live Order Tracking" }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Assigned Admin: ", order.assignedAdminSnapshot?.name || 'Waiting for Aditya or Amlesh'] })] }), _jsxs("div", { className: "px-3.5 py-1.5 rounded-xl bg-night-800 border border-night-700 text-right self-start sm:self-auto", children: [_jsx("div", { className: "text-[10px] uppercase font-bold text-slate-400", children: "Status" }), _jsx("div", { className: "text-xs font-black text-white capitalize", children: order.status.replace(/_/g, ' ') })] })] }), _jsx(ETACounter, { estimatedDeliveryTime: order.estimatedDeliveryTime, status: order.status }), isAwaitingAcceptance && (_jsxs("div", { className: "p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300", children: [_jsx(Clock, { className: "w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5 animate-spin-slow" }), _jsxs("div", { className: "space-y-1", children: [_jsx("h4", { className: "font-extrabold text-sm text-amber-200", children: "Awaiting Administrator Acceptance" }), _jsx("p", { className: "text-xs text-amber-300/90 leading-relaxed", children: "Your order is queued in the kitchen. Either Aditya or Amlesh will accept the order shortly, apply the order surcharge (\u20B95, \u20B910, or \u20B920), and provide their official UPI QR code for the advance payment." })] })] })), isAwaitingPayment && paymentInfo && (_jsxs("div", { className: "p-6 rounded-3xl bg-gradient-to-b from-night-900 to-night-850 border border-craving-500/40 shadow-glow-orange space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-xl bg-craving-500/10 text-craving-500", children: _jsx(QrCode, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-black text-lg text-white", children: "Pay Online Advance to Assigned Administrator" }), _jsxs("p", { className: "text-xs text-slate-300", children: ["Accepted by ", _jsx("span", { className: "font-bold text-craving-400", children: paymentInfo.assignedAdmin?.name }), ". Automatic quantity pricing: first unit 1x, each additional unit 1.5x."] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center", children: [_jsxs("div", { className: "flex flex-col items-center p-5 rounded-2xl bg-night-950 border border-night-750 text-center space-y-3", children: [paymentInfo.qrDataUrl ? (_jsx("img", { src: paymentInfo.qrDataUrl, alt: "UPI QR Code", className: "w-56 h-56 rounded-xl bg-white p-2 shadow-lg" })) : (_jsx("div", { className: "w-56 h-56 rounded-xl bg-night-900 flex items-center justify-center text-xs text-slate-400", children: "QR Loading..." })), _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-[10px] text-slate-400 uppercase font-bold tracking-wider", children: "Advance Amount to Pay" }), _jsx("div", { className: "text-2xl font-black text-white", children: formatCurrency(paymentInfo.pricing?.onlineAdvanceRequired || 0) })] }), _jsxs("div", { className: "w-full flex items-center justify-between p-2 rounded-xl bg-night-900 border border-night-800 text-xs", children: [_jsx("span", { className: "font-mono text-slate-300 truncate max-w-[180px]", children: paymentInfo.assignedAdmin?.upiId }), _jsxs("button", { onClick: () => copyUPI(paymentInfo.assignedAdmin?.upiId), className: "px-2 py-1 rounded-lg bg-night-800 hover:bg-night-700 text-craving-400 font-bold text-[10px] flex items-center gap-1", children: [copiedUPI ? _jsx(Check, { className: "w-3 h-3 text-emerald-400" }) : _jsx(Copy, { className: "w-3 h-3" }), _jsx("span", { children: copiedUPI ? 'Copied' : 'Copy' })] })] }), paymentInfo.upiIntentUrl && (_jsxs("a", { href: paymentInfo.upiIntentUrl, className: "w-full py-2.5 rounded-xl bg-gradient-to-r from-craving-500 to-amber-500 hover:opacity-95 text-night-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md", children: [_jsx("span", { children: "Pay via GPay / PhonePe / Paytm" }), _jsx(ExternalLink, { className: "w-3.5 h-3.5" })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-night-950/80 border border-night-800 space-y-2", children: [_jsxs("h4", { className: "font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-craving-500" }), "Manual Verification Policy"] }), _jsxs("p", { className: "text-xs text-slate-400 leading-relaxed", children: ["1. Scan QR and pay the advance of ", formatCurrency(paymentInfo.pricing?.onlineAdvanceRequired), ".", _jsx("br", {}), "2. Enter the UTR / payment reference below.", _jsx("br", {}), "3. ", paymentInfo.assignedAdmin?.name, " will check their bank notification and verify manually.", _jsx("br", {}), "4. WhatsApp location sharing unlocks immediately upon verification!"] })] }), refSuccessMsg ? (_jsxs("div", { className: "p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { children: refSuccessMsg })] })) : (_jsxs("form", { onSubmit: handleSubmitReference, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-slate-200 block mb-1", children: "UPI Reference / UTR Number (Optional)" }), _jsx("input", { type: "text", value: referenceInput, onChange: (e) => setReferenceInput(e.target.value), placeholder: "e.g. 412389104821 or your UPI ID", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500" })] }), _jsx("button", { type: "submit", disabled: submittingRef, className: "w-full py-3 rounded-xl bg-craving-500 hover:bg-craving-600 text-white font-black text-xs shadow-glow-orange transition-all", children: submittingRef ? 'Submitting...' : "I Have Paid — Submit for Verification" })] }))] })] })] })), order.whatsappSharingUnlocked && (_jsxs("div", { className: "p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-night-900 to-night-900 border border-emerald-500/40 shadow-glow-emerald flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400", children: _jsx(MessageCircle, { className: "w-5 h-5" }) }), _jsx("h3", { className: "font-black text-sm sm:text-base text-white", children: "Share Delivery Location via WhatsApp" })] }), _jsxs("p", { className: "text-xs text-slate-300 max-w-lg", children: ["Payment is verified! Tap below to open WhatsApp with prefilled order #", order.orderNumber, " and drop your live pin/location to our courier."] })] }), _jsxs("a", { href: whatsappUrl || `https://wa.me/919876543210?text=Hi%2C%20sharing%20location%20for%20order%20${order.orderNumber}`, target: "_blank", rel: "noopener noreferrer", className: "px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-night-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap", children: [_jsx(Share2, { className: "w-4 h-4" }), _jsx("span", { children: "Open WhatsApp & Drop Pin" })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-750 space-y-4", children: [_jsx("h3", { className: "font-black text-base text-white", children: "Order Progress" }), _jsx(StatusTimeline, { status: order.status, statusHistory: order.statusHistory })] }), _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-750 space-y-3", children: [_jsx("h3", { className: "font-extrabold text-sm text-white", children: "Status Activity Log" }), _jsx("div", { className: "space-y-2", children: order.statusHistory.map((h, i) => (_jsxs("div", { className: "text-xs p-2.5 rounded-xl bg-night-850 border border-night-800 flex justify-between items-start gap-2", children: [_jsxs("div", { children: [_jsx("span", { className: "font-bold text-slate-200", children: h.status.replace(/_/g, ' ') }), _jsx("span", { className: "text-slate-400 text-[11px] block mt-0.5", children: h.note })] }), _jsx("span", { className: "text-[10px] text-slate-400 whitespace-nowrap", children: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }, i))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-5 rounded-3xl bg-night-900 border border-night-750 space-y-4", children: [_jsx("h3", { className: "font-extrabold text-white text-base", children: "Final Bill & Payment Split" }), _jsxs("div", { className: "space-y-2 text-xs text-slate-300", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Product Subtotal" }), _jsx("span", { className: "font-bold text-white", children: formatCurrency(order.pricing.productSubtotal) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Delivery Fee" }), _jsx("span", { className: "font-bold text-white", children: formatCurrency(order.pricing.deliveryFee) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Automatic quantity pricing" }), _jsx("span", { className: "font-bold text-craving-400", children: order.pricing.fastFoodSurcharge > 0
                                                            ? formatCurrency(order.pricing.fastFoodSurcharge)
                                                            : '₹0 (None)' })] }), _jsxs("div", { className: "pt-2 border-t border-night-800 flex justify-between font-black text-sm text-white", children: [_jsx("span", { children: "Order Total" }), _jsx("span", { className: "text-craving-400", children: formatCurrency(order.pricing.orderTotal) })] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl bg-night-850 border border-night-750 space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-bold text-amber-300", children: "Online Advance:" }), _jsx("span", { className: "font-black text-white", children: formatCurrency(order.pricing.onlineAdvanceRequired) })] }), _jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-bold text-emerald-300", children: "Remaining Balance:" }), _jsx("span", { className: "font-black text-white", children: formatCurrency(order.pricing.remainingBalance) })] }), _jsxs("div", { className: "text-[10px] text-slate-400 pt-1 border-t border-night-800", children: ["Remaining balance is collected on delivery via Cash or UPI to ", order.assignedAdminSnapshot?.name || 'admin', "."] })] }), ledger.length > 0 && (_jsxs("div", { className: "space-y-2 pt-2 border-t border-night-800", children: [_jsx("h4", { className: "text-[11px] font-black uppercase tracking-wider text-slate-400", children: "Settlement Ledger" }), ledger.map((tx) => (_jsxs("div", { className: "p-2 rounded-xl bg-night-950 border border-night-800 text-[11px]", children: [_jsxs("div", { className: "flex justify-between font-bold text-slate-200", children: [_jsxs("span", { children: [tx.transactionType.replace(/_/g, ' '), " (", tx.paymentMethod, ")"] }), _jsxs("span", { className: "text-emerald-400", children: ["+", formatCurrency(tx.amount)] })] }), _jsxs("div", { className: "text-[10px] text-slate-400 mt-0.5", children: ["Collected by ", tx.adminName] })] }, tx._id)))] }))] }), _jsxs("div", { className: "p-5 rounded-3xl bg-night-900 border border-night-750 space-y-2 text-xs", children: [_jsxs("h4", { className: "font-extrabold text-white text-sm flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4 text-craving-500" }), "Delivery Address"] }), _jsx("p", { className: "text-slate-300", children: order.deliveryAddress.fullAddress }), order.deliveryAddress.landmark && (_jsxs("p", { className: "text-slate-400", children: ["Landmark: ", order.deliveryAddress.landmark] })), _jsx("p", { className: "text-craving-400 font-semibold", children: order.deliveryAddress.locationName })] }), isDelivered && (_jsxs("div", { className: "p-5 rounded-3xl bg-night-900 border border-night-750 text-center space-y-3", children: [_jsx(Star, { className: "w-8 h-8 text-amber-400 fill-amber-400 mx-auto" }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-white text-sm", children: "How was your midnight craving?" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Rate your late-night food and delivery experience." })] }), _jsx("button", { disabled: hasReviewed, onClick: () => setShowReviewModal(true), className: `w-full py-2.5 rounded-xl font-bold text-xs ${hasReviewed
                                            ? 'bg-night-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-craving-500 hover:bg-craving-600 text-white shadow-glow-orange'}`, children: hasReviewed ? 'Feedback Submitted ★' : 'Rate & Review Order' })] }))] })] }), showReviewModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsxs("h3", { className: "font-extrabold text-lg text-white", children: ["Rate Order #", order.orderNumber] }), _jsxs("form", { onSubmit: handleSubmitReview, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-2", children: "Overall Rating" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", onClick: () => setRating(star), className: "p-1 hover:scale-110 transition-transform", children: _jsx(Star, { className: `w-7 h-7 ${star <= rating
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-night-700 fill-night-700'}` }) }, star))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Your Review" }), _jsx("textarea", { rows: 3, value: reviewText, onChange: (e) => setReviewText(e.target.value), placeholder: "How was the food quality and temperature? Would you order again?", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Delivery Feedback (Optional)" }), _jsx("input", { type: "text", value: deliveryFeedback, onChange: (e) => setDeliveryFeedback(e.target.value), placeholder: "Courier punctuality, packaging, location finding...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowReviewModal(false), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { type: "submit", disabled: submittingReview, className: "flex-1 py-2.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white text-xs font-black shadow-glow-orange", children: submittingReview ? 'Submitting...' : 'Post Review' })] })] })] }) }))] }));
};
