import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, X, ChevronLeft, ShoppingBag, Sparkles, Percent } from 'lucide-react';
import { publicApi } from '@/services/api.js';
import { normalizeProduct } from '@/services/catalog.js';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';

export default function DiscountDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const toast = useToast();

  useEffect(() => {
    async function fetchDiscounts() {
      setLoading(true);
      try {
        const response = await publicApi.get('/products?on_sale=true&limit=10');
        const raw = Array.isArray(response.data?.products) ? response.data.products : [];
        const normalized = raw.map((p, i) => normalizeProduct(p, i));
        
        // Filter those with real discounts and sort by highest discount percentage
        const valid = normalized
          .filter((p) => p.oldPrice && p.oldPrice > p.price)
          .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        
        setDiscountedProducts(valid);
      } catch (err) {
        console.error('Failed to load discount offers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDiscounts();
  }, []);

  // If no real discounted products found, don't show the drawer tab
  if (discountedProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      {/* ── Fixed Side Trigger Badge with Clean Shake Micro-animation ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
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
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Side Drawer Panel ── */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-full max-w-md bg-[var(--bg-primary)] border-r border-[var(--border-default)] shadow-2xl flex flex-col transition-transform duration-500 ease-cinematic ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--discount-badge)]/15 text-[var(--discount-badge)] flex items-center justify-center">
              <Percent className="w-5 h-5" />
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
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-default)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Products List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {discountedProducts.map((p) => (
            <div
              key={p.id}
              className="group flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-accent)] hover:shadow-md transition-all duration-300"
            >
              {/* Product Thumbnail */}
              <Link
                to={`/shop/product/${p.id}`}
                onClick={() => setIsOpen(false)}
                className="relative w-20 h-20 rounded-xl bg-white overflow-hidden shrink-0 p-2 flex items-center justify-center border border-[var(--border-subtle)]"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain [mix-blend-mode:multiply] group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Sparkles className="w-6 h-6 text-[var(--siwa-earth)] opacity-50" />
                )}
                {p.discountPercent && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-[var(--discount-badge)] text-white text-[0.65rem] font-bold font-number">
                    {p.discountPercent}%-
                  </span>
                )}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--action-primary)] text-[var(--action-primary-text)] font-ar text-xs font-bold hover:bg-[var(--action-primary-hover)] transition-colors cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>أضف للسلة</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-6 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/50 text-center">
          <Link
            to="/shop?on_sale=true"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[var(--siwa-earth)] text-white font-ar text-sm font-bold hover:bg-[var(--siwa-earth-light)] transition-colors shadow-md group"
          >
            <span>استعراض جميع العروض في المتجر</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </>
  );
}
