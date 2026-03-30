import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const usePromotionUpdates = (onPromotionCreated, onPromotionUpdated, onPromotionDeleted) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handlePromotionCreated = (data) => {
      console.log('🎉 Promotion créée:', data.promotion);
      if (onPromotionCreated) {
        onPromotionCreated(data.promotion);
      }
    };

    const handlePromotionUpdated = (data) => {
      console.log('✏️ Promotion mise à jour:', data.promotion);
      if (onPromotionUpdated) {
        onPromotionUpdated(data.promotion);
      }
    };

    const handlePromotionDeleted = (data) => {
      console.log('🗑️ Promotion supprimée:', data.promotionId);
      if (onPromotionDeleted) {
        onPromotionDeleted(data.promotionId);
      }
    };

    socket.on('promotion:created', handlePromotionCreated);
    socket.on('promotion:updated', handlePromotionUpdated);
    socket.on('promotion:deleted', handlePromotionDeleted);

    return () => {
      socket.off('promotion:created', handlePromotionCreated);
      socket.off('promotion:updated', handlePromotionUpdated);
      socket.off('promotion:deleted', handlePromotionDeleted);
    };
  }, [socket, onPromotionCreated, onPromotionUpdated, onPromotionDeleted]);
};
