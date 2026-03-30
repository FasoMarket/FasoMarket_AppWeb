import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { 
  Banknote, 
  ShoppingBag as ShoppingBagIcon, 
  Package, 
  Eye, 
  Edit2, 
  PlusCircle,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Star,
  ArrowRight,
  Clock,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const isVendorApproved = user?.isVendorApproved;

  useEffect(() => {
    if (!isVendorApproved) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ovRes, lowRes, ordersRes] = await Promise.all([
          vendorAdvancedService.getOverview(),
          vendorAdvancedService.getLowStock(),
          vendorAdvancedService.getOrders({ limit: 5 })
        ]);

        setOverview(ovRes.data.overview);
        setLowStockProducts(lowRes.data.products || []);
        setOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error('Erreur tableau de bord:', err);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isVendorApproved]);

  // Restricted view for unapproved vendors
  if (!isVendorApproved) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Compte en attente d'approbation</p>
            <p className="text-xs text-amber-700 mt-0.5">Délai: 24-48 heures • Email de confirmation à venir</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatCards = () => [
    { name: 'Chiffre d\'Affaires', value: overview?.grossRevenue?.toLocaleString() || 0, unit: 'CFA', trend: 'Brut', trendType: 'up', icon: Banknote, color: 'text-slate-400' },
    { name: 'Revenu Net', value: overview?.netRevenue?.toLocaleString() || 0, unit: 'CFA', trend: '-5% comm.', trendType: 'up', icon: ShieldCheck, color: 'text-emerald-500' },
    { name: 'Stock Faible', value: overview?.lowStock || 0, unit: 'produits', trend: '', trendType: 'down', icon: AlertCircle, color: 'text-red-500' },
    { name: 'Ventes du Mois', value: overview?.ordersThisMonth || 0, unit: '', trend: 'Mois en cours', trendType: 'up', icon: ShoppingBagIcon, color: 'text-blue-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-3xl flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 text-amber-800 flex-1">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold">⚠️ Alerte Stocks ({lowStockProducts.length} produits)</p>
              <p className="text-xs opacity-80 mt-1">
                {lowStockProducts.length === 1 
                  ? `"${lowStockProducts[0]?.name}" est presque épuisé (${lowStockProducts[0]?.stock} unités restantes).`
                  : `${lowStockProducts.map(p => `"${p?.name}" (${p?.stock} unités)`).join(', ')} sont presque épuisés.`
                }
              </p>
              <p className="text-xs opacity-70 mt-1">Pensez à réapprovisionner rapidement.</p>
            </div>
          </div>
          <Link to="/vendor/products" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0">
            Gérer le stock
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatCards().map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2.5 rounded-2xl bg-opacity-10", stat.color.replace('text-', 'bg-'))}>
                <stat.icon className={stat.color} size={24} />
              </div>
              {stat.trend && (
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full",
                  stat.trendType === 'up' ? "text-primary bg-primary/5" : "text-red-500 bg-red-500/5"
                )}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-2xl font-black mt-1 text-slate-800">
              {stat.value} <span className="text-xs font-medium text-slate-400">{stat.unit}</span>
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
            <h3 className="text-lg font-bold text-slate-800">Commandes Récentes</h3>
            <Link to="/vendor/orders" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              Tout voir <ChevronRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Articles</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-800">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{order.customer?.name || 'Client'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">{order.items?.length || 0} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{order.vendorTotal?.toLocaleString() || order.totalAmount?.toLocaleString()} FCFA</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/vendor/orders/${order._id}`} className="text-primary hover:bg-primary/10 p-2 rounded-lg inline-block transition-all">
                        <Edit2 size={16} />
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                      Aucune commande à afficher
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Notes & Avis</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-black text-slate-800">{overview?.avgRating || '0.0'}</div>
              <div>
                <div className="flex text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill={overview?.avgRating >= 4.5 ? 'currentColor' : 'none'} />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">{overview?.totalReviews || 0} avis clients</p>
              </div>
            </div>
            <Link to="/vendor/reviews" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-primary hover:text-white transition-all">
              <span className="text-sm font-bold">Répondre aux avis</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Performance Banner */}
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Analytiques</p>
              <h4 className="font-bold text-xl mb-4 leading-tight">Consultez vos rapports de vente détaillés</h4>
              <Link 
                to="/vendor/analytics"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-xs font-black uppercase hover:shadow-xl transition-all active:scale-95"
              >
                Explorer <ArrowRight size={16} />
              </Link>
            </div>
            <TrendingUp className="absolute -right-6 -bottom-6 text-white/5 w-40 h-40 rotate-12 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </div>
    </div>
  );
}
