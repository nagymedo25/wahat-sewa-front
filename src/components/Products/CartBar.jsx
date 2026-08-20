import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ChevronLeft, X } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';

/**
 * CartBar — Bottom floating cart summary.
 *
 * Behavior:
 *  - Slides up from bottom when cart has items
 *  - Slides down when cart is empty
 *  - Dismissed per session via a close button (re-appears on new item add)
 *  - Non-blocking: does NOT cover page CTAs
 *  - Responsive: mobile-first, expands on desktop
 */
export default function CartBar() {
  const { items, totals } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const prevCountRef = useRef(0);

  const itemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  // Re-show if a new item is added (even if previously dismissed)
  useEffect(() => {
    if (itemCount > prevCountRef.current && itemCount > 0) {
      setDismissed(false);
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  // Control visibility
  useEffect(() => {
    if (itemCount > 0 && !dismissed) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [itemCount, dismissed]);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
  };

  if (itemCount === 0) return null;

  return (
    <>
      {/* Spacer to prevent content being hidden behind the bar */}
      <div className={`transition-all duration-500 ${visible ? 'h-[72px]' : 'h-0'}`} aria-hidden="true" />

      {/* The bar itself */}
      <div
        role="region"
        aria-label="ملخص السلة"
        className={`
          fixed bottom-0 left-0 right-0 z-[150] font-ar
          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${visible ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Gradient fade behind bar to prevent hard edge on content */}
        <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-[rgba(24,16,9,0.7)] to-transparent pointer-events-none" />

        <div className="bg-[rgba(33,21,13,0.96)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] border-t border-[rgba(146,108,72,0.30)] shadow-[0_-8px_40px_rgba(0,0,0,0.60)]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[66px] flex items-center justify-between gap-4">

            {/* Left: Cart info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(146,108,72,0.18)] border border-siwa-gold/40">
                  <ShoppingBasket className="w-4 h-4 text-siwa-gold" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] rounded-full bg-siwa-gold text-[0.62rem] font-number text-[#181009] font-bold flex items-center justify-center px-1 shadow-md">
                  {itemCount}
                </span>
              </div>

              <div className="min-w-0">
                <div className="text-[0.72rem] text-siwa-cream/60 leading-none mb-1">
                  {itemCount === 1 ? 'منتج واحد في السلة' : `${itemCount} منتجات في السلة`}
                </div>
                <div className="font-number text-[1.08rem] font-bold text-siwa-cream-light leading-none">
                  {totals.subtotal.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>

            {/* Right: CTA + dismiss */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/shop/cart"
                id="cart-bar-checkout-link"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-siwa-gold text-[#181009] font-bold text-[0.88rem] hover:bg-siwa-warm active:scale-[0.97] transition-all duration-200 shadow-[0_4px_20px_rgba(146,108,72,0.35)]"
              >
                <span>عرض السلة</span>
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="إغلاق شريط السلة"
                className="w-8 h-8 rounded-full flex items-center justify-center text-siwa-cream/40 hover:text-siwa-cream hover:bg-[rgba(211,200,178,0.08)] transition-all active:scale-95"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
