import API from './api';

export const adminAdvancedService = {
  // Bannières
  getBanners:       ()          => API.get('/admin/banners'),
  createBanner:     (fd)        => API.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner:     (id, fd)    => API.put(`/admin/banners/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBanner:     (id)        => API.delete(`/admin/banners/${id}`),
  toggleBanner:     (id)        => API.patch(`/admin/banners/${id}/toggle`),

  // En vedette
  getFeatured:      ()          => API.get('/admin/featured'),
  addFeatured:      (data)      => API.post('/admin/featured', data),
  removeFeatured:   (id)        => API.delete(`/admin/featured/${id}`),

  // Codes promo
  getPromoCodes:    ()          => API.get('/admin/promo-codes'),
  createPromoCode:  (data)      => API.post('/admin/promo-codes', data),
  updatePromoCode:  (id, data)  => API.put(`/admin/promo-codes/${id}`, data),
  deletePromoCode:  (id)        => API.delete(`/admin/promo-codes/${id}`),
  togglePromoCode:  (id)        => API.patch(`/admin/promo-codes/${id}/toggle`),

  // Litiges
  getDisputes:      (status)    => API.get('/admin/disputes', { params: { status } }),
  getDisputeDetail: (id)        => API.get(`/admin/disputes/${id}`),
  resolveDispute:   (id, data)  => API.put(`/admin/disputes/${id}/resolve`, data),
  closeDispute:     (id)        => API.put(`/admin/disputes/${id}/close`),

  // Remboursements
  getRefunds:       ()          => API.get('/admin/refunds'),
  approveRefund:    (id, data)  => API.put(`/admin/refunds/${id}/approve`, data),
  rejectRefund:     (id, data)  => API.put(`/admin/refunds/${id}/reject`, data),

  // Communication
  getAnnouncements: ()          => API.get('/admin/announcements'),
  sendAnnouncement: (data)      => API.post('/admin/announcements/send', data),

  // Analytiques
  getOverview:      ()          => API.get('/admin/analytics/overview'),
  getRevenueChart:  (period)    => API.get('/admin/analytics/revenue', { params: { period } }),
  getTopProducts:   ()          => API.get('/admin/analytics/top-products'),
  getTopVendors:    ()          => API.get('/admin/analytics/top-vendors'),
  getOrdersByStatus:()          => API.get('/admin/analytics/orders-by-status'),
  getUsersGrowth:   ()          => API.get('/admin/analytics/users-growth'),
  getFinancialReport:(dates)    => API.get('/admin/analytics/financial', { params: dates }),
};
