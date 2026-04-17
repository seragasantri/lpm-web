import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, FileCheck } from 'lucide-react';
import SelectInput from '../../../components/SelectInput';
import FileUpload from '../../../components/FileUpload';
import { createIso, updateIso, getIso } from '../../../../lib/mockData';
import type { IsoMilestone } from '../../../../lib/types';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Tuntas' },
  { value: 'current', label: 'Berjalan' },
  { value: 'upcoming', label: 'Mendatang' },
];

interface FormState {
  tahun: string;
  judul: string;
  deskripsi: string;
  status: string;
  dokumen: string;
  linkEksternal: string;
  urutan: number;
}

const EMPTY_FORM: FormState = {
  tahun: '',
  judul: '',
  deskripsi: '',
  status: 'current',
  dokumen: '',
  linkEksternal: '',
  urutan: 1,
};

export default function SpmeIsoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      getIso().then((list) => {
        const maxUrutan = list.reduce((max, i) => Math.max(max, i.urutan), 0);
        setForm(prev => ({ ...prev, urutan: maxUrutan + 1 }));
      });
      return;
    }
    setFetching(true);
    getIso().then((list) => {
      const found = list.find(i => i.id === id);
      if (found) {
        setForm({
          tahun: found.tahun,
          judul: found.judul,
          deskripsi: found.deskripsi,
          status: found.status,
          dokumen: Array.isArray(found.dokumen) ? (found.dokumen[0] ?? '') : (found.dokumen ?? ''),
          linkEksternal: found.linkEksternal ?? '',
          urutan: found.urutan,
        });
      } else {
        setError('Data tidak ditemukan.');
      }
    }).catch(() => setError('Gagal memuat data.')).finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'urutan' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.tahun.trim()) { setError('Tahun wajib diisi.'); return; }
    if (!form.judul.trim()) { setError('Judul wajib diisi.'); return; }
    if (!form.deskripsi.trim()) { setError('Deskripsi wajib diisi.'); return; }

    setLoading(true);
    try {
      const payload = {
        tahun: form.tahun.trim(),
        judul: form.judul.trim(),
        deskripsi: form.deskripsi.trim(),
        status: form.status as IsoMilestone['status'],
        dokumen: form.dokumen ? [form.dokumen] : [],
        linkEksternal: form.linkEksternal.trim() || undefined,
        urutan: form.urutan,
      };

      if (isEdit && id) {
        await updateIso(id, payload);
      } else {
        await createIso(payload);
      }
      navigate('/admin/spme/iso');
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
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/admin/spme/iso')} className="flex items-center gap-2 text-sky-200 hover:text-white text-sm font-medium transition-colors mb-4">
            <ArrowLeft size={16} />
            Kembali ke Daftar
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FileCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {isEdit ? 'Edit Milestone ISO' : 'Tambah Milestone ISO'}
              </h1>
              <p className="text-sky-200 text-sm mt-0.5">
                {isEdit ? 'Perbarui informasi milestone' : 'Tambahkan milestone baru'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 flex flex-col gap-6">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tahun/Milestone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tahun"
                    value={form.tahun}
                    onChange={handleChange}
                    placeholder="Contoh: 2024"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <SelectInput
                    value={form.status}
                    onChange={(value) => setForm(prev => ({ ...prev, status: value }))}
                    options={STATUS_OPTIONS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Sertifikasi ISO 9001:2015"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Jelaskan milestone ini..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  required
                />
              </div>

              <FileUpload
                label="Dokumen ISO (PDF)"
                value={form.dokumen}
                onChange={(url) => setForm(prev => ({ ...prev, dokumen: url }))}
                accept=".pdf,.doc,.docx"
                placeholder="Seret dokumen ISO ke sini atau klik untuk memilih"
                helperText="Format: PDF, DOC, DOCX"
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Link Eksternal
                </label>
                <input
                  type="text"
                  name="linkEksternal"
                  value={form.linkEksternal}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urutan</label>
                <input
                  type="number"
                  name="urutan"
                  value={form.urutan}
                  onChange={handleChange}
                  min={1}
                  className="w-32 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="mt-1.5 text-xs text-slate-400">Angka kecil tampil lebih awal.</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button type="button" onClick={() => navigate('/admin/spme/iso')} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                ) : (
                  <><Save size={16} /> {isEdit ? 'Simpan Perubahan' : 'Tambah Milestone'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}