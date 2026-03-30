import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useProductUpdates = (onProductUpdate, onProductDelete) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleProductUpdate = (data) => {
      console.log('📦 Produit mis à jour:', data.product);
      if (onProductUpdate) {
        onProductUpdate(data.product);
      }
    };

    const handleProductDelete = (data) => {
      console.log('🗑️ Produit supprimé:', data.productId);
      if (onProductDelete) {
        onProductDelete(data.productId);
      }
    };

    socket.on('product:updated', handleProductUpdate);
    socket.on('product:deleted', handleProductDelete);

    return () => {
      socket.off('product:updated', handleProductUpdate);
      socket.off('product:deleted', handleProductDelete);
    };
  }, [socket, onProductUpdate, onProductDelete]);
};
