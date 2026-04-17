import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getPermissions, createPermission, updatePermission, deletePermission, type Permission } from '../../../lib/api';
import { Shield, Plus, Pencil, Trash2, X, Loader, Save, FileText } from 'lucide-react';

export default function PermissionIndex() {
  useEffect(() => { document.title = 'Manajemen Permission :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPerm, setEditPerm] = useState<Permission | null>(null);
  const [form, setForm] = useState({ name: '', aplikasi: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!hasPermission('user.read')) { setLoading(false); return; }
    getPermissions().then(data => { setPermissions(data); setLoading(false); });
  }, [hasPermission]);

  const openCreate = () => {
    setEditPerm(null);
    setForm({ name: '', aplikasi: '' });
    setShowModal(true);
  };

  const openEdit = (p: Permission) => {
    setEditPerm(p);
    setForm({ name: p.name, aplikasi: p.aplikasi ?? '' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPerm) {
        const updated = await updatePermission(editPerm.id, form);
        if (updated) setPermissions(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await createPermission(form);
        setPermissions(prev => [...prev, created]);
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Permission) => {
    if (!confirm(`Yakin ingin menghapus permission "${p.name}"?`)) return;
    await deletePermission(p.id);
    setPermissions(prev => prev.filter(x => x.id !== p.id));
  };

  const filtered = permissions.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.aplikasi?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  if (!hasPermission('user.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 flex flex-col items-center gap-3">
        <Shield className="w-8 h-8 text-red-400" />
        <p className="font-semibold">Akses Ditolak</p>
        <p className="text-sm">Halaman ini hanya dapat diakses oleh Super Admin.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Permission</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola izin aplikasi dan modul</p>
          </div>
        </div>
        {hasPermission('user.create') && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow">
            <Plus size={16} /> Tambah Permission
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center gap-4 border-b border-slate-100">
          <input type="text" placeholder="Cari permission..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 max-w-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama Permission</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Aplikasi</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.aplikasi ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {hasPermission('user.update') && (
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                      )}
                      {hasPermission('user.delete') && (
                        <button onClick={() => handleDelete(p)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-slate-400">Belum ada data permission.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editPerm ? 'Edit Permission' : 'Tambah Permission'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Permission</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Contoh: Create Berita"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Aplikasi</label>
                <input
                  value={form.aplikasi}
                  onChange={e => setForm(p => ({ ...p, aplikasi: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Contoh: LPM Website"
                />
              </div>
                            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}