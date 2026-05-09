import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/auth/LoginPage.jsx';
import RegisterPage from '@/pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.jsx';
import ShopHomePage from '@/pages/shop/ShopHomePage.jsx';
import ProductDetailsPage from '@/pages/shop/ProductDetailsPage.jsx';
import CartPage from '@/pages/shop/CartPage.jsx';
import CheckoutPage from '@/pages/shop/CheckoutPage.jsx';
import AccountPage from '@/pages/shop/AccountPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot" element={<ForgotPasswordPage />} />

      <Route path="/shop" element={<ShopHomePage />} />
      <Route path="/shop/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/shop/cart" element={<CartPage />} />
      <Route path="/shop/checkout" element={<CheckoutPage />} />
      <Route path="/shop/account" element={<AccountPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
