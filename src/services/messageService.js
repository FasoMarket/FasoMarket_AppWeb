import API from './api';
export const messageService = {
  createOrGetConversation: (data)          => API.post('/messages/conversation', data),
  getConversations:        ()              => API.get('/messages/conversations'),
  getMessages:             (convId, p={})  => API.get(`/messages/${convId}`, { params: p }),
  sendMessage:             (data)          => API.post('/messages', data), // fallback HTTP
  markAsRead:              (convId)        => API.put(`/messages/${convId}/read`),
  deleteConversation:      (convId)        => API.delete(`/messages/${convId}`),
  sendFile:                (convId, formData) => API.post(`/messages/${convId}/file`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
