import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Save, AlertCircle, UserCircle2, ImageIcon } from 'lucide-react';
import { getStafs, getStafById, createStaf, updateStaf } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import FileUpload from '../../components/FileUpload';

interface FormState {
  nama: string;
  jabatan: string;
  program_studi: string;
  email: string;
  foto: string;
  urutan: number;
}

const EMPTY_FORM: FormState = {
  nama: '',
  jabatan: '',
  program_studi: '',
  email: '',
  foto: '',
  urutan: 1,
};

export default function StafForm({ editId }: { editId?: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!editId) {
      getStafs().then((list) => {
        const maxUrutan = list.reduce((max, s) => Math.max(max, s.urutan), 0);
        setForm((prev) => ({ ...prev, urutan: maxUrutan + 1 }));
      });
      return;
    }
    setFetching(true);
    const id = parseInt(editId);
    if (isNaN(id)) {
      setError('ID staf tidak valid.');
      setFetching(false);
      return;
    }
    getStafById(id).then((found) => {
      setForm({
        nama: found.nama,
        jabatan: found.jabatan,
        program_studi: found.program_studi || '',
        email: found.email || '',
        foto: found.foto || '',
        urutan: found.urutan,
      });
    }).catch(() => setError('Gagal memuat data.')).finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'urutan' ? Number(value) : value }));
    if (name === 'foto') setPreviewError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nama.trim()) { setError('Nama wajib diisi.'); return; }
    if (!form.jabatan.trim()) { setError('Jabatan wajib diisi.'); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Format email tidak valid.'); return;
    }

    setLoading(true);
    try {
      const payload = {
        nama: form.nama.trim(),
        jabatan: form.jabatan.trim(),
        program_studi: form.program_studi.trim() || undefined,
        email: form.email.trim() || undefined,
        foto: form.foto.trim() || undefined,
        urutan: form.urutan,
      };

      if (isEdit && editId) {
        await updateStaf(parseInt(editId), payload);
      } else {
        await createStaf(payload);
      }
      navigate('/admin/staf');
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
            onClick={() => navigate('/admin/staf')}
            className="flex items-center gap-2 text-sky-200 hover:text-white text-sm font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Staf
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {isEdit ? 'Edit Data Staf' : 'Tambah Staf Baru'}
              </h1>
              <p className="text-sky-200 text-sm mt-0.5">
                {isEdit ? 'Perbarui informasi anggota staf' : 'Tambahkan anggota staf LPM baru'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Foto Preview Banner */}
            {form.foto && !previewError && (
              <div className="relative h-32 bg-gradient-to-br from-sky-50 to-slate-100 flex items-center justify-center border-b border-slate-100">
                <img
                  src={form.foto}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
            {(!form.foto || previewError) && (
              <div className="h-32 bg-gradient-to-br from-sky-50 to-slate-100 flex items-center justify-center border-b border-slate-100">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                  {previewError ? (
                    <ImageIcon size={28} className="text-slate-300" />
                  ) : (
                    <UserCircle2 size={36} className="text-sky-200" />
                  )}
                </div>
              </div>
            )}

            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-700">Data Staf</h2>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nama */}
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

              {/* Jabatan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  placeholder="Contoh: Ketua LPM"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  required
                />
              </div>

              {/* Program Studi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Unit/Bagian
                </label>
                <input
                  type="text"
                  name="program_studi"
                  value={form.program_studi}
                  onChange={handleChange}
                  placeholder="Contoh: Administrasi, Keuangan, Mutu Internal"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Contoh: staf@lpm.ac.id"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              {/* Foto */}
              <FileUpload
                label="Foto Profil"
                value={form.foto}
                onChange={(url) => { setForm(prev => ({ ...prev, foto: url })); setPreviewError(false); }}
                accept="image/*"
                placeholder="Seret foto ke sini atau klik untuk memilih"
                helperText="Rasio 1:1 direkomendasikan. Format: JPG, PNG."
              />
              {previewError && (
                <p className="mt-1.5 text-xs text-red-500">Gambar tidak valid. Silakan pilih file lain.</p>
              )}

              {/* Urutan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  name="urutan"
                  value={form.urutan}
                  onChange={handleChange}
                  min={1}
                  className="w-32 px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-400">Angka kecil tampil lebih awal.</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/staf')}
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
                    {isEdit ? 'Simpan Perubahan' : 'Tambah Staf'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {user && (
          <p className="text-center text-xs text-slate-400 mt-4">
            Disimpan oleh: <span className="font-medium text-slate-500">{user.username}</span>
          </p>
        )}
      </div>
    </div>
  );
}