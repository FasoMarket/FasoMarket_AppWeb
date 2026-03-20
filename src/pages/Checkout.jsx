import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Lock, 
    ChevronDown, 
    Check, 
    ShieldCheck, 
    ChevronRight,
    ArrowRight,
    Loader2,
    AlertCircle,
    Tag,
    MapPin
} from 'lucide-react';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { clientAdvancedService } from '../services/clientAdvancedService';
import SuccessPopup from '../components/SuccessPopup';

import { useCart } from '../contexts/CartContext';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, loading: cartLoading, fetchCart, error: cartError } = useCart();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        city: 'Ouagadougou',
        details: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('orange');
    
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('new');
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [verifyingPromo, setVerifyingPromo] = useState(false);

    useEffect(() => {
        if (!cartLoading) {
            if (!cart?.items || cart.items.length === 0) {
                navigate('/cart');
            } else {
                setLoading(false);
            }
        }
    }, [cart, cartLoading, navigate]);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await clientAdvancedService.getAddresses();
                setAddresses(res.data.addresses || []);
                const def = res.data.addresses?.find(a => a.isDefault);
                if (def) {
                    setSelectedAddressId(def._id);
                    setFormData({ fullName: def.fullName, phone: def.phone, city: def.city, details: def.street + (def.district ? `, ${def.district}` : '') });
                }
            } catch (err) { console.error('Erreur chargement adresses', err); }
        };
        fetchAddresses();
    }, []);

    const handleAddressChange = (e) => {
        const id = e.target.value;
        setSelectedAddressId(id);
        if (id !== 'new') {
            const addr = addresses.find(a => a._id === id);
            if (addr) setFormData({ fullName: addr.fullName, phone: addr.phone, city: addr.city, details: addr.street + (addr.district ? `, ${addr.district}` : '') });
        } else {
            setFormData({ fullName: '', phone: '', city: 'Ouagadougou', details: '' });
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        setVerifyingPromo(true);
        try {
            const res = await clientAdvancedService.validatePromoCode(promoCode, subtotal);
            setAppliedPromo(res.data.promo);
            // showToast(`-${res.data.promo.discount.toLocaleString()} FCFA appliqué !`, 'success');
        } catch (err) {
            setError(err.response?.data?.message || 'Code promo invalide');
            setAppliedPromo(null);
        } finally {
            setVerifyingPromo(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const orderData = {
                shippingAddress: formData,
                paymentMethod: paymentMethod
            };
            // Create the order first
            const orderRes = await orderService.create(orderData);
            const order = orderRes.data;
            const createdOrderId = order._id;

            try {
                // Then simulate payment
                await paymentService.mobileMoney({ orderId: createdOrderId, phone: formData.phone, method: paymentMethod });
                setOrderId(createdOrderId);
                setShowSuccess(true);
            } catch (payErr) {
                // Order was created but payment simulation failed (or returned 400 for the 10% chance failure)
                const isPaidFail = payErr.response?.status === 400;
                const msg = payErr.response?.data?.message || 'Échec du paiement. Veuillez réessayer.';
                setError(msg);
                if (isPaidFail) {
                    // Still show order in orders page even if payment failed
                    setOrderId(createdOrderId);
                }
            }
        } catch (err) {
            console.error('Erreur commande:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la commande.');
        } finally {
            setSubmitting(false);
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
    const discount = appliedPromo ? appliedPromo.discount : 0;
    const shipping = subtotal > 50000 ? 0 : 1500;
    const total = Math.max(0, subtotal - discount) + shipping;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#16c44f] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#16c44f] rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-[#16c44f]/20">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
                        </Link>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <Lock size={14} />
                            <span>Sécurité SSL</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Steps */}
                <nav className="flex items-center gap-2 text-xs font-black text-[#16c44f] uppercase tracking-widest mb-12">
                    <Link to="/cart" className="hover:underline">Panier</Link>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="text-gray-900">Paiement & Livraison</span>
                </nav>

                <h1 className="text-5xl font-black text-gray-900 mb-12 tracking-tighter italic">Finaliser l'achat</h1>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold text-sm">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Forms */}
                    <div className="flex-1 space-y-12 w-full">
                        
                        {/* Address Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-lg">1</div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Adresse de livraison</h2>
                                </div>
                                {addresses.length > 0 && (
                                    <select 
                                        className="px-4 py-2 border-2 border-slate-100 rounded-xl font-bold outline-none cursor-pointer focus:border-[#16c44f]"
                                        value={selectedAddressId}
                                        onChange={handleAddressChange}
                                    >
                                        <option value="new">+ Nouvelle adresse</option>
                                        {addresses.map(a => (
                                            <option key={a._id} value={a._id}>{a.label} — {a.city}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nom complet</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Moussa Traoré"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 focus:bg-white font-bold text-gray-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+226 -- -- -- --"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 focus:bg-white font-bold text-gray-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ville</label>
                                    <div className="relative">
                                        <select 
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 focus:bg-white font-bold text-gray-900 appearance-none transition-all"
                                        >
                                            <option value="Ouagadougou">Ouagadougou</option>
                                            <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                                            <option value="Koudougou">Koudougou</option>
                                            <option value="Banfora">Banfora</option>
                                            <option value="Ouahigouya">Ouahigouya</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Détails (Quartier, Rue, Porte...)</label>
                                    <textarea 
                                        name="details"
                                        required
                                        value={formData.details}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Ex: Patte d'Oie, Rue 15.22, face à la pharmacie..."
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 focus:bg-white font-bold text-gray-900 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-lg">2</div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Paiement Mobile</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('orange')}
                                    className={`relative p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${paymentMethod === 'orange' ? 'border-[#16c44f] bg-[#f8fafc]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-[#FF6600] flex items-center justify-center text-white font-black text-[10px] uppercase p-2 text-center shadow-lg shadow-orange-500/20">
                                            Orange Money
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-black text-gray-900">Orange Money</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirmation par USSD</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'orange' ? 'border-[#16c44f] bg-[#16c44f]' : 'border-gray-200'}`}>
                                        {paymentMethod === 'orange' && <Check size={14} className="text-white" strokeWidth={4} />}
                                    </div>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setPaymentMethod('moov')}
                                    className={`relative p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${paymentMethod === 'moov' ? 'border-[#16c44f] bg-[#f8fafc]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-[#004A99] flex items-center justify-center text-white font-black text-[10px] uppercase p-2 text-center shadow-lg shadow-blue-500/20">
                                            Moov Money
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-black text-gray-900">Moov Money</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paiement sécurisé Moov</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'moov' ? 'border-[#16c44f] bg-[#16c44f]' : 'border-gray-200'}`}>
                                        {paymentMethod === 'moov' && <Check size={14} className="text-white" strokeWidth={4} />}
                                    </div>
                                </button>
                            </div>

                            <div className="bg-gray-900 text-white rounded-[2rem] p-8 flex items-start gap-5">
                                <ShieldCheck size={32} className="text-[#16c44f] shrink-0" />
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-sm mb-2">Sécurité garantie</h4>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                                        Une demande de confirmation sera envoyée sur votre téléphone lié au compte {paymentMethod === 'orange' ? 'Orange' : 'Moov'} Money dès validation.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="w-full lg:w-[450px] shrink-0 sticky top-32">
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <h2 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">Récapitulatif</h2>
                            
                            <div className="space-y-6 mb-10 pb-10 border-b border-gray-50 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart?.items.map(item => (
                                    <div key={item._id} className="flex gap-5 group">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                                            <img src={item.product?.images?.[0] || item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="text-sm font-black text-gray-900 truncate mb-1">{item.product?.name || 'Produit'}</h4>
                                            <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="text-gray-900">{((item.product?.price || 0) * item.quantity).toLocaleString()} FCFA</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code */}
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag size={16} className="text-[#16c44f]" />
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Code Promo</span>
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={promoCode} 
                                        onChange={e => setPromoCode(e.target.value)} 
                                        placeholder="EX: FASO10"
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-[#16c44f]/20"
                                        readOnly={!!appliedPromo}
                                    />
                                    {appliedPromo ? (
                                        <button type="button" onClick={() => {setAppliedPromo(null); setPromoCode('');}} className="px-4 py-3 bg-red-50 text-red-500 rounded-xl font-black text-xs hover:bg-red-100">
                                            Retirer
                                        </button>
                                    ) : (
                                        <button type="button" onClick={handleApplyPromo} disabled={verifyingPromo || !promoCode} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-xs disabled:opacity-50 transition-all hover:bg-gray-800">
                                            {verifyingPromo ? <Loader2 size={16} className="animate-spin" /> : 'Appliquer'}
                                        </button>
                                    )}
                                </div>
                                {appliedPromo && (
                                    <p className="text-[#16c44f] font-bold text-xs mt-2">Code appliqué : -{appliedPromo.discount.toLocaleString()} FCFA</p>
                                )}
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Sous-total</span>
                                    <span className="text-gray-900">{subtotal.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Livraison ({formData.city})</span>
                                    <span className={shipping === 0 ? "text-[#16c44f]" : "text-gray-900"}>
                                        {shipping === 0 ? "GRATUIT" : `${shipping.toLocaleString()} FCFA`}
                                    </span>
                                </div>
                                {appliedPromo && (
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Réduction</span>
                                        <span className="text-red-500">-{appliedPromo.discount.toLocaleString()} FCFA</span>
                                    </div>
                                )}
                                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                    <span className="text-lg font-black uppercase tracking-tighter">Total à payer</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-[#16c44f] uppercase">{total.toLocaleString()} <span className="text-xs">FCFA</span></span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-[#16c44f] text-white rounded-[2rem] font-black text-lg shadow-xl shadow-[#16c44f]/20 hover:bg-[#12a643] transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:bg-gray-400"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        Confirmer & Payer
                                        <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                En confirmant, vous acceptez nos conditions de vente et de livraison.
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            <footer className="py-12 border-t border-gray-50 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        FasoMarket © 2024 — Le meilleur du Burkina en un clic
                    </p>
                </div>
            </footer>

            <SuccessPopup
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Commande passée !"
                message="Votre commande a été confirmée. Vous recevrez une notification dès que le vendeur la prendra en charge."
                primaryAction={{ label: 'Suivre ma commande', to: `/my-orders/${orderId}` }}
                secondaryAction={{ label: 'Continuer les achats', to: '/products' }}
            />
        </div>
    );
}
