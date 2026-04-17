import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, FileText } from 'lucide-react';
import { getHalaman, updateHalaman } from '../../../lib/mockData';
import RichEditor from '../../components/RichEditor';

export default function ProfilLpm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ judul: '', konten: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Edit Profil LPM - Admin LPM';
    getHalaman().then((list) => {
      const page = list.find((p) => p.slug === 'profil');
      if (page) {
        setForm({ judul: page.judul, konten: page.konten });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateHalaman('profil', { konten: form.konten });
      setSaved(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch {
      setError('Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Profil LPM</h2>
              <p className="text-sky-200 text-sm mt-0.5">Kelola konten Profil Lembaga Penjaminan Mutu</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul</label>
            <input
              value={form.judul}
              readOnly
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div>
            <RichEditor
              label="Konten"
              value={form.konten}
              onChange={(html) => setForm((prev) => ({ ...prev, konten: html }))}
              placeholder="Tulis konten profil LPM di sini..."
            />
          </div>

          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
              Berhasil disimpan! Mengalihkan...
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
