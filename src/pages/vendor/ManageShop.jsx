import { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Image as ImageIcon,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { storeService } from '../../services/storeService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import NoShopState from '../../components/NoShopState';

export default function ManageShop() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState(null);
  const [hasNoStore, setHasNoStore] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [previews, setPreviews] = useState({ logo: null, banner: null });
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  });

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await vendorAdvancedService.getMyStore();
      // La réponse API est: { success, message, data: { store } }
      const s = res.data?.data || res.data;
      
      if (!s || (!s._id && !s.id)) {
        setStore(null);
        setHasNoStore(true);
        return;
      }
      
      // Le backend peut retourner `id` ou `_id` selon l'endpoint
      const storeWithId = { ...s, _id: s._id || s.id };
      setStore(storeWithId);
      setHasNoStore(false);
      setFormData({
        name: s.name || '',
        description: s.description || '',
        phone: s.phone || '',
        address: s.address || '',
        socialLinks: {
          facebook: s.socialLinks?.facebook || '',
          instagram: s.socialLinks?.instagram || '',
          twitter: s.socialLinks?.twitter || '',
          youtube: s.socialLinks?.youtube || ''
        }
      });
      setPreviews({ logo: s.logo, banner: s.banner });
    } catch (err) {
      // Si la boutique n'existe pas (404), afficher l'état de création
      if (err.response?.status === 404) {
        setStore(null);
        setHasNoStore(true);
      } else {
        console.error('Erreur chargement boutique:', err);
        showToast('Erreur chargement boutique', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result }));
    };
    reader.readAsDataURL(file);

    // Keep file for submit
    setFormData(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('socialLinks', JSON.stringify(formData.socialLinks));
      
      if (formData.logo instanceof File) data.append('logo', formData.logo);
      if (formData.banner instanceof File) data.append('banner', formData.banner);

      if (store?._id) {
        // Update existing store
        await storeService.update(store._id, data);
        showToast('Boutique mise à jour avec succès', 'success');
        fetchStore();
      } else {
        // Create new store
        const res = await storeService.create(data);
        const storeData = res.data?.data || res.data;
        // Normaliser l'ID (backend peut retourner `id` ou `_id`)
        const newStore = { ...storeData, _id: storeData._id || storeData.id };
        
        // Mettre à jour l'état avec la nouvelle boutique
        setStore(newStore);
        setHasNoStore(false);
        setShowCreateForm(false);
        setJustCreated(true);
        
        // Mettre à jour les previews avec les données du serveur
        setPreviews({ 
          logo: newStore?.logo || null, 
          banner: newStore?.banner || null 
        });
        
        // Mettre à jour le formData avec les données réelles
        setFormData({
          name: newStore?.name || '',
          description: newStore?.description || '',
          phone: newStore?.phone || '',
          address: newStore?.address || '',
          socialLinks: {
            facebook: newStore?.socialLinks?.facebook || '',
            instagram: newStore?.socialLinks?.instagram || '',
            twitter: newStore?.socialLinks?.twitter || '',
            youtube: newStore?.socialLinks?.youtube || ''
          }
        });
        
        showToast('🎉 Boutique créée avec succès !', 'success');
      }
    } catch (err) {
      console.error('Erreur:', err);
      showToast(err.response?.data?.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStartCreation = () => {
    setShowCreateForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  // Afficher l'état "Pas de boutique" si le vendeur n'a pas encore de boutique
  if (hasNoStore && !showCreateForm) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <NoShopState variant="full" onCreateClick={handleStartCreation} />
      </div>
    );
  }

  // Écran de succès après création de la boutique
  if (justCreated && store) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Success Animation */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-[2rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-slate-900">
              🎉 Félicitations !
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Votre boutique <span className="font-black text-primary">"{store.name}"</span> est créée !
            </p>
            <p className="text-slate-400">
              Vous pouvez maintenant ajouter des produits et commencer à vendre.
            </p>
          </div>

          {/* Store Preview Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                {store.logo ? (
                  <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">{store.name}</h3>
                {store.address && <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={14} /> {store.address}</p>}
              </div>
            </div>
            {store.description && (
              <p className="text-sm text-slate-500 italic border-t border-slate-50 pt-4">{store.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/vendor/products/new')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25"
            >
              <Plus size={20} />
              Ajouter mon premier produit
            </button>
            <button
              onClick={() => setJustCreated(false)}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              <Save size={18} />
              Personnaliser ma boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de création/édition
  const isCreating = !store?._id;

  return (
    <div ref={formRef} className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header avec indication création/édition */}
      {isCreating && (
        <div className="bg-gradient-to-r from-primary/10 to-amber-50 p-6 rounded-[2rem] border border-primary/20 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Créez votre boutique</h2>
              <p className="text-slate-500">Remplissez les informations ci-dessous pour lancer votre activité</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase">
            {isCreating ? 'Nouvelle Boutique' : 'Identité Visuelle'}
          </h1>
          <p className="text-slate-500 font-medium">
            {isCreating ? 'Configurez votre boutique pour commencer à vendre.' : 'Personnalisez l\'image de marque de votre boutique.'}
          </p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving || !formData.name}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : isCreating ? <Plus size={20} /> : <Save size={20} />}
          {isCreating ? 'Créer ma boutique' : 'Enregistrer les modifications'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Previews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Banner Upload */}
          <div className="relative group">
            <div className="h-64 rounded-[2.5rem] bg-slate-200 overflow-hidden border-4 border-white shadow-xl relative">
              {previews.banner ? (
                <img src={previews.banner} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                  <ImageIcon size={48} />
                  <p className="text-xs font-bold uppercase tracking-widest mt-2">Aucune bannière</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <label className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl font-bold text-slate-800 cursor-pointer hover:bg-white transition-all shadow-lg">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                  Changer la bannière
                </label>
              </div>
            </div>

            {/* Logo Upload overlap */}
            <div className="absolute -bottom-10 left-12 group/logo">
              <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-2xl relative overflow-hidden ring-4 ring-white">
                {previews.logo ? (
                  <img src={previews.logo} alt="Logo" className="w-full h-full object-cover rounded-[1.8rem]" />
                ) : (
                  <div className="w-full h-full rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-slate-300">
                    <Store size={32} />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                  <Camera size={24} className="text-white" />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Infos Générales</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Public</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                    placeholder="Parlez-nous de l'univers de votre boutique..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Contact & Localisation</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone Client</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="+226 XX XX XX XX"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Physique</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Ex: Ouagadougou, Zone 1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Socials */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Réseaux Sociaux</h3>
            <div className="space-y-4">
              {[
                { id: 'facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
                { id: 'twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
                { id: 'youtube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((social) => (
                <div key={social.id} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{social.id}</label>
                  <div className="relative group">
                    <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all", social.bg, social.color)}>
                      <social.icon size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={formData.socialLinks[social.id] || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, [social.id]: e.target.value } 
                      })}
                      placeholder={`Lien ${social.id}...`}
                      className="w-full pl-16 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Store size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm italic italic uppercase">Visibilité</h4>
                <p className="text-[10px] text-slate-500 font-bold">
                  {isCreating 
                    ? 'Votre boutique sera visible dès sa création.'
                    : 'Votre boutique est visible par tous les clients de FasoMarket.'
                  }
                </p>
              </div>
            </div>
            {!isCreating && (
              <button 
                onClick={() => window.open(`/shop/${store?.slug}`, '_blank')}
                className="w-full py-3 bg-white border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
              >
                Voir ma boutique publique
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
