import API from './api';
export const notificationService = {
  getAll:         (params = {}) => API.get('/notifications', { params }),
  getUnreadCount: ()            => API.get('/notifications/unread-count'),
  markOneRead:    (id)          => API.put(`/notifications/${id}/read`),
  markAllRead:    ()            => API.put('/notifications/read-all'),
  deleteOne:      (id)          => API.delete(`/notifications/${id}`),
  deleteAll:      ()            => API.delete('/notifications'),
};
