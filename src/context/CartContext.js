import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
const CartContext = createContext(undefined);
const CART_STORAGE_KEY = 'lnc_cart_v1';
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        }
        catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
        catch (err) {
            console.error('Failed to save cart to storage:', err);
        }
    }, [cart]);
    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.product._id === product._id);
            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + quantity,
                };
                return next;
            }
            return [...prev, { product, quantity }];
        });
    };
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.product._id !== productId));
    };
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) => prev.map((item) => item.product._id === productId ? { ...item, quantity } : item));
    };
    const clearCart = () => {
        setCart([]);
    };
    const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Calculate bill client-side using spec integer paise rules
    const calculateBill = () => {
        let productSubtotal = 0;
        let onlineAdvanceRequired = 0;
        const items = cart.map((item) => {
            const quantityMultiplier = item.quantity <= 1 ? 1 : 1 + (item.quantity - 1) * 1.5;
            const itemTotal = Math.round(item.product.sellingPrice * quantityMultiplier);
            productSubtotal += itemTotal;
            let advanceRequired = 0;
            if (item.product.paymentPolicy === 'FULL_PAYMENT') {
                advanceRequired = itemTotal;
            }
            else if (item.product.paymentPolicy === 'PARTIAL_PAYMENT') {
                const pct = item.product.partialPaymentPercentage ?? 40;
                advanceRequired = Math.round((itemTotal * pct) / 100);
            }
            else {
                advanceRequired = 0;
            }
            onlineAdvanceRequired += advanceRequired;
            return {
                productId: item.product._id,
                name: item.product.name,
                price: item.product.sellingPrice,
                quantity: item.quantity,
                productType: item.product.productType,
                paymentPolicy: item.product.paymentPolicy,
                itemTotal,
                advanceRequired,
            };
        });
        // Delivery fee rule:
        // < 9900 paise: 3000 paise (₹30)
        // 9900 - 14999 paise: 4000 paise (₹40)
        // >= 15000 paise: 6000 paise (₹60)
        let deliveryFee = 0;
        if (productSubtotal > 0) {
            if (productSubtotal < 9900) {
                deliveryFee = 3000;
            }
            else if (productSubtotal < 15000) {
                deliveryFee = 4000;
            }
            else {
                deliveryFee = 6000;
            }
        }
        const fastFoodSurcharge = 0; // automatic quantity multiplier is included in productSubtotal
        const orderTotal = productSubtotal + deliveryFee + fastFoodSurcharge;
        const remainingBalance = Math.max(0, orderTotal - onlineAdvanceRequired);
        return {
            productSubtotal,
            deliveryFee,
            fastFoodSurcharge,
            orderTotal,
            onlineAdvanceRequired,
            remainingBalance,
            items,
        };
    };
    const bill = calculateBill();
    return (_jsx(CartContext.Provider, { value: {
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItemCount,
            bill,
            isCartOpen,
            setIsCartOpen,
        }, children: children }));
};
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context)
        throw new Error('useCart must be used within a CartProvider');
    return context;
};
