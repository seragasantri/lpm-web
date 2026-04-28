import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, GitBranch, Image as ImageIcon, FileText } from 'lucide-react';
import { getStruktur, updateStruktur } from '../../../lib/api';
import FileUpload from '../../components/FileUpload';

export default function ProfilStruktur() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    deskripsi: '',
    gambar: '',
    filePdf: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  useEffect(() => {
    document.title = 'Edit Struktur Organisasi - Admin LPM';
    getStruktur().then((data) => {
      if (data) {
        setForm({
          deskripsi: data.deskripsi || '',
          gambar: data.gambar || '',
          filePdf: data.file_pdf || '',
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.deskripsi.trim()) { setError('Deskripsi wajib diisi.'); return; }

    setSaving(true);
    try {
      await updateStruktur({
        deskripsi: form.deskripsi.trim(),
        gambar: form.gambar || undefined,
        file_pdf: form.filePdf || undefined,
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
              <GitBranch size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Struktur Organisasi</h2>
              <p className="text-sky-200 text-sm mt-0.5">Kelola informasi Struktur Organisasi LPM</p>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm((prev) => ({ ...prev, deskripsi: e.target.value }))}
              rows={4}
              placeholder="Tulis deskripsi struktur organisasi di sini..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gambar Struktur</label>
            {form.gambar && !imagePreviewError ? (
              <div className="relative mb-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={form.gambar}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            ) : form.gambar ? (
              <div className="flex items-center gap-3 mb-2 p-4 bg-red-50 rounded-xl border border-red-200">
                <ImageIcon size={20} className="text-red-400" />
                <span className="text-sm text-red-600">Gambar tidak valid.</span>
                <button
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, gambar: '' })); setImagePreviewError(false); }}
                  className="ml-auto text-xs text-sky-600 hover:text-sky-700"
                >
                  Hapus
                </button>
              </div>
            ) : null}

            <FileUpload
              value={form.gambar}
              onChange={(url) => { setForm((prev) => ({ ...prev, gambar: url })); setImagePreviewError(false); }}
              accept="image/*"
              placeholder="Seret gambar ke sini atau klik untuk memilih"
              helperText="Format: JPG, PNG. Ukuran maksimal 5MB."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">File PDF Struktur</label>
            {form.filePdf && (
              <div className="flex items-center gap-3 mb-2 p-4 bg-sky-50 rounded-xl border border-sky-200">
                <FileText size={20} className="text-sky-500" />
                <span className="text-sm font-medium text-slate-700 truncate">
                  {form.filePdf.substring(0, 60)}...
                </span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, filePdf: '' }))}
                  className="ml-auto text-xs text-red-500 hover:text-red-600"
                >
                  Hapus
                </button>
              </div>
            )}
            <FileUpload
              value={form.filePdf}
              onChange={(url) => setForm((prev) => ({ ...prev, filePdf: url }))}
              accept=".pdf,application/pdf"
              placeholder="Seret file PDF ke sini atau klik untuk memilih"
              helperText="Format: PDF. Ukuran maksimal 10MB."
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
