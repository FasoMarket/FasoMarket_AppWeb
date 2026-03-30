import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        try {
            const res = await cartService.getCart();
            setCart(res.data);
            // Persistent cache for logged-in users to avoid "empty cart" flash on refresh
            if (authService.isLoggedIn()) {
                localStorage.setItem('fasomarket_cart_cache', JSON.stringify(res.data));
            }
        } catch (err) {
            if (import.meta.env.DEV) console.error('Error fetching cart:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initialize from cache if available
    useEffect(() => {
        const cache = localStorage.getItem('fasomarket_cart_cache');
        if (cache && authService.isLoggedIn()) {
            try {
                setCart(JSON.parse(cache));
                setLoading(false);
            } catch (e) {
                localStorage.removeItem('fasomarket_cart_cache');
            }
        }
        fetchCart();
    }, []);

    // Refresh cart when login status changes
    useEffect(() => {
        const handleAuthChange = () => {
            fetchCart();
        };
        window.addEventListener('storage', handleAuthChange);
        return () => window.removeEventListener('storage', handleAuthChange);
    }, []);

    const addToCart = async (productId, quantity, productObj) => {
        try {
            const res = await cartService.addItem({ productId, quantity }, productObj);
            setCart(res.data);
            if (authService.isLoggedIn()) {
                localStorage.setItem('fasomarket_cart_cache', JSON.stringify(res.data));
            }
            return res.data;
        } catch (err) {
            if (import.meta.env.DEV) console.error('Error adding to cart:', err);
            throw err;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await cartService.updateItem(productId, { quantity });
            setCart(res.data);
            if (authService.isLoggedIn()) {
                localStorage.setItem('fasomarket_cart_cache', JSON.stringify(res.data));
            }
        } catch (err) {
            if (import.meta.env.DEV) console.error('Error updating quantity:', err);
        }
    };

    const removeItem = async (productId) => {
        try {
            const res = await cartService.removeItem(productId);
            setCart(res.data);
            if (authService.isLoggedIn()) {
                localStorage.setItem('fasomarket_cart_cache', JSON.stringify(res.data));
            }
        } catch (err) {
            if (import.meta.env.DEV) console.error('Error removing item:', err);
        }
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            const emptyCart = { items: [] };
            setCart(emptyCart);
            localStorage.removeItem('fasomarket_cart_cache');
        } catch (err) {
            if (import.meta.env.DEV) console.error('Error clearing cart:', err);
        }
    };

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ 
            cart, 
            loading, 
            error, 
            fetchCart, 
            addToCart, 
            updateQuantity, 
            removeItem, 
            clearCart,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
