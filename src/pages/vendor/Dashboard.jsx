import { cn } from '../../utils/cn';
import { 
  Banknote, 
  ShoppingBag as ShoppingBagIcon, 
  Package, 
  Eye, 
  Edit2, 
  PlusCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const stats = [
  { name: 'Ventes Totales', value: '250.000', unit: 'FCFA', trend: '+12.5%', trendType: 'up', icon: Banknote, color: 'text-primary' },
  { name: 'Commandes', value: '45', unit: '', trend: '+5.2%', trendType: 'up', icon: ShoppingBagIcon, color: 'text-blue-500' },
  { name: 'Produits Actifs', value: '12', unit: '', trend: '-2.1%', trendType: 'down', icon: Package, color: 'text-orange-500' },
  { name: 'Visites Boutique', value: '1.2k', unit: '', trend: '+18.3%', trendType: 'up', icon: Eye, color: 'text-purple-500' },
];

const latestOrders = [
  { id: '#ORD-2489', customer: 'Moussa Koné', date: 'Il y a 2h', amount: '12.500 FCFA', status: 'Livré', statusColor: 'bg-primary/10 text-primary' },
  { id: '#ORD-2490', customer: 'Fatouma Ouedraogo', date: 'Il y a 5h', amount: '45.000 FCFA', status: 'En cours', statusColor: 'bg-yellow-500/10 text-yellow-600' },
  { id: '#ORD-2491', customer: 'Ali Sawadogo', date: 'Hier', amount: '8.200 FCFA', status: 'Livré', statusColor: 'bg-primary/10 text-primary' },
  { id: '#ORD-2492', customer: 'Sali Zongo', date: 'Hier', amount: '22.000 FCFA', status: 'Annulé', statusColor: 'bg-red-500/10 text-red-600' },
];

const quickProducts = [
  { name: 'Baskets de Course', stock: 8, price: '25.000 FCFA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOeoDHCT4yarBqXnn_qtX2RMk-Tmf7k66WCb1og8HwRkfb9e7LLGeB0PDbr1PAzM8cyJfiA_X_extzhIIqAjUAIq1A4rRTrjLxlvQpm2OUPTH2IuFqMIZJW62lUUK3PW4D745o6w-8eaWTyqZGnnT3UxHLYRWk3lAWrRzR46bKQW4AZFuOb9NChC7aLdGeteBwCPvzz6bqhOuNdtRS8wvkmaMrNNugG3aQ8uhPScLnrRfFcjsWyL-9dD62QuEA9AcygqCXkpWpOLNi' },
  { name: 'Montre Classique', stock: 4, price: '55.000 FCFA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_msJuOWwSlWhTAvb0hlPwQLGiV7EPgaauWIvk9DGkjt16t3ZZDO62M4q8LmbViqoQAvOyUGox19wihUQ5mvjEhaoyTbw37tVJNZmCe4O9w14-zlNPJAEsplojUuW7--_SD60B1RTAzaZh29EPfGqGorKDXEyleD_VZ5CFVceLDBI1xWY5s1FVpEI2Kb3Y6wJJlHA-eON7iqs1cVPRebR8L6h3P7-MOUkNO--Pkb3yPKY5iIEt7jhqNBKbO4gyGFwMm4BKEybCY7GS' },
  { name: 'Casque Audio Pro', stock: 12, price: '18.000 FCFA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLX1euLha56kPmz0_EVYKx4qMZjayObzqnctkAEsBaTKfvHxe9DfamkNVfwAEJU01kJWjmpSvfq1ApCLf_W4MIsOdEyZxftqxq6HcqHTbFVD75dvz3y2bvTgz_3sGonrMF0uUKcG0XgBJraQP4cQCn1XpKAWgLJszT6CD8NAms4T2G4m6Mjh8gcPBZh6rv_0iIgmd34ZjjL7s5y3BK9SXFzYilqg2_KrfhEpJ-G8Ob8nxYPEKtMaQSaXZ1sSZIcctbFgWkL8wB5eoh' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (

    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-xl bg-opacity-10", stat.color.replace('text-', 'bg-'))}>
                {(() => {
                  const Icon = stat.icon;
                  return <Icon className={stat.color} size={24} />;
                })()}
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                stat.trendType === 'up' ? "text-primary bg-primary/5" : "text-red-500 bg-red-500/5"
              )}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold mt-1">
              {stat.value} {stat.unit && <span className="text-sm font-normal">{stat.unit}</span>}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-primary/10 flex justify-between items-center">
            <h3 className="text-lg font-bold">Dernières Commandes</h3>
            <Link to="/vendor/orders" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Commande</th>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Montant</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 font-semibold">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase", order.statusColor)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Management / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Gestion Produits</h3>
            <div className="space-y-4">
              {quickProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4 p-3 border border-primary/5 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group">
                  <div 
                    className="w-12 h-12 bg-slate-100 rounded-lg bg-cover bg-center shrink-0" 
                    style={{ backgroundImage: `url('${product.image}')` }}
                  ></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.stock} en stock • {product.price}</p>
                  </div>
                  <Link to="/vendor/products/edit/1" className="text-slate-400 hover:text-primary transition-colors">
                    <Edit2 size={18} />
                  </Link>

                </div>
              ))}
              <Link to="/vendor/products/new" className="w-full py-4 border-2 border-dashed border-primary/20 rounded-xl text-primary text-sm font-bold hover:bg-primary/5 hover:border-primary/40 transition-all flex items-center justify-center gap-2">
                <PlusCircle size={18} />
                Ajouter un autre produit
              </Link>

            </div>
          </div>

          {/* Performance Banner */}
          <div className="bg-gradient-to-br from-primary to-green-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-1">Boostez vos ventes !</h4>
              <p className="text-white/80 text-sm mb-4">Créez une promotion pour vos produits phares et touchez plus de clients.</p>
              <Link 
                to="/vendor/products/new"
                className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold hover:shadow-xl transition-all active:scale-95"
              >
                Ajouter un produit
              </Link>
            </div>
            <TrendingUp className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </div>
    </div>
  );
}
