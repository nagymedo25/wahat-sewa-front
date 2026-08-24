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
  return <Icon className={className} strokeWidth={1.8} />;
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
    setExpandedCats((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
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
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-lg">
            <SlidersHorizontal className="w-5 h-5 text-[var(--siwa-earth)]" strokeWidth={1.8} />
            <span>تصفية وتصنيف المنتجات</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ─── 1. Main Categories & Subcategories Section ─── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.92rem] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--siwa-earth)]"></span>
            <span>الأقسام الرئيسية</span>
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-[0.75rem] text-[var(--siwa-earth)] hover:text-[var(--action-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
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
                    group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[0.88rem] cursor-pointer transition-all duration-200
                    ${isMainActive
                      ? 'bg-[var(--action-primary)] text-white font-bold shadow-sm'
                      : isParentActive
                        ? 'bg-[var(--siwa-earth)]/15 text-[var(--text-primary)] font-bold border border-[var(--border-accent)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CategoryIcon
                      name={cat.icon}
                      className={`w-4 h-4 shrink-0 ${isMainActive ? 'text-white' : 'text-[var(--siwa-earth)]'}`}
                    />
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {cat.count !== undefined && (
                      <span className={`text-[0.7rem] font-number px-1.5 py-0.5 rounded-md ${isMainActive ? 'bg-black/20 text-white' : 'text-[var(--text-tertiary)]'}`}>
                        {cat.count}
                      </span>
                    )}

                    {hasSubcategories && (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(cat.slug, e)}
                        className={`p-1 rounded-lg transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        aria-label="توسيع"
                      >
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories items */}
                {hasSubcategories && isExpanded && (
                  <div className="pr-6 pl-2 space-y-1 pt-0.5 animate-fadeIn">
                    {cat.subcategories.map((sub) => {
                      const isSubActive = activeCategory === cat.slug && activeSubcategory === sub.slug;
                      return (
                        <div
                          key={sub.slug}
                          onClick={() => {
                            onSelectSubcategory(cat.slug, sub.slug);
                            if (isMobile) onCloseMobileDrawer?.();
                          }}
                          className={`
                            flex items-center justify-between px-3 py-2 rounded-lg text-[0.82rem] cursor-pointer transition-all duration-200
                            ${isSubActive
                              ? 'bg-[var(--action-primary)] text-white font-bold'
                              : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                            }
                          `}
                        >
                          <span className="truncate">{sub.label}</span>
                          {isSubActive && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ─── 2. Sorting Selector ─── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3 shadow-sm">
        <h3 className="text-[0.92rem] font-bold text-[var(--text-primary)] flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[var(--siwa-earth)]" strokeWidth={1.8} />
          <span>ترتيب المنتجات</span>
        </h3>

        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSortChange(opt.value);
                if (isMobile) onCloseMobileDrawer?.();
              }}
              className={`
                w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[0.85rem] text-right cursor-pointer transition-all duration-200
                ${sort === opt.value
                  ? 'bg-[var(--action-primary)] text-white font-bold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <span>{opt.label}</span>
              {sort === opt.value && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 3. Price Filter Section ─── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-[0.92rem] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[var(--siwa-earth)]" strokeWidth={1.8} />
            <span>نطاق السعر (ج.م)</span>
          </h3>
          {(minPrice || maxPrice) && (
            <button
              type="button"
              onClick={handleClearPrice}
              className="text-[0.72rem] text-[var(--siwa-earth)] hover:underline"
            >
              مسح
            </button>
          )}
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[0.72rem] text-[var(--text-tertiary)] mb-1">من</label>
              <input
                type="number"
                min="0"
                value={tempMinPrice}
                onChange={(e) => setTempMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--siwa-earth)]"
              />
            </div>
            <div>
              <label className="block text-[0.72rem] text-[var(--text-tertiary)] mb-1">إلى</label>
              <input
                type="number"
                min="0"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--siwa-earth)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            تطبيق التصفية
          </button>
        </form>
      </div>
    </aside>
  );
}
