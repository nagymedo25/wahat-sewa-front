import { Link } from 'react-router-dom';
import Logo from '@/components/Logo.jsx';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext.jsx';

export default function SiteFooter() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer className="relative bg-[var(--footer-bg)] text-[var(--footer-text)] overflow-hidden" id="footer">
      {/* ── Top Curve / Transition ── */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full text-[var(--footer-bg)] fill-current">
          <path d="M0,0 C480,64 960,64 1440,0 L1440,64 L0,64 Z" />
        </svg>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-right">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start text-right space-y-4">
            <Link to="/" className="inline-block group py-1">
              <div className="text-[var(--siwa-salt)] group-hover:text-white transition-colors">
                <Logo className="h-16 md:h-20 w-auto" />
              </div>
            </Link>
            <p className="font-ar text-sm text-[var(--footer-muted)] max-w-sm leading-relaxed">
              {t('footer.slogan', 'من قلب الصحراء... إلى قلبك. منتجات طبيعية نقية 100% مستخلصة ومصنوعة بأيدي أهل واحة سيوة الكرام.')}
            </p>
          </div>

          {/* Quick Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Col 1 */}
            <div className="space-y-3">
              <h4 className="font-ar text-sm font-bold text-[var(--siwa-salt)] uppercase tracking-wider">
                {t('footer.explore', 'استكشف')}
              </h4>
              <ul className="space-y-2 font-ar text-xs text-[var(--footer-muted)]">
                <li>
                  <Link to="/shop" className="hover:text-[var(--siwa-salt)] transition-colors">
                    جميع المنتجات
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=dates" className="hover:text-[var(--siwa-salt)] transition-colors">
                    التمور الفاخرة
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=oils" className="hover:text-[var(--siwa-salt)] transition-colors">
                    الزيوت الطبيعية
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=herbs" className="hover:text-[var(--siwa-salt)] transition-colors">
                    الأعشاب السيوية
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="font-ar text-sm font-bold text-[var(--siwa-salt)] uppercase tracking-wider">
                {t('footer.contact', 'روابط مهمة')}
              </h4>
              <ul className="space-y-2 font-ar text-xs text-[var(--footer-muted)]">
                <li>
                  <Link to="/shop/cart" className="hover:text-[var(--siwa-salt)] transition-colors">
                    سلة المشتريات
                  </Link>
                </li>
                <li>
                  <Link to="/shop/account" className="hover:text-[var(--siwa-salt)] transition-colors">
                    حسابي والطلبات
                  </Link>
                </li>
                <li>
                  <a href="#deals" className="hover:text-[var(--siwa-salt)] transition-colors">
                    العروض الخاصة
                  </a>
                </li>
                <li>
                  <a href="#philosophy" className="hover:text-[var(--siwa-salt)] transition-colors">
                    عن سحر سيوة
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="font-ar text-sm font-bold text-[var(--siwa-salt)] uppercase tracking-wider">
                {t('footer.follow', 'تواصل معنا')}
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(220,199,161,0.2)] bg-[rgba(255,255,255,0.05)] text-[var(--desert-sand)] hover:text-white hover:border-[var(--siwa-earth)] hover:bg-[var(--siwa-earth)]/30 transition-all"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(220,199,161,0.2)] bg-[rgba(255,255,255,0.05)] text-[var(--desert-sand)] hover:text-white hover:border-[var(--siwa-earth)] hover:bg-[var(--siwa-earth)]/30 transition-all"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(220,199,161,0.2)] bg-[rgba(255,255,255,0.05)] text-[var(--desert-sand)] hover:text-white hover:border-[var(--palm-shade)] hover:bg-[var(--palm-shade)]/30 transition-all"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer Bottom Bar ── */}
        <div className="mt-16 pt-8 border-t border-[rgba(220,199,161,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <p className="font-['Aref_Ruqaa',serif] text-sm text-[var(--desert-sand)] opacity-80">
            {t('footer.quote', '«كل شيء ينمو من الأرض، يحمل روحها في طياته»')}
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--footer-muted)]">
            <span>{t('footer.copyright', 'سحر سيوة © 2025')}</span>
            <span>•</span>
            <span>{t('footer.made_by', 'صُنع بأيدٍ سيوية أصيلة')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
