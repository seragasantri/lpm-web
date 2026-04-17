import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  enabledLanguages: string[];
  setEnabledLanguages: (langs: string[]) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(() => {
    const stored = localStorage.getItem('enabled_languages');
    return stored ? JSON.parse(stored) : ['id', 'en', 'ar'];
  });

  const setLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    // Apply RTL for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n]);

  const handleSetEnabledLanguages = useCallback((langs: string[]) => {
    setEnabledLanguages(langs);
    localStorage.setItem('enabled_languages', JSON.stringify(langs));
  }, []);

  return (
    <LanguageContext.Provider value={{
      currentLanguage: i18n.language,
      setLanguage,
      enabledLanguages,
      setEnabledLanguages: handleSetEnabledLanguages,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}