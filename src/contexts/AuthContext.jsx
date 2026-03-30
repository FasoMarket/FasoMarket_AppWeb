import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialiser l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getUser();
      if (storedUser && authService.isLoggedIn()) {
        setUser(storedUser);
        try {
          // Rafraîchir le profil pour synchroniser les changements (ex: validation vendeur)
          const res = await authService.getProfile();
          const userData = res.data.user || res.data;
          setUser(userData);
          authService.saveSession(authService.getToken(), userData);
        } catch (err) {
          console.error('Erreur rafraîchissement profil:', err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await authService.login({ email, password });
      const { token, user: userData } = res.data;
      
      authService.saveSession(token, userData);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erreur de connexion';
      setError(message);
      throw err;
    }
  };

  const register = async (data) => {
    try {
      setError(null);
      const res = await authService.register(data);
      const { token, user: userData } = res.data;
      
      authService.saveSession(token, userData);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erreur d\'inscription';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (formData) => {
    try {
      const res = await authService.updateProfile(formData);
      setUser(res.data);
      authService.saveSession(authService.getToken(), res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isVendor: user?.role === 'vendor',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
