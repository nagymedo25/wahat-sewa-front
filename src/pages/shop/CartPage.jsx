import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBasket, PackageOpen, Receipt, Truck, Sparkles, RotateCcw, ChevronLeft } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';

function money(value, currency = 'ج.م') {
  return `${Number(value).toLocaleString('ar-EG')} ${currency}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totals, setQty, removeItem, clear } = useCart();
  const toast = useToast();
  const { t } = useTranslation();

  const handleRemove = (it) => {
    removeItem(it.id);
    toast.info(`تمت إزالة ${it.name} من السلة`);
  };

  const handleClear = () => {
    clear();
    toast.warning('تم تفريغ السلة');
  };

  return (
    <GlassShell title={t('cart.title', 'سلة المشتريات')} subtitle={t('cart.subtitle', 'رتّب عناصر السلة قبل الدفع.')}>
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-7 items-start font-ar">
        <div className="rounded-3xl border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.75)] [backdrop-filter:blur(18px)] p-6 shadow-xl">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-14">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(146,108,72,0.10)] border border-[rgba(146,108,72,0.20)] mb-5">
                <PackageOpen className="w-8 h-8 text-siwa-gold opacity-60" strokeWidth={1.5} />
              </div>
              <div className="text-siwa-cream-light font-bold text-[1.2rem]">{t('cart.empty_title', 'السلة فارغة')}</div>
              <div className="mt-2 text-siwa-cream/70">{t('cart.empty_desc', 'ابدأ بإضافة منتجات من المتجر.')}</div>
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="no-underline px-5 py-2.5 rounded-xl bg-siwa-gold text-[#181009] font-bold text-sm hover:bg-siwa-warm transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  <span>{t('cart.back_to_store', 'رجوع للمتجر')}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-2xl border border-[rgba(211,200,178,0.10)] bg-[rgba(24,16,9,0.50)] p-4 transition-all duration-300 hover:border-siwa-gold/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-siwa-cream-light text-[1rem]">{it.name}</div>
                      <div className="mt-1 text-siwa-cream/70 font-number text-[0.88rem]">{money(it.price, it.currency)} / قطعة</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(it)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[rgba(211,200,178,0.10)] bg-[rgba(33,21,13,0.6)] text-siwa-cream hover:text-sunset hover:border-sunset/30 transition-all active:scale-95"
                      aria-label="remove"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.8)]">
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[rgba(211,200,178,0.10)] bg-[rgba(24,16,9,0.5)] text-siwa-cream-light hover:border-siwa-gold transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <div className="w-7 text-center font-number text-siwa-cream-light font-bold text-[0.95rem]">{it.qty}</div>
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[rgba(211,200,178,0.10)] bg-[rgba(24,16,9,0.5)] text-siwa-cream-light hover:border-siwa-gold transition-colors active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="font-number text-siwa-cream-light font-bold text-[1.1rem]">
                      {money(it.price * it.qty, it.currency)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-[rgba(211,200,178,0.08)]">
                <Link to="/shop" className="no-underline text-siwa-gold hover:text-siwa-warm transition-colors inline-flex items-center gap-2 font-bold text-[0.88rem]">
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  <span>{t('cart.continue_shopping', 'متابعة التسوق')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.5)] text-siwa-cream/70 hover:text-sunset transition-colors text-[0.82rem] active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{t('cart.clear_cart', 'تفريغ السلة')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="rounded-3xl border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.75)] [backdrop-filter:blur(18px)] p-6 h-fit shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-siwa-cream-light font-bold text-[1.1rem]">
            <Receipt className="w-4 h-4 text-siwa-gold" strokeWidth={1.5} />
            <span>{t('cart.summary', 'ملخص الطلب')}</span>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between text-siwa-cream/80 text-sm">
              <span className="inline-flex items-center gap-2">
                <ShoppingBasket className="w-3.5 h-3.5 text-siwa-gold/70" strokeWidth={2} />
                <span>{t('cart.subtotal', 'المجموع')}</span>
              </span>
              <span className="font-number text-siwa-cream-light font-bold">{money(totals.subtotal, t('cart.currency', 'ج.م'))}</span>
            </div>
            <div className="flex items-center justify-between text-siwa-cream/80 text-sm">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-siwa-gold/70" strokeWidth={2} />
                <span>{t('cart.shipping', 'الشحن')}</span>
              </span>
              <span className="font-number text-siwa-cream-light font-bold">{money(totals.shipping, t('cart.currency', 'ج.م'))}</span>
            </div>
            <div className="h-px bg-[rgba(211,200,178,0.10)]" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-siwa-cream-light font-bold text-base">{t('cart.total', 'الإجمالي')}</span>
              <span className="font-number text-siwa-cream-light text-[1.3rem] font-bold">{money(totals.total, t('cart.currency', 'ج.م'))}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/shop/checkout')}
            className="w-full relative overflow-hidden rounded-2xl px-5 py-4 bg-siwa-gold hover:bg-siwa-warm text-[#181009] font-bold text-[1rem] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            <span>{t('cart.checkout', 'إتمام الشراء')}</span>
          </button>

          <div className="text-[0.78rem] text-siwa-cream/60 leading-[1.8] text-center pt-1">
            {t('cart.payment_note', 'الدفع عند الاستلام. بإتمام الطلب توافق على الشروط.')}
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
