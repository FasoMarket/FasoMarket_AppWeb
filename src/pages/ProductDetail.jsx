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
    const [isLiked, setIsLiked] = useState(false);
    
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getById(id);
                const socialRes = await relationService.getProductSocialProof(id);
                
                // res.data contient { success, message, data: {...} }
                const productData = res.data?.data || res.data;
                console.log('Product data:', productData);
                
                setProduct(productData);
                setSocialProof(socialRes.data?.socialProof);
                
                // Fetch related products
                const relatedRes = await productService.getAll({ 
                    category: productData.category,
                    limit: 4 
                });
                const relatedData = relatedRes.data?.data || [];
                setRelatedProducts(relatedData.filter(p => p._id !== id));
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
            showToast('Veuillez vous connecter pour ajouter au panier', 'info');
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

    const handleToggleLike = async () => {
        if (!authService.isLoggedIn()) {
            showToast('Veuillez vous connecter pour ajouter aux favoris', 'info');
            navigate('/login');
            return;
        }
        setIsLiked(!isLiked);
        showToast(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris', 'success');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#17cf54] animate-spin" />
            </div>
        );
    }

    if (!product || !product.name) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Produit introuvable</h2>
                <p className="text-gray-500 mb-6">ID: {id}</p>
                <Link to="/products" className="text-[#17cf54] font-bold hover:underline">Retour à la boutique</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Gallery */}
                    <div className="flex-1 space-y-6">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
                            <img 
                                src={product.images?.[activeImage] || product.imageUrl || 'https://placehold.co/400x400?text=Product'} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Product'; }}
                            />
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    Plus que {product.stock} en stock
                                </div>
                            )}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-gray-900 text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs">Épuisé</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {(product.images?.length > 1) && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-[#17cf54]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1 space-y-8">
                        {/* Header Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-[#17cf54]/10 text-[#17cf54] rounded-full text-[9px] font-black uppercase tracking-widest">
                                    {product.category || 'Produit'}
                                </span>
                                {socialProof?.avgRating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star size={12} fill="#fbbf24" className="text-amber-400" />
                                        <span className="text-xs font-black text-gray-900">{socialProof.avgRating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-400">({socialProof.totalReviews})</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">{product.name}</h1>
                            <p className="text-2xl font-black text-gray-900">
                                {product.price ? `${product.price.toLocaleString()} FCFA` : 'Prix non disponible'}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-base text-gray-600 font-medium leading-relaxed">
                            {product.description && product.description.trim() ? product.description : 'Aucune description disponible'}
                        </p>

                        {/* Store Info */}
                        {product.store && (
                            <Link 
                                to={`/shop/${product.store.slug || product.storeId}`}
                                className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-[#17cf54]/5 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={product.store.logo || `https://ui-avatars.com/api/?name=${product.store.name}&background=fff&color=17cf54`} 
                                        alt={product.store.name}
                                        className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-100"
                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${product.store.name}&background=fff&color=17cf54`; }}
                                    />
                                    <div>
                                        <h4 className="font-black text-sm text-gray-900">{product.store.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Voir la boutique</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#17cf54] transition-colors" />
                            </Link>
                        )}

                        {/* Actions */}
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-black">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.stock === 0}
                                    className="flex-1 bg-gray-900 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:bg-gray-800 active:scale-95 disabled:bg-gray-300 h-12"
                                >
                                    {addingToCart ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} />
                                            Ajouter au panier
                                        </>
                                    )}
                                </button>

                                <button 
                                    onClick={handleToggleLike}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 hover:bg-red-50 hover:text-red-500'}`}
                                >
                                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            {/* Trust signals */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <Truck size={18} className="text-[#17cf54]" />
                                    <span className="text-[8px] font-black uppercase text-gray-500 text-center">Livraison<br/>Express</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <RotateCcw size={18} className="text-[#17cf54]" />
                                    <span className="text-[8px] font-black uppercase text-gray-500 text-center">Retour<br/>7 jours</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <ShieldCheck size={18} className="text-[#17cf54]" />
                                    <span className="text-[8px] font-black uppercase text-gray-500 text-center">Certifié<br/>Artisanat</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20 space-y-8">
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-black text-gray-900">Vous aimerez aussi</h2>
                            <Link to="/products" className="flex items-center gap-2 text-[#17cf54] font-black text-xs uppercase hover:translate-x-1 transition-transform">
                                Voir tout <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <Link key={p._id} to={`/product/${p._id}`} className="group space-y-3">
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                                        <img src={p.images?.[0] || p.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                                            {p.price?.toLocaleString() || '---'} FCFA
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{p.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{p.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="mt-20 py-12 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-6 h-6 bg-[#17cf54] rounded-lg"></div>
                        <span className="text-lg font-black tracking-tight">FasoMarket</span>
                    </div>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">L'excellence Burkinabè à votre portée</p>
                </div>
            </footer>
        </div>
    );
}
