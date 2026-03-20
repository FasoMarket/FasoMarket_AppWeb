import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Loader2, 
  Users, 
  Store, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useToast } from '../../contexts/ToastContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      setStats(res.data?.data || res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await adminService.approveVendor(id);
        showToast('Vendeur approuvé', 'success');
      } else {
        await adminService.rejectVendor(id);
        showToast('Vendeur rejeté', 'success');
      }
      fetchStats();
    } catch (err) {
      console.error(`Error ${action}ing vendor:`, err);
      showToast(`Erreur lors de l'action`, 'error');
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  const statsCards = [
    { name: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Vendeurs', value: stats.totalVendors, icon: Store, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Produits', value: stats.totalProducts, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Ventes (FCFA)', value: stats.totalSales, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Commissions', value: stats.totalCommission, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'En attente', value: stats.pendingVendors, icon: Clock, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="text-gray-500 font-medium italic">Aperçu global de l'activité de la plateforme.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
               <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
               </div>
               <TrendingUp size={16} className="text-primary" />
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-3xl font-black mt-1 text-gray-900">{stat.value?.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Vendors Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#fcfdfc]">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Validations en attente</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Nouveaux dossiers à traiter</p>
                </div>
             </div>
             <Link to="/admin/vendors" className="px-5 py-2 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all active:scale-95 border border-gray-100">
                Tout voir
             </Link>
          </div>
          <div className="divide-y divide-gray-50 bg-white">
             {stats.pendingVendorsList?.map((vendor) => (
               <div key={vendor._id} className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-black">
                        {vendor.name?.[0]}
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 text-sm">{vendor.name}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-tight">{vendor.shop} • {new Date(vendor.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={() => handleAction(vendor._id, 'approve')}
                        className="p-3 text-green-600 bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100 shadow-sm active:scale-90"
                      >
                        <CheckCircle2 size={18} />
                     </button>
                     <button 
                        onClick={() => handleAction(vendor._id, 'reject')}
                        className="p-3 text-red-500 bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm active:scale-90"
                      >
                        <XCircle size={18} />
                     </button>
                  </div>
               </div>
             ))}
          </div>
          {(!stats.pendingVendorsList || stats.pendingVendorsList.length === 0) && (
             <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Store size={32} />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">Félicitations !<br/>Aucun dossier en attente.</p>
             </div>
          )}
        </div>

        {/* System Health / Recent Alerts */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                 <AlertTriangle size={20} className="text-orange-500" />
                 Alertes Récentes
              </h3>
              <div className="space-y-4">
                 {[
                   { type: 'warning', msg: 'Pic de trafic détecté (Mobile App)', time: '10 min' },
                   { type: 'error', msg: 'Échec de paiement (Orange Money)', time: '45 min' },
                   { type: 'info', msg: 'Nouveau rapport de produit (#452)', time: '2h' },
                 ].map((alert, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                       <div className={cn(
                         "w-1.5 h-full rounded-full shrink-0",
                         alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                       )}></div>
                       <div>
                          <p className="text-sm font-bold text-gray-800">{alert.msg}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-black mt-1">Il y a {alert.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                 <p className="text-xs uppercase tracking-widest font-black text-primary mb-2">Maintenance</p>
                 <h4 className="font-bold text-lg mb-4">Prochaine maintenance prévue ce dimanche à 02:00.</h4>
                 <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
                    Gérer le planning
                 </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                 <ShieldCheck size={120} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ShieldCheck importé depuis lucide-react
