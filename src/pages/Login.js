import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Moon, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Login = () => {
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const { loginCustomer } = useAuth();
    const navigate = useNavigate();
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        try {
            await loginCustomer(phoneOrEmail.trim(), password);
            navigate(redirect);
        }
        catch (err) {
            setErrorMsg(err.message || 'Invalid credentials. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto py-12 px-4 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-craving-600 to-amber-400 mx-auto flex items-center justify-center shadow-glow-orange", children: _jsx(Moon, { className: "w-6 h-6 text-night-950 fill-night-950" }) }), _jsx("h1", { className: "text-2xl font-black text-white", children: "Welcome Back Craver" }), _jsx("p", { className: "text-xs text-slate-400", children: "Log in to track orders and checkout in seconds." })] }), _jsxs("div", { className: "p-6 rounded-3xl bg-night-900 border border-night-750 shadow-xl space-y-4", children: [errorMsg && (_jsxs("div", { className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 flex-shrink-0 text-rose-400" }), _jsx("span", { children: errorMsg })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Phone Number or Email" }), _jsx("input", { type: "text", value: phoneOrEmail, onChange: (e) => setPhoneOrEmail(e.target.value), placeholder: "+91 98765 43210 or your email", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-300 block mb-1", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full bg-night-950 border border-night-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-craving-500", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-craving-500 hover:bg-craving-600 text-white font-black text-xs shadow-glow-orange flex items-center justify-center gap-2 transition-all mt-2", children: loading ? _jsx("span", { children: "Authenticating..." }) : _jsxs(_Fragment, { children: [_jsx("span", { children: "Log In" }), _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] }), _jsxs("div", { className: "pt-3 border-t border-night-800 text-center text-xs text-slate-400", children: ["Don't have an account yet?", ' ', _jsx(Link, { to: `/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`, className: "text-craving-400 font-bold hover:underline", children: "Create account" })] })] }), _jsx("div", { className: "text-center", children: _jsxs(Link, { to: "/admin/login", className: "inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors", children: [_jsx(Shield, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Administrator Access (Aditya & Amlesh)" })] }) })] }));
};
