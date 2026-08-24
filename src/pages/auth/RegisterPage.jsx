import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LockKeyhole, Eye, EyeOff, UserPlus, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import AuthShell from '@/components/Layout/AuthShell.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(t('auth.name_required', 'من فضلك أدخل اسمك.'));
      toast.error(t('auth.name_required_toast', 'الاسم مطلوب'));
      return;
    }
    if (!whatsapp.trim()) {
      setError(t('auth.whatsapp_required', 'من فضلك أدخل رقم الواتساب.'));
      toast.error(t('auth.whatsapp_required_toast', 'رقم الواتساب مطلوب'));
      return;
    }
    if (!password.trim()) {
      setError(t('auth.password_required', 'من فضلك أدخل كلمة المرور.'));
      toast.error(t('auth.password_required_toast', 'كلمة المرور مطلوبة'));
      return;
    }
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      toast.error('كلمة المرور قصيرة جداً');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل.');
      toast.error('كلمة المرور يجب أن تحتوي على حرف كبير');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل.');
      toast.error('كلمة المرور يجب أن تحتوي على حرف صغير');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.');
      toast.error('كلمة المرور يجب أن تحتوي على رقم');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name.trim(), whatsapp.trim(), password);
    if (result.success) {
      toast.success(`أهلاً ${name.trim()}، تم إنشاء حسابك بنجاح`);
      navigate(result.user?.role === 'admin' ? '/admin/dashboard' : '/shop', { replace: true });
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <AuthShell
      title={t('auth.register_title', 'إنشاء حساب جديد')}
      subtitle={t('auth.register_subtitle', 'انضم إلينا واستمتع بتجربة تسوق فريدة لمنتجات سيوة الأصيلة.')}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5 text-right">
        {/* Name */}
        <div>
          <label className="block mb-2 text-[var(--text-secondary)] text-[0.88rem] font-bold font-ar">
            {t('auth.name', 'الاسم بالكامل')}
          </label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all duration-300 focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
            <UserCircle className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
              placeholder="الاسم الثلاثي"
              autoComplete="name"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block mb-2 text-[var(--text-secondary)] text-[0.88rem] font-bold font-ar">
            {t('auth.whatsapp', 'رقم الواتساب')}
          </label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all duration-300 focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
            <MessageCircle className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              type="tel"
              className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-[var(--text-secondary)] text-[0.88rem] font-bold font-ar">
            {t('auth.password', 'كلمة المرور')}
          </label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all duration-300 focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
            <LockKeyhole className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? 'text' : 'password'}
              className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer"
              aria-label="إظهار كلمة المرور"
            >
              {showPass ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.8} /> : <Eye className="w-[18px] h-[18px]" strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl border border-[var(--discount-badge)]/30 bg-[var(--discount-badge)]/10 px-4 py-3 text-[var(--discount-badge)] text-[0.88rem] font-ar flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl px-5 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-ar font-bold text-base transition-all duration-300 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <UserPlus className="w-5 h-5" strokeWidth={2} />
          <span>{isSubmitting ? t('auth.creating_account', 'جاري إنشاء الحساب…') : t('auth.register_button', 'إنشاء الحساب')}</span>
        </button>

        {/* Link to login */}
        <div className="flex items-center justify-center gap-2 text-[0.88rem] pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[var(--text-secondary)] font-ar">لديك حساب بالفعل؟</span>
          <Link to="/auth/login" className="text-[var(--siwa-earth)] hover:text-[var(--action-primary)] font-bold transition-colors font-ar flex items-center gap-1">
            <span>تسجيل الدخول</span>
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
