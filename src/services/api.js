import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  withCredentials: false,
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
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem('fasomarket_token');
      localStorage.removeItem('fasomarket_user');
      window.location.href = '/login';
    }

    if (status === 400) {
      error.userMessage = message || 'Données invalides';
    }

    if (status === 403) {
      error.userMessage = message || 'Accès refusé';
    }

    if (status === 500) {
      error.userMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    }

    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Délai d\'attente dépassé. Vérifiez votre connexion.';
    }

    if (!error.response) {
      error.userMessage = 'Erreur réseau. Vérifiez votre connexion.';
    }

    return Promise.reject(error);
  }
);

export default API;
