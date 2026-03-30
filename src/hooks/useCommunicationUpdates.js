import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useCommunicationUpdates = (onUpdate) => {
  const socketContext = useSocket();
  const socket = socketContext?.socket;

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return;

    const handleCommunicationCreated = (data) => {
      onUpdate({ type: 'created', communication: data.communication });
    };

    const handleCommunicationUpdated = (data) => {
      onUpdate({ type: 'updated', communication: data.communication });
    };

    const handleCommunicationDeleted = (data) => {
      onUpdate({ type: 'deleted', communicationId: data.communicationId });
    };

    socket.on('communication:created', handleCommunicationCreated);
    socket.on('communication:updated', handleCommunicationUpdated);
    socket.on('communication:deleted', handleCommunicationDeleted);

    return () => {
      socket.off('communication:created', handleCommunicationCreated);
      socket.off('communication:updated', handleCommunicationUpdated);
      socket.off('communication:deleted', handleCommunicationDeleted);
    };
  }, [socket, onUpdate]);
};
