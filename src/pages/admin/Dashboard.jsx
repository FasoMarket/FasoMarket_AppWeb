import { Link } from 'react-router-dom';
import { 
  Users, 
  Store, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';


const stats = [
  { name: 'Utilisateurs', value: '1,280', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Vendeurs', value: '84', icon: Store, color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'Commandes', value: '3,420', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-100' },
  { name: 'Signalements', value: '12', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
];

const pendingVendors = [
  { id: 1, name: 'Sali Traoré', shop: 'Artisanat du Nord', date: 'Il y a 2h', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFPQA7aZv_-P4x1Uay1BEv1De50gj_YI74QqJYVGOlEL8wvUSP-Bi6OdbKWeZ2xaemqljgNdY8Af28ubxPnufN8QtjjjgRyQw1VSL0X9CM4M3g1OpuOQepsnkhC-Ks9h54K6of8YflgKu0n8BvmRMvTgAXsB2a-_3A-K0U2QEczsydGL7MP-PTlXoGEr3jFc570xIhdraaNMCNkM0R6w_ejK7ZfTfEHTG42Vgy-f9xtPMDyMNu608n84vy3ii9q-g0NT03kLBPkuJZ' },
  { id: 2, name: 'Jean Coulibaly', shop: 'Savon Bio BF', date: 'Il y a 5h', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFPQA7aZv_-P4x1Uay1BEv1De50gj_YI74QqJYVGOlEL8wvUSP-Bi6OdbKWeZ2xaemqljgNdY8Af28ubxPnufN8QtjjjgRyQw1VSL0X9CM4M3g1OpuOQepsnkhC-Ks9h54K6of8YflgKu0n8BvmRMvTgAXsB2a-_3A-K0U2QEczsydGL7MP-PTlXoGEr3jFc570xIhdraaNMCNkM0R6w_ejK7ZfTfEHTG42Vgy-f9xtPMDyMNu608n84vy3ii9q-g0NT03kLBPkuJZ' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="text-gray-500">Aperçu global de l'activité de la plateforme.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
               <div className={cn("p-3 rounded-xl", stat.bg)}>
                {(() => {
                  const Icon = stat.icon;
                  return <Icon size={24} className={stat.color} />;
                })()}
               </div>
               <TrendingUp size={16} className="text-primary" />
            </div>
            <p className="text-gray-500 text-sm font-bold">{stat.name}</p>
            <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Vendors Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
             <div className="flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                <h3 className="text-lg font-black text-gray-900">Validations en attente</h3>
             </div>
             <Link to="/admin/vendors" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                Tout voir <ChevronRight size={16} />
             </Link>
          </div>
          <div className="divide-y divide-gray-100">
             {pendingVendors.map((vendor) => (
               <div key={vendor.id} className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <img src={vendor.image} alt={vendor.name} className="w-12 h-12 rounded-full border border-gray-200" />
                     <div>
                        <p className="font-bold text-gray-900">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.shop} • {vendor.date}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100" title="Valider">
                        <CheckCircle2 size={20} />
                     </button>
                     <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="Refuser">
                        <XCircle size={20} />
                     </button>
                     <Link 
                       to="/admin/vendors"
                       className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-white hover:border-primary hover:text-primary transition-all"
                     >
                        Détails
                     </Link>
                  </div>
               </div>
             ))}
          </div>
          {pendingVendors.length === 0 && (
             <div className="p-12 text-center">
                <p className="text-gray-400 italic">Aucune validation en attente.</p>
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

function ShieldCheck(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
