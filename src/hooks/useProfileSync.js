import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import API from '../services/api';

/**
 * Hook pour synchroniser le profil utilisateur
 * Récupère les données à jour du serveur et met à jour le contexte
 */
export const useProfileSync = () => {
  const { user, setUser } = useAuth();

  const syncProfile = async () => {
    try {
      if (!authService.isLoggedIn()) return;

      const response = await API.get('/auth/profile');
      const updatedUser = response.data;

      // Mettre à jour le contexte et le localStorage
      authService.saveSession(authService.getToken(), updatedUser);
      
      // Mettre à jour le contexte (si setUser est disponible)
      if (setUser) {
        setUser(updatedUser);
      }

      console.log('✅ Profil synchronisé:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('❌ Erreur synchronisation profil:', error);
    }
  };

  // Synchroniser au montage du composant
  useEffect(() => {
    syncProfile();
  }, []);

  return { syncProfile };
};

/**
 * Hook pour mettre à jour l'avatar
 */
export const useAvatarUpdate = () => {
  const { user } = useAuth();
  const { syncProfile } = useProfileSync();

  const updateAvatar = async (newAvatarUrl) => {
    try {
      // Mettre à jour localement d'abord
      const updatedUser = { ...user, avatar: newAvatarUrl };
      authService.saveSession(authService.getToken(), updatedUser);

      // Synchroniser avec le serveur
      await syncProfile();

      console.log('✅ Avatar mis à jour:', newAvatarUrl);
      return updatedUser;
    } catch (error) {
      console.error('❌ Erreur mise à jour avatar:', error);
      throw error;
    }
  };

  return { updateAvatar };
};
