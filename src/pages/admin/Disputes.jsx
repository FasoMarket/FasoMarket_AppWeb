import { useState, useEffect } from 'react';
import { adminAdvancedService } from '../../services/adminAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { Scale, Search, X, Loader2, Eye, Check, ChevronDown, AlertCircle, Clock } from 'lucide-react';

const STATUS_MAP = {
  open:              { label: 'Ouvert',         color: 'bg-blue-100 text-blue-700' },
  investigating:     { label: 'En enquête',     color: 'bg-amber-100 text-amber-700' },
  resolved_client:   { label: 'Client gagnant', color: 'bg-emerald-100 text-emerald-700' },
  resolved_vendor:   { label: 'Vendeur gagnant',color: 'bg-violet-100 text-violet-700' },
  closed:            { label: 'Clôturé',        color: 'bg-gray-100 text-gray-600' },
};

export default function AdminDisputes() {
  const [disputes,    setDisputes]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState('all');
  const [selected,    setSelected]    = useState(null);
  const [resolveModal,setResolveModal]= useState(false);
  const [resolution,  setResolution]  = useState('');
  const [winner,      setWinner]      = useState('client');
  const [saving,      setSaving]      = useState(false);
  const { showToast } = useToast();

  useEffect(() => { load(); }, [filter]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAdvancedService.getDisputes(filter);
      setDisputes(res.data.disputes || []);
    } catch { showToast('Erreur chargement litiges', 'error'); }
    finally { setLoading(false); }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return;
    setSaving(true);
    try {
      await adminAdvancedService.resolveDispute(selected._id, { resolution, winner });
      showToast('Litige résolu avec succès', 'success');
      setResolveModal(false);
      setSelected(null);
      load();
    } catch { showToast('Erreur résolution', 'error'); }
    finally { setSaving(false); }
  };

  const handleClose = async (id) => {
    try {
      await adminAdvancedService.closeDispute(id);
      setDisputes(prev => prev.map(d => d._id === id ? { ...d, status: 'closed' } : d));
      showToast('Litige clôturé', 'success');
    } catch { showToast('Erreur', 'error'); }
  };

  const openResolve = (d) => { setSelected(d); setResolution(''); setWinner('client'); setResolveModal(true); };

  const FILTERS = ['all', 'open', 'investigating', 'resolved_client', 'resolved_vendor', 'closed'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Scale size={24} className="text-primary" /> Litiges
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          {disputes.filter(d => d.status === 'open').length} ouvert{disputes.filter(d => d.status === 'open').length !== 1 ? 's' : ''} en attente de traitement
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
              filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300')}>
            {f === 'all' ? 'Tous' : STATUS_MAP[f]?.label || f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={32} className="text-primary animate-spin" /></div>
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 py-20 text-center">
          <Scale size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-black text-gray-400 text-sm uppercase tracking-widest">Aucun litige</p>
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map(d => {
            const s = STATUS_MAP[d.status] || STATUS_MAP.closed;
            return (
              <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn('px-3 py-1 rounded-full text-[11px] font-black', s.color)}>{s.label}</span>
                      <span className="text-xs text-gray-400 font-bold">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-sm mb-1">{d.reason}</h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2">{d.description}</p>
                    <div className="flex items-center gap-6 mt-3 text-xs font-bold text-gray-500">
                      <span>👤 {d.initiator?.name} <span className="text-gray-300">vs</span> {d.against?.name}</span>
                      {d.order && <span>🧾 Commande #{String(d.order._id).slice(-8)}</span>}
                    </div>
                  </div>
                  {(d.status === 'open' || d.status === 'investigating') && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => openResolve(d)} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary/90 transition-all">
                        Résoudre
                      </button>
                      <button onClick={() => handleClose(d._id)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-200 transition-all">
                        Clôturer
                      </button>
                    </div>
                  )}
                </div>
                {d.resolution && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs font-bold text-gray-500">Décision : <span className="text-gray-700">{d.resolution}</span></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      <Modal isOpen={resolveModal} onClose={() => setResolveModal(false)} title={<span className="flex items-center gap-2"><Scale className="text-primary" size={18} />Résoudre le litige</span>} size="md">
        <div className="space-y-5">
          {selected && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-black text-gray-900">{selected.reason}</p>
              <p className="text-xs text-gray-500 mt-1">{selected.initiator?.name} vs {selected.against?.name}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Décision en faveur de</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 'client', label: '👤 Client', name: selected?.initiator?.name }, { v: 'vendor', label: '🏪 Vendeur', name: selected?.against?.name }].map(o => (
                <button key={o.v} type="button" onClick={() => setWinner(o.v)}
                  className={cn('p-3 rounded-xl border-2 text-sm font-black transition-all text-left', winner === o.v ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-600')}>
                  {o.label}<br/><span className="text-[11px] font-bold text-gray-400">{o.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Décision / Résolution *</label>
            <textarea rows={4} value={resolution} onChange={e => setResolution(e.target.value)} placeholder="Expliquez votre décision…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-3">
            <button onClick={() => setResolveModal(false)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all">Annuler</button>
            <button onClick={handleResolve} disabled={saving || !resolution.trim()} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Valider la décision
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
