import { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldCheck, UserCog, Trash2, Search, Check, X, Eye, EyeOff, Edit, ShoppingBag } from 'lucide-react';
import { useToast } from '@/store/toast.jsx';
import { useAuth } from '@/store/auth.jsx';

export default function AdminUsersPage() {
  const toast = useToast();
  const { api, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error('فشل تحميل قائمة المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (!window.confirm(`هل أنت متأكد من تغيير دور "${user.name}" إلى ${newRole === 'admin' ? 'مدير' : 'عميل'}؟`)) return;
    
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
      toast.success('تم تحديث الدور بنجاح');
      fetchUsers();
    } catch (err) {
      toast.error('فشل تحديث الدور');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success('تم حذف المستخدم بنجاح');
      fetchUsers();
    } catch (err) {
      toast.error('فشل حذف المستخدم');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'إجمالي المستخدمين', value: users.length, icon: Users, color: 'from-blue-500 to-indigo-600', iconColor: 'text-blue-100' },
    { label: 'المديرين', value: users.filter(u => u.role === 'admin').length, icon: ShieldCheck, color: 'from-emerald-500 to-teal-600', iconColor: 'text-emerald-100' },
    { label: 'العملاء', value: users.filter(u => u.role === 'user').length, icon: UserCog, color: 'from-olive-500 to-olive-700', iconColor: 'text-olive-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cream flex items-center gap-3">
            <Users className="w-8 h-8 text-olive-glow" />
            إدارة المستخدمين
          </h1>
          <p className="text-sand mt-1">تحكم في صلاحيات الوصول وإدارة أعضاء الفريق والعملاء.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-olive hover:bg-olive-light text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-olive/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          إضافة مدير جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand opacity-40" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream placeholder-sand focus:outline-none focus:border-olive-glow transition-all"
          />
        </div>
        <div className="relative w-full md:w-64">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-3 bg-olive-deep/20 border border-olive/20 rounded-xl text-cream appearance-none focus:outline-none focus:border-olive-glow transition-all cursor-pointer"
          >
            <option value="all" className="bg-shadow">الكل</option>
            <option value="admin" className="bg-shadow">مديرين</option>
            <option value="user" className="bg-shadow">عملاء</option>
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-sand">▼</div>
        </div>
      </div>

      {/* Users Table/Cards Container */}
      <div className="space-y-4">
        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading ? (
             <div className="p-12 text-center text-sand">جارٍ التحميل...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-shadow-soft border border-olive/20 rounded-2xl p-12 text-center text-sand">
              <Users className="w-10 h-10 mx-auto opacity-20 mb-3" />
              <p>لا توجد نتائج مطابقة.</p>
            </div>
          ) : (
            filteredUsers.map((item, index) => (
              <div 
                key={item.id}
                className="bg-shadow-soft border border-olive/20 rounded-2xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-olive/20 text-olive-glow'}`}>
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-cream text-sm">{item.name}</div>
                      <p className="text-xs text-sand truncate max-w-[150px]">{item.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.65rem] font-bold border ${item.role === 'admin' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 border-gray-500/20 text-sand'}`}>
                    {item.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                    {item.role === 'admin' ? 'أدمن' : 'عميل'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-olive/10">
                  <div>
                    <p className="text-[0.65rem] text-sand opacity-60">تاريخ الانضمام</p>
                    <p className="text-xs text-sand font-mono">
                      {new Date(item.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {currentUser?.id !== item.id ? (
                      <>
                        <button
                          onClick={() => handleRoleChange(item, item.role === 'admin' ? 'user' : 'admin')}
                          className={`rounded-xl px-3 py-1.5 text-[0.65rem] font-bold transition-all border ${item.role === 'admin' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
                        >
                          {item.role === 'admin' ? 'تخفيض' : 'ترقية'}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-olive-glow font-bold bg-olive-glow/10 px-2 py-1 rounded-full">أنت</span>
                    )}
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
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">المستخدم</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">الرتبة</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">التاريخ</th>
                  <th className="px-6 py-4 text-sm font-bold text-cream whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sand">جاري التحميل...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sand">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Users className="w-10 h-10 opacity-20" />
                        <p>لا توجد نتائج مطابقة.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-olive/10 transition-colors group animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-olive/20 text-olive-glow'}`}>
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-cream group-hover:text-olive-glow transition-colors">{item.name}</div>
                            {currentUser?.id === item.id && (
                              <div className="mt-1 text-xs text-olive-glow font-bold bg-olive-glow/10 inline-block px-2 py-0.5 rounded-full">أنت</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand">{item.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border ${item.role === 'admin' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 border-gray-500/20 text-sand'}`}>
                          {item.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
                          {item.role === 'admin' ? 'أدمن' : 'عميل'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand font-mono text-center">
                        {new Date(item.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {currentUser?.id !== item.id && (
                            <>
                              <button
                                onClick={() => handleRoleChange(item, item.role === 'admin' ? 'user' : 'admin')}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 border ${item.role === 'admin' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:border-violet-500/40' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40'}`}
                              >
                                {item.role === 'admin' ? 'تخفيض لعميل' : 'ترقية لأدمن'}
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/40 group/del"
                                title="حذف المستخدم"
                              >
                                <Trash2 className="h-4 w-4 group-hover/del:scale-110 transition-transform" />
                              </button>
                            </>
                          )}
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
        <CreateUserModal
          api={api}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, iconColor }) {
  return (
    <div className="rounded-2xl border border-olive/20 bg-shadow-soft backdrop-blur-xl p-6 shadow-lg relative overflow-hidden group hover:border-olive/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(74,90,42,0.3)]">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110`} />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-sand">{label}</p>
          <p className="mt-2 text-3xl font-bold text-cream">{value}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${color} p-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function CreateUserModal({ api, onClose, onCreated }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/users', formData);
      toast.success('تم إنشاء المستخدم بنجاح');
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || 'فشل إنشاء المستخدم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-shadow/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-shadow border border-olive/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-olive/20 flex items-center justify-between bg-olive-deep/20">
          <h2 className="text-xl font-bold text-cream">إضافة مدير جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-sand"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-sm font-bold text-sand block pr-1">الاسم بالكامل</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="admin-input w-full"
              placeholder="مثال: محمود ناجي"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-sand block pr-1">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="admin-input w-full text-left"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-sand block pr-1">كلمة المرور</label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="admin-input w-full text-left"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-sand block pr-1">الصلاحية</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="admin-input w-full"
            >
              <option value="user" className="bg-shadow">عميل (صلاحيات محدودة)</option>
              <option value="admin" className="bg-shadow">مدير (صلاحيات كاملة)</option>
            </select>
          </div>
        </form>

        <div className="p-6 border-t border-olive/20 bg-olive-deep/10 flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-olive/20 text-sand hover:bg-white/5 transition-all font-bold"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-olive text-white font-bold hover:bg-olive-light transition-all shadow-lg shadow-olive/20 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            حفظ المستخدم
          </button>
        </div>
      </div>
    </div>
  );
}
