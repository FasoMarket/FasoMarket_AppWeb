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
  Calendar
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [images, setImages] = useState([]);
  const [hasPromotion, setHasPromotion] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Alimentation',
    brand: '',
    description: '',
    price: '',
    stock: ''
  });

  // Simulate fetching data if editing
  useEffect(() => {
    if (isEditing) {
      // Dummy data for edit mode
      setFormData({
        name: 'Montre Classique',
        category: 'Accessoires',
        brand: 'Faso Time',
        description: 'Une superbe montre en cuir...',
        price: '55000',
        stock: '4'
      });
      setHasPromotion(true);
      setDiscountType('fixed');
    }
  }, [id, isEditing]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}
            </h1>
            <p className="text-sm text-slate-500">
              {isEditing 
                ? "Mettez à jour les informations de votre produit ci-dessous." 
                : "Remplissez les détails ci-dessous pour publier votre produit."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-6">
            <h3 className="text-lg font-bold border-b border-primary/5 pb-4">Informations de base</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom du Produit</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                  placeholder="Ex: Panier de légumes bio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catégorie</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option>Alimentation</option>
                    <option>Artisanat</option>
                    <option>Maroquinerie</option>
                    <option>Accessoires</option>
                    <option>Electronique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Marque (Optionnel)</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                    placeholder="Ex: Faso Cuir"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea 
                  rows={4} 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm resize-none" 
                  placeholder="Décrivez votre produit en détail..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-6">
            <h3 className="text-lg font-bold border-b border-primary/5 pb-4">Prix & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prix (FCFA)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantité en stock</label>
                <input 
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Promotion Section (Optional) */}
          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-primary" />
                <h3 className="text-lg font-bold">Promotion (Optionnel)</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={hasPromotion}
                  onChange={() => setHasPromotion(!hasPromotion)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {hasPromotion && (
              <div className="space-y-6 transition-all animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type de remise</label>
                    <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all outline-none ${discountType === 'percentage' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Pourcentage (%)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all outline-none ${discountType === 'fixed' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Montant fixe
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valeur de la remise</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        defaultValue={discountType === 'percentage' ? '20' : '5000'}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                        placeholder={discountType === 'percentage' ? '20' : '5000'}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                         {discountType === 'percentage' ? <Percent size={14} /> : <span className="text-[10px] font-bold">FCFA</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar size={14} /> Date de début
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar size={14} /> Date de fin
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-6">
            <h3 className="text-lg font-bold border-b border-primary/5 pb-4">Médias</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:bg-primary/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-primary">Cliquez pour uploader</span>
                  <p className="text-slate-500 mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300">
                  <ImageIcon size={24} />
                </div>
                <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300">
                  <ImageIcon size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm space-y-4">
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Save size={20} />
              {isEditing ? "Enregistrer les modifications" : "Publier le produit"}
            </button>
            <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all outline-none">
              Enregistrer comme brouillon
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all outline-none"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
