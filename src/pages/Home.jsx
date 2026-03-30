import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Truck,
    ShieldCheck,
    CreditCard,
    Palette,
    Utensils,
    Shirt,
    Cpu,
    Loader2,
    TrendingUp,
    BarChart2,
    ShoppingCart
} from 'lucide-react';
import { productService } from '../services/productService';
import { storeService }   from '../services/storeService';
import { authService }    from '../services/authService';
import { useCart }        from '../contexts/CartContext';
import { relationService } from '../services/relationService';

// Assets
import heroHome from '../assets/hero-home.png';

export default function Home() {
    const navigate = useNavigate();
    const { cartCount, addToCart, loading: cartLoading } = useCart();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [featuredStores, setFeaturedStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [addingToCart, setAddingToCart] = useState(null);
    const user = authService.getUser();

    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);
            try {
                // Redirect admins and vendors to their dashboards
                if (user?.role === 'admin') {
                    navigate('/admin');
                    return;
                }
                if (user?.role === 'vendor') {
                    navigate('/vendor');
                    return;
                }

                const [productsRes, trendingRes, storesRes, categoriesRes] = await Promise.all([
                    productService.getAll({ limit: 8, sort: '-createdAt' }),
                    relationService.getTrendingProducts(),
                    storeService.getAll({ limit: 6 }),
                    productService.getCategories(),
                ]);
                
                setFeaturedProducts(productsRes.data?.data || []);
                setTrendingProducts(trendingRes.data?.trending || []);
                setFeaturedStores(storesRes.data?.data || []);
                setCategories(categoriesRes.data?.data || []);
            } catch (err) {
                console.error('Erreur chargement home:', err);
                // Ensure states are arrays even on error
                setFeaturedProducts([]);
                setFeaturedStores([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault(); // Prevent navigating to detail page if wrapped in Link
        setAddingToCart(productId);
        try {
            await addToCart(productId, 1);
        } catch (err) {
            console.error('Erreur ajout panier:', err);
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setAddingToCart(null);
        }
    };

    const getCategoryIcon = (catName) => {
        if (!catName || typeof catName !== 'string') return Cpu;
        const lower = catName.toLowerCase();
        if (lower.includes('artis') || lower.includes('palette')) return Palette;
        if (lower.includes('alim') || lower.includes('manger')) return Utensils;
        if (lower.includes('mode') || lower.includes('vetement')) return Shirt;
        return Cpu;
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">

                {/* Hero Section */}
                <section className="bg-[#e8faee] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row relative min-h-[500px]">
                    <div className="flex-1 p-12 lg:p-20 space-y-8 self-center relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                            <span className="flex w-2 h-2 rounded-full bg-[#17cf54] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#12a643] uppercase tracking-wider">100% Artisanal & Local</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1]">
                            L'excellence <br />
                            <span className="text-[#17cf54]">Burkinabè</span> à <br />
                            votre porte.
                        </h1>
                        <p className="text-lg text-gray-600 font-medium max-w-sm leading-relaxed">
                            Soutenez l'économie locale. Découvrez une sélection unique d'artisanat, de mode Faso Danfani et de produits du terroir.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="px-8 py-4 bg-[#17cf54] text-white rounded-2xl font-bold hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 hover:-translate-y-1 inline-block">
                                Explorer le Marché
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden hidden lg:block">
                        <img
                            src={heroHome}
                            alt="Artisane Burkinabè"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

                {/* Categories Section */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Explorer par Catégories</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Trouvez exactement ce que vous cherchez parmi nos univers</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-gray-50 h-48 rounded-[2.5rem] animate-pulse"></div>
                            ))
                        ) : (
                            categories.map((cat) => {
                                const Icon = getCategoryIcon(cat.name || cat);
                                return (
                                    <Link 
                                        to={`/products?category=${encodeURIComponent(cat.name || cat)}`} 
                                        key={cat.id || (cat.name || cat)} 
                                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group text-center"
                                    >
                                        <div className="w-14 h-14 mx-auto text-[#17cf54] bg-[#e8faee] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{cat.name || cat}</h3>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Produits Récents</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Les pépites du moment sélectionnées pour vous</p>
                        </div>
                        <Link to="/products?sort=-createdAt" className="flex items-center gap-2 text-[#17cf54] font-black hover:translate-x-1 transition-transform">
                            Voir tout <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-gray-50 h-64 rounded-3xl animate-pulse"></div>
                            ))
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map((item) => (
                                <Link to={`/product/${item._id}`} key={item._id} className="group cursor-pointer space-y-4 block">
                                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 relative">
                                        <img 
                                            src={item.images?.[0] || item.image || item.img || 'https://placehold.co/400x400?text=Product'} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Product'; }}
                                        />
                                        <button 
                                            onClick={(e) => handleAddToCart(e, item._id)}
                                            disabled={addingToCart === item._id}
                                            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl text-[#17cf54] shadow-lg hover:bg-[#17cf54] hover:text-white transition-all disabled:opacity-75"
                                        >
                                            {addingToCart === item._id ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#17cf54] uppercase tracking-widest leading-none mb-1">{item.category}</p>
                                        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                        <p className="text-lg font-black text-gray-900 mt-2">{item.price?.toLocaleString() || '---'} FCFA</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-400 font-medium italic">
                                Aucun produit récent pour le moment.
                            </div>
                        )}
                    </div>
                </section>

                {/* Popular Stores */}
                <section className="bg-[#e8faee]/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 rounded-[4rem]">
                    <div className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Boutiques Vedettes</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Faites confiance à nos artisans certifiés</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white h-48 rounded-[2.5rem] animate-pulse"></div>
                                ))
                            ) : featuredStores.length > 0 ? (
                                featuredStores.map((store) => (
                                    <div key={store._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/20 space-y-6 border border-white">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={store.logo || store.img || 'https://placehold.co/100x100?text=Logo'} 
                                                alt={store.name} 
                                                className="w-14 h-14 rounded-2xl object-cover bg-gray-50"
                                                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Logo'; }}
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-900">{store.name}</h3>
                                                <div className="flex items-center gap-1 text-[#17cf54]">
                                                    <span className="text-[10px] font-bold text-gray-400">Vendeur Certifié</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/shop/${store.slug || store._id}`} className="w-full py-3 bg-[#e8faee] text-[#17cf54] font-bold rounded-2xl hover:bg-[#17cf54] hover:text-white transition-all text-center block">
                                            Visiter la boutique
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400 italic font-medium">
                                    Aucune boutique vedette pour le moment.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Trust Banner */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-10">
                    {[
                        { icon: Truck, title: 'Livraison Rapide', desc: 'Livraison partout au Burkina Faso et à l\'international en un temps record.' },
                        { icon: ShieldCheck, title: 'Qualité Garantie', desc: 'Chaque produit est vérifié pour garantir son authenticité et sa qualité artisanale.' },
                        { icon: CreditCard, title: 'Paiement Sécurisé', desc: 'Payez en toute sécurité via Mobile Money (Orange, Moov) et carte bancaire.' }
                    ].map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="text-center space-y-4 px-6">
                                <div className="w-16 h-16 mx-auto bg-[#e8faee] text-[#17cf54] rounded-full flex items-center justify-center shadow-inner">
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </section>

                {/* Creator CTA */}
                <section className="bg-gradient-to-br from-[#111827] to-[#1e293b] rounded-[3rem] p-12 lg:p-24 text-center space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#17cf54]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Vous êtes un artisan ?</h2>
                        <p className="text-lg text-gray-400 font-medium">Rejoignez FasoMarket et commencez à vendre vos créations à travers le pays dès aujourd'hui.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 relative z-10">
                        <Link to="/vendre" className="px-10 py-5 bg-[#17cf54] text-white rounded-2xl font-black hover:bg-[#12a643] transition-all shadow-2xl shadow-[#17cf54]/30 active:scale-95">
                            Ouvrir ma boutique
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-gray-50">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#17cf54] rounded-lg"></div>
                                <span className="text-xl font-black text-gray-900">FasoMarket</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
                                La première marketplace dédiée à la promotion du savoir-faire Burkinabè.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900">Acheter</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
                                <Link to="/products" className="hover:text-[#17cf54]">Tous les produits</Link>
                                <Link to="/stores" className="hover:text-[#17cf54]">Boutiques certifiées</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900">Vendre</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
                                <Link to="/register" className="hover:text-[#17cf54]">Ouvrir une boutique</Link>
                            </nav>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
                        <p>© 2024 FasoMarket - Ensemble valorisons notre identité & nos talents.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
