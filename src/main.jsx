import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './store/auth.jsx';
import { CartProvider } from './store/cart.jsx';
import { ToastProvider } from './store/toast.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './i18n';
import { LanguageProvider } from './context/LanguageContext.jsx';
import CartBar from './components/Products/CartBar.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <NotificationProvider>
                  <App />
                  <CartBar />
                </NotificationProvider>
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
