import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, MessageCircle, UserCircle, ShoppingBasket, Truck,
  Receipt, Sparkles, ClipboardCheck, PackageOpen, ChevronDown, Check,
  Lock, Eye, EyeOff, CheckCircle2, PhoneCall
} from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';
import { publicApi } from '@/services/api.js';
import { useTranslation } from 'react-i18next';
import { trackInitiateCheckout, trackPurchase } from '@/services/tracking.js';

function money(value, currency = 'ج.م') {
  return `${Number(value).toLocaleString('ar-EG')} ${currency}`;
}

const UPPER_EGYPT = ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد', 'البحر الأحمر'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totals, clear, setShippingCost } = useCart();
  const { user, isAuthed, register } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Optional account creation
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Order Confirmation State
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    trackInitiateCheckout(items, totals.total);
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await publicApi.get('/regions');
        const regList = Array.isArray(response.data?.regions) ? response.data.regions : [];
        setRegions(regList);
        const defaultCity = regList.find(r => r.name === 'القاهرة') || regList[0];
        if (defaultCity) {
          setCity(defaultCity.name);
          setSelectedRegion(defaultCity);
          setShippingCost(parseFloat(defaultCity.shipping_cost));
        }
      } catch (err) {
        console.error('Failed to load shipping regions', err);
      } finally {
        setLoadingRegions(false);
      }
    };
    fetchRegions();
  }, [setShippingCost]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-city-picker]')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCityChange = (region) => {
    setCity(region.name);
    setSelectedRegion(region);
    setShippingCost(parseFloat(region.shipping_cost));
    setDropdownOpen(false);
  };

  const canSubmit = useMemo(() => {
    const validPhone = /^01[0125]\d{8}$/.test(whatsapp.trim());
    return items.length > 0 && name.trim().length >= 2 && validPhone && address.trim().length >= 5 && city.trim();
  }, [address, city, items.length, name, whatsapp]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      if (!/^01[0125]\d{8}$/.test(whatsapp.trim())) {
        toast.error('يرجى إدخال رقم هاتف محمول مصري صحيح (010, 011, 012, 015 مكون من 11 رقماً)');
      } else {
        toast.error('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Optional background registration if requested and not logged in
      if (!isAuthed && createAccount && password.trim()) {
        try {
          await register({
            name: name.trim(),
            whatsapp: whatsapp.trim(),
            password: password.trim(),
          });
        } catch (regErr) {
          console.warn('Optional registration notice:', regErr.response?.data?.error || regErr.message);
          // Non-blocking: continue with order as guest
        }
      }

      // 2. Submit order
      const response = await publicApi.post('/orders', {
        items: items.map((it) => ({
          product_id: it.id,
          quantity: it.qty,
        })),
        shipping_address: {
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          address: address.trim(),
          city: city.trim(),
        },
        notes: notes.trim() || undefined,
      });

      const remoteOrder = response.data?.order;
      if (remoteOrder) {
        // Track purchase in Meta, TikTok, GA4 & CAPI
        trackPurchase(remoteOrder, items, { name: name.trim(), whatsapp: whatsapp.trim() });
        setConfirmedOrder(remoteOrder);
        clear();
        toast.success(`تم تأكيد طلبك بنجاح! رقم الطلب #${String(remoteOrder.id).slice(0, 8)}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.error || 'تعذر إنشاء الطلب الآن. حاول مرة أخرى بعد قليل.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaeed = (cityName) => UPPER_EGYPT.includes(cityName?.trim());

  // ─── If Order was placed successfully, show Confirmed Celebration Screen ───
  if (confirmedOrder) {
    const shortId = String(confirmedOrder.id).slice(0, 8);
    const whatsappMsg = encodeURIComponent(`مرحباً سحر سيوة، أود الاستفسار عن طلبي رقم #${shortId} باسم ${confirmedOrder.shipping_address?.name}`);
    const whatsappUrl = `https://wa.me/201553251467?text=${whatsappMsg}`;

    return (
      <GlassShell
        title="تم تأكيد طلبك بنجاح!"
        subtitle="شكراً لثقتك في خيرات سحر سيوة الطبيعية."
      >
        <div className="max-w-xl mx-auto rounded-3xl border border-[var(--border-accent)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.18)] text-center font-ar space-y-6 animate-scaleUp">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.2} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              تهانينا! تم استلام طلبك بنجاح
            </h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              يقوم فريقنا الآن بتجهيز منتجات الواحة الطازجة وشحنها سريعاً إلى عنوانك.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 text-right space-y-3 font-ar">
            <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">رقم الطلب:</span>
              <span className="font-number font-bold text-[var(--siwa-earth)] text-base">#{shortId}</span>
            </div>
            <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">المستلم:</span>
              <span className="font-bold text-[var(--text-primary)]">{confirmedOrder.shipping_address?.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">رقم التواصل:</span>
              <span className="font-number font-bold text-[var(--text-primary)]">{confirmedOrder.shipping_address?.whatsapp}</span>
            </div>
            <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">عنوان التوصيل:</span>
              <span className="font-bold text-[var(--text-primary)]">{confirmedOrder.shipping_address?.city} - {confirmedOrder.shipping_address?.address}</span>
            </div>
            <div className="flex items-center justify-between text-base pt-1">
              <span className="font-bold text-[var(--text-primary)]">المبلغ الإجمالي (شامل الشحن):</span>
              <span className="font-number font-black text-lg text-[var(--action-primary)]">
                {confirmedOrder.total_amount} ج.م
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer no-underline"
            >
              <MessageCircle className="w-4 h-4" />
              <span>متابعة الطلب عبر الواتساب</span>
            </a>

            <Link
              to="/shop"
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 no-underline"
            >
              <span>متابعة التسوق بالمتجر</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </GlassShell>
    );
  }

  const steps = [
    { label: t('checkout.step_cart', 'السلة'), active: true },
    { label: t('checkout.step_payment', 'إتمام الطلب'), active: true },
    { label: t('checkout.step_confirm', 'التأكيد'), active: false },
  ];

  return (
    <GlassShell title={t('checkout.title', 'إتمام الطلب السريع')} subtitle="طلب مباشر وسهل برقم الهاتف دون الحاجة لتسجيل مسبق.">
      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={`rounded-full px-4 py-1.5 text-[0.8rem] font-ar font-bold transition-all border ${
                step.active
                  ? 'bg-[var(--action-primary)] text-[var(--action-primary-text)] border-[var(--action-primary)] shadow-sm'
                  : 'bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-muted)]'
              }`}
            >
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px ${step.active ? 'bg-[var(--action-primary)]/50' : 'bg-[var(--border-default)]'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-7 items-start">
        {/* Left Column: Fast Order Form */}
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-6 sm:p-7 shadow-[var(--shadow-lg)]">
          
          {/* Guest Order Banner */}
          {!isAuthed && (
            <div className="mb-6 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-accent)] flex items-center justify-between gap-3 text-right">
              <div>
                <span className="block text-xs font-bold text-[var(--siwa-earth)] mb-0.5">طلب فوري ومباشر كزائر</span>
                <span className="block text-[0.82rem] text-[var(--text-secondary)]">يمكنك إتمام طلبك برقم هاتفك مباشرة دون الحاجة لإنشاء حساب.</span>
              </div>
              <Link
                to="/auth/login?next=/shop/checkout"
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] text-xs font-bold whitespace-nowrap transition-colors no-underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {/* Recipient Name */}
            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">
                الاسم بالكامل <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] transition-all focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
                <UserCircle className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمود أحمد"
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] font-ar text-[0.95rem] placeholder:text-[var(--text-muted)]"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">
                رقم التليفون / الواتساب <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] transition-all focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
                <MessageCircle className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] font-ar text-[0.95rem] placeholder:text-[var(--text-muted)] font-number"
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  required
                />
              </div>
              <span className="block mt-1.5 text-[0.75rem] text-[var(--text-tertiary)]">
                سنقوم بالتواصل معك عبر هذا الرقم لتأكيد تفاصيل الشحن.
              </span>
            </div>

            {/* Governorate Selection */}
            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">
                المحافظة <span className="text-red-400">*</span>
              </label>
              {loadingRegions ? (
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-[var(--palm-shade)]/20" />
                  <div className="h-4 w-32 rounded-lg bg-[var(--border-default)]" />
                </div>
              ) : (
                <div className="relative" data-city-picker>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(v => !v)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 border bg-[var(--bg-card)] text-right transition-all duration-300 cursor-pointer group
                      ${dropdownOpen
                        ? 'border-[var(--border-accent)] shadow-[var(--shadow-glow)]'
                        : 'border-[var(--border-default)] hover:border-[var(--border-accent)]'
                      }`}
                  >
                    <MapPin
                      className="w-[18px] h-[18px] shrink-0 transition-colors duration-300 text-[var(--siwa-earth)]"
                      strokeWidth={1.8}
                    />
                    <span className="flex-1 text-[var(--text-primary)] font-ar text-[0.95rem] font-medium">
                      {selectedRegion ? selectedRegion.name : 'اختر المحافظة'}
                    </span>
                    {selectedRegion && (
                      <span
                        className="text-[0.78rem] font-number px-2.5 py-0.5 rounded-full border border-[var(--border-accent)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold transition-all duration-300"
                      >
                        {selectedRegion.shipping_cost} ج.م
                      </span>
                    )}
                    <ChevronDown
                      className="w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-300"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      strokeWidth={2}
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-2xl shadow-[var(--shadow-xl)] overflow-hidden"
                      style={{ animation: 'dropdownIn 0.2s cubic-bezier(0.16,1,0.3,1) both' }}
                    >
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--action-primary)] to-transparent" />
                      <div className="max-h-[260px] overflow-y-auto custom-scrollbar py-1.5">
                        {regions.map((region) => {
                          const active = region.name === city;
                          const saeed = isSaeed(region.name);
                          return (
                            <button
                              key={region.id}
                              type="button"
                              onClick={() => handleCityChange(region)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-all duration-150 group/opt cursor-pointer
                                ${active
                                  ? 'bg-[var(--action-primary)]/10 text-[var(--action-primary)] font-bold'
                                  : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                                }`}
                            >
                              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                                {active ? (
                                  <Check className="w-3.5 h-3.5 text-[var(--action-primary)]" strokeWidth={2.5} />
                                ) : (
                                  <div
                                    className="w-1.5 h-1.5 rounded-full opacity-0 group-hover/opt:opacity-60 transition-opacity bg-[var(--siwa-earth)]"
                                  />
                                )}
                              </div>
                              <span
                                className="flex-1 font-ar text-[0.92rem] transition-colors duration-150"
                              >
                                {region.name}
                              </span>
                              <span
                                className="text-[0.78rem] font-number shrink-0 text-[var(--text-secondary)] font-bold"
                              >
                                {region.shipping_cost} ج.م
                              </span>
                              {saeed && (
                                <span className="text-[0.62rem] font-ar px-1.5 py-0.5 rounded-md border border-[var(--border-accent)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] shrink-0 font-bold">
                                  صعيد
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="px-4 py-2 border-t border-[var(--border-subtle)] flex items-center gap-1.5 bg-[var(--bg-secondary)]/40">
                        <Truck className="w-3.5 h-3.5 text-[var(--text-muted)]" strokeWidth={1.5} />
                        <span className="text-[0.72rem] text-[var(--text-muted)] font-ar">سعر الشحن يتغير تلقائياً حسب المحافظة</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">
                العنوان بالتفصيل <span className="text-red-400">*</span>
              </label>
              <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] transition-all focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
                <MapPin className="w-[18px] h-[18px] text-[var(--siwa-earth)] mt-1 shrink-0" strokeWidth={1.8} />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] resize-none min-h-[80px] font-ar text-[0.95rem] placeholder:text-[var(--text-muted)]"
                  placeholder="المنطقة - الشارع - رقم العمارة - الدور - رقم الشقة أو علامة مميزة"
                  required
                />
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">
                ملاحظات إضافية على الطلب (اختياري)
              </label>
              <div className="rounded-2xl px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-card)] focus-within:border-[var(--border-accent)]">
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تعليمات خاصة بالتوصيل أو التغليف…"
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] font-ar text-[0.88rem] placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            {/* Optional Account Creation for Guests */}
            {!isAuthed && (
              <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] space-y-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--action-primary)] focus:ring-[var(--action-primary)] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                    إنشاء حساب لمتابعة طلباتي مستقبلاً (اختياري)
                  </span>
                </label>

                {createAccount && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="block mb-1.5 text-xs font-bold text-[var(--text-secondary)]">
                      كلمة المرور للحساب الجديد:
                    </label>
                    <div className="relative flex items-center rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2">
                      <Lock className="w-4 h-4 text-[var(--text-muted)] shrink-0 ml-2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="اختر كلمة مرور من 8 أحرف وأرقام"
                        className="w-full bg-transparent outline-none text-xs font-ar text-[var(--text-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full relative overflow-hidden rounded-2xl px-5 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-text)] font-ar font-bold text-[1.05rem] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ClipboardCheck className="w-5 h-5" strokeWidth={2} />
              <span>{isSubmitting ? 'جاري تأكيد الطلب…' : 'تأكيد الطلب والدفع عند الاستلام'}</span>
            </button>

            <Link to="/shop/cart" className="no-underline text-[var(--siwa-earth)] hover:text-[var(--siwa-earth-light)] transition-colors inline-flex items-center gap-2 font-ar font-bold text-[0.9rem] justify-center mt-1">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span>رجوع للسلة</span>
            </Link>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-6 sm:p-7 h-fit shadow-[var(--shadow-xl)] space-y-4">
          <div className="flex items-center gap-2.5 font-ar text-[var(--text-primary)] font-bold text-[1.15rem] pb-3 border-b border-[var(--border-default)]">
            <Receipt className="w-5 h-5 text-[var(--siwa-earth)]" strokeWidth={1.8} />
            <span>ملخص الطلب</span>
          </div>

          <div className="flex flex-col gap-3.5 pt-1">
            {items.length === 0 && (
              <div className="flex flex-col items-center py-6 gap-2">
                <PackageOpen className="w-7 h-7 text-[var(--text-muted)]" strokeWidth={1.5} />
                <span className="text-[var(--text-muted)] text-[0.88rem] font-ar">السلة فارغة</span>
              </div>
            )}

            {items.map((it) => (
              <div key={it.cartKey || it.id} className="flex items-center justify-between text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                  <span className="truncate font-ar text-[0.92rem] font-medium">{it.name}</span>
                  {it.variantName && (
                    <span className="text-[0.72rem] font-bold text-[var(--siwa-earth)] shrink-0">
                      ({it.variantName})
                    </span>
                  )}
                  <span className="text-xs font-number text-[var(--text-muted)] shrink-0">× {it.qty}</span>
                </div>
                <span className="font-number text-[var(--text-primary)] font-bold shrink-0">
                  {money(it.price * it.qty, 'ج.م')}
                </span>
              </div>
            ))}

            <div className="h-px bg-[var(--border-default)] my-1" />

            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <ShoppingBasket className="w-4 h-4 text-[var(--siwa-earth)] opacity-80" strokeWidth={1.8} />
                <span>المجموع</span>
              </span>
              <span className="font-number text-[var(--text-primary)] font-bold">{money(totals.subtotal, 'ج.م')}</span>
            </div>

            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--siwa-earth)] opacity-80" strokeWidth={1.8} />
                <span>الشحن</span>
                {selectedRegion && (
                  <span className="text-[0.72rem] font-ar text-[var(--text-muted)]">({selectedRegion.name})</span>
                )}
              </span>
              <span className="font-number text-[var(--text-primary)] font-bold">{money(totals.shipping, 'ج.م')}</span>
            </div>

            <div className="h-px bg-[var(--border-default)] my-1" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[var(--text-primary)] font-black text-base">الإجمالي النهائي</span>
              <span className="font-number text-[var(--action-primary)] text-[1.4rem] font-black">
                {money(totals.total, 'ج.م')}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[0.78rem] text-[var(--text-secondary)] leading-relaxed text-center font-ar">
            <span className="font-bold text-[var(--siwa-earth)] block mb-0.5">الدفع عند الاستلام نقداً</span>
            يمكنك معاينة المنتجات عند وصول مندوب الشحن قبل سداد القيمة.
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
