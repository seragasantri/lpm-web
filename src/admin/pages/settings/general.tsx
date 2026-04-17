import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getSettings, updateSettings } from '../../../lib/api';
import { Settings, Globe, Check, Loader } from 'lucide-react';

const LANGUAGES = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'Bahasa Inggris', flag: '🇬🇧' },
  { code: 'ar', label: 'Bahasa Arab', flag: '🇸🇦' },
];

export default function GeneralSettings() {
  useEffect(() => { document.title = 'Pengaturan Umum :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [enabled, setEnabled] = useState<string[]>(['id', 'en', 'ar']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hasPermission('user.read')) { setLoading(false); return; }

    getSettings().then(data => {
      const langs = data.enabled_languages
        ? JSON.parse(data.enabled_languages as unknown as string)
        : ['id', 'en', 'ar'];
      setEnabled(langs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [hasPermission]);

  const toggleLang = (code: string) => {
    setEnabled(prev =>
      prev.includes(code)
        ? prev.filter(l => l !== code)
        : [...prev, code]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (enabled.length === 0) {
      alert('Minimal satu bahasa harus aktif.');
      return;
    }
    setSaving(true);
    try {
      await updateSettings({ enabled_languages: enabled });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (!hasPermission('user.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        <p className="font-semibold">Akses Ditolak</p>
        <p className="text-sm mt-1">Halaman ini hanya dapat diakses oleh Super Admin.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center gap-4 shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Pengaturan Umum</h1>
          <p className="text-sky-100 text-sm mt-0.5">Kelola bahasa yang aktif di frontend</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-800">BahasaFrontend</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Centang bahasa yang ingin ditampilkan di frontend. Bahasa Indonesia adalah bahasa default.
            </p>

            <div className="space-y-3">
              {LANGUAGES.map((lang) => {
                const isEnabled = enabled.includes(lang.code);
                const isDefault = lang.code === 'id';
                return (
                  <label
                    key={lang.code}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isEnabled
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${isDefault ? 'opacity-70' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      isEnabled ? 'bg-sky-500' : 'border-2 border-slate-300'
                    }`}>
                      {isEnabled && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800">{lang.label}</span>
                      {isDefault && (
                        <span className="ml-2 text-xs text-sky-600 font-medium">(Default)</span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => !isDefault && toggleLang(lang.code)}
                      disabled={isDefault}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl text-sm font-bold hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check size={16} />}
              {saved ? 'Tersimpan!' : 'Simpan Pengaturan'}
            </button>

            {saved && (
              <p className="mt-3 text-sm text-green-600 font-medium">
                Pengaturan berhasil disimpan.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}