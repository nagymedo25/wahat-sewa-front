import { useAuth } from '../../store/auth';
import { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, X, MapPin, Search, Truck, Sparkles, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/store/toast.jsx';

// Upper Egypt / expensive regions
const UPPER_EGYPT = ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد', 'البحر الأحمر'];

function isSaeed(name) {
  return UPPER_EGYPT.includes(name?.trim());
}

export default function RegionsManagement() {
  const { api } = useAuth();
  const toast = useToast();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchRegions();
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await api.get('/regions');
      setRegions(response.data.regions);
    } catch (error) {
      console.error('Failed to fetch shipping regions:', error);
      toast.error('فشل تحميل أسعار الشحن');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingRegion) {
        await api.put(`/regions/${editingRegion.id}`, formData);
      } else {
        await api.post('/regions', formData);
      }
      await fetchRegions();
      setShowModal(false);
      setEditingRegion(null);
      toast.success(editingRegion ? 'تم تحديث المنطقة بنجاح ✓' : 'تمت إضافة المنطقة بنجاح ✓');
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل في حفظ المنطقة');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await api.delete(`/regions/${confirmDelete.id}`);
      await fetchRegions();
      toast.success('تم حذف المنطقة بنجاح');
    } catch (error) {
      toast.error(error.response?.data?.error || 'فشل في حذف المنطقة');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saeedCount = filteredRegions.filter(r => isSaeed(r.name)).length;
  const normalCount = filteredRegions.length - saeedCount;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-olive/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-olive-glow border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-t-transparent border-r-olive/30 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <p className="text-sand/60 font-ar text-sm animate-pulse">جاري تحميل بيانات الشحن…</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-12">

      {/* ── Header ── */}
      <div
        className="relative overflow-hidden rounded-3xl border border-olive/20 bg-gradient-to-br from-[rgba(26,24,20,0.80)] via-[rgba(34,40,20,0.60)] to-[rgba(26,24,20,0.80)] backdrop-blur-xl p-7"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
      >
        {/* Background glow orbs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-olive-glow/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 left-10 w-28 h-28 bg-olive/8 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-olive to-olive-deep flex items-center justify-center shadow-[0_0_24px_rgba(74,90,42,0.45)] shrink-0">
              <Truck className="w-6 h-6 text-cream" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cream tracking-tight">إدارة أسعار الشحن</h1>
              <p className="text-sm text-sand/70 mt-0.5 font-ar">تحكم في أسعار توصيل كل محافظة بحرية تامة</p>
            </div>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-olive/15 border border-olive/25 rounded-full text-xs text-olive-glow font-ar">
              <span className="w-2 h-2 rounded-full bg-olive-glow animate-pulse" />
              {normalCount} محافظة عادية · 65 ج.م
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/12 border border-amber-500/25 rounded-full text-xs text-amber-400 font-ar">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {saeedCount} محافظة صعيد · 100 ج.م
            </div>
            <button
              onClick={() => { setEditingRegion(null); setShowModal(true); }}
              className="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-olive to-olive-deep text-cream text-sm font-bold rounded-xl
                         shadow-[0_0_20px_rgba(74,90,42,0.35)] hover:shadow-[0_0_35px_rgba(74,90,42,0.55)] transition-all duration-300 active:scale-95"
            >
              <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              إضافة منطقة
            </button>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div
        className="relative max-w-md"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.5s 0.1s ease, transform 0.5s 0.1s ease' }}
      >
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-olive/20 bg-[rgba(26,24,20,0.60)] backdrop-blur-xl focus-within:border-olive-glow/60 focus-within:shadow-[0_0_20px_rgba(164,184,107,0.08)] transition-all duration-300">
          <Search className="w-4 h-4 text-sand/50 shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن محافظة أو منطقة…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-cream placeholder-sand/30 font-ar text-[0.9rem]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-sand/40 hover:text-cream transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-sand/50 mt-2 font-ar mr-1">
            {filteredRegions.length} نتيجة
          </p>
        )}
      </div>

      {/* ── Cards grid ── */}
      {filteredRegions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-sand/50 font-ar">
          <MapPin className="w-12 h-12 opacity-20" />
          <p className="text-base">لا توجد نتائج مطابقة لـ «{searchQuery}»</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRegions.map((region, index) => (
            <RegionCard
              key={region.id}
              region={region}
              index={index}
              mounted={mounted}
              isDeleting={deletingId === region.id}
              onEdit={() => { setEditingRegion(region); setShowModal(true); }}
              onDelete={() => setConfirmDelete(region)}
            />
          ))}
        </div>
      )}

      {/* ── Region Modal ── */}
      {showModal && (
        <RegionModal
          region={editingRegion}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingRegion(null); }}
        />
      )}

      {/* ── Delete Confirm Dialog ── */}
      {confirmDelete && (
        <DeleteDialog
          region={confirmDelete}
          isDeleting={!!deletingId}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ─── Region Card ─────────────────────────────────────── */
function RegionCard({ region, index, mounted, isDeleting, onEdit, onDelete }) {
  const saeed = isSaeed(region.name);
  const delay = Math.min(index * 45, 600);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border bg-[rgba(22,20,16,0.65)] backdrop-blur-xl
                 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300"
      style={{
        borderColor: saeed ? 'rgba(245,158,11,0.22)' : 'rgba(74,90,42,0.22)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.5s ${delay}ms ease, transform 0.5s ${delay}ms ease, box-shadow 0.3s ease, translate 0.3s ease`,
      }}
    >
      {/* Top accent strip */}
      <div
        className="absolute top-0 right-0 left-0 h-[2px]"
        style={{
          background: saeed
            ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(164,184,107,0.7), transparent)',
        }}
      />

      {/* Glow orb on hover */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: saeed ? 'rgba(245,158,11,0.10)' : 'rgba(164,184,107,0.10)' }}
      />

      <div className="p-5">
        {/* Badge */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold border"
            style={
              saeed
                ? { background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.30)', color: '#fbbf24' }
                : { background: 'rgba(164,184,107,0.10)', borderColor: 'rgba(164,184,107,0.28)', color: '#a4b86b' }
            }
          >
            <MapPin className="w-3 h-3" />
            {saeed ? 'الصعيد' : 'عادية'}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg bg-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.22)] border border-[rgba(59,130,246,0.20)] text-blue-400 transition-all duration-200 hover:scale-110"
              title="تعديل"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-[rgba(239,68,68,0.10)] hover:bg-[rgba(239,68,68,0.20)] border border-[rgba(239,68,68,0.18)] text-red-400 transition-all duration-200 hover:scale-110 disabled:opacity-50"
              title="حذف"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-cream font-bold text-[1.05rem] leading-tight group-hover:text-olive-glow transition-colors duration-300 mb-3 font-ar">
          {region.name}
        </h3>

        {/* Price display */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sand/40 text-[0.68rem] font-ar mb-0.5">سعر الشحن</p>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-black font-number leading-none"
                style={{ color: saeed ? '#fbbf24' : '#a4b86b' }}
              >
                {region.shipping_cost}
              </span>
              <span className="text-sand/60 text-xs font-ar">ج.م</span>
            </div>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: saeed ? 'rgba(245,158,11,0.10)' : 'rgba(164,184,107,0.10)',
              border: saeed ? '1px solid rgba(245,158,11,0.20)' : '1px solid rgba(164,184,107,0.20)',
            }}
          >
            <Truck className="w-4 h-4" style={{ color: saeed ? '#fbbf24' : '#a4b86b' }} strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Region Modal ────────────────────────────────────── */
function RegionModal({ region, onSave, onClose }) {
  const [formData, setFormData] = useState({ name: '', shipping_cost: '' });
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (region) {
      setFormData({ name: region.name || '', shipping_cost: region.shipping_cost ?? '' });
    }
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ name: formData.name, shipping_cost: parseFloat(formData.shipping_cost) });
    setSaving(false);
  };

  const previewSaeed = isSaeed(formData.name);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(10,9,7,0.75)] backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        {/* Glow behind modal */}
        <div className="absolute inset-0 bg-olive/5 rounded-3xl blur-3xl scale-110 pointer-events-none" />

        <div className="relative bg-[rgba(22,20,16,0.95)] border border-olive/25 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Header gradient strip */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-olive-glow/50 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-olive/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-olive to-olive-deep flex items-center justify-center shadow-[0_0_16px_rgba(74,90,42,0.4)]">
                {region ? <Edit className="w-4 h-4 text-cream" /> : <Plus className="w-4 h-4 text-cream" />}
              </div>
              <div>
                <h2 className="text-[1rem] font-bold text-cream font-ar">
                  {region ? 'تعديل منطقة الشحن' : 'إضافة منطقة جديدة'}
                </h2>
                <p className="text-[0.72rem] text-sand/50 font-ar mt-0.5">
                  {region ? 'عدّل الاسم أو سعر الشحن' : 'أدخل بيانات المحافظة الجديدة'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-sand/50 hover:text-cream hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-sand/70 uppercase tracking-widest font-ar">اسم المحافظة / المنطقة</label>
              <div className="relative">
                <MapPin className="absolute top-1/2 -translate-y-1/2 right-4 w-4 h-4 text-sand/40 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  required
                  placeholder="مثال: أسيوط"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pr-11 pl-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-olive/20 rounded-xl text-cream placeholder-sand/25
                             focus:outline-none focus:border-olive-glow/60 focus:shadow-[0_0_16px_rgba(164,184,107,0.08)] transition-all duration-300 font-ar text-[0.95rem]"
                />
              </div>
              {/* Preview badge */}
              {formData.name && (
                <div className="flex items-center gap-2 text-[0.72rem] font-ar"
                  style={{ color: previewSaeed ? '#fbbf24' : '#a4b86b' }}>
                  <span className="w-1.5 h-1.5 rounded-full"
                    style={{ background: previewSaeed ? '#fbbf24' : '#a4b86b' }} />
                  {previewSaeed ? 'محافظة صعيد (سعر مرتفع)' : 'محافظة عادية'}
                </div>
              )}
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-sand/70 uppercase tracking-widest font-ar">سعر الشحن بالجنيه المصري</label>
              <div className="relative">
                <Truck className="absolute top-1/2 -translate-y-1/2 right-4 w-4 h-4 text-sand/40 pointer-events-none" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  placeholder="65"
                  value={formData.shipping_cost}
                  onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
                  className="w-full pr-11 pl-16 py-3.5 bg-[rgba(255,255,255,0.03)] border border-olive/20 rounded-xl text-cream placeholder-sand/25
                             focus:outline-none focus:border-olive-glow/60 focus:shadow-[0_0_16px_rgba(164,184,107,0.08)] transition-all duration-300 font-number text-[1.05rem]"
                />
                <span className="absolute top-1/2 -translate-y-1/2 left-4 text-sand/40 text-sm font-ar pointer-events-none">ج.م</span>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.72rem] text-sand/40 font-ar">أسعار سريعة:</span>
              {[65, 75, 90, 100, 120].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setFormData({ ...formData, shipping_cost: price })}
                  className="px-3 py-1 text-[0.72rem] font-number rounded-lg border transition-all duration-200 hover:scale-105"
                  style={
                    Number(formData.shipping_cost) === price
                      ? { background: 'rgba(164,184,107,0.20)', borderColor: 'rgba(164,184,107,0.45)', color: '#a4b86b' }
                      : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#a09070' }
                  }
                >
                  {price}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="group flex-1 relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-olive to-olive-deep text-cream font-bold text-[0.9rem] rounded-xl
                           shadow-[0_0_20px_rgba(74,90,42,0.30)] hover:shadow-[0_0_30px_rgba(74,90,42,0.50)] transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'جاري الحفظ…' : region ? 'حفظ التعديلات' : 'إضافة المنطقة'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-olive/20 text-sand/70 hover:text-cream hover:bg-white/5 rounded-xl transition-all duration-200 font-ar text-sm"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Dialog ──────────────────────────── */
function DeleteDialog({ region, isDeleting, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(10,9,7,0.80)] backdrop-blur-md" onClick={onCancel} />
      <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="relative bg-[rgba(22,20,16,0.97)] border border-red-500/20 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-400" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-cream font-bold text-[1.05rem] font-ar">حذف منطقة الشحن</h3>
              <p className="text-sand/60 text-sm font-ar mt-1.5 leading-relaxed">
                هل تريد حذف <span className="text-cream font-bold">«{region.name}»</span>؟<br />
                لن تتأثر الطلبات السابقة، لكن هذه المنطقة لن تظهر عند الدفع.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-400 font-bold text-sm rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? 'جاري الحذف…' : 'نعم، احذف'}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-olive/20 text-sand/70 hover:text-cream hover:bg-white/5 rounded-xl transition-all duration-200 font-ar text-sm"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
