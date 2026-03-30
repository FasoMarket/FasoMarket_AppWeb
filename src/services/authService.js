import API from './api';

export const authService = {
  register:        (data)         => API.post('/auth/register', data),
  login:           (data)         => API.post('/auth/login', data),
  getProfile:      ()             => API.get('/auth/profile'),
  updateProfile:   (formData)     => API.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword:  (data)         => API.put('/auth/change-password', data),
  logout:          ()             => { localStorage.removeItem('fasomarket_token'); localStorage.removeItem('fasomarket_user'); },
  saveSession:     (token, user)  => { 
    if (import.meta.env.DEV) console.log('💾 Saving session:', user);
    localStorage.setItem('fasomarket_token', token); 
    localStorage.setItem('fasomarket_user', JSON.stringify(user));
    if (import.meta.env.DEV) console.log('✅ Session saved:', localStorage.getItem('fasomarket_user'));
  },
  getUser:         ()             => {
    const user = JSON.parse(localStorage.getItem('fasomarket_user') || 'null');
    if (import.meta.env.DEV) console.log('📖 Getting user:', user);
    return user;
  },
  isLoggedIn:      ()             => !!localStorage.getItem('fasomarket_token'),
  getToken:        ()             => localStorage.getItem('fasomarket_token'),
  getRole:         ()             => JSON.parse(localStorage.getItem('fasomarket_user') || '{}')?.role,
};
