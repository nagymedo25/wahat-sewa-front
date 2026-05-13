import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './store/auth.jsx';
import { CartProvider } from './store/cart.jsx';
import { ToastProvider } from './store/toast.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
