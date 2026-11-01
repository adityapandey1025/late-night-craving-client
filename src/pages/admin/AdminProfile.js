import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
export const AdminProfile = () => {
    const { admin } = useAuth();
    const [upiId, setUpiId] = useState(admin?.upiId || '');
    const [upiName, setUpiName] = useState(admin?.upiName || '');
    const [phone, setPhone] = useState(admin?.phone || '');
    const [qrCodeUrl, setQrCodeUrl] = useState(admin?.qrCodeUrl || '');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    if (!admin)
        return null;
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        try {
            await apiRequest('/admin/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    upiId,
                    upiName,
                    phone,
                    qrCodeUrl,
                }),
            });
            setSuccessMsg('UPI payment details updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        }
        catch (err) {
            alert(err.message || 'Failed to update profile');
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6 pb-20", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Administrator Profile & UPI Settings" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Configure your personal UPI ID and QR code used when you accept customer orders." })] }), _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-700 shadow-xl space-y-5", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-night-800 pb-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white", children: admin.name.charAt(0) }), _jsxs("div", { children: [_jsx("h2", { className: "font-extrabold text-lg text-white", children: admin.name }), _jsx("span", { className: "text-xs text-purple-400 font-semibold", children: admin.email })] })] }), successMsg && (_jsxs("div", { className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { children: successMsg })] })), _jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "UPI ID (VPA)" }), _jsx("input", { type: "text", value: upiId, onChange: (e) => setUpiId(e.target.value), placeholder: "e.g. aditya@okhdfcbank", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white", required: true }), _jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Customers will pay order advance amounts directly to this UPI address when you accept orders." })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "UPI Registered Name" }), _jsx("input", { type: "text", value: upiName, onChange: (e) => setUpiName(e.target.value), placeholder: "e.g. Aditya (lateNightCraving)", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Contact Phone" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+91 98765 43210", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white", required: true })] }), _jsx("button", { type: "submit", disabled: saving, className: "w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all", children: saving ? 'Updating...' : 'Save UPI & Profile Details' })] })] })] }));
};
