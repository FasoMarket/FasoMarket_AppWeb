import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    ChevronLeft, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    CreditCard, 
    Loader2,
    AlertCircle,
    Store,
    ArrowUpRight,
    MessageSquare,
    HelpCircle,
    Download,
    Ban,
    MessageSquareWarning,
    BadgeDollarSign,
    Star
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { clientAdvancedService } from '../services/clientAdvancedService';
import { useToast } from '../contexts/ToastContext';

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [error, setError] = useState('');
    
    // Advanced features state
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [disputeForm, setDisputeForm] = useState({ reason: 'item_not_received', description: '' });
    const [refundForm, setRefundForm] = useState({ reason: '', description: '', amount: 0 });
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderService.getById(id);
                setOrder(res.data);
            } catch (err) {
            console.error('Erreur chargement commande:', err);
            if (err.response?.data) {
                console.error('Détails erreur backend:', err.response.data);
            }
            setError('Impossible de charger la commande.');
        } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending': return { color: 'text-amber-500', bg: 'bg-amber-50', icon: <Clock size={20} />, label: 'En attente', desc: 'Votre commande est en attente de traitement.' };
            case 'processing': return { color: 'text-blue-500', bg: 'bg-blue-50', icon: <Package size={20} />, label: 'Traitement', desc: 'Le vendeur prépare vos articles.' };
            case 'shipped': return { color: 'text-purple-500', bg: 'bg-purple-50', icon: <Truck size={20} />, label: 'Expédiée', desc: 'Votre colis est en route.' };
            case 'delivered': return { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: <CheckCircle2 size={20} />, label: 'Livrée', desc: 'La commande a été remise en mains propres.' };
            case 'cancelled': return { color: 'text-red-500', bg: 'bg-red-50', icon: <Ban size={20} />, label: 'Annulée', desc: 'Cette commande a été annulée.' };
            default: return { color: 'text-gray-500', bg: 'bg-gray-50', icon: <Clock size={20} />, label: status, desc: '' };
        }
    };

    const handleDownloadInvoice = async () => {
        setDownloading(true);
        try {
            const res = await clientAdvancedService.downloadInvoice(id);
            // res.data is a Blob because of responseType: 'blob'
            const url = window.URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Facture_${order._id.slice(-8).toUpperCase()}.html`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erreur téléchargement facture:', err);
            showToast('Erreur lors du téléchargement de la facture', 'error');
        } finally {
            setDownloading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Voulez-vous vraiment annuler cette commande ?')) return;
        try {
            await clientAdvancedService.cancelOrder(id);
            showToast('Commande annulée avec succès', 'success');
            setOrder({...order, orderStatus: 'cancelled'});
        } catch (err) {
            showToast(err.response?.data?.message || "Erreur lors de l'annulation", 'error');
        }
    };

    const handleOpenDispute = async (e) => {
        e.preventDefault();
        try {
            await clientAdvancedService.openDispute({ orderId: id, ...disputeForm });
            showToast('Litige ouvert avec succès', 'success');
            setShowDisputeModal(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Erreur ouverture litige', 'error');
        }
    };

    const handleRequestRefund = async (e) => {
        e.preventDefault();
        try {
            await clientAdvancedService.requestRefund({ orderId: id, ...refundForm });
            showToast('Demande de remboursement envoyée', 'success');
            setShowRefundModal(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Erreur demande', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#16c44f] animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-6">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase italic">{error || 'Commande introuvable'}</h2>
                <Link to="/my-orders" className="text-xs font-black text-[#16c44f] uppercase tracking-widest hover:underline mt-4">Retour à mes commandes</Link>
            </div>
        );
    }

    const status = getStatusInfo(order.orderStatus);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link to="/my-orders" className="flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-colors">
                            <div className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center">
                                <ChevronLeft size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Retour aux commandes</span>
                        </Link>
                        <h1 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Détails Commande</h1>
                        <div className="w-8"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* Left Column: Tracking & Items */}
                    <div className="flex-1 space-y-10 w-full">
                        
                        {/* Order Status Header */}
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    <Clock size={14} />
                                    <span>Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Commande #{order._id.slice(-8).toUpperCase()}</h2>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${status.color}`}>{status.label}</p>
                                    <p className="text-[10px] font-bold text-gray-400 max-w-[200px] leading-relaxed italic">{status.desc}</p>
                                </div>
                                <div className={`w-16 h-16 rounded-2xl ${status.bg} ${status.color} flex items-center justify-center shadow-lg`}>
                                    {status.icon}
                                </div>
                            </div>
                        </div>

                        {/* Order Actions Toolbar */}
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={handleDownloadInvoice}
                                disabled={downloading}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-700 hover:border-[#16c44f] hover:text-[#16c44f] transition-all"
                            >
                                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                Télécharger Facture
                            </button>
                            
                            {order.orderStatus === 'pending' && (
                                <button 
                                    onClick={handleCancelOrder}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-red-100 rounded-2xl shadow-sm text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <Ban size={18} />
                                    Annuler la commande
                                </button>
                            )}

                            {(order.orderStatus === 'delivered' || order.orderStatus === 'shipped') && (
                                <>
                                    <button 
                                        onClick={() => setShowDisputeModal(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-white border border-orange-100 rounded-2xl shadow-sm text-sm font-bold text-orange-500 hover:bg-orange-50 transition-all"
                                    >
                                        <MessageSquareWarning size={18} />
                                        Ouvrir un litige
                                    </button>
                                    <button 
                                        onClick={() => { setRefundForm({...refundForm, amount: order.totalPrice}); setShowRefundModal(true); }}
                                        className="flex items-center gap-2 px-6 py-3 bg-white border border-teal-100 rounded-2xl shadow-sm text-sm font-bold text-teal-600 hover:bg-teal-50 transition-all"
                                    >
                                        <BadgeDollarSign size={18} />
                                        Demander un remboursement
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Articles ({order.items.length})</h3>
                            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className={`p-8 flex flex-col sm:flex-row sm:items-center gap-8 ${idx !== order.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                        <div className="w-24 h-24 rounded-2xl border border-gray-100 overflow-hidden shrink-0 group">
                                            <img src={item.product?.images?.[0] || item.product?.image} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${item.product?._id}`} className="inline-flex items-center gap-2 group">
                                                <h4 className="text-lg font-black text-gray-900 group-hover:text-[#16c44f] transition-colors truncate">{item.product?.name}</h4>
                                                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#16c44f] transition-colors" />
                                            </Link>
                                            <div className="flex items-center gap-3 mt-1 mb-4">
                                                <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                    <Store size={10} className="text-[#16c44f]" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.store?.name || 'Vendeur FasoMarket'}</span>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Prix unitaire</p>
                                                    <p className="text-sm font-black text-gray-900">{item.price.toLocaleString()} FCFA</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Quantité</p>
                                                    <p className="text-sm font-black text-gray-900">x {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Total produit</p>
                                            <p className="text-xl font-black text-[#16c44f]">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px] font-black opacity-30">FCFA</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Address & Payment */}
                    <div className="w-full lg:w-[400px] shrink-0 space-y-10">
                        
                        {/* Shipping Info */}
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Informations Livraison</h3>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Détails</p>
                                        <p className="text-sm font-black text-gray-900 mb-1">{order.shippingAddress?.fullName}</p>
                                        <p className="text-sm font-bold text-gray-500 leading-relaxed italic">{order.shippingAddress?.details}</p>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{order.shippingAddress?.city}, BF</p>
                                        <p className="text-sm font-black text-[#16c44f] mt-2">{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paiement</p>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.paymentMethod} Money</p>
                                        <p className={`text-[10px] font-black uppercase mt-1 ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {order.paymentStatus === 'paid' ? 'Payé avec succès' : 'En attente de confirmation'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-400/20">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-10">Résumé financier</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Sous-total</span>
                                    <span className="text-white">{(order.totalPrice - (order.totalPrice > 50000 ? 0 : 1500)).toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Livraison</span>
                                    <span className="text-[#16c44f]">{order.totalPrice > 50000 ? 'GRATUIT' : '1.500 FCFA'}</span>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex flex-col gap-2">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Total payé</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-[#16c44f] tracking-tighter">{order.totalPrice.toLocaleString()}</span>
                                        <span className="text-xs font-black text-gray-500 uppercase">FCFA</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => showToast('Le service support est actuellement saturé. Veuillez réessayer plus tard.', 'info')}
                                className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all group overflow-hidden relative active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <MessageSquare size={20} className="text-[#16c44f]" />
                                <span className="text-sm font-black uppercase tracking-widest">Aide & Support</span>
                            </button>
                        </div>

                    </div>

                </div>
            </main>

            {/* Modals */}
            {showDisputeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                                <MessageSquareWarning size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Signaler un litige</h3>
                                <p className="text-xs text-gray-500 font-medium">Pour la commande #{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                        <form onSubmit={handleOpenDispute} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Raison du litige</label>
                                <select 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                                    value={disputeForm.reason}
                                    onChange={(e) => setDisputeForm({...disputeForm, reason: e.target.value})}
                                >
                                    <option value="item_not_received">Article non reçu</option>
                                    <option value="not_as_described">Non conforme à la description</option>
                                    <option value="defective">Produit défectueux / cassé</option>
                                    <option value="fake_product">Contrefaçon</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Explications détaillées</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-medium outline-none resize-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="Expliquez-nous exactement ce qui s'est passé..."
                                    value={disputeForm.description}
                                    onChange={(e) => setDisputeForm({...disputeForm, description: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowDisputeModal(false)} className="flex-1 py-4 font-black text-sm text-gray-500 hover:bg-gray-50 rounded-2xl">Annuler</button>
                                <button type="submit" className="flex-1 py-4 font-black text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg shadow-orange-500/20">Soumettre</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showRefundModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                                <BadgeDollarSign size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Demande de remboursement</h3>
                                <p className="text-xs text-gray-500 font-medium">Pour la commande #{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                        <form onSubmit={handleRequestRefund} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Montant demandé (FCFA)</label>
                                <input 
                                    type="number"
                                    max={order.totalPrice}
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-black text-xl text-center outline-none focus:ring-2 focus:ring-teal-500/20"
                                    value={refundForm.amount}
                                    onChange={(e) => setRefundForm({...refundForm, amount: Number(e.target.value)})}
                                />
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-1">Maximum: {order.totalPrice.toLocaleString()} FCFA</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Raison</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-medium outline-none resize-none focus:ring-2 focus:ring-teal-500/20"
                                    placeholder="Pourquoi demandez-vous un remboursement ?"
                                    value={refundForm.reason}
                                    onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowRefundModal(false)} className="flex-1 py-4 font-black text-sm text-gray-500 hover:bg-gray-50 rounded-2xl">Annuler</button>
                                <button type="submit" className="flex-1 py-4 font-black text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-2xl shadow-lg shadow-teal-600/20">Envoyer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="py-20 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                    FasoMarket — Qualité Supérieure Garante
                </p>
            </footer>
        </div>
    );
}
