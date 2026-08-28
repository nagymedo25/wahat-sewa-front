import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, X, ChevronLeft, ShoppingBag, Sparkles, Percent } from 'lucide-react';
import { publicApi } from '@/services/api.js';
import { normalizeProduct } from '@/services/catalog.js';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';

export default function DiscountDrawer({ products: initialProducts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const toast = useToast();

  // Helper to extract discounted products
  const filterDeals = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    
    const normalized = list.map((p, i) => (p.source === 'api' ? p : normalizeProduct(p, i)));

    const withRealDiscount = normalized
      .filter((p) => {
        const price = Number(p.price || 0);
        const oldPrice = p.oldPrice || p.original_price ? Number(p.oldPrice || p.original_price) : null;
        return oldPrice && oldPrice > price;
      })
      .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

    if (withRealDiscount.length > 0) {
      return withRealDiscount;
    }

    return normalized.slice(0, 8);
  };

  // Synchronize with initial products prop immediately
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      const deals = filterDeals(initialProducts);
      if (deals.length > 0) {
        setDiscountedProducts(deals);
      }
    }
  }, [initialProducts]);

  // Fetch discounts from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchDiscounts() {
      setLoading(true);
      try {
        const response = await publicApi.get('/products?on_sale=true&limit=10');
        const raw = Array.isArray(response.data?.products) ? response.data.products : [];
        if (raw.length > 0 && isMounted) {
          const deals = filterDeals(raw);
          if (deals.length > 0) {
            setDiscountedProducts(deals);
          }
        }
      } catch (err) {
        // Soft fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDiscounts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (discountedProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      {/* ── Fixed Side Trigger Badge with Clean Shake Micro-animation ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[140] pointer-events-auto select-none">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="اكتشف العروض والخصومات"
          className="relative flex items-center gap-2 py-3.5 px-3.5 rounded-r-2xl bg-[var(--discount-badge)] text-white shadow-[0_4px_25px_rgba(196,94,59,0.6)] hover:shadow-[0_0_30px_rgba(196,94,59,0.8)] hover:px-4.5 transition-all duration-300 group cursor-pointer animate-discount-tab"
          style={{ writingMode: 'vertical-rl' }}
        >
          <div className="flex items-center gap-2 transform rotate-180">
            <Tag className="w-4 h-4 animate-bounce shrink-0 text-white" strokeWidth={2.5} />
            <span className="font-ar text-xs font-black tracking-wider drop-shadow-sm">
              أقوى العروض ({discountedProducts.length})
            </span>
          </div>
        </button>
      </div>

      {/* ── Backdrop Overlay ── */}
      <div
        className={`fixed inset-0 z-[155] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* ── Side Drawer Panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="عروض وخصومات حصرية"
        className={`fixed top-0 left-0 bottom-0 z-[160] w-full max-w-md bg-[var(--bg-primary)] border-r border-[var(--border-default)] shadow-2xl flex flex-col transition-transform duration-500 ease-cinematic ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-secondary)]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--discount-badge)]/15 text-[var(--discount-badge)] flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <h3 className="font-ar text-lg font-bold text-[var(--text-primary)]">
                عروض وخصومات حصرية
              </h3>
              <p className="font-ar text-xs text-[var(--text-tertiary)]">
                منتجات مختارة بأقوى التخفيضات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="إغلاق قائمة العروض"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-default)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Products List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {discountedProducts.length === 0 && loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-[var(--text-tertiary)]">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--discount-badge)] border-t-transparent animate-spin mb-3" />
              <p className="font-ar text-sm">جاري تحميل أقوى العروض...</p>
            </div>
          ) : (
            discountedProducts.map((p) => (
              <div
                key={p.id}
                className="group flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-accent)] hover:shadow-md transition-all duration-300 text-right"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/shop/product/${p.id}`}
                  onClick={() => setIsOpen(false)}
                  className="relative w-20 h-20 min-w-20 min-h-20 rounded-xl bg-white overflow-hidden shrink-0 p-2 flex items-center justify-center border border-[var(--border-subtle)]"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full max-w-full max-h-full object-contain [mix-blend-mode:multiply] group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-[var(--siwa-earth)] opacity-50" />
                  )}
                  {p.discountPercent ? (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-[var(--discount-badge)] text-white text-[0.65rem] font-bold font-number shadow-sm">
                      {p.discountPercent}%-
                    </span>
                  ) : null}
                </Link>

                {/* Product Details */}
                <div className="flex-1 text-right min-w-0">
                  <Link
                    to={`/shop/product/${p.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block font-ar text-sm font-bold text-[var(--text-primary)] hover:text-[var(--action-primary)] transition-colors truncate mb-1"
                  >
                    {p.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-number text-base font-extrabold text-[var(--text-primary)]">
                      {p.price} {p.currency || 'ج.م'}
                    </span>
                    {p.oldPrice && (
                      <span className="font-number text-xs text-[var(--text-muted)] line-through">
                        {p.oldPrice} {p.currency || 'ج.م'}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addItem(p, 1);
                      toast?.success?.(`تمت إضافة "${p.name}" إلى السلة`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--action-primary)] text-[var(--action-primary-text)] font-ar text-xs font-bold hover:bg-[var(--action-primary-hover)] transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>أضف للسلة</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-6 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/50 text-center shrink-0">
          <Link
            to="/shop?on_sale=true"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[var(--siwa-earth)] text-white font-ar text-sm font-bold hover:bg-[var(--siwa-earth-light)] transition-colors shadow-md group cursor-pointer"
          >
            <span>استعراض جميع العروض في المتجر</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </>
  );
}
