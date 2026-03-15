import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Lock, 
    ChevronDown, 
    Check, 
    ShieldCheck, 
    ChevronRight,
    ArrowRight,
    Search
} from 'lucide-react';

export default function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState('orange');

    const orderItems = [
        { id: 1, name: "Montre Connectée Sport v2", quantity: 1, price: "25.000 FCFA", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
        { id: 2, name: "Casque Audio Bluetooth Pro", quantity: 1, price: "18.500 FCFA", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#16c44f] rounded-lg flex items-center justify-center p-1.5">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
                        </Link>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                            <Lock size={16} />
                            <span>Paiement Sécurisé</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm font-bold text-[#16c44f] mb-8">
                    <Link to="/cart" className="hover:underline">Panier</Link>
                    <ChevronRight size={14} className="text-gray-300" strokeWidth={3} />
                    <span className="text-gray-400">Paiement</span>
                </nav>

                <h1 className="text-3xl font-black text-gray-900 mb-10">Finaliser votre commande</h1>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Main Forms */}
                    <div className="flex-1 space-y-8 w-full">
                        
                        {/* Step 1: Delivery Address */}
                        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-8 h-8 bg-[#f2fdf6] text-[#16c44f] rounded-lg flex items-center justify-center font-black text-sm">1</div>
                                <h2 className="text-xl font-black text-gray-900">Adresse de livraison</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-tight">Nom complet</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Moussa Traoré"
                                        className="w-full px-5 py-4 bg-[#f8fafc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 font-medium text-gray-900 placeholder:text-gray-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-tight">Numéro de téléphone</label>
                                    <input 
                                        type="text" 
                                        placeholder="+226 XX XX XX XX"
                                        className="w-full px-5 py-4 bg-[#f8fafc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 font-medium text-gray-900 placeholder:text-gray-300 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-tight">Ville</label>
                                    <div className="relative">
                                        <select className="w-full px-5 py-4 bg-[#f8fafc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 font-medium text-gray-900 appearance-none transition-all">
                                            <option>Ouagadougou</option>
                                            <option>Bobo-Dioulasso</option>
                                            <option>Koudougou</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-gray-900 uppercase tracking-tight">Quartier / Précisions</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Patte d'Oie, Rue 15.22"
                                        className="w-full px-5 py-4 bg-[#f8fafc] border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 font-medium text-gray-900 placeholder:text-gray-300 transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Step 2: Payment Method */}
                        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-8 h-8 bg-[#f2fdf6] text-[#16c44f] rounded-lg flex items-center justify-center font-black text-sm">2</div>
                                <h2 className="text-xl font-black text-gray-900">Moyen de paiement</h2>
                            </div>
                            <p className="text-sm font-medium text-gray-400 mb-8 pl-12">Choisissez votre mode de paiement Mobile Money local</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <button 
                                    onClick={() => setPaymentMethod('orange')}
                                    className={`relative p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${paymentMethod === 'orange' ? 'border-[#16c44f] bg-[#f2fdf6]' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#FF6600] flex items-center justify-center text-white font-black text-[10px] uppercase leading-tight p-2 text-center">
                                            Orange Money
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-black text-gray-900">Orange Money</h4>
                                            <p className="text-[10px] font-bold text-gray-400">Paiement instantané via Orange Burkina</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'orange' ? 'border-[#16c44f] bg-[#16c44f]' : 'border-gray-200'}`}>
                                        {paymentMethod === 'orange' && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setPaymentMethod('moov')}
                                    className={`relative p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${paymentMethod === 'moov' ? 'border-[#16c44f] bg-[#f2fdf6]' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#004A99] flex items-center justify-center text-white font-black text-[10px] uppercase leading-tight p-2 text-center">
                                            Moov Money
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-black text-gray-900">Moov Money</h4>
                                            <p className="text-[10px] font-bold text-gray-400">Paiement sécurisé via Moov Africa</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'moov' ? 'border-[#16c44f] bg-[#16c44f]' : 'border-gray-200'}`}>
                                        {paymentMethod === 'moov' && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                </button>
                            </div>

                            <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-6">
                                <label className="text-xs font-black text-gray-900 uppercase tracking-tight block mb-4">Numéro de téléphone pour le paiement</label>
                                <input 
                                    type="text" 
                                    placeholder="+226 XX XX XX XX"
                                    className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16c44f]/20 font-medium text-gray-900 placeholder:text-gray-300 transition-all font-mono"
                                />
                                <p className="text-[10px] font-medium text-gray-400 mt-4 leading-relaxed italic">
                                    Vous recevrez une demande de confirmation sur votre téléphone après avoir cliqué sur "Commander".
                                </p>
                            </div>
                        </section>

                        <div className="flex items-start gap-3 pl-2">
                            <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-200 text-[#16c44f] focus:ring-[#16c44f]" />
                            <label htmlFor="terms" className="text-[11px] font-bold text-gray-400">
                                En passant commande, vous acceptez nos <Link to="/" className="text-[#16c44f] hover:underline">Conditions Générales de Vente</Link> et notre <Link to="/" className="text-[#16c44f] hover:underline">Politique de Confidentialité</Link>.
                            </label>
                        </div>
                    </div>

                    {/* Sidebar: Order Summary */}
                    <div className="w-full lg:w-[400px] shrink-0 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
                            <h2 className="text-xl font-black text-gray-900 mb-8">Résumé de la commande</h2>
                            
                            <div className="space-y-6 mb-8">
                                {orderItems.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-[#f8fafc] rounded-xl overflow-hidden shrink-0 border border-gray-50 p-1">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate mb-0.5">{item.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400">Quantité: {item.quantity}</p>
                                            <p className="text-sm font-black text-gray-900 mt-1">{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-50 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tight">
                                    <span>Sous-total</span>
                                    <span className="text-gray-900">43.500 FCFA</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tight">
                                    <span>Frais de livraison (Ouaga)</span>
                                    <span className="text-[#16c44f]">1.500 FCFA</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-base font-black text-gray-900 uppercase tracking-widest">Total</span>
                                    <span className="text-2xl font-black text-gray-900 uppercase">45.000 FCFA</span>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-[#16c44f] text-white rounded-2xl font-black text-base shadow-xl shadow-[#16c44f]/20 hover:bg-[#12a643] transition-all flex items-center justify-center gap-3 group active:scale-95 mb-6">
                                Confirmer la commande
                                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="bg-[#f0fdf4] rounded-2xl p-5 flex items-start gap-4 border border-[#dcfce7]">
                                < ShieldCheck className="text-[#16c44f] shrink-0 mt-0.5" size={24} />
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-gray-900">Paiement 100% sécurisé</h4>
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                                        Toutes vos transactions sont cryptées et protégées.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-20 py-12 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                            © 2024 FasoMarket. Tous droits réservés.
                        </p>
                        <div className="flex gap-8 text-xs font-black text-gray-500 uppercase tracking-tighter">
                            <Link to="/" className="hover:text-gray-900">Conditions d'Utilisation</Link>
                            <Link to="/" className="hover:text-gray-900">Politique de Confidentialité</Link>
                            <Link to="/" className="hover:text-gray-900">Aide</Link>
                        </div>
                        <div className="flex gap-6 grayscale opacity-40">
                             <img src="https://cdn-icons-png.flaticon.com/512/10491/10491694.png" className="h-5" alt="Orange Money" />
                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M_g_P6VqG0E0Y9J8_7j-g3_G3_G3_G3_G3_G3_G3_G3" className="h-5" alt="Moov Money" />
                             <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" className="h-5" alt="Shield" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
