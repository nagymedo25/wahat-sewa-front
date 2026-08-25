import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/store/toast.jsx';
import { Search, Sparkles, Check, Home, AlertCircle, Loader2 } from 'lucide-react';

export default function HomepageProducts() {
  const { api } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?include_inactive=true');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleToggleMostRequested = async (product) => {
    const isCurrentlyFeatured = product.badge === 'most_requested';
    const featuredCount = products.filter(p => p.badge === 'most_requested').length;

    // Warning if trying to select more than 6, but still allow it
    if (!isCurrentlyFeatured && featuredCount >= 6) {
      const confirmAdd = window.confirm('لقد قمت بتحديد 6 منتجات بالفعل. هل ترغب في إضافة هذا المنتج أيضاً؟ (الصفحة الرئيسية تعرض أول 6 منتجات كحد أقصى)');
      if (!confirmAdd) return;
    }

    const newBadge = isCurrentlyFeatured ? 'none' : 'most_requested';
    setTogglingId(product.id);

    try {
      const payload = {
        name: product.name,
        image_url: product.image_url,
        price: parseFloat(product.price),
        description: product.description || '',
        category_id: product.category_id || null,
        badge: newBadge,
        sort_order: parseInt(product.sort_order || 0),
        is_active: product.is_active ?? true,
      };

      await api.put(`/products/${product.id}`, payload);
      
      // Update local state directly for fast feedback
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === product.id ? { ...p, badge: newBadge } : p
        )
      );

      toast.success(isCurrentlyFeatured ? 'تمت إزالة المنتج من الواجهة' : 'تم عرض المنتج في الواجهة الرئيسية بنجاح ✨');
    } catch (error) {
      console.error('Failed to toggle homepage display:', error);
      toast.error(error.response?.data?.error || 'فشل في تحديث حالة المنتج');
      // Re-fetch in case of error
      fetchProducts();
    } finally {
      setTogglingId(null);
    }
  };

  const featuredProducts = products.filter(p => p.badge === 'most_requested');
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-olive-glow animate-spin" />
        <p className="text-sand animate-pulse">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-shadow-soft p-6 rounded-2xl border border-olive/20 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-bold text-cream flex items-center gap-2">
            <Home className="w-8 h-8 text-olive-glow" />
            معروضات الواجهة الرئيسية
          </h1>
          <p className="text-sm text-sand mt-1">تحكَّم بالمنتجات الـ 6 المعروضة في قسم "المنتجات الأكثر طلباً" بالصفحة الرئيسية للموقع</p>
        </div>
        <div className="bg-olive-deep/40 px-5 py-3 rounded-2xl border border-olive/20 text-center flex flex-col justify-center min-w-[150px]">
          <span className="text-[0.75rem] text-sand-light uppercase tracking-wider">المنتجات المعروضة</span>
          <span className={`text-2xl font-bold mt-1 ${featuredProducts.length === 6 ? 'text-olive-glow' : 'text-sunset'}`}>
            {featuredProducts.length} <span className="text-sm font-normal text-sand">/ 6</span>
          </span>
        </div>
      </div>

      {/* Info indicator if not exactly 6 */}
      {featuredProducts.length !== 6 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-sunset/20 bg-sunset/5 text-sunset animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            يُفضل اختيار 6 منتجات بالضبط لضمان المظهر الجمالي المتوازن في الصفحة الرئيسية للموقع (لديك حالياً {featuredProducts.length} منتج).
          </p>
        </div>
      )}

      {/* Filters and search */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sand group-focus-within:text-olive-glow transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن منتج بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
          />
        </div>
        <div className="relative md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer"
          >
            <option value="" className="bg-shadow text-cream">جميع الأقسام</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-shadow text-cream">{cat.name}</option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          </div>
        </div>
      </div>

      {/* Selected/Featured Quick view list */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cream flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-olive-glow" />
          المنتجات المحددة حالياً للظهور بالصفحة الرئيسية ({featuredProducts.length})
        </h3>
        
        {featuredProducts.length === 0 ? (
          <div className="bg-shadow-soft border border-olive/20 rounded-2xl p-8 text-center text-sand">
            لا توجد معروضات محددة حالياً. اختر بعض المنتجات بالأسفل ليتم عرضها في الصفحة الرئيسية.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-olive-deep/20 border border-olive-glow/40 hover:border-olive-glow/70 rounded-2xl p-4 flex gap-4 transition-all duration-300 relative group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-olive/20 bg-white p-1 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-contain [mix-blend-mode:multiply]"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-cream truncate text-sm">{product.name}</p>
                  <p className="text-xs text-olive-glow font-bold mt-1">{product.price} ج.م</p>
                  <button
                    onClick={() => handleToggleMostRequested(product)}
                    disabled={togglingId === product.id}
                    className="mt-2 text-xs text-sunset hover:text-sunset-deep hover:underline transition-colors flex items-center gap-1"
                  >
                    إزالة من الصفحة الرئيسية
                  </button>
                </div>
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-olive-glow text-shadow flex items-center justify-center">
                  <Check className="w-3 h-3 font-bold" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-olive/20" />

      {/* Main products catalog for selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cream">كتالوج المنتجات للتحكم والتعيين</h3>
        
        {filteredProducts.length === 0 ? (
          <div className="bg-shadow-soft border border-olive/20 rounded-2xl p-12 text-center text-sand">
            لم يتم العثور على منتجات مطابقة للبحث أو التصفية.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isFeatured = product.badge === 'most_requested';
              return (
                <div
                  key={product.id}
                  className={`bg-shadow-soft rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 hover:shadow-2xl ${
                    isFeatured 
                      ? 'border-olive-glow/40 shadow-[0_0_20px_rgba(164,184,107,0.05)]' 
                      : 'border-olive/20'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-shadow">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                    {isFeatured && (
                      <div className="absolute top-3 left-3 bg-olive-glow text-shadow px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Check className="w-3.5 h-3.5" />
                        الأكثر طلباً
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-cream group-hover:text-olive-glow transition-colors line-clamp-1 text-sm">{product.name}</h4>
                      <p className="text-xs text-sand opacity-60 mt-1 line-clamp-2 min-h-[32px]">{product.description || 'لا يوجد وصف متاح.'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-olive/10">
                      <span className="font-bold text-olive-glow text-sm">{product.price} ج.م</span>
                      <button
                        onClick={() => handleToggleMostRequested(product)}
                        disabled={togglingId === product.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                          isFeatured
                            ? 'bg-sunset/15 text-sunset border border-sunset/20 hover:bg-sunset/25'
                            : 'bg-olive/20 text-cream border border-olive/30 hover:bg-olive/40 hover:border-olive-glow/50'
                        }`}
                      >
                        {isFeatured ? 'إلغاء العرض' : 'عرض بالرئيسية'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
