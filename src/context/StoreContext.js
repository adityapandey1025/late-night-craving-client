import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { getSocket } from '../services/socket';
const StoreContext = createContext(undefined);
export const StoreProvider = ({ children }) => {
    const [storeStatus, setStoreStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchStatus = async () => {
        try {
            const data = await apiRequest('/store/status');
            if (data.success) {
                setStoreStatus({
                    orderingEnabled: data.orderingEnabled,
                    message: data.message,
                    admins: data.admins,
                });
            }
        }
        catch (err) {
            console.error('Failed to load store status:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchStatus();
        const socket = getSocket();
        const handleAvailabilityUpdate = (payload) => {
            setStoreStatus((prev) => ({
                orderingEnabled: payload.orderingEnabled,
                message: payload.orderingEnabled
                    ? 'Store is open for late-night delivery!'
                    : 'All administrators are currently offline. Ordering is temporarily closed.',
                admins: payload.admins,
            }));
        };
        socket.on('store:availability_updated', handleAvailabilityUpdate);
        return () => {
            socket.off('store:availability_updated', handleAvailabilityUpdate);
        };
    }, []);
    return (_jsx(StoreContext.Provider, { value: { storeStatus, isLoading, refreshStatus: fetchStatus }, children: children }));
};
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context)
        throw new Error('useStore must be used within a StoreProvider');
    return context;
};
