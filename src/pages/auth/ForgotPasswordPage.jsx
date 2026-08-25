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
        <form onSubmit={onSubmit} className="flex flex-col gap-5 text-right">
          <div>
            <label className="block mb-2 text-[var(--text-secondary)] text-[0.88rem] font-bold font-ar">{t('auth.email', 'البريد الإلكتروني')}</label>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all duration-300 focus-within:border-[var(--border-accent)] focus-within:shadow-[var(--shadow-glow)]">
              <Mail className="w-[18px] h-[18px] text-[var(--siwa-earth)] shrink-0" strokeWidth={1.8} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-ar text-[0.95rem]"
                placeholder=""
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl px-5 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-ar font-bold text-base transition-all duration-300 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            <span>{t('auth.send_reset', 'إرسال الرابط')}</span>
          </button>

          <div className="text-[0.85rem] text-[var(--text-secondary)] font-ar text-center pt-2 border-t border-[var(--border-subtle)]">
            {t('auth.back_to', 'رجوع إلى')}{' '}
            <Link to="/auth/login" className="no-underline text-[var(--siwa-earth)] hover:text-[var(--action-primary)] transition-colors inline-flex items-center gap-1 font-bold">
              {t('auth.back_to_login', 'تسجيل الدخول')}
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--action-primary)]/10 border border-[var(--border-accent)] text-[var(--action-primary)]">
            <CheckCircle2 className="w-8 h-8" strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-ar text-[var(--text-primary)] font-bold text-[1.2rem]">{t('auth.sent_title', 'تم الإرسال')}</div>
            <div className="mt-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text-secondary)] text-[0.9rem] font-ar flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--action-primary)] shrink-0" strokeWidth={2} />
              <span>{t('auth.sent_desc', 'تم إرسال رابط الاستعادة إلى: ')} <span className="text-[var(--text-primary)] font-bold font-en">{email}</span></span>
            </div>
          </div>
          <Link
            to="/auth/login"
            className="mt-2 inline-flex items-center gap-1.5 no-underline text-[var(--siwa-earth)] hover:text-[var(--action-primary)] transition-colors font-ar font-bold text-[0.9rem]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span>{t('auth.back_to_login', 'تسجيل الدخول')}</span>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
