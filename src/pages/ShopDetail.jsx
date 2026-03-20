import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    Search,
    ShoppingCart,
    ChevronRight,
    MapPin,
    CheckCircle,
    Star,
    Heart,
    Loader2,
    AlertCircle,
    Store,
    Mail
} from 'lucide-react';
import { authService } from '../services/authService';
import { vendorService } from '../services/vendorService';
import { storeService } from '../services/storeService';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';
import { cartService } from '../services/cartService';
import { messageService } from '../services/messageService';

export default function ShopDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const { showToast } = useToast();
    const [addingToCart, setAddingToCart] = useState(null);

    useEffect(() => {
        const loadShopData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [storeRes, productsRes] = await Promise.all([
                    storeService.getBySlug(id), // Identifier can be ID or Slug
                    storeService.getProducts(id, { limit: 20 })
                ]);
                
                setShop(storeRes.data.store || storeRes.data);
                setProducts(productsRes.data.products || productsRes.data);
            } catch (err) {
                console.error('Erreur chargement boutique:', err);
                setError('Impossible de charger les détails de la boutique.');
            } finally {
                setLoading(false);
            }
        };
        loadShopData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async (productId) => {
        setAddingToCart(productId);
        try {
            await cartService.addItem({ productId, quantity: 1 });
            // Show feedback (optional)
        } catch (err) {
            console.error('Erreur ajout panier:', err);
        } finally {
            setAddingToCart(null);
        }
    };

    const handleContactShop = async () => {
        try {
            const res = await messageService.createOrGetConversation({
                recipientId: shop.owner || shop.vendor || shop._id
            });
            if (res.data.success) {
                navigate(`/messages/${res.data.conversation._id}`);
            }
        } catch (err) {
            console.error('Error creating conversation:', err);
            if (err.response?.status === 401) navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-[#17cf54] animate-spin mx-auto" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Ouverture de la vitrine...</p>
                </div>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Boutique introuvable</h2>
                    <p className="text-gray-500 font-medium">{error}</p>
                    <Link to="/" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm transition-transform active:scale-95">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    const banner = shop.banner || "https://placehold.co/1600x400?text=Banner";
    const logo = shop.logo || "https://placehold.co/400x400?text=Logo";

    return (
        <div className="min-h-screen bg-[#fcfdfc] font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900 hidden sm:block">FasoMarket</span>
                        </Link>
                        <div className="flex-1 max-w-xl relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher dans cette boutique..."
                                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <ShoppingCart size={22} />
                            </Link>

                            {authService.isLoggedIn() && (
                                <Link to="/messages" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                    <Mail size={22} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Shop Banner & Profile */}
                <div className="relative mb-32 md:mb-24">
                    <div className="h-64 sm:h-80 w-full rounded-[2rem] overflow-hidden shadow-sm bg-gray-100">
                        <img src={banner} alt="Shop Banner" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-24 md:-bottom-16 left-8 right-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-white overflow-hidden shadow-xl bg-white flex-shrink-0">
                            <img src={logo} alt="Shop Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 pb-4">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h1 className="text-3xl font-black text-gray-900">{shop.name}</h1>
                                {shop.isVerified && <CheckCircle size={20} className="text-[#17cf54] fill-[#17cf54]/10" />}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm font-bold text-[#17cf54]">
                                <MapPin size={16} />
                                <span>{shop.address || "Burkina Faso"}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 pb-6">
                            <button 
                                onClick={() => {
                                    setIsFollowing(!isFollowing);
                                    showToast(isFollowing ? 'Boutique ne plus suivie' : 'Vous suivez maintenant cette boutique', 'success');
                                }}
                                className={cn(
                                    "px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg",
                                    isFollowing 
                                        ? "bg-primary/10 text-primary border border-primary/20" 
                                        : "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                                )}
                            >
                                <Heart size={18} fill={isFollowing ? "currentColor" : "none"} />
                                {isFollowing ? 'Suivie' : 'Suivre'}
                            </button>
                            <button 
                                onClick={handleContactShop}
                                className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Mail size={18} />
                                Contacter
                            </button>
                        </div>
                    </div>
                </div>

                {/* About & Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 px-4 md:px-0 mt-8 md:mt-0">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">À propos de la boutique</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {shop.description || "Cette boutique n'a pas encore ajouté de description."}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['Artisanat', 'Qualité', 'Burkina'].map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-[#f2fdf6] text-[#17cf54] text-[10px] font-black rounded-full border border-[#ccf7de] tracking-wider uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#f2fdf6] rounded-3xl p-8 border border-[#ccf7de] space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Performance</h3>
                            <button 
                                onClick={() => showToast('Avis complets bientôt disponibles', 'info')}
                                className="text-xs font-black text-[#16c44f] uppercase tracking-widest hover:underline"
                            >
                                Voir tous les avis
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-black text-[#17cf54]">{shop.rating?.average || '5.0'}</span>
                            <Star size={20} className="text-[#17cf54] fill-[#17cf54]" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-gray-400 uppercase tracking-widest">Produits</span>
                                <span className="text-gray-900">{products.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-gray-400 uppercase tracking-widest">Ventes</span>
                                <span className="text-gray-900">{shop.salesCount || 0}+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <section className="space-y-10">
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-gray-100 pb-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 lowercase italic">Nos trésors</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Découvrez notre collection exclusive</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <select 
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    showToast('Tri mis à jour', 'success');
                                }}
                                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold font-sans outline-none focus:ring-2 focus:ring-[#16c44f]/20"
                            >
                                <option value="newest">Plus récents</option>
                                <option value="price_asc">Prix croissant</option>
                                <option value="price_desc">Prix décroissant</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.length > 0 ? products.map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="group space-y-4">
                                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-sm relative border border-gray-50 flex items-center justify-center">
                                    <img 
                                        src={product.images?.[0] || product.image || product.img} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    {product.badge && (
                                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[#17cf54] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                                            {product.badge}
                                        </div>
                                    )}
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(product._id);
                                        }}
                                        disabled={addingToCart === product._id}
                                        className="absolute bottom-6 right-6 w-12 h-12 bg-white text-[#17cf54] rounded-2xl flex items-center justify-center shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#17cf54] hover:text-white"
                                    >
                                        {addingToCart === product._id ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
                                    </button>
                                </div>
                                <div className="px-2">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 leading-tight">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-lg font-black text-gray-900">{product.price.toLocaleString()} FCFA</p>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-gray-400">{product.rating?.average || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                <Store size={40} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-black text-gray-900">Aucun produit pour le moment</h3>
                                <p className="text-sm font-medium text-gray-500 mt-2">Revenez bientôt pour découvrir nos nouveautés.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        © 2024 FasoMarket - Partenaire de l'Excellence Burkinabè
                    </p>
                </div>
            </footer>
        </div>
    );
}
