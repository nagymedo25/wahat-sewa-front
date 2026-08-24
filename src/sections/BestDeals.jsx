import { Link } from 'react-router-dom';
import { Tag, Sparkles, ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/Products/ProductCard.jsx';

export default function BestDeals({ products = [] }) {
  // Filter products that actually have a real discount
  const discountedProducts = products.filter((p) => {
    const price = Number(p.price);
    const oldPrice = p.oldPrice || p.original_price ? Number(p.oldPrice || p.original_price) : null;
    return oldPrice && oldPrice > price;
  });

  if (discountedProducts.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 lg:px-16 bg-[var(--bg-secondary)]/30 border-y border-[var(--border-subtle)]" id="deals">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 font-ar text-xs md:text-sm font-bold text-[var(--discount-badge)] tracking-wider uppercase mb-2">
              <Tag className="w-4 h-4" />
              <span>عروض خاصة ومحدودة</span>
            </div>
            <h2 className="font-ar text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              أفضل الخصومات الحصرية
            </h2>
          </div>
          <Link
            to="/shop?on_sale=true"
            className="inline-flex items-center gap-1.5 font-ar text-sm font-bold text-[var(--action-primary)] hover:text-[var(--action-primary-hover)] transition-colors group"
          >
            <span>جميع العروض المخفضة</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Discounted Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
