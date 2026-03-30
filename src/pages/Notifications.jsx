import { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle2, AlertCircle, Package, MessageSquare, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'appel API réel
      // const res = await notificationService.getMyNotifications();
      // setNotifications(res.data?.notifications || []);
      
      // Données de test
      setNotifications([
        {
          _id: '1',
          type: 'order_delivered',
          title: '🎉 Commande livrée !',
          message: 'Votre commande #12345 a bien été livrée. Bonne utilisation !',
          link: '/my-orders/12345',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          type: 'order_shipped',
          title: '🚚 Commande expédiée !',
          message: 'Votre commande #12345 est en route vers vous',
          link: '/my-orders/12345',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          _id: '3',
          type: 'new_message',
          title: '💬 Nouveau message',
          message: 'Le vendeur a répondu à votre avis',
          link: '/messages',
          read: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          _id: '4',
          type: 'promo',
          title: '⚡ Nouvelle promotion',
          message: 'Découvrez nos meilleures offres du jour',
          link: '/products',
          read: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      showToast('Erreur lors du chargement des notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // TODO: Appel API pour marquer comme lu
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      // TODO: Appel API pour supprimer
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      showToast('Notification supprimée', 'success');
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Appel API pour marquer tous comme lus
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('Toutes les notifications marquées comme lues', 'success');
    } catch (err) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_delivered':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'order_shipped':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'promo':
        return <Zap className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order_delivered':
        return 'bg-emerald-50 border-emerald-100';
      case 'order_shipped':
        return 'bg-blue-50 border-blue-100';
      case 'new_message':
        return 'bg-purple-50 border-purple-100';
      case 'promo':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500 mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread', 'read'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'unread' ? 'Non lues' : 'Lues'}
            </button>
          ))}
        </div>

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <Bell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification._id}
                onClick={() => {
                  if (!notification.read) handleMarkAsRead(notification._id);
                  if (notification.link) navigate(notification.link);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                  notification.read
                    ? 'bg-white border-slate-100'
                    : `${getNotificationColor(notification.type)} border-current`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`font-semibold ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification._id);
                        }}
                        className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
