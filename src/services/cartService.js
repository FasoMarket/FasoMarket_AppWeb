import API from './api';
import { authService } from './authService';

const CART_KEY = 'fasomarket_guest_cart';

const getGuestCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; } 
  catch { return { items: [] }; }
};
const saveGuestCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

export const cartService = {
  syncCart: async () => {
    if (!authService.isLoggedIn()) return;
    const cart = getGuestCart();
    if (cart.items.length > 0) {
      for (const item of cart.items) {
        try { await API.post('/cart', { productId: item.product._id, quantity: item.quantity }); } catch(err) {}
      }
      localStorage.removeItem(CART_KEY);
    }
  },

  getCart: async () => {
    if (authService.isLoggedIn()) return API.get('/cart');
    return { data: getGuestCart() };
  },

  addItem: async (data, productObj) => {
    if (authService.isLoggedIn()) return API.post('/cart', data);
    const cart = getGuestCart();
    const existing = cart.items.find(i => i.product._id === data.productId);
    if (existing) {
      existing.quantity += data.quantity;
    } else {
      cart.items.push({ 
        product: productObj || { _id: data.productId, name: 'Produit (Hors ligne)', price: 0 }, 
        quantity: data.quantity, 
        price: productObj?.price || 0 
      });
    }
    saveGuestCart(cart);
    return { data: cart };
  },

  updateItem: async (productId, data) => {
    if (authService.isLoggedIn()) return API.put(`/cart/${productId}`, data);
    const cart = getGuestCart();
    const item = cart.items.find(i => i.product._id === productId);
    if (item) {
      if (data.quantity <= 0) cart.items = cart.items.filter(i => i.product._id !== productId);
      else item.quantity = data.quantity;
      saveGuestCart(cart);
    }
    return { data: cart };
  },

  removeItem: async (productId) => {
    if (authService.isLoggedIn()) return API.delete(`/cart/${productId}`);
    const cart = getGuestCart();
    cart.items = cart.items.filter(i => i.product._id !== productId);
    saveGuestCart(cart);
    return { data: cart };
  },

  clearCart: async () => {
    if (authService.isLoggedIn()) return API.delete('/cart');
    localStorage.removeItem(CART_KEY);
    return { data: { message: 'Panier vidé' } };
  }
};
