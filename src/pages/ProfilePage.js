import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, LogOut, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
export const ProfilePage = () => {
    const { user, logout, addAddress, deleteAddress } = useAuth();
    const [locations, setLocations] = useState([]);
    // Add Address Modal
    const [showModal, setShowModal] = useState(false);
    const [label, setLabel] = useState('Hostel Room');
    const [fullAddress, setFullAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [locationId, setLocationId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        const fetchLocs = async () => {
            try {
                const data = await apiRequest('/locations');
                if (data.locations) {
                    setLocations(data.locations);
                    if (data.locations.length > 0)
                        setLocationId(data.locations[0]._id);
                }
            }
            catch (err) {
                console.error('Failed to load locations:', err);
            }
        };
        fetchLocs();
    }, []);
    if (!user)
        return null;
    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!fullAddress || !locationId)
            return;
        setSubmitting(true);
        try {
            await addAddress({
                label,
                fullAddress,
                landmark,
                locationId,
            });
            setShowModal(false);
            setFullAddress('');
            setLandmark('');
        }
        catch (err) {
            alert('Failed to add address');
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-6 pb-20", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "My Account" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Manage your late-night delivery addresses and profile details." })] }), _jsxs("div", { className: "p-5 sm:p-6 rounded-3xl bg-night-900 border border-night-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-tr from-craving-600 to-amber-400 flex items-center justify-center font-black text-xl text-night-950 shadow-glow-orange", children: user.name.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("h2", { className: "font-extrabold text-lg text-white", children: user.name }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-craving-500" }), user.phone] }), user.email && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-craving-500" }), user.email] }))] })] })] }), _jsxs("button", { onClick: logout, className: "px-4 py-2 rounded-xl bg-night-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-night-700 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto", children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { children: "Sign Out" })] })] }), _jsxs("div", { className: "p-5 sm:p-6 rounded-3xl bg-night-900 border border-night-750 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5 text-craving-500" }), _jsx("h3", { className: "font-black text-white text-base", children: "Saved Delivery Addresses" })] }), _jsxs("button", { onClick: () => setShowModal(true), className: "px-3 py-1.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white font-bold text-xs flex items-center gap-1 shadow-glow-orange", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Add New" })] })] }), user.addresses && user.addresses.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: user.addresses.map((addr) => (_jsxs("div", { className: "p-4 rounded-2xl bg-night-850 border border-night-750 flex flex-col justify-between space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-xs text-white", children: addr.label }), _jsx("button", { onClick: () => addr._id && deleteAddress(addr._id), className: "text-slate-500 hover:text-rose-400 p-1", title: "Delete address", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] }), _jsx("p", { className: "text-xs text-slate-300 mt-1 leading-relaxed", children: addr.fullAddress }), addr.landmark && (_jsxs("p", { className: "text-[11px] text-slate-400 mt-0.5", children: ["Near: ", addr.landmark] }))] }), _jsxs("div", { className: "pt-2 border-t border-night-800 text-[10px] text-craving-400 font-bold flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), _jsx("span", { children: addr.locationName })] })] }, addr._id))) })) : (_jsx("div", { className: "py-6 text-center text-xs text-slate-400", children: "No saved addresses. Add your room or apartment address for faster checkout." }))] }), showModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: "Add Delivery Address" }), _jsxs("form", { onSubmit: handleAddAddress, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Label" }), _jsx("input", { type: "text", value: label, onChange: (e) => setLabel(e.target.value), placeholder: "e.g. Hostel Room, Studio Flat", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Delivery Area Zone" }), _jsx("select", { value: locationId, onChange: (e) => setLocationId(e.target.value), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true, children: locations.map((loc) => (_jsxs("option", { value: loc._id, children: [loc.name, " (~", loc.estimatedDeliveryMinutes, "m delivery)"] }, loc._id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Detailed Address" }), _jsx("textarea", { rows: 2, value: fullAddress, onChange: (e) => setFullAddress(e.target.value), placeholder: "Floor number, room / flat number, block...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Landmark (Optional)" }), _jsx("input", { type: "text", value: landmark, onChange: (e) => setLandmark(e.target.value), placeholder: "Nearby landmark...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowModal(false), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { type: "submit", disabled: submitting, className: "flex-1 py-2.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white text-xs font-black shadow-glow-orange", children: submitting ? 'Saving...' : 'Save Address' })] })] })] }) }))] }));
};
