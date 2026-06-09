import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n: i18nInstance } = useTranslation();
  const [lang, setLang] = useState(i18nInstance.language || 'ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLanguage = async (newLang) => {
    await i18nInstance.changeLanguage(newLang);
    setLang(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
