import { useState, useEffect } from 'react';
import { adminAdvancedService } from '../../services/adminAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import {
  BarChart2, TrendingUp, Users, ShoppingBag, DollarSign,
  Loader2, RefreshCw, AlertCircle, Package, Clock,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#16a34a','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];
const STATUS_LABELS = { pending: 'En attente', processing: 'En cours', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé', refunded: 'Remboursé' };

export default function AdminAnalytics() {
  const [period,    setPeriod]    = useState('30d');
  const [revenue,   setRevenue]   = useState([]);
  const [topProds,  setTopProds]  = useState([]);
  const [topVends,  setTopVends]  = useState([]);
  const [byStatus,  setByStatus]  = useState([]);
  const [financial, setFinancial] = useState(null);
  const [overview,  setOverview]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(false);
  const { showToast } = useToast();

  useEffect(() => { load(); }, [period]);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const [revRes, prodRes, vendRes, statusRes, finRes, ovRes] = await Promise.all([
        adminAdvancedService.getRevenueChart(period),
        adminAdvancedService.getTopProducts(),
        adminAdvancedService.getTopVendors(),
        adminAdvancedService.getOrdersByStatus(),
        adminAdvancedService.getFinancialReport({}),
        adminAdvancedService.getOverview(),
      ]);
      setRevenue(revRes.data.data || []);
      setTopProds(prodRes.data.data || []);
      setTopVends(vendRes.data.data || []);
      setByStatus((statusRes.data.data || []).map(d => ({ ...d, label: STATUS_LABELS[d.status] || d.status })));
      setFinancial(finRes.data.financial);
      setOverview(ovRes.data.overview);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => (n || 0).toLocaleString('fr-FR');

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 size={36} className="text-primary animate-spin" />
      <p className="text-sm font-bold text-gray-400">Chargement des analytiques…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlertCircle size={36} className="text-rose-400" />
      <p className="text-sm font-bold text-gray-500">Impossible de charger les données.</p>
      <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-black">
        <RefreshCw size={14} /> Réessayer
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart2 size={24} className="text-primary" /> Analytiques
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Vue d'ensemble des performances FasoMarket</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all', period === p ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100')}>
              {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '3 mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview KPIs */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs',  value: fmt(overview.totalUsers),    Icon: Users,       color: 'text-blue-600 bg-blue-50' },
            { label: 'Vendeurs',      value: fmt(overview.totalVendors),   Icon: ShoppingBag, color: 'text-violet-600 bg-violet-50' },
            { label: 'Commandes',     value: fmt(overview.totalOrders),    Icon: Package,     color: 'text-amber-600 bg-amber-50' },
            { label: 'CA Total',      value: `${fmt(overview.totalRevenue)} FCFA`, Icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
          ].map((k, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', k.color)}>
                <k.Icon size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{k.label}</p>
                <p className="text-xl font-black text-gray-900 leading-tight">{k.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial KPIs */}
      {financial && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Chiffre d\'affaires', value: `${fmt(financial.totalRevenue)} FCFA`,    color: 'text-emerald-700' },
            { label: 'Commissions (5%)',    value: `${fmt(financial.totalCommissions)} FCFA`, color: 'text-blue-700' },
            { label: 'Remboursements',      value: `${fmt(financial.totalRefunds)} FCFA`,     color: 'text-rose-700' },
            { label: 'Revenu net',          value: `${fmt(financial.netRevenue)} FCFA`,       color: 'text-primary' },
          ].map((k, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{k.label}</p>
              <p className={cn('text-xl font-black', k.color)}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Évolution des revenus
        </h2>
        {revenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={260} debounce={100}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v.toLocaleString()} FCFA`]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Revenus (FCFA)" />
              <Line type="monotone" dataKey="orders"  stroke="#3b82f6" strokeWidth={2}   dot={false} name="Commandes" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-60 flex items-center justify-center text-gray-400 text-sm font-bold">
            Aucune donnée pour cette période
          </div>
        )}
      </div>

      {/* Top products + Orders by status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Top Produits</h2>
          {topProds.length > 0 ? (
            <ResponsiveContainer width="100%" height={240} debounce={100}>
              <BarChart data={topProds.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#16a34a" radius={[0, 6, 6, 0]} name="Vendus" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm font-bold">Aucun produit vendu</div>}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Commandes par statut</h2>
          {byStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={240} debounce={100}>
              <PieChart>
                <Pie data={byStatus} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm font-bold">Aucune commande</div>}
        </div>
      </div>

      {/* Top vendors */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Top Vendeurs</h2>
        {topVends.length > 0 ? (
          <div className="space-y-3">
            {topVends.slice(0, 8).map((v, i) => (
              <div key={v._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                )}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{v.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{v.totalOrders || 0} commandes</p>
                </div>
                <p className="text-sm font-black text-emerald-600 shrink-0">{fmt(v.revenue)} FCFA</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 font-bold text-center py-8">Aucune donnée disponible</p>}
      </div>
    </div>
  );
}
