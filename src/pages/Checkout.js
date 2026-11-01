import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Plus, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { apiRequest, formatCurrency } from '../services/api';
export const Checkout = () => {
    const { user, addAddress } = useAuth();
    const { cart, bill, clearCart } = useCart();
    const { storeStatus } = useStore();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    // Add Address Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLabel, setNewLabel] = useState('Hostel Room');
    const [newAddress, setNewAddress] = useState('');
    const [newLandmark, setNewLandmark] = useState('');
    const [newLocationId, setNewLocationId] = useState('');
    useEffect(() => {
        if (user) {
            setRecipientName(user.name || '');
            setRecipientPhone(user.phone || '');
        }
    }, [user]);
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await apiRequest('/locations');
                if (data.locations) {
                    setLocations(data.locations);
                    if (data.locations.length > 0) {
                        setNewLocationId(data.locations[0]._id);
                    }
                }
            }
            catch (err) {
                console.error('Failed to fetch delivery locations:', err);
            }
        };
        fetchLocations();
    }, []);
    const isStoreOpen = storeStatus?.orderingEnabled ?? true;
    if (cart.length === 0) {
        return (_jsxs("div", { className: "py-20 text-center space-y-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-night-900 mx-auto flex items-center justify-center text-slate-400", children: _jsx(ShoppingBag, { className: "w-8 h-8" }) }), _jsx("h2", { className: "text-xl font-bold text-white", children: "Your cart is empty" }), _jsx("p", { className: "text-xs text-slate-400 max-w-sm mx-auto", children: "Add your favourite burgers, maggi, or beverages before proceeding to checkout." }), _jsx(Link, { to: "/products", className: "inline-flex px-5 py-2.5 rounded-xl bg-craving-500 text-white font-bold text-xs shadow-glow-orange", children: "Browse Menu" })] }));
    }
    // If customer is not authenticated
    if (!user) {
        return (_jsx("div", { className: "max-w-md mx-auto py-12 px-4 space-y-6", children: _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-750 text-center space-y-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-craving-500/10 text-craving-500 mx-auto flex items-center justify-center", children: _jsx(ShieldCheck, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-black text-white", children: "Authentication Required" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Please log in or create an account to proceed with your late-night order." })] }), _jsxs("div", { className: "flex flex-col gap-2 pt-2", children: [_jsx(Link, { to: "/login?redirect=/checkout", className: "w-full py-3 rounded-xl bg-craving-500 hover:bg-craving-600 text-white font-extrabold text-xs shadow-glow-orange transition-all", children: "Sign In to Continue" }), _jsx(Link, { to: "/register?redirect=/checkout", className: "w-full py-3 rounded-xl bg-night-800 hover:bg-night-750 text-slate-300 font-bold text-xs border border-night-700 transition-colors", children: "Create New Account" })] })] }) }));
    }
    const handleCreateAddress = async (e) => {
        e.preventDefault();
        if (!newAddress || !newLocationId) {
            setErrorMsg('Please enter your full room/address and choose a delivery area.');
            return;
        }
        try {
            await addAddress({
                label: newLabel,
                fullAddress: newAddress,
                landmark: newLandmark,
                locationId: newLocationId,
            });
            setShowAddModal(false);
            setNewAddress('');
            setNewLandmark('');
            setSelectedAddressIndex(user.addresses.length); // Select newly added address
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to save address');
        }
    };
    const handlePlaceOrder = async () => {
        setErrorMsg('');
        if (!isStoreOpen) {
            setErrorMsg('Store is currently closed because both administrators are offline.');
            return;
        }
        if (!user.addresses || user.addresses.length === 0) {
            setErrorMsg('Please add and select a delivery address first.');
            return;
        }
        if (!recipientName.trim()) {
            setErrorMsg('Please enter the recipient name.');
            return;
        }
        if (!/^\+?[1-9]\d{9,14}$/.test(recipientPhone.replace(/[\s()-]/g, ''))) {
            setErrorMsg('Please enter a valid recipient phone number.');
            return;
        }
        const chosenAddress = user.addresses[selectedAddressIndex] || user.addresses[0];
        setIsSubmitting(true);
        try {
            const orderPayload = {
                items: cart.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                    name: item.product.name,
                })),
                deliveryAddress: {
                    fullAddress: chosenAddress.fullAddress,
                    landmark: chosenAddress.landmark,
                    locationId: chosenAddress.locationId,
                    locationName: chosenAddress.locationName,
                },
                deliveryInstructions,
                recipientName: recipientName.trim(),
                recipientPhone: recipientPhone.trim(),
            };
            const res = await apiRequest('/orders', {
                method: 'POST',
                body: JSON.stringify(orderPayload),
            });
            if (res.success && res.order) {
                clearCart();
                navigate(`/order/${res.order._id}`);
            }
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to place order. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const selectedAddress = user.addresses?.[selectedAddressIndex];
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6 pb-20", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Checkout" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Review your late-night delivery address and order details." })] }), errorMsg && (_jsxs("div", { className: "p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 flex-shrink-0 text-rose-400" }), _jsx("span", { children: errorMsg })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5 text-craving-500" }), _jsx("h3", { className: "font-extrabold text-white text-base", children: "Delivery Location" })] }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "text-xs font-bold text-craving-500 hover:text-craving-400 flex items-center gap-1", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add Address" })] })] }), user.addresses && user.addresses.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: user.addresses.map((addr, idx) => (_jsxs("div", { onClick: () => setSelectedAddressIndex(idx), className: `p-3.5 rounded-xl border cursor-pointer transition-all ${selectedAddressIndex === idx
                                                ? 'bg-night-800 border-craving-500 shadow-glow-orange'
                                                : 'bg-night-850 border-night-750 hover:border-night-600'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-black text-white", children: addr.label }), selectedAddressIndex === idx && (_jsx(CheckCircle2, { className: "w-4 h-4 text-craving-500" }))] }), _jsx("p", { className: "text-xs text-slate-300 mt-1 line-clamp-2", children: addr.fullAddress }), _jsxs("div", { className: "text-[10px] text-craving-400 font-semibold mt-1.5 flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), _jsx("span", { children: addr.locationName })] })] }, addr._id || idx))) })) : (_jsxs("div", { className: "p-4 rounded-xl bg-night-850 border border-night-800 text-center space-y-2", children: [_jsx("p", { className: "text-xs text-slate-400", children: "You don't have any saved delivery addresses." }), _jsx("button", { onClick: () => setShowAddModal(true), className: "px-4 py-2 rounded-xl bg-craving-500 text-white font-bold text-xs", children: "Add Your Delivery Address"                                                 })] }))] }), _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-3", children: [_jsx("h3", { className: "font-extrabold text-white text-sm", children: "Recipient Details" }), _jsx("p", { className: "text-[10px] text-slate-400", children: "These details are saved with this order and can be changed when ordering for someone else." }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("label", { className: "space-y-1.5", children: [_jsx("span", { className: "text-xs font-bold text-slate-300", children: "Recipient Name" }), _jsx("input", { type: "text", value: recipientName, onChange: (e) => setRecipientName(e.target.value), placeholder: "Enter recipient name", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-craving-500" })] }), _jsxs("label", { className: "space-y-1.5", children: [_jsx("span", { className: "text-xs font-bold text-slate-300", children: "Recipient Phone Number" }), _jsx("input", { type: "tel", value: recipientPhone, onChange: (e) => setRecipientPhone(e.target.value), placeholder: "Enter recipient phone number", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-craving-500" })] })] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-3", children: [_jsx("h3", { className: "font-extrabold text-white text-sm", children: "Delivery Instructions (Optional)" }), _jsx("textarea", { rows: 2, value: deliveryInstructions, onChange: (e) => setDeliveryInstructions(e.target.value), placeholder: "e.g. Call when near hostel gate, leave with guard if after 2 AM...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-craving-500" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-3", children: [_jsxs("h3", { className: "font-extrabold text-white text-sm", children: ["Items in this Order (", cart.length, ")"] }), _jsx("div", { className: "space-y-2", children: cart.map(({ product, quantity }) => (_jsxs("div", { className: "flex justify-between items-center text-xs py-1 border-b border-night-800/60 last:border-none", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "font-bold text-craving-400", children: [quantity, "x"] }), _jsx("span", { className: "text-slate-200", children: product.name }), _jsx("span", { className: "text-[10px] px-1.5 py-0.2 rounded bg-night-800 text-slate-400", children: product.paymentPolicy === 'PARTIAL_PAYMENT' ? '40% advance' : product.paymentPolicy === 'FULL_PAYMENT' ? '100% advance' : 'POD' })] }), _jsx("span", { className: "font-bold text-white", children: formatCurrency(Math.round(product.sellingPrice * (quantity <= 1 ? 1 : 1 + (quantity - 1) * 1.5))) })] }, product._id))) })] })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "p-5 rounded-2xl bg-night-900 border border-night-750 space-y-4", children: [_jsx("h3", { className: "font-extrabold text-white text-base", children: "Payment & Pricing Breakdown" }), _jsxs("div", { className: "space-y-2 text-xs text-slate-300", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Product Subtotal" }), _jsx("span", { className: "font-bold text-white", children: formatCurrency(bill.productSubtotal) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Delivery Fee (Hyperlocal)" }), _jsx("span", { className: "font-bold text-white", children: formatCurrency(bill.deliveryFee) })] }), _jsxs("div", { className: "flex justify-between text-slate-400 text-[11px]", children: [_jsx("span", { children: "Automatic quantity pricing" }), _jsx("span", { children: "1x first unit · 1.5x each extra unit" })] }), _jsxs("div", { className: "pt-2 border-t border-night-800 flex justify-between font-black text-sm text-white", children: [_jsx("span", { children: "Order Total" }), _jsx("span", { className: "text-craving-400", children: formatCurrency(bill.orderTotal) })] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-night-850 border border-night-700/80 space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-extrabold text-amber-400 uppercase text-[10px] tracking-wider", children: "Advance Payable Online:" }), _jsx("span", { className: "font-black text-white text-sm", children: formatCurrency(bill.onlineAdvanceRequired) })] }), _jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-extrabold text-emerald-400 uppercase text-[10px] tracking-wider", children: "Remaining on Delivery:" }), _jsx("span", { className: "font-black text-white text-sm", children: formatCurrency(bill.remainingBalance) })] }), _jsx("p", { className: "text-[10px] text-slate-400 pt-1 border-t border-night-800", children: "You will pay the online advance via the accepting admin's UPI QR code once accepted." })] }), _jsx("button", { disabled: isSubmitting || !isStoreOpen, onClick: handlePlaceOrder, className: `w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-glow-orange transition-all ${isStoreOpen && !isSubmitting
                                        ? 'bg-craving-500 hover:bg-craving-600 text-white cursor-pointer active:scale-98'
                                        : 'bg-night-800 text-slate-500 cursor-not-allowed'}`, children: isSubmitting ? (_jsx("span", { children: "Placing your order..." })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Place Order" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })) })] }) })] }), showAddModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: "Add Delivery Address" }), _jsxs("form", { onSubmit: handleCreateAddress, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Address Label" }), _jsx("input", { type: "text", value: newLabel, onChange: (e) => setNewLabel(e.target.value), placeholder: "e.g. Hostel Room 304, Tower B Flat 12", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Service Area Zone" }), _jsx("select", { value: newLocationId, onChange: (e) => setNewLocationId(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true, children: locations.map((loc) => (_jsxs("option", { value: loc._id, children: [loc.name, " (~", loc.estimatedDeliveryMinutes, "m delivery)"] }, loc._id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Full Detailed Address" }), _jsx("textarea", { rows: 2, value: newAddress, onChange: (e) => setNewAddress(e.target.value), placeholder: "Floor number, room / flat number, building name...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Landmark (Optional)" }), _jsx("input", { type: "text", value: newLandmark, onChange: (e) => setNewLandmark(e.target.value), placeholder: "Near Mess / Gate No. 2...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAddModal(false), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 py-2.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white text-xs font-black shadow-glow-orange", children: "Save Address" })] })] })] }) }))] }));
};
