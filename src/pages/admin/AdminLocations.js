import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { apiRequest } from '../../services/api';
export const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLoc, setEditingLoc] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minutes, setMinutes] = useState(25);
    const [isActive, setIsActive] = useState(true);
    const fetchLocations = async () => {
        setLoading(true);
        try {
            const data = await apiRequest('/admin/locations');
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
    useEffect(() => {
        fetchLocations();
    }, []);
    const openCreate = () => {
        setEditingLoc(null);
        setName('');
        setDescription('');
        setMinutes(25);
        setIsActive(true);
        setShowModal(true);
    };
    const openEdit = (loc) => {
        setEditingLoc(loc);
        setName(loc.name);
        setDescription(loc.description);
        setMinutes(loc.estimatedDeliveryMinutes);
        setIsActive(loc.isActive);
        setShowModal(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                description,
                estimatedDeliveryMinutes: minutes,
                isActive,
            };
            if (editingLoc) {
                await apiRequest(`/admin/locations/${editingLoc._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
            }
            else {
                await apiRequest('/admin/locations', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }
            setShowModal(false);
            fetchLocations();
        }
        catch (err) {
            alert(err.message || 'Failed to save location');
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Remove this delivery location?'))
            return;
        try {
            await apiRequest(`/admin/locations/${id}`, { method: 'DELETE' });
            fetchLocations();
        }
        catch (err) {
            alert(err.message || 'Failed to delete');
        }
    };
    return (_jsxs("div", { className: "space-y-6 pb-20", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white", children: "Delivery Locations" }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-0.5", children: "Manage active delivery areas, campuses, and estimated delivery times." })] }), _jsxs("button", { onClick: openCreate, className: "px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Service Area" })] })] }), loading ? (_jsx("div", { className: "py-20 text-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" }) })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: locations.map((loc) => (_jsxs("div", { className: "p-5 rounded-3xl bg-night-900 border border-night-750 flex flex-col justify-between space-y-3 shadow-lg", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-extrabold text-sm text-white", children: loc.name }), _jsxs("span", { className: "text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/15 text-purple-300", children: ["~", loc.estimatedDeliveryMinutes, "m"] })] }), _jsx("p", { className: "text-xs text-slate-400 mt-1 leading-relaxed", children: loc.description || 'Full area coverage' })] }), _jsxs("div", { className: "pt-2 border-t border-night-800 flex items-center justify-between", children: [_jsxs("span", { className: `text-[10px] font-black uppercase flex items-center gap-1 ${loc.isActive ? 'text-emerald-400' : 'text-rose-400'}`, children: [loc.isActive ? _jsx(CheckCircle2, { className: "w-3.5 h-3.5" }) : _jsx(XCircle, { className: "w-3.5 h-3.5" }), _jsx("span", { children: loc.isActive ? 'Active' : 'Disabled' })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => openEdit(loc), className: "p-1.5 text-slate-400 hover:text-white rounded-lg", children: _jsx(Edit, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => handleDelete(loc._id), className: "p-1.5 text-slate-400 hover:text-rose-400 rounded-lg", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] })] }, loc._id))) })), showModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "bg-night-900 border border-night-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl", children: [_jsx("h3", { className: "font-extrabold text-lg text-white", children: editingLoc ? 'Edit Delivery Area' : 'Add Delivery Area' }), _jsxs("form", { onSubmit: handleSave, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Area Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. North Campus Hostels", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Description / Boundaries" }), _jsx("textarea", { rows: 2, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "e.g. Hostels 1-8, North Mess, PG clusters...", className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-300 font-semibold block mb-1", children: "Estimated Delivery Time (Mins)" }), _jsx("input", { type: "number", min: "5", value: minutes, onChange: (e) => setMinutes(Number(e.target.value)), className: "w-full bg-night-950 border border-night-700 rounded-xl p-2.5 text-xs text-white", required: true })] }), _jsx("div", { className: "pt-1", children: _jsxs("label", { className: "flex items-center gap-2 text-xs text-slate-300 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: isActive, onChange: (e) => setIsActive(e.target.checked), className: "rounded bg-night-950 border-night-700 text-purple-600" }), _jsx("span", { children: "Location Serviced & Active for Orders" })] }) }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowModal(false), className: "flex-1 py-2.5 rounded-xl bg-night-800 text-slate-300 text-xs font-bold", children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md", children: "Save Area" })] })] })] }) }))] }));
};
