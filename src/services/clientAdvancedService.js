import API from './api';

export const clientAdvancedService = {
  // Favoris
  getWishlist:        ()             => API.get('/wishlist'),
  addToWishlist:      (productId)    => API.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId)    => API.delete(`/wishlist/${productId}`),
  checkWishlist:      (productId)    => API.get(`/wishlist/${productId}/status`),

  // Historique
  addToHistory:       (productId)    => API.post(`/history/${productId}`),
  getHistory:         ()             => API.get('/history'),
  clearHistory:       ()             => API.delete('/history'),

  // Adresses
  getAddresses:       ()             => API.get('/addresses'),
  createAddress:      (data)         => API.post('/addresses', data),
  updateAddress:      (id, data)     => API.put(`/addresses/${id}`, data),
  deleteAddress:      (id)           => API.delete(`/addresses/${id}`),
  setDefaultAddress:  (id)           => API.patch(`/addresses/${id}/default`),

  // Commandes
  getMyOrders:        (params)       => API.get('/orders/my-orders', { params }),
  getOrderDetail:     (id)           => API.get(`/orders/${id}`),
  getOrderTimeline:   (id)           => API.get(`/orders/${id}/timeline`),
  cancelOrder:        (id)           => API.put(`/orders/${id}/cancel`),
  downloadInvoice:    (id)           => API.get(`/orders/${id}/invoice`, { responseType: 'blob' }),

  // Litiges
  openDispute:        (data)         => API.post('/disputes', data),
  getMyDisputes:      ()             => API.get('/disputes/my-disputes'),
  getDisputeDetail:   (id)           => API.get(`/disputes/${id}`),

  // Remboursements
  requestRefund:      (data)         => API.post('/refunds', data),
  getMyRefunds:       ()             => API.get('/refunds/my-refunds'),

  // Avis
  createReview:       (data)         => API.post('/client-reviews', data),
  getMyReviews:       ()             => API.get('/reviews/my-reviews'),
  updateReview:       (id, data)     => API.put(`/reviews/${id}`, data),
  deleteReview:       (id)           => API.delete(`/reviews/${id}`),
  getProductReviews:  (productId)    => API.get(`/reviews/product/${productId}`),

  // Signalement
  reportProduct:      (data)         => API.post('/reports', data),

  // Code promo
  validatePromoCode:  (code, amount) => API.post('/promo-codes/validate', { code, orderAmount: amount }),

  // Stats
  getClientStats:     ()             => API.get('/client/stats'),
  getRecommendations: ()             => API.get('/client/recommendations'),

  // Préférences
  updateNotifPrefs:   (data)         => API.put('/auth/notification-prefs', data),
};
