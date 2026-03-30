import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useCollectionUpdates = (onCollectionCreated, onCollectionUpdated, onCollectionDeleted) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleCollectionCreated = (data) => {
      console.log('📚 Collection créée:', data.collection);
      if (onCollectionCreated) {
        onCollectionCreated(data.collection);
      }
    };

    const handleCollectionUpdated = (data) => {
      console.log('✏️ Collection mise à jour:', data.collection);
      if (onCollectionUpdated) {
        onCollectionUpdated(data.collection);
      }
    };

    const handleCollectionDeleted = (data) => {
      console.log('🗑️ Collection supprimée:', data.collectionId);
      if (onCollectionDeleted) {
        onCollectionDeleted(data.collectionId);
      }
    };

    socket.on('collection:created', handleCollectionCreated);
    socket.on('collection:updated', handleCollectionUpdated);
    socket.on('collection:deleted', handleCollectionDeleted);

    return () => {
      socket.off('collection:created', handleCollectionCreated);
      socket.off('collection:updated', handleCollectionUpdated);
      socket.off('collection:deleted', handleCollectionDeleted);
    };
  }, [socket, onCollectionCreated, onCollectionUpdated, onCollectionDeleted]);
};
