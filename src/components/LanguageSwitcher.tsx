import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'id', label: 'ID', flag: '🇮🇩', name: 'Bahasa Indonesia' },
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'ar', label: 'AR', flag: '🇸🇦', name: 'العربية' },
];

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, enabledLanguages } = useLanguage();

  const activeLangs = LANGUAGES.filter(l => enabledLanguages.includes(l.code));

  if (activeLangs.length <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      {activeLangs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          title={lang.name}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all duration-200 ${
            currentLanguage === lang.code
              ? 'bg-white/20 ring-1 ring-white/50'
              : 'hover:bg-white/10 opacity-70 hover:opacity-100'
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}