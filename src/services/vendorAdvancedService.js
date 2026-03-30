import API from './api';

export const vendorAdvancedService = {
  // Produits avancés
  addProductImages:    (id, fd)        => API.post(`/vendor/products/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProductImage:  (id, imageUrl)  => API.delete(`/vendor/products/${id}/images`, { data: { imageUrl } }),
  updateStock:         (id, data)      => API.patch(`/vendor/products/${id}/stock`, data),
  setPromotion:        (id, data)      => API.patch(`/vendor/products/${id}/promotion`, data),
  getLowStock:         ()              => API.get('/vendor/products/low-stock'),

  // Collections
  getCollections:      ()              => API.get('/vendor/collections'),
  createCollection:    (data)          => API.post('/vendor/collections', data),
  updateCollection:    (id, data)      => API.put(`/vendor/collections/${id}`, data),
  deleteCollection:    (id)            => API.delete(`/vendor/collections/${id}`),
  addToCollection:     (id, productId) => API.post(`/vendor/collections/${id}/products`, { productId }),
  removeFromCollection:(id, productId) => API.delete(`/vendor/collections/${id}/products/${productId}`),

  // Promotions
  getPromotions:       ()              => API.get('/vendor/promotions'),
  createPromotion:     (data)          => API.post('/vendor/promotions', data),
  updatePromotion:     (id, data)      => API.put(`/vendor/promotions/${id}`, data),
  deletePromotion:     (id)            => API.delete(`/vendor/promotions/${id}`),
  togglePromotion:     (id)            => API.patch(`/vendor/promotions/${id}/toggle`),

  // Codes Promo
  getPromoCodes:       ()              => API.get('/vendor/promo-codes'),
  createPromoCode:     (data)          => API.post('/vendor/promo-codes', data),
  updatePromoCode:     (id, data)      => API.put(`/vendor/promo-codes/${id}`, data),
  deletePromoCode:     (id)            => API.delete(`/vendor/promo-codes/${id}`),

  // Commandes
  getOrders:           (params)        => API.get('/vendor/orders-advanced', { params }),
  getOrderDetail:      (id)            => API.get(`/vendor/orders-advanced/${id}`),
  updateOrderStatus:   (id, status)    => API.put(`/vendor/orders-advanced/${id}/status`, { status }),

  // Avis
  getReviews:          (params)        => API.get('/vendor/reviews', { params }),
  replyToReview:       (id, reply)     => API.post(`/vendor/reviews/${id}/reply`, { reply }),
  getReviewStats:      ()              => API.get('/vendor/reviews/stats'),

  // Analytiques
  getOverview:         ()              => API.get('/vendor/analytics/overview'),
  getRevenueChart:     (period)        => API.get('/vendor/analytics/revenue', { params: { period } }),
  getTopProducts:      ()              => API.get('/vendor/analytics/top-products'),
  getOrdersTrend:      ()              => API.get('/vendor/analytics/orders-trend'),

  // Finances
  getFinancialSummary: (dates)         => API.get('/vendor/finances/summary', { params: dates }),
  getPaymentHistory:   (params)        => API.get('/vendor/finances/history', { params }),

  // Boutique
  getMyStore:          ()              => API.get('/stores/my-store'),
};
