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
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-7 max-w-[720px] shadow-[var(--shadow-lg)]">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--action-primary)]/10 border border-[var(--border-accent)] mb-4 text-[var(--action-primary)]">
              <UserCircle className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="text-[var(--text-primary)] font-ar font-bold text-[1.2rem]">{t('checkout.login_required_reason', 'عشان نحفظ تفاصيل الطلب')}</div>
            <div className="mt-1 text-[var(--text-secondary)] font-ar text-[0.92rem]">{t('checkout.login_required_action', 'لازم تسجّل دخول أولاً.')}</div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/auth/login?next=/shop/checkout"
              className="rounded-2xl px-6 py-3 bg-[var(--action-primary)] text-[var(--action-primary-text)] font-ar font-bold no-underline transition-all hover:bg-[var(--action-primary-hover)] shadow-[var(--shadow-md)] active:scale-95"
            >
              {t('auth.sign_in', 'تسجيل الدخول')}
            </Link>
            <Link to="/shop/cart" className="no-underline text-[var(--siwa-earth)] hover:text-[var(--siwa-earth-light)] transition-colors inline-flex items-center gap-2 font-ar font-bold">
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

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-7">
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-7 shadow-[var(--shadow-lg)]">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">{t('checkout.name', 'الاسم')}</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] transition-all focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
                <UserCircle className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] font-ar text-[0.95rem] placeholder:text-[var(--text-muted)]"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">{t('checkout.whatsapp', 'رقم الواتساب')}</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] transition-all focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
                <MessageCircle className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] font-ar text-[0.95rem] placeholder:text-[var(--text-muted)]"
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">{t('checkout.address', 'العنوان')}</label>
              <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-card)] transition-all focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
                <MapPin className="w-[18px] h-[18px] text-[var(--siwa-earth)] mt-1 shrink-0" strokeWidth={1.8} />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-[var(--text-primary)] resize-none min-h-[84px] font-ar text-[0.95rem] placeholder:text-[var(--text-muted)]"
                  placeholder={t('checkout.address_placeholder', 'الشارع - العمارة - الدور')}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem] font-bold font-ar">{t('checkout.city', 'المحافظة')}</label>
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
                        <span className="text-[0.72rem] text-[var(--text-muted)] font-ar">سعر الشحن يتغير حسب المحافظة</span>
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
              className="w-full relative overflow-hidden rounded-2xl px-5 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-text)] font-ar font-bold text-[1.05rem] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ClipboardCheck className="w-5 h-5" strokeWidth={2} />
              <span>{isSubmitting ? t('checkout.confirming', 'جاري التأكيد…') : t('checkout.confirm_order', 'تأكيد الطلب')}</span>
            </button>

            <Link to="/shop/cart" className="no-underline text-[var(--siwa-earth)] hover:text-[var(--siwa-earth-light)] transition-colors inline-flex items-center gap-2 font-ar font-bold text-[0.9rem] justify-center mt-1">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span>{t('checkout.back_to_cart', 'رجوع للسلة')}</span>
            </Link>
          </form>
        </div>

        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-7 h-fit shadow-[var(--shadow-xl)] space-y-4">
          <div className="flex items-center gap-2.5 font-ar text-[var(--text-primary)] font-bold text-[1.15rem] pb-3 border-b border-[var(--border-default)]">
            <Receipt className="w-5 h-5 text-[var(--siwa-earth)]" strokeWidth={1.8} />
            <span>{t('checkout.order_summary', 'ملخص الطلب')}</span>
          </div>
          <div className="flex flex-col gap-3.5 pt-1">
            {items.length === 0 && (
              <div className="flex flex-col items-center py-6 gap-2">
                <PackageOpen className="w-7 h-7 text-[var(--text-muted)]" strokeWidth={1.5} />
                <span className="text-[var(--text-muted)] text-[0.88rem] font-ar">{t('checkout.empty_cart', 'السلة فارغة')}</span>
              </div>
            )}
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-[var(--text-secondary)]">
                <span className="truncate font-ar text-[0.92rem] font-medium">{it.name} × {it.qty}</span>
                <span className="font-number text-[var(--text-primary)] font-bold">{money(it.price * it.qty, t('checkout.currency', 'ج.م'))}</span>
              </div>
            ))}
            <div className="h-px bg-[var(--border-default)] my-1" />
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <ShoppingBasket className="w-4 h-4 text-[var(--siwa-earth)] opacity-80" strokeWidth={1.8} />
                <span>{t('checkout.subtotal', 'المجموع')}</span>
              </span>
              <span className="font-number text-[var(--text-primary)] font-bold">{money(totals.subtotal, t('checkout.currency', 'ج.م'))}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--siwa-earth)] opacity-80" strokeWidth={1.8} />
                <span>{t('checkout.shipping', 'الشحن')}</span>
                {selectedRegion && (
                  <span className="text-[0.72rem] font-ar text-[var(--text-muted)]">({selectedRegion.name})</span>
                )}
              </span>
              <span className="font-number text-[var(--text-primary)] font-bold">{money(totals.shipping, t('checkout.currency', 'ج.م'))}</span>
            </div>
            <div className="h-px bg-[var(--border-default)] my-1" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[var(--text-primary)] font-black text-base">{t('checkout.total', 'الإجمالي')}</span>
              <span className="font-number text-[var(--action-primary)] text-[1.35rem] font-black">{money(totals.total, t('checkout.currency', 'ج.م'))}</span>
            </div>
          </div>
          <div className="text-[0.78rem] text-[var(--text-muted)] leading-[1.8] text-center pt-2 font-ar border-t border-[var(--border-subtle)]">
            {t('checkout.payment_note', 'الدفع عند الاستلام. بإتمام الطلب توافق على الشروط.')}
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
