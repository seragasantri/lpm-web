import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getRoles, createRole, updateRole, deleteRole, getPermissions } from '../../../lib/mockData';
import type { Role, Permission } from '../../../lib/types';
import { Shield, Plus, Pencil, Trash2, X, Loader, Save, Check, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';

// Group permissions by module
type GroupedPermissions = Record<string, Permission[]>;

function groupByModule(permissions: Permission[]): GroupedPermissions {
  return permissions.reduce((acc, p) => {
    const key = p.modul;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as GroupedPermissions);
}

export default function RoleIndex() {
  useEffect(() => { document.title = 'Manajemen Role :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ nama: '', permissions: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!hasPermission('user.read')) { setLoading(false); return; }
    Promise.all([getRoles(), getPermissions()]).then(([rolesData, perms]) => {
      setRoles(rolesData);
      setPermissions(perms);
      setLoading(false);
    });
  }, [hasPermission]);

  const openCreate = () => {
    setEditRole(null);
    setForm({ nama: '', permissions: [] });
    setShowModal(true);
  };

  const openEdit = (r: Role) => {
    setEditRole(r);
    setForm({ nama: r.nama, permissions: [...r.permissions] });
    setShowModal(true);
  };

  const groupedPerms = groupByModule(permissions);

  const togglePermission = (permId: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const toggleModule = (modul: string) => {
    const modulePerms = groupedPerms[modul] || [];
    const allActive = modulePerms.every(p => form.permissions.includes(p.id));
    if (allActive) {
      setForm(prev => ({ ...prev, permissions: prev.permissions.filter(p => !modulePerms.some(mp => mp.id === p)) }));
    } else {
      const missing = modulePerms.filter(p => !form.permissions.includes(p.id)).map(p => p.id);
      setForm(prev => ({ ...prev, permissions: [...prev.permissions, ...missing] }));
    }
  };

  const toggleAll = () => {
    if (form.permissions.length === permissions.length) {
      setForm(prev => ({ ...prev, permissions: [] }));
    } else {
      setForm(prev => ({ ...prev, permissions: permissions.map(p => p.id) }));
    }
  };

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    Object.keys(groupedPerms).reduce((acc, m) => ({ ...acc, [m]: true }), {})
  );

  const toggleExpand = (modul: string) => {
    setExpandedModules(prev => ({ ...prev, [modul]: !prev[modul] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editRole) {
        const updated = await updateRole(editRole.id, { nama: form.nama, permissions: form.permissions });
        if (updated) setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
      } else {
        const created = await createRole({ nama: form.nama, permissions: form.permissions });
        setRoles(prev => [...prev, created]);
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r: Role) => {
    if (!confirm(`Yakin ingin menghapus role "${r.nama}"?`)) return;
    await deleteRole(r.id);
    setRoles(prev => prev.filter(x => x.id !== r.id));
  };

  const filtered = roles.filter(r => r.nama.toLowerCase().includes(search.toLowerCase()));

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
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Role</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola role dan hak akses pengguna</p>
          </div>
        </div>
        {hasPermission('user.create') && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow">
            <Plus size={16} /> Tambah Role
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center gap-4 border-b border-slate-100">
          <input type="text" placeholder="Cari role..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 max-w-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama Role</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Jumlah Permission</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Tanggal Dibuat</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{r.nama}</td>
                  <td className="px-4 py-3 text-slate-600">{r.permissions.length} izin</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {hasPermission('user.update') && (
                        <button onClick={() => openEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                      )}
                      {hasPermission('user.delete') && (
                        <button onClick={() => handleDelete(r)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-400">Belum ada data role.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editRole ? 'Edit Role' : 'Tambah Role'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Role</label>
                <input
                  value={form.nama}
                  onChange={e => setForm(p => ({ ...p, nama: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Contoh: Editor, Viewer, Admin"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Modul & Permission</label>
                  <button type="button" onClick={toggleAll} className="text-xs text-sky-600 hover:text-sky-800 font-medium">
                    {form.permissions.length === permissions.length ? 'Hapus Semua' : 'Pilih Semua'}
                  </button>
                </div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {Object.entries(groupedPerms).map(([modul, perms]) => {
                    const allActive = perms.every(p => form.permissions.includes(p.id));
                    const someActive = perms.some(p => form.permissions.includes(p.id));
                    const isExpanded = expandedModules[modul] ?? true;

                    return (
                      <div key={modul} className="border border-slate-200 rounded-xl overflow-hidden">
                        {/* Module Header */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(modul)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-slate-400">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                          <label
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allActive ? 'bg-sky-500 border-sky-500' : someActive ? 'bg-sky-500/50 border-sky-500' : 'border-slate-300 bg-white'}`}
                              onClick={() => toggleModule(modul)}
                            >
                              {(allActive || someActive) && <Check size={12} className="text-white" />}
                            </div>
                          </label>
                          <span className="font-semibold text-slate-700 text-sm">{modul}</span>
                          <span className="text-xs text-slate-400">({perms.length} izin)</span>
                          {someActive && !allActive && (
                            <span className="ml-auto text-xs text-sky-600 font-medium">Sebagian</span>
                          )}
                        </button>
                        {/* Permission Items */}
                        {isExpanded && (
                          <div className="px-4 py-3 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                            {perms.map(p => {
                              const active = form.permissions.includes(p.id);
                              return (
                                <label
                                  key={p.id}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors border ${active ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={() => togglePermission(p.id)}
                                    className="sr-only"
                                  />
                                  {active && <Check size={12} className="text-sky-600 shrink-0" />}
                                  <span className="text-xs font-medium">{p.nama}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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