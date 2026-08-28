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

  // Helper to extract discounted or top deal products
  const filterDeals = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    
    // Normalize if needed
    const normalized = list.map((p, i) => (p.source === 'api' ? p : normalizeProduct(p, i)));

    // 1. Get products with real discounts
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

    // 2. Fallback: If no products have original_price set, show featured/top products so drawer is never empty
    return normalized.slice(0, 6);
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

  // Fetch discounts from backend API as an enhancement
  useEffect(() => {
    let isMounted = true;
    async function fetchDiscounts() {
      setLoading(true);
      try {
        const response = await publicApi.get('/products?on_sale=true&limit=12');
        const raw = Array.isArray(response.data?.products) ? response.data.products : [];
        if (raw.length > 0 && isMounted) {
          const deals = filterDeals(raw);
          if (deals.length > 0) {
            setDiscountedProducts(deals);
          }
        }
      } catch (err) {
        // Soft fail to fallback without logging breaking errors
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

  // Compute offer count
  const offerCount = discountedProducts.length;

  return (
    <>
      {/* ── Fixed Side Trigger Badge (Mobile + Desktop Optimized) ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[140] pointer-events-auto select-none">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="اكتشف العروض والخصومات"
          className="relative flex items-center justify-center group py-3 px-2 md:py-3.5 md:px-3.5 rounded-r-2xl bg-gradient-to-br from-[#C45E3B] via-[#BD5432] to-[#9C3E1F] text-white shadow-[0_4px_25px_rgba(196,94,59,0.65)] hover:shadow-[0_0_35px_rgba(196,94,59,0.9)] hover:px-4 md:hover:px-4.5 active:scale-95 transition-all duration-300 cursor-pointer animate-discount-tab border-y border-r border-white/20"
          style={{ writingMode: 'vertical-rl' }}
        >
          <div className="flex items-center gap-2 transform rotate-180">
            <div className="relative flex items-center justify-center">
              <Tag className="w-4 h-4 text-white shrink-0 animate-bounce" strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            </div>
            <span className="font-ar text-xs md:text-sm font-black tracking-wider drop-shadow-sm whitespace-nowrap">
              أقوى العروض {offerCount > 0 ? `(${offerCount})` : ''}
            </span>
          </div>
        </button>
      </div>

      {/* ── Backdrop Overlay ── */}
      <div
        className={`fixed inset-0 z-[155] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
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
        className={`fixed top-0 left-0 bottom-0 z-[160] w-[88vw] sm:w-[420px] max-w-[420px] h-[100dvh] bg-[var(--bg-primary)] border-r border-[var(--border-default)] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-500 ease-cinematic ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-secondary)]/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-[var(--discount-badge)]/15 text-[var(--discount-badge)] flex items-center justify-center shrink-0 border border-[var(--discount-badge)]/25 shadow-sm">
              <Percent className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-ar text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight">
                عروض وخصومات حصرية
              </h3>
              <p className="font-ar text-xs text-[var(--text-tertiary)] mt-0.5">
                منتجات مختارة بأقوى التخفيضات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="إغلاق قائمة العروض"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Drawer Products List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {discountedProducts.length === 0 && loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-[var(--text-tertiary)]">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--discount-badge)] border-t-transparent animate-spin mb-3" />
              <p className="font-ar text-sm">جاري تحميل أقوى العروض...</p>
            </div>
          ) : discountedProducts.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-tertiary)] font-ar text-sm">
              لا توجد عروض إضافية متاحة حالياً
            </div>
          ) : (
            discountedProducts.map((p) => (
              <div
                key={p.id}
                className="group flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-accent)] hover:shadow-md transition-all duration-300 text-right"
              >
                {/* Product Thumbnail */}
                <Link
                  to={`/shop/product/${p.id}`}
                  onClick={() => setIsOpen(false)}
                  className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-white overflow-hidden shrink-0 p-1.5 flex items-center justify-center border border-[var(--border-subtle)]"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain [mix-blend-mode:multiply] group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-[var(--siwa-earth)] opacity-50" />
                  )}
                  {p.discountPercent ? (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-[var(--discount-badge)] text-white text-[0.62rem] font-bold font-number shadow-sm">
                      {p.discountPercent}%-
                    </span>
                  ) : null}
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/shop/product/${p.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block font-ar text-xs sm:text-sm font-bold text-[var(--text-primary)] hover:text-[var(--action-primary)] transition-colors truncate mb-1"
                  >
                    {p.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-number text-sm sm:text-base font-extrabold text-[var(--text-primary)]">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--action-primary)] text-[var(--action-primary-text)] font-ar text-xs font-bold hover:bg-[var(--action-primary-hover)] active:scale-95 transition-all cursor-pointer shadow-sm"
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
        <div className="p-4 sm:p-6 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/70 backdrop-blur-md text-center shrink-0">
          <Link
            to="/shop?on_sale=true"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[var(--siwa-earth)] text-white font-ar text-xs sm:text-sm font-bold hover:bg-[var(--siwa-earth-light)] active:scale-98 transition-all shadow-md group cursor-pointer"
          >
            <span>استعراض جميع العروض في المتجر</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </>
  );
}

