import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getHalaman, updateHalaman } from '../../../lib/mockData';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import FileUpload from '../../components/FileUpload';
import RichEditor from '../../components/RichEditor';

export default function StrukturIndex() {
  useEffect(() => { document.title = 'Edit Struktur :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const [konten, setKonten] = useState('');
  const [gambar, setGambar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHalaman().then(list => {
      const page = list.find(p => p.slug === 'struktur');
      if (page) {
        setKonten(page.konten);
        // try to extract image URL from konten if it looks like an img tag
        const imgMatch = page.konten.match(/<img[^>]+src=["']([^"']+)["']/);
        if (imgMatch) setGambar(imgMatch[1]);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fullKonten = gambar
        ? `<img src="${gambar}" alt="Struktur Organisasi" />\n${konten}`
        : konten;
      await updateHalaman('struktur', { konten: fullKonten });
      setSaved(true);
      setTimeout(() => navigate('/admin/halaman'), 1500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  if (!hasPermission('halaman.update')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        Anda tidak memiliki akses untuk mengedit struktur organisasi.
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate('/admin/halaman')} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Edit Struktur Organisasi</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <FileUpload
              label="Gambar Struktur"
              value={gambar}
              onChange={(url) => setGambar(url)}
              accept="image/*"
              placeholder="Seret gambar ke sini atau klik untuk memilih"
              helperText="Format: JPG, PNG, WebP. Maks 5MB."
            />
          </div>
          <div>
            <RichEditor
              label="Konten / Keterangan"
              value={konten}
              onChange={(html) => setKonten(html)}
              placeholder="Tulis keterangan struktur organisasi di sini..."
            />
          </div>
          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
              Berhasil disimpan! Mengalihkan...
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/admin/halaman')} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
