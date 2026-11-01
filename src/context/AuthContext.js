import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, clearAuthToken, setAuthToken } from '../services/api';
import { reconnectSocketWithToken } from '../services/socket';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchCurrentUser = async () => {
        try {
            const storedRole = localStorage.getItem('lnc_role');
            if (!localStorage.getItem('lnc_token')) {
                setIsLoading(false);
                return;
            }
            const data = await apiRequest('/auth/me');
            if (data.success && data.user) {
                if (data.user.role === 'admin') {
                    setAdmin(data.user);
                    setRole('admin');
                }
                else {
                    setUser(data.user);
                    setRole('customer');
                }
            }
        }
        catch (err) {
            clearAuthToken();
            setUser(null);
            setAdmin(null);
            setRole(null);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCurrentUser();
    }, []);
    const loginCustomerHandler = async (phoneOrEmail, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phoneOrEmail, password }),
        });
        if (data.success && data.token) {
            setAuthToken(data.token);
            localStorage.setItem('lnc_role', 'customer');
            setUser(data.user);
            setRole('customer');
            reconnectSocketWithToken();
        }
    };
    const registerCustomerHandler = async (name, phone, password, email) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, phone, password, email }),
        });
        if (data.success && data.token) {
            setAuthToken(data.token);
            localStorage.setItem('lnc_role', 'customer');
            setUser(data.user);
            setRole('customer');
            reconnectSocketWithToken();
        }
    };
    const loginAdminHandler = async (email, password) => {
        const data = await apiRequest('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.success && data.token) {
            setAuthToken(data.token);
            localStorage.setItem('lnc_role', 'admin');
            setAdmin(data.admin);
            setRole('admin');
            reconnectSocketWithToken();
        }
    };
    const logoutHandler = () => {
        clearAuthToken();
        setUser(null);
        setAdmin(null);
        setRole(null);
        reconnectSocketWithToken();
    };
    const addAddressHandler = async (addrData) => {
        const data = await apiRequest('/auth/addresses', {
            method: 'POST',
            body: JSON.stringify(addrData),
        });
        if (data.success && user) {
            setUser({ ...user, addresses: data.addresses });
        }
    };
    const deleteAddressHandler = async (addressId) => {
        const data = await apiRequest(`/auth/addresses/${addressId}`, {
            method: 'DELETE',
        });
        if (data.success && user) {
            setUser({ ...user, addresses: data.addresses });
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            admin,
            role,
            isLoading,
            loginCustomer: loginCustomerHandler,
            registerCustomer: registerCustomerHandler,
            loginAdmin: loginAdminHandler,
            logout: logoutHandler,
            refreshUser: fetchCurrentUser,
            addAddress: addAddressHandler,
            deleteAddress: deleteAddressHandler,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
