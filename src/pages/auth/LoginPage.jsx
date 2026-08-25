import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, MessageCircle, Sparkles, ArrowLeft, LogIn } from 'lucide-react';
import AuthShell from '@/components/Layout/AuthShell.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, adminLogin } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();

  const isAdmin = location.search.includes('admin=true');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ whatsapp: false, email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('next') || '/shop';
  }, [location.search]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ whatsapp: false, email: false, password: false });

    if (isAdmin) {
      if (!email.trim()) {
        setError(t('auth.email_required', 'من فضلك أدخل البريد الإلكتروني.'));
        toast.error(t('auth.email_required_toast', 'البريد الإلكتروني مطلوب'));
        setFieldErrors(prev => ({ ...prev, email: true }));
        return;
      }
    } else {
      if (!whatsapp.trim()) {
        setError(t('auth.whatsapp_required', 'من فضلك أدخل رقم الواتساب.'));
        toast.error(t('auth.whatsapp_required_toast', 'رقم الواتساب مطلوب'));
        setFieldErrors(prev => ({ ...prev, whatsapp: true }));
        return;
      }
    }
    
    if (!password.trim()) {
      setError(t('auth.password_required', 'من فضلك أدخل كلمة المرور.'));
      toast.error(t('auth.password_required_toast', 'كلمة المرور مطلوبة'));
      setFieldErrors(prev => ({ ...prev, password: true }));
      return;
    }

    setIsSubmitting(true);
    let result;
    if (isAdmin) {
      result = await adminLogin(email.trim(), password);
    } else {
      result = await login(whatsapp.trim(), password);
    }
    
    if (result.success) {
      toast.success(t('auth.welcome_back', 'أهلاً بك مجدداً'));
      navigate(result.user?.role === 'admin' ? '/admin/dashboard' : nextPath, { replace: true });
    } else {
      let friendlyError = '';
      if (result.errorCode === 'whatsapp_not_found') {
        friendlyError = t('auth.error_whatsapp_not_found', 'رقم الواتساب هذا غير مسجل لدينا.');
        setFieldErrors(prev => ({ ...prev, whatsapp: true }));
      } else if (result.errorCode === 'incorrect_password') {
        friendlyError = t('auth.error_incorrect_password', 'كلمة المرور التي أدخلتها غير صحيحة.');
        setFieldErrors(prev => ({ ...prev, password: true }));
      } else if (result.errorCode === 'email_not_found') {
        friendlyError = t('auth.error_email_not_found', 'البريد الإلكتروني هذا غير مسجل لدينا.');
        setFieldErrors(prev => ({ ...prev, email: true }));
      } else if (result.errorCode === 'unauthorized_admin') {
        friendlyError = t('auth.error_unauthorized_admin', 'ليس لديك صلاحية مسؤول للدخول.');
        setFieldErrors(prev => ({ ...prev, email: true }));
      } else if (result.errorCode === 'server_error') {
        friendlyError = t('auth.error_server', 'حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.');
      } else if (result.errorCode === 'network_error') {
        friendlyError = t('auth.error_network', 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت لديك.');
      } else if (result.error === 'Valid WhatsApp number required') {
        friendlyError = t('auth.error_invalid_whatsapp_format', 'رقم الواتساب غير صالح (يجب أن يبدأ بـ 01 ويتكون من 11 رقماً).');
        setFieldErrors(prev => ({ ...prev, whatsapp: true }));
      } else {
        friendlyError = result.error;
        setFieldErrors({ whatsapp: true, email: true, password: true });
      }

      setError(friendlyError);
      toast.error(friendlyError);
    }
    setIsSubmitting(false);
  };

  return (
    <AuthShell
      title={t('auth.login_title', 'تسجيل الدخول')}
      subtitle={t('auth.login_subtitle', 'ادخل للمتجر واستمتع بأفضل منتجات واحة سيوة الطبيعية.')}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5 text-right">
        {/* Identifier Field */}
        <div>
          <label className="block mb-2 text-[var(--text-secondary)] text-[0.88rem] font-bold font-ar">
            {isAdmin ? t('auth.email', 'البريد الإلكتروني') : t('auth.whatsapp', 'رقم الواتساب')}
          </label>
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-300 bg-[var(--bg-elevated)] ${
            (isAdmin ? fieldErrors.email : fieldErrors.whatsapp)
              ? 'border-[var(--discount-badge)] shadow-[0_0_15px_rgba(196,94,59,0.15)]'
              : 'border-[var(--border-default)] focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]'
          }`}>
            {isAdmin ? (
              <Mail className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${fieldErrors.email ? 'text-[var(--discount-badge)]' : 'text-[var(--siwa-earth)]'}`} strokeWidth={1.8} />
            ) : (
              <MessageCircle className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${fieldErrors.whatsapp ? 'text-[var(--discount-badge)]' : 'text-[var(--siwa-earth)]'}`} strokeWidth={1.8} />
            )}
            {isAdmin ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
                placeholder=""
                autoComplete="email"
              />
            ) : (
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                type="tel"
                className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
              />
            )}
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[var(--text-secondary)] text-[0.88rem] font-bold font-ar">
              {t('auth.password', 'كلمة المرور')}
            </label>
            <Link
              to="/auth/forgot"
              className="text-[0.78rem] text-[var(--siwa-earth)] hover:underline font-ar"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-300 bg-[var(--bg-elevated)] ${
            fieldErrors.password
              ? 'border-[var(--discount-badge)] shadow-[0_0_15px_rgba(196,94,59,0.15)]'
              : 'border-[var(--border-default)] focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]'
          }`}>
            <LockKeyhole className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${fieldErrors.password ? 'text-[var(--discount-badge)]' : 'text-[var(--siwa-earth)]'}`} strokeWidth={1.8} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? 'text' : 'password'}
              className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
              placeholder="••••••••"
              autoComplete="current-password"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl px-5 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-ar font-bold text-base transition-all duration-300 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <LogIn className="w-5 h-5" strokeWidth={2} />
          <span>{isSubmitting ? t('auth.signing_in', 'جاري الدخول…') : t('auth.sign_in', 'تسجيل الدخول')}</span>
        </button>

        {/* Links */}
        <div className="flex items-center justify-between gap-4 text-[0.85rem] pt-2 border-t border-[var(--border-subtle)]">
          {isAdmin ? (
            <Link to="/auth/login" className="no-underline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-ar">
              {t('auth.customer_login', 'دخول العملاء')}
            </Link>
          ) : (
            <Link to="/auth/login?admin=true" className="no-underline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-ar">
              {t('auth.admin_login', 'دخول الإدارة')}
            </Link>
          )}
          <Link to="/auth/register" className="no-underline text-[var(--siwa-earth)] hover:text-[var(--action-primary)] font-bold transition-colors font-ar flex items-center gap-1">
            <span>{t('auth.create_account', 'إنشاء حساب جديد')}</span>
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
