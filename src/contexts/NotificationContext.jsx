import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket }          from './SocketContext';
import { notificationService } from '../services/notificationService';
import { authService }         from '../services/authService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { socket }            = useSocket();
  const [notifications,  setNotifications]  = useState([]);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [loading,        setLoading]        = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!authService.isLoggedIn()) return;
    setLoading(true);
    try {
      const res = await notificationService.getAll({ limit: 30 });
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ notification, unreadCount: count }) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(count);
      if (document.visibilityState === 'visible') playNotificationSound();
    };

    socket.on('notification:new', handleNewNotification);
    return () => socket.off('notification:new', handleNewNotification);
  }, [socket]);

  const markAllRead = async () => {
    try {
      const res = await notificationService.markAllRead();
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const markOneRead = async (id) => {
    try {
      const res = await notificationService.markOneRead(id);
      if (res.data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking one as read:', err);
    }
  };

  const deleteOne = async (id) => {
    try {
      const res = await notificationService.deleteOne(id);
      if (res.data.success) {
        const notif = notifications.find(n => n._id === id);
        setNotifications(prev => prev.filter(n => n._id !== id));
        if (notif && !notif.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, loading,
      markAllRead, markOneRead, deleteOne, refetch: fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
};
