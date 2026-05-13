import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, ArrowUp, ArrowDown, Activity } from 'lucide-react';

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
    }).format(value);
  };

  const chartTheme = {
    textColor: '#d4c5a9', // sand
    gridColor: 'rgba(74, 90, 42, 0.2)', // olive/20
    tooltipBg: 'rgba(26, 24, 20, 0.9)', // shadow
    tooltipBorder: 'rgba(74, 90, 42, 0.3)', // olive/30
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-shadow-soft p-6 rounded-2xl border border-olive/20 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-cream flex items-center gap-2">
            <Activity className="w-6 h-6 text-olive-glow" />
            تحليلات الأرباح
          </h1>
          <p className="text-sm text-sand mt-1">نظرة شاملة على أداء المتجر المالي</p>
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full sm:w-auto px-6 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer font-bold"
          >
            <option value="7" className="bg-shadow">آخر 7 أيام</option>
            <option value="30" className="bg-shadow">آخر 30 يوم</option>
            <option value="90" className="bg-shadow">آخر 90 يوم</option>
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">▼</div>
        </div>
      </div>

      {/* Profit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="إجمالي الإيرادات"
          value={formatCurrency(analytics?.profitMetrics?.total_revenue || 0)}
          icon={DollarSign}
          color="from-blue-600 to-blue-400"
          iconColor="text-blue-100"
        />
        <MetricCard
          title="الأرباح المقدرة"
          value={formatCurrency(analytics?.profitMetrics?.estimated_profit || 0)}
          icon={TrendingUp}
          color="from-olive-deep to-olive"
          iconColor="text-olive-glow"
        />
        <MetricCard
          title="التكاليف المقدرة"
          value={formatCurrency(analytics?.profitMetrics?.estimated_cost || 0)}
          icon={ArrowDown}
          color="from-sunset-deep to-sunset"
          iconColor="text-orange-100"
        />
        <MetricCard
          title="متوسط قيمة الطلب"
          value={formatCurrency(analytics?.profitMetrics?.avg_order_value || 0)}
          icon={ShoppingCart}
          color="from-purple-600 to-purple-400"
          iconColor="text-purple-100"
        />
      </div>

      {/* Revenue Over Time */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-olive-glow" />
          الإيرادات بمرور الوقت
        </h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.revenueOverTime || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} />
              <YAxis stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} tickFormatter={(val) => `${val} ج.م`} />
              <Tooltip 
                contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '12px', color: '#f5efe3' }}
                itemStyle={{ color: '#f5efe3' }}
                formatter={(value) => [`${value} ج.م`]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#a4b86b" strokeWidth={3} dot={{ r: 4, fill: '#a4b86b', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="الإيرادات" />
              <Line type="monotone" dataKey="shipping_revenue" stroke="#e8a87c" strokeWidth={3} dot={{ r: 4, fill: '#e8a87c', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="إيرادات الشحن" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-cream mb-6">الإيرادات حسب القسم</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.revenueByCategory || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
                <XAxis dataKey="category" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} />
                <YAxis stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '12px', color: '#f5efe3' }}
                  cursor={{ fill: 'rgba(74, 90, 42, 0.1)' }}
                  formatter={(value) => [`${value} ج.م`]}
                />
                <Bar dataKey="revenue" fill="#a4b86b" radius={[4, 4, 0, 0]} name="الإيرادات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-cream mb-6">أكثر المنتجات مبيعًا</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.topSellingProducts || []} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} horizontal={false} />
                <XAxis type="number" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} />
                <YAxis dataKey="name" type="category" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '12px', color: '#f5efe3' }}
                  cursor={{ fill: 'rgba(74, 90, 42, 0.1)' }}
                />
                <Bar dataKey="total_sold" fill="#e8a87c" radius={[0, 4, 4, 0]} name="الكمية المباعة" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Completion Rate */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-cream mb-6">معدل إكمال الطلبات</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-olive/10 border border-olive/20 rounded-xl hover:bg-olive/20 transition-colors">
            <p className="text-4xl font-bold text-olive-glow">
              {analytics?.completionRate?.delivered || 0}
            </p>
            <p className="text-sm text-sand mt-2 font-medium">تم التسليم</p>
          </div>
          <div className="text-center p-6 bg-sunset/10 border border-sunset/20 rounded-xl hover:bg-sunset/20 transition-colors">
            <p className="text-4xl font-bold text-sunset">
              {analytics?.completionRate?.cancelled || 0}
            </p>
            <p className="text-sm text-sand mt-2 font-medium">ملغي</p>
          </div>
          <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors">
            <p className="text-4xl font-bold text-blue-400">
              {analytics?.completionRate?.total || 0}
            </p>
            <p className="text-sm text-sand mt-2 font-medium">إجمالي الطلبات</p>
          </div>
          <div className="text-center p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors">
            <p className="text-4xl font-bold text-purple-400">
              {analytics?.completionRate?.completion_rate || 0}%
            </p>
            <p className="text-sm text-sand mt-2 font-medium">معدل الإكمال</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-cream mb-6">مقارنة شهرية</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyComparison || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} />
                <YAxis stroke={chartTheme.textColor} tick={{ fill: chartTheme.textColor, fontSize: 12 }} axisLine={{ stroke: chartTheme.gridColor }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '12px', color: '#f5efe3' }}
                  cursor={{ fill: 'rgba(74, 90, 42, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" fill="#a4b86b" radius={[4, 4, 0, 0]} name="الإيرادات" />
                <Bar dataKey="orders" fill="#e8a87c" radius={[4, 4, 0, 0]} name="عدد الطلبات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Breakdown */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-cream mb-6">توزيع الأرباح</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'الأرباح', value: analytics?.profitMetrics?.estimated_profit || 0 },
                      { name: 'التكاليف', value: analytics?.profitMetrics?.estimated_cost || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#a4b86b" />
                    <Cell fill="#e8a87c" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '12px', color: '#f5efe3' }}
                    formatter={(value) => [`${value} ج.م`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center justify-between p-4 bg-olive/10 border border-olive/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-olive-glow rounded-full shadow-[0_0_10px_rgba(164,184,107,0.5)]"></div>
                  <span className="font-bold text-cream">الأرباح</span>
                </div>
                <span className="font-bold text-olive-glow">
                  {formatCurrency(analytics?.profitMetrics?.estimated_profit || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-sunset/5 border border-sunset/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-sunset rounded-full shadow-[0_0_10px_rgba(232,168,124,0.5)]"></div>
                  <span className="font-bold text-cream">التكاليف</span>
                </div>
                <span className="font-bold text-sunset">
                  {formatCurrency(analytics?.profitMetrics?.estimated_cost || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-olive-deep/30 border border-olive/20 rounded-xl mt-4">
                <span className="font-bold text-cream">هامش الربح</span>
                <span className="font-bold text-blue-400 text-xl">30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, iconColor }) {
  return (
    <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 relative overflow-hidden group hover:border-olive/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(74,90,42,0.3)]">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-sand">{title}</p>
          <p className="text-2xl font-bold text-cream mt-2 tracking-tight">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-3.5 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
