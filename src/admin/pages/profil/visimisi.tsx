import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Target, Plus, Trash2 } from 'lucide-react';
import { getVisiMisi, updateVisiMisi } from '../../../lib/api';

interface MisiItem {
  id?: number;
  no: number;
  judul: string;
  deskripsi: string;
}

export default function ProfilVisiMisi() {
  const navigate = useNavigate();

  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState<MisiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Edit Visi Misi - Admin LPM';
    getVisiMisi().then((data) => {
      if (data) {
        setVisi(data.visi || '');
        setMisi((data.items || []).map((m) => ({ id: m.id, no: m.no, judul: m.judul, deskripsi: m.deskripsi || '' })));
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleAddMisi = () => {
    const newNo = misi.length + 1;
    setMisi((prev) => [
      ...prev,
      { id: undefined, no: newNo, judul: '', deskripsi: '' },
    ]);
  };

  const handleRemoveMisi = (idx: number) => {
    setMisi((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      return updated.map((m, i) => ({ ...m, no: i + 1 }));
    });
  };

  const handleMisiChange = (idx: number, field: keyof MisiItem, value: string | number) => {
    setMisi((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: field === 'no' ? Number(value) : value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!visi.trim()) { setError('Visi wajib diisi.'); return; }

    setSaving(true);
    try {
      await updateVisiMisi({
        visi: visi.trim(),
        misi: misi.map((m, i) => ({ id: m.id, no: i + 1, judul: m.judul, deskripsi: m.deskripsi })),
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
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Visi dan Misi</h2>
              <p className="text-sky-200 text-sm mt-0.5">Kelola informasi Visi dan Misi LPM</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          {/* Visi */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Visi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              rows={3}
              placeholder="Tulis visi LPM di sini..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
              required
            />
          </div>

          {/* Misi */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                Misi
              </label>
              <button
                type="button"
                onClick={handleAddMisi}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-sm font-semibold hover:bg-sky-100 transition-colors"
              >
                <Plus size={14} /> Tambah Misi
              </button>
            </div>

            <div className="space-y-4">
              {misi.map((item, idx) => (
                <div key={item.id} className="flex gap-3 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-sky-600">{idx + 1}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={item.judul}
                      onChange={(e) => handleMisiChange(idx, 'judul', e.target.value)}
                      placeholder="Judul misi..."
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    />
                    <textarea
                      value={item.deskripsi}
                      onChange={(e) => handleMisiChange(idx, 'deskripsi', e.target.value)}
                      rows={2}
                      placeholder="Deskripsi misi..."
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMisi(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {misi.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                  Belum ada misi. Klik "Tambah Misi" untuk menambahkan.
                </div>
              )}
            </div>
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
