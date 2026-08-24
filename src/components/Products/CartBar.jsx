import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ChevronLeft, X } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';

export default function CartBar() {
  const { items, totals } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const prevCountRef = useRef(0);

  const itemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  // Re-show if a new item is added
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
      {/* Spacer */}
      <div className={`transition-all duration-500 ${visible ? 'h-[72px]' : 'h-0'}`} aria-hidden="true" />

      {/* The floating bar */}
      <div
        role="region"
        aria-label="ملخص السلة"
        className={`fixed bottom-0 left-0 right-0 z-[150] font-ar transition-transform duration-500 ease-cinematic ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-[var(--bg-elevated)]/95 backdrop-blur-2xl border-t border-[var(--border-default)] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
            
            {/* Left: Cart Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--action-primary)]/15 border border-[var(--border-accent)]">
                  <ShoppingBasket className="w-4 h-4 text-[var(--action-primary)]" strokeWidth={1.8} />
                </div>
                <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] rounded-full bg-[var(--discount-badge)] text-[0.62rem] font-number text-white font-bold flex items-center justify-center px-1 shadow-sm">
                  {itemCount}
                </span>
              </div>

              <div className="min-w-0 text-right">
                <div className="text-[0.72rem] text-[var(--text-tertiary)] leading-none mb-1">
                  {itemCount === 1 ? 'منتج واحد في السلة' : `${itemCount} منتجات في السلة`}
                </div>
                <div className="font-number text-[1.1rem] font-black text-[var(--text-primary)] leading-none">
                  {totals.subtotal.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>

            {/* Right: Checkout Link & Dismiss */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/shop/cart"
                id="cart-bar-checkout-link"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-text)] font-bold text-[0.88rem] active:scale-95 transition-all duration-200 shadow-md"
              >
                <span>عرض السلة</span>
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="إغلاق شريط السلة"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all cursor-pointer"
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
