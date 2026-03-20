import { useState, useEffect } from 'react';
import { Percent, Plus, Trash2, Calendar, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function VendorPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const res = await vendorAdvancedService.getPromotions();
      setPromotions(res.data.promotions || []);
    } catch {
      showToast('Erreur chargement promotions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await vendorAdvancedService.togglePromotion(id);
      setPromotions(prev => prev.map(p => 
        p._id === id ? { ...p, isActive: !p.isActive } : p
      ));
      showToast('Statut mis à jour', 'success');
    } catch {
      showToast('Erreur lors du toggle', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette promotion ?')) return;
    try {
      await vendorAdvancedService.deletePromotion(id);
      setPromotions(prev => prev.filter(p => p._id !== id));
      showToast('Promotion supprimée', 'success');
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await vendorAdvancedService.createPromotion(formData);
      showToast('Promotion créée avec succès', 'success');
      setIsModalOpen(false);
      loadPromotions();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur création', 'error');
    }
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
          <h1 className="text-2xl font-bold text-slate-800">Promotions & Ventes</h1>
          <p className="text-sm text-slate-500">Gérez vos réductions et offres spéciales Boutique.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus size={20} />
          Nouvelle Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {promotions.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
            <Percent className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Lancez votre première offre !</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">Les promotions aident à augmenter vos ventes et à attirer plus de clients sur vos produits.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-primary font-bold hover:underline"
            >
              Créer ma première promo →
            </button>
          </div>
        ) : promotions.map(promo => (
          <div key={promo._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${promo.isActive ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
              <Tag size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-center md:justify-start">
                <h3 className="text-lg font-bold text-slate-800">{promo.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${promo.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                  {promo.isActive ? 'Active' : 'Désactivée'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 justify-center md:justify-start">
                <span className="font-bold text-primary">
                  {promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value} FCFA`}
                </span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{format(new Date(promo.startDate), 'dd MMM', { locale: fr })} - {format(new Date(promo.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>{promo.products?.length || 'Tous les produits'} concernés</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleToggle(promo._id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${promo.isActive ? 'border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              >
                {promo.isActive ? 'Désactiver' : 'Activer'}
              </button>
              <button 
                onClick={() => handleDelete(promo._id)}
                className="w-10 h-10 rounded-xl border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Nouvelle Promotion</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nom de l'offre</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Soldes d'Été" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Type</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant Fixe (FCFA)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Valeur</label>
                  <input 
                    type="number" required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Début</label>
                  <input 
                    type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Fin</label>
                  <input 
                    type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Créer la promotion
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
