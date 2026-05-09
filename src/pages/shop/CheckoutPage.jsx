import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useAuth } from '@/store/auth.jsx';

function money(value, currency) {
  return `${currency} ${value}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totals, clear } = useCart();
  const { user, isAuthed } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('الجيزة');

  const canSubmit = useMemo(() => {
    return items.length > 0 && name.trim() && phone.trim() && address.trim() && city.trim();
  }, [address, city, items.length, name, phone]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    clear();
    navigate('/shop/account?tab=orders', { replace: true });
  };

  if (!isAuthed) {
    return (
      <GlassShell title="تسجيل الدخول مطلوب" subtitle="أكمل تسجيل الدخول لإتمام الدفع.">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 max-w-[720px]">
          <div className="text-sand opacity-85 leading-[1.9]">
            عشان نحفظ تفاصيل الطلب، لازم تسجّل دخول أولاً.
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Link
              to="/auth/login?next=/shop/checkout"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold no-underline"
            >
              تسجيل الدخول
            </Link>
            <Link to="/shop/cart" className="no-underline text-sand-light hover:text-cream transition-colors">
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                رجوع للسلة
              </span>
            </Link>
          </div>
        </div>
      </GlassShell>
    );
  }

  return (
    <GlassShell title="الدفع" subtitle="خطوات سريعة وإدخال منظم للعنوان وبيانات التواصل.">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-7">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-2 text-sand-light">الاسم</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
                <User className="w-4 h-4 text-olive-glow" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light">رقم الهاتف</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
                <Phone className="w-4 h-4 text-olive-glow" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream"
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light">العنوان</label>
              <div className="flex items-start gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
                <MapPin className="w-4 h-4 text-olive-glow mt-1" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-cream resize-none min-h-[84px]"
                  placeholder="الشارع - العمارة - الدور"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light">المدينة</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)] outline-none text-cream"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_18px_50px_rgba(164,184,107,0.10)] active:scale-[0.99]"
            >
              تأكيد الطلب
            </button>

            <Link to="/shop/cart" className="no-underline text-sand-light hover:text-cream transition-colors">
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                رجوع للسلة
              </span>
            </Link>
          </form>
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7 h-fit">
          <div className="font-ar text-cream font-semibold text-[1.1rem]">ملخص الطلب</div>
          <div className="mt-4 flex flex-col gap-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-sand opacity-85">
                <span className="truncate">{it.name} × {it.qty}</span>
                <span className="font-en text-cream">{money(it.price * it.qty, 'ج.م')}</span>
              </div>
            ))}
            <div className="h-px bg-[rgba(212,197,169,0.10)]" />
            <div className="flex items-center justify-between text-sand opacity-85">
              <span>المجموع</span>
              <span className="font-en text-cream">{money(totals.subtotal, 'ج.م')}</span>
            </div>
            <div className="flex items-center justify-between text-sand opacity-85">
              <span>الشحن</span>
              <span className="font-en text-cream">{money(totals.shipping, 'ج.م')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sand-light">الإجمالي</span>
              <span className="font-en text-bronze-light text-[1.15rem]">{money(totals.total, 'ج.م')}</span>
            </div>
          </div>

          <div className="mt-4 text-[0.85rem] text-sand opacity-70 leading-[1.8]">
            الدفع عند الاستلام (نموذج). بعد التأكيد سيتم نقلك لصفحة الحساب.
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
