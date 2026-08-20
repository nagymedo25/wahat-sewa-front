import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, MessageCircle, LogIn, Sparkles, ArrowLeft } from 'lucide-react';
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
    <AuthShell title={t('auth.login_title', 'تسجيل الدخول')} subtitle={t('auth.login_subtitle', 'ادخل للمتجر بتجربة راقية ولمسة سينمائية.')}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">
            {isAdmin ? t('auth.email', 'البريد الإلكتروني') : t('auth.whatsapp', 'رقم الواتساب')}
          </label>
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-300 bg-[rgba(10,9,7,0.35)] ${
            (isAdmin ? fieldErrors.email : fieldErrors.whatsapp)
              ? 'border-sunset/50 focus-within:border-sunset shadow-[0_0_15px_rgba(232,168,124,0.05)]'
              : 'border-[rgba(212,197,169,0.12)] focus-within:border-[rgba(164,184,107,0.45)] focus-within:shadow-[0_0_20px_rgba(164,184,107,0.08)]'
          }`}>
            {isAdmin ? (
              <Mail className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${fieldErrors.email ? 'text-sunset' : 'text-olive-glow'}`} strokeWidth={1.5} />
            ) : (
              <MessageCircle className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${fieldErrors.whatsapp ? 'text-sunset' : 'text-olive-glow'}`} strokeWidth={1.5} />
            )}
            {isAdmin ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.30)] font-ar text-[0.95rem]"
                placeholder="name@email.com"
                autoComplete="email"
              />
            ) : (
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                type="tel"
                className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.30)] font-ar text-[0.95rem]"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">{t('auth.password', 'كلمة المرور')}</label>
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-300 bg-[rgba(10,9,7,0.35)] ${
            fieldErrors.password
              ? 'border-sunset/50 focus-within:border-sunset shadow-[0_0_15px_rgba(232,168,124,0.05)]'
              : 'border-[rgba(212,197,169,0.12)] focus-within:border-[rgba(164,184,107,0.45)] focus-within:shadow-[0_0_20px_rgba(164,184,107,0.08)]'
          }`}>
            <LockKeyhole className={`w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${fieldErrors.password ? 'text-sunset' : 'text-olive-glow'}`} strokeWidth={1.5} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? 'text' : 'password'}
              className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.30)] font-ar text-[0.95rem]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="text-sand opacity-50 hover:opacity-100 transition-opacity shrink-0"
              aria-label="Show password"
            >
              {showPass ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <Eye className="w-[18px] h-[18px]" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[rgba(232,168,124,0.25)] bg-[rgba(232,168,124,0.07)] px-4 py-3 text-sand-light text-[0.9rem] font-ar flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sunset shrink-0" strokeWidth={2} />
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl px-5 py-4 bg-siwa-gold hover:bg-siwa-warm text-[#181009] font-ar font-bold text-base transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" strokeWidth={2} />
          {isSubmitting ? t('auth.signing_in', 'جاري الدخول…') : t('auth.sign_in', 'دخول')}
        </button>

        <div className="flex items-center justify-between gap-4 text-[0.85rem]">
          {isAdmin ? (
            <Link to="/auth/login" className="no-underline text-sand opacity-70 hover:text-cream hover:opacity-100 transition-colors font-ar">
              {t('auth.customer_login', 'دخول العملاء')}
            </Link>
          ) : (
            <Link to="/auth/login?admin=true" className="no-underline text-sand opacity-70 hover:text-cream hover:opacity-100 transition-colors font-ar">
              {t('auth.admin_login', 'دخول الإدارة')}
            </Link>
          )}
          <Link to="/auth/register" className="no-underline text-olive-glow hover:text-cream transition-colors font-ar flex items-center gap-1">
            {t('auth.create_account', 'إنشاء حساب')}
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
