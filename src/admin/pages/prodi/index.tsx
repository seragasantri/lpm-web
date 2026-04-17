import { useState, useEffect } from 'react';
import { BookOpen, Plus, Pencil, Trash2, X, Loader, CheckCircle } from 'lucide-react';
import type { Faker, Prodi } from '../../../lib/types';
import { getFaker, getProdi, createProdi, updateProdi, deleteProdi } from '../../../lib/mockData';
import SelectInput from '../../components/SelectInput';

export default function ProdiIndex() {
  const [faker, setFaker] = useState<Faker[]>([]);
  const [items, setItems] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Prodi | null>(null);
  const [form, setForm] = useState({ kode_prodi: '', nama_prodi: '', faker_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Program Studi :: LPM Admin'; loadData(); }, []);
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [f, p] = await Promise.all([getFaker(), getProdi()]);
    setFaker(f);
    setItems(p);
    setLoading(false);
  }

  function openCreate() {
    setEditItem(null);
    setForm({ kode_prodi: '', nama_prodi: '', faker_id: faker[0]?.id || '' });
    setError('');
    setShowModal(true);
  }

  function openEdit(item: Prodi) {
    setEditItem(item);
    setForm({ kode_prodi: item.kode_prodi, nama_prodi: item.nama_prodi, faker_id: item.faker_id });
    setError('');
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kode_prodi.trim()) { setError('Kode prodi wajib diisi.'); return; }
    if (!form.nama_prodi.trim()) { setError('Nama prodi wajib diisi.'); return; }
    if (!form.faker_id) { setError('Faker wajib dipilih.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await updateProdi(editItem.id, form);
      } else {
        await createProdi(form);
      }
      await loadData();
      setShowModal(false);
    } catch {
      setError('Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Prodi) {
    if (!confirm(`Yakin hapus prodi "${item.nama_prodi}"?`)) return;
    await deleteProdi(item.id);
    await loadData();
  }

  function getFakerNama(id: string) {
    return faker.find(f => f.id === id)?.nama_faker || '-';
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
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Program Studi</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola data program studi</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow">
          <Plus size={16} /> Tambah Prodi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">No</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Kode</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama Prodi</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Faker</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                <td className="px-4 py-3 font-mono font-semibold text-sky-700">{item.kode_prodi}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{item.nama_prodi}</td>
                <td className="px-4 py-3 text-slate-500">{getFakerNama(item.faker_id)}</td>
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
            <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
            <p>Belum ada data prodi.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-white">{editItem ? 'Edit' : 'Tambah'} Program Studi</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Faker <span className="text-red-500">*</span></label>
                <SelectInput
                  value={form.faker_id}
                  onChange={val => setForm(p => ({ ...p, faker_id: val }))}
                  options={faker.map(f => ({ value: f.id, label: f.nama_faker }))}
                  placeholder="Pilih Faker"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kode Prodi <span className="text-red-500">*</span></label>
                <input
                  value={form.kode_prodi}
                  onChange={e => setForm(p => ({ ...p, kode_prodi: e.target.value }))}
                  placeholder="Contoh: PAI"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Program Studi <span className="text-red-500">*</span></label>
                <input
                  value={form.nama_prodi}
                  onChange={e => setForm(p => ({ ...p, nama_prodi: e.target.value }))}
                  placeholder="Contoh: Pendidikan Agama Islam"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
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