import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    ShoppingBag, 
    ArrowRight, 
    Download, 
    Loader2,
    Calendar,
    MapPin,
    Truck
} from 'lucide-react';
import { orderService } from '../services/orderService';

export default function OrderSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderService.getById(id);
                setOrder(res.data?.data || res.data);
            } catch (err) {
                console.error('Erreur chargement commande:', err);
                // Si erreur, on reste sur la page mais on n'affiche pas les détails
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#16c44f] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
            <header className="py-6 px-8 flex justify-between items-center bg-white/50 backdrop-blur-sm border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#16c44f] rounded-lg p-1.5 shadow-lg shadow-[#16c44f]/20">
                        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            <path d="M2 17L12 22L22 17" />
                            <path d="M2 12L12 17L22 12" />
                        </svg>
                    </div>
                    <span className="text-xl font-black text-gray-900">FasoMarket</span>
                </Link>
                <Link to="/products" className="text-xs font-black text-gray-400 hover:text-[#16c44f] transition-colors uppercase tracking-widest">
                    Continuer mes achats
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-[1000px] w-full bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                    
                    {/* Left Section - Success Message */}
                    <div className="lg:w-[45%] bg-gray-900 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#16c44f]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-[#16c44f] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#16c44f]/20 mb-10">
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-5xl font-black leading-none mb-6 tracking-tighter italic">Commande <br />confirmée !</h1>
                            <p className="text-gray-400 font-bold leading-relaxed mb-8">
                                Merci pour votre confiance. Votre commande a été enregistrée avec succès et les commerçants ont été notifiés.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <div className="w-2 h-2 rounded-full bg-[#16c44f]"></div>
                                    <span className="text-gray-300">Statut:</span>
                                    <span className="px-3 py-1 bg-[#16c44f]/20 text-[#16c44f] rounded-full text-[10px] uppercase">En attente</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <div className="w-2 h-2 rounded-full bg-[#16c44f]"></div>
                                    <span className="text-gray-300">ID:</span>
                                    <span className="text-white font-mono text-xs">{id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 space-y-4">
                            <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-100 transition-all transition-transform active:scale-95">
                                <Download size={18} />
                                Télécharger la facture
                            </button>
                            <Link to="/my-orders" className="w-full py-4 bg-[#16c44f] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[#12a643] transition-all transition-transform active:scale-95 group">
                                Mes commandes
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Section - Details */}
                    <div className="lg:w-[55%] p-12 lg:p-16 flex flex-col">
                        <h2 className="text-2xl font-black text-gray-900 mb-10 uppercase tracking-tight italic">Détails de livraison</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#16c44f]">
                                    <MapPin size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Adresse</span>
                                </div>
                                <div className="pl-8">
                                    <p className="font-black text-gray-900">{order?.shippingAddress?.fullName || 'Client'}</p>
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed">
                                        {order?.shippingAddress?.details}<br />
                                        {order?.shippingAddress?.city}, Burkina Faso
                                    </p>
                                    <p className="text-sm font-black text-[#16c44f] mt-1">{order?.shippingAddress?.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#16c44f]">
                                    <Calendar size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date estimée</span>
                                </div>
                                <div className="pl-8">
                                    <p className="font-black text-gray-900">24-48 Heures</p>
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed">
                                        Livraison Express par nos transporteurs locaux.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto border-t border-gray-50 pt-10">
                            <div className="bg-[#f8fafc] rounded-[2rem] p-8 border border-gray-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#16c44f] shadow-sm">
                                    <Truck size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total payé</p>
                                    <p className="text-3xl font-black text-gray-900 leading-none">
                                        {order?.totalPrice?.toLocaleString() || '---'} <span className="text-xs font-black opacity-30">FCFA</span>
                                    </p>
                                    <div className="text-[10px] font-black text-[#16c44f] uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#16c44f] animate-pulse"></div>
                                        {order?.paymentMethod?.toUpperCase()} MONEY
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-10 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                    FasoMarket — Authentique & Local
                </p>
            </footer>
        </div>
    );
}
