import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Loader, CheckCircle, Tag } from 'lucide-react';
import type { Kategori } from '../../../lib/types';
import { getKategori, createKategoriItem, updateKategoriItem, deleteKategoriItem } from '../../../lib/hooks-data';

export default function KategoriIndex() {
  const [items, setItems] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Kategori | null>(null);
  const [form, setForm] = useState({ nama: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getKategori();
    setItems(data);
    setLoading(false);
  }

  function openCreate() {
    setEditItem(null);
    setForm({ nama: '', slug: '' });
    setSlugManuallyEdited(false);
    setError('');
    setShowModal(true);
  }

  function openEdit(item: Kategori) {
    setEditItem(item);
    setForm({ nama: item.nama, slug: item.slug });
    setSlugManuallyEdited(false);
    setError('');
    setShowModal(true);
  }

  function handleNamaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nama = e.target.value;
    const generatedSlug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = slugManuallyEdited ? form.slug : generatedSlug;
    setForm({ nama, slug });
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, slug: e.target.value }));
    setSlugManuallyEdited(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim()) { setError('Nama kategori wajib diisi.'); return; }

    setSaving(true);
    setError('');
    try {
      const finalSlug = form.slug.trim() || form.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (editItem) {
        await updateKategoriItem(editItem.id, { nama: form.nama, slug: finalSlug });
      } else {
        await createKategoriItem({ nama: form.nama, slug: finalSlug });
      }
      await loadData();
      setShowModal(false);
    } catch {
      setError('Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Kategori) {
    if (!confirm(`Yakin ingin menghapus kategori "${item.nama}"?`)) return;
    await deleteKategoriItem(item.id);
    await loadData();
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Kategori Berita</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola kategori untuk konten berita</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow">
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 text-sm text-slate-500">
          {items.length} kategori ditemukan
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">No</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama Kategori</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{item.nama}</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{item.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Tag size={32} className="mx-auto mb-2 opacity-50" />
            <p>Belum ada kategori.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editItem ? 'Edit' : 'Tambah'} Kategori</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kategori <span className="text-red-500">*</span></label>
                <input
                  value={form.nama}
                  onChange={handleNamaChange}
                  placeholder="Contoh: Berita Terbaru"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="auto-generate dari nama"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <p className="mt-1 text-xs text-slate-400">Otomatis dibuat dari nama jika kosong.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
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