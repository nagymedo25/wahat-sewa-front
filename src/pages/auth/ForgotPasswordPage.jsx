import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import AuthShell from '@/components/Layout/AuthShell.jsx';
import { useToast } from '@/store/toast.jsx';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error(t('auth.email_required_toast_forgot', 'أدخل البريد الإلكتروني أولاً'));
      return;
    }
    setDone(true);
    toast.success(t('auth.link_sent_toast', 'تم إرسال رابط الاستعادة (تجريبي)'));
  };

  return (
    <AuthShell title={t('auth.forgot_title', 'استعادة كلمة المرور')} subtitle={t('auth.forgot_subtitle', 'أدخل بريدك وسنرسل لك رابط الاستعادة.')}>
      {!done ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-sand-light text-[0.9rem] font-ar">{t('auth.email', 'البريد الإلكتروني')}</label>
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

          <button
            type="submit"
            className="w-full rounded-2xl px-5 py-4 bg-siwa-gold hover:bg-siwa-warm text-[#181009] font-ar font-bold text-base transition-all duration-300 shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            <span>{t('auth.send_reset', 'إرسال الرابط')}</span>
          </button>

          <div className="text-[0.85rem] text-siwa-cream/70 font-ar text-center">
            {t('auth.back_to', 'رجوع إلى')}{' '}
            <Link to="/auth/login" className="no-underline text-siwa-gold hover:text-siwa-warm transition-colors inline-flex items-center gap-1 font-bold">
              {t('auth.back_to_login', 'تسجيل الدخول')}
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[rgba(164,184,107,0.12)] border border-[rgba(164,184,107,0.25)]">
            <CheckCircle2 className="w-7 h-7 text-olive-glow" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-ar text-cream font-semibold text-[1.1rem]">{t('auth.sent_title', 'تم الإرسال')}</div>
            <div className="mt-2 rounded-2xl border border-[rgba(164,184,107,0.20)] bg-[rgba(164,184,107,0.06)] px-4 py-3 text-sand-light text-[0.9rem] font-ar flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-olive-glow shrink-0" strokeWidth={2} />
              {t('auth.sent_desc', 'تم إرسال رابط الاستعادة إلى: ')} <span className="text-cream font-en">{email}</span>
            </div>
          </div>
          <Link
            to="/auth/login"
            className="mt-2 inline-flex items-center gap-1 no-underline text-olive-glow hover:text-cream transition-colors font-ar text-[0.9rem]"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            {t('auth.back_to_login', 'تسجيل الدخول')}
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
