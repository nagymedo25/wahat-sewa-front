import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, UserCircle, ClipboardList, Settings2, Sparkles, Compass, CheckCircle2, PackageOpen, Clock, CalendarDays, MapPinned, Phone, CreditCard, Bell, Package, Truck, CheckCircle } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';
import { useNotifications } from '@/context/NotificationContext.jsx';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const statusLabels = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  returned: 'مسترجع',
};

function parseShippingAddress(value) {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value;
}

function normalizeOrder(order) {
  const shippingAddress = parseShippingAddress(order.shipping_address);
  const rawItems = Array.isArray(order.items) ? order.items : [];

  return {
    id: order.id,
    status: statusLabels[order.status] || order.status || 'جارِ التجهيز',
    date: order.created_at || order.date || new Date().toISOString(),
    total: Number(order.total_amount ?? order.total ?? 0),
    city: shippingAddress.city || order.city || 'غير محدد',
    items: rawItems.map((item) => ({
      name: item.product_name || item.name,
      qty: item.quantity || item.qty || 1,
    })),
  };
}

function getStatusColor(status) {
  if (status.includes('تم')) return 'text-olive-glow';
  if (status.includes('الشحن')) return 'text-sunset';
  return 'text-sand-light';
}

function NotificationsTab() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'order_update': return <Package className="w-5 h-5 text-olive-glow" />;
      case 'shipping': return <Truck className="w-5 h-5 text-blue-400" />;
      case 'delivery': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Bell className="w-5 h-5 text-sand" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.15rem]">
          <Bell className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
          الإشعارات
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-olive-glow hover:text-white flex items-center gap-1 transition-colors font-ar"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.06)] border border-[rgba(164,184,107,0.12)] mb-5">
              <Bell className="w-8 h-8 text-olive-glow opacity-40" strokeWidth={1.5} />
            </div>
            <div className="text-cream font-ar font-semibold text-[1.1rem]">لا توجد إشعارات</div>
            <p className="mt-2 text-sand opacity-50 font-ar text-[0.9rem]">ستظهر هنا تنبيهات حالة طلباتك وتحديثات المتجر.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`rounded-2xl border transition-all p-5 flex gap-4 cursor-pointer relative group ${
                !n.is_read 
                  ? 'bg-olive/10 border-olive/30 shadow-[0_0_20px_rgba(164,184,107,0.05)]' 
                  : 'bg-[rgba(10,9,7,0.22)] border-[rgba(212,197,169,0.08)] opacity-80 hover:opacity-100 hover:border-[rgba(164,184,107,0.15)]'
              }`}
            >
              {!n.is_read && (
                <div className="absolute top-6 left-6 w-2.5 h-2.5 bg-olive-glow rounded-full shadow-[0_0_10px_rgba(164,184,107,0.5)]" />
              )}
              
              <div className="mt-1">
                <div className={`p-3 rounded-xl bg-shadow-soft border border-olive/20`}>
                  {getIcon(n.type)}
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-cream group-hover:text-olive-glow transition-colors">{n.title}</p>
                </div>
                <p className="text-sm text-sand leading-relaxed opacity-80">{n.message}</p>
                <div className="pt-2 flex items-center gap-2 text-[0.75rem] text-sand opacity-40 font-ar">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, isAuthed, logout, api } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const tab = new URLSearchParams(location.search).get('tab') || 'profile';
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      if (tab !== 'orders') return;

      try {
        const response = await api.get('/orders');
        if (!isMounted) return;
        setOrders(response.data.orders.map(normalizeOrder));
      } catch {
        if (!isMounted) return;
        setOrders([]);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [api, tab]);

  const handleLogout = useCallback(() => {
    logout();
    toast.info('تم تسجيل الخروج');
    navigate('/shop', { replace: true });
  }, [logout, navigate, toast]);

  if (!isAuthed) {
    return (
      <GlassShell title="الحساب" subtitle="سجّل دخول لإدارة حسابك وتتبع الطلبات.">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 max-w-[780px]">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.08)] border border-[rgba(164,184,107,0.15)] mb-4">
              <UserCircle className="w-7 h-7 text-olive-glow opacity-60" strokeWidth={1.5} />
            </div>
            <div className="text-cream font-ar font-semibold text-[1.1rem]">لا يوجد جلسة تسجيل دخول</div>
            <div className="mt-1 text-sand opacity-60 font-ar text-[0.9rem]">سجّل دخول لتتمتع بكل المزايا.</div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/auth/login?next=/shop/account"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold no-underline transition-all hover:shadow-[0_18px_50px_rgba(164,184,107,0.12)] active:scale-95"
            >
              تسجيل الدخول
            </Link>
            <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors inline-flex items-center gap-2 font-ar">
              <Compass className="w-4 h-4" strokeWidth={2} />
              للمتجر
            </Link>
          </div>
        </div>
      </GlassShell>
    );
  }

  const tabs = [
    { key: 'profile', label: 'الملف الشخصي', icon: UserCircle },
    { key: 'orders', label: 'الطلبات', icon: ClipboardList },
    { key: 'notifications', label: 'الإشعارات', icon: Bell },
    { key: 'settings', label: 'الإعدادات', icon: Settings2 },
  ];

  return (
    <GlassShell title="حسابي" subtitle="ملفك الشخصي، الطلبات، والإعدادات.">
      <div className="grid lg:grid-cols-[0.42fr_1fr] gap-7">
        {/* Sidebar */}
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-6 h-fit">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)]">
              <UserCircle className="w-5 h-5 text-cream opacity-90" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-ar text-cream font-semibold">{user?.name || 'عميل'}</div>
              <div className="text-sand opacity-60 font-en text-[0.85rem]">{user?.email}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <Link
                  key={t.key}
                  to={`/shop/account?tab=${t.key}`}
                  className={
                    'no-underline rounded-2xl px-4 py-3 border transition-all flex items-center gap-2.5 ' +
                    (active
                      ? 'border-[rgba(164,184,107,0.35)] bg-[rgba(74,90,42,0.18)] text-cream shadow-[0_0_16px_rgba(164,184,107,0.06)]'
                      : 'border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.22)] text-sand-light hover:text-cream hover:border-[rgba(212,197,169,0.18)]')
                  }
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  <span className="font-ar text-[0.9rem]">{t.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 border border-[rgba(232,168,124,0.18)] bg-[rgba(232,168,124,0.05)] text-sand-light hover:text-cream transition-colors active:scale-95 font-ar text-[0.9rem]"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.5} />
            تسجيل الخروج
          </button>
        </div>

        {/* Content */}
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
          {tab === 'orders' && <OrdersTab orders={orders} />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'settings' && <SettingsTab />}
          {tab === 'profile' && <ProfileTab user={user} />}
        </div>
      </div>
    </GlassShell>
  );
}

function ProfileTab({ user }) {
  return (
    <div>
      <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.15rem]">
        <UserCircle className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
        الملف الشخصي
      </div>
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.25)] p-5 transition-all hover:border-[rgba(164,184,107,0.15)]">
          <div className="text-sand opacity-60 text-[0.8rem] font-ar flex items-center gap-1.5">
            <UserCircle className="w-3.5 h-3.5" strokeWidth={2} />
            الاسم
          </div>
          <div className="mt-2 text-cream font-ar">{user?.name || 'عميل'}</div>
        </div>
        <div className="rounded-2xl border border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.25)] p-5 transition-all hover:border-[rgba(164,184,107,0.15)]">
          <div className="text-sand opacity-60 text-[0.8rem] font-ar flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
            البريد
          </div>
          <div className="mt-2 text-cream font-en">{user?.email}</div>
        </div>
      </div>
      <div className="mt-6">
        <Link to="/shop" className="no-underline text-olive-glow hover:text-cream transition-colors inline-flex items-center gap-2 font-ar">
          <Compass className="w-4 h-4" strokeWidth={2} />
          للمتجر
        </Link>
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.06)] border border-[rgba(164,184,107,0.12)] mb-5">
          <ClipboardList className="w-8 h-8 text-olive-glow opacity-40" strokeWidth={1.5} />
        </div>
        <div className="text-cream font-ar font-semibold text-[1.1rem]">لا توجد طلبات</div>
        <div className="mt-2 text-sand opacity-50 font-ar text-[0.9rem]">ابدأ بتسوق منتجات الواحة ✨</div>
        <Link to="/shop" className="mt-5 no-underline text-olive-glow hover:text-cream transition-colors inline-flex items-center gap-2 font-ar text-[0.9rem]">
          <Compass className="w-4 h-4" strokeWidth={2} />
          استكشف المتجر
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.15rem]">
        <ClipboardList className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
        الطلبات
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.22)] p-5 transition-all hover:border-[rgba(164,184,107,0.15)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-olive-glow opacity-60" strokeWidth={1.5} />
                <span className="font-en text-cream font-semibold text-[0.95rem]">#{order.id}</span>
              </div>
              <span className={`text-[0.8rem] font-ar px-3 py-1 rounded-full border bg-[rgba(10,9,7,0.35)] ${getStatusColor(order.status)} border-[rgba(212,197,169,0.10)]`}>
                {order.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[0.8rem] text-sand opacity-60">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" strokeWidth={2} />
                {new Date(order.date).toLocaleDateString('ar-EG')}
              </span>
              <span className="inline-flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" strokeWidth={2} />
                {order.total} ج.م
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPinned className="w-3.5 h-3.5" strokeWidth={2} />
                {order.city}
              </span>
            </div>
            <div className="mt-3 text-[0.8rem] text-sand opacity-50 font-ar truncate">
              {order.items.map((it) => `${it.name} × ${it.qty}`).join('، ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSave = async () => {
    const result = await updateProfile({
      name: name.trim() || user?.name || '',
      email: email.trim() || user?.email || '',
    });

    if (result.success) {
      toast.success('تم حفظ التغييرات');
    } else {
      toast.error(result.error);
    }
  };

  const handlePassword = async () => {
    if (!currentPass || !newPass) {
      toast.error('أدخل كلمة المرور الحالية والجديدة');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('كلمتا المرور الجديدتين غير متطابقتين');
      return;
    }
    if (newPass.length < 8) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    const result = await changePassword(currentPass, newPass);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    toast.success('تم تحديث كلمة المرور');
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <div>
        <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.1rem]">
          <UserCircle className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
          معلومات الحساب
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">الاسم</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-ar text-[0.95rem] transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">البريد الإلكتروني</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-en text-[0.95rem] transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">رقم الهاتف</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-ar text-[0.95rem] placeholder:text-sand/30 transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">العنوان الافتراضي</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="الشارع - العمارة - الدور"
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-ar text-[0.95rem] placeholder:text-sand/30 transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.35)] text-cream font-ar font-semibold text-[0.9rem] transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.10)] active:scale-[0.97]"
        >
          <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
          حفظ التغييرات
        </button>
      </div>

      <div className="h-px bg-[rgba(212,197,169,0.08)]" />

      {/* Password */}
      <div>
        <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.1rem]">
          <Settings2 className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
          تغيير كلمة المرور
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">كلمة المرور الحالية</label>
            <input
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              type="password"
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-ar text-[0.95rem] transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">كلمة المرور الجديدة</label>
            <input
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              type="password"
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-ar text-[0.95rem] transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sand-light text-[0.8rem] font-ar">تأكيد كلمة المرور</label>
            <input
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              type="password"
              className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] outline-none text-cream font-ar text-[0.95rem] transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handlePassword}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.35)] text-cream font-ar font-semibold text-[0.9rem] transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.10)] active:scale-[0.97]"
        >
          <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
          تحديث كلمة المرور
        </button>
      </div>
    </div>
  );
}
