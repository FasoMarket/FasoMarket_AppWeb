import API from './api';

export const orderService = {
  create:          (data)         => API.post('/orders', data),
  getMyOrders:     ()             => API.get('/orders/my-orders'),
  getById:         (id)           => API.get(`/orders/${id}`),
  cancel:          (id)           => API.put(`/orders/${id}/cancel`),
};
