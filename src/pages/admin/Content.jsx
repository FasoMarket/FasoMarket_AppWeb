import { useState, useEffect } from 'react';
import { adminAdvancedService } from '../../services/adminAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { Image as ImageIcon, Plus, Edit, Trash2, Loader2, Search, X, Check, Star, Tag, Store, Calendar } from 'lucide-react';

const EMPTY_BANNER = { title: '', subtitle: '', link: '', position: 'hero', isActive: true };
const POSITIONS = { hero: 'Carrousel Principal', home_middle: 'Milieu de page', home_bottom: 'Bas de page' };

export default function AdminContent() {
  const [banners,     setBanners]     = useState([]);
  const [featured,    setFeatured]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('banners'); // 'banners' | 'featured'
  
  // Modals state
  const [bannerModal, setBannerModal] = useState(false);
  const [editBanner,  setEditBanner]  = useState(null);
  const [bannerForm,  setBannerForm]  = useState(EMPTY_BANNER);
  const [imageFile,   setImageFile]   = useState(null);
  const [imagePreview,setImagePreview]= useState(null);
  
  const [featModal,   setFeatModal]   = useState(false);
  const [featForm,    setFeatForm]    = useState({ type: 'product', refId: '' });
  
  const [toDelete,    setToDelete]    = useState(null); // { id, type: 'banner' | 'featured' }
  const [saving,      setSaving]      = useState(false);
  const { showToast } = useToast();

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'banners') {
        const res = await adminAdvancedService.getBanners();
        setBanners(res.data.banners || []);
      } else {
        const res = await adminAdvancedService.getFeatured();
        setFeatured(res.data.featured || []);
      }
    } catch { showToast('Erreur de chargement', 'error'); }
    finally { setLoading(false); }
  };

  /* ── BANNIÈRES ── */
  const openBannerCreate = () => { setEditBanner(null); setBannerForm(EMPTY_BANNER); setImageFile(null); setImagePreview(null); setBannerModal(true); };
  const openBannerEdit = (b) => {
    setEditBanner(b);
    setBannerForm({ title: b.title, subtitle: b.subtitle || '', link: b.link || '', position: b.position, isActive: b.isActive });
    setImageFile(null); setImagePreview(import.meta.env.VITE_API_URL + b.image);
    setBannerModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const saveBanner = async (e) => {
    e.preventDefault();
    if (!editBanner && !imageFile) return showToast('Image requise', 'error');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(bannerForm).forEach(k => fd.append(k, bannerForm[k]));
      if (imageFile) fd.append('image', imageFile);

      if (editBanner) {
        const res = await adminAdvancedService.updateBanner(editBanner._id, fd);
        setBanners(prev => prev.map(b => b._id === editBanner._id ? res.data.banner : b));
        showToast('Bannière mise à jour', 'success');
      } else {
        const res = await adminAdvancedService.createBanner(fd);
        setBanners(prev => [...prev, res.data.banner]);
        showToast('Bannière créée', 'success');
      }
      setBannerModal(false);
    } catch (err) { showToast(err.response?.data?.message || 'Erreur', 'error'); }
    finally { setSaving(false); }
  };

  const toggleBanner = async (b) => {
    try {
      await adminAdvancedService.toggleBanner(b._id);
      setBanners(prev => prev.map(x => x._id === b._id ? { ...x, isActive: !x.isActive } : x));
    } catch { showToast('Erreur', 'error'); }
  };

  /* ── EN VEDETTE ── */
  const saveFeatured = async (e) => {
    e.preventDefault();
    if (!featForm.refId.trim()) return;
    setSaving(true);
    try {
      const res = await adminAdvancedService.addFeatured(featForm);
      setFeatured(prev => [...prev, res.data.featured]); // Requires a reload to get populated ref
      showToast('Ajouté à la sélection', 'success');
      setFeatModal(false);
      load();
    } catch { showToast('Erreur', 'error'); }
    finally { setSaving(false); }
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    try {
      if (toDelete.type === 'banner') {
        await adminAdvancedService.deleteBanner(toDelete.id);
        setBanners(prev => prev.filter(b => b._id !== toDelete.id));
      } else {
        await adminAdvancedService.removeFeatured(toDelete.id);
        setFeatured(prev => prev.filter(f => f._id !== toDelete.id));
      }
      showToast('Élément supprimé', 'success');
    } catch { showToast('Erreur suppression', 'error'); }
    finally { setToDelete(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ImageIcon size={24} className="text-primary" /> Contenu Vitrine
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Personnalisez l'accueil et mettez en avant vos meilleurs éléments</p>
        </div>
        <button onClick={tab === 'banners' ? openBannerCreate : () => { setFeatForm({ type: 'product', refId: '' }); setFeatModal(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <Plus size={18} strokeWidth={3} /> {tab === 'banners' ? 'Nouvelle bannière' : 'Mettre en vedette'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-2">
        {[ { id: 'banners', label: 'Bannières', Icon: ImageIcon }, { id: 'featured', label: 'Sélection En Vedette', Icon: Star } ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 px-6 py-3 rounded-t-2xl text-sm font-black transition-all',
              tab === t.id ? 'bg-white text-primary border-t-2 border-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:text-gray-900')}>
            <t.Icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={32} className="text-primary animate-spin" /></div>
      ) : tab === 'banners' ? (
        /* ── BANNIÈRES LIST ── */
        banners.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
            Aucune bannière configurée
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map(b => (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                <div className="aspect-[21/9] bg-gray-100 relative">
                  <img src={import.meta.env.VITE_API_URL + b.image} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => openBannerEdit(b)} className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Edit size={16} /></button>
                    <button onClick={() => setToDelete({ id: b._id, type: 'banner' })} className="w-10 h-10 bg-white text-rose-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-gray-900 text-sm truncate">{b.title}</h3>
                    <button onClick={() => toggleBanner(b)} className={cn('px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 transition-colors', b.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
                      {b.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate mb-3">{b.subtitle || '—'}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{POSITIONS[b.position]}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ── FEATURED LIST ── */
        featured.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
            Aucun élément en vedette
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(f => (
              <div key={f._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center group">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  <img src={f.type === 'product' && f.ref?.images?.length ? `${import.meta.env.VITE_API_URL}${f.ref.images[0]}` : f.type === 'store' && f.ref?.logo ? `${import.meta.env.VITE_API_URL}${f.ref.logo}` : '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-1.5 inline-block', f.type === 'product' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600')}>
                    {f.type === 'product' ? 'Produit' : 'Boutique'}
                  </span>
                  <p className="font-black text-gray-900 text-sm truncate">{f.ref?.name || 'Inconnu'}</p>
                  {f.type === 'product' && <p className="text-xs font-bold text-primary mt-1">{(f.ref?.price || 0).toLocaleString()} FCFA</p>}
                </div>
                <button onClick={() => setToDelete({ id: f._id, type: 'featured' })} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-rose-100">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Banner Modal */}
      <Modal isOpen={bannerModal} onClose={() => setBannerModal(false)} title={<span className="flex items-center gap-2"><ImageIcon className="text-primary" size={18} />{editBanner ? 'Modifier bannière' : 'Nouvelle bannière'}</span>} size="md">
        <form onSubmit={saveBanner} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Titre principal *</label>
              <input required value={bannerForm.title} onChange={e => setBannerForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Sous-titre / Texte</label>
              <input value={bannerForm.subtitle} onChange={e => setBannerForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Position</label>
              <select value={bannerForm.position} onChange={e => setBannerForm(f => ({ ...f, position: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all">
                {Object.entries(POSITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Lien (URL)</label>
              <input value={bannerForm.link} onChange={e => setBannerForm(f => ({ ...f, link: e.target.value }))} placeholder="Ex: /category/mode" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-primary transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Image *</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-colors h-32 flex items-center justify-center bg-gray-50">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {imagePreview ? <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview"/> : <div className="text-center"><ImageIcon size={24} className="text-gray-300 mx-auto mb-1" /><p className="text-xs font-bold text-gray-400">Cliquez pour ajouter</p></div>}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button type="button" onClick={() => setBannerModal(false)} className="px-5 py-2.5 text-xs font-black text-gray-600 rounded-xl hover:bg-gray-50 transition-all">Annuler</button>
            <button type="submit" disabled={saving || (!editBanner && !imageFile)} className="px-6 py-2.5 text-xs font-black bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {editBanner ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Featured Modal */}
      <Modal isOpen={featModal} onClose={() => setFeatModal(false)} title={<span className="flex items-center gap-2"><Star className="text-primary" size={18} />Mettre en vedette</span>} size="sm">
        <form onSubmit={saveFeatured} className="space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {[ { id: 'product', label: 'Produit', Icon: Tag }, { id: 'store', label: 'Boutique', Icon: Store } ].map(t => (
              <button key={t.id} type="button" onClick={() => setFeatForm(f => ({ ...f, type: t.id }))}
                className={cn('flex-1 py-2 text-xs font-black rounded-lg flex items-center justify-center gap-2 transition-all', featForm.type === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
                <t.Icon size={14} /> {t.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">ID du {featForm.type === 'product' ? 'Produit' : 'Vendeur / Boutique'} *</label>
            <input required value={featForm.refId} onChange={e => setFeatForm(f => ({ ...f, refId: e.target.value.trim() }))} placeholder="Ex: 60d5ecb..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-sm tracking-widest focus:ring-2 focus:ring-primary transition-all" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setFeatModal(false)} className="px-5 py-2.5 text-xs font-black text-gray-600 rounded-xl hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving || !featForm.refId.trim()} className="px-6 py-2.5 text-xs font-black bg-primary text-white rounded-xl shadow-lg disabled:opacity-60 flex gap-2 items-center">
              {saving ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Valider
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete} title="Confirmer la suppression" message={toDelete?.type === 'banner' ? 'Supprimer cette bannière ?' : 'Retirer cet élément de la sélection ?'} confirmLabel="Confirmer" variant="danger" />
    </div>
  );
}
