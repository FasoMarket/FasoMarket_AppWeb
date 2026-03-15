import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  AlertCircle,
  Settings,
  Search,
  Bell,
  LogOut,
  Store
} from 'lucide-react';

import { cn } from '../utils/cn';


const adminNavigation = [
  { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Gestion Vendeurs', href: '/admin/vendors', icon: ShieldCheck },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Produits Signalés', href: '/admin/reported', icon: AlertCircle },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];


export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden lg:flex">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">FasoMarket</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}
              >
                {(() => {
                  const Icon = item.icon;
                  return <Icon size={20} />;
                })()}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl mb-4">
            <img
              alt="Admin"
              className="w-10 h-10 rounded-full border border-gray-200"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFPQA7aZv_-P4x1Uay1BEv1De50gj_YI74QqJYVGOlEL8wvUSP-Bi6OdbKWeZ2xaemqljgNdY8Af28ubxPnufN8QtjjjgRyQw1VSL0X9CM4M3g1OpuOQepsnkhC-Ks9h54K6of8YflgKu0n8BvmRMvTgAXsB2a-_3A-K0U2QEczsydGL7MP-PTlXoGEr3jFc570xIhdraaNMCNkM0R6w_ejK7ZfTfEHTG42Vgy-f9xtPMDyMNu608n84vy3ii9q-g0NT03kLBPkuJZ"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Admin Faso</p>
              <p className="text-xs text-gray-500 truncate">admin@fasomarket.bf</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 flex max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary text-sm placeholder-gray-500 outline-none transition-all"
                placeholder="Rechercher..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
