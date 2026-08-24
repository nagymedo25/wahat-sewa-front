import { ShieldCheck, HeartHandshake, Leaf, Sparkles } from 'lucide-react';
import heroBg2 from '../images/hero-bg2.png';

export default function BrandStorySection() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-16 overflow-hidden" id="philosophy">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ── Story Text & Features ── */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-accent)] text-[var(--siwa-earth)] text-xs font-ar font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>فلسفتنا وتراثنا</span>
            </div>

            <h2 className="font-ar text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-tight mb-6">
              نحن لا نبيع مجرد منتجات، <br className="hidden sm:block" />
              بل ننقل إليك <span className="text-[var(--siwa-earth)]">روح سيوة</span>
            </h2>

            <p className="font-ar text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
              في قلب الصحراء الغربية المصرية، حيث تتعانق عيون الماء العذبة مع بساتين النخيل والزيتون المعمرة، تُصنع منتجاتنا بأيدي أهل الواحة الحرفيين بأساليب متوارثة منذ آلاف السنين للحفاظ على نقائها التام وقيمتها الغذائية والشفائية الفريدة.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] text-right">
                <Leaf className="w-6 h-6 text-[var(--palm-shade)] mb-2" />
                <h4 className="font-ar text-sm font-bold text-[var(--text-primary)] mb-1">100% عضوي</h4>
                <p className="font-ar text-xs text-[var(--text-tertiary)]">خالٍ تماماً من أي مواد كيميائية</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] text-right">
                <HeartHandshake className="w-6 h-6 text-[var(--siwa-earth)] mb-2" />
                <h4 className="font-ar text-sm font-bold text-[var(--text-primary)] mb-1">صُنع بأيدي سيوية</h4>
                <p className="font-ar text-xs text-[var(--text-tertiary)]">دعم الحرفيين والمزارعين المحليين</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] text-right">
                <ShieldCheck className="w-6 h-6 text-[var(--palm-shade)] mb-2" />
                <h4 className="font-ar text-sm font-bold text-[var(--text-primary)] mb-1">أعلى معايير الجودة</h4>
                <p className="font-ar text-xs text-[var(--text-tertiary)]">فحص وتعبئة بعناية فائقة</p>
              </div>
            </div>

          </div>

          {/* ── Visual Imagery & Stats ── */}
          <div className="relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-[var(--shadow-xl)] border border-[var(--border-accent)]">
              <img
                src={heroBg2}
                alt="واحة سيوة — التراث والأصالة"
                loading="lazy"
                className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700 ease-cinematic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 right-6 left-6 text-white text-right">
                <p className="font-ar text-xs tracking-wider text-[var(--desert-sand)] uppercase mb-1">
                  أصالة تمتد عبر الأجيال
                </p>
                <p className="font-ar text-base sm:text-lg font-bold">
                  «كل قطرة وكل ثمرة تحمل في طياتها بركة أرض سيوة الطيبة»
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-4 sm:left-6 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-accent)] shadow-[var(--shadow-lg)] backdrop-blur-md hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--palm-shade)]/15 text-[var(--palm-shade)] flex items-center justify-center font-ar font-bold text-lg">
                1200+
              </div>
              <div className="text-right">
                <h5 className="font-ar text-xs font-bold text-[var(--text-primary)]">عام من التاريخ العريق</h5>
                <p className="font-ar text-[0.7rem] text-[var(--text-tertiary)]">تراث حي يتجدد في كل منتج</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
