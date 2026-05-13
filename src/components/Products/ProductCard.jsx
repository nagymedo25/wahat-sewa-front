import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const onLeave = () => {
      inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const hasImage = !!product.image;
  const hasRating = typeof product.rating === 'number';
  const Icon = product.Icon || null;

  // Price formatting: support both number+currency and pre-formatted string
  const priceDisplay =
    typeof product.price === 'number'
      ? `${product.price} ${product.currency || ''}`
      : product.price;

  return (
    <div ref={cardRef} className="product-card group [perspective:1000px]" data-product={product.id}>
      <div
        ref={innerRef}
        className="product-card-inner relative bg-[rgba(26,24,20,0.5)] border border-[rgba(212,197,169,0.06)] rounded-2xl [backdrop-filter:blur(20px)] transition-all duration-[600ms] [transition-timing-function:var(--ease-cinematic)] overflow-hidden group-hover:-translate-y-2 group-hover:border-[rgba(164,184,107,0.12)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.3),0_0_40px_rgba(164,184,107,0.05)]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(164,184,107,0.03)_0%,transparent_50%,rgba(184,149,107,0.03)_100%)] opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100" />

        {/* Media area: image OR icon */}
        {hasImage ? (
          <div className="relative h-52 overflow-hidden bg-gray-100 flex items-center justify-center">
            {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200/50" />}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {product.badge && (
              <div className="absolute top-3 right-3 rounded-xl px-3 py-1.5 text-[0.7rem] font-ar font-bold bg-olive text-white border border-olive-light/20 shadow-lg backdrop-blur-md z-10">
                {product.badge}
              </div>
            )}
          </div>
        ) : Icon ? (
          <div className="relative h-44 overflow-hidden bg-[rgba(10,9,7,0.40)] flex items-center justify-center">
            <div className="product-orb absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(164,184,107,0.1)_0%,transparent_70%)] animate-orbPulse scale-75" />
            <div className="relative z-[1] w-[100px] h-[100px] text-olive-glow opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.05] group-hover:text-cream">
              <Icon />
            </div>
            <div className="product-shine absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)] animate-shineSweep" />
          </div>
        ) : null}

        <div className="relative z-[1] p-6">
          <div className="text-center">
            <span className="block font-ar text-[0.65rem] font-medium text-olive-glow tracking-[0.2em] mb-1 uppercase">
              {product.categoryLabel || product.category}
            </span>
            <h3 className="font-ar text-[1.2rem] font-semibold text-cream mb-2 leading-[1.4]">{product.name}</h3>
            <p className="text-[0.8rem] font-light text-sand leading-[1.7] mb-4 line-clamp-2">
              {product.shortDesc || product.desc}
            </p>

            {/* Rating (only for new shop products) */}
            {hasRating && (
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-sunset fill-sunset' : 'text-sand/20'}`}
                    />
                  ))}
                </div>
                <span className="font-number text-[0.7rem] text-sand opacity-70">{product.rating}</span>
              </div>
            )}

            <div className="flex justify-center items-center gap-4 pt-3 border-t border-[rgba(212,197,169,0.08)]">
              <span className="text-[0.75rem] font-light text-sand-warm">{product.weight}</span>
              <span className="font-number text-[1.1rem] font-bold text-bronze-light">{priceDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
