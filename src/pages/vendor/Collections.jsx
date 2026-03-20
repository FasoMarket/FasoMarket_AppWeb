import { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit3, Grid, List, Search, PackageMinus, Settings2 } from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { productService } from '../../services/productService';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';

export default function VendorCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const res = await vendorAdvancedService.getCollections();
      setCollections(res.data.collections || []);
    } catch {
      showToast('Erreur chargement collections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette collection ?')) return;
    try {
      await vendorAdvancedService.deleteCollection(id);
      setCollections(prev => prev.filter(c => c._id !== id));
      showToast('Collection supprimée', 'success');
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  const handleEdit = (coll) => {
    setSelectedCollection(coll);
    setIsEditMode(true);
    setFormData({
      name: coll.name,
      description: coll.description || '',
      isActive: coll.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await vendorAdvancedService.updateCollection(selectedCollection._id, formData);
        showToast('Collection mise à jour', 'success');
      } else {
        await vendorAdvancedService.createCollection(formData);
        showToast('Collection créée avec succès', 'success');
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({ name: '', description: '', isActive: true });
      loadCollections();
    } catch (err) {
      showToast(isEditMode ? 'Erreur mise à jour' : 'Erreur création', 'error');
    }
  };

  const handleOpenManageProducts = async (coll) => {
    setSelectedCollection(coll);
    setIsProductsModalOpen(true);
    setLoadingProducts(true);
    try {
      const user = authService.getUser();
      const res = await productService.getAll({ vendor: user._id, limit: 100 });
      setVendorProducts(res.data.products || []);
    } catch {
      showToast('Erreur chargement produits', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleToggleProductInCollection = async (productId) => {
    const isSelected = selectedCollection.products?.some(p => (p._id || p) === productId);
    try {
      if (isSelected) {
        await vendorAdvancedService.removeFromCollection(selectedCollection._id, productId);
        setSelectedCollection(prev => ({
          ...prev,
          products: prev.products.filter(p => (p._id || p) !== productId)
        }));
      } else {
        await vendorAdvancedService.addToCollection(selectedCollection._id, productId);
        setSelectedCollection(prev => ({
          ...prev,
          products: [...(prev.products || []), productId]
        }));
      }
      loadCollections(); // Refresh main list to update counts
    } catch {
      showToast('Erreur lors de la modification', 'error');
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
          <h1 className="text-2xl font-bold text-slate-800">Collections de Boutique</h1>
          <p className="text-sm text-slate-500">Organisez vos produits par univers ou thématiques.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus size={20} />
          Nouvelle Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
            <Layers className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Structurez votre offre !</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">Créez des sections thématiques comme "Nouveautés", "Best Sellers" ou "Mariage" pour aider vos clients.</p>
          </div>
        ) : collections.map(coll => (
          <div key={coll._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers size={24} />
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(coll)}
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(coll._id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{coll.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
              {coll.description || 'Aucune description disponible pour cette collection.'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {coll.products?.length || 0} Produits
              </span>
               <button 
                onClick={() => handleOpenManageProducts(coll)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Gérer les produits →
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? 'Modifier la Collection' : 'Créer une Collection'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setIsEditMode(false); }} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nom de la collection</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Collection d'Hiver" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea 
                  rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Décrivez l'univers de cette collection..."
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Collection Active</p>
                  <p className="text-[10px] text-slate-500 font-medium">Afficher cette collection sur votre boutique publique.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  {isEditMode ? 'Enregistrer les modifications' : 'Créer la collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Products Modal */}
      {isProductsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Gérer les produits</h2>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{selectedCollection?.name}</p>
              </div>
              <button onClick={() => setIsProductsModalOpen(false)} className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar">
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Récupération de vos produits...</p>
                </div>
              ) : vendorProducts.length === 0 ? (
                <div className="text-center py-20 px-10">
                  <p className="text-slate-400 font-medium italic">Vous n'avez aucun produit actif à ajouter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {vendorProducts.map(product => {
                    const isSelected = selectedCollection.products?.some(p => (p._id || p) === product._id);
                    return (
                      <div 
                        key={product._id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer group",
                          isSelected ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-slate-100 hover:border-primary/20"
                        )}
                        onClick={() => handleToggleProductInCollection(product._id)}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                          {product.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{product.name}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{product.price.toLocaleString()} CFA</p>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isSelected ? "bg-primary border-primary text-white" : "border-slate-200 group-hover:border-primary/40"
                        )}>
                          {isSelected && <Layers size={12} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-10 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end">
              <button 
                onClick={() => setIsProductsModalOpen(false)}
                className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all"
              >
                Terminer la gestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
