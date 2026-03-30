import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useOfferUpdates = (onOfferCreated, onOfferSent, onOfferDeleted) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleOfferCreated = (data) => {
      console.log('🎁 Offre créée:', data.offer);
      if (onOfferCreated) {
        onOfferCreated(data.offer);
      }
    };

    const handleOfferSent = (data) => {
      console.log('📤 Offre envoyée:', data.offer);
      if (onOfferSent) {
        onOfferSent(data.offer);
      }
    };

    const handleOfferDeleted = (data) => {
      console.log('🗑️ Offre supprimée:', data.offerId);
      if (onOfferDeleted) {
        onOfferDeleted(data.offerId);
      }
    };

    socket.on('offer:created', handleOfferCreated);
    socket.on('offer:sent', handleOfferSent);
    socket.on('offer:deleted', handleOfferDeleted);

    return () => {
      socket.off('offer:created', handleOfferCreated);
      socket.off('offer:sent', handleOfferSent);
      socket.off('offer:deleted', handleOfferDeleted);
    };
  }, [socket, onOfferCreated, onOfferSent, onOfferDeleted]);
};
