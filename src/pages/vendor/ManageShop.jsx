import { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { storeService } from '../../services/storeService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function ManageShop() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState(null);
  const [previews, setPreviews] = useState({ logo: null, banner: null });

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
      const s = res.data;
      setStore(s);
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
      showToast('Erreur chargement boutique', 'error');
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

      await storeService.update(store._id, data);
      showToast('Boutique mise à jour avec succès', 'success');
      fetchStore();
    } catch (err) {
      showToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase">Identité Visuelle</h1>
          <p className="text-slate-500 font-medium">Personnalisez l'image de marque de votre boutique.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Enregistrer les modifications
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
                <p className="text-[10px] text-slate-500 font-bold">Votre boutique est visible par tous les clients de FasoMarket.</p>
              </div>
            </div>
            <button 
              onClick={() => window.open(`/shop/${store?.slug}`, '_blank')}
              className="w-full py-3 bg-white border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              Voir ma boutique publique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
