import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import { cn } from '../../utils/cn';


const stats = [
  { name: 'Revenu Total', value: '1,250,000 FCFA', change: '+12.5%', type: 'up' },
  { name: 'Nouveaux Clients', value: '45', change: '+18.3%', type: 'up' },
  { name: 'Taux de Conversion', value: '3.2%', change: '-0.5%', type: 'down' },
  { name: 'Valeur Panier Moyen', value: '12,500 FCFA', change: '+5.2%', type: 'up' },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytiques & Rapports</h1>
          <p className="text-slate-500">Suivez la performance de votre boutique FasoMarket.</p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Download size={18} /> exporter PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-black px-2 py-1 rounded-full",
                stat.type === 'up' ? "text-primary bg-primary/5" : "text-red-500 bg-red-50/50"
              )}>
                {stat.type === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-primary/10 shadow-sm">
          <h3 className="font-black text-lg mb-8">Évolution des ventes</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
             {[45, 60, 40, 80, 55, 90, 70, 85, 95, 110, 90, 120].map((val, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                 <div className="w-full bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary relative" style={{ height: `${val}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                       {val * 1000} CFA
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][i]}
                 </span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm">
          <h3 className="font-black text-lg mb-8">Top Catégories</h3>
          <div className="space-y-6">
             {[
               { name: 'Artisanat', value: 45, color: 'bg-primary' },
               { name: 'Alimentation', value: 30, color: 'bg-blue-500' },
               { name: 'Maroquinerie', value: 15, color: 'bg-orange-500' },
               { name: 'Divers', value: 10, color: 'bg-slate-300' },
             ].map((cat) => (
               <div key={cat.name} className="space-y-2">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{cat.name}</span>
                    <span className="text-slate-400">{cat.value}%</span>
                 </div>
                 <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${cat.value}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
          
          <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10">
             <div className="flex items-center gap-3 text-primary mb-2">
                <TrendingUp size={24} />
                <span className="font-black text-sm">Conseil Performance</span>
             </div>
             <p className="text-xs text-slate-600 leading-relaxed">
                Vos ventes d'artisanat sont en hausse de 15%. Pensez à ajouter plus de photos pour vos sacs en cuir.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
