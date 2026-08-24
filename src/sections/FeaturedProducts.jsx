import { Link } from 'react-router-dom';
import { ChevronLeft, Flame } from 'lucide-react';
import ProductCard from '@/components/Products/ProductCard.jsx';

export default function FeaturedProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 lg:px-16" id="featured">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 font-ar text-xs md:text-sm font-bold text-[var(--siwa-earth)] tracking-wider uppercase mb-2">
              <Flame className="w-4 h-4 text-[var(--discount-badge)]" />
              <span>مختارات الواحة</span>
            </div>
            <h2 className="font-ar text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              المنتجات الأكثر طلباً وتميزاً
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 font-ar text-sm font-bold text-[var(--action-primary)] hover:text-[var(--action-primary-hover)] transition-colors group"
          >
            <span>عرض كل المنتجات</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
