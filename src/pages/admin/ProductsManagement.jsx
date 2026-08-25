import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye, EyeOff, X, Check, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/store/toast.jsx';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader.jsx';

function buildProductPayload(formData) {
  return {
    name: String(formData.name || '').trim(),
    image_url: String(formData.image_url || '').trim(),
    price: Number.parseFloat(formData.price || 0),
    original_price: formData.original_price !== '' && formData.original_price != null
      ? Number.parseFloat(formData.original_price)
      : null,
    wholesale_price: Number.parseFloat(formData.wholesale_price || 0),
    description: String(formData.description || '').trim(),
    category_id: formData.category_id || null,
    subcategory_id: formData.subcategory_id || null,
    badge: formData.badge || 'none',
    stock: Number.parseInt(formData.stock || 0, 10),
    sort_order: Number.parseInt(formData.sort_order || 0, 10),
    is_active: formData.is_active ?? true,
  };
}

export default function ProductsManagement() {
  const { api } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState('');

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

  const handleSave = async (formData) => {
    try {
      const payload = buildProductPayload(formData);
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      fetchProducts();
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.error || 'فشل في حفظ المنتج');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      toast.success('تم حذف المنتج');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(error.response?.data?.error || 'فشل في حذف المنتج');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/products/${id}/toggle`);
      fetchProducts();
      toast.success('تم تحديث حالة المنتج');
    } catch (error) {
      console.error('Failed to toggle product:', error);
      toast.error(error.response?.data?.error || 'فشل في تحديث حالة المنتج');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBadge = !filterBadge || product.badge === filterBadge;
    return matchesSearch && matchesBadge;
  });

  const badgeLabels = {
    best_seller: 'الأكثر مبيعًا',
    most_requested: 'الأكثر طلبًا',
    featured: 'مميز',
    new_arrival: 'الوافد الجديد',
    none: 'بدون'
  };

  const badgeColors = {
    best_seller: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    most_requested: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    featured: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    new_arrival: 'bg-green-500/20 text-green-300 border border-green-500/30',
    none: 'bg-shadow text-sand border border-olive/20'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-olive/20 border-t-olive-glow rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-shadow-soft p-6 rounded-2xl border border-olive/20 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-cream">إدارة المنتجات</h1>
          <p className="text-sm text-sand mt-1">أضف، عدل، واحذف منتجات المتجر</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-olive hover:bg-olive-light text-cream rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(74,90,42,0.3)] hover:shadow-[0_0_30px_rgba(74,90,42,0.5)] font-bold group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sand group-focus-within:text-olive-glow transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
          />
        </div>
        <div className="relative md:w-64">
          <select
            value={filterBadge}
            onChange={(e) => setFilterBadge(e.target.value)}
            className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer"
          >
            <option value="" className="bg-shadow text-cream">كل التصنيفات</option>
            <option value="best_seller" className="bg-shadow text-cream">الأكثر مبيعًا</option>
            <option value="most_requested" className="bg-shadow text-cream">الأكثر طلبًا</option>
            <option value="featured" className="bg-shadow text-cream">مميز</option>
            <option value="new_arrival" className="bg-shadow text-cream">الوافد الجديد</option>
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          </div>
        </div>
      </div>

      {/* Products Table/Cards Container */}
      <div className="space-y-4">
        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="bg-shadow-soft border border-olive/20 rounded-2xl p-12 text-center text-sand">
              <Search className="w-10 h-10 mx-auto opacity-20 mb-3" />
              <p>لم يتم العثور على منتجات مطابقة</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="bg-shadow-soft border border-olive/20 rounded-2xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-olive/20 bg-white p-1.5 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-contain [mix-blend-mode:multiply]"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-cream truncate">{product.name}</p>
                      <span className={`px-2 py-0.5 rounded-lg text-[0.65rem] font-bold whitespace-nowrap ${badgeColors[product.badge]}`}>
                        {badgeLabels[product.badge]}
                      </span>
                    </div>
                    <p className="text-xs text-sand mt-1">
                      {product.category_name || 'بدون قسم'}
                      {product.subcategory_name && <span className="text-siwa-gold mr-1">/ {product.subcategory_name}</span>}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-olive-glow font-bold">{product.price} <span className="text-xs">ج.م</span></span>
                      {product.original_price && (
                        <span className="text-xs text-sand/50 line-through">{product.original_price} ج.م</span>
                      )}
                      <span className="text-sand text-[0.65rem] border border-olive/20 px-2 py-0.5 rounded-md">جملة: {product.wholesale_price || 0} ج.م</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-olive/10">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${product.is_active ? 'bg-olive-500/20 text-olive-glow border-olive-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                    {product.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {product.is_active ? 'نشط' : 'مخفي'}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className={`p-2 rounded-xl border ${product.is_active ? 'border-orange-500/20 text-orange-400' : 'border-olive-500/20 text-olive-glow'}`}
                    >
                      {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowModal(true);
                      }}
                      className="p-2 border border-blue-500/20 text-blue-400 rounded-xl"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 border border-red-500/20 text-red-400 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-olive-deep/40 border-b border-olive/20">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">المنتج</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">السعر (والجملة)</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">المخزون</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">الترتيب</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">التصنيف</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">الحالة</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-sand">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search className="w-10 h-10 opacity-20" />
                        <p>لم يتم العثور على منتجات مطابقة</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id} 
                      className="hover:bg-olive/10 transition-colors group animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-olive/20 bg-white p-1 flex-shrink-0 group-hover:border-olive-glow transition-colors flex items-center justify-center">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-contain [mix-blend-mode:multiply] group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-cream group-hover:text-olive-glow transition-colors">{product.name}</p>
                            <p className="text-xs text-sand mt-1">
                              {product.category_name || 'بدون قسم'}
                              {product.subcategory_name && <span className="text-siwa-gold mr-1">/ {product.subcategory_name}</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-olive-glow">{product.price} <span className="text-xs text-sand">ج.م</span></span>
                          {product.original_price && (
                            <span className="text-xs text-sand/50 line-through">{product.original_price} ج.م</span>
                          )}
                        </div>
                        <div className="text-[0.7rem] text-sand opacity-70 mt-0.5">جملة: {product.wholesale_price || 0} <span className="text-[0.6rem]">ج.م</span></div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-bold border ${product.stock < 10 ? 'bg-sunset/20 text-sunset border-sunset/30' : 'bg-olive/20 text-cream border-olive/30'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-sand text-center">{product.sort_order ?? 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${badgeColors[product.badge]}`}>
                          {badgeLabels[product.badge]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${product.is_active ? 'bg-olive-500/20 text-olive-glow border-olive-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                          {product.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {product.is_active ? 'نشط' : 'مخفي'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleActive(product.id)}
                            className={`p-2 rounded-xl transition-all duration-300 border ${product.is_active ? 'border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40' : 'border-olive-500/20 text-olive-glow hover:bg-olive-500/20 hover:border-olive-500/40'}`}
                            title={product.is_active ? 'إخفاء المنتج' : 'إظهار المنتج'}
                          >
                            {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowModal(true);
                            }}
                            className="p-2 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all duration-300"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    price: '',
    original_price: '',
    wholesale_price: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    badge: 'none',
    stock: 0,
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    setFormData({
      name: '',
      image_url: '',
      price: '',
      original_price: '',
      wholesale_price: '',
      description: '',
      category_id: '',
      subcategory_id: '',
      badge: 'none',
      stock: 0,
      sort_order: 0,
      is_active: true,
      ...product,
    });
  }, [product]);

  const parentCategories = categories.filter(c => !c.parent_id);
  const availableSubcategories = categories.filter(c => c.parent_id === formData.category_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-shadow/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-3xl bg-shadow border border-olive/20 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 my-4">
        <div className="p-6 border-b border-olive/20 flex items-center justify-between bg-olive-deep/30 shrink-0">
          <h2 className="text-xl font-bold text-cream flex items-center gap-2">
            {product ? <Edit className="w-5 h-5 text-olive-glow" /> : <Plus className="w-5 h-5 text-olive-glow" />}
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-sand hover:text-sunset hover:bg-sunset/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Upload */}
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <label className="block text-sm font-bold text-cream">صورة المنتج</label>
                <CloudinaryUploader
                  currentUrl={formData.image_url}
                  onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                  onClear={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                />
                {/* Fallback: manual URL input */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-sand opacity-60 mb-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    أو أدخل رابط URL يدوياً
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-olive-deep/10 border border-olive/15 rounded-xl text-cream text-sm placeholder-sand/30 focus:outline-none focus:border-olive-glow/60 focus:ring-1 focus:ring-olive-glow/40 transition-all"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full md:w-2/3 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-cream mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    placeholder="أدخل اسم المنتج"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">سعر البيع (ج.م)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">
                      السعر الأصلي (للخصم) <span className="text-sand/50 font-normal text-xs">— اختياري</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="يُشطب ويُعرض بجانب السعر"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
                    />
                    <p className="mt-1 text-[0.7rem] text-sand/40 font-ar">اتركه فارغاً إذا لا يوجد خصم</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">سعر الجملة (للحسابات)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.wholesale_price}
                      onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                      className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">المخزون</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="الكمية المتاحة"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">القسم الرئيسي</label>
                    <div className="relative">
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })}
                        className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer"
                      >
                        <option value="" className="bg-shadow">بدون قسم</option>
                        {parentCategories.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-shadow">{cat.name}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">▼</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">القسم الفرعي (اختياري)</label>
                    <div className="relative">
                      <select
                        value={formData.subcategory_id}
                        disabled={availableSubcategories.length === 0}
                        onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                        className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer disabled:opacity-40"
                      >
                        <option value="" className="bg-shadow">
                          {availableSubcategories.length === 0 ? 'لا توجد فروع لهذا القسم' : 'اختر فرعاً'}
                        </option>
                        {availableSubcategories.map((sub) => (
                          <option key={sub.id} value={sub.id} className="bg-shadow">{sub.name}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">▼</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">التصنيف المميز</label>
                    <div className="relative">
                      <select
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all cursor-pointer"
                      >
                        <option value="none" className="bg-shadow">بدون تصنيف</option>
                        <option value="best_seller" className="bg-shadow">الأكثر مبيعًا</option>
                        <option value="most_requested" className="bg-shadow">الأكثر طلبًا</option>
                        <option value="featured" className="bg-shadow">مميز</option>
                        <option value="new_arrival" className="bg-shadow">الوافد الجديد</option>
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">▼</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-cream mb-2">الوصف</label>
                  <textarea
                    value={formData.description}
                    placeholder="أدخل وصفًا جذابًا للمنتج..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all resize-none custom-scrollbar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">ترتيب الظهور</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                      className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 p-3 bg-olive-deep/20 border border-olive/20 rounded-xl cursor-pointer hover:bg-olive-deep/40 transition-colors h-[50px]">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.is_active)}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="peer appearance-none w-5 h-5 border-2 border-olive rounded-md checked:bg-olive-glow checked:border-olive-glow transition-all"
                        />
                        <Check className="absolute w-3 h-3 text-shadow opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                      </div>
                      <span className="text-sm font-bold text-cream select-none">منتج نشط ومرئي</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-olive/20 bg-shadow flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-olive/30 text-sand hover:text-cream hover:bg-olive/10 transition-all duration-300 font-bold"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="product-form"
            className="px-8 py-2.5 rounded-xl bg-olive text-cream font-bold hover:bg-olive-light hover:shadow-[0_0_20px_rgba(74,90,42,0.4)] transition-all duration-300"
          >
            {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </button>
        </div>
      </div>
    </div>
  );
}
