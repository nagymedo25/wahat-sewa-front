import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';

function money(value, currency) {
  return `${currency} ${value}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totals, setQty, removeItem, clear } = useCart();

  return (
    <GlassShell title="سلة المشتريات" subtitle="رتّب عناصر السلة قبل الدفع.">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-7">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-6">
          {items.length === 0 ? (
            <div className="text-sand opacity-85">
              <div className="text-cream font-ar font-semibold text-[1.2rem]">السلة فارغة</div>
              <div className="mt-2">ابدأ بإضافة منتجات من المتجر.</div>
              <div className="mt-6">
                <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors">
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    رجوع للمتجر
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-ar text-cream font-semibold">{it.name}</div>
                      <div className="mt-1 text-sand opacity-80 font-en">{money(it.price, it.currency)} / item</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.35)] text-sand-light hover:text-cream transition-colors"
                      aria-label="remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.35)]">
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] text-cream"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-10 text-center font-en text-cream">{it.qty}</div>
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] text-cream"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="font-en text-bronze-light">{money(it.price * it.qty, it.currency)}</div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between gap-4 mt-2">
                <Link to="/shop" className="no-underline text-sand-light hover:text-cream transition-colors">
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    متابعة التسوق
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-2xl px-4 py-2 border border-[rgba(232,168,124,0.22)] bg-[rgba(232,168,124,0.06)] text-sand-light hover:text-cream transition-colors"
                >
                  تفريغ السلة
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-6 h-fit">
          <div className="font-ar text-cream font-semibold text-[1.1rem]">ملخص</div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sand opacity-85">
              <span>المجموع</span>
              <span className="font-en text-cream">{money(totals.subtotal, 'ج.م')}</span>
            </div>
            <div className="flex items-center justify-between text-sand opacity-85">
              <span>الشحن</span>
              <span className="font-en text-cream">{money(totals.shipping, 'ج.م')}</span>
            </div>
            <div className="h-px bg-[rgba(212,197,169,0.10)]" />
            <div className="flex items-center justify-between">
              <span className="text-sand-light">الإجمالي</span>
              <span className="font-en text-bronze-light text-[1.15rem]">{money(totals.total, 'ج.م')}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/shop/checkout')}
            className="mt-6 w-full rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream font-ar font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_18px_50px_rgba(164,184,107,0.10)] active:scale-[0.99]"
          >
            إتمام الشراء
          </button>

          <div className="mt-4 text-[0.85rem] text-sand opacity-70 leading-[1.8]">
            بإتمام الطلب أنت توافق على الشحن والدفع عند الاستلام (واجهة تجريبية).
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
