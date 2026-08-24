import { Link } from 'react-router-dom';
import { 
  Package, Droplets, CircleDot, Sprout, 
  Palmtree, Sparkles, Lamp, Flame, LayoutGrid, ChevronLeft 
} from 'lucide-react';

const categoryIconMap = {
  all: LayoutGrid,
  oils: Droplets,
  olives: CircleDot,
  herbs: Sprout,
  dates: Palmtree,
  care: Sparkles,
  lamps: Lamp,
  jams: Package,
  candles: Flame,
  soaps: Sparkles,
  shampoos: Droplets,
};

export default function CategoryDiscovery({ categories = [] }) {
  // Filter out 'all' from display grid if present
  const displayCategories = categories.filter((cat) => cat.slug !== 'all');

  return (
    <section className="py-16 px-6 md:px-12 lg:px-16 bg-[var(--bg-secondary)]/40" id="categories">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-right">
          <div>
            <span className="inline-block font-ar text-xs md:text-sm font-bold text-[var(--siwa-earth)] tracking-wider uppercase mb-2">
              تصفح حسب القسم
            </span>
            <h2 className="font-ar text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              أقسام واحة سيوة الطبيعية
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayCategories.map((cat) => {
            const IconComponent = categoryIconMap[cat.slug] || Package;
            return (
              <Link
                key={cat.id || cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-accent)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-300 text-center"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--siwa-earth)] group-hover:bg-[var(--action-primary)] group-hover:text-[var(--action-primary-text)] transition-colors duration-300 mb-4 shadow-sm">
                  <IconComponent className="w-7 h-7" strokeWidth={1.8} />
                </div>

                {/* Category Name */}
                <h3 className="font-ar text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors mb-1">
                  {cat.label || cat.name}
                </h3>

                {/* Product Count if available */}
                {cat.productCount !== undefined && (
                  <span className="font-ar text-xs text-[var(--text-tertiary)]">
                    {cat.productCount} منتج
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
