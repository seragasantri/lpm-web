import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Images, Save, AlertCircle } from 'lucide-react';
import type { Galeri } from '../../../lib/types';
import { getGaleri, createGaleri, updateGaleri } from '../../../lib/mockData';
import { useAuth } from '../../../context/AuthContext';
import SelectInput from '../../components/SelectInput';
import FileUpload from '../../components/FileUpload';

const KATEGORI_OPTIONS = ['Audit', 'Workshop', 'Pelatihan', 'Lainnya'] as const;

interface GaleriFormProps {
  editId?: string;
}

interface FormState {
  judul: string;
  kategori: string;
  tanggal: string;
  gambar: string;
}

const EMPTY_FORM: FormState = {
  judul: '',
  kategori: 'Audit',
  tanggal: new Date().toISOString().slice(0, 10),
  gambar: '',
};

export default function GaleriForm({ editId }: GaleriFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    getGaleri().then((list) => {
      const found = list.find((g) => g.id === editId);
      if (found) {
        setForm({
          judul: found.judul,
          kategori: found.kategori,
          tanggal: found.tanggal,
          gambar: found.gambar ?? '',
        });
      } else {
        setError('Data galeri tidak ditemukan.');
      }
    }).catch(() => setError('Gagal memuat data.')).finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'gambar') setPreviewError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.judul.trim()) { setError('Judul wajib diisi.'); return; }
    if (!form.tanggal) { setError('Tanggal wajib diisi.'); return; }

    setLoading(true);
    try {
      const payload: Omit<Galeri, 'id' | 'createdAt'> = {
        judul: form.judul.trim(),
        kategori: form.kategori,
        tanggal: form.tanggal,
        gambar: form.gambar.trim(),
      };

      if (isEdit && editId) {
        await updateGaleri(editId, payload);
      } else {
        await createGaleri(payload);
      }
      navigate('/admin/galeri');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/admin/galeri')}
            className="flex items-center gap-2 text-sky-200 hover:text-white text-sm font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Galeri
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Images size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {isEdit ? 'Edit Galeri' : 'Tambah Galeri'}
              </h1>
              <p className="text-sky-200 text-sm mt-0.5">
                {isEdit ? 'Perbarui informasi item galeri' : 'Tambahkan foto atau dokumentasi kegiatan baru'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-700">Informasi Galeri</h2>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Judul */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Workshop OBE Semester Genap 2026"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <SelectInput
                  name="kategori"
                  value={form.kategori}
                  onChange={(val) => setForm((prev) => ({ ...prev, kategori: val }))}
                  options={KATEGORI_OPTIONS.map((k) => ({ value: k, label: k }))}
                  placeholder="Pilih Kategori"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  required
                />
              </div>

              {/* Gambar */}
              <div>
                <FileUpload
                  label="Gambar"
                  value={form.gambar}
                  onChange={(url) => { setForm(prev => ({ ...prev, gambar: url })); setPreviewError(false); }}
                  accept="image/*"
                  placeholder="Seret gambar ke sini atau klik untuk memilih"
                  helperText="Format: JPG, PNG, WebP. Maks 5MB."
                />
                {previewError && (
                  <p className="mt-1.5 text-xs text-red-500">Gambar tidak valid. Silakan pilih file lain.</p>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/galeri')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isEdit ? 'Simpan Perubahan' : 'Tambah Galeri'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Meta info */}
        {user && (
          <p className="text-center text-xs text-slate-400 mt-4">
            Disimpan oleh: <span className="font-medium text-slate-500">{user.username}</span>
          </p>
        )}
      </div>
    </div>
  );
}
