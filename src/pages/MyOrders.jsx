import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Package, 
    ChevronRight, 
    Search, 
    Filter,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Loader2,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';
import { orderService } from '../services/orderService';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../contexts/ToastContext';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderToCancel, setOrderToCancel] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderService.getMyOrders();
                setOrders(res.data);
            } catch (err) {
                console.error('Erreur chargement commandes:', err);
                setError('Impossible de charger vos commandes.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={14} />, label: 'En attente' };
            case 'processing': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package size={14} />, label: 'Préparation' };
            case 'shipped': return { color: 'text-purple-600', bg: 'bg-purple-50', icon: <Truck size={14} />, label: 'Expédié' };
            case 'delivered': return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 size={14} />, label: 'Livré' };
            case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={14} />, label: 'Annulé' };
            default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: <Clock size={14} />, label: status };
        }
    };

    const handleCancelOrder = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setOrderToCancel(id);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        try {
            await orderService.cancel(orderToCancel);
            setOrders(orders.map(o => o._id === orderToCancel ? { ...o, orderStatus: 'cancelled' } : o));
            showToast('Commande annulée', 'success');
        } catch (err) {
            console.error('Erreur annulation:', err);
            showToast('Impossible d\'annuler la commande.', 'error');
        } finally {
            setOrderToCancel(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#16c44f] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            {/* Header / Navbar */}
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
                        <div className="flex items-center gap-6">
                            <Link to="/products" className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Produits</Link>
                            <Link to="/cart" className="text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">Panier</Link>
                            <div className="w-10 h-10 bg-[#16c44f]/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-black text-[#16c44f]">HT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic mb-4">Mes commandes</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Suivez vos achats et votre historique</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-600 flex items-center gap-4 font-bold">
                        <AlertCircle size={24} />
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag size={40} className="text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Aucune commande pour le moment</h2>
                        <p className="text-gray-400 font-bold mb-10 max-w-sm mx-auto">
                            Commencez votre shopping dès maintenant et découvrez les meilleurs produits du Burkina.
                        </p>
                        <Link to="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-[#16c44f] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#16c44f]/20 hover:bg-[#12a643] transition-all group">
                            Découvrir les produits
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = getStatusStyle(order.orderStatus);
                            return (
                                <Link 
                                    key={order._id} 
                                    to={`/my-orders/${order._id}`}
                                    className="block bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:border-[#16c44f]/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                        
                                        {/* Status & ID */}
                                        <div className="lg:w-1/4 space-y-2">
                                            <div className="flex items-center">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest mb-2`}>
                                                    {status.icon}
                                                    {status.label}
                                                </div>
                                                {order.orderStatus === 'pending' && (
                                                    <button 
                                                        onClick={(e) => handleCancelOrder(e, order._id)}
                                                        className="ml-2 mb-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">ID: {order._id.slice(-8)}</p>
                                            <p className="text-xs font-black text-gray-900">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>

                                        {/* Items Preview */}
                                        <div className="flex-1 flex items-center gap-4 overflow-hidden">
                                            <div className="flex -space-x-4">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="w-16 h-16 rounded-2xl bg-gray-50 border-4 border-white overflow-hidden shadow-sm shrink-0">
                                                        <img src={item.product?.images?.[0] || item.product?.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-900 border-4 border-white flex items-center justify-center text-white text-xs font-black shadow-sm">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-gray-900 truncate">
                                                    {order.items[0]?.product?.name}
                                                    {order.items.length > 1 && <span className="text-gray-400 font-bold ml-1"> et {order.items.length - 1} autre{order.items.length > 2 ? 's' : ''}</span>}
                                                </h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Article(s)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="lg:w-1/4 text-left lg:text-right flex lg:flex-col justify-between items-center lg:items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                                <p className="text-2xl font-black text-gray-900 leading-none">
                                                    {order.totalPrice.toLocaleString()} <span className="text-xs font-black opacity-30">FCFA</span>
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-[#16c44f] group-hover:text-white transition-all">
                                                <ChevronRight size={24} />
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            <footer className="py-20 text-center border-t border-gray-50 mt-20 bg-white">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                    FasoMarket — Le luxe de l'artisanat burkinabè
                </p>
            </footer>

            <ConfirmModal
                isOpen={!!orderToCancel}
                onClose={() => setOrderToCancel(null)}
                onConfirm={confirmCancelOrder}
                title="Annuler la commande"
                message="Voulez-vous vraiment annuler cette commande ?"
                confirmLabel="Oui, annuler"
                variant="danger"
            />
        </div>
    );
}
