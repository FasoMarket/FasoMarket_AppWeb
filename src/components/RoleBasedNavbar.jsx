import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Store, LayoutDashboard, Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function RoleBasedNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ne pas afficher la navbar pour les vendeurs (ils ont le sidebar)
  if (isAuthenticated && user?.role === 'vendor') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation selon le rôle
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Accueil', href: '/' },
        { label: 'Produits', href: '/products' },
        { label: 'Boutiques', href: '/stores' },
      ];
    }

    // Customer
    return [
      { label: 'Accueil', href: '/' },
      { label: 'Produits', href: '/products' },
      { label: 'Mes Commandes', href: '/my-orders' },
      { label: 'Favoris', href: '/wishlist' },
      { label: 'Mes Avis', href: '/my-reviews' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-black text-white">FM</span>
            </div>
            <span className="font-black text-lg hidden sm:inline">FasoMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart size={20} className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                {/* Dropdown Menu */}
                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Menu size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                    >
                      <User size={18} />
                      Mon Profil
                    </Link>
                    <Link
                      to="/notifications"
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                    >
                      <ShoppingCart size={18} />
                      Notifications
                    </Link>
                    {user?.role === 'vendor' && (
                      <Link
                        to="/vendor/store"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                      >
                        <Store size={18} />
                        Ma Boutique
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
