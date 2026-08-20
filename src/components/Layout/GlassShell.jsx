import { Link } from 'react-router-dom';
import { ShoppingBasket, UserCircle, Compass, Sparkles } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';

export default function GlassShell({ title, subtitle, children, topRight }) {
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  return (
    <div className="min-h-screen relative overflow-hidden bg-siwa-primary text-siwa-cream-light selection:bg-siwa-gold/30 selection:text-siwa-cream-light font-ar">
      {/* Background ambient lighting — warm desert night feel */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(146,108,72,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(45,29,16,0.25)_0%,transparent_70%)] pointer-events-none" />

      <header className="relative z-[2] border-b border-[rgba(211,200,178,0.06)] bg-[rgba(24,16,9,0.70)] [backdrop-filter:blur(16px)]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(33,21,13,0.75)] border border-[rgba(211,200,178,0.12)] text-siwa-cream-light no-underline transition-all duration-300 hover:border-siwa-gold/50 hover:bg-[rgba(56,38,23,0.50)] hover:shadow-[0_0_20px_rgba(146,108,72,0.15)]"
              >
                <Sparkles className="w-4 h-4 text-siwa-gold transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.5} />
                <span className="font-ar text-[0.92rem] font-bold">واحة سيوة</span>
              </Link>

              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[rgba(33,21,13,0.50)] border border-[rgba(211,200,178,0.08)] text-siwa-cream no-underline transition-all duration-300 hover:border-siwa-gold/40 hover:text-siwa-cream-light hover:bg-[rgba(56,38,23,0.35)]"
                aria-label="المتجر"
              >
                <Compass className="w-4 h-4 text-siwa-gold/70" strokeWidth={1.5} />
                <span className="font-ar text-[0.88rem]">المتجر</span>
              </Link>
            </div>

            <div className="flex items-center gap-2.5">
              {topRight}
              <Link
                to="/shop/cart"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(33,21,13,0.70)] border border-[rgba(211,200,178,0.12)] text-siwa-cream transition-all duration-300 hover:border-siwa-gold hover:text-siwa-cream-light hover:shadow-[0_0_20px_rgba(146,108,72,0.2)] active:scale-95"
                aria-label="السلة"
              >
                <ShoppingBasket className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[19px] h-[19px] rounded-full bg-siwa-gold text-[0.65rem] font-number text-[#181009] font-bold flex items-center justify-center px-1 shadow-lg animate-[cartBadgeBounce_0.5s_ease-out]">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link
                to="/shop/account"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(33,21,13,0.70)] border border-[rgba(211,200,178,0.12)] text-siwa-cream transition-all duration-300 hover:border-siwa-gold hover:text-siwa-cream-light active:scale-95"
                aria-label="الحساب"
              >
                <UserCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="mt-8 mb-3">
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center gap-2 font-en text-[0.68rem] tracking-[0.4em] text-siwa-gold opacity-80 uppercase font-semibold">
                Wahat Siwa · Premium Oasis Goods
              </span>
              <h1 className="mt-2 font-ar text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-siwa-cream-light leading-[1.2]">
                {title}
              </h1>
              {subtitle ? <p className="mt-2 max-w-[65ch] text-siwa-cream/80 text-[0.95rem]">{subtitle}</p> : null}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-[2]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

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
