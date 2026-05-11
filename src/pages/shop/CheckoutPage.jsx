import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, UserCircle, ShoppingBasket, Truck, Receipt, Sparkles, ClipboardCheck, PackageOpen } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';

function money(value, currency) {
  return `${value} ${currency}`;
}

const ORDERS_KEY = 'wahat_orders_v1';

function saveOrder(order) {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    parsed.unshift(order);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(parsed.slice(0, 50)));
  } catch {}
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totals, clear } = useCart();
  const { user, isAuthed } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('الجيزة');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return items.length > 0 && name.trim() && phone.trim() && address.trim() && city.trim();
  }, [address, city, items.length, name, phone]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    const order = {
      id: 'WS-' + Math.floor(1000 + Math.random() * 9000),
      items: items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
      total: totals.total,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      date: new Date().toISOString(),
      status: 'جارِ التجهيز',
    };

    setTimeout(() => {
      saveOrder(order);
      clear();
      toast.success(`تم تأكيد طلبك ${order.id}`);
      setIsSubmitting(false);
      navigate('/shop/account?tab=orders', { replace: true });
    }, 800);
  };

  if (!isAuthed) {
    return (
      <GlassShell title="تسجيل الدخول مطلوب" subtitle="أكمل تسجيل الدخول لإتمام الدفع.">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 max-w-[720px]">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.08)] border border-[rgba(164,184,107,0.15)] mb-4">
              <UserCircle className="w-7 h-7 text-olive-glow opacity-60" strokeWidth={1.5} />
            </div>
            <div className="text-cream font-ar font-semibold text-[1.1rem]">عشان نحفظ تفاصيل الطلب</div>
            <div className="mt-1 text-sand opacity-60 font-ar text-[0.9rem]">لازم تسجّل دخول أولاً.</div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/auth/login?next=/shop/checkout"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold no-underline transition-all hover:shadow-[0_18px_50px_rgba(164,184,107,0.12)] active:scale-95"
            >
              تسجيل الدخول
            </Link>
            <Link to="/shop/cart" className="no-underline text-sand-light hover:text-cream transition-colors inline-flex items-center gap-2 font-ar">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              رجوع للسلة
            </Link>
          </div>
        </div>
      </GlassShell>
    );
  }

  // Steps
  const steps = [
    { label: 'السلة', active: true },
    { label: 'الدفع', active: true },
    { label: 'التأكيد', active: false },
  ];

  return (
    <GlassShell title="الدفع" subtitle="خطوات سريعة وإدخال منظم للعنوان وبيانات التواصل.">
      {/* Steps */}
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
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">الاسم</label>
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
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">رقم الهاتف</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)] transition-all focus-within:border-[rgba(164,184,107,0.35)] focus-within:shadow-[0_0_16px_rgba(164,184,107,0.06)]">
                <Phone className="w-[18px] h-[18px] text-olive-glow shrink-0" strokeWidth={1.5} />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream font-ar text-[0.95rem]"
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">العنوان</label>
              <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)] transition-all focus-within:border-[rgba(164,184,107,0.35)] focus-within:shadow-[0_0_16px_rgba(164,184,107,0.06)]">
                <MapPin className="w-[18px] h-[18px] text-olive-glow mt-1 shrink-0" strokeWidth={1.5} />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream resize-none min-h-[84px] font-ar text-[0.95rem]"
                  placeholder="الشارع - العمارة - الدور"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">المدينة</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.35)] outline-none text-cream font-ar text-[0.95rem] transition-all focus:border-[rgba(164,184,107,0.35)] focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="group relative overflow-hidden rounded-2xl px-5 py-3.5 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.22))] border border-[rgba(164,184,107,0.35)] text-cream font-ar font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_18px_50px_rgba(164,184,107,0.14)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <ClipboardCheck className="w-[18px] h-[18px]" strokeWidth={2} />
              {isSubmitting ? 'جاري التأكيد…' : 'تأكيد الطلب'}
            </button>

            <Link to="/shop/cart" className="no-underline text-sand-light hover:text-cream transition-colors inline-flex items-center gap-2 font-ar text-[0.9rem]">
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              رجوع للسلة
            </Link>
          </form>
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 h-fit">
          <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.1rem]">
            <Receipt className="w-4 h-4 text-olive-glow" strokeWidth={1.5} />
            ملخص الطلب
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {items.length === 0 && (
              <div className="flex flex-col items-center py-6 gap-2">
                <PackageOpen className="w-6 h-6 text-sand opacity-30" strokeWidth={1.5} />
                <span className="text-sand opacity-50 text-[0.85rem] font-ar">السلة فارغة</span>
              </div>
            )}
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-sand opacity-85">
                <span className="truncate font-ar text-[0.9rem]">{it.name} × {it.qty}</span>
                <span className="font-number text-cream">{money(it.price * it.qty, 'ج.م')}</span>
              </div>
            ))}
            <div className="h-px bg-[rgba(212,197,169,0.10)]" />
            <div className="flex items-center justify-between text-sand opacity-85">
              <span className="inline-flex items-center gap-2">
                <ShoppingBasket className="w-3.5 h-3.5 text-olive-glow opacity-60" strokeWidth={2} />
                المجموع
              </span>
              <span className="font-number text-cream">{money(totals.subtotal, 'ج.م')}</span>
            </div>
            <div className="flex items-center justify-between text-sand opacity-85">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-olive-glow opacity-60" strokeWidth={2} />
                الشحن
              </span>
              <span className="font-number text-cream">{money(totals.shipping, 'ج.م')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sand-light font-ar">الإجمالي</span>
              <span className="font-number text-bronze-light text-[1.15rem] font-bold">{money(totals.total, 'ج.م')}</span>
            </div>
          </div>

          <div className="mt-4 text-[0.8rem] text-sand opacity-50 leading-[1.8] text-center font-ar">
            الدفع عند الاستلام. بإتمام الطلب توافق على الشروط.
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
