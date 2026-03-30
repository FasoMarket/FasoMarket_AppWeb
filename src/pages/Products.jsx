import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search,
    ShoppingCart,
    ChevronRight,
    Grid2X2,
    List,
    Star,
    Loader2,
    X,
    Mail
} from 'lucide-react';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { useToast } from '../contexts/ToastContext';
import { useProductUpdates } from '../hooks/useProductUpdates';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [addingToCart, setAddingToCart] = useState(null);
    const { showToast } = useToast();

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '-createdAt';

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
        },
        (deletedProductId) => {
            setProducts(prev => prev.filter(p => p._id !== deletedProductId));
        }
    );

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productService.getAll({ 
                        search, 
                        category, 
                        sort,
                        limit: 20
                    }),
                    productService.getCategories()
                ]);
                
                // Correctly access .data from standardized API response
                const productsData = productsRes.data?.data || [];
                setProducts(productsData);
                setTotal(productsRes.data?.pagination?.total || productsData.length);
                setCategories(categoriesRes.data?.data || []);
            } catch (err) {
                console.error('Erreur chargement produits:', err);
                setProducts([]);
                setCategories([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [search, category, sort]);

    const handleSortChange = (e) => {
        setSearchParams({ search, category, sort: e.target.value });
    };

    const handleCategoryToggle = (catName) => {
        const newCat = category === catName ? '' : catName;
        setSearchParams({ search, category: newCat, sort });
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault(); // Prevent navigating to detail page if wrapped in Link
        setAddingToCart(productId);
        try {
            await cartService.addItem({ productId, quantity: 1 });
            showToast('Produit ajouté au panier !', 'success');
        } catch (err) {
            console.error('Erreur ajout panier:', err);
            showToast('Erreur lors de l\'ajout au panier', 'error');
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900 hidden sm:block">FasoMarket</span>
                        </Link>

                        <div className="flex-1 max-w-xl relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                defaultValue={search}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchParams({ search: e.target.value, category, sort });
                                    }
                                }}
                                placeholder="Rechercher un produit local..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <ShoppingCart size={22} />
                            </Link>

                            {authService.isLoggedIn() && (
                                <Link to="/messages" className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                    <Mail size={22} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 space-y-10">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="font-black text-xs uppercase tracking-widest text-[#17cf54]">Catégories</h4>
                                {(category || search) && (
                                    <button onClick={clearFilters} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-1">
                                        <X size={10} /> Reset
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {categories.map((cat) => {
                                    const catName = cat.name || cat;
                                    const isActive = category === catName;
                                    return (
                                        <button
                                            key={catName}
                                            onClick={() => handleCategoryToggle(catName)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#e8faee] text-[#17cf54]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 group'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{catName}</span>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#17cf54]"></div>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#111827] to-[#1e293b] p-8 rounded-[2rem] text-white space-y-4">
                            <h5 className="font-black text-xs uppercase tracking-widest text-[#17cf54]">Vendre vos produits ?</h5>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Ouvrez votre boutique gratuitement et commencez à vendre aujourd'hui.
                            </p>
                            <Link to="/register" className="block w-full py-3 bg-[#17cf54] text-white text-center text-xs font-black rounded-xl hover:bg-[#12a643] transition-all">
                                Commencer
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-1 space-y-8">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 rounded-3xl border border-gray-100 gap-4">
                            <div className="flex items-center gap-4">
                                <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Link to="/" className="hover:text-[#17cf54]">Home</Link>
                                    <ChevronRight size={12} />
                                    <span className="text-gray-900">Marché</span>
                                </nav>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <p className="text-xs font-bold text-gray-500">{loading ? 'Recherche...' : `${total} produits trouvés`}</p>
                                {category && (
                                    <span className="bg-[#17cf54]/10 text-[#17cf54] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                        {category}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <select 
                                    value={sort}
                                    onChange={handleSortChange}
                                    className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#17cf54]"
                                >
                                    <option value="-createdAt">Plus récents</option>
                                    <option value="price">Prix croissant</option>
                                    <option value="-price">Prix décroissant</option>
                                    <option value="-salesCount">Les plus populaires</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-gray-50 animate-pulse"></div>
                                ))
                            ) : products.length > 0 ? (
                                products.map((item) => (
                                    <Link to={`/product/${item._id}`} key={item._id} className="group cursor-pointer space-y-4 block">
                                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 relative shadow-inner">
                                            <img src={item.images?.[0] || item.image || item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            {item.badge && (
                                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[#17cf54] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-sm border border-white/50">
                                                    {item.badge}
                                                </div>
                                            )}
                                            <button 
                                                onClick={(e) => handleAddToCart(e, item._id)}
                                                disabled={addingToCart === item._id}
                                                className="absolute bottom-6 right-6 bg-white text-[#17cf54] p-4 rounded-[1.25rem] shadow-xl hover:bg-[#17cf54] hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 disabled:opacity-75"
                                            >
                                                {addingToCart === item._id ? <Loader2 size={22} className="animate-spin" /> : <ShoppingCart size={22} />}
                                            </button>
                                        </div>
                                        <div className="px-2">
                                            <p className="text-[10px] font-black text-[#17cf54] uppercase tracking-[0.2em] mb-1 leading-none">{item.category}</p>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">{item.name}</h3>
                                            <div className="flex items-center justify-between mt-3">
                                                <p className="text-xl font-black text-gray-900">{item.price?.toLocaleString() || '---'} FCFA</p>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">
                                                    <Star size={12} fill="#eab308" className="text-[#eab308]" />
                                                    <span className="text-[10px] font-black text-[#854d0e]">{item.rating?.average || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-gray-300 shadow-sm">
                                        <Search size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">Aucun produit trouvé</h3>
                                        <p className="text-sm font-medium text-gray-500">Essayez d'ajuster vos filtres ou votre recherche.</p>
                                    </div>
                                    <button onClick={clearFilters} className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black text-xs hover:bg-gray-50 transition-all">
                                        Tout afficher
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination Placeholder */}
                        {!loading && products.length > 0 && products.length < total && (
                            <div className="flex justify-center pt-12">
                                <button className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-gray-900/40 active:translate-y-0 transition-all">
                                    Charger plus de trésors
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-400 font-medium tracking-tight uppercase">
                        © 2024 FasoMarket - Excellence & Authenticité
                    </p>
                </div>
            </footer>
        </div>
    );
}
