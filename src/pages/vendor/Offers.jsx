import { useState, useEffect, useRef } from 'react';
import { relationService } from '../../services/relationService';
import { useToast } from '../../contexts/ToastContext';
import { Send, Users, Megaphone, Trash2, CheckCircle2, Clock, Filter, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TARGET_LABELS = {
  all_buyers:    'Tous mes clients',
  recent_buyers: 'Clients des 30 derniers jours',
  specific:      'Clients spécifiques',
};

const EMPTY_FORM = { title: '', message: '', targets: 'all_buyers', promoCode: '' };

export default function VendorOffers() {
  const [offers,  setOffers]  = useState([]);
  const [buyers,  setBuyers]  = useState([]);
  const [filter,  setFilter]  = useState('all');
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [creating,setCreating]= useState(false);
  const formRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    Promise.all([
      relationService.getMyOffers(),
      relationService.getMyBuyers(filter),
    ]).then(([o, b]) => {
      setOffers(o.data.offers || []);
      setBuyers(b.data.buyers || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    relationService.getMyBuyers(filter)
      .then(b => setBuyers(b.data.buyers || []))
      .catch(() => {});
  }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await relationService.createOffer(form);
      setOffers(prev => [res.data.offer, ...prev]);
      setForm(EMPTY_FORM);
      showToast('Offre créée avec succès !', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la création', 'error');
    } finally { setCreating(false); }
  };

  const handleSend = async (id) => {
    setSending(id);
    try {
      const res = await relationService.sendOffer(id);
      setOffers(prev => prev.map(o =>
        o._id === id ? { ...o, status: 'sent', sentCount: res.data.sentCount } : o
      ));
      showToast(`✅ Offre envoyée à ${res.data.sentCount} client(s) !`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'envoi", 'error');
    } finally { setSending(null); }
  };

  const handleDelete = async (id) => {
    try {
      await relationService.deleteOffer(id);
      setOffers(prev => prev.filter(o => o._id !== id));
      showToast('Offre supprimée', 'success');
    } catch { showToast('Erreur', 'error'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-purple-50 text-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Megaphone size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Offres Clients</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Campagnes promotionnelles ciblées</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <button
            onClick={scrollToForm}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95 shadow-xl shadow-primary/20"
          >
            <Plus size={16} />
            Nouvelle Offre
          </button>
        </div>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Clients fidèles */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Mes clients</h2>
            <div className="flex items-center gap-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="text-xs text-slate-600 bg-transparent border-none outline-none cursor-pointer">
                <option value="all">Tous</option>
                <option value="recent_30d">30 derniers jours</option>
                <option value="repeat">Récurrents</option>
              </select>
            </div>
          </div>

          {buyers.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">Aucun client livré pour l'instant</p>
          ) : buyers.slice(0, 8).map(b => (
            <div key={b.customer._id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-black shrink-0">
                {b.customer.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{b.customer.name}</p>
                <p className="text-xs text-slate-400">{b.orderCount} commande{b.orderCount > 1 ? 's' : ''} · {b.totalSpent.toLocaleString()} FCFA</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Création + liste offres */}
        <div className="lg:col-span-2 space-y-5">
          {/* Formulaire */}
          <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary-500" /> Nouvelle offre
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Titre (ex: Promo flash -20% !)" required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Message personnalisé pour vos clients..." required rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.targets} onChange={e => setForm(p => ({ ...p, targets: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
                  {Object.entries(TARGET_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input value={form.promoCode} onChange={e => setForm(p => ({ ...p, promoCode: e.target.value }))}
                  placeholder="Code promo (optionnel)"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <button type="submit" disabled={creating}
                className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Megaphone className="w-4 h-4" />
                {creating ? 'Création...' : 'Créer l\'offre'}
              </button>
            </form>
          </div>

          {/* Liste offres */}
          <div className="space-y-3">
            {offers.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
                <Megaphone className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Aucune offre créée</p>
              </div>
            )}
            {offers.map(offer => (
              <div key={offer._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-slate-800">{offer.title}</p>
                      {offer.status === 'sent' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Envoyée à {offer.sentCount}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Brouillon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{offer.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Cible : {TARGET_LABELS[offer.targets]}
                      {offer.promoCode && <span className="ml-2 text-primary-500 font-semibold">Code : {offer.promoCode}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {offer.status === 'draft' && (
                      <button onClick={() => handleSend(offer._id)} disabled={sending === offer._id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all disabled:opacity-50">
                        <Send className="w-3.5 h-3.5" />
                        {sending === offer._id ? '...' : 'Envoyer'}
                      </button>
                    )}
                    <button onClick={() => handleDelete(offer._id)}
                      className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
