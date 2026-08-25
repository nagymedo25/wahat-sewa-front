import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  Loader2,
  DollarSign,
  Trash2
} from 'lucide-react';

export default function AdminDashboard() {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetTargets, setResetTargets] = useState([]);
  const { toast } = useAuth(); // or useToast() if you have it imported

  // Actually, we must import useToast


  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetRecords = async () => {
    if (resetTargets.length === 0) {
      alert('يجب تحديد سجل واحد على الأقل لتنظيفه!');
      return;
    }

    const confirmDelete = window.confirm(
      'تحذير خطير: هل أنت متأكد من مسح السجلات المحددة؟ هذا الإجراء لا يمكن التراجع عنه وسيحذف البيانات نهائياً.'
    );
    if (!confirmDelete) return;

    setResetting(true);
    try {
      await api.post('/admin/reset-records', { targets: resetTargets });
      alert('تم تنظيف السجلات المحددة بنجاح.');
      setResetTargets([]);
      fetchDashboardStats();
    } catch (error) {
      console.error('Reset error:', error);
      alert('حدث خطأ أثناء محاولة مسح السجلات. تفقد الكونسول.');
    } finally {
      setResetting(false);
    }
  };

  const toggleResetTarget = (target) => {
    setResetTargets(prev =>
      prev.includes(target) ? prev.filter(t => t !== target) : [...prev, target]
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="w-12 h-12 text-olive-glow animate-spin" />
        <p className="text-sand animate-pulse">جاري تحميل البيانات...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'إجمالي الطلبات',
      value: stats?.orders?.total_orders || 0,
      icon: ShoppingBag,
      color: 'from-blue-600 to-blue-400',
      iconColor: 'text-blue-100',
      subtext: `${stats?.orders?.pending || 0} قيد الانتظار`
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats?.orders?.total_revenue || 0} ج.م`,
      icon: DollarSign,
      color: 'from-sunset-deep to-sunset',
      iconColor: 'text-orange-100',
      subtext: 'من الطلبات المكتملة'
    },
    {
      title: 'إجمالي المنتجات',
      value: stats?.products?.total_products || 0,
      icon: Package,
      color: 'from-olive-deep to-olive',
      iconColor: 'text-olive-glow',
      subtext: `${stats?.products?.total_categories || 0} قسم`
    },
    {
      title: 'المستخدمين',
      value: stats?.users?.total_users || 0,
      icon: Users,
      color: 'from-purple-600 to-purple-400',
      iconColor: 'text-purple-100',
      subtext: `${stats?.users?.admin_users || 0} مسؤول`
    }
  ];

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    processing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    shipped: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    delivered: 'bg-olive-500/20 text-olive-glow border-olive-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
    returned: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
    returned: 'مسترجع'
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream">نظرة عامة</h1>
          <p className="text-sand mt-1">مرحباً بك في لوحة تحكم واحة سيوة</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 relative overflow-hidden group hover:border-olive/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(74,90,42,0.3)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110`} />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm text-sand font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-cream mt-2 tracking-tight">{card.value}</p>
                  <p className="text-xs text-sand-warm/70 mt-2">{card.subtext}</p>
                </div>
                <div className={`bg-gradient-to-br ${card.color} p-3.5 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-3 bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 overflow-hidden flex flex-col h-[400px]">
          <div className="p-6 border-b border-olive/20 flex items-center justify-between bg-olive-deep/10">
            <h2 className="text-xl font-bold text-cream flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-olive-glow" />
              أحدث الطلبات
            </h2>
            <button className="text-sm text-olive-glow hover:text-sand-light transition-colors">عرض الكل</button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-6">
            {stats?.recentOrders?.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-sand">
                <Package className="w-12 h-12 opacity-20 mb-3" />
                <p>لا توجد طلبات بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentOrders?.slice(0, 5).map((order, i) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-olive-deep/20 rounded-xl border border-olive/10 hover:bg-olive-deep/40 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-olive/20 flex items-center justify-center text-olive-glow font-bold group-hover:scale-110 transition-transform">
                        {order.user_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-cream">{order.user_name}</p>
                        <p className="text-xs text-sand font-mono mt-1">#{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="text-left flex flex-col items-end gap-2">
                      <p className="font-bold text-olive-glow text-lg">{order.total_amount} <span className="text-sm">ج.م</span></p>
                      <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 overflow-hidden">
        <div className="p-6 border-b border-olive/20 bg-olive-deep/10">
          <h2 className="text-xl font-bold text-cream flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-olive-glow" />
            نظرة عامة على حالة الطلبات
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(stats?.orders || {}).map(([status, count]) => {
              if (status === 'total_orders' || status === 'total_revenue') return null;
              return (
                <div key={status} className="flex flex-col items-center justify-center p-5 bg-olive-deep/20 rounded-2xl border border-olive/10 hover:border-olive-glow/50 transition-colors group">
                  <div className="text-3xl font-bold text-cream group-hover:scale-110 transition-transform">{count}</div>
                  <p className="text-sm text-sand mt-2 font-medium">{statusLabels[status]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 overflow-hidden">
        <div className="p-6 border-b border-olive/20 bg-olive-deep/10">
          <h2 className="text-xl font-bold text-cream">أفضل المنتجات أداءً</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats?.topProducts?.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-olive/10 bg-olive-deep/20 p-4 hover:bg-olive-deep/40 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-8 h-8 bg-olive-glow text-shadow flex items-center justify-center font-bold rounded-bl-xl z-10">
                {index + 1}
              </div>
              <div className="w-20 h-20 rounded-xl bg-white overflow-hidden border border-olive/20 flex-shrink-0 p-1 flex items-center justify-center">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain [mix-blend-mode:multiply] group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-bold text-cream text-lg">{product.name}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-sand flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-olive-glow" />
                    {product.total_sold} مباع
                  </p>
                </div>
                <div className="mt-2 text-sm font-bold text-olive-glow">{product.price} ج.م</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone: Reset Records */}
      <div className="bg-red-950/20 backdrop-blur-xl rounded-2xl border border-red-500/30 overflow-hidden mt-8">
        <div className="p-6 border-b border-red-500/20 bg-red-900/10">
          <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            منطقة الخطر: تصفير السجلات (Reset Records)
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-sand mb-6">
            استخدم هذه اللوحة لمسح أو تصفير أي سجلات تريدها لتنظيف النظام. <strong className="text-red-400">تحذير: لا يمكن التراجع عن هذا الإجراء!</strong>
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl transition-colors">
              <input
                type="checkbox"
                checked={resetTargets.includes('orders')}
                onChange={() => toggleResetTarget('orders')}
                className="w-5 h-5 accent-red-500 cursor-pointer"
              />
              <span className="text-cream text-lg font-bold">كل الطلبات والإيرادات</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl transition-colors">
              <input
                type="checkbox"
                checked={resetTargets.includes('notifications')}
                onChange={() => toggleResetTarget('notifications')}
                className="w-5 h-5 accent-red-500 cursor-pointer"
              />
              <span className="text-cream text-lg font-bold">جميع إشعارات التطبيق</span>
            </label>
          </div>

          <button
            onClick={handleResetRecords}
            disabled={resetting || resetTargets.length === 0}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
          >
            {resetting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            مسح البيانات المحددة بشكل نهائي
          </button>
        </div>
      </div>
    </div>
  );
}
