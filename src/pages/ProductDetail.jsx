import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Star, 
    ShoppingCart, 
    Heart, 
    Share2, 
    ChevronLeft, 
    ChevronRight, 
    ShieldCheck, 
    Truck, 
    RotateCcw,
    Plus,
    Minus,
    Store,
    ArrowRight,
    Loader2,
    ShoppingBag,
    Eye,
    Zap
} from 'lucide-react';
import { productService } from '../services/productService';
import { relationService } from '../services/relationService';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartCount } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [socialProof, setSocialProof] = useState(null);
    const [viewersCount, setViewersCount] = useState(Math.floor(Math.random() * 8) + 2);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const [res, socialRes] = await Promise.all([
                    productService.getById(id),
                    relationService.getProductSocialProof(id)
                ]);
                
                setProduct(res.data);
                setSocialProof(socialRes.data.socialProof);
                
                // Fetch related products
                const relatedRes = await productService.getAll({ 
                    category: res.data.category,
                    limit: 4 
                });
                setRelatedProducts(relatedRes.data.data.filter(p => p._id !== id));
            } catch (err) {
                console.error('Erreur chargement produit:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async () => {
        if (!authService.isLoggedIn()) {
            navigate('/login');
            return;
        }
        setAddingToCart(true);
        try {
            await addToCart(id, quantity, product);
            showToast('Produit ajouté au panier !', 'success');
        } catch (err) {
            console.error('Erreur ajout panier:', err);
            showToast('Erreur lors de l\'ajout au panier', 'error');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#16c44f] animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Produit introuvable</h2>
                <Link to="/products" className="text-[#16c44f] font-bold hover:underline">Retour à la boutique</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header / Navigation Simple */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#16c44f] rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-[#16c44f]/20">
                            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17" />
                                <path d="M2 12L12 17L22 12" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight hidden sm:block">FasoMarket</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="relative p-1 text-gray-700 hover:text-[#17cf54] transition-colors group">
                            <ShoppingBag size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[#17cf54] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {authService.isLoggedIn() ? (
                            <Link to="/profile" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                                <img src={authService.getUser()?.avatar || `https://ui-avatars.com/api/?name=${authService.getUser()?.name}&background=f3f4f6`} className="w-full h-full object-cover" alt="" />
                            </Link>
                        ) : (
                            <Link to="/login" className="text-sm font-bold text-gray-900 hover:text-[#16c44f]">Connexion</Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left: Gallery */}
                    <div className="flex-1 space-y-6">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 relative group">
                            <img 
                                src={product.images?.[activeImage] || product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Plus que {product.stock} en stock
                                </div>
                            )}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-gray-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm">Épuisé</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {(product.images?.length > 1) && (
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-[#16c44f] p-1' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover rounded-xl" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-[#16c44f]/10 text-[#16c44f] rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-xs font-black text-gray-900">{socialProof?.avgRating || 0}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">({socialProof?.totalReviews || 0} avis)</span>
                                </div>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter italic leading-none">{product.name}</h1>
                            
                            {/* Social Proof Tags */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                                    <Eye size={12} className="text-[#16c44f]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <span className="text-[#16c44f]">{viewersCount}</span> personnes regardent
                                    </span>
                                </div>
                                {socialProof?.totalBuyers > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                                        <Zap size={12} className="text-amber-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Succès : <span className="text-amber-500">{socialProof.totalBuyers}</span> ventes
                                        </span>
                                    </div>
                                )}
                                {socialProof?.wishlistCount > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                                        <Heart size={12} className="text-red-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Favori de <span className="text-red-500">{socialProof.wishlistCount}</span> personnes
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-baseline gap-4 mt-6">
                                <span className="text-4xl font-black text-gray-900">{product.price.toLocaleString()} <span className="text-sm">FCFA</span></span>
                            </div>
                        </div>

                        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                            {product.description}
                        </p>

                        {/* Store Info Mini */}
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-[#16c44f]/5 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-primary border border-gray-100 shadow-sm overflow-hidden">
                                     <img src={product.store?.logo || `https://ui-avatars.com/api/?name=${product.store?.name || 'Store'}&background=fff&color=16c44f`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors">{product.store?.name || 'Boutique Partenaire'}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Voir la boutique</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 pt-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center bg-gray-100 rounded-2xl p-1 h-[72px]">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-16 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-16 text-center font-black text-xl">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-16 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.stock === 0}
                                    className="flex-1 bg-gray-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all hover:bg-gray-800 hover:-translate-y-1 active:scale-95 disabled:bg-gray-200 disabled:pointer-events-none group px-10 h-[72px]"
                                >
                                    {addingToCart ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                                            Ajouter au panier
                                        </>
                                    )}
                                </button>

                                <button className="w-[72px] h-[72px] bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-[2rem] flex items-center justify-center transition-all">
                                    <Heart size={24} />
                                </button>
                            </div>

                            {/* Trust signals */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#16c44f]">
                                        <Truck size={20} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Livraison <br /><span className="text-gray-900">Express</span></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#16c44f]">
                                        <RotateCcw size={20} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retour <br /><span className="text-gray-900">sous 7j</span></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#16c44f]">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Artisanat <br /><span className="text-gray-900">Certifié</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-40 space-y-12">
                        <div className="flex justify-between items-end">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic capitalize">Vous aimerez aussi</h2>
                            <Link to="/products" className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:translate-x-1 transition-transform">
                                Voir tout <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {relatedProducts.map((p) => (
                                <Link key={p._id} to={`/product/${p._id}`} className="group space-y-4">
                                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 relative">
                                        <img src={p.images?.[0] || p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {p.price.toLocaleString()} FCFA
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm truncate">{p.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="mt-40 py-20 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-8 h-8 bg-[#16c44f] rounded-lg"></div>
                        <span className="text-xl font-black tracking-tight">FasoMarket</span>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">L'excellence Burkinabè à votre portée</p>
                </div>
            </footer>
        </div>
    );
}
