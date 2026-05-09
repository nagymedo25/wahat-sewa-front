import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import GlassShell from '@/components/Layout/GlassShell.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <GlassShell title="استعادة كلمة المرور" subtitle="أدخل بريدك وسنرسل لك رابط الاستعادة (واجهة تجريبية).">
      <div className="rounded-3xl border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.55)] [backdrop-filter:blur(22px)] p-8 max-w-[720px]">
        {!done ? (
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

            <button
              type="submit"
              className="rounded-2xl px-5 py-3 bg-[linear-gradient(135deg,rgba(74,90,42,0.55),rgba(164,184,107,0.22))] border border-[rgba(164,184,107,0.35)] text-cream font-ar font-semibold transition-all duration-300 hover:shadow-[0_18px_50px_rgba(164,184,107,0.10)] active:scale-[0.99]"
            >
              إرسال الرابط
            </button>

            <div className="text-[0.9rem] text-sand opacity-80">
              رجوع إلى{' '}
              <Link to="/auth/login" className="no-underline text-sand-light hover:text-cream transition-colors">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        ) : (
          <div>
            <div className="rounded-2xl border border-[rgba(164,184,107,0.25)] bg-[rgba(164,184,107,0.07)] px-4 py-3 text-sand-light">
              تم (تجريبياً) إرسال رابط الاستعادة إلى: <span className="text-cream">{email}</span>
            </div>
            <div className="mt-6 text-[0.9rem] text-sand opacity-80">
              تابع إلى{' '}
              <Link to="/auth/login" className="no-underline text-sand-light hover:text-cream transition-colors">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}
      </div>
    </GlassShell>
  );
}
