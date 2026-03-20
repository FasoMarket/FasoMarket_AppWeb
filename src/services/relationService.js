import API from './api';

export const relationService = {
  // Vendeur → Client
  getMyBuyers:         (filter)      => API.get('/vendor/buyers', { params: { filter } }),
  getMyOffers:         ()            => API.get('/vendor/offers'),
  createOffer:         (data)        => API.post('/vendor/offers', data),
  sendOffer:           (id)          => API.post(`/vendor/offers/${id}/send`),
  deleteOffer:         (id)          => API.delete(`/vendor/offers/${id}`),

  // Wallet Vendeur
  getMyWallet:         ()            => API.get('/vendor/wallet'),
  getMyPayouts:        ()            => API.get('/vendor/payouts'),
  updatePaymentInfo:   (data)        => API.put('/vendor/wallet/payment-info', data),

  // Admin → Vendeur (paiements)
  getAllPayouts:        (params)      => API.get('/admin/payouts', { params }),
  getPendingPayouts:   ()            => API.get('/admin/payouts/pending'),
  getVendorWallet:     (vendorId)    => API.get(`/admin/vendors/${vendorId}/wallet`),
  getVendorEarnings:   (vendorId, p) => API.get(`/admin/vendors/${vendorId}/earnings`, { params: p }),
  processPayout:       (data)        => API.post('/admin/payouts', data),
  confirmPayout:       (id)          => API.put(`/admin/payouts/${id}/confirm`),
  failPayout:          (id)          => API.put(`/admin/payouts/${id}/fail`),

  // Social Client → Client
  getProductSocialProof: (productId) => API.get(`/social/product/${productId}`),
  getTrendingProducts:   ()          => API.get('/social/recommendations/trending'),
  updateSocialPrivacy:   (isPublic)  => API.put('/social/privacy', { isPublic }),
};
