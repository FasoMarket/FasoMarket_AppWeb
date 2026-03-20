import { cn } from '../../utils/cn';
import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronRight,
  Loader2,
  AlertCircle,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';

const getStatusStyle = (status) => {
    switch (status) {
        case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
        case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
        case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
        case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'En attente';
        case 'processing': return 'En préparation';
        case 'shipped': return 'Expédiée';
        case 'delivered': return 'Livrée';
        case 'cancelled': return 'Annulée';
        default: return status;
    }
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Toutes');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await vendorAdvancedService.getOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
      setError('Impossible de charger les commandes.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Toutes') return true;
    if (activeTab === 'Nouvelles') return order.orderStatus === 'pending';
    if (activeTab === 'En cours') return ['processing', 'shipped'].includes(order.orderStatus);
    if (activeTab === 'Terminées') return order.orderStatus === 'delivered';
    return true;
  });

  const getTabCounts = () => ({
    Toutes: orders.length,
    Nouvelles: orders.filter(o => o.orderStatus === 'pending').length,
    'En cours': orders.filter(o => ['processing', 'shipped'].includes(o.orderStatus)).length,
    Terminées: orders.filter(o => o.orderStatus === 'delivered').length
  });

  const counts = getTabCounts();
  const tabs = [
    { name: 'Toutes', count: counts.Toutes },
    { name: 'Nouvelles', count: counts.Nouvelles },
    { name: 'En cours', count: counts['En cours'] },
    { name: 'Terminées', count: counts.Terminées }
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-black">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
                activeTab === tab.name ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-gray-700"
              )}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Commande</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant Brut</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commission</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Vendeur</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                      <p className="font-black text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{order.items.length} Article(s)</p>
                  </td>
                  <td className="px-6 py-4">
                      <p className="font-bold text-gray-700">{order.user?.name || 'Client FM'}</p>
                      <p className="text-[10px] font-medium text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-gray-400 text-xs">{order.totalPrice.toLocaleString()} <span className="text-[10px] opacity-30 uppercase">CFA</span></td>
                  <td className="px-6 py-4 font-bold text-red-400 text-xs">-{order.commissionAmount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">{order.netAmount?.toLocaleString() || order.totalPrice.toLocaleString()} <span className="text-[10px] opacity-30 uppercase font-black">CFA</span></td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                      getStatusStyle(order.orderStatus)
                    )}>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/vendor/orders/${order._id}`}
                      className="text-primary font-black uppercase tracking-widest hover:text-white px-5 py-2 rounded-xl border border-primary/20 hover:bg-primary transition-all text-[10px] inline-flex items-center gap-2 group"
                    >
                      Détails <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="8" className="px-6 py-32 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                            <Package size={32} />
                        </div>
                        <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Aucune commande trouvée</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
