import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useCategoryUpdates = (onCategoryCreated, onCategoryUpdated) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Écouter les nouvelles catégories créées
    socket.on('category:created', (data) => {
      console.log('📂 Nouvelle catégorie reçue:', data.category);
      if (onCategoryCreated) {
        onCategoryCreated(data.category);
      }
    });

    // Écouter les mises à jour de catégories
    socket.on('category:updated', (data) => {
      console.log('📂 Catégorie mise à jour:', data.category);
      if (onCategoryUpdated) {
        onCategoryUpdated(data.category);
      }
    });

    return () => {
      socket.off('category:created');
      socket.off('category:updated');
    };
  }, [socket, onCategoryCreated, onCategoryUpdated]);
};
