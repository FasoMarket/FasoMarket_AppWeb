import { useSocket } from '../contexts/SocketContext';

// Ce service utilise le SocketContext existant pour accéder à la connexion Socket.io
export const socketService = {
  // Note: Ce service est un wrapper autour du SocketContext
  // Utilisez useSocket() directement dans les composants pour accéder à la connexion
  
  on: (event, callback) => {
    // Ce sera appelé depuis les hooks qui ont accès au socket
    // Voir useProductUpdates, useOfferUpdates, etc.
  },

  off: (event, callback) => {
    // Ce sera appelé depuis les hooks qui ont accès au socket
  },

  emit: (event, data) => {
    // Ce sera appelé depuis les hooks qui ont accès au socket
  },

  getSocket: () => {
    // Utilisez useSocket() directement dans les composants
    return null;
  },
};

// Export du hook pour utilisation directe
export { useSocket };
