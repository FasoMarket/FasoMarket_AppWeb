import { cn } from '../../utils/cn';
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  X,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';


const initialProducts = [
  { id: 1, name: 'Baskets de Course', category: 'Chaussures', price: '25.000 FCFA', stock: 8, status: 'Actif', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOeoDHCT4yarBqXnn_qtX2RMk-Tmf7k66WCb1og8HwRkfb9e7LLGeB0PDbr1PAzM8cyJfiA_X_extzhIIqAjUAIq1A4rRTrjLxlvQpm2OUPTH2IuFqMIZJW62lUUK3PW4D745o6w-8eaWTyqZGnnT3UxHLYRWk3lAWrRzR46bKQW4AZFuOb9NChC7aLdGeteBwCPvzz6bqhOuNdtRS8wvkmaMrNNugG3aQ8uhPScLnrRfFcjsWyL-9dD62QuEA9AcygqCXkpWpOLNi' },
  { id: 2, name: 'Montre Classique', category: 'Accessoires', price: '55.000 FCFA', stock: 4, status: 'Actif', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_msJuOWwSlWhTAvb0hlPwQLGiV7EPgaauWIvk9DGkjt16t3ZZDO62M4q8LmbViqoQAvOyUGox19wihUQ5mvjEhaoyTbw37tVJNZmCe4O9w14-zlNPJAEsplojUuW7--_SD60B1RTAzaZh29EPfGqGorKDXEyleD_VZ5CFVceLDBI1xWY5s1FVpEI2Kb3Y6wJJlHA-eON7iqs1cVPRebR8L6h3P7-MOUkNO--Pkb3yPKY5iIEt7jhqNBKbO4gyGFwMm4BKEybCY7GS' },
  { id: 3, name: 'Casque Audio Pro', category: 'Electronique', price: '18.000 FCFA', stock: 12, status: 'En rupture', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLX1euLha56kPmz0_EVYKx4qMZjayObzqnctkAEsBaTKfvHxe9DfamkNVfwAEJU01kJWjmpSvfq1ApCLf_W4MIsOdEyZxftqxq6HcqHTbFVD75dvz3y2bvTgz_3sGonrMF0uUKcG0XgBJraQP4cQCn1XpKAWgLJszT6CD8NAms4T2G4m6Mjh8gcPBZh6rv_0iIgmd34ZjjL7s5y3BK9SXFzYilqg2_KrfhEpJ-G8Ob8nxYPEKtMaQSaXZ1sSZIcctbFgWkL8wB5eoh' },
  { id: 4, name: 'Sac à Main Cuir', category: 'Accessoires', price: '35.000 FCFA', stock: 0, status: 'Actif', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYWOGDTouctnb7rtxz1gmpoXiu_D0Rhy1oPpFzPrfm24sNYlruWMpL2vY3wHu_UAHu_szCrakTcIHq4owstc5reTQaZjt904v1L4EA2sDJYO_16_fat-KNZ60nb5PA6M_A3sdy0aOKYxcAaZG76XGpAvnKwxgzgZZE65cXf1StjqBCT14AdOwYohlYw8u1U9q1tUMPgX3jfrmajyKW8xPtveaRhtfwTLupU7i15jsdx07H5KSjL-0R96NMHt6Ax3mRtdTDdOgN2oi5' },
];

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
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
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Produit</th>
                <th className="px-6 py-4 font-semibold">Catégorie</th>
                <th className="px-6 py-4 font-semibold">Prix</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 bg-slate-100 rounded-lg bg-cover bg-center shrink-0 border border-slate-200" 
                        style={{ backgroundImage: `url('${product.image}')` }}
                      ></div>
                      <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-medium",
                      product.stock === 0 ? "text-red-500" : product.stock < 5 ? "text-orange-500" : "text-slate-600"
                    )}>
                      {product.stock} en stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      product.status === 'Actif' ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-600"
                    )}>
                      {product.status}
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
                      <Link to={`/vendor/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
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
            <div className="p-8 text-center text-slate-500">
              Aucun produit trouvé.
            </div>
          )}
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-primary/5 flex items-center justify-between">
          <p className="text-sm text-slate-500">Affichage de 1-{Math.min(filteredProducts.length, 4)} sur {filteredProducts.length} produits</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 cursor-not-allowed">Précédent</button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Suivant</button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Eye className="text-primary" size={20} /> Détails du Produit
              </h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col gap-6">
                <div 
                  className="w-full aspect-video rounded-2xl bg-cover bg-center border border-slate-200 shrink-0 shadow-sm"
                  style={{ backgroundImage: `url('${selectedProduct.image}')` }}
                ></div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{selectedProduct.name}</h4>
                    <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {selectedProduct.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Prix</p>
                      <p className="text-lg font-black text-slate-900">{selectedProduct.price}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                      <p className={cn("text-lg font-black", selectedProduct.stock === 0 ? "text-red-500" : "text-emerald-600")}>
                        {selectedProduct.stock} unités
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Statut Actuel</p>
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        selectedProduct.status === 'Actif' ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                      )}>
                        {selectedProduct.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all outline-none"
              >
                Fermer
              </button>
              <Link 
                to={`/vendor/products/edit/${selectedProduct.id}`}
                className="px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 outline-none"
              >
                <Edit size={16} /> Modifier
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Supprimer le produit ?</h3>
            <p className="text-slate-500 text-sm mb-8">
              Vous êtes sur le point de supprimer <span className="font-bold text-slate-700">{productToDelete.name}</span>. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
