import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, UserCircle, LockKeyhole, Eye, EyeOff, UserPlus, Sparkles, ArrowLeft } from 'lucide-react';
import AuthShell from '@/components/Layout/AuthShell.jsx';
import { useAuth } from '@/store/auth.jsx';
import { useToast } from '@/store/toast.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('من فضلك أدخل اسمك.');
      toast.error('الاسم مطلوب');
      return;
    }
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
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      toast.error('كلمة المرور قصيرة جداً');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login({ name: name.trim(), email: email.trim() });
      toast.success(`أهلاً ${name.trim()}، تم إنشاء حسابك`);
      setIsSubmitting(false);
      navigate('/shop', { replace: true });
    }, 600);
  };

  return (
    <AuthShell title="إنشاء حساب" subtitle="حسابك يفتح لك تجربة شراء أسرع وواجهة حساب مرتبة.">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">الاسم</label>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[rgba(212,197,169,0.12)] bg-[rgba(10,9,7,0.35)] transition-all duration-300 focus-within:border-[rgba(164,184,107,0.45)] focus-within:shadow-[0_0_20px_rgba(164,184,107,0.08)]">
            <UserCircle className="w-[18px] h-[18px] text-olive-glow shrink-0" strokeWidth={1.5} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full bg-transparent outline-none text-cream placeholder:text-[rgba(245,239,227,0.30)] font-ar text-[0.95rem]"
              placeholder="اسمك الكريم"
              autoComplete="name"
            />
          </div>
        </div>

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
              autoComplete="new-password"
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
          <UserPlus className="w-[18px] h-[18px]" strokeWidth={2} />
          {isSubmitting ? 'جاري الإنشاء…' : 'إنشاء حساب'}
        </button>

        <div className="text-[0.85rem] text-sand opacity-70 font-ar text-center">
          لديك حساب؟{' '}
          <Link to="/auth/login" className="no-underline text-olive-glow hover:text-cream transition-colors inline-flex items-center gap-1">
            تسجيل الدخول
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
