import { useState, useEffect } from 'react';
import { adminAdvancedService } from '../../services/adminAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import { Megaphone, Send, Users, User, Store, Loader2, Bell, Clock } from 'lucide-react';

const TARGETS = [
  { value: 'all',       label: 'Tout le monde',  Icon: Users  },
  { value: 'customers', label: 'Clients',         Icon: User   },
  { value: 'vendors',   label: 'Vendeurs',        Icon: Store  },
];

export default function AdminCommunication() {
  const [history, setHistory]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [form, setForm] = useState({ title: '', content: '', target: 'all', channels: ['notification'] });
  const { showToast } = useToast();

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await adminAdvancedService.getAnnouncements();
      setHistory(res.data.announcements || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const toggleChannel = (ch) => {
    setForm(f => ({
      ...f,
      channels: f.channels.includes(ch) ? f.channels.filter(c => c !== ch) : [...f.channels, ch],
    }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || form.channels.length === 0) return;
    setSending(true);
    try {
      const res = await adminAdvancedService.sendAnnouncement(form);
      showToast(`Annonce envoyée à ${res.data.sent} destinataires`, 'success');
      setForm({ title: '', content: '', target: 'all', channels: ['notification'] });
      loadHistory();
    } catch { showToast('Erreur lors de l\'envoi', 'error'); }
    finally { setSending(false); }
  };

  const TARGET_COLORS = { all: 'text-blue-700 bg-blue-50', customers: 'text-violet-700 bg-violet-50', vendors: 'text-amber-700 bg-amber-50' };
  const TARGET_LABELS = { all: 'Tout le monde', customers: 'Clients', vendors: 'Vendeurs' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Megaphone size={24} className="text-primary" /> Communication
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Envoyer des annonces à vos utilisateurs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSend} className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Nouvelle annonce</h2>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Titre *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex : Nouveauté sur FasoMarket !"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Message *</label>
            <textarea required rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Contenu de l'annonce…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Destinataires</label>
            <div className="flex gap-2">
              {TARGETS.map(({ value, label, Icon }) => (
                <button key={value} type="button" onClick={() => setForm(f => ({ ...f, target: value }))}
                  className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all', form.target === value ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-600')}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Canaux</label>
            <div className="flex gap-2">
              {[{ id: 'notification', label: '🔔 Notification' }, { id: 'email', label: '✉️ Email' }].map(ch => (
                <button key={ch.id} type="button" onClick={() => toggleChannel(ch.id)}
                  className={cn('px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all', form.channels.includes(ch.id) ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-500')}>
                  {ch.label}
                </button>
              ))}
            </div>
            {form.channels.includes('email') && <p className="text-[10px] font-bold text-amber-600 mt-2">⚠️ L'envoi par email nécessite la configuration de Nodemailer.</p>}
          </div>

          <button type="submit" disabled={sending || !form.title.trim() || !form.content.trim() || form.channels.length === 0}
            className="w-full py-3 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Envoyer l'annonce
          </button>
        </form>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock size={14} /> Historique
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={24} className="text-primary animate-spin" /></div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-400">Aucune annonce envoyée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(a => (
                <div key={a._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-black text-gray-900 leading-tight">{a.title}</p>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black shrink-0', TARGET_COLORS[a.target] || TARGET_COLORS.all)}>
                      {TARGET_LABELS[a.target] || a.target}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2">{a.content}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 flex items-center gap-3">
                    <span>{a.recipientCount} destinataires</span>
                    <span>{a.sentAt ? new Date(a.sentAt).toLocaleDateString('fr-FR') : '–'}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
