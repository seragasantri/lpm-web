import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'id', flag: '🇮🇩', name: 'Indonesian' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic' },
];

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleSwitch = (code: string) => {
    // Skip Google Translate entirely - use i18next instead
    setLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSwitch(lang.code)}
          title={lang.name}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all duration-200 ${
            currentLanguage === lang.code
              ? 'bg-white/20 ring-1 ring-white/50'
              : 'hover:bg-white/10 opacity-70 hover:opacity-100'
          }`}
          aria-label={`Switch to ${lang.name}`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
