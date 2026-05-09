import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';
import { useAuth } from '@/store/auth.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('من فضلك أكمل البيانات.');
      return;
    }

    login({ name: name.trim(), email: email.trim() });
    navigate('/shop', { replace: true });
  };

  return (
    <GlassShell title="إنشاء حساب" subtitle="حسابك يفتح لك تجربة شراء أسرع وواجهة حساب مرتبة.">
      <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(22px)] p-8 max-w-[720px]">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-sand-light">الاسم</label>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[rgba(212,197,169,0.14)] bg-[rgba(10,9,7,0.35)]">
              <User className="w-4 h-4 text-olive-glow" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.35)]"
                placeholder="اسمك"
                autoComplete="name"
              />
            </div>
          </div>

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
                autoComplete="new-password"
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
            إنشاء
          </button>

          <div className="text-[0.9rem] text-sand opacity-80">
            لديك حساب؟{' '}
            <Link to="/auth/login" className="no-underline text-sand-light hover:text-cream transition-colors">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </GlassShell>
  );
}
