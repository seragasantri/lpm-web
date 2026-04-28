import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, UserCircle2, Image as ImageIcon } from 'lucide-react';
import { getSambutan, updateSambutan } from '../../../lib/api';
import FileUpload from '../../components/FileUpload';
import RichEditor from '../../components/RichEditor';

export default function ProfilSambutan() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: '',
    jabatan: '',
    konten: '',
    foto: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    document.title = 'Edit Sambutan Ketua - Admin LPM';
    getSambutan().then((data) => {
      setForm({
        nama: data?.nama ?? '',
        jabatan: data?.jabatan ?? '',
        konten: data?.konten ?? '',
        foto: data?.foto ?? '',
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.nama.trim()) { setError('Nama wajib diisi.'); return; }
    if (!form.jabatan.trim()) { setError('Jabatan wajib diisi.'); return; }

    setSaving(true);
    try {
      await updateSambutan({
        nama: form.nama.trim(),
        jabatan: form.jabatan.trim(),
        konten: form.konten.trim(),
        foto: form.foto || undefined,
      });
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
              <UserCircle2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Sambutan Ketua</h2>
              <p className="text-sky-200 text-sm mt-0.5">Kelola informasi Sambutan Ketua LPM</p>
            </div>
          </div>
        </div>

        {/* Foto Preview */}
        {form.foto && !previewError ? (
          <div className="relative h-40 bg-gradient-to-br from-sky-50 to-slate-100 flex items-center justify-center border-b border-slate-100">
            <img
              src={form.foto}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-sky-50 to-slate-100 flex items-center justify-center border-b border-slate-100">
            <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
              {previewError ? (
                <ImageIcon size={32} className="text-slate-300" />
              ) : (
                <UserCircle2 size={40} className="text-sky-200" />
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Dr. H. Ahmad Fauzi, M.Ag."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jabatan"
              value={form.jabatan}
              onChange={handleChange}
              placeholder="Contoh: Ketua LPM UIN Raden Fatah Palembang"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Konten Sambutan
            </label>
            <RichEditor
              value={form.konten}
              onChange={(html) => setForm((prev) => ({ ...prev, konten: html }))}
              placeholder="Tulis konten sambutan di sini..."
            />
          </div>

          <FileUpload
            label="Foto Ketua"
            value={form.foto}
            onChange={(url) => { setForm((prev) => ({ ...prev, foto: url })); setPreviewError(false); }}
            accept="image/*"
            placeholder="Seret foto ke sini atau klik untuk memilih"
            helperText="Rasio 1:1 direkomendasikan. Format: JPG, PNG."
          />

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
