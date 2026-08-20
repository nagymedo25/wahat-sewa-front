import { useState } from 'react';
import {
  LayoutGrid, Droplets, CircleDot, Sprout, Palmtree, Sparkles, Lamp,
  Package, Flame, ChevronDown, SlidersHorizontal, ArrowUpDown, X, RotateCcw,
  Tag, Check
} from 'lucide-react';

const ICON_REGISTRY = {
  LayoutGrid, Droplets, CircleDot, Sprout, Palmtree, Sparkles, Lamp,
  Package, Flame,
};

function CategoryIcon({ name, className }) {
  const Icon = ICON_REGISTRY[name] || Package;
  return <Icon className={className} strokeWidth={1.5} />;
}

export const SORT_OPTIONS = [
  { value: 'catalog', label: 'الترتيب الافتراضي' },
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'best_selling', label: 'الأكثر مبيعاً' },
  { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
];

export default function ShopSidebar({
  categories = [],
  activeCategory = 'all',
  activeSubcategory = null,
  onSelectCategory,
  onSelectSubcategory,
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  sort = 'catalog',
  onSortChange,
  onClearAllFilters,
  hasActiveFilters = false,
  totalCount = 0,
  isMobile = false,
  onCloseMobileDrawer,
}) {
  const [expandedCats, setExpandedCats] = useState({ care: true });
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

  const toggleExpand = (catKey, e) => {
    e.stopPropagation();
    setExpandedCats(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  const handleApplyPrice = (e) => {
    e.preventDefault();
    onPriceChange(tempMinPrice, tempMaxPrice);
  };

  const handleClearPrice = () => {
    setTempMinPrice('');
    setTempMaxPrice('');
    onPriceChange('', '');
  };

  return (
    <aside className="w-full space-y-6 select-none font-ar">
      {/* Mobile Drawer Header */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(211,200,178,0.12)]">
          <div className="flex items-center gap-2 text-siwa-cream-light font-bold text-lg">
            <SlidersHorizontal className="w-5 h-5 text-siwa-gold" strokeWidth={1.5} />
            <span>تصفية وتصنيف المنتجات</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(33,21,13,0.8)] border border-[rgba(211,200,178,0.15)] text-siwa-cream hover:text-siwa-cream-light transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ─── 1. Main Categories & Subcategories Section ─── */}
      <div className="rounded-2xl border border-[rgba(211,200,178,0.10)] bg-[rgba(33,21,13,0.70)] [backdrop-filter:blur(16px)] p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.92rem] font-bold text-siwa-cream-light flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-siwa-gold"></span>
            <span>الأقسام الرئيسية</span>
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-[0.75rem] text-siwa-warm hover:text-siwa-cream-light transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        <nav className="space-y-1 pt-1" aria-label="قائمة الأقسام">
          {categories.map((cat) => {
            const isMainActive = activeCategory === cat.slug && !activeSubcategory;
            const hasSubcategories = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
            const isExpanded = expandedCats[cat.slug] ?? (cat.slug === activeCategory || cat.slug === 'care');
            const isParentActive = activeCategory === cat.slug;

            return (
              <div key={cat.key || cat.slug} className="space-y-1">
                {/* Main category item */}
                <div
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    if (isMobile && !hasSubcategories) onCloseMobileDrawer?.();
                  }}
                  className={`
                    group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                    ${isMainActive
                      ? 'bg-[rgba(146,108,72,0.22)] border border-[rgba(146,108,72,0.45)] text-siwa-cream-light font-bold shadow-[0_2px_12px_rgba(24,16,9,0.3)]'
                      : isParentActive
                        ? 'bg-[rgba(146,108,72,0.10)] text-siwa-cream border border-transparent hover:border-[rgba(211,200,178,0.15)]'
                        : 'text-siwa-cream/80 hover:text-siwa-cream-light hover:bg-[rgba(56,38,23,0.40)] border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CategoryIcon
                      name={cat.icon}
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isMainActive ? 'text-siwa-gold' : 'text-siwa-cream/50 group-hover:text-siwa-gold'
                      }`}
                    />
                    <span className="text-[0.88rem] truncate">{cat.label || cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {cat.productCount > 0 && (
                      <span className="text-[0.7rem] font-number px-2 py-0.5 rounded-full bg-[rgba(24,16,9,0.5)] text-siwa-cream/60 border border-[rgba(211,200,178,0.08)]">
                        {cat.productCount}
                      </span>
                    )}

                    {hasSubcategories && (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(cat.slug, e)}
                        className="p-1 text-siwa-cream/40 hover:text-siwa-gold transition-colors"
                        aria-label="توسيع الفروع"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-siwa-gold' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories (expandable accordion) */}
                {hasSubcategories && isExpanded && (
                  <div className="mr-5 pr-2.5 border-r border-[rgba(146,108,72,0.25)] space-y-1 pt-1 pb-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {cat.subcategories.map((sub) => {
                      const isSubActive = activeCategory === cat.slug && activeSubcategory === sub.slug;
                      return (
                        <button
                          key={sub.key || sub.slug}
                          type="button"
                          onClick={() => {
                            onSelectSubcategory(cat.slug, sub.slug);
                            if (isMobile) onCloseMobileDrawer?.();
                          }}
                          className={`
                            w-full text-right flex items-center justify-between px-3 py-2 rounded-lg text-[0.82rem] transition-all
                            ${isSubActive
                              ? 'bg-[rgba(146,108,72,0.25)] border border-[rgba(146,108,72,0.50)] text-siwa-cream-light font-bold'
                              : 'text-siwa-cream/70 hover:text-siwa-cream-light hover:bg-[rgba(56,38,23,0.30)]'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-siwa-gold' : 'bg-siwa-cream/30'}`} />
                            <span>{sub.label || sub.name}</span>
                          </div>
                          {sub.productCount > 0 && (
                            <span className="text-[0.68rem] font-number text-siwa-cream/50">
                              {sub.productCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ─── 2. Price Range Filter ─── */}
      <div className="rounded-2xl border border-[rgba(211,200,178,0.10)] bg-[rgba(33,21,13,0.70)] [backdrop-filter:blur(16px)] p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.92rem] font-bold text-siwa-cream-light flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-siwa-gold"></span>
            <span>نطاق السعر</span>
          </h3>
          {(minPrice || maxPrice) && (
            <button
              type="button"
              onClick={handleClearPrice}
              className="text-[0.75rem] text-siwa-warm hover:text-siwa-cream-light transition-colors"
            >
              مسح السعر
            </button>
          )}
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[0.72rem] text-siwa-cream/60 mb-1">من (ج.م)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={tempMinPrice}
                onChange={(e) => setTempMinPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[rgba(24,16,9,0.7)] border border-[rgba(211,200,178,0.14)] text-siwa-cream-light font-number text-sm placeholder:text-siwa-cream/25 focus:outline-none focus:border-siwa-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] text-siwa-cream/60 mb-1">إلى (ج.م)</label>
              <input
                type="number"
                min="0"
                placeholder="1000"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[rgba(24,16,9,0.7)] border border-[rgba(211,200,178,0.14)] text-siwa-cream-light font-number text-sm placeholder:text-siwa-cream/25 focus:outline-none focus:border-siwa-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[rgba(146,108,72,0.25)] hover:bg-[rgba(146,108,72,0.40)] border border-[rgba(146,108,72,0.45)] text-siwa-cream-light font-bold text-[0.82rem] transition-all active:scale-[0.98]"
          >
            تطبيق نطاق السعر
          </button>
        </form>
      </div>

      {/* ─── 3. Sorting Options ─── */}
      <div className="rounded-2xl border border-[rgba(211,200,178,0.10)] bg-[rgba(33,21,13,0.70)] [backdrop-filter:blur(16px)] p-5 space-y-3 shadow-lg">
        <h3 className="text-[0.92rem] font-bold text-siwa-cream-light flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-siwa-gold"></span>
          <span>ترتيب حسب</span>
        </h3>

        <div className="space-y-1.5 pt-1">
          {SORT_OPTIONS.map((opt) => {
            const isSortActive = sort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSortChange(opt.value);
                  if (isMobile) onCloseMobileDrawer?.();
                }}
                className={`
                  w-full text-right flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[0.84rem] transition-all
                  ${isSortActive
                    ? 'bg-[rgba(146,108,72,0.22)] border border-[rgba(146,108,72,0.45)] text-siwa-cream-light font-bold'
                    : 'text-siwa-cream/75 hover:text-siwa-cream-light hover:bg-[rgba(56,38,23,0.30)]'
                  }
                `}
              >
                <span>{opt.label}</span>
                {isSortActive && <Check className="w-4 h-4 text-siwa-gold" strokeWidth={2} />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
