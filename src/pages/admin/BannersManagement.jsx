import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/store/auth.jsx';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShoppingBag,
  Home,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/store/toast.jsx';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader.jsx';

const POSITIONS = [
  {
    value: 'shop',
    label: 'صفحة المتجر (Shop Banner)',
    scope: 'shop',
    description: 'يظهر في أعلى صفحة المتجر لترويج العروض والتخفيضات الخاصة بالمنتجات',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: ShoppingBag,
  },
  {
    value: 'top',
    label: 'الصفحة الرئيسية — أعلى الصفحة (Top Banner)',
    scope: 'home',
    description: 'يظهر في أعلى الصفحة الرئيسية مباشرة تحت قسم الترحيب للترويج الفوري',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: Sparkles,
  },
  {
    value: 'mid',
    label: 'الصفحة الرئيسية — وسط الصفحة',
    scope: 'home',
    description: 'يظهر بين استكشاف الأقسام والمنتجات المميزة في الصفحة الرئيسية',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: Home,
  },
  {
    value: 'bottom',
    label: 'الصفحة الرئيسية — أسفل الصفحة',
    scope: 'home',
    description: 'يظهر بعد قسم أفضل العروض وقبل قصة الواحة وتذييل الصفحة',
    badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    icon: Layers,
  },
];

export default function BannersManagement() {
  const { api } = useAuth();
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'home' | 'shop'
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '/shop',
    link_type: 'general',
    cta_text: 'اكتشف العرض الآن',
    position: 'shop',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/all');
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      toast.error('فشل في جلب البانرات');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    // Auto-select position based on active tab
    const defaultPosition = activeTab === 'shop' ? 'shop' : activeTab === 'home' ? 'mid' : 'shop';
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '/shop',
      link_type: 'general',
      cta_text: defaultPosition === 'shop' ? 'تصفح أفضل العروض' : 'اكتشف العرض الآن',
      position: defaultPosition,
      sort_order: banners.length + 1,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '/shop',
      link_type: banner.link_type || 'general',
      cta_text: banner.cta_text || 'اكتشف العرض الآن',
      position: banner.position || 'mid',
      sort_order: banner.sort_order ?? 0,
      is_active: banner.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('عنوان البانر مطلوب');
      return;
    }

    try {
      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, formData);
        toast.success('تم تحديث البانر بنجاح');
      } else {
        await api.post('/banners', formData);
        toast.success('تم إنشاء البانر بنجاح');
      }
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      console.error('Failed to save banner:', err);
      toast.error(err.response?.data?.error || 'فشل في حفظ البانر');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا البانر؟')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('تم حذف البانر بنجاح');
      fetchBanners();
    } catch (err) {
      console.error('Failed to delete banner:', err);
      toast.error('فشل في حذف البانر');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner.id}/toggle`);
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
      );
      toast.success('تم تحديث حالة البانر');
    } catch (err) {
      console.error('Failed to toggle banner:', err);
      toast.error('فشل في تغيير الحالة');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const [moved] = newBanners.splice(index, 1);
    newBanners.splice(targetIndex, 0, moved);

    const reordered = newBanners.map((b, i) => ({ id: b.id, sort_order: i + 1 }));
    setBanners(newBanners);

    try {
      await api.put('/banners/reorder', { items: reordered });
      toast.success('تم تعديل الترتيب بنجاح');
    } catch (err) {
      console.error('Failed to reorder banners:', err);
      fetchBanners();
    }
  };

  // ─── Statistics ───
  const stats = useMemo(() => {
    const total = banners.length;
    const shopCount = banners.filter((b) => b.position === 'shop').length;
    const homeCount = banners.filter((b) => b.position === 'mid' || b.position === 'bottom').length;
    const activeCount = banners.filter((b) => b.is_active).length;
    return { total, shopCount, homeCount, activeCount };
  }, [banners]);

  // ─── Filtered Banners ───
  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      // Tab filter
      if (activeTab === 'shop' && banner.position !== 'shop') return false;
      if (activeTab === 'home' && banner.position !== 'mid' && banner.position !== 'bottom') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = banner.title?.toLowerCase().includes(q);
        const matchSub = banner.subtitle?.toLowerCase().includes(q);
        const matchLink = banner.link_url?.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchLink) return false;
      }

      return true;
    });
  }, [banners, activeTab, searchQuery]);

  const getPositionInfo = (posValue) => {
    return (
      POSITIONS.find((p) => p.value === posValue) || {
        value: posValue,
        label: posValue === 'shop' ? 'صفحة المتجر' : 'الصفحة الرئيسية',
        badgeColor: 'bg-[#8A5833]/20 text-[#DCC7A1] border-[#8A5833]/30',
        icon: ImageIcon,
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-ar text-2xl sm:text-3xl font-extrabold text-[#F3E9D6] flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-[#8A5833]" />
            <span>إدارة البانرات والعروض الترويجية</span>
          </h1>
          <p className="font-ar text-sm text-[#DCC7A1]/70 mt-1.5">
            تحكم كامل في فواصل وصفحات العروض بين الصفحة الرئيسية وصفحة المتجر
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B6B4A] hover:bg-[#6E7F5A] text-[#FAF5EC] font-ar text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة بانر جديد</span>
        </button>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-[rgba(220,199,161,0.12)] bg-[rgba(33,21,13,0.5)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(220,199,161,0.08)] flex items-center justify-center text-[#DCC7A1]">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-ar text-xs text-[#DCC7A1]/60">إجمالي البانرات</div>
            <div className="font-ar text-xl font-extrabold text-[#F3E9D6]">{stats.total}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[rgba(220,199,161,0.12)] bg-[rgba(33,21,13,0.5)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="font-ar text-xs text-emerald-300/70">بانرات المتجر</div>
            <div className="font-ar text-xl font-extrabold text-emerald-300">{stats.shopCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[rgba(220,199,161,0.12)] bg-[rgba(33,21,13,0.5)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="font-ar text-xs text-amber-300/70">بانرات الرئيسية</div>
            <div className="font-ar text-xl font-extrabold text-amber-300">{stats.homeCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[rgba(220,199,161,0.12)] bg-[rgba(33,21,13,0.5)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#5B6B4A]/20 flex items-center justify-center text-[#97A883]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-ar text-xs text-[#DCC7A1]/60">البانرات المفعلة</div>
            <div className="font-ar text-xl font-extrabold text-[#F3E9D6]">{stats.activeCount}</div>
          </div>
        </div>
      </div>

      {/* ── Filters & Tabs Bar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[rgba(220,199,161,0.12)] pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-ar text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#8A5833] text-white shadow-md'
                : 'bg-[rgba(33,21,13,0.6)] text-[#DCC7A1]/80 hover:text-[#F3E9D6] hover:bg-[rgba(33,21,13,0.9)] border border-[rgba(220,199,161,0.1)]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>جميع البانرات</span>
            <span className="px-1.5 py-0.2 rounded-md text-[0.65rem] bg-black/30 text-white/90">
              {stats.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shop')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-ar text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'shop'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-[rgba(33,21,13,0.6)] text-[#DCC7A1]/80 hover:text-emerald-300 hover:bg-[rgba(33,21,13,0.9)] border border-[rgba(220,199,161,0.1)]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>بانرات صفحة المتجر</span>
            <span className="px-1.5 py-0.2 rounded-md text-[0.65rem] bg-emerald-950/60 text-emerald-200">
              {stats.shopCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-ar text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-[rgba(33,21,13,0.6)] text-[#DCC7A1]/80 hover:text-amber-300 hover:bg-[rgba(33,21,13,0.9)] border border-[rgba(220,199,161,0.1)]'
            }`}
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>بانرات الصفحة الرئيسية</span>
            <span className="px-1.5 py-0.2 rounded-md text-[0.65rem] bg-amber-950/60 text-amber-200">
              {stats.homeCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DCC7A1]/50 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في البانرات..."
            className="w-full rounded-xl border border-[rgba(220,199,161,0.15)] bg-[rgba(33,21,13,0.6)] py-2 pr-10 pl-4 text-xs text-[#F3E9D6] placeholder:text-[#DCC7A1]/40 focus:outline-none focus:border-[#8A5833] font-ar"
          />
        </div>
      </div>

      {/* ── Banners List ── */}
      {loading ? (
        <div className="p-16 text-center text-[#DCC7A1]/60 font-ar text-sm animate-pulse">
          جاري تحميل البانرات...
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[rgba(220,199,161,0.12)] bg-[rgba(33,21,13,0.4)]">
          <ImageIcon className="w-14 h-14 text-[#8A5833] mx-auto mb-3 opacity-60" />
          <h3 className="font-ar text-base font-bold text-[#F3E9D6] mb-1">
            {activeTab === 'shop'
              ? 'لا توجد بانرات خاصة بصفحة المتجر حالياً'
              : activeTab === 'home'
              ? 'لا توجد بانرات خاصة بالصفحة الرئيسية حالياً'
              : 'لا توجد بانرات تطابق البحث'}
          </h3>
          <p className="font-ar text-xs text-[#DCC7A1]/60 mb-5 max-w-md mx-auto">
            {activeTab === 'shop'
              ? 'أضف بانر جديد وحدد موقعه كـ (صفحة المتجر) ليظهر فوراً في أعلى صفحة المنتجات'
              : 'أضف بانر ترويجي جذاب ليظهر كفاصل تسويقي أنيق'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B6B4A] hover:bg-[#6E7F5A] text-white font-ar text-xs font-bold shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'shop' ? 'إضافة بانر للمتجر' : 'إضافة بانر جديد'}
            </span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBanners.map((banner, index) => {
            const posInfo = getPositionInfo(banner.position);
            const IconComponent = posInfo.icon;

            return (
              <div
                key={banner.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-[rgba(220,199,161,0.12)] bg-[rgba(33,21,13,0.6)] backdrop-blur-sm hover:border-[rgba(138,88,51,0.4)] transition-all group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-28 h-18 rounded-xl bg-[rgba(15,10,6,0.6)] border border-[rgba(220,199,161,0.1)] overflow-hidden shrink-0 flex items-center justify-center relative">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-[#8A5833] opacity-40" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5 text-right">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-ar text-base font-bold text-[#F3E9D6]">
                        {banner.title}
                      </h3>

                      {/* Position Tag */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[0.7rem] font-ar font-bold border ${posInfo.badgeColor}`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{posInfo.label}</span>
                      </span>

                      {/* Status */}
                      {!banner.is_active ? (
                        <span className="px-2 py-0.5 rounded-md text-[0.65rem] font-ar font-bold bg-red-900/30 text-red-300 border border-red-500/30">
                          معطل
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[0.65rem] font-ar font-bold bg-emerald-900/30 text-emerald-300 border border-emerald-500/30">
                          نشط
                        </span>
                      )}
                    </div>

                    {banner.subtitle && (
                      <p className="font-ar text-xs text-[#DCC7A1]/70 line-clamp-1 max-w-xl">
                        {banner.subtitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[0.7rem] text-[#8A7260] font-ar">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-[#DCC7A1]/40" />
                        <span>الرابط: {banner.link_url}</span>
                      </span>
                      <span>•</span>
                      <span>نص الزر: {banner.cta_text}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Move Order */}
                  <div className="flex items-center gap-1 border border-[rgba(220,199,161,0.1)] rounded-lg p-0.5 bg-[rgba(15,10,6,0.3)]">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, -1)}
                      className="p-1.5 rounded text-[#DCC7A1]/70 hover:text-[#F3E9D6] disabled:opacity-20 cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredBanners.length - 1}
                      onClick={() => handleMoveOrder(index, 1)}
                      className="p-1.5 rounded text-[#DCC7A1]/70 hover:text-[#F3E9D6] disabled:opacity-20 cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      banner.is_active
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40'
                        : 'border-neutral-700 text-neutral-400 bg-neutral-900/40 hover:bg-neutral-800'
                    }`}
                    title={banner.is_active ? 'تعطيل البانر' : 'تفعيل البانر'}
                  >
                    {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 rounded-xl border border-[rgba(220,199,161,0.15)] bg-[rgba(138,88,51,0.15)] text-[#DCC7A1] hover:bg-[#8A5833] hover:text-white transition-colors cursor-pointer"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/40 transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Add / Edit ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[rgba(220,199,161,0.2)] bg-[#21150D] text-[#F3E9D6] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(220,199,161,0.1)]">
              <h3 className="font-ar text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8A5833]" />
                <span>{editingBanner ? 'تعديل البانر الترويجي' : 'إضافة بانر ترويجي جديد'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full border border-[rgba(220,199,161,0.1)] hover:bg-[rgba(220,199,161,0.05)] text-[#DCC7A1] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5 text-right">
              {/* Position Selection Cards */}
              <div>
                <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-2">
                  مكان ونوع ظهور البانر *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {POSITIONS.map((pos) => {
                    const isSelected = formData.position === pos.value;
                    const Icon = pos.icon;
                    return (
                      <button
                        type="button"
                        key={pos.value}
                        onClick={() => setFormData({ ...formData, position: pos.value })}
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#8A5833] bg-[#8A5833]/20 ring-1 ring-[#8A5833]'
                            : 'border-[rgba(220,199,161,0.1)] bg-[rgba(15,10,6,0.3)] hover:border-[rgba(220,199,161,0.2)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#DCC7A1]' : 'text-[#8A7260]'}`} />
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#8A5833] bg-[#8A5833]'
                                : 'border-[rgba(220,199,161,0.3)]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <div>
                          <div className="font-ar text-xs font-bold text-[#F3E9D6] mb-1">
                            {pos.label}
                          </div>
                          <div className="font-ar text-[0.68rem] text-[#DCC7A1]/60 leading-tight">
                            {pos.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-1.5">
                  عنوان البانر الرئيسي *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: خصم 20% على تشكيلة التمور الفاخرة"
                  className="admin-input"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-1.5">
                  الوصف الفرعي
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="نقاء لا مثيل له مستخلص من قلب الواحة الخصبة..."
                  className="admin-input resize-none"
                />
              </div>

              {/* CTA Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-1.5">
                    نص زر الإجراء / الشراء
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="اكتشف العرض الآن"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-1.5">
                    رابط التوجيه عند الضغط
                  </label>
                  <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="/shop أو /shop?category=dates"
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-1.5">
                  ترتيب الظهور (الأولوية)
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>

              {/* Cloudinary Image Upload */}
              <div>
                <label className="block font-ar text-xs font-bold text-[#DCC7A1] mb-2">
                  صورة البانر (عبر Cloudinary)
                </label>
                <CloudinaryUploader
                  currentUrl={formData.image_url}
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                  onClear={() => setFormData({ ...formData, image_url: '' })}
                />
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active_banner"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#8A5833] focus:ring-[#8A5833]"
                />
                <label
                  htmlFor="is_active_banner"
                  className="font-ar text-xs font-bold text-[#DCC7A1] cursor-pointer"
                >
                  تفعيل وظهور البانر في الموقع
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(220,199,161,0.1)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[rgba(220,199,161,0.15)] hover:bg-[rgba(220,199,161,0.05)] text-[#DCC7A1] font-ar text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5B6B4A] hover:bg-[#6E7F5A] text-white font-ar text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingBanner ? 'حفظ التعديلات' : 'إضافة البانر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
