import { useState, useEffect } from 'react';
import { adminAdvancedService } from '../../services/adminAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import {
  Percent, Plus, Edit, Trash2, Loader2, Search, X, Check,
  Clock, AlertCircle, Tag, Calendar
} from 'lucide-react';

const EMPTY_FORM = { code: '', type: 'percentage', value: '', minOrderAmount: '', maxUses: '', startDate: '', endDate: '' };

export default function AdminPromoCodes() {
  const [codes,       setCodes]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [isModal,     setIsModal]     = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [toDelete,    setToDelete]    = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const { showToast } = useToast();

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await adminAdvancedService.getPromoCodes();
      setCodes(res.data.codes || []);
    } catch {
      showToast('Erreur chargement codes promo', 'error');
    } finally { setLoading(false); }
  };

  const filtered = codes.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setIsModal(true); };
  const openEdit   = (c) => {
    setEditTarget(c);
    setForm({ code: c.code, type: c.type, value: c.value, minOrderAmount: c.minOrderAmount || '', maxUses: c.maxUses || '', startDate: c.startDate ? c.startDate.slice(0,10) : '', endDate: c.endDate ? c.endDate.slice(0,10) : '' });
    setIsModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount) || 0, maxUses: form.maxUses ? Number(form.maxUses) : null };
      if (editTarget) {
        const res = await adminAdvancedService.updatePromoCode(editTarget._id, payload);
        setCodes(prev => prev.map(c => c._id === editTarget._id ? res.data.code : c));
        showToast('Code mis à jour', 'success');
      } else {
        const res = await adminAdvancedService.createPromoCode(payload);
        setCodes(prev => [res.data.code, ...prev]);
        showToast('Code créé !', 'success');
      }
      setIsModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la sauvegarde', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await adminAdvancedService.deletePromoCode(toDelete._id);
      setCodes(prev => prev.filter(c => c._id !== toDelete._id));
      showToast('Code supprimé', 'success');
    } catch { showToast('Erreur suppression', 'error'); }
    finally { setToDelete(null); }
  };

  const handleToggle = async (c) => {
    try {
      await adminAdvancedService.togglePromoCode(c._id);
      setCodes(prev => prev.map(x => x._id === c._id ? { ...x, isActive: !x.isActive } : x));
    } catch { showToast('Erreur toggle', 'error'); }
  };

  const isExpired = (c) => c.endDate && new Date(c.endDate) < new Date();
  const usageRate = (c) => c.maxUses ? Math.round((c.usedCount / c.maxUses) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Percent size={24} className="text-primary" /> Codes Promo
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{codes.length} code{codes.length !== 1 ? 's' : ''} · {codes.filter(c => c.isActive && !isExpired(c)).length} actif{codes.filter(c => c.isActive && !isExpired(c)).length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <Plus size={18} strokeWidth={3} /> Nouveau code
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3 px-4 py-2">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un code…"
          className="flex-1 bg-transparent py-2 text-sm font-bold text-gray-700 placeholder-gray-300 outline-none" />
        {search && <button onClick={() => setSearch('')}><X size={16} className="text-gray-400" /></button>}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={32} className="text-primary animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <div className="col-span-3">Code</div>
            <div className="col-span-2">Réduction</div>
            <div className="col-span-2">Usage</div>
            <div className="col-span-2">Validité</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-1"></div>
          </div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold text-sm">Aucun code promo</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(c => {
                const rate = usageRate(c);
                const expired = isExpired(c);
                return (
                  <div key={c._id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/60 transition-colors group">
                    <div className="col-span-3">
                      <span className="font-black text-gray-900 text-sm tracking-wider bg-gray-100 px-3 py-1 rounded-lg">{c.code}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-black text-emerald-700 text-sm">
                        {c.type === 'percentage' ? `${c.value}%` : `${c.value.toLocaleString()} FCFA`}
                      </span>
                      {c.minOrderAmount > 0 && <p className="text-[10px] text-gray-400 font-bold">min {c.minOrderAmount.toLocaleString()} FCFA</p>}
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-gray-700">{c.usedCount} fois</p>
                      {rate !== null && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(rate, 100)}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-gray-400">{rate}%</span>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      {c.endDate ? (
                        <p className={cn('text-xs font-bold flex items-center gap-1', expired ? 'text-rose-500' : 'text-gray-600')}>
                          <Calendar size={12} /> {new Date(c.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      ) : <p className="text-xs font-bold text-gray-400">Illimité</p>}
                    </div>
                    <div className="col-span-2">
                      <button onClick={() => handleToggle(c)}
                        className={cn('px-3 py-1 rounded-full text-[11px] font-black transition-all', c.isActive && !expired ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
                        {c.isActive && !expired ? 'Actif' : expired ? 'Expiré' : 'Inactif'}
                      </button>
                    </div>
                    <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit size={14} /></button>
                      <button onClick={() => setToDelete(c)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModal} onClose={() => setIsModal(false)} title={<span className="flex items-center gap-2"><Percent className="text-primary" size={18} />{editTarget ? 'Modifier le code' : 'Nouveau code promo'}</span>} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Code *</label>
              <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="PROMO20" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-black text-sm tracking-wider focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all">
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (FCFA)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Valeur *</label>
              <input required type="number" min="0" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percentage' ? 'Ex : 20' : 'Ex : 1000'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Commande min. (FCFA)</label>
              <input type="number" min="0" value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} placeholder="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Utilisations max</label>
              <input type="number" min="1" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="Illimité" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Date de fin</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={() => setIsModal(false)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all">Annuler</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {editTarget ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete}
        title="Supprimer le code" message={toDelete ? `Supprimer le code "${toDelete.code}" ? Cette action est irréversible.` : ''} confirmLabel="Oui, supprimer" variant="danger" />
    </div>
  );
}
