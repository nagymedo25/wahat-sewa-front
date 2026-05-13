import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, LogIn, Sparkles, ArrowLeft } from 'lucide-react';
import AuthShell from '@/components/Layout/AuthShell.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('next') || '/shop';
  }, [location.search]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('من فضلك أدخل البريد الإلكتروني.');
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }
    if (!password.trim()) {
      setError('من فضلك أدخل كلمة المرور.');
      toast.error('كلمة المرور مطلوبة');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    if (result.success) {
      toast.success(`أهلاً بك مجدداً`);
      navigate(result.user?.role === 'admin' ? '/admin/dashboard' : nextPath, { replace: true });
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <AuthShell title="تسجيل الدخول" subtitle="ادخل للمتجر بتجربة راقية ولمسة سينمائية.">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">البريد الإلكتروني</label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.12)] bg-[rgba(10,9,7,0.35)] transition-all duration-300 focus-within:border-[rgba(164,184,107,0.45)] focus-within:shadow-[0_0_20px_rgba(164,184,107,0.08)]">
            <Mail className="w-[18px] h-[18px] text-olive-glow shrink-0" strokeWidth={1.5} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.30)] font-ar text-[0.95rem]"
              placeholder="name@email.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">كلمة المرور</label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.12)] bg-[rgba(10,9,7,0.35)] transition-all duration-300 focus-within:border-[rgba(164,184,107,0.45)] focus-within:shadow-[0_0_20px_rgba(164,184,107,0.08)]">
            <LockKeyhole className="w-[18px] h-[18px] text-olive-glow shrink-0" strokeWidth={1.5} />
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
          className="group relative overflow-hidden rounded-2xl px-5 py-3.5 bg-[linear-gradient(135deg,rgba(74,90,42,0.60),rgba(164,184,107,0.25))] border border-[rgba(164,184,107,0.40)] text-cream font-ar font-semibold transition-all duration-300 hover:shadow-[0_18px_50px_rgba(164,184,107,0.14)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          <LogIn className="w-[18px] h-[18px]" strokeWidth={2} />
          {isSubmitting ? 'جاري الدخول…' : 'دخول'}
        </button>

        <div className="flex items-center justify-between gap-4 text-[0.85rem]">
          <Link to="/auth/forgot" className="no-underline text-sand opacity-70 hover:text-cream hover:opacity-100 transition-colors font-ar">
            نسيت كلمة المرور؟
          </Link>
          <Link to="/auth/register" className="no-underline text-olive-glow hover:text-cream transition-colors font-ar flex items-center gap-1">
            إنشاء حساب
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
