import { useEffect, useRef } from 'react';

export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

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
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
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

  const Icon = product.Icon;

  return (
    <div ref={cardRef} className="product-card group [perspective:1000px]" data-product={product.id}>
      <div
        ref={innerRef}
        className="product-card-inner relative p-10 bg-[rgba(26,24,20,0.5)] border border-[rgba(212,197,169,0.06)] rounded-2xl [backdrop-filter:blur(20px)] transition-all duration-[600ms] [transition-timing-function:var(--ease-cinematic)] overflow-hidden group-hover:-translate-y-2 group-hover:border-[rgba(164,184,107,0.12)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.3),0_0_40px_rgba(164,184,107,0.05)]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(164,184,107,0.03)_0%,transparent_50%,rgba(184,149,107,0.03)_100%)] opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100" />

        <div className="relative z-[1]">
          <div className="relative w-[140px] h-[140px] mx-auto mb-6 flex items-center justify-center">
            <div className="product-orb absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(164,184,107,0.1)_0%,transparent_70%)] animate-orbPulse" />
            <div className="product-icon relative z-[1] w-full h-full text-olive-glow opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.05] group-hover:text-cream">
              <Icon />
            </div>
            <div className="product-shine absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)] animate-shineSweep" />
          </div>

          <div className="text-center">
            <span className="block font-ar text-[0.65rem] font-medium text-olive-glow tracking-[0.2em] mb-2 uppercase">{product.category}</span>
            <h3 className="font-ar text-[1.3rem] font-semibold text-cream mb-3 leading-[1.4]">{product.name}</h3>
            <p className="text-[0.85rem] font-light text-sand leading-[1.8] mb-6">{product.desc}</p>
            <div className="flex justify-center items-center gap-6 pt-4 border-t border-[rgba(212,197,169,0.08)]">
              <span className="text-[0.75rem] font-light text-sand-warm">{product.weight}</span>
              <span className="font-en text-[1.1rem] font-medium text-bronze-light">{product.price}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
