import { Link } from 'react-router-dom';
import { ShoppingBasket, UserCircle, Compass, Sparkles } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';
import ThemeToggle from '@/components/Nav/ThemeToggle.jsx';
import Logo from '@/components/Logo.jsx';
import SiteFooter from '@/components/Footer/SiteFooter.jsx';

// ─── Authentic Siwan Geometric Pattern Overlay Component ───
function SiwaOrnamentsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Subtle Heritage Dot Grid */}
      <div className="absolute inset-0 siwa-heritage-grid opacity-30 dark:opacity-20" />

      {/* 2. Ambient Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,var(--desert-sand)_0%,transparent_70%)] opacity-25 dark:opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[700px] h-[700px] bg-[radial-gradient(circle,var(--siwa-earth)_0%,transparent_70%)] opacity-15 dark:opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle,var(--palm-shade)_0%,transparent_70%)] opacity-15 dark:opacity-10 blur-3xl pointer-events-none" />

      {/* 3. Authentic Siwan Berber Diamonds & Palm Motifs (Top Right & Left Corner Ornaments) */}
      <svg
        className="absolute top-16 -right-16 w-96 h-96 opacity-[0.06] dark:opacity-[0.09] text-[var(--siwa-earth)] transform rotate-12"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M100,10 L190,100 L100,190 L10,100 Z" />
        <path d="M100,30 L170,100 L100,170 L30,100 Z" strokeDasharray="4 4" />
        <path d="M100,50 L150,100 L100,150 L50,100 Z" />
        <circle cx="100" cy="100" r="20" />
        <line x1="100" y1="10" x2="100" y2="190" />
        <line x1="10" y1="100" x2="190" y2="100" />
      </svg>

      <svg
        className="absolute top-1/3 -left-20 w-[420px] h-[420px] opacity-[0.05] dark:opacity-[0.08] text-[var(--siwa-earth)] transform -rotate-12"
        viewBox="0 0 240 240"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Berber Chevron & Triangle Tapestry */}
        <polygon points="120,20 220,120 120,220 20,120" />
        <polygon points="120,50 190,120 120,190 50,120" strokeDasharray="5 5" />
        <polygon points="120,80 160,120 120,160 80,120" />
        <line x1="20" y1="20" x2="220" y2="220" />
        <line x1="220" y1="20" x2="20" y2="220" />
      </svg>

      <svg
        className="absolute bottom-40 right-4 w-80 h-80 opacity-[0.05] dark:opacity-[0.08] text-[var(--siwa-earth)]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z" strokeDasharray="6 6" />
        <path d="M100,40 L160,100 L100,160 L40,100 Z" />
        <circle cx="100" cy="100" r="15" />
      </svg>
    </div>
  );
}

export default function GlassShell({ title, subtitle, children, topRight }) {
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--palm-shade)]/30 selection:text-[var(--text-primary)] font-ar transition-colors duration-400">
      
      {/* ── Background Authentic Siwan Ornaments & Ambient Lighting ── */}
      <SiwaOrnamentsBackground />

      <div className="relative z-[2]">
        <header className="relative z-[10] border-b border-[var(--border-default)] bg-[var(--bg-card)]/80 backdrop-blur-xl">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] no-underline transition-all duration-300 hover:border-[var(--border-accent)] hover:shadow-sm"
                >
                  <Logo className="h-9 md:h-12 w-auto" />
                </Link>

                <Link
                  to="/shop"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] no-underline transition-all duration-300 hover:text-[var(--text-primary)] hover:border-[var(--border-accent)]"
                  aria-label="المتجر"
                >
                  <Compass className="w-4 h-4 text-[var(--siwa-earth)]" strokeWidth={1.8} />
                  <span className="font-ar text-[0.88rem] font-bold">المتجر</span>
                </Link>
              </div>

              <div className="flex items-center gap-2.5">
                {topRight}
                <ThemeToggle />
                <Link
                  to="/shop/cart"
                  className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--border-accent)] hover:shadow-sm active:scale-95"
                  aria-label="السلة"
                >
                  <ShoppingBasket className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -left-1 min-w-[19px] h-[19px] rounded-full bg-[var(--discount-badge)] text-[0.65rem] font-number text-white font-bold flex items-center justify-center px-1 shadow-md">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/shop/account"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--border-accent)] active:scale-95"
                  aria-label="الحساب"
                >
                  <UserCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <div className="mt-6 mb-2 text-right">
              <div className="flex flex-col items-start">
                <span className="inline-flex items-center gap-2 font-ar text-xs font-bold tracking-wider text-[var(--siwa-earth)] uppercase">
                  سحر سيوة · منتجات طبيعية أصيلة
                </span>
                <h1 className="mt-2 font-ar text-[clamp(1.8rem,4vw,2.8rem)] font-black text-[var(--text-primary)] leading-[1.2]">
                  {title}
                </h1>
                {subtitle ? <p className="mt-2 max-w-[65ch] text-[var(--text-secondary)] text-[0.95rem] font-normal">{subtitle}</p> : null}
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-[2]">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>

      {/* ── Footer ── */}
      <SiteFooter />
    </div>
  );
}
