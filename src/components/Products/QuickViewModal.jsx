import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { trackAddToCart, trackViewContent } from '@/services/tracking.js';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const toast = useToast();

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQty(1);
      setIsAdded(false);
      // Auto-select first variant if available
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      trackViewContent(product);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.price);

  const currentOriginalPrice = selectedVariant?.original_price
    ? Number(selectedVariant.original_price)
    : (product.oldPrice || product.original_price ? Number(product.oldPrice || product.original_price) : null);

  const hasDiscount = currentOriginalPrice && currentOriginalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItem(product, qty, selectedVariant);
    setIsAdded(true);
    trackAddToCart(product, qty, selectedVariant);
    toast.success(`تمت إضافة ${qty} × "${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}" إلى السلة`);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-ar">
      {/* ── Solid Dark Blurred Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn z-0"
        onClick={onClose}
      />

      {/* ── 100% OPAQUE Luxury Modal Card (No Transparency) ── */}
      <div
        className="relative w-full max-w-2xl bg-[#FCF9F3] dark:bg-[#1E130B] border border-[#DCC7A1]/40 dark:border-[#8A5833]/40 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.65)] overflow-hidden z-10 animate-scaleUp text-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md border border-white/20"
          aria-label="إغلاق العرض السريع"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image Column (100% Pure White Background so product is bright and clean) */}
          <div className="relative bg-white p-6 sm:p-8 flex items-center justify-center min-h-[260px] sm:min-h-[360px] border-b sm:border-b-0 sm:border-l border-neutral-200">
            <img
              src={product.image || product.image_url}
              alt={product.name}
              className="max-h-[260px] sm:max-h-[280px] w-auto max-w-full object-contain [mix-blend-mode:multiply] transition-transform duration-500 hover:scale-105"
            />

            {/* Discount / Special Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-none">
              {hasDiscount && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.72rem] font-bold font-number bg-[#C45E3B] text-white shadow-sm">
                  {discountPercent}%-
                </span>
              )}
              {product.badge && product.badge !== 'none' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-medium font-ar bg-white/95 text-[#3B2316] border border-neutral-200 shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Details & Purchase Column (Solid 100% opaque) */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-4 bg-[#FCF9F3] dark:bg-[#1E130B]">
            <div>
              {/* Category */}
              <div className="text-[0.75rem] font-bold text-[#8A5833] dark:text-[#DCC7A1] tracking-wider mb-1">
                {product.categoryLabel || product.category_name || 'سحر سيوة'}
              </div>

              {/* Title */}
              <h2 id="quick-view-title" className="text-xl sm:text-2xl font-black text-[#3B2316] dark:text-[#F3E9D6] leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-2.5 flex items-baseline gap-2.5">
                <span className="font-number text-2xl sm:text-3xl font-black text-[#3B2316] dark:text-[#F3E9D6]">
                  {currentPrice} {product.currency || 'ج.م'}
                </span>
                {hasDiscount && (
                  <span className="font-number text-sm text-[#8A7260] dark:text-[#A89280] line-through">
                    {currentOriginalPrice} {product.currency || 'ج.م'}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-2 text-[0.82rem] text-[#6B4C38] dark:text-[#DCC7A1]/80 line-clamp-2 leading-relaxed">
                {product.shortDesc || product.desc || product.description || 'منتج طبيعي 100% من أرض واحة سيوة الأصيلة.'}
              </p>

              {/* Variants / Weights Selection if available */}
              {Array.isArray(product.variants) && product.variants.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-[#3B2316]/10 dark:border-[#DCC7A1]/15">
                  <label className="block text-xs font-bold text-[#3B2316] dark:text-[#DCC7A1] mb-2">
                    الوزن / الحجم المتاح:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => {
                      const isSelected = selectedVariant ? selectedVariant.name === v.name : i === 0;
                      return (
                        <button
                          key={v.id || v.name || i}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#5B6B4A] text-white shadow-md ring-2 ring-[#5B6B4A]/40'
                              : 'bg-white dark:bg-[#2A1A10] text-[#3B2316] dark:text-[#DCC7A1] border border-[#3B2316]/15 dark:border-[#DCC7A1]/20 hover:border-[#5B6B4A]'
                          }`}
                        >
                          <span>{v.name}</span>
                          {v.price && (
                            <span className="mr-1 text-[0.7rem] opacity-90 font-number">
                              ({v.price} ج.م)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-[#3B2316]/10 dark:border-[#DCC7A1]/15">
                <span className="text-xs font-bold text-[#3B2316] dark:text-[#DCC7A1]">الكمية المطلوبة:</span>
                <div className="flex items-center gap-2 rounded-xl px-2 py-1 border border-[#3B2316]/15 dark:border-[#DCC7A1]/20 bg-white dark:bg-[#2A1A10]">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EDE2CF] dark:bg-[#3B2316] text-[#3B2316] dark:text-[#F3E9D6] hover:bg-[#5B6B4A] hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-number font-bold text-sm text-[#3B2316] dark:text-[#F3E9D6]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EDE2CF] dark:bg-[#3B2316] text-[#3B2316] dark:text-[#F3E9D6] hover:bg-[#5B6B4A] hover:text-white transition-colors cursor-pointer"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-3.5 rounded-2xl font-ar font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#5B6B4A] hover:bg-[#4A5A3C] text-white shadow-[0_4px_16px_rgba(91,107,74,0.3)]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    <span>تمت الإضافة للسلة بنجاح</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة للسلة — {currentPrice * qty} ج.م</span>
                  </>
                )}
              </button>

              <Link
                to={`/shop/product/${product.id}`}
                onClick={onClose}
                className="w-full py-2 rounded-xl text-center font-ar font-bold text-xs text-[#8A5833] hover:text-[#5B6B4A] transition-colors flex items-center justify-center gap-1"
              >
                <span>عرض صفحة المنتج بالتفصيل</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
