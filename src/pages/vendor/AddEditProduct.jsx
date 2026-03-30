import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  Trash2,
  Image as ImageIcon,
  Tag,
  Percent,
  Calendar,
  Loader2,
  AlertCircle,
  Lock,
  Store
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { vendorService } from '../../services/vendorService';
import ConfirmModal from '../../components/ConfirmModal';
import NoShopState from '../../components/NoShopState';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export default function AddEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasNoStore, setHasNoStore] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    price: '',
    stock: ''
  });

  // Check if vendor is approved - render after all hooks
  if (!user?.isVendorApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="text-red-600" size={24} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">Accès Restreint</h1>
            <p className="text-sm text-gray-600 mt-1">Compte en attente d'approbation (24-48h)</p>
          </div>
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    checkStoreAndInit();
  }, [id, isEditing]);

  const checkStoreAndInit = async () => {
    try {
      setLoading(true);
      // Vérifier si le vendeur a une boutique
      const storeRes = await vendorService.getMyStore();
      const store = storeRes.data?.data || storeRes.data;
      const storeId = store?._id || store?.id;
      
      if (!storeId) {
        setHasNoStore(true);
        setLoading(false);
        return;
      }

      // Si boutique existe, charger les catégories et le produit si édition
      await fetchCategories();
      if (isEditing) {
        await fetchProduct();
      }
    } catch (err) {
      console.error('Erreur initialisation:', err);
      if (err.response?.status === 404) {
        setHasNoStore(true);
      } else {
        setError('Erreur lors du chargement.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productService.getCategories();
      const catData = res.data?.data || res.data || [];
      setCategories(catData);
      if (!isEditing && Array.isArray(catData) && catData.length > 0) {
        setFormData(prev => ({ ...prev, category: catData[0] }));
      }
    } catch (err) {
      console.error('Erreur categories:', err);
      setCategories([]);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await productService.getById(id);
      // res.data contient { success, message, data: {...} }
      const p = res.data?.data || res.data;
      if (p) {
        setFormData({
          name: p.name || '',
          category: p.category || '',
          brand: p.brand || '',
          description: p.description || '',
          price: p.price || '',
          stock: p.stock || ''
        });
        setExistingImages(p.images || []);
      }
    } catch (err) {
      console.error('Erreur produit:', err);
      setError('Impossible de charger le produit.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async () => {
    if (!imageToDelete) return;
    try {
      await productService.deleteImage(id, { imageUrl: imageToDelete });
      setExistingImages(prev => prev.filter(img => img !== imageToDelete));
      showToast('Image supprimée', 'success');
    } catch (err) {
      showToast('Erreur suppression image', 'error');
    } finally {
      setImageToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setError('Veuillez remplir les champs obligatoires.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);

      selectedFiles.forEach(file => {
        data.append('images', file);
      });

      if (isEditing) {
        await productService.update(id, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Produit mis à jour avec succès', 'success');
      } else {
        await productService.create(data);
        showToast('Produit ajouté avec succès', 'success');
      }

      navigate('/vendor/products');
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Afficher l'état "Pas de boutique" si le vendeur n'a pas encore de boutique
  if (hasNoStore) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-6 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all text-slate-400 hover:text-primary shadow-sm outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">
              {isEditing ? "Modifier Produit" : "Nouveau Produit"}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
              Ajoutez vos produits sur FasoMarket
            </p>
          </div>
        </div>
        <NoShopState variant="compact" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-black pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all text-slate-400 hover:text-primary shadow-sm outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">
              {isEditing ? "Raffiner le Produit" : "Nouvelle Création"}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
              {isEditing 
                ? "Mettez à jour votre inventaire FASOMARKET" 
                : "Lancez votre produit sur le marché burkinabè"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold animate-in fade-in zoom-in-95">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-gray-50 pb-6 flex items-center gap-3">
               <Tag size={16} className="text-primary" /> Identité du Produit
            </h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Nom commercial</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold" 
                  placeholder="Ex: Beurre de Karité Pur 500g"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Catégorie</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Sélectionner...</option>
                    {Array.isArray(categories) && categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Marque (Optionnel)</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold" 
                    placeholder="Ex: Faso Karité"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Description Storytelling</label>
                <textarea 
                  rows={6} 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-bold resize-none leading-relaxed italic" 
                  placeholder="Racontez l'histoire de ce produit et ses bienfaits..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-gray-50 pb-6 flex items-center gap-3">
                <ImageIcon size={16} className="text-primary" /> Valeur & Stockage
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Prix de Vente (FCFA)</label>
                <div className="relative">
                    <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-black italic" 
                    placeholder="0.00"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">FCFA</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Quantité initiale</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-black italic" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-gray-50 pb-4">Galerie Photos</h3>
            
            <div className="space-y-6">
              <label className="border-4 border-dashed border-primary/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-4 hover:bg-primary/5 transition-all cursor-pointer group relative overflow-hidden">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                  <Upload size={28} />
                </div>
                <div className="text-xs">
                  <span className="font-black text-primary uppercase tracking-widest">Choisir des photos</span>
                  <p className="text-slate-400 mt-2 font-bold italic">Max. 5MB par fichier</p>
                </div>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Existing Images */}
                {existingImages.map((img, i) => (
                    <div key={`exist-${i}`} className="aspect-square rounded-2xl border border-gray-100 relative group overflow-hidden">
                        <img src={img} alt="Product" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                        <button 
                            type="button"
                            onClick={() => setImageToDelete(img)}
                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                            <Trash2 size={24} />
                        </button>
                    </div>
                ))}
                {/* New Images */}
                {previews.map((preview, i) => (
                    <div key={`new-${i}`} className="aspect-square rounded-2xl border border-primary/20 relative group overflow-hidden">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                {(existingImages.length === 0 && previews.length === 0) && (
                    <div className="aspect-square bg-slate-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-slate-300 italic text-[10px] font-bold text-center p-4">
                        Aucun média sélectionné
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary/10 space-y-4 flex flex-col">
            <button 
                type="submit"
                disabled={saving}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? "Sceller les modifs" : "Publier l'annonce"}
            </button>
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-4 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors outline-none"
            >
              Annuler & Sortir
            </button>
          </div>
        </div>
      </form>

      <ConfirmModal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={removeExistingImage}
        title="Supprimer l'image"
        message="Voulez-vous vraiment supprimer cette image définitivement ?"
        confirmLabel="Oui, supprimer"
        variant="danger"
      />
    </div>
  );
}
