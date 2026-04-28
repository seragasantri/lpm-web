import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHeroSettings, updateHeroSettings, uploadImage } from '../../../lib/api';
import { Monitor, Save, Loader, Upload, X, Image } from 'lucide-react';

export default function HeroIndex() {
  useEffect(() => { document.title = 'Pengaturan Hero :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await getHeroSettings();
        if (data) {
          setTitle(data.title || '');
          setSubtitle(data.subtitle || '');
          setBackgroundUrl(data.background_url || '');
          setVideoUrl(data.video_url || '');
          setCtaText(data.cta_text || '');
          setCtaLink(data.cta_link || '');
          setIsActive(data.is_active ?? true);
        }
      } catch (err) {
        console.error('Gagal memuat setting hero:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHeroSettings({
        title,
        subtitle,
        background_url: backgroundUrl,
        video_url: videoUrl,
        cta_text: ctaText,
        cta_link: ctaLink,
        is_active: isActive,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'background' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      if (field === 'background') {
        setBackgroundUrl(result.url);
      } else {
        setVideoUrl(result.url);
      }
    } catch (err) {
      console.error('Gagal upload:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  if (!hasPermission('hero.update')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        Anda tidak memiliki akses untuk mengelola hero.
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Pengaturan Hero Section</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola tampilan hero di halaman utama</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-6 p-6">
        {/* Title & Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Hero</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Sinergi Menuju..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub Judul</label>
            <input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Membangun budaya mutu..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gambar Background</label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              {backgroundUrl ? (
                <img src={backgroundUrl} alt="Background" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
              <Upload size={16} />
              Upload Gambar
              <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'background')} disabled={uploading} />
            </label>
            {backgroundUrl && (
              <button
                type="button"
                onClick={() => setBackgroundUrl('')}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <input
            type="url"
            value={backgroundUrl}
            onChange={e => setBackgroundUrl(e.target.value)}
            placeholder="Atau masukkan URL gambar"
            className="mt-2 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Video Profil</label>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/embed/..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          <p className="text-xs text-slate-500 mt-1">Masukkan URL video YouTube/Vimeo untuk video profil</p>
        </div>

        {/* CTA Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teks Tombol CTA</label>
            <input
              value={ctaText}
              onChange={e => setCtaText(e.target.value)}
              placeholder="Jelajahi Profil"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link CTA</label>
            <input
              type="url"
              value={ctaLink}
              onChange={e => setCtaLink(e.target.value)}
              placeholder="/profil"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
          <span className="text-sm font-semibold text-slate-700">Tampilkan Hero</span>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
            Pengaturan berhasil disimpan!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving || uploading} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
