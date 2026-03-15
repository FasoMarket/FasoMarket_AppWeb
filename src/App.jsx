import { Routes, Route, Navigate } from 'react-router-dom';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';

// General Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ClientRegister from './pages/ClientRegister';
import ClientLogin from './pages/ClientLogin';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProductList from './pages/vendor/ProductList';
import AddEditProduct from './pages/vendor/AddEditProduct';
import VendorOrderList from './pages/vendor/OrderList';
import VendorOrderDetails from './pages/vendor/OrderDetails';
import VendorSettings from './pages/vendor/Settings';
import VendorLogin from './pages/vendor/Login';
import VendorRegister from './pages/vendor/Register';
import VendorAnalytics from './pages/vendor/Analytics';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendorManagement from './pages/admin/VendorManagement';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminReportedProducts from './pages/admin/ReportedProducts';
import AdminPlatformSettings from './pages/admin/PlatformSettings';

import ShopDetail from './pages/ShopDetail';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/products" element={<Products />} />
      <Route path="/register" element={<ClientRegister />} />
      <Route path="/login" element={<ClientLogin />} />
      <Route path="/shop/:id" element={<ShopDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />



      {/* Vendor Auth */}
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/register" element={<VendorRegister />} />

      {/* Vendor Routes */}
      <Route path="/vendor" element={<VendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<VendorProductList />} />
        <Route path="products/new" element={<AddEditProduct />} />
        <Route path="products/edit/:id" element={<AddEditProduct />} />
        <Route path="orders" element={<VendorOrderList />} />
        <Route path="orders/:id" element={<VendorOrderDetails />} />
        <Route path="analytics" element={<VendorAnalytics />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="vendors" element={<AdminVendorManagement />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="reported" element={<AdminReportedProducts />} />
        <Route path="settings" element={<AdminPlatformSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
