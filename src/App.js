import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { AdminHeader } from './components/AdminHeader';
// Customer Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { MyOrders } from './pages/MyOrders';
import { ProfilePage } from './pages/ProfilePage';
import { LocationsPage } from './pages/LocationsPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminLocations } from './pages/admin/AdminLocations';
import { AdminProfile } from './pages/admin/AdminProfile';
// Guard for Admin routes
const RequireAdmin = ({ children }) => {
    const { role, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" }) }));
    }
    if (role !== 'admin') {
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
const AppLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-night-950 text-slate-100 font-sans selection:bg-craving-500 selection:text-white", children: [isAdminRoute ? _jsx(AdminHeader, {}) : _jsx(Navbar, {}), _jsx("main", { className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/products", element: _jsx(Products, {}) }), _jsx(Route, { path: "/locations", element: _jsx(LocationsPage, {}) }), _jsx(Route, { path: "/checkout", element: _jsx(Checkout, {}) }), _jsx(Route, { path: "/order/:id", element: _jsx(OrderTracking, {}) }), _jsx(Route, { path: "/my-orders", element: _jsx(MyOrders, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(RequireAdmin, { children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/orders", element: _jsx(RequireAdmin, { children: _jsx(AdminOrders, {}) }) }), _jsx(Route, { path: "/admin/payments", element: _jsx(RequireAdmin, { children: _jsx(AdminPayments, {}) }) }), _jsx(Route, { path: "/admin/products", element: _jsx(RequireAdmin, { children: _jsx(AdminProducts, {}) }) }), _jsx(Route, { path: "/admin/locations", element: _jsx(RequireAdmin, { children: _jsx(AdminLocations, {}) }) }), _jsx(Route, { path: "/admin/profile", element: _jsx(RequireAdmin, { children: _jsx(AdminProfile, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx(CartDrawer, {}), _jsx(BottomNav, {}), !isAdminRoute && (_jsx("footer", { className: "border-t border-night-800/80 bg-night-950 py-8 px-4 text-center text-xs text-slate-500 mb-14 sm:mb-0", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-2", children: [_jsx("p", { className: "font-bold text-slate-400", children: "lateNightCraving \u2014 Your late-night cravings, delivered." }), _jsx("p", { className: "text-[11px] text-slate-500", children: "Hyperlocal midnight food & essentials ordering platform. Founded and operated by Aditya & Amlesh." }), _jsxs("p", { className: "text-[10px] text-slate-600 pt-2", children: ["\u00A9 ", new Date().getFullYear(), " lateNightCraving. All rights reserved."] })] }) }))] }));
};
export const App = () => {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(StoreProvider, { children: _jsx(CartProvider, { children: _jsx(AppLayout, {}) }) }) }) }));
};
export default App;
