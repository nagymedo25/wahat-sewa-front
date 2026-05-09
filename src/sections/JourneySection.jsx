import useScrollReveal from '../hooks/useScrollReveal';

export default function JourneySection() {
  const sectionRef = useScrollReveal({ selector: '.journey-header, .timeline-item', stagger: 0.2, y: 50 });

  return (
    <section
      ref={sectionRef}
      className="section journey relative min-h-[150vh] flex items-center overflow-hidden bg-[linear-gradient(180deg,var(--shadow)_0%,rgba(45,52,24,0.3)_50%,var(--shadow)_100%)]"
      id="journey"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(74,90,42,0.1)_0%,transparent_70%)]" />
      <div className="section-inner w-full max-w-[1400px] mx-auto px-12 relative z-[5] max-md:px-6">
        <div className="journey-header text-center mb-20 pt-32">
          <span className="inline-flex items-center gap-3 font-ar text-[0.75rem] font-medium text-olive-glow tracking-[0.15em] uppercase mb-6 before:content-[''] before:block before:w-[30px] before:h-px before:bg-olive-glow before:opacity-50">
            الرحلة
          </span>
          <h2 className="font-ar text-[clamp(2.5rem,6vw,5rem)] font-extralight text-cream leading-[1.15] tracking-[-0.02em]">
            في كل قطرة
            <br />
            حكاية
          </h2>
        </div>

        <div className="journey-timeline relative max-w-[800px] mx-auto py-8">
          <div className="timeline-line absolute right-1/2 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--olive-glow)_20%,var(--olive-glow)_80%,transparent_100%)] opacity-30 max-md:hidden" />

          <TimelineItem index={0} number="01" title="نخيل سيوة">
            أشجار النخيل العريقة التي تحمل في طياتها آلاف السنين من العطاء، تنمو في تربة الواحة الخصبة وتعطي أجود التمور في العالم.
          </TimelineItem>
          <TimelineItem index={1} number="02" title="الزيتون البري">
            أشجار الزيتون التي تعمر لأكثر من ألف عام، تنتج زيتاً نقياً كالذهب السائل، مليئاً بنكهة التاريخ وعبق الأرض.
          </TimelineItem>
          <TimelineItem index={2} number="03" title="العطارة السيوية">
            أعشاب طبيعية نادرة تنمو في بساتين الواحة، تجمع بأيدي حرفيات يحملن سر الطبيعة من جيل إلى جيل.
          </TimelineItem>
          <TimelineItem index={3} number="04" title="النقاء الأبدي">
            من مياه الينابيع العذبة إلى تربة الصحراء النقية، كل منتج يحمل روح سيوة الأصيلة ونقاء طبيعتها الفريد.
          </TimelineItem>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ index, number, title, children }) {
  const isOdd = index % 2 === 0;

  return (
    <div
      className={
        'timeline-item relative flex items-start gap-8 mb-16 px-8 max-md:flex-col max-md:text-center max-md:items-center max-md:!flex-col max-md:!text-center ' +
        (isOdd ? 'flex-row-reverse text-left' : 'text-right')
      }
      data-reveal
    >
      <div className="timeline-dot shrink-0 w-3 h-3 rounded-full bg-olive-glow border-2 border-shadow shadow-[0_0_20px_rgba(164,184,107,0.3)] mt-2 relative max-md:mt-0 max-md:mb-4 max-md:mx-auto after:content-[''] after:absolute after:inset-[-8px] after:rounded-full after:border after:border-olive-glow after:opacity-30 after:animate-dotPulse" />
      <div className="timeline-content flex-1 p-6 px-8 bg-[rgba(26,24,20,0.4)] border border-[rgba(212,197,169,0.05)] rounded-lg [backdrop-filter:blur(10px)] transition-all duration-500 [transition-timing-function:var(--ease-cinematic)] hover:border-[rgba(164,184,107,0.15)] hover:bg-[rgba(26,24,20,0.5)] hover:-translate-y-[3px]">
        <span className="block font-en text-[0.75rem] font-light text-olive-glow tracking-[0.2em] mb-2">{number}</span>
        <h3 className="font-ar text-[1.5rem] font-medium text-cream mb-3">{title}</h3>
        <p className="text-[0.9rem] font-light text-sand leading-[1.9]">{children}</p>
      </div>
    </div>
  );
}
