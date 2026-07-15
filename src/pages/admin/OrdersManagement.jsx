import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, RotateCcw, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { useToast } from '@/store/toast.jsx';

export default function OrdersManagement() {
  const { api } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [syncingId, setSyncingId] = useState(null);

  const handleEplanSync = async (orderId) => {
    setSyncingId(orderId);
    try {
      const { data } = await api.post(`/sync/eplan/${orderId}`);
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        await fetchOrderDetails(orderId);
      }
      toast.success(data.changed ? 'تم تحديث حالة الطلب من E-Plan' : 'لا توجد تغييرات جديدة من E-Plan');
    } catch (error) {
      console.error('E-Plan sync failed:', error);
      toast.error(error.response?.data?.error || 'فشل التحديث من E-Plan');
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, payload = {}) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus, ...payload });
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        await fetchOrderDetails(orderId);
      }
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error(error.response?.data?.error || 'فشل في تحديث حالة الطلب');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data.order);
    } catch (error) {
      toast.error(error.response?.data?.error || 'تعذر تحميل تفاصيل الطلب');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-olive/20 border-t-olive-glow rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-shadow-soft p-6 rounded-2xl border border-olive/20 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-cream">إدارة الطلبات</h1>
        <p className="text-sm text-sand mt-1">تتبع وعالج طلبات العملاء</p>
      </div>

      {/* Filters */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sand group-focus-within:text-olive-glow transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث برقم الطلب، اسم العميل، أو البريد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
          />
        </div>
        <div className="relative md:w-64">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer"
          >
            <option value="" className="bg-shadow">كل الحالات</option>
            <option value="pending" className="bg-shadow">قيد الانتظار</option>
            <option value="confirmed" className="bg-shadow">مؤكد</option>
            <option value="processing" className="bg-shadow">قيد المعالجة</option>
            <option value="shipped" className="bg-shadow">تم الشحن</option>
            <option value="delivered" className="bg-shadow">تم التسليم</option>
            <option value="cancelled" className="bg-shadow">ملغي</option>
            <option value="returned" className="bg-shadow">مسترجع</option>
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">▼</div>
        </div>
      </div>

      {/* Orders Table/Cards Container */}
      <div className="space-y-4">
        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredOrders.length === 0 ? (
            <div className="bg-shadow-soft border border-olive/20 rounded-2xl p-12 text-center text-sand">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-20 mb-3" />
              <p>لا توجد طلبات مطابقة</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <div 
                key={order.id}
                className="bg-shadow-soft border border-olive/20 rounded-2xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                onClick={() => fetchOrderDetails(order.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-olive-deep/50 border border-olive/20 flex items-center justify-center font-bold text-cream">
                      {order.user_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-cream text-sm">{order.user_name}</p>
                      <span className="font-mono text-olive-glow text-[0.65rem] bg-olive-glow/10 px-1.5 py-0.5 rounded-md">#{order.id.slice(0, 8)}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[0.65rem] font-bold border whitespace-nowrap ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-olive/10">
                  <div>
                    <p className="text-[0.65rem] text-sand opacity-60">التاريخ</p>
                    <p className="text-xs text-sand font-mono">
                      {new Date(order.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[0.65rem] text-sand opacity-60 text-left">الإجمالي</p>
                    <p className="text-sm font-bold text-cream">
                      {order.total_amount} <span className="text-[0.65rem] text-sand font-normal">ج.م</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchOrderDetails(order.id);
                    }}
                    className="w-full py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    عرض التفاصيل الكاملة
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-olive-deep/40 border-b border-olive/20">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">رقم الطلب</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">العميل</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">الإجمالي</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">الحالة</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">التاريخ</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sand">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <ShoppingBag className="w-10 h-10 opacity-20" />
                        <p>لا توجد طلبات مطابقة</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-olive/10 transition-colors group animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-olive-glow font-bold bg-olive-glow/10 px-2 py-1 rounded-md">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-olive-deep/50 border border-olive/20 flex items-center justify-center font-bold text-cream group-hover:scale-110 transition-transform">
                            {order.user_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-cream group-hover:text-olive-glow transition-colors">{order.user_name}</p>
                            <p className="text-xs text-sand mt-0.5">{order.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-cream whitespace-nowrap">
                        {order.total_amount} <span className="text-xs text-sand font-normal">ج.م</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand font-mono whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchOrderDetails(order.id);
                          }}
                          className="p-2 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all duration-300 inline-flex"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          onEplanSync={handleEplanSync}
          syncingId={syncingId}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onStatusUpdate, onEplanSync, syncingId }) {
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, nextStatus: null });

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

  const shippingAddress = typeof order.shipping_address === 'string'
    ? JSON.parse(order.shipping_address)
    : order.shipping_address;

  const requestStatusChange = (nextStatus) => {
    if (actionLoading) return;
    setConfirmState({ open: true, nextStatus });
  };

  const handleConfirmChange = async () => {
    if (!confirmState.nextStatus) return;

    setActionLoading(true);
    try {
      await onStatusUpdate(order.id, confirmState.nextStatus, { notes });
    } finally {
      setActionLoading(false);
      setConfirmState({ open: false, nextStatus: null });
    }
  };

  const isSubmittingProcessing = actionLoading && confirmState.nextStatus === 'processing';
  const isSubmittingCancelled = actionLoading && confirmState.nextStatus === 'cancelled';
  const isConfirmOpen = confirmState.open;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-shadow/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl bg-shadow border border-olive/20 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-300 my-4">
        <div className="p-6 border-b border-olive/20 flex items-center justify-between bg-olive-deep/30">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-cream">تفاصيل الطلب</h2>
            <span className="font-mono text-olive-glow font-bold bg-olive-glow/10 px-3 py-1 rounded-lg border border-olive-glow/20">#{order.id.slice(0, 8)}</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-sand hover:text-sunset hover:bg-sunset/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-olive-deep/20 border border-olive/20 rounded-2xl p-5">
              <h3 className="font-bold text-olive-glow mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-olive-glow/10 flex items-center justify-center">👤</div>
                معلومات العميل
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sand text-sm">الاسم:</span>
                  <span className="text-cream font-bold">{order.user_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand text-sm">البريد الإلكتروني:</span>
                  <span className="text-cream font-bold">{order.user_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand text-sm">تاريخ الطلب:</span>
                  <span className="text-cream font-mono">{new Date(order.created_at).toLocaleString('ar-EG')}</span>
                </div>
              </div>
            </div>

            <div className="bg-olive-deep/20 border border-olive/20 rounded-2xl p-5">
              <h3 className="font-bold text-olive-glow mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-olive-glow/10 flex items-center justify-center">📍</div>
                عنوان الشحن
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sand text-sm">الاسم:</span>
                  <span className="text-cream font-bold">{shippingAddress?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand text-sm">رقم الهاتف:</span>
                  <span className="text-cream font-bold" dir="ltr">{shippingAddress?.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand text-sm">رقم الواتساب:</span>
                  <span className="text-cream font-bold" dir="ltr">{shippingAddress?.whatsapp || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand text-sm">المدينة:</span>
                  <span className="text-cream font-bold">{shippingAddress?.city || '-'}</span>
                </div>
                <div className="flex justify-between border-t border-olive/10 pt-2 mt-2">
                  <span className="text-sand text-sm">العنوان التفصيلي:</span>
                  <span className="text-cream text-left max-w-[200px] truncate">{shippingAddress?.address || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-cream mb-4">المنتجات المطلوبة</h3>
            <div className="bg-olive-deep/20 border border-olive/20 rounded-2xl overflow-hidden">
              <table className="w-full text-right">
                <thead className="bg-olive-deep/40 border-b border-olive/20">
                  <tr>
                    <th className="px-5 py-3 text-sm font-bold text-cream">المنتج</th>
                    <th className="px-5 py-3 text-sm font-bold text-cream">الكمية</th>
                    <th className="px-5 py-3 text-sm font-bold text-cream">سعر الوحدة</th>
                    <th className="px-5 py-3 text-sm font-bold text-cream">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olive/10">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-olive/10 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-shadow border border-olive/20 overflow-hidden shrink-0">
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                            />
                          </div>
                          <span className="font-bold text-cream">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-cream font-bold">{item.quantity}</td>
                      <td className="px-5 py-4 text-sand">{item.price_at_purchase} ج.م</td>
                      <td className="px-5 py-4 font-bold text-olive-glow">
                        {(item.quantity * item.price_at_purchase).toFixed(2)} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-olive-deep/30 border border-olive/20 rounded-2xl p-5">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-sand">المجموع الفرعي:</span>
                  <span className="text-cream font-bold">{(order.total_amount - order.shipping_cost).toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-sand">تكلفة الشحن:</span>
                  <span className="text-cream font-bold">{order.shipping_cost} ج.م</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-olive/20 pt-4 mt-2">
                  <span className="text-cream">الإجمالي:</span>
                  <span className="text-olive-glow">{order.total_amount} ج.م</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t border-olive/20 pt-8">
            <h3 className="font-bold text-cream mb-4">إجراءات الطلب (نظام E-Plan الآلي)</h3>
            <div className="bg-shadow-soft border border-olive/20 rounded-2xl p-6 space-y-6">

              {isConfirmOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-shadow/70 backdrop-blur-sm" />
                  <div className="relative w-full max-w-md bg-shadow border border-olive/20 rounded-2xl shadow-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-sunset" />
                          <h3 className="text-cream font-bold text-lg">تأكيد العملية</h3>
                        </div>
                        <p className="text-sand text-sm leading-relaxed">
                          هل أنت متأكد من تغيير حالة الطلب إلى{" "}
                          <span className="text-cream font-bold">{statusLabels[confirmState.nextStatus]}</span>؟
                        </p>
                        {confirmState.nextStatus === 'processing' && (
                          <p className="text-sand text-xs mt-3 opacity-80 leading-relaxed">
                            سيتم إنشاء الشحنة عبر E-Plan وربط الحالة تلقائياً.
                          </p>
                        )}
                        {confirmState.nextStatus === 'cancelled' && (
                          <p className="text-sand text-xs mt-3 opacity-80 leading-relaxed">
                            سيتم محاولة إلغاء الطلب في E-Plan إن كان مرتبطاً.
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (actionLoading) return;
                          setConfirmState({ open: false, nextStatus: null });
                        }}
                        className="p-2 text-sand hover:text-sunset hover:bg-sunset/10 rounded-xl transition-colors disabled:opacity-50"
                        disabled={actionLoading}
                        aria-label="إغلاق"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        type="button"
                        onClick={() => setConfirmState({ open: false, nextStatus: null })}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2.5 bg-olive-deep/20 border border-olive/20 text-sand rounded-xl font-bold hover:bg-olive-deep/30 disabled:opacity-50 transition-all"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmChange}
                        disabled={actionLoading}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                          ${confirmState.nextStatus === 'cancelled'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                            : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}
                      >
                        <RotateCcw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
                        {actionLoading ? 'جاري التنفيذ...' : 'تأكيد'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(order.tracking_number || order.estimated_delivery || order.actual_delivery || order.eplan_order_id) && (
                <div className="rounded-xl bg-olive-deep/30 border border-olive/20 p-4 space-y-2 text-sm mb-6">
                  {order.eplan_order_id && (
                    <div className="flex flex-col gap-2 mb-3 pb-3 border-b border-olive/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                            <Truck className="w-3 h-3" /> E-Plan
                          </span>
                          <span className="text-sand font-bold">معرف الشحنة:</span>
                          <span className="text-cream font-mono">{order.eplan_order_id}</span>
                        </div>
                        <button
                          onClick={() => handleEplanSync(order.id)}
                          disabled={syncingId === order.id}
                          className="flex items-center gap-1 text-xs bg-olive-glow/20 text-olive-glow border border-olive-glow/30 px-3 py-1 rounded hover:bg-olive-glow/30 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className={`w-3 h-3 ${syncingId === order.id ? 'animate-spin' : ''}`} />
                          {syncingId === order.id ? 'جاري التحديث...' : 'تحديث من E-Plan'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sand font-bold">رقم التتبع (E-Plan):</span>
                        <span className="text-cream font-mono">{order.eplan_tracking_number || 'جاري الإصدار...'}</span>
                      </div>
                      {order.eplan_delivery_cost != null && (
                        <div className="flex items-center gap-2">
                          <span className="text-sand font-bold">تكلفة الشحن (E-Plan):</span>
                          <span className="text-cream font-mono">{order.eplan_delivery_cost} ج.م</span>
                        </div>
                      )}
                    </div>
                  )}
                  {order.tracking_number && !order.eplan_tracking_number && (
                    <div className="flex gap-2">
                      <span className="text-sand font-bold">رقم التتبع:</span>
                      <span className="text-cream font-mono">{order.tracking_number}</span>
                    </div>
                  )}
                  {order.estimated_delivery && (
                    <div className="flex gap-2">
                      <span className="text-sand font-bold">التسليم المتوقع:</span>
                      <span className="text-cream">{new Date(order.estimated_delivery).toLocaleDateString('ar-EG')}</span>
                    </div>
                  )}
                  {order.actual_delivery && (
                    <div className="flex gap-2">
                      <span className="text-sand font-bold">التسليم الفعلي:</span>
                      <span className="text-cream">{new Date(order.actual_delivery).toLocaleDateString('ar-EG')}</span>
                    </div>
                  )}
                </div>
              )}

              {order.status === 'pending' ? (
                <div className="flex flex-col items-center justify-center p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                    <Truck className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-300">إرسال إلى شركة الشحن</h4>
                    <p className="text-sm text-sand mt-2 max-w-md mx-auto leading-relaxed">
                      بمجرد تأكيد الطلب، سيتم إصدار بوليصة شحن فورية عبر E-Plan وسيتم تحديث حالة الطلب أوتوماتيكياً مستقبلاً (تم الشحن، تم التسليم، إلخ).
                    </p>
                  </div>

                  <div className="w-full max-w-md mt-4 mb-4">
                    <label className="block text-sm font-bold text-blue-300/80 mb-2 text-right">ملاحظات للمندوب أو للإدارة (اختياري)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-cream placeholder-blue-300/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none text-right"
                      placeholder="أضف ملاحظاتك هنا..."
                      disabled={actionLoading}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 w-full max-w-md justify-center">
                    <button
                      onClick={() => requestStatusChange('processing')}
                      disabled={actionLoading || isConfirmOpen}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-all font-bold shadow-lg shadow-blue-500/20"
                    >
                      {isSubmittingProcessing ? (
                        <RotateCcw className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      <span>{isSubmittingProcessing ? 'جاري إنشاء الشحنة...' : 'تأكيد وإنشاء الشحنة'}</span>
                    </button>
                    <button
                      onClick={() => requestStatusChange('cancelled')}
                      disabled={actionLoading || isConfirmOpen}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl disabled:opacity-50 transition-all font-bold border border-red-500/20"
                    >
                      {isSubmittingCancelled ? (
                        <RotateCcw className="w-5 h-5 animate-spin" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span>{isSubmittingCancelled ? 'جاري الإلغاء...' : 'إلغاء'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-olive-deep/30 border border-olive/20 rounded-2xl space-y-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-olive-glow/10 flex items-center justify-center">
                      <Truck className="w-8 h-8 text-olive-glow" />
                    </div>
                    {order.status !== 'cancelled' && order.status !== 'returned' && order.status !== 'delivered' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-olive-glow mb-2">الطلب قيد التتبع الآلي</h4>
                    <p className="text-sm text-sand max-w-md mx-auto leading-relaxed">
                      هذا الطلب مربوط ومتابع حالياً بواسطة نظام E-Plan.
                      سيتم تحديث حالة الطلب أوتوماتيكياً كل بضع دقائق، ويمكنك أيضاً الضغط على "تحديث من E-Plan" لجلب أحدث حالة فوراً.
                    </p>
                  </div>
                  
                  {order.status !== 'cancelled' && order.status !== 'returned' && order.status !== 'delivered' && (
                    <button
                      onClick={() => requestStatusChange('cancelled')}
                      disabled={actionLoading || isConfirmOpen}
                      className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm transition-all font-bold disabled:opacity-50"
                    >
                      {isSubmittingCancelled ? (
                        <RotateCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{isSubmittingCancelled ? 'جاري الإلغاء...' : 'إلغاء الطلب (طوارئ)'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {Array.isArray(order.history) && order.history.length > 0 && (
            <div className="border-t border-olive/20 pt-8">
              <h3 className="font-bold text-cream mb-4">سجل تحديثات الطلب</h3>
              <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:right-2 before:w-0.5 before:bg-olive/20">
                {order.history.map((entry, index) => (
                  <div key={entry.id} className="relative pr-6">
                    <div className="absolute right-0 top-1.5 w-4 h-4 rounded-full bg-shadow border-2 border-olive-glow z-10 translate-x-1.5"></div>
                    <div className="bg-olive-deep/20 border border-olive/20 rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[entry.status]}`}>
                          {statusLabels[entry.status]}
                        </span>
                        <span className="text-xs font-mono text-sand">
                          {new Date(entry.created_at).toLocaleString('ar-EG')}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-cream mt-2 leading-relaxed bg-shadow/30 p-3 rounded-lg border border-olive/10">
                          {entry.notes}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-sand font-bold">بواسطة: {entry.changed_by_name || 'النظام'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
