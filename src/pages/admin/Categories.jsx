import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Tag, Loader2, X, Check,
  LayoutGrid, Hash, ShoppingBag, Shirt, Leaf, Smartphone,
  Home, Apple, Palette, Wrench, Music, Book, Gem, Heart,
  Coffee, Camera, Globe, Star, Zap, Truck, Award, Package,
  ChevronRight, RefreshCw, AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

// ── Icon registry ─────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { id: 'ShoppingBag', label: 'Shopping',   Icon: ShoppingBag },
  { id: 'Shirt',       label: 'Mode',       Icon: Shirt },
  { id: 'Leaf',        label: 'Nature',     Icon: Leaf },
  { id: 'Smartphone',  label: 'Tech',       Icon: Smartphone },
  { id: 'Home',        label: 'Maison',     Icon: Home },
  { id: 'Apple',       label: 'Aliment',    Icon: Apple },
  { id: 'Palette',     label: 'Art',        Icon: Palette },
  { id: 'Wrench',      label: 'Outils',     Icon: Wrench },
  { id: 'Music',       label: 'Musique',    Icon: Music },
  { id: 'Book',        label: 'Livres',     Icon: Book },
  { id: 'Gem',         label: 'Bijoux',     Icon: Gem },
  { id: 'Heart',       label: 'Santé',      Icon: Heart },
  { id: 'Coffee',      label: 'Café',       Icon: Coffee },
  { id: 'Camera',      label: 'Photo',      Icon: Camera },
  { id: 'Globe',       label: 'Voyage',     Icon: Globe },
  { id: 'Star',        label: 'Premium',    Icon: Star },
  { id: 'Zap',         label: 'Énergie',    Icon: Zap },
  { id: 'Truck',       label: 'Livraison',  Icon: Truck },
  { id: 'Award',       label: 'Artisanat',  Icon: Award },
  { id: 'Package',     label: 'Divers',     Icon: Package },
];

function resolveIcon(id) {
  return ICON_OPTIONS.find(o => o.id === id)?.Icon || Tag;
}

// ── Color Palette ─────────────────────────────────────────────────────────────
const COLORS = [
  { idx: 0, light: 'bg-emerald-50', dark: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-400' },
  { idx: 1, light: 'bg-orange-50',  dark: 'bg-orange-500',  text: 'text-orange-700',  border: 'border-orange-200',  ring: 'ring-orange-400' },
  { idx: 2, light: 'bg-blue-50',    dark: 'bg-blue-500',    text: 'text-blue-700',    border: 'border-blue-200',    ring: 'ring-blue-400' },
  { idx: 3, light: 'bg-violet-50',  dark: 'bg-violet-500',  text: 'text-violet-700',  border: 'border-violet-200',  ring: 'ring-violet-400' },
  { idx: 4, light: 'bg-rose-50',    dark: 'bg-rose-500',    text: 'text-rose-700',    border: 'border-rose-200',    ring: 'ring-rose-400' },
  { idx: 5, light: 'bg-amber-50',   dark: 'bg-amber-500',   text: 'text-amber-700',   border: 'border-amber-200',   ring: 'ring-amber-400' },
  { idx: 6, light: 'bg-cyan-50',    dark: 'bg-cyan-500',    text: 'text-cyan-700',    border: 'border-cyan-200',    ring: 'ring-cyan-400' },
  { idx: 7, light: 'bg-pink-50',    dark: 'bg-pink-500',    text: 'text-pink-700',    border: 'border-pink-200',    ring: 'ring-pink-400' },
  { idx: 8, light: 'bg-teal-50',    dark: 'bg-teal-500',    text: 'text-teal-700',    border: 'border-teal-200',    ring: 'ring-teal-400' },
  { idx: 9, light: 'bg-indigo-50',  dark: 'bg-indigo-500',  text: 'text-indigo-700',  border: 'border-indigo-200',  ring: 'ring-indigo-400' },
];

function color(idx) { return COLORS[idx ?? 0] || COLORS[0]; }

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

const EMPTY_FORM = { name: '', description: '', icon: 'ShoppingBag', colorIdx: 0 };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [toDelete, setToDelete]       = useState(null);
  const [saving, setSaving]           = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const { showToast } = useToast();

  /* ─── Fetch ─── */
  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setApiError(false);
      const res = await adminService.getCategories();
      setCategories(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Filtered list ─── */
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ─── Modal open/close ─── */
  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setIsModalOpen(true); };
  const openEdit   = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || 'ShoppingBag', colorIdx: cat.colorIdx ?? 0 });
    setIsModalOpen(true);
  };

  /* ─── Save ─── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, slug: slugify(form.name) };
    try {
      if (editTarget) {
        const res = await adminService.updateCategory(editTarget._id, payload);
        const updated = res.data?.data || { ...editTarget, ...payload };
        setCategories(prev => prev.map(c => c._id === editTarget._id ? updated : c));
        showToast('Catégorie mise à jour', 'success');
      } else {
        const res = await adminService.createCategory(payload);
        const created = res.data?.data || { ...payload, _id: Date.now().toString(), productCount: 0 };
        setCategories(prev => [created, ...prev]);
        showToast('Catégorie créée avec succès', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminService.deleteCategory(toDelete._id);
      setCategories(prev => prev.filter(c => c._id !== toDelete._id));
      showToast('Catégorie supprimée', 'success');
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setToDelete(null);
    }
  };

  /* ─── Stat bar ─── */
  const totalProducts = categories.reduce((a, c) => a + (c.productCount || 0), 0);

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <LayoutGrid size={24} className="text-primary" />
            Catalogues &amp; Catégories
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Gérez les catégories et organisez votre catalogue produits
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          Nouvelle catégorie
        </button>
      </div>

      {/* ── API Error Banner ── */}
      {apiError && (
        <div className="flex items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-bold">Impossible de joindre le serveur. Vérifiez que le backend est actif.</p>
          </div>
          <button onClick={fetchCategories} className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-xl text-xs font-black transition-all">
            <RefreshCw size={14} /> Réessayer
          </button>
        </div>
      )}

      {/* ── Stat strip ── */}
      {!loading && !apiError && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Catégories', value: categories.length, Icon: LayoutGrid, color: 'text-primary bg-primary/10' },
            { label: 'Produits total', value: totalProducts.toLocaleString(), Icon: Package, color: 'text-blue-600 bg-blue-50' },
            { label: 'Avg / catégorie', value: categories.length ? Math.round(totalProducts / categories.length) : 0, Icon: Hash, color: 'text-violet-600 bg-violet-50' },
            { label: 'Sans produits', value: categories.filter(c => !c.productCount).length, Icon: Tag, color: 'text-rose-600 bg-rose-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.color)}>
                <s.Icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{s.label}</p>
                <p className="text-xl font-black text-gray-900 leading-tight mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Search ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3 px-4 py-2">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher une catégorie…"
          className="flex-1 bg-transparent py-2 text-sm font-bold text-gray-700 placeholder-gray-300 outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={16} />
          </button>
        )}
        {!loading && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 size={36} className="text-primary animate-spin" />
          <p className="text-sm font-bold text-gray-400">Chargement des catégories…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 py-24 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-gray-200" />
          </div>
          <p className="font-black text-gray-900 mb-1">
            {searchTerm ? 'Aucun résultat' : 'Aucune catégorie'}
          </p>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto mb-6">
            {searchTerm ? `Aucune catégorie ne correspond à "${searchTerm}"` : 'Commencez par créer votre première catégorie de produits.'}
          </p>
          {!searchTerm && (
            <button onClick={openCreate} className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Créer une catégorie
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <div className="col-span-5">Catégorie</div>
            <div className="col-span-4 hidden md:block">Description</div>
            <div className="col-span-2 text-center">Produits</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {filtered.map(cat => {
              const c = color(cat.colorIdx);
              const CatIcon = resolveIcon(cat.icon);
              return (
                <div key={cat._id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/60 transition-colors group">
                  {/* Icon + name + slug */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', c.light, c.text)}>
                      <CatIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{cat.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">{cat.slug || slugify(cat.name)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-span-4 hidden md:block">
                    <p className="text-sm text-gray-500 font-medium truncate">{cat.description || <span className="text-gray-300 italic">Aucune description</span>}</p>
                  </div>

                  {/* Product count */}
                  <div className="col-span-2 flex justify-center">
                    <span className={cn('px-3 py-1 rounded-full text-[11px] font-black', c.light, c.text)}>
                      {cat.productCount ?? 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Modifier"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setToDelete(cat)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <span className="flex items-center gap-2">
            <Tag className="text-primary" size={18} />
            {editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </span>
        }
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Nom *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex : Mode & Textile"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-sm transition-all"
            />
            {form.name && (
              <p className="text-[10px] font-bold text-gray-400 mt-1 ml-1">
                Slug : <span className="text-gray-600">{slugify(form.name)}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brève description de la catégorie…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-sm resize-none transition-all"
            />
          </div>

          {/* Two cols: icon + color */}
          <div className="grid grid-cols-2 gap-5">
            {/* Icon picker */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Icône</label>
              <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {ICON_OPTIONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, icon: id }))}
                    title={label}
                    className={cn(
                      'flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl text-[9px] font-bold transition-all border',
                      form.icon === id
                        ? 'bg-primary/10 text-primary border-primary/30 scale-105'
                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300 hover:bg-white'
                    )}
                  >
                    <Icon size={18} />
                    <span className="truncate w-full text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Couleur</label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.idx}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, colorIdx: c.idx }))}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all border-2',
                      c.dark,
                      form.colorIdx === c.idx ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent hover:scale-110'
                    )}
                  >
                    {form.colorIdx === c.idx && <Check size={14} className="text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>

              {/* Live Preview */}
              {form.name && (
                <div className="mt-4">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Aperçu</label>
                  <div className={cn('flex items-center gap-3 p-3 rounded-xl border', color(form.colorIdx).light, color(form.colorIdx).border)}>
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', color(form.colorIdx).text, color(form.colorIdx).light)}>
                      {(() => { const Icon = resolveIcon(form.icon); return <Icon size={18} />; })()}
                    </div>
                    <div className="min-w-0">
                      <p className={cn('font-black text-sm truncate', color(form.colorIdx).text)}>{form.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">{slugify(form.name)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {editTarget ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Confirm Delete ── */}
      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la catégorie"
        message={toDelete ? `"${toDelete.name}" sera définitivement supprimée. Cette action est irréversible.` : ''}
        confirmLabel="Oui, supprimer"
        variant="danger"
      />
    </div>
  );
}
