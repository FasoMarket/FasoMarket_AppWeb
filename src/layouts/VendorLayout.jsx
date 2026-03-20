import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
  Bell,
  Search,
  Plus,
  LogOut,
  ShieldCheck,
  Tag,
  Mail,
  Star,
  BarChart2,
  DollarSign,
  Layers,
  Percent,
  MessageCircle,
  ShoppingBag,
  Wallet,
  Megaphone
} from 'lucide-react';

import { cn } from '../utils/cn';
import { authService } from '../services/authService';
import NotificationBell from '../components/NotificationBell';
import PageWrapper from '../components/PageWrapper';
import { vendorAdvancedService } from '../services/vendorAdvancedService';
import { useState, useEffect } from 'react';


const vendorNavigation = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Ma boutique', href: '/vendor/store', icon: Store },
  { name: 'Produits', href: '/vendor/products', icon: Package },
  { name: 'Collections', href: '/vendor/collections', icon: Layers },
  { name: 'Promotions', href: '/vendor/promotions', icon: Percent },
  { name: 'Commandes', href: '/vendor/orders', icon: ShoppingBag },
  { name: 'Avis clients', href: '/vendor/reviews', icon: Star },
  { name: 'Analytiques', href: '/vendor/analytics', icon: BarChart2 },
  { name: 'Finances',    href: '/vendor/finances',  icon: DollarSign },
  { name: 'Mon Wallet',  href: '/vendor/wallet',    icon: Wallet },
  { name: 'Offres clients', href: '/vendor/offers', icon: Megaphone },
  { name: 'Messagerie', href: '/vendor/messages', icon: MessageCircle },
  { name: 'Paramètres', href: '/vendor/settings', icon: Settings },
];


export default function VendorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    vendorAdvancedService.getMyStore()
      .then(res => setStore(res.data))
      .catch(err => console.error("Erreur chargement boutique:", err));
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };


  return (
    <div className="flex min-h-screen bg-[#f6f8f6]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/10 bg-white flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <Store size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">FasoMarket</h1>
            <p className="text-xs text-primary font-medium uppercase tracking-wider">Vendeur</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {vendorNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const isStoreLink = item.name === 'Ma boutique';
            const href = isStoreLink ? `/vendor/store` : item.href;
            const target = "_self";

            return (
              <Link
                key={item.name}
                to={href}
                target={target}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/20"
                    : "text-slate-600 hover:bg-primary/5 hover:text-slate-900"
                )}
              >
                {(() => {
                  const Icon = item.icon;
                  return <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-105")} />;
                })()}
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black">
              {user?.name?.[0]?.toUpperCase() || 'V'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || 'Vendeur Faso'}</p>
              <p className="text-xs text-slate-500 truncate">{store?.name || 'Ma Boutique'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full mt-4 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Shared Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {vendorNavigation.find(n => location.pathname.startsWith(n.href))?.name || 'Tableau de bord'}
            </h2>
            <p className="text-slate-500 mt-1">Bienvenue sur votre espace de vente FasoMarket.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent w-64 outline-none transition-all"
                placeholder="Rechercher..."
                type="text"
              />
            </div>
            <NotificationBell />
            <Link to="/vendor/products/new" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
              <Plus size={20} />
              Nouveau Produit
            </Link>
          </div>
        </header>

        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>
    </div>
  );
}
