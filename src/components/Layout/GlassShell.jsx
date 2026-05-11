import { Link } from 'react-router-dom';
import { ShoppingBasket, UserCircle, Compass, Sparkles } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';

export default function GlassShell({ title, subtitle, children, topRight }) {
  const { items } = useCart();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(74,90,42,0.10)_0%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,rgba(232,168,124,0.08)_0%,transparent_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,7,0.98)_0%,rgba(18,16,12,0.98)_50%,rgba(10,9,7,0.98)_100%)]" />

      <header className="relative z-[2]">
        <div className="mx-auto max-w-[1200px] px-6 pt-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(26,24,20,0.55)] border border-[rgba(212,197,169,0.14)] text-sand-light no-underline transition-all duration-300 hover:border-[rgba(164,184,107,0.45)] hover:bg-[rgba(74,90,42,0.22)] hover:shadow-[0_0_20px_rgba(164,184,107,0.08)]"
              >
                <Sparkles className="w-4 h-4 text-olive-glow transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.5} />
                <span className="font-ar text-[0.95rem] font-medium">واحة سيوة</span>
              </Link>

              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(26,24,20,0.35)] border border-[rgba(212,197,169,0.10)] text-sand-light no-underline transition-all duration-300 hover:border-[rgba(164,184,107,0.40)] hover:bg-[rgba(74,90,42,0.18)] hover:shadow-[0_0_20px_rgba(164,184,107,0.06)]"
                aria-label="المتجر"
              >
                <Compass className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-ar text-[0.9rem]">المتجر</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {topRight}
              <Link
                to="/shop/cart"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(26,24,20,0.35)] border border-[rgba(212,197,169,0.10)] text-sand-light transition-all duration-300 hover:border-[rgba(164,184,107,0.40)] hover:bg-[rgba(74,90,42,0.18)] hover:shadow-[0_0_20px_rgba(164,184,107,0.08)] active:scale-95"
                aria-label="السلة"
              >
                <ShoppingBasket className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] rounded-full bg-sunset text-[0.65rem] font-number text-cream flex items-center justify-center px-1 shadow-lg animate-[cartBadgeBounce_0.5s_ease-out]">
                    {items.length}
                  </span>
                )}
              </Link>
              <Link
                to="/shop/account"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(26,24,20,0.35)] border border-[rgba(212,197,169,0.10)] text-sand-light transition-all duration-300 hover:border-[rgba(164,184,107,0.40)] hover:bg-[rgba(74,90,42,0.18)] hover:shadow-[0_0_20px_rgba(164,184,107,0.08)] active:scale-95"
                aria-label="الحساب"
              >
                <UserCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center gap-3 font-en text-[0.7rem] tracking-[0.45em] text-olive-glow opacity-60 uppercase">
                Wahat Sewa
              </span>
              <h1 className="mt-3 font-ar text-[clamp(2rem,4.5vw,3.2rem)] font-semibold text-cream leading-[1.15]">
                {title}
              </h1>
              {subtitle ? <p className="mt-4 max-w-[62ch] text-sand opacity-80">{subtitle}</p> : null}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-[2]">
        <div className="mx-auto max-w-[1200px] px-6 py-10">{children}</div>
      </main>

      <div className="pointer-events-none absolute -top-32 right-[-140px] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(164,184,107,0.10)_0%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-40 left-[-160px] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(212,197,169,0.11)_0%,transparent_70%)] blur-2xl" />

      <style>{`
        @keyframes cartBadgeBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
