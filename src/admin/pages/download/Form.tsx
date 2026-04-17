import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Save, AlertCircle } from 'lucide-react';
import type { DownloadFile } from '../../../lib/types';
import { getDownloads, createDownload, updateDownload } from '../../../lib/mockData';
import { useAuth } from '../../../context/AuthContext';
import SelectInput from '../../components/SelectInput';
import FileUpload from '../../components/FileUpload';

const TIPE_OPTIONS = ['PDF', 'DOC', 'XLS', 'ZIP', 'Link'] as const;

interface DownloadFormProps {
  editId?: string;
}

interface FormState {
  judul: string;
  tipe: string;
  ukuran: string;
  url: string;
  tanggal: string;
}

const EMPTY_FORM: FormState = {
  judul: '',
  tipe: 'PDF',
  ukuran: '',
  url: '',
  tanggal: new Date().toISOString().slice(0, 10),
};

export default function DownloadForm({ editId }: DownloadFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    getDownloads().then((list) => {
      const found = list.find((d) => d.id === editId);
      if (found) {
        setForm({
          judul: found.judul,
          tipe: found.tipe.toUpperCase() === 'LINK' ? 'Link' : found.tipe.toUpperCase(),
          ukuran: found.ukuran ?? '',
          url: found.url,
          tanggal: found.tanggal,
        });
      } else {
        setError('Data file tidak ditemukan.');
      }
    }).catch(() => setError('Gagal memuat data.')).finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.judul.trim()) { setError('Judul wajib diisi.'); return; }
    if (!form.url.trim()) { setError('URL wajib diisi.'); return; }
    if (!form.tanggal) { setError('Tanggal wajib diisi.'); return; }

    setLoading(true);
    try {
      const tipeNormalized = form.tipe.toLowerCase();
      const payload: Omit<DownloadFile, 'id' | 'createdAt'> = {
        judul: form.judul.trim(),
        tipe: tipeNormalized,
        ukuran: form.ukuran.trim() || undefined,
        url: form.url.trim(),
        tanggal: form.tanggal,
      };

      if (isEdit && editId) {
        await updateDownload(editId, payload);
      } else {
        await createDownload(payload);
      }
      navigate('/admin/download');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const showUkuran = form.tipe.toLowerCase() !== 'link';

function getAcceptForTipe(tipe: string): string {
  switch (tipe.toUpperCase()) {
    case 'PDF': return '.pdf,application/pdf';
    case 'DOC': return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'XLS': return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ZIP': return '.zip,application/zip';
    default: return '*/*';
  }
}

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
            onClick={() => navigate('/admin/download')}
            className="flex items-center gap-2 text-sky-200 hover:text-white text-sm font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Download
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Download size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {isEdit ? 'Edit File Download' : 'Tambah File Download'}
              </h1>
              <p className="text-sky-200 text-sm mt-0.5">
                {isEdit ? 'Perbarui informasi file unduhan' : 'Tambahkan file atau tautan unduhan baru'}
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
              <h2 className="text-base font-semibold text-slate-700">Informasi File</h2>
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
                  placeholder="Contoh: Formulir AMI Auditor 2026"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  required
                />
              </div>

              {/* Tipe + Ukuran row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tipe <span className="text-red-500">*</span>
                  </label>
                  <SelectInput
                    name="tipe"
                    value={form.tipe}
                    onChange={(val) => setForm((prev) => ({ ...prev, tipe: val }))}
                    options={TIPE_OPTIONS.map((t) => ({ value: t, label: t }))}
                    placeholder="Pilih Tipe"
                  />
                </div>

                {showUkuran && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Ukuran File
                    </label>
                    <input
                      type="text"
                      name="ukuran"
                      value={form.ukuran}
                      onChange={handleChange}
                      placeholder="Contoh: 1.2 MB"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    />
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div>
                {form.tipe === 'Link' ? (
                  <>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      URL / Tautan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="url"
                      value={form.url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      required
                    />
                    <p className="mt-1.5 text-xs text-slate-400">Masukkan tautan langsung ke file atau halaman unduhan.</p>
                  </>
                ) : (
                  <FileUpload
                    label="File"
                    value={form.url}
                    onChange={(url) => setForm(prev => ({ ...prev, url }))}
                    accept={getAcceptForTipe(form.tipe)}
                    placeholder="Seret file ke sini atau klik untuk memilih"
                    helperText={`Format: ${form.tipe}, Maks 10MB.`}
                    preview={false}
                  />
                )}
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
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/download')}
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
                    {isEdit ? 'Simpan Perubahan' : 'Tambah File'}
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
