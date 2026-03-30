import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getAdminUrl } from '../config/urls';
import RoleBasedNavbar from './RoleBasedNavbar';

/**
 * Composant qui affiche l'interface correcte selon le rôle de l'utilisateur
 * - customer: Page d'accueil client
 * - vendor: Dashboard vendeur
 * - admin: Redirection vers app admin
 */
export default function RoleBasedLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Attendre que l'authentification soit chargée
    if (!isAuthenticated || !user) return;

    console.log('🔍 RoleBasedLayout - User:', user);
    console.log('🔍 isAuthenticated:', isAuthenticated);
    console.log('🔍 isVendorApproved:', user?.isVendorApproved);

    // Si l'utilisateur est admin, rediriger vers l'app admin
    if (user?.role === 'admin') {
      window.location.href = getAdminUrl();
      return;
    }

    // Si c'est un vendeur non approuvé, afficher un message (mais pas si on est déjà sur la page)
    if (user?.role === 'vendor' && !user?.isVendorApproved && location.pathname !== '/vendor/pending-approval') {
      console.log('⚠️  Vendor non approuvé, redirection vers pending-approval');
      navigate('/vendor/pending-approval', { replace: true });
    } else if (user?.role === 'vendor' && user?.isVendorApproved && location.pathname === '/vendor/pending-approval') {
      console.log('✅ Vendor approuvé, redirection vers dashboard');
      navigate('/vendor', { replace: true });
    }
  }, [user, isAuthenticated, loading, navigate, location.pathname]);

  return (
    <>
      <RoleBasedNavbar />
      {children}
    </>
  );
}
