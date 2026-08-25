import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo.jsx';
import { Compass, LogIn, ShoppingBasket, UserCircle, ShieldCheck, Menu, X } from 'lucide-react';
import { useCart } from '@/store/cart.jsx';
import { useAuth } from '@/store/auth.jsx';
import NotificationBell from './NotificationBell.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext.jsx';

const sectionLinks = [
  { href: '#categories', labelKey: 'nav.categories', defaultLabel: 'الأقسام' },
  { href: '#featured', labelKey: 'nav.featured', defaultLabel: 'المميزة' },
  { href: '#deals', labelKey: 'nav.deals', defaultLabel: 'العروض' },
  { href: '#philosophy', labelKey: 'nav.philosophy', defaultLabel: 'عن سيوة' },
];

export default function MainNav({ isVisible, isScrolled, isNavHidden, isMobileMenuOpen, onToggleMobileMenu }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const { items } = useCart();
  const { isAuthed, isAdmin } = useAuth();
  const navRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const isHomePage = location.pathname === '/';

  const routeLinks = [
    { to: '/shop', labelKey: 'nav.shop', defaultLabel: 'المتجر', icon: Compass },
    isAuthed
      ? { to: isAdmin ? '/admin/dashboard' : '/shop/account', labelKey: isAdmin ? 'nav.admin' : 'nav.account', defaultLabel: isAdmin ? 'لوحة التحكم' : 'حسابي', icon: isAdmin ? ShieldCheck : UserCircle }
      : { to: '/auth/login', labelKey: 'nav.login', defaultLabel: 'دخول', icon: LogIn },
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

  // Fade in on mount
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Only show section links on homepage
  const navLinks = isHomePage ? sectionLinks : [];

  return (
    <>
      {/* ═══ Floating Capsule Navbar ═══ */}
      <nav
        ref={navRef}
        className={
          'fixed z-[60] transition-all duration-500 ease-cinematic ' +
          // Horizontal positioning: centered with side margins
          'left-4 right-4 md:left-8 md:right-8 lg:left-[6%] lg:right-[6%] xl:left-[10%] xl:right-[10%] ' +
          // Top position shifts based on scroll with plenty of breathing room under announcement bar
          (isScrolled ? 'top-3 md:top-4 ' : 'top-14 md:top-16 ') +
          // Visibility
          (isNavHidden && !isMobileMenuOpen ? '-translate-y-[130%] ' : 'translate-y-0 ') +
          // Opacity on mount
          (mounted ? 'opacity-100 ' : 'opacity-0 ')
        }
        id="mainNav"
      >
        <div
          className={
            'mx-auto flex items-center justify-between rounded-full px-5 md:px-7 transition-all duration-500 ease-cinematic ' +
            // Padding changes on scroll
            (isScrolled ? 'py-2 ' : 'py-2.5 md:py-3.5 ') +
            // Glass background
            'backdrop-blur-2xl border ' +
            (isScrolled
              ? 'bg-[var(--nav-bg-scrolled)] border-[var(--nav-border-scrolled)] shadow-[var(--shadow-lg)] '
              : 'bg-[var(--nav-bg)] border-[var(--nav-border)] shadow-[var(--shadow-md)] ')
          }
        >
          {/* ── Logo ── */}
          <Link to="/" className="no-underline flex items-center gap-2 group shrink-0 py-0.5">
            <div className="text-[var(--text-primary)] transition-transform duration-300 group-hover:scale-105">
              <Logo className={isScrolled ? 'h-10 md:h-12 lg:h-14 w-auto' : 'h-12 sm:h-14 md:h-16 lg:h-20 w-auto'} />
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Section Links (homepage only) */}
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={
                  'group relative no-underline font-ar text-[0.92rem] font-bold px-3.5 py-1.5 rounded-full ' +
                  'transition-all duration-300 ' +
                  'text-[var(--nav-text-muted)] hover:text-[var(--nav-text)] hover:bg-[var(--border-subtle)]'
                }
              >
                {t(l.labelKey, l.defaultLabel)}
                <span className="absolute bottom-0 right-3 left-3 h-[1.5px] bg-[var(--action-primary)] rounded-full scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}

            {/* Separator */}
            {navLinks.length > 0 && (
              <div className="w-px h-5 bg-[var(--border-default)] mx-1" />
            )}

            {/* Route Links */}
            {routeLinks.map((l) => {
              const isActive = location.pathname === l.to || location.pathname.startsWith(l.to + '/');
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    'group relative no-underline font-ar text-[0.92rem] font-bold px-3.5 py-1.5 rounded-full ' +
                    'transition-all duration-300 inline-flex items-center gap-1.5 ' +
                    (isActive
                      ? 'text-[var(--nav-text)] bg-[var(--border-subtle)] '
                      : 'text-[var(--nav-text-muted)] hover:text-[var(--nav-text)] hover:bg-[var(--border-subtle)]')
                  }
                >
                  <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.8} />
                  {t(l.labelKey, l.defaultLabel)}
                </Link>
              );
            })}

            {/* Cart */}
            <Link
              to="/shop/cart"
              className="relative inline-flex items-center gap-1.5 no-underline font-ar text-[0.92rem] font-bold px-3.5 py-1.5 rounded-full text-[var(--nav-text-muted)] hover:text-[var(--nav-text)] hover:bg-[var(--border-subtle)] transition-all duration-300"
            >
              <ShoppingBasket className="w-4 h-4 opacity-70" strokeWidth={1.8} />
              {t('nav.cart', 'السلة')}
              {items.length > 0 && (
                <span className="min-w-[18px] h-[18px] rounded-full bg-[var(--discount-badge)] text-[0.6rem] font-number text-white flex items-center justify-center px-1 shadow-sm">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Separator */}
            <div className="w-px h-5 bg-[var(--border-default)] mx-1" />

            {/* Utility actions */}
            {isAuthed && <NotificationBell />}
            <ThemeToggle />
          </div>

          {/* ── Mobile Actions ── */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            {/* Cart icon mobile */}
            <Link
              to="/shop/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--nav-text-muted)] hover:text-[var(--nav-text)] transition-all duration-300"
            >
              <ShoppingBasket className="w-4 h-4" strokeWidth={1.5} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[var(--discount-badge)] text-[0.55rem] font-number text-white flex items-center justify-center px-0.5">
                  {items.length}
                </span>
              )}
            </Link>
            {/* Burger */}
            <button
              type="button"
              aria-label="القائمة"
              onClick={onToggleMobileMenu}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--nav-text)] cursor-pointer hover:border-[var(--border-accent)] transition-all duration-300 active:scale-95"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" strokeWidth={1.8} />
              ) : (
                <Menu className="w-4 h-4" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ Mobile Menu Overlay ═══ */}
      <div
        className={
          'fixed inset-0 z-[99] md:hidden transition-all duration-500 ' +
          (isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none')
        }
        style={{ background: 'var(--bg-overlay)' }}
        onClick={() => onToggleMobileMenu()}
      />

      {/* ═══ Mobile Menu Panel ═══ */}
      <div
        className={
          'fixed inset-0 z-[100] flex flex-col justify-center items-center md:hidden transition-all duration-500 ease-cinematic ' +
          (isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-[1.02]')
        }
        style={{ background: 'var(--bg-primary)' }}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="إغلاق"
          onClick={onToggleMobileMenu}
          className="absolute top-6 left-6 z-10 w-11 h-11 rounded-full flex items-center justify-center border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] cursor-pointer hover:border-[var(--border-accent)] transition-all duration-300"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Menu header */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />
          <span className="font-en text-[0.65rem] tracking-[0.4em] text-[var(--text-muted)] uppercase">
            Navigation
          </span>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col items-center gap-2 w-full px-8">
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => onToggleMobileMenu()}
              className="group flex flex-col items-center py-3 no-underline transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="font-ar text-[clamp(1.3rem,5vw,1.8rem)] font-bold text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--action-primary)]">
                {t(l.labelKey, l.defaultLabel)}
              </span>
              <span className="mt-1.5 w-0 h-[1px] bg-[var(--action-primary)] transition-[width] duration-300 group-hover:w-10 opacity-50" />
            </a>
          ))}

          {routeLinks.map((l, i) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => onToggleMobileMenu()}
                className="group flex flex-col items-center py-3 no-underline transition-all duration-300"
              >
                <span className="font-ar text-[clamp(1.3rem,5vw,1.8rem)] font-bold text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--action-primary)] inline-flex items-center gap-2">
                  <Icon className="w-5 h-5 opacity-50" strokeWidth={1.8} />
                  {t(l.labelKey, l.defaultLabel)}
                </span>
                <span className="mt-1.5 w-0 h-[1px] bg-[var(--action-primary)] transition-[width] duration-300 group-hover:w-10 opacity-50" />
              </Link>
            );
          })}

          <Link
            to="/shop/cart"
            onClick={() => onToggleMobileMenu()}
            className="group flex flex-col items-center py-3 no-underline transition-all duration-300"
          >
            <span className="font-ar text-[clamp(1.3rem,5vw,1.8rem)] font-semibold text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--action-primary)] inline-flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 opacity-40" strokeWidth={1.5} />
              {t('nav.cart', 'السلة')}
              {items.length > 0 && (
                <span className="min-w-[20px] h-[20px] rounded-full bg-[var(--discount-badge)] text-[0.65rem] font-number text-white flex items-center justify-center px-1">
                  {items.length}
                </span>
              )}
            </span>
            <span className="mt-1.5 w-0 h-[1px] bg-[var(--action-primary)] transition-[width] duration-300 group-hover:w-10 opacity-50" />
          </Link>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--border-accent)] to-transparent" />
          <p className="font-ar text-[0.8rem] text-[var(--text-muted)] tracking-[0.08em]">
            من قلب الصحراء إلى قلبك
          </p>
        </div>
      </div>
    </>
  );
}
