import { useState, useEffect } from 'react';
import { Megaphone, Bell, Archive, Trash2, Loader2, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useCommunicationUpdates } from '../../hooks/useCommunicationUpdates';

export default function VendorAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('unread'); // unread, all, archived
  const { showToast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await API.get('/communications');
      const commsArray = res.data?.data || res.data || [];
      // Filtrer les communications destinées aux vendeurs
      const vendorComms = Array.isArray(commsArray) 
        ? commsArray.filter(c => c.targetRole === 'vendor' || c.targetRole === 'all')
        : [];
      setAnnouncements(vendorComms);
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Écouter les mises à jour en temps réel
  useCommunicationUpdates((update) => {
    if (update.type === 'created') {
      const comm = update.communication;
      if (comm.targetRole === 'vendor' || comm.targetRole === 'all') {
        setAnnouncements(prev => [comm, ...prev]);
        showToast('Nouvelle annonce reçue', 'success');
      }
    } else if (update.type === 'updated') {
      const comm = update.communication;
      if (comm.targetRole === 'vendor' || comm.targetRole === 'all') {
        setAnnouncements(prev => prev.map(a => a._id === comm._id ? comm : a));
      }
    } else if (update.type === 'deleted') {
      setAnnouncements(prev => prev.filter(a => a._id !== update.communicationId));
    }
  });

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/communications/${id}/mark-read`);
      setAnnouncements(prev => prev.map(a => 
        a._id === id ? { ...a, isRead: true } : a
      ));
      showToast('Annonce marquée comme lue', 'success');
    } catch (err) {
      showToast('Erreur', 'error');
    }
  };

  const handleArchive = async (id) => {
    try {
      await API.patch(`/communications/${id}/archive`);
      setAnnouncements(prev => prev.map(a => 
        a._id === id ? { ...a, isArchived: true } : a
      ));
      showToast('Annonce archivée', 'success');
    } catch (err) {
      showToast('Erreur', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await API.delete(`/communications/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      showToast('Annonce supprimée', 'success');
    } catch (err) {
      showToast('Erreur', 'error');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (filter === 'unread') return !a.isRead;
    if (filter === 'archived') return a.isArchived;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Annonces & Communications</h1>
            <p className="text-slate-500 mt-1">Recevez les dernières annonces de FasoMarket</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            filter === 'unread'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="inline mr-2" size={16} />
          Non lues ({announcements.filter(a => !a.isRead).length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            filter === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Toutes ({announcements.length})
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-all ${
            filter === 'archived'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Archive className="inline mr-2" size={16} />
          Archivées
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <Megaphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              {filter === 'unread' && 'Aucune annonce non lue'}
              {filter === 'all' && 'Aucune annonce'}
              {filter === 'archived' && 'Aucune annonce archivée'}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement._id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                announcement.isRead
                  ? 'border-slate-100'
                  : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="flex gap-4">
                {/* Image */}
                {announcement.imageUrl && (
                  <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-black text-slate-900">
                          {announcement.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          announcement.type === 'announcement' ? 'bg-blue-100 text-blue-700' :
                          announcement.type === 'promotion' ? 'bg-green-100 text-green-700' :
                          announcement.type === 'alert' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {announcement.type === 'announcement' && '📢'}
                          {announcement.type === 'promotion' && '🎉'}
                          {announcement.type === 'alert' && '⚠️'}
                          {announcement.type === 'maintenance' && '🔧'}
                          {' '}{announcement.type}
                        </span>
                        {!announcement.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-3">
                        {new Date(announcement.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!announcement.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(announcement._id)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Marquer comme lue"
                        >
                          <Bell size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(announcement._id)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Archiver"
                      >
                        <Archive size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
