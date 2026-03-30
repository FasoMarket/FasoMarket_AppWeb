/**
 * Configuration des URLs selon l'environnement
 */

export const getAdminUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5174';
  }
  return 'https://admin.fasomarket.com';
};

export const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return 'https://api.fasomarket.com/api';
};

export const getClientUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5173';
  }
  return 'https://fasomarket.com';
};
