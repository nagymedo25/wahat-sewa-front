import ProductCard from '@/components/Products/ProductCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function ProductsSection({ products }) {
  const { t } = useTranslation();
  const sectionRef = useScrollReveal({ selector: '.products-header, .product-card', stagger: 0.18, y: 45 });

  return (
    <section
      ref={sectionRef}
      className="section products relative min-h-[auto] py-40 bg-[linear-gradient(180deg,var(--shadow)_0%,rgba(45,40,30,0.5)_30%,rgba(45,40,30,0.5)_70%,var(--shadow)_100%)]"
      id="products"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(164,184,107,0.08)_0%,transparent_70%)] animate-glowPulse" />
      </div>
      <div className="section-inner w-full max-w-[1400px] mx-auto px-12 relative z-[5] max-md:px-6">
        <div className="products-header text-center mb-24">
          <span className="inline-flex items-center gap-3 font-ar text-[0.75rem] font-medium text-olive-glow tracking-[0.15em] uppercase mb-6 before:content-[''] before:block before:w-[30px] before:h-px before:bg-olive-glow before:opacity-50">
            {t('products_section.label', 'المنتجات')}
          </span>
          <h2 className="font-ar text-[clamp(2.5rem,6vw,5rem)] font-extralight text-cream leading-[1.15] tracking-[-0.02em]">
            {t('products_section.title_part1', 'المنتجات')}
            <br />
            {t('products_section.title_part2', 'الأكثر طلباً')}
          </h2>
        </div>

        <div className="products-gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
