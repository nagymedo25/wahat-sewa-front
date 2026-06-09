import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  ArrowDown, 
  Activity, 
  Users, 
  Package, 
  MapPin, 
  Layers 
} from 'lucide-react';

export default function ProfitAnalytics() {
  const { api } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/profits?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-olive/20 border-t-olive-glow rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-shadow-soft p-6 rounded-2xl border border-olive/20 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-bold text-cream flex items-center gap-3">
            <Activity className="w-8 h-8 text-olive-glow" />
            تحليلات البيانات والأرباح
          </h1>
          <p className="text-sm text-sand mt-2">نظرة تحليلية دقيقة ومفصلة لأداء المتجر وحساب الأرباح</p>
        </div>
        <div className="relative min-w-[200px]">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-6 py-3.5 bg-olive-deep/30 border border-olive/30 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer font-bold text-lg"
          >
            <option value="7" className="bg-shadow">آخر 7 أيام</option>
            <option value="30" className="bg-shadow">آخر 30 يوم</option>
            <option value="90" className="bg-shadow">آخر 90 يوم</option>
            <option value="365" className="bg-shadow">آخر سنة</option>
            <option value="9999" className="bg-shadow">منذ البداية (الكل)</option>
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-olive-glow">▼</div>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div>
        <h2 className="text-xl font-bold text-cream mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-olive-glow" />
          الملخص المالي
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="إجمالي الدخل (Gross Revenue)"
            value={formatCurrency(analytics?.profitMetrics?.gross_revenue)}
            subtitle="شامل المنتجات وتكاليف الشحن"
            icon={DollarSign}
            color="from-blue-600 to-blue-400"
            iconColor="text-blue-100"
          />
          <MetricCard
            title="صافي الأرباح (Net Profit)"
            value={formatCurrency(analytics?.profitMetrics?.net_profit)}
            subtitle="سعر البيع - سعر الجملة"
            icon={TrendingUp}
            color="from-olive-deep to-olive"
            iconColor="text-olive-glow"
          />
          <MetricCard
            title="تكلفة الجملة (Wholesale Cost)"
            value={formatCurrency(analytics?.profitMetrics?.total_wholesale_cost)}
            subtitle="التكلفة الفعلية للمنتجات المباعة"
            icon={ArrowDown}
            color="from-sunset-deep to-sunset"
            iconColor="text-orange-100"
          />
          <MetricCard
            title="تكاليف الشحن (Shipping Fees)"
            value={formatCurrency(analytics?.profitMetrics?.total_shipping_fees)}
            subtitle="ما تم تحصيله لشركات الشحن"
            icon={MapPin}
            color="from-purple-600 to-purple-400"
            iconColor="text-purple-100"
          />
        </div>
      </div>

      {/* Orders Overview Metrics */}
      <div>
        <h2 className="text-xl font-bold text-cream mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-olive-glow" />
          حالة الطلبات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <SmallMetric title="الكل" value={analytics?.ordersOverview?.total_orders} color="text-cream" />
          <SmallMetric title="تم التسليم" value={analytics?.ordersOverview?.delivered} color="text-olive-glow" />
          <SmallMetric title="تم الشحن" value={analytics?.ordersOverview?.shipped} color="text-indigo-400" />
          <SmallMetric title="قيد المعالجة" value={analytics?.ordersOverview?.processing} color="text-purple-400" />
          <SmallMetric title="مؤكد" value={analytics?.ordersOverview?.confirmed} color="text-blue-400" />
          <SmallMetric title="قيد الانتظار" value={analytics?.ordersOverview?.pending} color="text-yellow-400" />
          <SmallMetric title="مسترجع" value={analytics?.ordersOverview?.returned} color="text-gray-400" />
          <SmallMetric title="ملغي" value={analytics?.ordersOverview?.cancelled} color="text-red-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg flex flex-col h-full">
          <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-olive-glow" />
            أكثر المنتجات مبيعًا وأرباحًا
          </h2>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-olive-deep/40 border-b border-olive/20 text-sand text-xs">
                <tr>
                  <th className="p-3 font-bold">المنتج</th>
                  <th className="p-3 font-bold text-center">الكمية المباعة</th>
                  <th className="p-3 font-bold">إجمالي المبيعات</th>
                  <th className="p-3 font-bold">صافي الربح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10 text-sm">
                {analytics?.topSellingProducts?.map((product, idx) => (
                  <tr key={idx} className="hover:bg-olive/5 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-shadow border border-olive/20 overflow-hidden shrink-0">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-cream line-clamp-1">{product.name}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-cream">{product.total_units_sold}</td>
                    <td className="p-3 text-sand">{formatCurrency(product.total_revenue)}</td>
                    <td className="p-3 font-bold text-olive-glow">{formatCurrency(product.total_profit)}</td>
                  </tr>
                ))}
                {(!analytics?.topSellingProducts || analytics.topSellingProducts.length === 0) && (
                  <tr><td colSpan="4" className="p-6 text-center text-sand">لا توجد بيانات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg flex flex-col h-full">
          <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-olive-glow" />
            أفضل العملاء (Top Spenders)
          </h2>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-olive-deep/40 border-b border-olive/20 text-sand text-xs">
                <tr>
                  <th className="p-3 font-bold">العميل</th>
                  <th className="p-3 font-bold text-center">الطلبات</th>
                  <th className="p-3 font-bold">إجمالي المدفوعات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10 text-sm">
                {analytics?.topCustomers?.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-olive/5 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-cream">{customer.name}</p>
                      <p className="text-xs text-sand font-mono">{customer.phone}</p>
                    </td>
                    <td className="p-3 text-center font-bold text-cream">{customer.total_orders}</td>
                    <td className="p-3 font-bold text-olive-glow">{formatCurrency(customer.total_spent)}</td>
                  </tr>
                ))}
                {(!analytics?.topCustomers || analytics.topCustomers.length === 0) && (
                  <tr><td colSpan="3" className="p-6 text-center text-sand">لا توجد بيانات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-olive-glow" />
            أداء الأقسام (Categories)
          </h2>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-olive-deep/40 border-b border-olive/20 text-sand text-xs">
                <tr>
                  <th className="p-3 font-bold">القسم</th>
                  <th className="p-3 font-bold text-center">المنتجات المباعة</th>
                  <th className="p-3 font-bold">صافي الربح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10 text-sm">
                {analytics?.categoryPerformance?.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-olive/5 transition-colors">
                    <td className="p-3 font-bold text-cream">{cat.category_name}</td>
                    <td className="p-3 text-center font-bold text-cream">{cat.total_items_sold}</td>
                    <td className="p-3 font-bold text-olive-glow">{formatCurrency(cat.total_profit)}</td>
                  </tr>
                ))}
                {(!analytics?.categoryPerformance || analytics.categoryPerformance.length === 0) && (
                  <tr><td colSpan="3" className="p-6 text-center text-sand">لا توجد بيانات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-olive-glow" />
            المناطق الأكثر طلبًا
          </h2>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-olive-deep/40 border-b border-olive/20 text-sand text-xs">
                <tr>
                  <th className="p-3 font-bold">المدينة / المنطقة</th>
                  <th className="p-3 font-bold text-center">الطلبات</th>
                  <th className="p-3 font-bold">إجمالي المبيعات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10 text-sm">
                {analytics?.regionalPerformance?.map((region, idx) => (
                  <tr key={idx} className="hover:bg-olive/5 transition-colors">
                    <td className="p-3 font-bold text-cream">{region.city}</td>
                    <td className="p-3 text-center font-bold text-cream">{region.total_orders}</td>
                    <td className="p-3 font-bold text-olive-glow">{formatCurrency(region.total_revenue)}</td>
                  </tr>
                ))}
                {(!analytics?.regionalPerformance || analytics.regionalPerformance.length === 0) && (
                  <tr><td colSpan="3" className="p-6 text-center text-sand">لا توجد بيانات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, color, iconColor }) {
  return (
    <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 relative overflow-hidden group hover:border-olive/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(74,90,42,0.3)] flex flex-col justify-between">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110`} />
      
      <div className="flex items-start justify-between relative z-10 mb-4">
        <div>
          <p className="text-sm font-bold text-sand mb-1">{title}</p>
          <p className="text-2xl font-black text-cream tracking-tight">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-3 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500 shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="relative z-10 mt-auto pt-4 border-t border-olive/10">
        <p className="text-xs text-sand/80">{subtitle}</p>
      </div>
    </div>
  );
}

function SmallMetric({ title, value, color }) {
  return (
    <div className="bg-olive-deep/20 border border-olive/20 rounded-xl p-4 text-center hover:bg-olive-deep/40 transition-colors">
      <p className={`text-2xl font-black ${color} mb-1`}>{value || 0}</p>
      <p className="text-xs font-bold text-sand">{title}</p>
    </div>
  );
}
