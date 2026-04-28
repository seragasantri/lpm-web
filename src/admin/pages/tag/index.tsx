import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag as TagIcon, Plus, Loader, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { useAuth } from '../../../context/AuthContext';
import { getTags, createTag, updateTag, deleteTag } from '../../../lib/api';

interface TagData {
  id: number;
  nama: string;
  slug: string;
}

export default function TagIndex() {
  useEffect(() => { document.title = 'Manajemen Tag :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [formData, setFormData] = useState({ nama: '', slug: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await getTags();
      setData(result);
    } catch (err) {
      console.error('Gagal memuat tag:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = () => {
    setEditingTag(null);
    setFormData({ nama: '', slug: '' });
    setShowModal(true);
  };

  const handleEdit = (tag: TagData) => {
    setEditingTag(tag);
    setFormData({ nama: tag.nama, slug: tag.slug });
    setShowModal(true);
  };

  const handleDelete = async (tag: TagData) => {
    if (!confirm(`Hapus tag "${tag.nama}"?`)) return;
    try {
      await deleteTag(tag.id);
      await load();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTag) {
        await updateTag(editingTag.id, formData);
      } else {
        await createTag(formData);
      }
      setShowModal(false);
      await load();
    } catch (err) {
      console.error('Gagal menyimpan:', err);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama Tag',
      render: (_: unknown, item: TagData) => (
        <div className="flex items-center gap-2">
          <TagIcon size={16} className="text-sky-500" />
          <span className="font-semibold text-slate-800">{item.nama}</span>
        </div>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (_: unknown, item: TagData) => (
        <span className="text-slate-500 text-sm">{item.slug}</span>
      ),
    },
  ];

  if (!hasPermission('tag.read') && !hasPermission('tag')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
          Anda tidak memiliki akses ke halaman ini.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <TagIcon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">Manajemen Tag Berita</h1>
              <p className="text-sky-200 text-sm mt-0.5">Kelola tag untuk artikel berita</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-sky-700 rounded-xl font-bold hover:bg-sky-50 transition-colors shadow-lg"
          >
            <Plus size={20} /> Tambah Tag
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['nama']}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Belum ada tag."
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                {editingTag ? 'Edit Tag' : 'Tambah Tag Baru'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Tag</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Berita Utama"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug (opsional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generate dari nama"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                >
                  {saving && <Loader size={16} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
