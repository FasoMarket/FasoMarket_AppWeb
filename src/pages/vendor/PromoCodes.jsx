import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Tag, AlertCircle, Copy, Check } from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function VendorPromoCodes() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: 0,
    maxUses: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const res = await vendorAdvancedService.getPromoCodes();
      setPromoCodes(res.data.data || []);
    } catch (err) {
      showToast('Erreur chargement codes promo', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce code promo ?')) return;
    try {
      await vendorAdvancedService.deletePromoCode(id);
      setPromoCodes(prev => prev.filter(p => p._id !== id));
      showToast('Code promo supprimé', 'success');
    } catch (err) {
      showToast('Erreur suppression', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      showToast('Le code promo est obligatoire', 'error');
      return;
    }

    if (!formData.value || formData.value <= 0) {
      showToast('La valeur doit être supérieure à 0', 'error');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      showToast('Les dates de début et fin sont obligatoires', 'error');
      return;
    }

    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: parseFloat(formData.value),
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        isActive: formData.isActive
      };

      await vendorAdvancedService.createPromoCode(payload);
      showToast('Code promo créé avec succès', 'success');
      setIsModalOpen(false);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minOrderAmount: 0,
        maxUses: '',
        startDate: '',
        endDate: '',
        isActive: true
      });
      loadPromoCodes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur création', 'error');
      console.error(err);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Code copié', 'success');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Codes Promo</h1>
          <p className="text-sm text-slate-500">Créez et gérez les codes de réduction pour vos clients.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus size={20} />
          Nouveau Code
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {promoCodes.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
            <Tag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Créez votre premier code promo !</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">Les codes promo aident à augmenter vos ventes en offrant des réductions attrayantes à vos clients.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-primary font-bold hover:underline"
            >
              Créer mon premier code →
            </button>
          </div>
        ) : promoCodes.map(promo => {
          const isExpired = new Date(promo.endDate) < new Date();
          const isNotStarted = new Date(promo.startDate) > new Date();
          
          return (
            <div key={promo._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${promo.isActive && !isExpired ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Tag size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <code className="text-lg font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{promo.code}</code>
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                      title="Copier le code"
                    >
                      {copiedId === promo.code ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} className="text-slate-400" />
                      )}
                    </button>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isExpired ? 'bg-red-100 text-red-600' :
                      isNotStarted ? 'bg-yellow-100 text-yellow-600' :
                      promo.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isExpired ? 'Expiré' : isNotStarted ? 'À venir' : promo.isActive ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold">Réduction</p>
                      <p className="font-bold text-primary">
                        {promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value} FCFA`}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold">Commande Min</p>
                      <p className="font-bold text-slate-800">{promo.minOrderAmount} FCFA</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold">Utilisations</p>
                      <p className="font-bold text-slate-800">{promo.usedCount || 0}{promo.maxUses ? `/${promo.maxUses}` : ''}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold">Période</p>
                      <p className="font-bold text-slate-800 text-xs">
                        {format(new Date(promo.startDate), 'dd MMM', { locale: fr })} - {format(new Date(promo.endDate), 'dd MMM', { locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(promo._id)}
                  className="w-10 h-10 rounded-xl border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-all flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Nouveau Code Promo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Code Promo *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="Ex: FASO10, SUMMER20" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Type *</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant Fixe (FCFA)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Valeur *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    placeholder="Ex: 10 ou 5000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Commande Minimum (FCFA)</label>
                <input 
                  type="number" 
                  value={formData.minOrderAmount} 
                  onChange={e => setFormData({...formData, minOrderAmount: e.target.value})}
                  placeholder="Ex: 5000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nombre Max d'Utilisations</label>
                <input 
                  type="number" 
                  value={formData.maxUses} 
                  onChange={e => setFormData({...formData, maxUses: e.target.value})}
                  placeholder="Laisser vide pour illimité"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Date de Début *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.startDate} 
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Date de Fin *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.endDate} 
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Créer le code
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
