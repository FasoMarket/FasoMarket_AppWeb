import { useState, useEffect } from 'react';
import { clientAdvancedService } from '../../services/clientAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await clientAdvancedService.getWishlist();
      setProducts(res.data.products || []);
    } catch (err) {
      showToast('Erreur chargement favoris', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await clientAdvancedService.removeFromWishlist(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      showToast('Produit retiré des favoris', 'success');
    } catch {
      showToast('Erreur lors du retrait', 'error');
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/10 relative group">
            <Heart size={32} className="fill-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Mes Favoris</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Vos coups de cœur sauvegardés</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Heart size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun favori pour le moment</h3>
          <p className="text-slate-500 mb-6">Explorez notre catalogue et enregistrez les articles qui vous plaisent.</p>
          <Link to="/" className="text-primary font-bold hover:underline">Découvrir les produits →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 group relative">
              <Link to={`/products/${product._id}`} className="block h-48 rounded-2xl bg-slate-50 overflow-hidden mb-4 relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">Sans image</div>
                )}
              </Link>
              <button 
                onClick={(e) => { e.preventDefault(); handleRemove(product._id); }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart size={18} className="fill-red-500" />
              </button>
              <div>
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-bold text-slate-800 truncate hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">{product.vendor?.name}</p>
                <p className="font-black text-primary text-lg">{product.price?.toLocaleString()} <span className="text-xs">FCFA</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
