import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check, Sparkles, Eye } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';
import { trackAddToCart } from '@/services/tracking.js';

export default function ProductCard({ product, index = 0, onQuickView }) {
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
    trackAddToCart(product, 1);
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
      <div className="relative block w-full aspect-[4/3] overflow-hidden bg-white p-4 flex items-center justify-center border-b border-[var(--border-subtle)]">
        {/* Clickable image leading to details */}
        <Link
          to={`/shop/product/${product.id}`}
          className="absolute inset-0 flex items-center justify-center p-4 z-0 cursor-pointer"
          aria-label={product.name}
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
        </Link>

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

        {/* ── Quick View Overlay on Hover ── */}
        <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-950 text-white text-xs font-bold font-ar flex items-center justify-center gap-1.5 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg border border-white/10"
          >
            <Eye className="w-3.5 h-3.5 text-[#EAD8B1]" />
            <span>عرض سريع</span>
          </button>
        </div>
      </div>

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

          {/* Buttons Area */}
          <div className="flex items-center gap-1.5">
            {/* Quick View Button (Directly visible on mobile and desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView?.(product);
              }}
              aria-label="عرض سريع"
              title="عرض سريع وتحديد الوزن والكمية"
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--action-primary)] hover:border-[var(--action-primary)] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <Eye className="w-4 h-4" strokeWidth={1.8} />
            </button>

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
    </div>
  );
}
