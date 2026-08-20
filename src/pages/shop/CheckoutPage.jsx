import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, UserCircle, ShoppingBasket, Truck, Receipt, Sparkles, ClipboardCheck, PackageOpen, ChevronDown, Check } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';

function money(value, currency) {
  return `${value} ${currency}`;
}

const UPPER_EGYPT = ['الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد', 'البحر الأحمر'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totals, clear, setShippingCost } = useCart();
  const { user, isAuthed, api } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await api.get('/regions');
        setRegions(response.data.regions);
        const defaultCity = response.data.regions.find(r => r.name === 'القاهرة') || response.data.regions[0];
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
  }, [api, setShippingCost]);

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
    return items.length > 0 && name.trim() && whatsapp.trim() && address.trim() && city.trim();
  }, [address, city, items.length, name, whatsapp]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      const response = await api.post('/orders', {
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
      });

      const remoteOrder = response.data.order;
      clear();
      toast.success(t('checkout.order_confirmed', 'تم تأكيد طلبك #{{id}}', { id: String(remoteOrder.id).slice(0, 8) }));
      navigate('/shop/account?tab=orders', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || t('checkout.order_failed', 'تعذر إنشاء الطلب الآن. حاول مرة أخرى بعد قليل.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthed) {
    return (
      <GlassShell title={t('checkout.login_required_title', 'تسجيل الدخول مطلوب')} subtitle={t('checkout.login_required_subtitle', 'أكمل تسجيل الدخول لإتمام الدفع.')}>
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 max-w-[720px]">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.08)] border border-[rgba(164,184,107,0.15)] mb-4">
              <UserCircle className="w-7 h-7 text-olive-glow opacity-60" strokeWidth={1.5} />
            </div>
            <div className="text-cream font-ar font-semibold text-[1.1rem]">{t('checkout.login_required_reason', 'عشان نحفظ تفاصيل الطلب')}</div>
            <div className="mt-1 text-sand opacity-60 font-ar text-[0.9rem]">{t('checkout.login_required_action', 'لازم تسجّل دخول أولاً.')}</div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/auth/login?next=/shop/checkout"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold no-underline transition-all hover:shadow-[0_18px_50px_rgba(164,184,107,0.12)] active:scale-95"
            >
              {t('auth.sign_in', 'تسجيل الدخول')}
            </Link>
            <Link to="/shop/cart" className="no-underline text-sand-light hover:text-cream transition-colors inline-flex items-center gap-2 font-ar">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              {t('checkout.back_to_cart', 'رجوع للسلة')}
            </Link>
          </div>
        </div>
      </GlassShell>
    );
  }

  const steps = [
    { label: t('checkout.step_cart', 'السلة'), active: true },
    { label: t('checkout.step_payment', 'الدفع'), active: true },
    { label: t('checkout.step_confirm', 'التأكيد'), active: false },
  ];

  const isSaeed = (name) => UPPER_EGYPT.includes(name?.trim());

  return (
    <GlassShell title={t('checkout.title', 'الدفع')} subtitle={t('checkout.subtitle', 'خطوات سريعة وإدخال منظم للعنوان وبيانات التواصل.')}>
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={`rounded-full px-4 py-1.5 text-[0.8rem] font-ar font-medium transition-all border ${
                step.active
                  ? 'bg-[rgba(74,90,42,0.35)] border-[rgba(164,184,107,0.40)] text-cream'
                  : 'bg-[rgba(26,24,20,0.35)] border-[rgba(212,197,169,0.10)] text-sand opacity-60'
              }`}
            >
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px ${step.active ? 'bg-[rgba(164,184,107,0.30)]' : 'bg-[rgba(212,197,169,0.10)]'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-7">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">{t('checkout.name', 'الاسم')}</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)] transition-all focus-within:border-[rgba(164,184,107,0.35)] focus-within:shadow-[0_0_16px_rgba(164,184,107,0.06)]">
                <UserCircle className="w-[18px] h-[18px] text-olive-glow shrink-0" strokeWidth={1.5} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream font-ar text-[0.95rem]"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">{t('checkout.whatsapp', 'رقم الواتساب')}</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)] transition-all focus-within:border-[rgba(164,184,107,0.35)] focus-within:shadow-[0_0_16px_rgba(164,184,107,0.06)]">
                <MessageCircle className="w-[18px] h-[18px] text-olive-glow shrink-0" strokeWidth={1.5} />
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream font-ar text-[0.95rem]"
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">{t('checkout.address', 'العنوان')}</label>
              <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)] transition-all focus-within:border-[rgba(164,184,107,0.35)] focus-within:shadow-[0_0_16px_rgba(164,184,107,0.06)]">
                <MapPin className="w-[18px] h-[18px] text-olive-glow mt-1 shrink-0" strokeWidth={1.5} />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream resize-none min-h-[84px] font-ar text-[0.95rem]"
                  placeholder={t('checkout.address_placeholder', 'الشارع - العمارة - الدور')}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">{t('checkout.city', 'المحافظة')}</label>
              {loadingRegions ? (
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.35)] animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-[rgba(164,184,107,0.12)]" />
                  <div className="h-4 w-32 rounded-lg bg-[rgba(212,197,169,0.08)]" />
                </div>
              ) : (
                <div className="relative" data-city-picker>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(v => !v)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 border bg-[rgba(10,9,7,0.35)] text-right transition-all duration-300 cursor-pointer group
                      ${dropdownOpen
                        ? 'border-[rgba(164,184,107,0.45)] shadow-[0_0_20px_rgba(164,184,107,0.08)]'
                        : 'border-[rgba(212,197,169,0.10)] hover:border-[rgba(164,184,107,0.25)]'
                      }`}
                  >
                    <MapPin
                      className="w-[18px] h-[18px] shrink-0 transition-colors duration-300"
                      style={{ color: selectedRegion && isSaeed(selectedRegion.name) ? '#fbbf24' : '#a4b86b' }}
                      strokeWidth={1.5}
                    />
                    <span className="flex-1 text-cream font-ar text-[0.95rem]">
                      {selectedRegion ? selectedRegion.name : 'اختر المحافظة'}
                    </span>
                    {selectedRegion && (
                      <span
                        className="text-[0.75rem] font-number px-2.5 py-0.5 rounded-full border transition-all duration-300"
                        style={
                          isSaeed(selectedRegion.name)
                            ? { color: '#fbbf24', borderColor: 'rgba(245,158,11,0.30)', background: 'rgba(245,158,11,0.08)' }
                            : { color: '#a4b86b', borderColor: 'rgba(164,184,107,0.25)', background: 'rgba(164,184,107,0.08)' }
                        }
                      >
                        {selectedRegion.shipping_cost} ج.م
                      </span>
                    )}
                    <ChevronDown
                      className="w-4 h-4 text-sand/40 shrink-0 transition-transform duration-300"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      strokeWidth={2}
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 rounded-2xl border border-[rgba(164,184,107,0.18)] bg-[rgba(16,14,10,0.96)] [backdrop-filter:blur(20px)] shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden"
                      style={{ animation: 'dropdownIn 0.2s cubic-bezier(0.16,1,0.3,1) both' }}
                    >
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-[rgba(164,184,107,0.35)] to-transparent" />
                      <div className="max-h-[260px] overflow-y-auto custom-scrollbar py-1.5">
                        {regions.map((region) => {
                          const active = region.name === city;
                          const saeed = isSaeed(region.name);
                          return (
                            <button
                              key={region.id}
                              type="button"
                              onClick={() => handleCityChange(region)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-all duration-150 group/opt
                                ${active
                                  ? 'bg-[rgba(164,184,107,0.10)]'
                                  : 'hover:bg-[rgba(255,255,255,0.03)]'
                                }`}
                            >
                              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                                {active ? (
                                  <Check className="w-3.5 h-3.5" style={{ color: saeed ? '#fbbf24' : '#a4b86b' }} strokeWidth={2.5} />
                                ) : (
                                  <div
                                    className="w-1.5 h-1.5 rounded-full opacity-0 group-hover/opt:opacity-60 transition-opacity"
                                    style={{ background: saeed ? '#fbbf24' : '#a4b86b' }}
                                  />
                                )}
                              </div>
                              <span
                                className="flex-1 font-ar text-[0.92rem] transition-colors duration-150"
                                style={{ color: active ? (saeed ? '#fbbf24' : '#a4b86b') : 'rgba(212,197,169,0.85)' }}
                              >
                                {region.name}
                              </span>
                              <span
                                className="text-[0.75rem] font-number shrink-0"
                                style={{ color: saeed ? 'rgba(251,191,36,0.65)' : 'rgba(164,184,107,0.55)' }}
                              >
                                {region.shipping_cost} ج.م
                              </span>
                              {saeed && (
                                <span className="text-[0.62rem] font-ar px-1.5 py-0.5 rounded-md border shrink-0"
                                  style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.06)' }}>
                                  صعيد
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.04)] flex items-center gap-1.5">
                        <Truck className="w-3 h-3 text-sand/30" strokeWidth={1.5} />
                        <span className="text-[0.7rem] text-sand/30 font-ar">سعر الشحن يتغير حسب المحافظة</span>
                      </div>
                    </div>
                  )}
                  <style>{`
                    @keyframes dropdownIn {
                      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                      to   { opacity: 1; transform: translateY(0)   scale(1);    }
                    }
                  `}</style>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full relative overflow-hidden rounded-2xl px-5 py-4 bg-siwa-gold hover:bg-siwa-warm text-[#181009] font-ar font-bold text-[1rem] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="w-5 h-5" strokeWidth={2} />
              <span>{isSubmitting ? t('checkout.confirming', 'جاري التأكيد…') : t('checkout.confirm_order', 'تأكيد الطلب')}</span>
            </button>

            <Link to="/shop/cart" className="no-underline text-siwa-cream/70 hover:text-siwa-cream-light transition-colors inline-flex items-center gap-2 font-ar text-[0.9rem]">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span>{t('checkout.back_to_cart', 'رجوع للسلة')}</span>
            </Link>
          </form>
        </div>

        <div className="rounded-3xl border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.75)] [backdrop-filter:blur(18px)] p-7 h-fit shadow-xl">
          <div className="flex items-center gap-2 font-ar text-siwa-cream-light font-bold text-[1.1rem]">
            <Receipt className="w-4 h-4 text-siwa-gold" strokeWidth={1.5} />
            <span>{t('checkout.order_summary', 'ملخص الطلب')}</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {items.length === 0 && (
              <div className="flex flex-col items-center py-6 gap-2">
                <PackageOpen className="w-6 h-6 text-sand opacity-30" strokeWidth={1.5} />
                <span className="text-sand opacity-50 text-[0.85rem] font-ar">{t('checkout.empty_cart', 'السلة فارغة')}</span>
              </div>
            )}
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-sand opacity-85">
                <span className="truncate font-ar text-[0.9rem]">{it.name} × {it.qty}</span>
                <span className="font-number text-cream">{money(it.price * it.qty, t('checkout.currency', 'ج.م'))}</span>
              </div>
            ))}
            <div className="h-px bg-[rgba(212,197,169,0.10)]" />
            <div className="flex items-center justify-between text-sand opacity-85">
              <span className="inline-flex items-center gap-2">
                <ShoppingBasket className="w-3.5 h-3.5 text-olive-glow opacity-60" strokeWidth={2} />
                {t('checkout.subtotal', 'المجموع')}
              </span>
              <span className="font-number text-cream">{money(totals.subtotal, t('checkout.currency', 'ج.م'))}</span>
            </div>
            <div className="flex items-center justify-between text-sand opacity-85">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-olive-glow opacity-60" strokeWidth={2} />
                {t('checkout.shipping', 'الشحن')}
                {selectedRegion && (
                  <span className="text-[0.7rem] font-ar opacity-60">({selectedRegion.name})</span>
                )}
              </span>
              <span className="font-number text-cream">{money(totals.shipping, t('checkout.currency', 'ج.م'))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sand-light font-ar">{t('checkout.total', 'الإجمالي')}</span>
              <span className="font-number text-bronze-light text-[1.15rem] font-bold">{money(totals.total, t('checkout.currency', 'ج.م'))}</span>
            </div>
          </div>
          <div className="mt-4 text-[0.8rem] text-sand opacity-50 leading-[1.8] text-center font-ar">
            {t('checkout.payment_note', 'الدفع عند الاستلام. بإتمام الطلب توافق على الشروط.')}
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
