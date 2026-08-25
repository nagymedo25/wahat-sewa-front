import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product, index = 0 }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const toast = useToast();
  const [isAdded, setIsAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgUrl = product.image || product.image_url;
  const numericPrice = typeof product.price === 'string' ? Number(product.price) : product.price;
  const oldPrice = product.oldPrice || product.original_price ? Number(product.oldPrice || product.original_price) : null;
  const hasDiscount = oldPrice && oldPrice > numericPrice;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - numericPrice) / oldPrice) * 100) : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    toast?.success?.(`تمت إضافة "${product.name}" إلى السلة بنجاح`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] overflow-hidden transition-all duration-500 hover:border-[var(--border-accent)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 animate-fadeInUp will-change-transform"
      style={{ animationDelay: `${(index % 12) * 55}ms` }}
      data-product={product.id}
    >
      {/* ── Image Container (Seamless White Blend) ── */}
      <Link
        to={`/shop/product/${product.id}`}
        className="relative block w-full aspect-[4/3] overflow-hidden bg-white p-4 cursor-pointer flex items-center justify-center border-b border-[var(--border-subtle)]"
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-white/90 animate-pulse" />
        )}
        
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-contain [mix-blend-mode:multiply] transition-all duration-500 ease-cinematic group-hover:scale-108 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="font-ar text-xs">لا توجد صورة</span>
          </div>
        )}

        {/* ── Badges ── */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-bold font-number bg-[var(--discount-badge)] text-white shadow-sm">
              {discountPercent}%-
            </span>
          )}
          {product.badge && product.badge !== 'none' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium font-ar bg-white/95 text-[#3B2316] border border-neutral-200 shadow-sm backdrop-blur-md">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* ── Card Content ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3 justify-between text-right">
        <div>
          {/* Category Tag */}
          <span className="block font-ar text-[0.7rem] font-bold text-[var(--siwa-earth)] tracking-wider uppercase mb-1">
            {product.categoryLabel || product.category_name || product.category || 'سحر سيوة'}
          </span>

          {/* Product Title */}
          <Link
            to={`/shop/product/${product.id}`}
            className="block no-underline font-ar text-[0.98rem] sm:text-[1.05rem] font-bold text-[var(--text-primary)] hover:text-[var(--action-primary)] transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          {/* Short Description */}
          <p className="mt-1 font-ar text-[0.78rem] sm:text-[0.8rem] font-normal text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
            {product.shortDesc || product.desc || product.description || 'منتج طبيعي نقي من واحة سيوة المصرية.'}
          </p>
        </div>

        {/* ── Price and Action Area ── */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[0.72rem] font-number text-[var(--text-muted)] line-through leading-tight">
                {oldPrice} {product.currency || 'ج.م'}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-number text-[1.12rem] sm:text-[1.2rem] font-black text-[var(--text-primary)] leading-none">
                {numericPrice}
              </span>
              <span className="font-ar text-[0.72rem] font-bold text-[var(--text-secondary)]">
                {product.currency || 'ج.م'}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="إضافة للسلة"
            className={`relative inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-ar text-[0.78rem] sm:text-[0.82rem] font-bold transition-all duration-300 shadow-sm cursor-pointer active:scale-95 ${
              isAdded
                ? 'bg-[var(--palm-shade-dark)] text-white scale-95'
                : 'bg-[var(--action-primary)] text-white hover:bg-[var(--action-primary-hover)] hover:shadow-[var(--shadow-glow)]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>تمت</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
                <span>إضافة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
