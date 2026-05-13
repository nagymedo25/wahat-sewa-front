import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBasket, Star, Check, Truck, Package, ShieldCheck, ChevronLeft, Heart, Share2, Loader2 } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { loadCatalog } from '@/services/catalog.js';

function money(value, currency) {
  return `${value} ${currency}`;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { items, addItem } = useCart();
  const toast = useToast();
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchCatalog() {
      setLoading(true);
      const catalog = await loadCatalog();
      if (!isMounted) return;
      setCatalogProducts(catalog.products);
      setLoading(false);
    }

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const product = useMemo(
    () => catalogProducts.find((item) => item.id === productId) || null,
    [catalogProducts, productId]
  );

  const related = useMemo(
    () =>
      catalogProducts
        .filter((p) => p.category === product?.category && p.id !== product?.id)
        .slice(0, 3),
    [catalogProducts, product]
  );

  if (loading) {
    return (
      <GlassShell title="جاري تحميل المنتج" subtitle="نجهز لك التفاصيل الآن.">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-olive-glow animate-spin" strokeWidth={1.5} />
          <p className="text-sand opacity-60 font-ar">جاري تحميل تفاصيل المنتج…</p>
        </div>
      </GlassShell>
    );
  }

  if (!product) {
    return (
      <GlassShell title="المنتج غير موجود" subtitle="ربما تم تغيير الرابط أو حذف المنتج.">
        <Link to="/shop" className="no-underline text-olive-glow hover:text-cream transition-colors font-ar inline-flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          رجوع للمتجر
        </Link>
      </GlassShell>
    );
  }

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    toast.success(`تمت إضافة ${product.name} للسلة`);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <GlassShell
      title={product.name}
      subtitle={product.shortDesc}
      topRight={
        <Link
          to="/shop/cart"
          className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(26,24,20,0.35)] border border-[rgba(212,197,169,0.10)] text-sand-light no-underline transition-all duration-300 hover:border-[rgba(164,184,107,0.40)] hover:bg-[rgba(74,90,42,0.18)] hover:shadow-[0_0_20px_rgba(164,184,107,0.06)]"
          aria-label="السلة"
        >
          <ShoppingBasket className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span className="font-number text-[0.85rem]">{items.length}</span>
        </Link>
      }
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/shop" className="no-underline text-sand opacity-60 hover:text-cream transition-colors text-sm font-ar inline-flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          المتجر / {product.categoryLabel}
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8">
        {/* Left: Image */}
        <div className="space-y-6">
          <div className="relative rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] overflow-hidden">
            {/* Image container — light gray background */}
            <div className="relative h-[380px] md:h-[480px] overflow-hidden bg-gray-100 flex items-center justify-center">
              {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200/50" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain p-4 transition-all duration-700 hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Overlays — Vibrant themed badges */}
              {product.badge && (
                <div className="absolute top-5 right-5 rounded-2xl px-5 py-2 text-[0.8rem] font-ar font-bold bg-olive text-white border border-olive-light/20 shadow-xl backdrop-blur-md z-10">
                  {product.badge}
                </div>
              )}
              {product.oldPrice && (
                <div className="absolute top-5 left-5 rounded-2xl px-5 py-2 text-[0.8rem] font-number font-bold bg-sunset text-white border border-sunset-deep/20 shadow-xl backdrop-blur-md z-10">
                  توفير {product.oldPrice - product.price} ج.م
                </div>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4 text-center transition-all duration-300 hover:border-[rgba(164,184,107,0.20)]">
              <Truck className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
              <span className="text-[0.75rem] text-sand-light font-ar">شحن سريع</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4 text-center transition-all duration-300 hover:border-[rgba(164,184,107,0.20)]">
              <Package className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
              <span className="text-[0.75rem] text-sand-light font-ar">تغليف هدايا</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4 text-center transition-all duration-300 hover:border-[rgba(164,184,107,0.20)]">
              <ShieldCheck className="w-5 h-5 text-olive-glow" strokeWidth={1.5} />
              <span className="text-[0.75rem] text-sand-light font-ar">جودة مضمونة</span>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          {/* Header info */}
          <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
            <div className="text-[0.7rem] tracking-[0.25em] uppercase text-olive-glow opacity-70 font-en">
              {product.categoryLabel}
            </div>
            <h1 className="mt-2 font-ar text-[1.6rem] md:text-[2rem] font-semibold text-cream leading-[1.2]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'text-sunset fill-sunset' : 'text-sand/20'}`}
                  />
                ))}
              </div>
              <span className="font-number text-[0.85rem] text-sand font-medium">{product.rating}</span>
              <span className="text-[0.8rem] text-sand opacity-50">({product.reviews} تقييم)</span>
            </div>

            {/* Tags */}
            {product.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-3 py-1 text-[0.7rem] font-ar bg-[rgba(164,184,107,0.10)] border border-[rgba(164,184,107,0.20)] text-olive-glow">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-number text-[2rem] font-bold text-bronze-light leading-none">
                {money(product.price, product.currency)}
              </span>
              {product.oldPrice && (
                <span className="font-number text-[1.15rem] text-sand opacity-40 line-through">
                  {money(product.oldPrice, product.currency)}
                </span>
              )}
            </div>
            <div className="mt-1 text-[0.85rem] text-sand opacity-70">{product.weight} · شامل الضريبة</div>

            {/* Description */}
            <p className="mt-5 text-sand opacity-90 leading-[1.9] text-[0.95rem]">{product.desc}</p>
          </div>

          {/* Cart actions */}
          <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(18px)] p-7">
            <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-3 border border-[rgba(212,197,169,0.12)] bg-[rgba(10,9,7,0.35)]">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] text-cream hover:border-[rgba(164,184,107,0.35)] transition-colors active:scale-95"
                aria-label="decrease"
              >
                <Minus className="w-4 h-4" strokeWidth={2} />
              </button>
              <div className="font-number text-[1.25rem] text-cream">{qty}</div>
              <button
                type="button"
                onClick={() => setQty((v) => v + 1)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] text-cream hover:border-[rgba(164,184,107,0.35)] transition-colors active:scale-95"
                aria-label="increase"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`group mt-5 w-full relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-ar font-semibold transition-all duration-300 active:scale-[0.97] ${
                added
                  ? 'bg-[rgba(74,90,42,0.7)] border-[rgba(164,184,107,0.50)] text-cream shadow-[0_0_30px_rgba(164,184,107,0.20)]'
                  : 'bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.22))] border border-[rgba(164,184,107,0.35)] text-cream hover:shadow-[0_18px_50px_rgba(164,184,107,0.14)]'
              }`}
            >
              {!added && (
                <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              )}
              {added ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                  <span>تمت الإضافة للسلة</span>
                </>
              ) : (
                <>
                  <ShoppingBasket className="w-5 h-5" strokeWidth={1.5} />
                  إضافة للسلة — {money(product.price * qty, product.currency)}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setLiked((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-[0.8rem] font-ar transition-all duration-300 active:scale-95 ${liked ? 'text-sunset' : 'text-sand opacity-60 hover:opacity-100 hover:text-cream'}`}
              >
                <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-sunset scale-110' : ''}`} strokeWidth={1.5} />
                {liked ? 'في المفضلة' : 'أضف للمفضلة'}
              </button>
              <span className="w-px h-4 bg-[rgba(212,197,169,0.15)]" />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('تم نسخ رابط المنتج');
                }}
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-ar text-sand opacity-60 hover:opacity-100 hover:text-cream transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" strokeWidth={1.5} />
                مشاركة
              </button>
            </div>

            <div className="mt-4 text-[0.8rem] text-sand opacity-50 text-center">
              الشحن يُحسب تلقائياً في صفحة الدفع.
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(212,197,169,0.15),transparent)]" />
            <span className="font-ar text-[1.1rem] text-sand-light">منتجات من نفس القسم</span>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(212,197,169,0.15),transparent)]" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/shop/product/${p.id}`}
                className="group rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.45)] overflow-hidden transition-all duration-300 hover:border-[rgba(164,184,107,0.25)] hover:-translate-y-1"
              >
                {/* Related product image — light gray background */}
                <div className="relative h-44 overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[0.65rem] text-olive-glow opacity-70 uppercase font-en">{p.categoryLabel}</div>
                  <h4 className="mt-1 font-ar text-[0.95rem] font-semibold text-cream">{p.name}</h4>
                  <div className="mt-2 font-number text-[1rem] font-bold text-bronze-light">{money(p.price, p.currency)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </GlassShell>
  );
}
