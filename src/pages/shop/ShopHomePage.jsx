import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBasket, Star, Search, Loader2, Sparkles, PackageSearch } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { categories, shopProducts, searchProducts, getProductsByCategory } from '@/data/shopProducts.js';
import { useCart } from '@/store/cart.jsx';
import { useToast } from '@/store/toast.jsx';

function money(value, currency) {
  return `${value} ${currency}`;
}

export default function ShopHomePage() {
  const { items, addItem } = useCart();
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const results = searchQuery
        ? searchProducts(searchQuery)
        : getProductsByCategory(activeCategory);
      setProducts(results);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = shopProducts.length;
    const saleCount = shopProducts.filter((p) => p.oldPrice).length;
    return { total, saleCount };
  }, []);

  const handleAdd = useCallback((p) => {
    addItem(p, 1);
    toast.success(`تمت إضافة ${p.name} للسلة`);
  }, [addItem, toast]);

  return (
    <GlassShell
      title="متجر واحة سيوة"
      subtitle={`${stats.total} منتج أصيل من قلب الواحة… اختر ما ينبض بروح الصحراء.`}
    >
      {/* Search + Categories */}
      <div className="mb-10 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand opacity-40 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المتجر… أعشاب، تمور، زيوت…"
            className="w-full rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.45)] py-3.5 pr-12 pl-4 text-cream placeholder:text-sand/30 focus:outline-none focus:border-[rgba(164,184,107,0.45)] focus:shadow-[0_0_24px_rgba(164,184,107,0.08)] transition-all font-ar"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setSearchQuery('');
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-ar transition-all duration-300 border active:scale-95 ${
                activeCategory === cat.key
                  ? 'bg-[rgba(74,90,42,0.45)] border-[rgba(164,184,107,0.45)] text-cream shadow-[0_0_20px_rgba(164,184,107,0.12)]'
                  : 'bg-[rgba(26,24,20,0.35)] border-[rgba(212,197,169,0.08)] text-sand-light hover:border-[rgba(164,184,107,0.30)] hover:bg-[rgba(74,90,42,0.15)]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-olive-glow animate-spin" strokeWidth={1.5} />
          <p className="text-sand opacity-60 font-ar">جاري تحميل خيرات الواحة…</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center text-center py-20">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.06)] border border-[rgba(164,184,107,0.12)] mb-5">
            <PackageSearch className="w-8 h-8 text-olive-glow opacity-50" strokeWidth={1.5} />
          </div>
          <p className="text-cream font-ar font-semibold text-[1.1rem]">لم نجد ما تبحث عنه</p>
          <p className="mt-2 text-sand opacity-50 text-sm font-ar">جرب كلمة بحث أخرى أو تصفح الأقسام ✨</p>
        </div>
      )}
    </GlassShell>
  );
}

function ProductCard({ product, onAdd }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleClick = () => {
    setAdding(true);
    onAdd();
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="group relative rounded-2xl border border-[rgba(212,197,169,0.08)] bg-[rgba(26,24,20,0.50)] overflow-hidden transition-all duration-500 hover:border-[rgba(164,184,107,0.25)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_30px_rgba(164,184,107,0.06)] hover:-translate-y-1">
      {/* Image Area */}
      <div className="relative h-48 overflow-hidden bg-[rgba(10,9,7,0.40)]">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[rgba(212,197,169,0.06)]" />
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 rounded-full px-3 py-1 text-[0.7rem] font-ar font-medium bg-[rgba(164,184,107,0.15)] border border-[rgba(164,184,107,0.28)] text-cream backdrop-blur-sm">
            {product.badge}
          </div>
        )}
        {/* Sale Tag */}
        {product.oldPrice && (
          <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-[0.7rem] font-number font-bold bg-[rgba(232,168,124,0.15)] border border-[rgba(232,168,124,0.25)] text-sunset backdrop-blur-sm">
            خصم
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[0.65rem] tracking-[0.2em] uppercase text-olive-glow opacity-70 font-en">
              {product.categoryLabel}
            </div>
            <h3 className="mt-1 font-ar text-[1rem] font-semibold text-cream leading-[1.4]">
              {product.name}
            </h3>
          </div>
        </div>

        <p className="mt-2 text-[0.8rem] text-sand opacity-70 leading-[1.7] line-clamp-2">
          {product.shortDesc}
        </p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(product.rating)
                    ? 'text-sunset fill-sunset'
                    : 'text-sand/15'
                }`}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="font-number text-[0.75rem] text-sand opacity-60">
            {product.rating}
          </span>
          <span className="text-[0.7rem] text-sand opacity-40">
            ({product.reviews})
          </span>
        </div>

        {/* Price + Actions */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[rgba(212,197,169,0.06)]">
          <div className="flex items-baseline gap-2">
            <span className="font-number text-[1.1rem] font-bold text-bronze-light">
              {money(product.price, product.currency)}
            </span>
            {product.oldPrice && (
              <span className="font-number text-[0.8rem] text-sand opacity-35 line-through">
                {money(product.oldPrice, product.currency)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/shop/product/${product.id}`}
              className="text-[0.8rem] text-sand opacity-60 hover:text-cream hover:opacity-100 transition-colors font-ar"
            >
              تفاصيل
            </Link>
            <button
              onClick={handleClick}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[0.8rem] font-ar font-semibold transition-all duration-300 active:scale-[0.95] ${
                adding
                  ? 'bg-[rgba(74,90,42,0.55)] border-[rgba(164,184,107,0.40)] text-cream shadow-[0_0_20px_rgba(164,184,107,0.10)]'
                  : 'bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.18))] border border-[rgba(164,184,107,0.30)] text-cream hover:shadow-[0_8px_25px_rgba(164,184,107,0.12)]'
              }`}
            >
              {adding ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              )}
              {adding ? 'تمت' : 'إضافة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
