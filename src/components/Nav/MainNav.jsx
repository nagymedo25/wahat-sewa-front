import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../images/Logo1.png';
import { gsap } from 'gsap';
import { Compass, LogIn, ShoppingBasket, UserCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';
import { useAuth } from '@/store/auth.jsx';
import NotificationBell from './NotificationBell.jsx';

const links = [
  { href: '#journey', label: 'الرحلة' },
  { href: '#products', label: 'المنتجات' },
  { href: '#philosophy', label: 'الفلسفة' },
  { href: '#contact', label: 'تواصل' },
];

// Random scatter directions for assembly animation
const scatterDirs = [
  { x: -120, y: -80, rotate: -15 },
  { x: 100, y: -60, rotate: 12 },
  { x: -80, y: 90, rotate: -8 },
  { x: 110, y: 70, rotate: 10 },
  { x: -60, y: -100, rotate: -20 },
  { x: 90, y: -90, rotate: 18 },
];

export default function MainNav({ isVisible, isScrolled, isNavHidden, isMobileMenuOpen, onToggleMobileMenu }) {
  const location = useLocation();
  const { items } = useCart();
  const { isAuthed, isAdmin } = useAuth();
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const linksRef = useRef(null);
  const overlayRef = useRef(null);
  const topLineRef = useRef(null);
  const midLineRef = useRef(null);
  const botLineRef = useRef(null);
  const decorLineRef = useRef(null);
  const decorLine2Ref = useRef(null);
  const dustRef = useRef(null);
  const closeBtnRef = useRef(null);
  const hasAssembled = useRef(false);
  const routeLinks = [
    { to: '/shop', label: 'المتجر', icon: Compass },
    isAuthed
      ? { to: isAdmin ? '/admin/dashboard' : '/shop/account', label: isAdmin ? 'لوحة الأدمن' : 'حسابي', icon: isAdmin ? ShieldCheck : UserCircle }
      : { to: '/auth/login', label: 'تسجيل الدخول', icon: LogIn },
  ];

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        onToggleMobileMenu();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMobileMenuOpen, onToggleMobileMenu]);

  // Navbar assembly animation — elements scatter from random directions
  useLayoutEffect(() => {
    if (!isVisible || hasAssembled.current) return;
    hasAssembled.current = true;

    const pieces = navRef.current?.querySelectorAll('.nav-piece');
    if (!pieces?.length) return;

    // Set initial scattered state
    pieces.forEach((el, i) => {
      const dir = scatterDirs[i % scatterDirs.length];
      gsap.set(el, {
        x: dir.x + (Math.random() - 0.5) * 60,
        y: dir.y + (Math.random() - 0.5) * 60,
        opacity: 0,
        rotate: dir.rotate + (Math.random() - 0.5) * 10,
        scale: 0.6,
      });
    });

    // Nav background fade
    gsap.fromTo(navRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });

    // Assemble pieces one by one
    const tl = gsap.timeline({ delay: 0.2 });
    pieces.forEach((el, i) => {
      tl.to(el, {
        x: 0,
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      }, i * 0.1);
    });
  }, [isVisible]);

  // GSAP cinematic burger morph + full-screen menu reveal
  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });

    if (isMobileMenuOpen) {
      // OPEN: morph hamburger to X with elastic snap
      tl.to(topLineRef.current, { rotate: 45, y: 7, duration: 0.45, ease: 'back.in(1.7)' }, 0);
      tl.to(midLineRef.current, { scaleX: 0, opacity: 0, duration: 0.25 }, 0);
      tl.to(botLineRef.current, { rotate: -45, y: -7, duration: 0.45, ease: 'back.in(1.7)' }, 0);

      // Overlay cinematic fade
      tl.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.6 }, 0);

      // Full-screen menu reveal
      tl.fromTo(
        menuRef.current,
        { opacity: 0, scale: 1.05, pointerEvents: 'none' },
        { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.7, ease: 'power3.out' },
        0.05
      );

      // Close button fade in
      tl.fromTo(closeBtnRef.current, { opacity: 0, scale: 0.5, rotate: -90 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.7)' }, 0.15);

      // Decorative lines draw in
      tl.fromTo(decorLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0.2);
      tl.fromTo(decorLine2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0.35);

      // Links 3D cinematic staggered reveal
      const linkEls = linksRef.current?.querySelectorAll('.mobile-link');
      if (linkEls?.length) {
        tl.fromTo(
          linkEls,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
          0.3
        );
      }

      // Dust particles fade in
      const dustEls = dustRef.current?.querySelectorAll('.dust-particle');
      if (dustEls?.length) {
        tl.fromTo(dustEls, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05 }, 0.5);
      }
    } else {
      // CLOSE: reverse with cinematic power
      const linkEls = linksRef.current?.querySelectorAll('.mobile-link');
      if (linkEls?.length) {
        tl.to(linkEls, { y: -40, opacity: 0, duration: 0.3, stagger: 0.04, ease: 'power2.in' }, 0);
      }

      tl.to(closeBtnRef.current, { opacity: 0, scale: 0.5, rotate: 90, duration: 0.3, ease: 'power2.in' }, 0);

      tl.to(decorLineRef.current, { scaleX: 0, duration: 0.4 }, 0.1);
      tl.to(decorLine2Ref.current, { scaleX: 0, duration: 0.4 }, 0.15);

      tl.to(menuRef.current, { opacity: 0, scale: 1.03, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' }, 0.15);
      tl.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, 0.2);

      // Morph back to hamburger
      tl.to(topLineRef.current, { rotate: 0, y: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0.25);
      tl.to(midLineRef.current, { scaleX: 1, opacity: 1, duration: 0.3 }, 0.3);
      tl.to(botLineRef.current, { rotate: 0, y: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0.25);
    }

    return () => {
      tl.kill();
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={
          'fixed top-0 left-0 right-0 z-[100] py-2 px-14 transition-[background-color,border-color,padding,transform] duration-[500ms] [transition-timing-function:var(--ease-cinematic)] opacity-0 ' +
          (isScrolled
            ? 'bg-[rgba(26,24,20,0.88)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] py-1.5 border-b border-[rgba(212,197,169,0.06)] '
            : '') +
          (isNavHidden ? '-translate-y-full ' : 'translate-y-0 ') +
          'max-md:px-5 max-md:py-2'
        }
        id="mainNav"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Logo — nav-piece for assembly animation */}
          <a href="#" className="nav-piece no-underline flex items-center group">
            <img
              src={logoImg}
              alt="واحة سيوة"
              className="h-[64px] scale-150 w-auto object-contain [filter:brightness(1.1)_drop-shadow(0_2px_10px_rgba(0,0,0,0.35))] transition-transform duration-[400ms] [transition-timing-function:var(--ease-cinematic)] group-hover:scale-[1.05] max-md:h-[52px]"
            />
          </a>

          {/* Desktop Links — each is a nav-piece */}
          <div className="flex gap-12 items-center max-md:hidden">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-piece group relative no-underline font-ar text-[1.05rem] font-medium text-sand-light transition-colors duration-300 overflow-hidden hover:text-cream"
              >
                {l.label}
                <span className="absolute bottom-[-4px] right-0 w-0 h-[1.5px] bg-olive-glow transition-[width] duration-[400ms] [transition-timing-function:var(--ease-cinematic)] group-hover:w-full" />
              </a>
            ))}

            {/* Notification Bell */}
            {isAuthed && <NotificationBell />}

            <div className="w-px h-6 bg-[rgba(212,197,169,0.12)] nav-piece" />

            {routeLinks.map((l) => {
              const isActive = location.pathname === l.to;
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    'nav-piece group relative no-underline font-ar text-[1.05rem] font-medium transition-colors duration-300 overflow-hidden inline-flex items-center gap-1.5 ' +
                    (isActive ? 'text-cream ' : 'text-sand-light hover:text-cream ')
                  }
                >
                  <Icon className="w-[16px] h-[16px] opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  {l.label}
                  <span className="absolute bottom-[-4px] right-0 w-0 h-[1.5px] bg-olive-glow transition-[width] duration-[400ms] [transition-timing-function:var(--ease-cinematic)] group-hover:w-full" />
                </Link>
              );
            })}

            {/* Cart Quick Link */}
            <Link
              to="/shop/cart"
              className="nav-piece relative inline-flex items-center gap-1.5 no-underline font-ar text-[1.05rem] font-medium text-sand-light hover:text-cream transition-colors duration-300"
            >
              <ShoppingBasket className="w-[16px] h-[16px] opacity-70" strokeWidth={1.5} />
              السلة
              {items.length > 0 && (
                <span className="relative -top-1 -left-0.5 min-w-[16px] h-[16px] rounded-full bg-sunset text-[0.55rem] font-number text-cream flex items-center justify-center px-1 shadow-md">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {/* Burger Button — nav-piece */}
          <button
            type="button"
            aria-label="Menu"
            onClick={onToggleMobileMenu}
            className="nav-piece hidden max-md:flex relative w-[56px] h-[56px] rounded-full items-center justify-center bg-[rgba(26,24,20,0.55)] border border-[rgba(212,197,169,0.12)] cursor-pointer transition-all duration-500 hover:border-[rgba(164,184,107,0.4)] hover:bg-[rgba(74,90,42,0.2)] hover:shadow-[0_0_30px_rgba(164,184,107,0.15)] active:scale-95"
          >
            <div className="relative w-[24px] h-[16px] flex flex-col justify-between">
              <span ref={topLineRef} className="block w-full h-[2px] bg-sand origin-center" />
              <span ref={midLineRef} className="block w-full h-[2px] bg-sand origin-center" />
              <span ref={botLineRef} className="block w-full h-[2px] bg-sand origin-center" />
            </div>
          </button>
        </div>
      </nav>

      {/* Cinematic Full-screen Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[99] bg-[rgba(8,7,5,0.92)] [backdrop-filter:blur(16px)] opacity-0 pointer-events-none md:hidden"
        onClick={() => onToggleMobileMenu()}
      />

      {/* Cinematic Full-screen Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[100] flex flex-col justify-center items-center opacity-0 pointer-events-none md:hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(74,90,42,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,7,0.97)_0%,rgba(18,16,12,0.98)_50%,rgba(10,9,7,0.97)_100%)]" />

        {/* Close X Button — always visible inside menu */}
        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close"
          onClick={onToggleMobileMenu}
          className="absolute top-6 left-6 z-[10] w-[48px] h-[48px] rounded-full flex items-center justify-center bg-[rgba(26,24,20,0.6)] border border-[rgba(212,197,169,0.15)] cursor-pointer transition-all duration-300 hover:border-[rgba(164,184,107,0.5)] hover:bg-[rgba(74,90,42,0.25)] hover:shadow-[0_0_20px_rgba(164,184,107,0.15)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="stroke-sand stroke-[1.5]">
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="15" y1="3" x2="3" y2="15" />
          </svg>
        </button>

        {/* Decorative animated line top */}
        <div
          ref={decorLineRef}
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[120px] h-px bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] opacity-40 origin-center"
        />
        <div
          ref={decorLine2Ref}
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[80px] h-px bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] opacity-30 origin-center"
        />

        {/* Dust particles */}
        <div ref={dustRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((__, i) => (
            <span
              key={i}
              className="dust-particle absolute w-[2px] h-[2px] rounded-full bg-sand opacity-0"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `dustFloat ${4 + Math.random() * 6}s ease-in-out infinite ${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Menu header */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-center gap-4 px-8">
          <div className="w-8 h-px bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] opacity-30" />
          <span className="font-en text-[0.7rem] tracking-[0.4em] text-olive-glow opacity-40 uppercase">
            Navigation
          </span>
          <div className="w-8 h-px bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] opacity-30" />
        </div>

        {/* Mobile Links — AWWARDS-level cinematic */}
        <div
          ref={linksRef}
          className="relative flex flex-col items-center gap-3 [perspective:1000px] w-full px-8"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => onToggleMobileMenu()}
              className="mobile-link group relative flex flex-col items-center py-3 no-underline transition-all duration-300"
            >
              <span className="font-ar text-[clamp(1.35rem,6vw,2.1rem)] font-semibold text-sand-light transition-colors duration-300 group-hover:text-cream">
                {l.label}
              </span>
              <span className="mt-2 w-0 h-[1px] bg-olive-glow transition-[width] duration-[350ms] [transition-timing-function:var(--ease-cinematic)] group-hover:w-12 opacity-40" />
            </a>
          ))}

          {routeLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => onToggleMobileMenu()}
                className="mobile-link group relative flex flex-col items-center py-3 no-underline transition-all duration-300"
              >
                <span className="font-ar text-[clamp(1.35rem,6vw,2.1rem)] font-semibold text-sand-light transition-colors duration-300 group-hover:text-cream inline-flex items-center gap-2">
                  <Icon className="w-5 h-5 opacity-50" strokeWidth={1.5} />
                  {l.label}
                </span>
                <span className="mt-2 w-0 h-[1px] bg-olive-glow transition-[width] duration-[350ms] [transition-timing-function:var(--ease-cinematic)] group-hover:w-12 opacity-40" />
              </Link>
            );
          })}
          <Link
            to="/shop/cart"
            onClick={() => onToggleMobileMenu()}
            className="mobile-link group relative flex flex-col items-center py-3 no-underline transition-all duration-300"
          >
            <span className="font-ar text-[clamp(1.35rem,6vw,2.1rem)] font-semibold text-sand-light transition-colors duration-300 group-hover:text-cream inline-flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 opacity-50" strokeWidth={1.5} />
              السلة
              {items.length > 0 && (
                <span className="min-w-[20px] h-[20px] rounded-full bg-sunset text-[0.65rem] font-number text-cream flex items-center justify-center px-1">
                  {items.length}
                </span>
              )}
            </span>
            <span className="mt-2 w-0 h-[1px] bg-olive-glow transition-[width] duration-[350ms] [transition-timing-function:var(--ease-cinematic)] group-hover:w-12 opacity-40" />
          </Link>
        </div>

        {/* Bottom quote */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
          <div className="w-12 h-px bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] opacity-30" />
          <p className="font-ar text-[0.85rem] text-sand opacity-25 tracking-[0.1em]">
            من قلب الصحراء إلى قلبك
          </p>
        </div>
      </div>

      <style>{`
        @keyframes dustFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
