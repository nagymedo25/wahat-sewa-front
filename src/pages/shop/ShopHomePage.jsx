import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, PackageSearch, Loader2, Sparkles,
  LayoutGrid, Rows3, ChevronRight, ChevronLeft, ChevronDown
} from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import ShopSidebar, { SORT_OPTIONS } from '@/components/Products/ShopSidebar.jsx';
import ProductCard from '@/components/Products/ProductCard.jsx';
import PromoBanner from '@/components/Products/PromoBanner.jsx';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';
import { publicApi } from '@/services/api.js';
import { normalizeProduct, buildCategoriesTree } from '@/services/catalog.js';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36];

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
  
  // Mobile / Desktop View Mode: 'grid' (compact 2-col on mobile) vs 'list' (1-col on mobile)
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [banners, setBanners] = useState([]);

  const searchTimer = useRef(null);
  const productsTopRef = useRef(null);

  // ─── Fetch from API ───
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

  // ─── Initial boot ───
  useEffect(() => {
    let isMounted = true;
    async function boot() {
      try {
        const [prodRes, catRes, bannersRes] = await Promise.allSettled([
          publicApi.get('/products'),
          publicApi.get('/categories'),
          publicApi.get('/banners'),
        ]);
        if (!isMounted) return;

        if (prodRes.status === 'fulfilled') {
          const rawProds = Array.isArray(prodRes.value.data?.products) ? prodRes.value.data.products : [];
          setProducts(rawProds.map((p, i) => normalizeProduct(p, i)));
        }

        if (catRes.status === 'fulfilled') {
          const rawCats = Array.isArray(catRes.value.data?.categories) ? catRes.value.data.categories : [];
          const rawTree = Array.isArray(catRes.value.data?.tree) ? catRes.value.data.tree : [];
          setFlatCategories(rawCats);
          setCategoriesTree(buildCategoriesTree(rawTree, rawCats));
        }

        if (bannersRes.status === 'fulfilled' && Array.isArray(bannersRes.value?.data?.banners)) {
          setBanners(bannersRes.value.data.banners);
        }
      } catch (e) {
        console.error('Error booting shop catalog:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    boot();
    return () => { isMounted = false; };
  }, []);

  // ─── Re-fetch when filters change ───
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 on filter change
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
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const hasActiveFilters = activeCategory !== 'all' || activeSubcategory || searchQuery || sort !== 'catalog' || minPrice !== '' || maxPrice !== '';

  const currentCategoryObj = categoriesTree.find(c => c.slug === activeCategory);
  const currentSubcategoryObj = currentCategoryObj?.subcategories?.find(s => s.slug === activeSubcategory);
  const activeSortObj = SORT_OPTIONS.find(o => o.value === sort);

  const totalProducts = products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);
  const paginatedProducts = products.slice(startIndex, endIndex);

  const shopBanner = banners.find((b) => b.position === 'shop') || null;

  return (
    <GlassShell
      title={t('shop.title', 'متجر سحر سيوة')}
      subtitle={`${totalProducts} منتج أصيل من قلب الواحة… اختر ما ينبض بالطبيعة والنقاء.`}
    >
      {/* ─── Shop Promo Banner ─── */}
      <div className="mb-10">
        <PromoBanner banner={shopBanner} position="shop" />
      </div>

      {/* ─── Top Control Bar: Search, Mobile Filter & View Toggle ─── */}
      <div className="mb-8 space-y-4" ref={productsTopRef}>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
              strokeWidth={1.8}
            />
            <input
              id="shop-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في خيرات سيوة… تمور، زيت زيتون، أعشاب، صابون…"
              className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] py-3.5 pr-11 pl-10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--siwa-earth)] focus:shadow-[var(--shadow-glow)] transition-all font-ar text-[0.92rem]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* View Mode Toggle (Grid vs Single Column on Mobile) */}
          <div className="flex items-center rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[var(--action-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              aria-label="عرض شبكي متعدد"
              title="عرض شبكي"
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--action-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              aria-label="عرض منتج مفرد بالصف"
              title="عرض مفرد"
            >
              <Rows3 className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] text-[0.88rem] font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--siwa-earth)]" strokeWidth={1.8} />
            <span>الأقسام</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[var(--discount-badge)] animate-pulse" />
            )}
          </button>
        </div>

        {/* Active Filter Tags (Chips) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-fadeIn">
            <span className="text-[0.78rem] text-[var(--text-tertiary)] ml-1 font-medium">الفلاتر النشطة:</span>

            {activeCategory !== 'all' && currentCategoryObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[var(--siwa-earth)]/15 border border-[var(--border-accent)] text-[var(--text-primary)] font-bold">
                <span>القسم: {currentCategoryObj.label}</span>
                <button type="button" onClick={() => handleSelectCategory('all')} className="hover:text-[var(--discount-badge)] cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeSubcategory && currentSubcategoryObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[var(--action-primary)]/15 border border-[var(--action-primary)]/30 text-[var(--text-primary)] font-bold">
                <span>الفرع: {currentSubcategoryObj.label}</span>
                <button type="button" onClick={() => setActiveSubcategory(null)} className="hover:text-[var(--discount-badge)] cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[var(--siwa-earth)]/15 border border-[var(--border-accent)] text-[var(--text-primary)]">
                <span>السعر: {minPrice ? `${minPrice} ج.م` : '0'} إلى {maxPrice ? `${maxPrice} ج.م` : 'الكل'}</span>
                <button type="button" onClick={() => handlePriceChange('', '')} className="hover:text-[var(--discount-badge)] cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[var(--siwa-earth)]/15 border border-[var(--border-accent)] text-[var(--text-primary)]">
                <span>بحث: "{searchQuery}"</span>
                <button type="button" onClick={() => setSearchQuery('')} className="hover:text-[var(--discount-badge)] cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sort !== 'catalog' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.78rem] bg-[var(--siwa-earth)]/15 border border-[var(--border-accent)] text-[var(--text-primary)]">
                <span>{activeSortObj?.label}</span>
                <button type="button" onClick={() => setSort('catalog')} className="hover:text-[var(--discount-badge)] cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-[0.75rem] text-[var(--discount-badge)] hover:underline mr-2 font-bold cursor-pointer"
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
          <div className="flex items-center justify-between px-1 text-sm text-[var(--text-secondary)] border-b border-[var(--border-default)] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-primary)] font-number text-base">
                {totalProducts > 0 ? `${startIndex + 1} - ${endIndex}` : '0'}
              </span>
              <span>من أصل {totalProducts} منتج</span>
              {activeCategory !== 'all' && currentCategoryObj && (
                <span className="text-[var(--siwa-earth)] font-bold">في {currentCategoryObj.label}</span>
              )}
              {activeSubcategory && currentSubcategoryObj && (
                <span className="text-[var(--text-tertiary)] font-medium">/ {currentSubcategoryObj.label}</span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[var(--siwa-earth)]" />
              <span>منتجات طبيعية 100% من واحة سيوة</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Loader2 className="w-10 h-10 text-[var(--siwa-earth)] animate-spin opacity-80" strokeWidth={1.8} />
              <p className="text-[var(--text-secondary)] font-ar text-[0.92rem]">
                جاري تحميل خيرات الواحة…
              </p>
            </div>
          )}

          {/* Products Grid — Responsive viewMode (Compact 2-col on mobile vs 1-col) */}
          {!loading && paginatedProducts.length > 0 && (
            <div className={`
              grid gap-5 sm:gap-6
              ${viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
              }
            `}>
              {paginatedProducts.map((p, index) => (
                <ProductCard key={`${p.id}-${currentPage}-${activeCategory}-${sort}`} product={p} index={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center text-center py-28 px-4 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)]">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--border-subtle)] text-[var(--siwa-earth)] mb-5">
                <PackageSearch className="w-9 h-9 opacity-70" strokeWidth={1.8} />
              </div>
              <h3 className="text-[var(--text-primary)] font-bold text-lg">لم نجد ما تبحث عنه</h3>
              <p className="mt-2 text-[var(--text-secondary)] text-sm max-w-[34ch] leading-relaxed">
                جرّب البحث بكلمات أخرى أو تصفح الأقسام من القائمة الجانبية.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--action-primary)] text-white font-bold text-sm hover:bg-[var(--action-primary-hover)] transition-colors shadow-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>مسح جميع الفلاتر</span>
                </button>
              )}
            </div>
          )}

          {/* ─── Pagination Bar (أكورديون / عداد الصفحات) ─── */}
          {!loading && totalPages > 1 && (
            <div className="pt-8 mt-6 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Summary */}
              <div className="text-xs text-[var(--text-secondary)] font-ar">
                صفحة <span className="font-number font-bold text-[var(--text-primary)]">{currentPage}</span> من{' '}
                <span className="font-number font-bold text-[var(--text-primary)]">{totalPages}</span> (إجمالي {totalProducts} منتج)
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Previous Page */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span className="hidden sm:inline">السابق</span>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show current, first, last, and neighboring pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-number font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[var(--action-primary)] text-white shadow-sm'
                            : 'border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-accent)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="text-xs text-[var(--text-tertiary)] px-1">
                        …
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Page */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--border-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="الصفحة التالية"
                >
                  <span className="hidden sm:inline">التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─── Mobile Filter Drawer (Slide-over) ─── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer content (RTL slides from right) */}
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-[var(--bg-primary)] border-l border-[var(--border-default)] shadow-2xl p-6 overflow-y-auto custom-scrollbar animate-slideInRight">
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
