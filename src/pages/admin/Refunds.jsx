import { useState, useEffect } from 'react';
import { adminAdvancedService } from '../../services/adminAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import { RefreshCw, Loader2, CheckCircle2, XCircle, DollarSign } from 'lucide-react';

const STATUS_MAP = {
  pending:   { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  approved:  { label: 'Approuvé',   color: 'bg-emerald-100 text-emerald-700' },
  rejected:  { label: 'Refusé',     color: 'bg-rose-100 text-rose-700' },
  processed: { label: 'Traité',     color: 'bg-gray-100 text-gray-600' },
};

export default function AdminRefunds() {
  const [refunds,  setRefunds]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [action,   setAction]   = useState(null);
  const [notes,    setNotes]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const { showToast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAdvancedService.getRefunds();
      setRefunds(res.data.refunds || []);
    } catch { showToast('Erreur chargement', 'error'); }
    finally { setLoading(false); }
  };

  const openAction = (refund, act) => { setSelected(refund); setAction(act); setNotes(''); };

  const handleAction = async () => {
    setSaving(true);
    try {
      if (action === 'approve') {
        await adminAdvancedService.approveRefund(selected._id, { notes });
        showToast('Remboursement approuvé', 'success');
      } else {
        await adminAdvancedService.rejectRefund(selected._id, { notes });
        showToast('Remboursement refusé', 'success');
      }
      load();
      setSelected(null);
    } catch { showToast('Erreur', 'error'); }
    finally { setSaving(false); }
  };

  const pending = refunds.filter(r => r.status === 'pending');
  const others  = refunds.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <RefreshCw size={24} className="text-primary" /> Remboursements
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          {pending.length} demande{pending.length !== 1 ? 's' : ''} en attente
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={32} className="text-primary animate-spin" /></div>
      ) : (
        <>
          {pending.length > 0 && (
            <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">En attente</h2>
              <div className="space-y-3">
                {pending.map(r => (
                  <div key={r._id} className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm p-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-gray-900 text-sm">{r.client?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{r.reason}</p>
                      <p className="text-lg font-black text-primary mt-2">{(r.amount || 0).toLocaleString()} FCFA</p>
                      <p className="text-[10px] text-gray-400 font-bold">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openAction(r, 'approve')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Approuver
                      </button>
                      <button onClick={() => openAction(r, 'reject')} className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-black hover:bg-rose-200 transition-all flex items-center gap-1.5">
                        <XCircle size={14} /> Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Historique</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {others.map(r => {
                  const s = STATUS_MAP[r.status] || STATUS_MAP.pending;
                  return (
                    <div key={r._id} className="px-6 py-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900">{r.client?.name}</p>
                        <p className="text-xs text-gray-400 font-medium truncate">{r.reason}</p>
                      </div>
                      <p className="text-sm font-black text-gray-700 shrink-0">{(r.amount || 0).toLocaleString()} FCFA</p>
                      <span className={cn('px-3 py-1 rounded-full text-[11px] font-black shrink-0', s.color)}>{s.label}</span>
                      <p className="text-xs text-gray-400 shrink-0">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {refunds.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 py-20 text-center">
              <DollarSign size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="font-black text-gray-400 text-sm uppercase tracking-widest">Aucun remboursement</p>
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}
        title={action === 'approve' ? '✅ Approuver le remboursement' : '❌ Refuser le remboursement'} size="sm">
        <div className="space-y-4">
          {selected && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-black text-gray-900">{selected.client?.name}</p>
              <p className="text-lg font-black text-primary">{(selected.amount || 0).toLocaleString()} FCFA</p>
              <p className="text-xs text-gray-500">{selected.reason}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Notes {action === 'reject' ? '(raison du refus) *' : '(optionnel)'}</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm resize-none focus:ring-2 focus:ring-primary transition-all" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setSelected(null)} className="px-5 py-2.5 text-xs font-black text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Annuler</button>
            <button onClick={handleAction} disabled={saving || (action === 'reject' && !notes.trim())}
              className={cn('px-6 py-2.5 text-xs font-black text-white rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center gap-2',
                action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200')}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : action === 'approve' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {action === 'approve' ? 'Approuver' : 'Refuser'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
