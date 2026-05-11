import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBasket, PackageOpen, Receipt, Truck, Sparkles, RotateCcw } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';

function money(value, currency) {
  return `${value} ${currency}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totals, setQty, removeItem, clear } = useCart();
  const toast = useToast();

  const handleRemove = (it) => {
    removeItem(it.id);
    toast.info(`تمت إزالة ${it.name} من السلة`);
  };

  const handleClear = () => {
    clear();
    toast.warning('تم تفريغ السلة');
  };

  return (
    <GlassShell title="سلة المشتريات" subtitle="رتّب عناصر السلة قبل الدفع.">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-7">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.08)] border border-[rgba(164,184,107,0.15)] mb-5">
                <PackageOpen className="w-8 h-8 text-olive-glow opacity-60" strokeWidth={1.5} />
              </div>
              <div className="text-cream font-ar font-semibold text-[1.2rem]">السلة فارغة</div>
              <div className="mt-2 text-sand opacity-70 font-ar">ابدأ بإضافة منتجات من المتجر.</div>
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="no-underline text-olive-glow hover:text-cream transition-colors inline-flex items-center gap-2 font-ar"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  رجوع للمتجر
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(10,9,7,0.30)] p-4 transition-all duration-300 hover:border-[rgba(164,184,107,0.18)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-ar text-cream font-semibold">{it.name}</div>
                      <div className="mt-1 text-sand opacity-80 font-number text-[0.9rem]">{money(it.price, it.currency)} / قطعة</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(it)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] text-sand-light hover:text-sunset hover:border-[rgba(232,168,124,0.25)] transition-all active:scale-95"
                      aria-label="remove"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-2xl px-3 py-2 border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)]">
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.30)] text-cream hover:border-[rgba(164,184,107,0.35)] transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <div className="w-8 text-center font-number text-cream text-[0.95rem]">{it.qty}</div>
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[rgba(212,197,169,0.08)] bg-[rgba(10,9,7,0.30)] text-cream hover:border-[rgba(164,184,107,0.35)] transition-colors active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="font-number text-bronze-light font-bold">{money(it.price * it.qty, it.currency)}</div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between gap-4 mt-2">
                <Link to="/shop" className="no-underline text-olive-glow hover:text-cream transition-colors inline-flex items-center gap-2 font-ar text-[0.9rem]">
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  متابعة التسوق
                </Link>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 border border-[rgba(232,168,124,0.18)] bg-[rgba(232,168,124,0.05)] text-sand-light hover:text-cream transition-colors font-ar text-[0.85rem] active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                  تفريغ السلة
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-6 h-fit">
          <div className="flex items-center gap-2 font-ar text-cream font-semibold text-[1.1rem]">
            <Receipt className="w-4 h-4 text-olive-glow" strokeWidth={1.5} />
            ملخص
          </div>
          <div className="mt-4 flex flex-col gap-3">
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
            <div className="h-px bg-[rgba(212,197,169,0.10)]" />
            <div className="flex items-center justify-between">
              <span className="text-sand-light">الإجمالي</span>
              <span className="font-number text-bronze-light text-[1.15rem] font-bold">{money(totals.total, 'ج.م')}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/shop/checkout')}
            className="group mt-6 w-full relative overflow-hidden rounded-2xl px-5 py-3.5 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.22))] border border-[rgba(164,184,107,0.35)] text-cream font-ar font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_18px_50px_rgba(164,184,107,0.14)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            إتمام الشراء
          </button>

          <div className="mt-4 text-[0.8rem] text-sand opacity-60 leading-[1.8] text-center">
            الدفع عند الاستلام. بإتمام الطلب توافق على الشروط.
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
