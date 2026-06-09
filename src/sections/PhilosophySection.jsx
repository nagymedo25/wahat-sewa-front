import { useEffect, useRef, useState } from 'react';
import heroBg2 from '../images/hero-bg2.png';
import useScrollReveal from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function PhilosophySection() {
  const { t } = useTranslation();
  const sectionRef = useScrollReveal({ selector: '.philosophy-content, .philosophy-image-side', stagger: 0.25, y: 50 });

  return (
    <section ref={sectionRef} className="section philosophy relative min-h-screen flex items-center overflow-hidden" id="philosophy">
      <div className="philosophy-visual absolute right-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.15] max-md:hidden">
        <div className="absolute inset-[10%] rounded-full border border-olive-glow animate-circleSpin" />
        <div className="absolute inset-0 rounded-full border border-[rgba(164,184,107,0.2)] [animation:circleSpin_80s_linear_infinite_reverse]" />
        <div className="absolute inset-[15%] rounded-full border border-[rgba(164,184,107,0.2)] [animation:circleSpin_100s_linear_infinite]" />
        <div className="absolute inset-[30%] rounded-full border border-[rgba(164,184,107,0.2)] [animation:circleSpin_120s_linear_infinite_reverse]" />
      </div>

      <div className="section-inner w-full max-w-[1400px] mx-auto px-12 relative z-[5] max-md:px-6">
        <div className="philosophy-grid grid grid-cols-2 gap-20 items-center relative z-[2] max-md:grid-cols-1 max-md:gap-12 max-md:text-center">
          <div className="philosophy-content max-w-[560px] max-md:max-w-none max-md:mx-auto">
            <span className="inline-flex items-center gap-3 font-ar text-[0.75rem] font-medium text-olive-glow tracking-[0.15em] uppercase mb-6 before:content-[''] before:block before:w-[30px] before:h-px before:bg-olive-glow before:opacity-50">
              {t('philosophy.label', 'الفلسفة')}
            </span>
            <h2 className="font-ar text-[clamp(2.5rem,6vw,5rem)] font-extralight text-cream leading-[1.15] tracking-[-0.02em]">
              {t('philosophy.title_part1', 'نحن لا نبيع')}
              <br />
              {t('philosophy.title_part2', 'منتجات')}
            </h2>
            <p className="relative text-[1.05rem] font-light text-sand leading-[2.2] my-8 mb-12 after:content-[''] after:absolute after:bottom-[-1rem] after:right-0 after:w-[60px] after:h-px after:bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] after:opacity-50 max-md:after:right-1/2 max-md:after:translate-x-1/2">
              {t('philosophy.desc', 'نحن نروي قصة أرض عاشت فيها الحضارات، ونحمل إليكم قطعة من سحر الواحة. كل منتج يصنع بأيدي أهل سيوة، بأسلوب تراثي نقي، بعيداً عن المصانع والآلات. نؤمن أن الأصالة لا تُصنع، بل تُورث.')}
            </p>

            <div className="philosophy-stats relative flex gap-10 mt-12 before:content-[''] before:absolute before:top-[-1.5rem] before:right-0 before:left-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(164,184,107,0.15),transparent)] max-md:justify-center">
              <StatItem count={1200} label={t('philosophy.stat1', 'عام من التراث')} />
              <StatItem count={100} label={t('philosophy.stat2', '% طبيعي')} />
              <StatItem count={50} label={t('philosophy.stat3', 'عائلة منتجة')} />
            </div>
          </div>

          <div className="philosophy-image-side relative flex flex-col items-center max-md:order-[-1]">
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-2xl overflow-hidden max-md:max-w-[320px]">
              <img
                src={heroBg2}
                alt="سيوة - من قلب الصحراء"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover block [filter:brightness(0.85)_contrast(1.1)_saturate(0.9)] transition-[transform,filter] duration-[800ms] [transition-timing-function:var(--ease-cinematic)] hover:scale-[1.05] hover:[filter:brightness(0.9)_contrast(1.15)_saturate(1)]"
              />
              <div className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_bottom,rgba(26,24,20,0.1)_0%,rgba(26,24,20,0.3)_60%,rgba(26,24,20,0.7)_100%)]" />
              <div className="absolute inset-2 pointer-events-none z-[2] border border-[rgba(164,184,107,0.12)] rounded-[12px]" />
            </div>
            <p className="font-['Aref_Ruqaa',var(--font-ar),serif] text-[0.85rem] font-normal text-olive-glow opacity-60 mt-4 text-center tracking-[0.1em] italic">
              {t('philosophy.caption', 'من قلب الصحراء... ولدت الحياة')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ count, label }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasAnimated = false;

    const animate = () => {
      const duration = 2000;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * count);
        setValue(current);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animate();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  return (
    <div className="stat-item text-center relative py-6 px-4 bg-[rgba(26,24,20,0.3)] border border-[rgba(164,184,107,0.08)] rounded-xl transition-all duration-500 [transition-timing-function:var(--ease-cinematic)] [backdrop-filter:blur(4px)] hover:border-[rgba(164,184,107,0.2)] hover:bg-[rgba(74,90,42,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <span
        ref={ref}
        className="block font-['Aref_Ruqaa',var(--font-ar),serif] text-[2.8rem] font-bold text-cream leading-none mb-2 [text-shadow:0_0_30px_rgba(212,197,169,0.15)] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-[30px] after:h-[2px] after:bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] after:opacity-40"
      >
        {value.toLocaleString('ar-EG')}
      </span>
      <span className="font-ar text-[0.8rem] font-normal text-sand-warm tracking-[0.05em]">{label}</span>
    </div>
  );
}
