import { cn } from '../../utils/cn';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  X,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { vendorService } from '../../services/vendorService';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import NoShopState from '../../components/NoShopState';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProductUpdates } from '../../hooks/useProductUpdates';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasNoStore, setHasNoStore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle real-time product updates
  useProductUpdates(
    (updatedProduct) => {
      setProducts(prev => {
        const index = prev.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          const newProducts = [...prev];
          newProducts[index] = updatedProduct;
          return newProducts;
        }
        return prev;
      });
      showToast('Produit mis à jour en temps réel', 'info');
    },
    (deletedProductId) => {
      setProducts(prev => prev.filter(p => p._id !== deletedProductId));
      showToast('Produit supprimé en temps réel', 'info');
    }
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setHasNoStore(false);
      // Get vendor's store directly from user context
      const storeRes = await vendorService.getMyStore();
      const storeData = storeRes.data?.data || storeRes.data;
      const storeId = storeData?._id || storeData?.id;
      
      if (storeId) {
        const res = await productService.getAll({ store: storeId, limit: 100 });
        setProducts(res.data.data || res.data || []);
      } else {
        setHasNoStore(true);
      }
    } catch (err) {
      console.error('Erreur chargement produits:', err);
      // Vérifier si c'est une erreur 404 (pas de boutique)
      if (err.response?.status === 404) {
        setHasNoStore(true);
      } else {
        setError('Impossible de charger vos produits.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await productService.delete(productToDelete._id);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setProductToDelete(null);
      showToast('Produit supprimé avec succès', 'success');
    } catch (err) {
      console.error('Erreur suppression:', err);
      showToast('Erreur lors de la suppression du produit.', 'error');
    } finally {
      setDeleting(false);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase">Mes Produits</h1>
            <p className="text-slate-500 font-medium">Gérez votre catalogue de produits</p>
          </div>
        </div>
        <NoShopState variant="compact" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-black" 
            placeholder="Rechercher un produit..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium text-sm">
            <Filter size={18} />
            Filtrer
          </button>
          <Link to="/vendor/products/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-sm shadow-md shadow-primary/20">
            <Plus size={18} />
            Ajouter
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Produit</th>
                <th className="px-6 py-4 font-semibold">Catégorie</th>
                <th className="px-6 py-4 font-semibold">Prix</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <img src={product.images?.[0] || product.image || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium italic">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{product.price.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-black text-xs uppercase",
                      product.stock === 0 ? "text-red-500" : product.stock < 5 ? "text-orange-500" : "text-emerald-500"
                    )}>
                      {product.stock} dispo.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
                        title="Voir"
                      >
                        <Eye size={18} />
                      </button>
                      <Link to={`/vendor/products/edit/${product._id}`} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => setProductToDelete(product)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs italic">
              Aucun produit trouvé.
            </div>
          )}
        </div>
      </div>      {/* View Modal */}
      <Modal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        title={
          <span className="flex items-center gap-2">
            <Eye className="text-primary" size={20} /> Détails du Produit
          </span>
        } 
        size="md"
      >
        {selectedProduct && (
          <div className="flex flex-col gap-6">
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-sm transition-transform hover:scale-105 duration-700">
              <img src={selectedProduct.images?.[0] || selectedProduct.image || '/placeholder.png'} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter">{selectedProduct.name}</h4>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                  {selectedProduct.category}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix de vente</p>
                  <p className="text-2xl font-black text-slate-900">{selectedProduct.price.toLocaleString()} <span className="text-xs">FCFA</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Disponible</p>
                  <p className={cn("text-2xl font-black", selectedProduct.stock === 0 ? "text-red-500" : "text-emerald-500")}>
                    {selectedProduct.stock} PCS
                  </p>
                </div>
                <div className="col-span-2 pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{selectedProduct.description}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all outline-none"
              >
                Fermer
              </button>
              <Link 
                to={`/vendor/products/edit/${selectedProduct._id}`}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 outline-none"
              >
                <Edit size={16} /> Modifier
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer ce produit ?"
        message={productToDelete ? `"${productToDelete.name}" sera définitivement supprimé. Cette action est irréversible.` : ''}
        confirmLabel="Oui, supprimer"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
