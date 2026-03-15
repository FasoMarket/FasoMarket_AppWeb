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
  Tag
} from 'lucide-react';

import { cn } from '../utils/cn';


const vendorNavigation = [
  { name: 'Accueil', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Produits', href: '/vendor/products', icon: Package },
  { name: 'Commandes', href: '/vendor/orders', icon: ShoppingCart },
  { name: 'Analytiques', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/vendor/settings', icon: Settings },
];


export default function VendorLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
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
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-600 hover:bg-primary/5 hover:text-primary"
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

        <div className="p-4 border-t border-primary/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjfHPJt9SUquylb4731VXtqTd1aCy_osO0BLg0ONBhC-qXuM-vB7EbTx5OdU7htXGS1ykUTzuhQa0nd4z0-Rd0ZgUFCVtu-foH_rUEDaT3hGwwp2h6eE3Y7df5gNESXKPMMdqT2rwuIogZhG3ep9O_fU6GrgTSyPQTi0qQdLR1xHHko-PkOOrukw_TR0s8GP8XiI7wTijXX8qIegHWcjNO70Mrpx-pxx8LEonMYWTZ9MHSzI_oC1Y0qdoVmCu9VyPKpGo3-mGwYyl-')" }}></div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Ibrahim Traoré</p>
              <p className="text-xs text-slate-500 truncate">Boutique Faso</p>
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
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 relative hover:border-primary transition-colors">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/vendor/products/new" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
              <Plus size={20} />
              Nouveau Produit
            </Link>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
