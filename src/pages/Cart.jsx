import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Trash2, 
    Plus, 
    Minus, 
    ChevronRight, 
    ShoppingBag, 
    ArrowRight,
    Search,
    User,
    CheckCircle2,
    Truck,
    Loader2,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { cartService } from '../services/cartService';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../contexts/ToastContext';

import { useCart } from '../contexts/CartContext';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, loading, fetchCart, updateQuantity, removeItem, clearCart, error } = useCart();
    const [updating, setUpdating] = useState(null); // ID of product being updated
    const [isClearCartConfirmOpen, setIsClearCartConfirmOpen] = useState(false);
    const { showToast } = useToast();

    const handleUpdateQuantity = async (productId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        
        setUpdating(productId);
        try {
            await updateQuantity(productId, newQty);
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = async (productId) => {
        setUpdating(productId);
        try {
            await removeItem(productId);
        } finally {
            setUpdating(null);
        }
    };

    const handleClearCart = async () => {
        setIsClearCartConfirmOpen(true);
    };

    const confirmClearCart = async () => {
        try {
            await clearCart();
            showToast('Panier vidé', 'success');
        } catch (err) {
            showToast('Erreur lors du vidage du panier', 'error');
        } finally {
            setIsClearCartConfirmOpen(false);
        }
    };

    const calculateSubtotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 1500;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#16c44f] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <AlertCircle size={48} className="mx-auto text-red-500" />
                    <h2 className="text-xl font-bold">{error}</h2>
                    <button onClick={fetchCart} className="px-6 py-2 bg-[#16c44f] text-white rounded-lg font-bold">Réessayer</button>
                </div>
            </div>
        );
    }

    const isEmpty = !cart?.items || cart.items.length === 0;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 bg-[#16c44f] rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-[#16c44f]/20">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
                        </Link>

                        <div className="flex items-center gap-5">
                            <Link to="/profile" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 hover:text-[#16c44f] transition-colors">
                                <User size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-10">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900">Panier</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    <div className="flex-1 w-full space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">Mon Panier</h1>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    {isEmpty ? '0 article' : `${cart.items.length} article(s)`} dans votre sélection
                                </p>
                            </div>
                            {!isEmpty && (
                                <button 
                                    onClick={handleClearCart}
                                    className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline"
                                >
                                    Vider le panier
                                </button>
                            )}
                        </div>

                        {isEmpty ? (
                            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                    <ShoppingBag size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-4">Votre panier est vide</h2>
                                <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">Découvrez nos produits artisanaux et commencez vos achats dès maintenant.</p>
                                <Link to="/products" className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm transition-transform active:scale-95 group">
                                    Découvrir les produits
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-8 relative group transition-all hover:shadow-xl hover:border-[#16c44f]/20">
                                        <button 
                                            onClick={() => handleRemoveItem(item.product._id)}
                                            className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                        <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-[2rem] overflow-hidden shrink-0">
                                            <img src={item.product?.images?.[0] || item.product?.image} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div>
                                                <Link to={`/product/${item.product?._id}`} className="text-2xl font-black text-gray-900 mb-1 hover:text-[#16c44f] transition-colors">{item.product?.name || 'Produit indisponible'}</Link>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Vendu par : <span className="text-[#16c44f]">{item.product?.vendor?.name || item.product?.store?.name || 'Artisan Local'}</span></p>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-6">
                                                <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                                                        disabled={updating === item.product._id || item.quantity <= 1}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#16c44f] hover:bg-white rounded-xl transition-all disabled:opacity-30"
                                                    >
                                                        <Minus size={18} strokeWidth={3} />
                                                    </button>
                                                    <span className="w-12 text-center text-lg font-black text-gray-900">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                                                        disabled={updating === item.product._id}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#16c44f] hover:bg-white rounded-xl transition-all disabled:opacity-30"
                                                    >
                                                        <Plus size={18} strokeWidth={3} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-3xl font-black text-gray-900">
                                                        {((item.product?.price || 0) * item.quantity).toLocaleString()} <span className="text-sm">FCFA</span>
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-[10px] font-black text-[#16c44f] uppercase tracking-widest mt-1">
                                                            {item.product?.price?.toLocaleString() || 0} FCFA / unité
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isEmpty && (
                        <div className="w-full lg:w-[450px] shrink-0 sticky top-32">
                            <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-400/20">
                                <h2 className="text-3xl font-black mb-10 tracking-tight italic">Récapitulatif</h2>
                                
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Produits</span>
                                        <span className="text-white">{subtotal.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Livraison</span>
                                        <span className={shipping === 0 ? "text-[#16c44f]" : "text-white"}>
                                            {shipping === 0 ? "Gratuit" : `${shipping.toLocaleString()} FCFA`}
                                        </span>
                                    </div>
                                    <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                        <span className="text-xl font-black uppercase tracking-tighter">Total TTC</span>
                                        <div className="text-right">
                                            <p className="text-4xl font-black text-[#16c44f] leading-none mb-1">{total.toLocaleString()} FCFA</p>
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Paiement Mobile Money disponible</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-5 bg-[#16c44f] text-white rounded-[2rem] font-black text-lg shadow-xl shadow-[#16c44f]/20 hover:bg-[#12a643] transition-all flex items-center justify-center gap-3 group active:scale-95"
                                >
                                    Paiement sécurisé 
                                    <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                
                                <button 
                                    onClick={() => navigate('/products')}
                                    className="w-full mt-4 py-4 text-gray-400 font-bold text-sm hover:text-white transition-colors"
                                >
                                    Continuer mes achats
                                </button>

                                <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
                                    <CheckCircle2 size={24} />
                                    <Truck size={24} />
                                    <ShoppingBag size={24} />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <footer className="py-12 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    FasoMarket — Fièrement burkinabè
                </p>
            </footer>

            <ConfirmModal
                isOpen={isClearCartConfirmOpen}
                onClose={() => setIsClearCartConfirmOpen(false)}
                onConfirm={confirmClearCart}
                title="Vider le panier"
                message="Voulez-vous vraiment vider votre panier ?"
                confirmLabel="Oui, vider"
                variant="danger"
            />
        </div>
    );
}
