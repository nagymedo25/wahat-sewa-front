import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Sparkles, PackageSearch, Loader2, Search, SlidersHorizontal,
  X, Check, ChevronLeft, ArrowUpDown
} from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import ShopSidebar, { SORT_OPTIONS } from '@/components/Products/ShopSidebar.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { publicApi } from '@/services/api.js';
import { normalizeProduct, buildCategoriesTree } from '@/services/catalog.js';
import { useTranslation } from 'react-i18next';

function money(value, currency = 'ج.م') {
  return `${Number(value).toLocaleString('ar-EG')} ${currency}`;
}

export default function ShopHomePage() {
  const { addItem } = useCart();
  const toast = useToast();
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('catalog');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);

  const searchTimer = useRef(null);

  // ─── Fetch from API (combined backend filters) ───────────────────────────
  const fetchProducts = useCallback(async ({ category, subcategory, search, sortBy, min, max } = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (subcategory) params.set('subcategory', subcategory);
      if (search) params.set('search', search);
      if (sortBy && sortBy !== 'catalog') params.set('sort', sortBy);
      if (min !== '' && min !== undefined) params.set('min_price', min);
      if (max !== '' && max !== undefined) params.set('max_price', max);

      const response = await publicApi.get(`/products?${params.toString()}`);
      const raw = Array.isArray(response.data?.products) ? response.data.products : [];
      setProducts(raw.map((p, i) => normalizeProduct(p, i)));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Initial boot: load categories & initial products ─────────────────────
  useEffect(() => {
    let isMounted = true;
    async function boot() {
      try {
        const [prodRes, catRes] = await Promise.all([
          publicApi.get('/products'),
          publicApi.get('/categories'),
        ]);
        if (!isMounted) return;

        const rawProds = Array.isArray(prodRes.data?.products) ? prodRes.data.products : [];
        const rawCats = Array.isArray(catRes.data?.categories) ? catRes.data.categories : [];
        const rawTree = Array.isArray(catRes.data?.tree) ? catRes.data.tree : [];

        setProducts(rawProds.map((p, i) => normalizeProduct(p, i)));
        setFlatCategories(rawCats);
        setCategoriesTree(buildCategoriesTree(rawTree, rawCats));
      } catch (e) {
        console.error('Error booting shop catalog:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    boot();
    return () => { isMounted = false; };
  }, []);

  // ─── Re-fetch when filters change (debounced for search) ────────────────────
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchProducts({
        category: activeCategory,
        subcategory: activeSubcategory,
        search: searchQuery,
        sortBy: sort,
        min: minPrice,
        max: maxPrice,
      });
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(searchTimer.current);
  }, [activeCategory, activeSubcategory, sort, minPrice, maxPrice, searchQuery, fetchProducts]);

  const handleSelectCategory = (catSlug) => {
    setActiveCategory(catSlug);
    setActiveSubcategory(null);
  };

  const handleSelectSubcategory = (catSlug, subSlug) => {
    setActiveCategory(catSlug);
    setActiveSubcategory(subSlug);
  };

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleClearAllFilters = () => {
    setActiveCategory('all');
    setActiveSubcategory(null);
    setSearchQuery('');
    setSort('catalog');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleAdd = useCallback((p) => {
    addItem(p, 1);
    toast.success(t('shop.added_to_cart', 'تمت إضافة {{name}} للسلة', { name: p.name }));
  }, [addItem, toast, t]);

  const hasActiveFilters = activeCategory !== 'all' || activeSubcategory || searchQuery || sort !== 'catalog' || minPrice !== '' || maxPrice !== '';

  // Get active category / subcategory labels for breadcrumbs/filter tags
  const currentCategoryObj = categoriesTree.find(c => c.slug === activeCategory);
  const currentSubcategoryObj = currentCategoryObj?.subcategories?.find(s => s.slug === activeSubcategory);
  const activeSortObj = SORT_OPTIONS.find(o => o.value === sort);

  // Fix Bug 14: Ensure clean numeric product count display in subtitle
  const countNumber = products.length;
  const subtitleText = `${countNumber} منتج أصيل من قلب الواحة… اختر ما ينبض بروح الصحراء.`;

  return (
    <GlassShell
      title={t('shop.title', 'متجر واحة سيوة')}
      subtitle={subtitleText}
    >
      {/* ─── Top Control Bar: Search & Mobile Filter Toggle ─── */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-siwa-cream/40 pointer-events-none"
              strokeWidth={1.5}
            />
            <input
              id="shop-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في خيرات سيوة… تمور، زيت زيتون، أعشاب، صابون…"
              className="w-full rounded-2xl border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.75)] py-3.5 pr-11 pl-10 text-siwa-cream-light placeholder:text-siwa-cream/30 focus:outline-none focus:border-siwa-gold focus:shadow-[0_0_20px_rgba(146,108,72,0.12)] transition-all font-ar text-[0.92rem]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-[rgba(24,16,9,0.5)] text-siwa-cream/60 hover:text-siwa-cream-light transition-colors"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-2xl px-4 py-3.5 border border-[rgba(211,200,178,0.12)] bg-[rgba(33,21,13,0.85)] text-siwa-cream-light text-[0.88rem] font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4 text-siwa-gold" strokeWidth={1.5} />
            <span>الأقسام والفلاتر</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-siwa-gold animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Active Filter Tags (Chips) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-200">
            <span className="text-[0.78rem] text-siwa-cream/50 ml-1">الفلاتر النشطة:</span>

            {activeCategory !== 'all' && currentCategoryObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[rgba(146,108,72,0.20)] border border-[rgba(146,108,72,0.40)] text-siwa-cream-light">
                <span>القسم: {currentCategoryObj.label}</span>
                <button type="button" onClick={() => handleSelectCategory('all')} className="hover:text-siwa-gold">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeSubcategory && currentSubcategoryObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[rgba(146,108,72,0.25)] border border-[rgba(146,108,72,0.50)] text-siwa-cream-light font-bold">
                <span>الفرع: {currentSubcategoryObj.label}</span>
                <button type="button" onClick={() => setActiveSubcategory(null)} className="hover:text-siwa-gold">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[rgba(146,108,72,0.20)] border border-[rgba(146,108,72,0.40)] text-siwa-cream-light">
                <span>السعر: {minPrice ? `${minPrice} ج.م` : '0'} إلى {maxPrice ? `${maxPrice} ج.م` : 'الكل'}</span>
                <button type="button" onClick={() => handlePriceChange('', '')} className="hover:text-siwa-gold">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[rgba(146,108,72,0.20)] border border-[rgba(146,108,72,0.40)] text-siwa-cream-light">
                <span>بحث: "{searchQuery}"</span>
                <button type="button" onClick={() => setSearchQuery('')} className="hover:text-siwa-gold">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sort !== 'catalog' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[rgba(146,108,72,0.20)] border border-[rgba(146,108,72,0.40)] text-siwa-cream-light">
                <span>{activeSortObj?.label}</span>
                <button type="button" onClick={() => setSort('catalog')} className="hover:text-siwa-gold">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-[0.75rem] text-siwa-warm hover:text-siwa-cream-light transition-colors underline mr-2"
            >
              مسح الكل
            </button>
          </div>
        )}
      </div>

      {/* ─── Main Shop Layout: RTL Sidebar (Right) + Product Grid (Left) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 items-start">

        {/* ─── Desktop Right Sidebar ─── */}
        <div className="hidden lg:block sticky top-24">
          <ShopSidebar
            categories={categoriesTree}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            onSelectCategory={handleSelectCategory}
            onSelectSubcategory={handleSelectSubcategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            sort={sort}
            onSortChange={setSort}
            onClearAllFilters={handleClearAllFilters}
            hasActiveFilters={hasActiveFilters}
            totalCount={products.length}
          />
        </div>

        {/* ─── Product Grid / Left Content Area ─── */}
        <div className="min-w-0 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-1 text-sm text-siwa-cream/70 border-b border-[rgba(211,200,178,0.08)] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-siwa-cream-light font-number text-base">{products.length}</span>
              <span>منتج معروض</span>
              {activeCategory !== 'all' && currentCategoryObj && (
                <span className="text-siwa-gold font-semibold">في {currentCategoryObj.label}</span>
              )}
              {activeSubcategory && currentSubcategoryObj && (
                <span className="text-siwa-warm font-medium">/ {currentSubcategoryObj.label}</span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-siwa-cream/50">
              <Sparkles className="w-3.5 h-3.5 text-siwa-gold" />
              <span>منتجات طبيعية أصيلة 100% من واحة سيوة</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Loader2 className="w-10 h-10 text-siwa-gold animate-spin opacity-80" strokeWidth={1.5} />
              <p className="text-siwa-cream/60 font-ar text-[0.92rem]">
                جاري تحميل خيرات الواحة…
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center text-center py-28 px-4 rounded-3xl border border-[rgba(211,200,178,0.08)] bg-[rgba(33,21,13,0.50)]">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(146,108,72,0.10)] border border-[rgba(146,108,72,0.20)] mb-5">
                <PackageSearch className="w-9 h-9 text-siwa-gold opacity-60" strokeWidth={1.5} />
              </div>
              <h3 className="text-siwa-cream-light font-bold text-lg">لم نجد ما تبحث عنه</h3>
              <p className="mt-2 text-siwa-cream/60 text-sm max-w-[34ch] leading-relaxed">
                جرّب البحث بكلمات أخرى أو تصفح الأقسام من القائمة الجانبية.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-siwa-gold text-[#181009] font-bold text-sm hover:bg-siwa-warm transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                  <span>مسح جميع الفلاتر</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Filter Drawer (Slide-over) ─── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer content (RTL slides from right) */}
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-siwa-primary border-l border-[rgba(211,200,178,0.15)] shadow-2xl p-6 overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300">
            <ShopSidebar
              categories={categoriesTree}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={handleSelectSubcategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              sort={sort}
              onSortChange={setSort}
              onClearAllFilters={handleClearAllFilters}
              hasActiveFilters={hasActiveFilters}
              totalCount={products.length}
              isMobile={true}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </GlassShell>
  );
}

// ─── Product Card with Siwa Brand Identity & Real Discount Display ─────────
function ProductCard({ product, onAdd }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    setAdding(true);
    onAdd();
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <div className="group relative rounded-2xl border border-[rgba(211,200,178,0.10)] bg-[rgba(33,21,13,0.70)] [backdrop-filter:blur(16px)] overflow-hidden transition-all duration-400 hover:border-siwa-gold/50 hover:shadow-[0_16px_40px_rgba(24,16,9,0.5),0_0_24px_rgba(146,108,72,0.10)] hover:-translate-y-1 flex flex-col justify-between">

      {/* Image Container — Light warm ivory base for clean contrast */}
      <Link to={`/shop/product/${product.id}`} className="block relative h-52 overflow-hidden bg-[#EFE9DD] flex items-center justify-center">
        {product.image ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[#E5DEC7]" />
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center opacity-30 text-siwa-earth">
            <PackageSearch className="w-10 h-10 mb-2" />
            <span className="text-[0.7rem] font-ar">واحة سيوة</span>
          </div>
        )}

        {/* Badge (Featured, Best Seller, New) */}
        {product.badge && (
          <div className="absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[0.68rem] font-ar font-bold bg-[rgba(45,29,16,0.92)] text-siwa-cream-light border border-siwa-gold/30 shadow-md backdrop-blur-md z-10">
            {product.badge}
          </div>
        )}

        {/* Real Backend Discount Badge */}
        {product.oldPrice && (
          <div className="absolute top-3 left-3 rounded-lg px-2.5 py-1 text-[0.68rem] font-number font-bold bg-[#C97B4F] text-white shadow-md z-10">
            {product.discountPercent ? `-${product.discountPercent}%` : `خصم ${product.discountAmount} ج.م`}
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Subcategory Tag */}
          <div className="text-[0.68rem] font-ar text-siwa-gold font-semibold flex items-center gap-1.5 mb-1">
            <span>{product.categoryLabel}</span>
            {product.subcategoryLabel && (
              <>
                <span className="text-siwa-cream/30">/</span>
                <span className="text-siwa-warm">{product.subcategoryLabel}</span>
              </>
            )}
          </div>

          <h3 className="font-ar text-[0.98rem] font-bold text-siwa-cream-light leading-[1.4] line-clamp-2">
            {product.name}
          </h3>

          <p className="mt-1.5 text-[0.8rem] text-siwa-cream/70 leading-[1.6] line-clamp-2">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-[rgba(211,200,178,0.08)] flex items-center justify-between gap-2">
          {/* Price display: crossed out original + current selling price */}
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="font-number text-[0.78rem] text-siwa-cream/40 line-through leading-tight">
                {money(product.oldPrice, product.currency)}
              </span>
            )}
            <span className="font-number text-[1.12rem] font-bold text-siwa-cream-light leading-none">
              {money(product.price, product.currency)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/shop/product/${product.id}`}
              className="text-[0.78rem] text-siwa-cream/60 hover:text-siwa-cream-light hover:underline transition-colors font-ar"
            >
              تفاصيل
            </Link>

            <button
              type="button"
              id={`add-to-cart-${product.id}`}
              onClick={handleClick}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[0.82rem] font-ar font-bold transition-all duration-300 active:scale-95 ${
                adding
                  ? 'bg-siwa-gold text-[#181009] shadow-[0_0_20px_rgba(146,108,72,0.4)]'
                  : 'bg-[rgba(146,108,72,0.22)] hover:bg-siwa-gold text-siwa-cream-light hover:text-[#181009] border border-[rgba(146,108,72,0.45)]'
              }`}
            >
              {adding ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
              <span>{adding ? 'تمت' : 'إضافة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
