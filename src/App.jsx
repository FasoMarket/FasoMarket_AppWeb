import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedLayout from './components/RoleBasedLayout';
import PageWrapper from './components/PageWrapper';

// Pages publiques
import Home         from './pages/Home';
import Products     from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Stores        from './pages/Stores';
import StoreDetail  from './pages/ShopDetail';
import Login        from './pages/ClientLogin';
import Register     from './pages/ClientRegister';
import VendorRegister from './pages/VendorRegister';
import VendorLanding from './pages/VendorLanding';

// Pages client (connecté)
import Cart         from './pages/Cart';
import Checkout     from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders     from './pages/MyOrders';
import OrderDetail  from './pages/OrderDetail';
import Profile      from './pages/Profile';
import Messages     from './pages/Messages';
import Wishlist     from './pages/client/Wishlist';
import MyReviews    from './pages/client/MyReviews';
import MyDisputes   from './pages/client/MyDisputes';
import MyRefunds    from './pages/client/MyRefunds';

// Pages vendeur
import VendorLayout    from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts  from './pages/vendor/ProductList';
import VendorOrders    from './pages/vendor/OrderList';
import VendorOrderDetailPage from './pages/vendor/VendorOrderDetailPage';
import VendorStore     from './pages/vendor/AddEditProduct';
import PendingApproval from './pages/vendor/PendingApproval';
const VendorSettings = lazy(() => import('./pages/vendor/Settings'));
const VendorManageShop = lazy(() => import('./pages/vendor/ManageShop'));
import VendorReviews   from './pages/vendor/Reviews';
import VendorPromotions from './pages/vendor/Promotions';
import VendorWallet    from './pages/vendor/Wallet';
import VendorAnnouncements from './pages/vendor/Announcements';

export default function App() {
  return (
    <ErrorBoundary>
      <RoleBasedLayout>
        <Routes>
        {/* ── PUBLIQUES ─────────────────────────────────────────── */}
        <Route path="/"              element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/products"      element={<PageWrapper><Products /></PageWrapper>} />
        <Route path="/product/:id"   element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/stores"        element={<PageWrapper><Stores /></PageWrapper>} />
        <Route path="/shop/:id"      element={<PageWrapper><StoreDetail /></PageWrapper>} />
        <Route path="/login"         element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register"      element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/vendre"        element={<VendorLanding />} />
        <Route path="/register-vendor" element={<PageWrapper><VendorRegister /></PageWrapper>} />
        <Route path="/cart"          element={<PageWrapper><Cart /></PageWrapper>} />

        {/* ── CLIENT CONNECTÉ ───────────────────────────────────── */}
        <Route path="/checkout"      element={<ProtectedRoute><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
        <Route path="/order-success/:id" element={<ProtectedRoute><PageWrapper><OrderSuccess /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-orders"     element={<ProtectedRoute><PageWrapper><MyOrders /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-orders/:id" element={<ProtectedRoute><PageWrapper><OrderDetail /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/messages"      element={<ProtectedRoute><PageWrapper><Messages /></PageWrapper></ProtectedRoute>} />
        <Route path="/messages/:id"  element={<ProtectedRoute><PageWrapper><Messages /></PageWrapper></ProtectedRoute>} />
        <Route path="/wishlist"      element={<ProtectedRoute><PageWrapper><Wishlist /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-reviews"    element={<ProtectedRoute><PageWrapper><MyReviews /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-disputes"   element={<ProtectedRoute><PageWrapper><MyDisputes /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-refunds"    element={<ProtectedRoute><PageWrapper><MyRefunds /></PageWrapper></ProtectedRoute>} />

        {/* ── ESPACE VENDEUR ────────────────────────────────────── */}
        <Route path="/vendor/pending-approval" element={<ProtectedRoute roles={['vendor']}><PageWrapper><PendingApproval /></PageWrapper></ProtectedRoute>} />
        <Route path="/vendor" element={<ProtectedRoute roles={['vendor','admin']}><VendorLayout /></ProtectedRoute>}>
          <Route index           element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/new" element={<VendorStore />} />
          <Route path="products/edit/:id" element={<VendorStore />} />
          <Route path="orders"   element={<VendorOrders />} />
          <Route path="orders/:id" element={<VendorOrderDetailPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<Messages />} />
          <Route path="reviews"   element={<VendorReviews />} />
          <Route path="promotions" element={<VendorPromotions />} />
          <Route path="wallet"      element={<VendorWallet />} />
          <Route path="announcements" element={<VendorAnnouncements />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="store" element={<VendorManageShop />} />
        </Route>



        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </RoleBasedLayout>
    </ErrorBoundary>
  );
}
