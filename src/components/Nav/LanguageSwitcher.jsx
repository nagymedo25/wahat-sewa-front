import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();

  const handleSwitch = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    document.dispatchEvent(new CustomEvent('trigger-page-transition', {
      detail: {
        action: async () => {
          await changeLanguage(newLang);
          await new Promise(r => setTimeout(r, 100)); // allow re-render
        }
      }
    }));
  };

  return (
    <button
      onClick={handleSwitch}
      className="nav-piece group relative flex items-center justify-center gap-1.5 w-[36px] h-[36px] rounded-full bg-[rgba(26,24,20,0.55)] border border-[rgba(212,197,169,0.12)] cursor-pointer transition-all duration-300 hover:border-[rgba(164,184,107,0.4)] hover:bg-[rgba(74,90,42,0.2)] hover:shadow-[0_0_15px_rgba(164,184,107,0.15)] active:scale-95"
      title={lang === 'ar' ? 'English' : 'العربية'}
    >
      <Globe className="w-[16px] h-[16px] text-sand-light group-hover:text-cream transition-colors" strokeWidth={1.5} />
      <span className="absolute -bottom-6 text-[0.6rem] font-bold text-sand-light opacity-0 group-hover:opacity-100 transition-opacity">
        {lang === 'ar' ? 'EN' : 'AR'}
      </span>
    </button>
  );
}
