import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export const AdminLogin = () => {
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            await loginAdmin(email.trim(), password);
            navigate('/admin/dashboard');
        }
        catch (err) {
            setErrorMsg(err.message || 'Invalid administrator credentials');
        }
        finally {
            setLoading(false);
        }
    };
    const fillQuickAdmin = (adminEmail) => {
        setEmail(adminEmail);
        setPassword('Admin@123');
    };
    return (_jsxs("div", { className: "max-w-md mx-auto py-12 px-4 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg", children: _jsx(Shield, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-black text-white", children: "Administrator Portal" }), _jsx("p", { className: "text-xs text-slate-400", children: "Restricted access for Aditya & Amlesh." })] }), _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-700 shadow-2xl space-y-4", children: [errorMsg && (_jsxs("div", { className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 flex-shrink-0 text-rose-400" }), _jsx("span", { children: errorMsg })] })), _jsxs("form", { onSubmit: handleLogin, className: "space-y-3.5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Admin Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "aditya@latenightcraving.com", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Admin Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-2", children: loading ? _jsx("span", { children: "Verifying credentials..." }) : _jsxs(_Fragment, { children: [_jsx("span", { children: "Enter Admin Dashboard" }), _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] }), _jsxs("div", { className: "pt-4 border-t border-night-800 space-y-2", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wider", children: "Quick Fill Seeded Accounts:" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("button", { type: "button", onClick: () => fillQuickAdmin('aditya@latenightcraving.com'), className: "p-2 rounded-xl bg-night-850 hover:bg-night-800 border border-night-700 text-[11px] font-bold text-slate-200 text-center flex items-center justify-center gap-1.5", children: [_jsx(UserCheck, { className: "w-3.5 h-3.5 text-purple-400" }), _jsx("span", { children: "Aditya" })] }), _jsxs("button", { type: "button", onClick: () => fillQuickAdmin('amlesh@latenightcraving.com'), className: "p-2 rounded-xl bg-night-850 hover:bg-night-800 border border-night-700 text-[11px] font-bold text-slate-200 text-center flex items-center justify-center gap-1.5", children: [_jsx(UserCheck, { className: "w-3.5 h-3.5 text-indigo-400" }), _jsx("span", { children: "Amlesh" })] })] })] })] })] }));
};
