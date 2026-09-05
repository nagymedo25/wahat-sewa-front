import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function PromoBanner({ banner, position = 'mid', onCtaClick }) {
  const location = useLocation();

  // Default fallback banner data if not dynamically provided
  const title = banner?.title || (
    position === 'shop'
      ? 'تشكيلة منتجات سيوة الفاخرة — جودة طبيعية 100%'
      : position === 'top'
      ? 'أهلاً بكم في واحة سيوة — خيرات الطبيعة النقية بين يديك'
      : position === 'mid' 
      ? 'زيت زيتون سيوة البكر الممتاز — عصرة أولى على البارد'
      : 'تمور سيوة الفاخرة المحشوة بالمكسرات الطبيعية'
  );
  
  const subtitle = banner?.subtitle || (
    position === 'shop'
      ? 'استمتع بأجود المنتجات السيوية الطبيعية من التمور وزيت الزيتون والأعشاب النقية مباشرة من المزارع إليك'
      : position === 'top'
      ? 'استكشف منتجات واحتنا الغناء بأعلى معايير النقاء والأصالة مباشرة من المزارع إليك'
      : position === 'mid'
      ? 'نقاء لا مثيل له، مستخلص من أشجار الزيتون المعمرة في أرض الواحة الخصبة'
      : 'طعم أصيل غني بالفوائد الغذائية، مثالي للإهداء والمناسبات الراقية'
  );

  const badgeText = position === 'shop' 
    ? 'عروض وتخفيضات المتجر' 
    : position === 'top'
    ? 'موسم حصاد سيوة الأصيل'
    : 'عرض حصري من الواحة';

  const ctaText = banner?.cta_text || (position === 'shop' ? 'تصفح أفضل العروض' : 'اكتشف العرض الآن');
  const linkUrl = banner?.link_url || '/shop';
  const imageUrl = banner?.image_url;

  const handleCtaClick = (e) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
      return;
    }

    // If currently on /shop and link points to /shop or hash, scroll smoothly to products section
    if (location.pathname === '/shop' && (linkUrl === '/shop' || linkUrl === '/shop/' || linkUrl.startsWith('#'))) {
      e.preventDefault();
      const target = document.getElementById('products-grid') || document.getElementById('shop-search');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-16" id={position === 'shop' ? 'promo-shop' : position === 'top' ? 'promo-top' : position === 'mid' ? 'promo-mid' : 'promo-bottom'}>
      <div className="max-w-[1400px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[440px] flex items-center bg-[#2A1A10] border border-[var(--border-accent)] shadow-[var(--shadow-xl)]">
          
          {/* ── 1. The Banner Image (100% clear and sharp) ── */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            /* Fallback luxury decorative background if no image is uploaded */
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--oasis-clay-deep)] via-[var(--oasis-clay)] to-[var(--siwa-earth)]/40" />
          )}

          {/* ── 2. Subtle directional gradient overlay ONLY from Right to Left (for text readability) ── */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#1E130B]/95 via-[#1E130B]/70 sm:via-[#1E130B]/55 to-transparent w-full md:w-3/4 lg:w-3/5 pointer-events-none" />

          {/* ── 3. Banner Content (Right-aligned over the gradient) ── */}
          <div className="relative z-10 max-w-xl p-8 sm:p-12 md:p-16 text-right text-[#F3E9D6]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8A5833]/40 border border-[#8A5833]/60 text-[#DCC7A1] text-xs font-ar font-bold mb-4 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#DCC7A1]" />
              <span>{badgeText}</span>
            </div>

            <h3 className="font-ar text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
              {title}
            </h3>

            {subtitle && (
              <p className="font-ar text-sm sm:text-base text-[#DCC7A1] leading-relaxed mb-8 max-w-lg drop-shadow-sm font-normal">
                {subtitle}
              </p>
            )}

            <Link
              to={linkUrl}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-ar text-sm font-bold shadow-[0_4px_20px_rgba(91,107,74,0.4)] hover:shadow-[0_0_30px_rgba(91,107,74,0.6)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
