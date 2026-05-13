import { useAuth } from '../../store/auth';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, FolderTree } from 'lucide-react';
import { useToast } from '@/store/toast.jsx';

export default function CategoriesManagement() {
  const { api } = useAuth();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      fetchCategories();
      setShowModal(false);
      setEditingCategory(null);
      toast.success(editingCategory ? 'تم تحديث القسم بنجاح' : 'تمت إضافة القسم بنجاح');
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error(error.response?.data?.error || 'فشل في حفظ القسم');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع المنتجات المرتبطة به.')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success('تم حذف القسم بنجاح');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error.response?.data?.error || 'فشل في حذف القسم');
    }
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
          <h1 className="text-2xl font-bold text-cream">إدارة الأقسام</h1>
          <p className="text-sm text-sand mt-1">أضف وعدل تصنيفات المنتجات الخاصة بك</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-olive hover:bg-olive-light text-cream rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(74,90,42,0.3)] hover:shadow-[0_0_30px_rgba(74,90,42,0.5)] font-bold group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 bg-shadow-soft border border-olive/20 rounded-2xl text-sand">
            <FolderTree className="w-16 h-16 opacity-20 mb-4" />
            <p className="text-lg">لا توجد أقسام بعد</p>
            <p className="text-sm mt-2 opacity-70">أضف قسمك الأول للبدء في تنظيم منتجاتك</p>
          </div>
        ) : (
          categories.map((category, index) => (
            <div 
              key={category.id} 
              className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 hover:border-olive-glow/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-olive-glow opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 min-w-0 pl-4">
                  <h3 className="text-xl font-bold text-cream truncate group-hover:text-olive-glow transition-colors">{category.name}</h3>
                  <p className="text-xs text-sand font-mono mt-1 opacity-70 truncate">{category.slug}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-olive-deep/50 border border-olive/20 rounded-lg text-olive-glow">
                      الترتيب: {category.sort_order ?? 0}
                    </span>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-sand mt-4 line-clamp-2 leading-relaxed">{category.description}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowModal(true);
                    }}
                    className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl transition-all duration-300 group/btn"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all duration-300 group/btn"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({ category, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        sort_order: category.sort_order ?? 0,
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-shadow/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-shadow border border-olive/20 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 my-4">
        <div className="p-6 border-b border-olive/20 flex items-center justify-between bg-olive-deep/30">
          <h2 className="text-xl font-bold text-cream flex items-center gap-2">
            {category ? <Edit className="w-5 h-5 text-olive-glow" /> : <Plus className="w-5 h-5 text-olive-glow" />}
            {category ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-sand hover:text-sunset hover:bg-sunset/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          <div>
            <label className="block text-sm font-bold text-cream mb-2">اسم القسم</label>
            <input
              type="text"
              required
              placeholder="مثال: التمور"
              value={formData.name}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                });
              }}
              className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cream mb-2">الرابط (Slug)</label>
            <input
              type="text"
              required
              placeholder="dates"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-olive-deep/10 border border-olive/10 rounded-xl text-sand placeholder-sand/30 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all font-mono"
              dir="ltr"
            />
            <p className="text-xs text-sand/70 mt-2">يستخدم في رابط الصفحة، يتم توليده تلقائياً ويمكن تعديله.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-cream mb-2">الوصف (اختياري)</label>
            <textarea
              value={formData.description}
              placeholder="وصف قصير للقسم..."
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cream mb-2">ترتيب الظهور</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand/50 focus:outline-none focus:border-olive-glow focus:ring-1 focus:ring-olive-glow transition-all"
            />
            <p className="text-xs text-sand/70 mt-2">الرقم الأقل يظهر أولاً.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-olive text-cream font-bold rounded-xl hover:bg-olive-light hover:shadow-[0_0_20px_rgba(74,90,42,0.4)] transition-all duration-300"
            >
              {category ? 'حفظ التعديلات' : 'إضافة القسم'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-olive/30 text-sand hover:text-cream hover:bg-olive/10 rounded-xl transition-all duration-300 font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
