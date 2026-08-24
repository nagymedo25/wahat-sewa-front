import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import heroBg1 from '../images/hero-bg1.png';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-36 sm:pt-44 md:pt-48 pb-20 px-6 md:px-12 lg:px-16" id="hero">
      {/* ── Background Imagery & Atmospheric Gradients ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 dark:opacity-25 filter blur-[1px] transform scale-105"
          style={{ backgroundImage: `url(${heroBg1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[var(--bg-primary)]/70 to-[var(--bg-primary)]" />
        
        {/* Subtle decorative circles with brand palette */}
        <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-[var(--desert-sand)]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[var(--siwa-earth)]/10 blur-3xl" />
      </div>

      {/* ── Hero Main Content ── */}
      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center text-center">
        
        {/* Sub-badge / Heritage tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-accent)] shadow-sm mb-6 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[var(--siwa-earth)]" />
          <span className="font-ar text-xs md:text-sm font-semibold text-[var(--text-accent)]">
            أصالة الواحة المصرية الطبيعية
          </span>
        </div>

        {/* Main Brand Headline */}
        <h1 className="font-ar text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[var(--text-primary)] leading-[1.15] tracking-tight mb-6 max-w-4xl animate-fadeInUp">
          من قلب <span className="text-[var(--siwa-earth)] relative inline-block">
            سيوة
            <svg className="absolute -bottom-2 right-0 w-full h-3 text-[var(--desert-sand)] opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span> إلى قلب بيتك
        </h1>

        {/* Subtitle / Description */}
        <p className="font-ar text-base sm:text-lg md:text-xl font-normal text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10">
          تمور فاخرة، زيوت نقية عصرة أولى، وأعشاب طبيعية نادرة جُمعت بعناية من بساتين واحة سيوة لتصل إليك بطاقتها ونقائها الأصيل.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--action-primary)] text-[var(--action-primary-text)] font-ar text-base font-bold shadow-[var(--shadow-md)] hover:bg-[var(--action-primary-hover)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group"
          >
            <span>تسوق المنتجات الآن</span>
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>

          <a
            href="#categories"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] font-ar text-base font-medium hover:border-[var(--border-accent)] hover:bg-[var(--bg-card-hover)] transition-all duration-300"
          >
            <span>استكشف الأقسام</span>
          </a>
        </div>

        {/* Trust Badges Ribbon */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[var(--bg-card)]/60 border border-[var(--border-subtle)]">
            <Award className="w-5 h-5 text-[var(--palm-shade)] shrink-0" />
            <div className="text-right">
              <h4 className="font-ar text-xs font-bold text-[var(--text-primary)]">100% طبيعي ونقي</h4>
              <p className="font-ar text-[0.7rem] text-[var(--text-tertiary)]">بدون إضافات أو مواد حافظة</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[var(--bg-card)]/60 border border-[var(--border-subtle)]">
            <ShieldCheck className="w-5 h-5 text-[var(--siwa-earth)] shrink-0" />
            <div className="text-right">
              <h4 className="font-ar text-xs font-bold text-[var(--text-primary)]">ضمان الجودة والأصالة</h4>
              <p className="font-ar text-[0.7rem] text-[var(--text-tertiary)]">منتجات من مزارع سيوة مباشرة</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[var(--bg-card)]/60 border border-[var(--border-subtle)]">
            <Truck className="w-5 h-5 text-[var(--palm-shade)] shrink-0" />
            <div className="text-right">
              <h4 className="font-ar text-xs font-bold text-[var(--text-primary)]">شحن آمن لجميع المحافظات</h4>
              <p className="font-ar text-[0.7rem] text-[var(--text-tertiary)]">توصيل سريع حتى باب المنزل</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
