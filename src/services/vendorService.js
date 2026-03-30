import API from './api';

export const vendorService = {
  getOrders:       ()             => API.get('/vendor/orders'),
  getStats:        ()             => API.get('/vendor/stats'),
  updateOrderStatus: (id, data)   => API.put(`/vendor/orders/${id}/status`, data),
  getMyStore:      ()             => API.get('/vendor/store'),
};
