import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Injecte automatiquement le token JWT sur chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fasomarket_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gère les erreurs globales
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fasomarket_token');
      localStorage.removeItem('fasomarket_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
