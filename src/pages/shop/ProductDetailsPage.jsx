import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Minus, Plus, ShoppingBasket, Check, Truck,
  Package, ShieldCheck, ChevronLeft, Heart, Share2, Loader2, Sparkles
} from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { loadProduct, normalizeProduct } from '@/services/catalog.js';
import { publicApi } from '@/services/api.js';
import { useTranslation } from 'react-i18next';

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
  const [liked, setLiked] = useState(false);

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
    addItem(product, qty);
    setAdded(true);
    toast.success(t('shop.added_to_cart', 'تمت إضافة {{name}} للسلة', { name: product.name }));
    setTimeout(() => setAdded(false), 2200);
  }, [product, qty, addItem, toast, t]);

  if (loading) {
    return (
      <GlassShell title={t('product_details.loading_title', 'جاري تحميل المنتج')} subtitle="">
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <Loader2 className="w-10 h-10 text-siwa-gold animate-spin opacity-80" strokeWidth={1.5} />
          <p className="text-siwa-cream/60 font-ar text-[0.92rem]">
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
          className="no-underline text-siwa-gold hover:text-siwa-warm transition-colors font-ar inline-flex items-center gap-2 font-bold"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          {t('product_details.back_to_store', 'رجوع للمتجر')}
        </Link>
      </GlassShell>
    );
  }

  const cartItemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  return (
    <GlassShell
      title={product.name}
      subtitle={product.shortDesc}
      topRight={
        <Link
          to="/shop/cart"
          className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(33,21,13,0.70)] border border-[rgba(211,200,178,0.12)] text-siwa-cream-light no-underline transition-all duration-300 hover:border-siwa-gold"
          aria-label={t('product_details.cart_label', 'السلة')}
        >
          <ShoppingBasket className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span className="font-number text-[0.85rem]">{cartItemCount}</span>
        </Link>
      }
    >
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-sm font-ar text-siwa-cream/60">
        <Link
          to="/shop"
          className="no-underline hover:text-siwa-cream-light transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>المتجر</span>
        </Link>
        <span>/</span>
        <span className="text-siwa-gold font-semibold">{product.categoryLabel}</span>
        {product.subcategoryLabel && (
          <>
            <span>/</span>
            <span className="text-siwa-warm font-medium">{product.subcategoryLabel}</span>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_0.88fr] gap-8 items-start">
        {/* Left Column: Product Image & Trust Badges */}
        <div className="space-y-5">
          <div className="relative rounded-3xl border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.70)] [backdrop-filter:blur(16px)] overflow-hidden shadow-xl">
            <div className="relative h-[380px] md:h-[480px] overflow-hidden bg-[#EFE9DD] flex items-center justify-center">
              {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-[#E5DEC7]" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain p-6 transition-all duration-700 hover:scale-105 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-5 right-5 rounded-xl px-4 py-2 text-[0.78rem] font-ar font-bold bg-[rgba(45,29,16,0.92)] text-siwa-cream-light border border-siwa-gold/30 shadow-lg backdrop-blur-md z-10">
                  {product.badge}
                </div>
              )}

              {/* Real Backend Discount Badge */}
              {product.oldPrice && (
                <div className="absolute top-5 left-5 rounded-xl px-4 py-2 text-[0.78rem] font-number font-bold bg-[#C97B4F] text-white shadow-xl z-10">
                  {product.discountPercent ? `توفير ${product.discountAmount} ج.م (-${product.discountPercent}%)` : `توفير ${product.discountAmount} ج.م`}
                </div>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Truck, label: 'شحن سريع ومباشر', sub: 'لكل محافظات مصر' },
              { Icon: Package, label: 'تغليف سيوة الفاخر', sub: 'يحفظ جودة المنتجات' },
              { Icon: ShieldCheck, label: 'طبيعي 100%', sub: 'من مزارع واحة سيوة' },
            ].map(({ Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-[rgba(211,200,178,0.08)] bg-[rgba(33,21,13,0.50)] p-4 text-center transition-all duration-300 hover:border-siwa-gold/30"
              >
                <Icon className="w-5 h-5 text-siwa-gold" strokeWidth={1.5} />
                <span className="text-[0.78rem] font-bold text-siwa-cream-light">{label}</span>
                <span className="text-[0.68rem] text-siwa-cream/50">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.75)] [backdrop-filter:blur(16px)] p-7 space-y-5 shadow-xl">
            {/* Category / Subcategory tag */}
            <div className="flex items-center gap-2 text-xs font-semibold text-siwa-gold">
              <span>{product.categoryLabel}</span>
              {product.subcategoryLabel && (
                <>
                  <span className="text-siwa-cream/30">/</span>
                  <span className="text-siwa-warm">{product.subcategoryLabel}</span>
                </>
              )}
            </div>

            <h1 className="font-ar text-[1.6rem] md:text-[2.1rem] font-bold text-siwa-cream-light leading-[1.25]">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="pt-2 flex items-baseline gap-3.5">
              <span className="font-number text-[2.2rem] font-bold text-siwa-cream-light leading-none">
                {money(product.price, product.currency)}
              </span>

              {product.oldPrice && (
                <span className="font-number text-[1.2rem] text-siwa-cream/40 line-through">
                  {money(product.oldPrice, product.currency)}
                </span>
              )}

              {product.discountPercent && (
                <span className="rounded-xl px-2.5 py-1 text-[0.78rem] font-number font-bold bg-[#C97B4F]/20 text-[#E8A87C] border border-[#C97B4F]/30">
                  -{product.discountPercent}%
                </span>
              )}
            </div>

            <div className="text-[0.82rem] text-siwa-cream/60">
              {product.weight} · السعر شامل الضريبة
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-[rgba(211,200,178,0.08)]">
              <h4 className="text-xs font-bold text-siwa-cream/60 mb-2 uppercase tracking-wider">تفاصيل المنتج:</h4>
              <p className="text-siwa-cream/85 leading-[1.85] text-[0.94rem]">
                {product.desc}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-[rgba(211,200,178,0.08)] space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-3 border border-[rgba(211,200,178,0.12)] bg-[rgba(24,16,9,0.60)]">
                <span className="text-sm font-bold text-siwa-cream/80">الكمية المطلوبة:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(v => Math.max(1, v - 1))}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(211,200,178,0.15)] bg-[rgba(45,29,16,0.6)] text-siwa-cream-light hover:border-siwa-gold hover:text-siwa-gold transition-all active:scale-95"
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <div className="font-number text-[1.25rem] text-siwa-cream-light min-w-[2.5ch] text-center font-bold">
                    {qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQty(v => v + 1)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(211,200,178,0.15)] bg-[rgba(45,29,16,0.6)] text-siwa-cream-light hover:border-siwa-gold hover:text-siwa-gold transition-all active:scale-95"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                id="add-to-cart-main"
                onClick={handleAdd}
                className={`group w-full relative overflow-hidden inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 font-ar font-bold text-[1rem] transition-all duration-300 shadow-xl active:scale-[0.98] ${
                  added
                    ? 'bg-siwa-gold text-[#181009] shadow-[0_0_30px_rgba(146,108,72,0.4)]'
                    : 'bg-siwa-gold hover:bg-siwa-warm text-[#181009] shadow-[0_8px_25px_rgba(146,108,72,0.3)]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                    <span>تمت الإضافة إلى السلة بنجاح</span>
                  </>
                ) : (
                  <>
                    <ShoppingBasket className="w-5 h-5" strokeWidth={1.5} />
                    <span>إضافة للسلة — {money(product.price * qty, product.currency)}</span>
                  </>
                )}
              </button>

              {/* Secondary actions: Favorite & Share */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setLiked(v => !v)}
                  className={`inline-flex items-center gap-1.5 text-xs font-ar transition-all active:scale-95 ${
                    liked ? 'text-sunset font-bold' : 'text-siwa-cream/60 hover:text-siwa-cream-light'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-sunset scale-110' : ''}`} strokeWidth={1.5} />
                  <span>{liked ? 'في المفضلة' : 'أضف للمفضلة'}</span>
                </button>
                <span className="w-px h-3.5 bg-[rgba(211,200,178,0.15)]" />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success('تم نسخ رابط المنتج');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-ar text-siwa-cream/60 hover:text-siwa-cream-light transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                  <span>مشاركة المنتج</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same category */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-l from-[rgba(146,108,72,0.3)] to-transparent" />
            <div className="flex items-center gap-2 text-siwa-cream-light font-bold text-lg">
              <Sparkles className="w-4 h-4 text-siwa-gold" />
              <span>منتجات أخرى من نفس القسم</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[rgba(146,108,72,0.3)] to-transparent" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/shop/product/${p.id}`}
                className="group rounded-2xl border border-[rgba(211,200,178,0.10)] bg-[rgba(33,21,13,0.70)] overflow-hidden transition-all duration-300 hover:border-siwa-gold/50 hover:-translate-y-1 no-underline flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-[#EFE9DD] flex items-center justify-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[0.68rem] text-siwa-gold font-semibold">{p.categoryLabel}</div>
                  <h4 className="mt-1 font-ar text-[0.94rem] font-bold text-siwa-cream-light">{p.name}</h4>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="font-number text-[1.05rem] font-bold text-siwa-cream-light">
                      {money(p.price, p.currency)}
                    </span>
                    {p.oldPrice && (
                      <span className="font-number text-[0.78rem] text-siwa-cream/40 line-through">
                        {money(p.oldPrice, p.currency)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </GlassShell>
  );
}
