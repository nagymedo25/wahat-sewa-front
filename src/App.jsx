import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/store/auth.jsx';
import PageTransition from '@/components/PageTransition/PageTransition.jsx';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/auth/LoginPage.jsx';
import RegisterPage from '@/pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.jsx';
import ShopHomePage from '@/pages/shop/ShopHomePage.jsx';
import ProductDetailsPage from '@/pages/shop/ProductDetailsPage.jsx';
import CartPage from '@/pages/shop/CartPage.jsx';
import CheckoutPage from '@/pages/shop/CheckoutPage.jsx';
import AccountPage from '@/pages/shop/AccountPage.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';
import ProductsManagement from '@/pages/admin/ProductsManagement.jsx';
import CategoriesManagement from '@/pages/admin/CategoriesManagement.jsx';
import OrdersManagement from '@/pages/admin/OrdersManagement.jsx';
import ProfitAnalytics from '@/pages/admin/ProfitAnalytics.jsx';
import AdminUsersPage from '@/pages/admin/AdminUsersPage.jsx';
import AdminSettings from '@/pages/admin/AdminSettings.jsx';
import HomepageProducts from '@/pages/admin/HomepageProducts.jsx';

function AdminRoute({ children }) {
  const { loading, isAuthed, isAdmin } = useAuth();

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/auth/login?next=/admin/dashboard" replace />;
  if (!isAdmin) return <Navigate to="/shop/account" replace />;
  return children;
}

function CustomerRoute({ children }) {
  const { loading, isAuthed, isAdmin } = useAuth();

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/auth/login?next=/shop/account" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function PublicAuthRoute({ children }) {
  const { loading, isAuthed, isAdmin } = useAuth();

  if (loading) return null;
  if (isAuthed && isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (isAuthed) return <Navigate to="/shop/account" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <PageTransition />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/auth/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
        <Route path="/auth/register" element={<PublicAuthRoute><RegisterPage /></PublicAuthRoute>} />
        <Route path="/auth/forgot" element={<ForgotPasswordPage />} />

        <Route path="/shop" element={<ShopHomePage />} />
        <Route path="/shop/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/shop/cart" element={<CartPage />} />
        <Route path="/shop/checkout" element={<CustomerRoute><CheckoutPage /></CustomerRoute>} />
        <Route path="/shop/account" element={<CustomerRoute><AccountPage /></CustomerRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="analytics" element={<ProfitAnalytics />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="featured" element={<HomepageProducts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
