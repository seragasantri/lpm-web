const LANGUAGES = [
  { code: 'id', flag: '🇮🇩', name: 'Indonesian' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic' },
];

const GT_LANG_MAP: Record<string, string> = {
  id: 'id',
  en: 'en',
  ar: 'ar',
};

export default function LanguageSwitcher() {
  const switchLang = (code: string) => {
    localStorage.setItem('gt_lang', code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;

    // Skip Google Translate for admin routes
    if (window.location.pathname.startsWith('/admin')) return;

    // Build URL with Google Translate cookie
    const url = new URL(window.location.href);
    url.searchParams.set('lang', GT_LANG_MAP[code] || 'id');

    // Set cookie for Google Translate
    document.cookie = `googtrans=/id/${GT_LANG_MAP[code] || 'id'}; path=/`;
    document.cookie = `googbert=/id/${GT_LANG_MAP[code] || 'id'}; path=/`;

    // Reload to apply
    window.location.href = url.toString();
  };

  const currentLang = localStorage.getItem('gt_lang') || 'id';

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLang(lang.code)}
          title={lang.name}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all duration-200 ${
            currentLang === lang.code
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