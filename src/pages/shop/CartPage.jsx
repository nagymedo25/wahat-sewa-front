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
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-6 sm:p-7 shadow-[var(--shadow-lg)] transition-all duration-300">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-14">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--palm-shade)]/10 border border-[var(--border-accent)] mb-5 text-[var(--action-primary)]">
                <PackageOpen className="w-9 h-9" strokeWidth={1.5} />
              </div>
              <div className="text-[var(--text-primary)] font-bold text-[1.25rem]">{t('cart.empty_title', 'السلة فارغة')}</div>
              <div className="mt-2 text-[var(--text-secondary)] text-[0.92rem]">{t('cart.empty_desc', 'ابدأ بإضافة منتجات من المتجر.')}</div>
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="no-underline px-6 py-3 rounded-2xl bg-[var(--action-primary)] text-[var(--action-primary-text)] font-bold text-sm hover:bg-[var(--action-primary-hover)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2 active:scale-95"
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
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--border-accent)] p-4 sm:p-5 transition-all duration-300 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-[1.05rem] leading-snug">{it.name}</div>
                      <div className="mt-1 text-[var(--text-secondary)] font-number text-[0.88rem]">{money(it.price, it.currency)} / قطعة</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(it)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--discount-badge)] hover:border-[var(--discount-badge)]/30 hover:bg-[var(--discount-badge)]/10 transition-all active:scale-95 cursor-pointer"
                      aria-label="remove"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.6} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-inner">
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--action-primary)] hover:text-white hover:border-[var(--action-primary)] transition-colors active:scale-95 cursor-pointer"
                        aria-label="decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <div className="w-8 text-center font-number text-[var(--text-primary)] font-bold text-[0.98rem]">{it.qty}</div>
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--action-primary)] hover:text-white hover:border-[var(--action-primary)] transition-colors active:scale-95 cursor-pointer"
                        aria-label="increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="font-number text-[var(--text-primary)] font-black text-[1.15rem]">
                      {money(it.price * it.qty, it.currency)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between gap-4 mt-3 pt-4 border-t border-[var(--border-subtle)]">
                <Link to="/shop" className="no-underline text-[var(--siwa-earth)] hover:text-[var(--siwa-earth-light)] transition-colors inline-flex items-center gap-2 font-bold text-[0.92rem]">
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  <span>{t('cart.continue_shopping', 'متابعة التسوق')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--discount-badge)] hover:border-[var(--discount-badge)]/30 hover:bg-[var(--discount-badge)]/10 transition-all text-[0.85rem] font-bold active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{t('cart.clear_cart', 'تفريغ السلة')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-xl p-6 sm:p-7 h-fit shadow-[var(--shadow-xl)] space-y-5 sticky top-24 transition-all duration-300">
          <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-bold text-[1.15rem] pb-3 border-b border-[var(--border-default)]">
            <Receipt className="w-5 h-5 text-[var(--siwa-earth)]" strokeWidth={1.8} />
            <span>{t('cart.summary', 'ملخص الطلب')}</span>
          </div>

          <div className="flex flex-col gap-3.5 pt-1">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-sm">
              <span className="inline-flex items-center gap-2">
                <ShoppingBasket className="w-4 h-4 text-[var(--siwa-earth)] opacity-80" strokeWidth={1.8} />
                <span>{t('cart.subtotal', 'المجموع')}</span>
              </span>
              <span className="font-number text-[var(--text-primary)] font-bold text-base">{money(totals.subtotal, t('cart.currency', 'ج.م'))}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-sm">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--siwa-earth)] opacity-80" strokeWidth={1.8} />
                <span>{t('cart.shipping', 'الشحن')}</span>
              </span>
              <span className="font-number text-[var(--text-primary)] font-bold text-base">{money(totals.shipping, t('cart.currency', 'ج.م'))}</span>
            </div>
            <div className="h-px bg-[var(--border-default)] my-1" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[var(--text-primary)] font-black text-base">{t('cart.total', 'الإجمالي')}</span>
              <span className="font-number text-[var(--action-primary)] text-[1.4rem] font-black">{money(totals.total, t('cart.currency', 'ج.م'))}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/shop/checkout')}
            className="w-full relative overflow-hidden rounded-2xl px-5 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-text)] font-ar font-bold text-[1.05rem] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            <span>{t('cart.checkout', 'إتمام الشراء')}</span>
          </button>

          <div className="text-[0.78rem] text-[var(--text-muted)] leading-[1.8] text-center pt-1 font-ar">
            {t('cart.payment_note', 'الدفع عند الاستلام. بإتمام الطلب توافق على الشروط.')}
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
