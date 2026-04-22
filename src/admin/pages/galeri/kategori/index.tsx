import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader, CheckCircle, Tag, Palette } from 'lucide-react';
import { getKategoriGaleris, createKategoriGaleri, updateKategoriGaleri, deleteKategoriGaleri, type KategoriGaleriResponse } from '../../../../lib/api';

const WARNA_OPTIONS = [
  { value: '#3B82F6', label: 'Biru' },
  { value: '#10B981', label: 'Hijau' },
  { value: '#F59E0B', label: 'Kuning' },
  { value: '#EF4444', label: 'Merah' },
  { value: '#8B5CF6', label: 'Ungu' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#F97316', label: 'Orange' },
  { value: '#6B7280', label: 'Abu-abu' },
];

export default function KategoriGaleriIndex() {
  const [items, setItems] = useState<KategoriGaleriResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<KategoriGaleriResponse | null>(null);
  const [form, setForm] = useState({ nama: '', warna: '#3B82F6' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getKategoriGaleris();
      setItems(data);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditItem(null);
    setForm({ nama: '', warna: '#3B82F6' });
    setError('');
    setShowModal(true);
  }

  function openEdit(item: KategoriGaleriResponse) {
    setEditItem(item);
    setForm({ nama: item.nama, warna: item.warna || '#3B82F6' });
    setError('');
    setShowModal(true);
  }

  function handleNamaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, nama: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim()) { setError('Nama kategori wajib diisi.'); return; }

    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await updateKategoriGaleri(editItem.id, { nama: form.nama, warna: form.warna });
      } else {
        await createKategoriGaleri({ nama: form.nama, warna: form.warna });
      }
      await loadData();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: KategoriGaleriResponse) {
    if (!confirm(`Yakin ingin menghapus kategori "${item.nama}"?`)) return;
    try {
      await deleteKategoriGaleri(item.id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus.');
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">Kategori Galeri</h1>
              <p className="text-sky-200 text-sm mt-0.5">Kelola kategori untuk galeri foto</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-sky-700 rounded-xl text-sm font-bold hover:bg-sky-50 transition-colors shadow-lg"
          >
            <Plus size={18} />
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 text-sm text-slate-500">
            {items.length} kategori ditemukan
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-16">No</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">Warna</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.warna || '#3B82F6' }}
                      />
                      <span className="font-semibold text-slate-800">{item.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: `${item.warna || '#3B82F6'}20`, color: item.warna || '#3B82F6' }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.warna || '#3B82F6' }}
                      />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Tag size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-base">Belum ada kategori galeri.</p>
              <button
                onClick={openCreate}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                <Plus size={16} />
                Tambah Kategori Pertama
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editItem ? 'Edit' : 'Tambah'} Kategori</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.nama}
                  onChange={handleNamaChange}
                  placeholder="Contoh: Workshop"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  autoFocus
                />
                <p className="mt-1 text-xs text-slate-400">Slug akan dibuat otomatis dari nama.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Palette size={14} />
                    Warna
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {WARNA_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, warna: color.value }))}
                      className={`w-8 h-8 rounded-lg transition-all ${form.warna === color.value ? 'ring-2 ring-offset-2 ring-sky-500 scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
                >
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle size={16} />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}