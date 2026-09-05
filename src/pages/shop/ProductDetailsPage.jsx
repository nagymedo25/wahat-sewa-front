import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Minus, Plus, ShoppingBasket, Check, Truck,
  Package, ShieldCheck, ChevronLeft, Heart, Share2, Loader2, Sparkles
} from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import ProductCard from '@/components/Products/ProductCard.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { loadProduct, normalizeProduct } from '@/services/catalog.js';
import { publicApi } from '@/services/api.js';
import { useTranslation } from 'react-i18next';
import { trackAddToCart, trackViewContent } from '@/services/tracking.js';

function money(value, currency = 'ج.م') {
  return `${Number(value).toLocaleString('ar-EG')} ${currency}`;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { items, addItem } = useCart();
  const toast = useToast();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setProduct(null);
    setImgLoaded(false);
    setQty(1);

    async function fetch() {
      const prod = await loadProduct(productId);
      if (!isMounted) return;

      if (prod) {
        setProduct(prod);
        if (Array.isArray(prod.variants) && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        } else {
          setSelectedVariant(null);
        }
        trackViewContent(prod);

        // Fetch related products from same category
        try {
          const relRes = await publicApi.get(`/products?category=${prod.category}&limit=4`);
          const raw = Array.isArray(relRes.data?.products) ? relRes.data.products : [];
          const normalized = raw
            .map((p, i) => normalizeProduct(p, i))
            .filter(p => p.id !== productId)
            .slice(0, 3);
          if (isMounted) setRelated(normalized);
        } catch {
          // Decorative
        }
      }

      if (isMounted) setLoading(false);
    }

    fetch();
    return () => { isMounted = false; };
  }, [productId]);

  const handleAdd = useCallback(() => {
    if (!product) return;
    addItem(product, qty, selectedVariant);
    trackAddToCart(product, qty, selectedVariant);
    setAdded(true);
    toast.success(t('shop.added_to_cart', 'تمت إضافة {{name}} للسلة', {
      name: `${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}`
    }));
    setTimeout(() => setAdded(false), 2200);
  }, [product, qty, selectedVariant, addItem, toast, t]);

  if (loading) {
    return (
      <GlassShell title={t('product_details.loading_title', 'جاري تحميل المنتج')} subtitle="">
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <Loader2 className="w-10 h-10 text-[var(--siwa-earth)] animate-spin opacity-80" strokeWidth={1.8} />
          <p className="text-[var(--text-secondary)] font-ar text-[0.92rem]">
            {t('product_details.loading_desc', 'جاري تحميل تفاصيل المنتج…')}
          </p>
        </div>
      </GlassShell>
    );
  }

  if (!product) {
    return (
      <GlassShell
        title={t('product_details.not_found_title', 'المنتج غير موجود')}
        subtitle={t('product_details.not_found_subtitle', 'ربما تم تغيير الرابط أو حذف المنتج.')}
      >
        <Link
          to="/shop"
          className="no-underline text-[var(--siwa-earth)] hover:text-[var(--action-primary)] transition-colors font-ar inline-flex items-center gap-2 font-bold"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          {t('product_details.back_to_store', 'رجوع للمتجر')}
        </Link>
      </GlassShell>
    );
  }

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.price || 0);

  const currentOldPrice = selectedVariant?.original_price
    ? Number(selectedVariant.original_price)
    : (product.oldPrice || null);

  const hasDiscount = currentOldPrice && currentOldPrice > currentPrice;
  const currentDiscountAmount = hasDiscount ? currentOldPrice - currentPrice : 0;
  const currentDiscountPercent = hasDiscount ? Math.round((currentDiscountAmount / currentOldPrice) * 100) : null;

  return (
    <GlassShell
      title={product.name}
      subtitle={product.shortDesc}
    >
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-sm font-ar text-[var(--text-secondary)]">
        <Link
          to="/shop"
          className="no-underline hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>المتجر</span>
        </Link>
        <span>/</span>
        <span className="text-[var(--siwa-earth)] font-bold">{product.categoryLabel}</span>
        {product.subcategoryLabel && (
          <>
            <span>/</span>
            <span className="text-[var(--text-tertiary)] font-medium">{product.subcategoryLabel}</span>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_0.88fr] gap-8 items-start">
        {/* Left Column: Product Image */}
        <div className="space-y-5">
          <div className="relative rounded-3xl border border-[var(--border-default)] bg-white overflow-hidden shadow-lg">
            <div className="relative h-[360px] sm:h-[420px] md:h-[480px] overflow-hidden bg-white flex items-center justify-center">
              {!imgLoaded && <div className="absolute inset-0 bg-white/90 animate-pulse" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain [mix-blend-mode:multiply] p-6 transition-all duration-700 hover:scale-105 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Badge */}
              {product.badge && product.badge !== 'none' && (
                <div className="absolute top-5 right-5 rounded-xl px-3.5 py-1.5 text-[0.75rem] font-ar font-bold bg-white/95 text-[#3B2316] border border-neutral-200 shadow-md backdrop-blur-md z-10 pointer-events-none">
                  {product.badge}
                </div>
              )}

              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-5 left-5 rounded-xl px-3.5 py-1.5 text-[0.75rem] font-number font-bold bg-[var(--discount-badge)] text-white shadow-md z-10 pointer-events-none">
                  {currentDiscountPercent ? `توفير ${currentDiscountAmount} ج.م (-${currentDiscountPercent}%)` : `توفير ${currentDiscountAmount} ج.م`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card & Trust Badges underneath */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 sm:p-7 space-y-5 shadow-lg text-right">
            {/* Category / Subcategory tag */}
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--siwa-earth)]">
              <span>{product.categoryLabel}</span>
              {product.subcategoryLabel && (
                <>
                  <span className="text-[var(--text-muted)]">/</span>
                  <span className="text-[var(--text-tertiary)]">{product.subcategoryLabel}</span>
                </>
              )}
            </div>

            <h1 className="font-ar text-[1.5rem] sm:text-[1.8rem] md:text-[2.1rem] font-black text-[var(--text-primary)] leading-[1.25]">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="pt-2 flex items-baseline gap-3.5">
              <span className="font-number text-[2rem] sm:text-[2.2rem] font-black text-[var(--text-primary)] leading-none">
                {money(currentPrice, product.currency)}
              </span>

              {hasDiscount && (
                <span className="font-number text-[1.1rem] sm:text-[1.2rem] text-[var(--text-muted)] line-through">
                  {money(currentOldPrice, product.currency)}
                </span>
              )}

              {currentDiscountPercent && (
                <span className="rounded-xl px-2.5 py-1 text-[0.78rem] font-number font-bold bg-[var(--discount-badge)] text-white">
                  -{currentDiscountPercent}%
                </span>
              )}
            </div>

            {product.weight && (
              <div className="text-[0.82rem] text-[var(--text-tertiary)] font-medium">
                {product.weight} · السعر شامل الضريبة
              </div>
            )}

            {/* Description */}
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wider">تفاصيل المنتج:</h4>
              <p className="text-[var(--text-secondary)] leading-[1.85] text-[0.92rem] sm:text-[0.94rem]">
                {product.desc || product.description}
              </p>
            </div>

            {/* Variants / Weights Selection */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2.5">
                <label className="block text-xs font-bold text-[var(--text-secondary)]">
                  اختر الوزن أو الحجم:
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {product.variants.map((v, i) => {
                    const isSelected = selectedVariant ? selectedVariant.name === v.name : i === 0;
                    return (
                      <button
                        key={v.id || v.name || i}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--action-primary)] text-white shadow-md ring-2 ring-[var(--action-primary)]/30 scale-[1.02]'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--siwa-earth)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.price && (
                          <span className="mr-1.5 text-[0.72rem] font-number opacity-90">
                            ({v.price} ج.م)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-3 border border-[var(--border-default)] bg-[var(--bg-elevated)]">
                <span className="text-sm font-bold text-[var(--text-primary)]">الكمية المطلوبة:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(v => Math.max(1, v - 1))}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-all active:scale-95 cursor-pointer"
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <span className="font-number text-lg font-bold text-[var(--text-primary)] w-8 text-center">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(v => v + 1)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-all active:scale-95 cursor-pointer"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="add-to-cart-details"
                  onClick={handleAdd}
                  className={`flex-1 inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-ar font-bold text-base transition-all duration-300 shadow-md active:scale-[0.98] cursor-pointer ${
                    added
                      ? 'bg-[var(--palm-shade-dark)] text-white'
                      : 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white hover:shadow-[var(--shadow-glow)]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      <span>تمت الإضافة للسلة بنجاح</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBasket className="w-5 h-5" strokeWidth={2} />
                      <span>إضافة إلى سلة الشراء ({currentPrice * qty} ج.م)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Trust Badges (Positioned UNDER product details & compact font on mobile) ── */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1">
            {[
              { Icon: Truck, label: 'شحن سريع ومباشر', sub: 'لكل محافظات مصر' },
              { Icon: Package, label: 'تغليف فاخر وآمن', sub: 'يحفظ جودة المنتجات' },
              { Icon: ShieldCheck, label: 'طبيعي 100%', sub: 'من مزارع واحة سيوة' },
            ].map(({ Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 sm:gap-1.5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-2.5 sm:p-4 text-center transition-all duration-300 hover:border-[var(--border-accent)] shadow-2xs"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
                <span className="text-[0.68rem] sm:text-[0.78rem] font-bold text-[var(--text-primary)] leading-tight">{label}</span>
                <span className="text-[0.58rem] sm:text-[0.66rem] text-[var(--text-tertiary)] leading-tight">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20 pt-10 border-t border-[var(--border-default)]">
          <h3 className="text-xl font-bold font-ar text-[var(--text-primary)] mb-6 text-right">
            منتجات ذات صلة من نفس القسم
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </GlassShell>
  );
}
