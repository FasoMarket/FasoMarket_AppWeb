import API from './api';

export const paymentService = {
  mobileMoney:     (data)         => API.post('/payments/mobile-money', data),
};
