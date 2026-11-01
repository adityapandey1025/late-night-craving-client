import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Moon, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Register = () => {
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const { registerCustomer } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!name || !phone || !password) {
            setErrorMsg('Name, phone, and password are required');
            return;
        }
        setLoading(true);
        try {
            await registerCustomer(name.trim(), phone.trim(), password, email.trim() || undefined);
            navigate(redirect);
        }
        catch (err) {
            setErrorMsg(err.message || 'Registration failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto py-12 px-4 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-craving-600 to-amber-400 mx-auto flex items-center justify-center shadow-glow-orange", children: _jsx(Moon, { className: "w-6 h-6 text-night-950 fill-night-950" }) }), _jsx("h1", { className: "text-2xl font-black text-white", children: "Create Craver Account" }), _jsx("p", { className: "text-xs text-slate-400", children: "Join the late-night hyperlocal network." })] }), _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-750 shadow-xl space-y-4", children: [errorMsg && (_jsxs("div", { className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 flex-shrink-0 text-rose-400" }), _jsx("span", { children: errorMsg })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Full Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. John Doe", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Phone Number" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+91 98765 43210", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Email (Optional)" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "john@example.com", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white font-black text-xs shadow-glow-orange flex items-center justify-center gap-2 transition-all mt-2", children: loading ? _jsx("span", { children: "Creating account..." }) : _jsxs(_Fragment, { children: [_jsx("span", { children: "Sign Up" }), _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] }), _jsxs("div", { className: "pt-3 border-t border-night-800 text-center text-xs text-slate-400", children: ["Already registered?", ' ', _jsx(Link, { to: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`, className: "text-craving-400 font-bold hover:underline", children: "Sign In" })] })] })] }));
};
