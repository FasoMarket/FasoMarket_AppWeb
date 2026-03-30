import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
  Bell,
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
  Megaphone,
  Clock,
  AlertCircle
} from 'lucide-react';

import { cn } from '../utils/cn';
import { authService } from '../services/authService';
import NotificationBell from '../components/NotificationBell';
import PageWrapper from '../components/PageWrapper';
import { vendorAdvancedService } from '../services/vendorAdvancedService';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';


const vendorNavigation = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Ma boutique', href: '/vendor/store', icon: Store },
  { name: 'Produits', href: '/vendor/products', icon: Package },
  { name: 'Promotions', href: '/vendor/promotions', icon: Percent },
  { name: 'Commandes', href: '/vendor/orders', icon: ShoppingBag },
  { name: 'Avis clients', href: '/vendor/reviews', icon: Star },
  { name: 'Mon Wallet',  href: '/vendor/wallet',    icon: Wallet },
  { name: 'Annonces', href: '/vendor/announcements', icon: Bell },
  { name: 'Messagerie', href: '/vendor/messages', icon: MessageCircle },
  { name: 'Paramètres', href: '/vendor/settings', icon: Settings },
];


export default function VendorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const authUser = authService.getUser();

  useEffect(() => {
    vendorAdvancedService.getMyStore()
      .then(res => {
        const storeData = res.data?.data || res.data;
        setStore(storeData);
      })
      .catch(err => console.error("Erreur chargement boutique:", err));
  }, []);

  // Charger le nombre d'annonces non lues
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await API.get('/communications');
        const commsArray = res.data?.data || res.data || [];
        const vendorComms = Array.isArray(commsArray) 
          ? commsArray.filter(c => (c.targetRole === 'vendor' || c.targetRole === 'all') && !c.isRead)
          : [];
        setUnreadCount(vendorComms.length);
      } catch (err) {
        console.error('Erreur chargement annonces:', err);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isVendorApproved = user?.isVendorApproved || authUser?.isVendorApproved;

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

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group relative",
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
                {item.name === 'Annonces' && unreadCount > 0 && (
                  <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black">
              {authUser?.name?.[0]?.toUpperCase() || 'V'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{authUser?.name || 'Vendeur Faso'}</p>
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
        {/* Pending Approval Banner */}
        {!isVendorApproved && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">Compte en attente d'approbation (24-48h)</p>
              <p className="text-xs text-amber-700 mt-0.5">Vous recevrez un email dès validation</p>
            </div>
          </div>
        )}

        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>
    </div>
  );
}
