import { useState, useEffect } from 'react';
import { relationService } from '../../services/relationService';
import { useToast } from '../../contexts/ToastContext';
import { DollarSign, CheckCircle, XCircle, Clock, TrendingUp, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const METHOD_LABELS = {
  orange_money: 'Orange Money',
  moov_money: 'Moov Money',
  coris_money: 'Coris Money',
  bank_transfer: 'Virement bancaire',
};

const STATUS = {
  paid:       { label: 'Versé',      cls: 'bg-green-100 text-green-700'  },
  processing: { label: 'En cours',   cls: 'bg-amber-100 text-amber-700'  },
  failed:     { label: 'Échoué',     cls: 'bg-red-100 text-red-700'      },
  pending:    { label: 'En attente', cls: 'bg-slate-100 text-slate-600'  },
};

const EMPTY_FORM = { paymentMethod: 'orange_money', paymentNumber: '', notes: '' };

export default function AdminPayouts() {
  const [pending,    setPending]    = useState([]);
  const [payouts,    setPayouts]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [processing, setProcessing] = useState(false);
  const [payForm,    setPayForm]    = useState(EMPTY_FORM);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([
        relationService.getPendingPayouts(),
        relationService.getAllPayouts({ limit: 30 }),
      ]);
      setPending(p.data.pending || []);
      setPayouts(a.data.payouts || []);
    } catch (err) {
      showToast('Erreur de chargement', 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (v) => {
    if (!payForm.paymentNumber && !v.paymentInfo?.number) {
      showToast('Veuillez saisir un numéro de destination', 'error');
      return;
    }
    setProcessing(true);
    try {
      await relationService.processPayout({
        vendorId:       v.vendor._id,
        amount:         Math.round(v.netAmount),
        grossAmount:    Math.round(v.grossAmount),
        commission:     Math.round(v.commission),
        commissionRate: v.commissionRate || 5,
        orderIds:       [],
        paymentMethod:  payForm.paymentMethod || v.paymentInfo?.method || 'orange_money',
        paymentNumber:  payForm.paymentNumber || v.paymentInfo?.number,
        notes:          payForm.notes,
      });
      showToast(`💰 Versement de ${Math.round(v.netAmount).toLocaleString()} FCFA initié !`, 'success');
      setSelected(null);
      setPayForm(EMPTY_FORM);
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally { setProcessing(false); }
  };

  const handleConfirm = async (id) => {
    try {
      await relationService.confirmPayout(id);
      setPayouts(prev => prev.map(p => p._id === id ? { ...p, status: 'paid' } : p));
      showToast('✅ Paiement confirmé', 'success');
    } catch { showToast('Erreur', 'error'); }
  };

  const handleFail = async (id) => {
    try {
      await relationService.failPayout(id);
      setPayouts(prev => prev.map(p => p._id === id ? { ...p, status: 'failed' } : p));
      showToast('Paiement marqué comme échoué', 'warning');
    } catch { showToast('Erreur', 'error'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  const totalPending = pending.reduce((s, v) => s + v.netAmount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <DollarSign size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Paiements Vendeurs</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Gestion des reversements de commissions</p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      {pending.length > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-bold text-amber-700">{Math.round(totalPending).toLocaleString()} FCFA à verser</span>
        </div>
      )}

      {/* Vendeurs en attente */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            Versements en attente
            <span className="ml-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map(v => (
              <div key={v.vendor._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">{v.vendor.name}</p>
                  <p className="text-xs text-slate-500">{v.vendor.email} · {v.orderCount} commande{v.orderCount > 1 ? 's' : ''}</p>
                  <div className="flex gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-slate-400">Brut : {Math.round(v.grossAmount).toLocaleString()} FCFA</span>
                    <span className="text-xs text-red-400">Commission : -{Math.round(v.commission).toLocaleString()} FCFA</span>
                    <span className="text-xs text-green-600 font-black">Net : {Math.round(v.netAmount).toLocaleString()} FCFA</span>
                  </div>
                  {v.paymentInfo?.number && (
                    <p className="text-xs text-primary-500 mt-1 font-medium">
                      {METHOD_LABELS[v.paymentInfo.method]} : {v.paymentInfo.number}
                    </p>
                  )}
                </div>
                <button onClick={() => { setSelected(v); setPayForm({ ...EMPTY_FORM, paymentMethod: v.paymentInfo?.method || 'orange_money', paymentNumber: v.paymentInfo?.number || '' }); }}
                  className="ml-4 flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-colors shrink-0">
                  <DollarSign className="w-4 h-4" /> Verser
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-green-700">Tous les vendeurs sont à jour !</p>
        </div>
      )}

      {/* Modal confirmation paiement */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Confirmer le versement</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-4">
              <p className="text-lg font-black text-green-800">{Math.round(selected.netAmount).toLocaleString()} FCFA</p>
              <p className="text-sm text-green-600 font-medium">à {selected.vendor.name}</p>
            </div>
            <div className="space-y-3">
              <select value={payForm.paymentMethod} onChange={e => setPayForm(p => ({ ...p, paymentMethod: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
                {Object.entries(METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input value={payForm.paymentNumber} onChange={e => setPayForm(p => ({ ...p, paymentNumber: e.target.value }))}
                placeholder="Numéro de destination *"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              <input value={payForm.notes} onChange={e => setPayForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Notes (optionnel)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelected(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => handlePay(selected)} disabled={processing}
                className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                {processing ? 'Traitement...' : 'Confirmer le versement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historique des versements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-bold text-slate-800 mb-4">Historique des versements</h2>
        {payouts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucun versement enregistré</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {payouts.map(p => {
              const s = STATUS[p.status] || STATUS.pending;
              return (
                <div key={p._id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">{p.vendor?.name} — {p.amount.toLocaleString()} FCFA</p>
                    <p className="text-xs text-slate-400 mt-0.5">Réf. {p.reference} · {new Date(p.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${s.cls}`}>{s.label}</span>
                    {p.status === 'processing' && (
                      <>
                        <button onClick={() => handleConfirm(p._id)}
                          title="Confirmer" className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button onClick={() => handleFail(p._id)}
                          title="Marquer échoué" className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
