import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useAuth } from '@/store/auth.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('next') || '/shop';
  }, [location.search]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('من فضلك أدخل البريد وكلمة المرور.');
      return;
    }

    login({ email: email.trim() });
    navigate(nextPath, { replace: true });
  };

  return (
    <GlassShell title="تسجيل الدخول" subtitle="ادخل للمتجر بتجربة راقية ولمسة سينمائية.">
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(22px)] p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-2 text-sand-light">البريد الإلكتروني</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
                <Mail className="w-4 h-4 text-olive-glow" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.35)]"
                  placeholder="name@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sand-light">كلمة المرور</label>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
                <Lock className="w-4 h-4 text-olive-glow" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.35)]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-sand opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Show password"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-[rgba(232,168,124,0.25)] bg-[rgba(232,168,124,0.07)] px-4 py-3 text-sand-light">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.22))] border border-[rgba(164,184,107,0.35)] text-cream font-ar font-semibold transition-all duration-300 hover:shadow-[0_18px_50px_rgba(164,184,107,0.10)] active:scale-[0.99]"
            >
              دخول
            </button>

            <div className="flex items-center justify-between gap-4 text-[0.9rem] text-sand opacity-80">
              <Link to="/auth/forgot" className="no-underline text-sand-light hover:text-cream transition-colors">
                نسيت كلمة المرور؟
              </Link>
              <Link to="/auth/register" className="no-underline text-sand-light hover:text-cream transition-colors">
                إنشاء حساب
              </Link>
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-[rgba(212,197,169,0.10)] bg-[linear-gradient(135deg,rgba(26,24,20,0.55),rgba(10,9,7,0.35))] [backdrop-filter:blur(18px)] p-8 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(164,184,107,0.14)_0%,transparent_70%)] blur-2xl" />
          <div className="absolute -bottom-28 -left-24 w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(232,168,124,0.10)_0%,transparent_70%)] blur-2xl" />

          <div className="relative">
            <h2 className="font-ar text-[1.4rem] text-cream font-semibold">أهلاً بك</h2>
            <p className="mt-3 text-sand opacity-80 leading-[1.9]">
              المتجر الداخلي مصمم لتجربة سريعة وسلسة: سلة، Checkout، حساب، ومتابعة الطلب.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4">
                <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Secure</div>
                <div className="mt-2 text-sand-light">جلسة محفوظة</div>
              </div>
              <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4">
                <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Fast</div>
                <div className="mt-2 text-sand-light">تنقّل سريع</div>
              </div>
              <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4">
                <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Design</div>
                <div className="mt-2 text-sand-light">لمسة فنية</div>
              </div>
              <div className="rounded-2xl border border-[rgba(212,197,169,0.10)] bg-[rgba(26,24,20,0.35)] p-4">
                <div className="font-en tracking-[0.35em] text-[0.7rem] text-olive-glow opacity-70 uppercase">Cart</div>
                <div className="mt-2 text-sand-light">سلة ذكية</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassShell>
  );
}
