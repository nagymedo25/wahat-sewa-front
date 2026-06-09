import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Bell,
  LogOut,
  Menu,
  Users,
  X,
  Home,
  Settings,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../store/auth';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/store/toast.jsx';
import logoImg from '@/images/Logo1.png';

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-shadow">
        <div className="text-center p-8 bg-olive-deep/30 rounded-2xl border border-olive/30 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-cream mb-4">غير مصرح</h1>
          <p className="text-sand">ليس لديك صلاحية للوصول إلى لوحة التحكم</p>
          <Link to="/" className="mt-6 inline-block px-6 py-2 bg-olive text-cream rounded-full hover:bg-olive-light transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { path: '/admin/products', icon: Package, label: 'المنتجات' },
    { path: '/admin/categories', icon: ShoppingBag, label: 'الأقسام' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'الطلبات' },
    { path: '/admin/regions', icon: MapPin, label: 'أسعار الشحن' },
    { path: '/admin/users', icon: Users, label: 'المستخدمون' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'التحليلات' },
    { path: '/admin/featured', icon: Sparkles, label: 'معروضات الرئيسية' },
    { path: '/admin/settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <div className="min-h-screen bg-shadow text-cream flex font-ar selection:bg-olive selection:text-cream">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-shadow/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50
        w-72 bg-shadow/95 backdrop-blur-xl border-l border-olive/20 shadow-2xl
        transform transition-all duration-500 ease-cinematic flex flex-col
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-olive/20 flex flex-col items-center justify-center relative">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-4 rounded-lg p-2 text-sand hover:text-cream hover:bg-olive/20 transition-colors lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>

          <Link to="/admin/dashboard" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 rounded-full bg-olive-deep/50 border border-olive/30 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
              <img src={logoImg} alt="Wahat Sewa Logo" className="w-full h-auto object-contain drop-shadow-lg" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-cream tracking-wide">واحة سيوة</h2>
              <p className="text-xs text-sand-light mt-1 uppercase tracking-widest opacity-80">لوحة الإدارة</p>
            </div>
          </Link>
        </div>

        <div className="p-6 pb-2">
          <p className="text-sm text-sand mb-2">مرحباً، <span className="text-olive-glow font-bold">{user?.name}</span></p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden
                  ${isActive
                    ? 'text-cream font-bold shadow-[0_0_20px_rgba(74,90,42,0.2)]'
                    : 'text-sand hover:text-cream'
                  }
                `}
              >
                {/* Active Background indicator */}
                <div className={`absolute inset-0 bg-gradient-to-l from-olive to-olive-deep transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />

                {/* Active left border indicator */}
                {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-olive-glow rounded-r-full shadow-[0_0_10px_var(--olive-glow)]" />}

                <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-olive-glow' : 'group-hover:scale-110 group-hover:text-olive-light'}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-olive/20 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-3 w-full text-sand hover:text-cream hover:bg-olive/20 rounded-xl transition-all duration-300 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>الموقع الرئيسي</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 w-full text-sunset hover:text-sunset-deep hover:bg-sunset/10 rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-shadow/80 backdrop-blur-md border-b border-olive/20 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-sand hover:text-cream hover:bg-olive/20 rounded-xl transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-cream hidden md:block">
              {navItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <NotificationButton onPopup={toast.info} />
            <div className="hidden md:flex items-center gap-3 bg-olive-deep/40 px-4 py-2 rounded-full border border-olive/20">
              <div className="w-8 h-8 rounded-full bg-olive flex items-center justify-center text-cream font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-cream">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-olive-glow/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sunset/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function NotificationButton({ onPopup }) {
  const { api } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const seenIdsRef = useRef(new Set());
  const notifRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/unread');
      const nextNotifications = response.data.notifications;
      setNotifications(nextNotifications);
      setUnreadCount(response.data.unreadCount);

      nextNotifications.forEach((notification) => {
        if (!seenIdsRef.current.has(notification.id)) {
          seenIdsRef.current.add(notification.id);
          if (onPopup) {
            onPopup(`${notification.title}: ${notification.message}`, 5000);
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 20000);
    return () => window.clearInterval(intervalId);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => {
          setShowNotifications(!showNotifications);
          if (!showNotifications) fetchNotifications();
        }}
        className="relative p-2 text-sand hover:text-cream hover:bg-olive/20 rounded-xl transition-all duration-300 group"
      >
        <Bell className="w-6 h-6 group-hover:animate-wiggle" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-sunset text-shadow text-xs font-bold rounded-full flex items-center justify-center border-2 border-shadow animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute left-0 top-full mt-3 w-80 sm:w-96 bg-shadow border border-olive/20 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-left animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-olive/20 flex items-center justify-between bg-olive-deep/50 backdrop-blur-md">
            <h3 className="font-bold text-cream">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-olive-glow hover:text-sand-light transition-colors px-2 py-1 bg-olive/20 rounded-md"
              >
                تعيين الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-auto custom-scrollbar bg-shadow/95">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sand flex flex-col items-center gap-3">
                <Bell className="w-10 h-10 text-olive/50 opacity-50" />
                <p>لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-olive/10 hover:bg-olive/10 cursor-pointer transition-colors group"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-cream group-hover:text-olive-glow transition-colors">{notification.title}</h4>
                      <span className="w-2 h-2 rounded-full bg-sunset mt-1.5 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-sand mt-1.5 leading-relaxed">{notification.message}</p>
                    <p className="text-xs text-sand-warm/60 mt-3 flex items-center gap-1">
                      {new Date(notification.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
