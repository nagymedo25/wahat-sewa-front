import { useState } from 'react';
import { useAuth } from '../../store/auth';
import { useToast } from '@/store/toast.jsx';
import { Settings, Lock, UserCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('الاسم والبريد الإلكتروني مطلبان أساسيان');
      return;
    }

    setSavingProfile(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      if (result.success) {
        toast.success('تم حفظ التغييرات بنجاح');
      } else {
        toast.error(result.error || 'فشل حفظ التغييرات');
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      toast.error('أدخل كلمة المرور الحالية والجديدة');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('كلمتا المرور الجديدتين غير متطابقتين');
      return;
    }
    if (newPass.length < 8) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (!/[A-Z]/.test(newPass)) {
      toast.error('يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)');
      return;
    }
    if (!/[a-z]/.test(newPass)) {
      toast.error('يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)');
      return;
    }
    if (!/[0-9]/.test(newPass)) {
      toast.error('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)');
      return;
    }

    setUpdatingPassword(true);
    try {
      const result = await changePassword(currentPass, newPass);
      if (result.success) {
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        toast.success('تم تحديث كلمة المرور بنجاح');
      } else {
        toast.error(result.error || 'فشل تحديث كلمة المرور');
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تحديث كلمة المرور');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-cream">إعدادات الحساب</h1>
        <p className="text-sand mt-1">تحديث بيانات حساب المسؤول وتغيير كلمة المرور</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 md:p-8 flex flex-col justify-between hover:border-olive/35 transition-all duration-300">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-olive/10 pb-4">
              <div className="p-2 rounded-xl bg-olive-deep/40 text-olive-glow border border-olive/20">
                <UserCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-cream">معلومات الملف الشخصي</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sand-light text-sm font-medium">الاسم</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sand-light text-sm font-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)] text-left dir-ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 bg-gradient-to-l from-olive to-olive-deep border border-olive/30 text-cream font-semibold text-[0.95rem] transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingProfile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              حفظ التغييرات
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-shadow-soft backdrop-blur-xl rounded-2xl border border-olive/20 p-6 md:p-8 flex flex-col justify-between hover:border-olive/35 transition-all duration-300">
          <form onSubmit={handlePassword} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-olive/10 pb-4">
              <div className="p-2 rounded-xl bg-olive-deep/40 text-olive-glow border border-olive/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-cream">تغيير كلمة المرور</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sand-light text-sm font-medium">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block mb-2 text-sand-light text-sm font-medium">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block mb-2 text-sand-light text-sm font-medium">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 border border-olive/20 bg-shadow-soft outline-none text-cream transition-all focus:border-olive-glow focus:shadow-[0_0_16px_rgba(164,184,107,0.06)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 bg-gradient-to-l from-olive to-olive-deep border border-olive/30 text-cream font-semibold text-[0.95rem] transition-all hover:shadow-[0_12px_30px_rgba(164,184,107,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingPassword ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              تحديث كلمة المرور
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
