import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  enabledLanguages: string[];
  setEnabledLanguages: (langs: string[]) => void;
  refreshTrigger: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Global event for language change - used by apiFetch to re-request
export function dispatchLanguageChange() {
  window.dispatchEvent(new CustomEvent('language-changed'));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<string>(() =>
    localStorage.getItem('language') || 'id'
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>(() => {
    const stored = localStorage.getItem('enabled_languages');
    return stored ? JSON.parse(stored) : ['id', 'en', 'ar'];
  });

  const setLanguage = useCallback((lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Trigger re-render + re-fetch across the app
    setRefreshTrigger(n => n + 1);
    dispatchLanguageChange();
  }, []);

  const handleSetEnabledLanguages = useCallback((langs: string[]) => {
    setEnabledLanguages(langs);
    localStorage.setItem('enabled_languages', JSON.stringify(langs));
  }, []);

  return (
    <LanguageContext.Provider value={{
      currentLanguage: currentLang,
      setLanguage,
      enabledLanguages,
      setEnabledLanguages: handleSetEnabledLanguages,
      refreshTrigger,
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

// Hook for pages to re-fetch when language changes
export function useLanguageRefresh() {
  const { refreshTrigger } = useLanguage();
  return refreshTrigger;
}