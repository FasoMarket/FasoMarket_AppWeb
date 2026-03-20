import API from './api';

export const authService = {
  register:        (data)         => API.post('/auth/register', data),
  login:           (data)         => API.post('/auth/login', data),
  getProfile:      ()             => API.get('/auth/profile'),
  updateProfile:   (formData)     => API.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword:  (data)         => API.put('/auth/change-password', data),
  logout:          ()             => { localStorage.removeItem('fasomarket_token'); localStorage.removeItem('fasomarket_user'); },
  saveSession:     (token, user)  => { localStorage.setItem('fasomarket_token', token); localStorage.setItem('fasomarket_user', JSON.stringify(user)); },
  getUser:         ()             => JSON.parse(localStorage.getItem('fasomarket_user') || 'null'),
  isLoggedIn:      ()             => !!localStorage.getItem('fasomarket_token'),
  getToken:        ()             => localStorage.getItem('fasomarket_token'),
  getRole:         ()             => JSON.parse(localStorage.getItem('fasomarket_user') || '{}')?.role,
};
