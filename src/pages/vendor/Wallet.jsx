import { useState, useEffect } from 'react';
import { relationService } from '../../services/relationService';
import { useToast } from '../../contexts/ToastContext';
import { Wallet as WalletIcon, ArrowLeftRight, TrendingUp, TrendingDown, Clock, Plus, ArrowLeft, CheckCircle, Edit2, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const METHOD_LABELS = {
  orange_money: 'Orange Money',
  moov_money: 'Moov Money',
  coris_money: 'Coris Money',
  bank_transfer: 'Virement bancaire',
};

const STATUS = {
  paid:       { label: 'Versé',     cls: 'bg-green-100 text-green-700' },
  processing: { label: 'En cours',  cls: 'bg-amber-100 text-amber-700' },
  failed:     { label: 'Échoué',    cls: 'bg-red-100 text-red-700' },
  pending:    { label: 'En attente',cls: 'bg-slate-100 text-slate-600' },
};

export default function VendorWallet() {
  const [wallet,   setWallet]   = useState(null);
  const [payouts,  setPayouts]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [payInfo,  setPayInfo]  = useState({ method: 'orange_money', number: '', name: '' });
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([relationService.getMyWallet(), relationService.getMyPayouts()])
      .then(([w, p]) => {
        const data = w.data.data || w.data.wallet;
        setWallet(data);
        setPayments(p.data.payouts || p.data.data || []);
        if (data?.paymentInfo) setPayInfo(data.paymentInfo);
      })
      .finally(() => setLoading(false));
  }, []);

  const setPayments = setPayouts;

  const handleSave = async () => {
    setSaving(true);
    try {
      await relationService.updatePaymentInfo(payInfo);
      setWallet(prev => ({ ...prev, paymentInfo: payInfo }));
      showToast('Coordonnées sauvegardées !', 'success');
      setShowEdit(false);
    } catch { showToast('Erreur lors de la sauvegarde', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cards = [
    { label: 'En attente de versement', value: wallet?.pendingBalance || 0,  Icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
    { label: 'Total gagné (net)',        value: wallet?.totalEarned   || 0,  Icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Déjà versé',              value: wallet?.totalPaid     || 0,  Icon: CheckCircle,  color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <WalletIcon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Mon Wallet</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Gestion de vos revenus</p>
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

      {/* Cartes soldes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm border ${border}`}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
            <p className={`text-xl font-black ${color}`}>{value.toLocaleString()} <span className="text-sm font-semibold">FCFA</span></p>
          </div>
        ))}
      </div>

      {/* Info commission */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <p className="text-sm text-amber-800 font-medium">
          ⚡ Commission plateforme : <strong>{wallet?.commissionRate || 5}%</strong> prélevé sur chaque vente.
          Votre solde en attente sera versé par l'administrateur.
          {wallet?.unpaidOrderCount > 0 && (
            <span className="ml-1 font-bold">({wallet.unpaidOrderCount} commande{wallet.unpaidOrderCount > 1 ? 's' : ''} en attente)</span>
          )}
        </p>
      </div>

      {/* Coordonnées de paiement */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Coordonnées de réception</h2>
          <button onClick={() => setShowEdit(e => !e)} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
            {showEdit ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {showEdit ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {showEdit ? (
          <div className="space-y-3">
            <select value={payInfo.method} onChange={e => setPayInfo(p => ({ ...p, method: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 bg-white">
              {Object.entries(METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input value={payInfo.number} onChange={e => setPayInfo(p => ({ ...p, number: e.target.value }))}
              placeholder="Numéro de téléphone / IBAN"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400" />
            <input value={payInfo.name} onChange={e => setPayInfo(p => ({ ...p, name: e.target.value }))}
              placeholder="Nom du titulaire"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400" />
            <button onClick={handleSave} disabled={saving}
              className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Méthode</span>
              <span className="font-semibold text-slate-700">{METHOD_LABELS[wallet?.paymentInfo?.method] || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Numéro</span>
              <span className="font-semibold text-slate-700">{wallet?.paymentInfo?.number || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Titulaire</span>
              <span className="font-semibold text-slate-700">{wallet?.paymentInfo?.name || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Historique des versements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-bold text-slate-800 mb-4">Historique des versements</h2>
        {payouts.length === 0 ? (
          <div className="text-center py-12">
            <WalletIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Aucun versement pour l'instant</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {payouts.map(p => {
              const s = STATUS[p.status] || STATUS.pending;
              return (
                <div key={p._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.amount.toLocaleString()} FCFA</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Réf. {p.reference} · {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${s.cls}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
