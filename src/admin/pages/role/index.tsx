import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getRoles, createRole, updateRole, deleteRole, getPermissions, type RoleResponse } from '../../../lib/api';
import DataTable from '../../components/DataTable';
import { Shield, Plus, X, Save, Check, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';

type GroupedPermissions = Record<string, { id: number; name: string; modul?: string; aplikasi: string }[]>;

function groupByModule(permissions: { id: number; name: string; modul?: string; aplikasi: string }[]): GroupedPermissions {
  return permissions.reduce((acc, p) => {
    const key = p.modul || p.aplikasi;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as GroupedPermissions);
}

export default function RoleIndex() {
  useEffect(() => { document.title = 'Manajemen Role :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<{ id: number; name: string; modul?: string; aplikasi: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<RoleResponse | null>(null);
  const [form, setForm] = useState({ name: '', permissions: [] as string[] });
  const [saving, setSaving] = useState(false);

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
    setForm({ name: '', permissions: [] });
    setShowModal(true);
  };

  const openEdit = (r: RoleResponse) => {
    setEditRole(r);
    setForm({
      name: r.name,
      permissions: r.permissions.map(p => p.name),
    });
    setShowModal(true);
  };

  const groupedPerms = groupByModule(permissions);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpandedModules(Object.keys(groupedPerms).reduce((acc, m) => ({ ...acc, [m]: true }), {}));
  }, [permissions]);

  const togglePermission = (permName: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter(p => p !== permName)
        : [...prev.permissions, permName],
    }));
  };

  const toggleModule = (modul: string) => {
    const modulePerms = groupedPerms[modul] || [];
    const allActive = modulePerms.every(p => form.permissions.includes(p.name));
    if (allActive) {
      setForm(prev => ({ ...prev, permissions: prev.permissions.filter(p => !modulePerms.some(mp => mp.name === p)) }));
    } else {
      const missing = modulePerms.filter(p => !form.permissions.includes(p.name)).map(p => p.name);
      setForm(prev => ({ ...prev, permissions: [...prev.permissions, ...missing] }));
    }
  };

  const toggleAll = () => {
    if (form.permissions.length === permissions.length) {
      setForm(prev => ({ ...prev, permissions: [] }));
    } else {
      setForm(prev => ({ ...prev, permissions: permissions.map(p => p.name) }));
    }
  };

  const toggleExpand = (modul: string) => {
    setExpandedModules(prev => ({ ...prev, [modul]: !prev[modul] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editRole) {
        const updated = await updateRole(editRole.id, { name: form.name, permissions: form.permissions });
        setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
      } else {
        const created = await createRole({ name: form.name, permissions: form.permissions });
        setRoles(prev => [...prev, created]);
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r: RoleResponse) => {
    if (!confirm(`Yakin ingin menghapus role "${r.name}"?`)) return;
    await deleteRole(r.id);
    setRoles(prev => prev.filter(x => x.id !== r.id));
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (!hasPermission('user.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 flex flex-col items-center gap-3">
        <Shield className="w-8 h-8 text-red-400" />
        <p className="font-semibold">Akses Ditolak</p>
        <p className="text-sm">Halaman ini hanya dapat diakses oleh Super Admin.</p>
      </div>
    </div>
  );

  const columns = [
    {
      key: 'name',
      label: 'Nama Role',
      sortable: true,
      render: (_: unknown, item: RoleResponse) => (
        <span className="font-semibold text-slate-800">{item.name}</span>
      ),
    },
    {
      key: 'permissions',
      label: 'Jumlah Permission',
      sortable: false,
      render: (_: unknown, item: RoleResponse) => (
        <span className="text-slate-600">{item.permissions.length} izin</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Tanggal Dibuat',
      sortable: true,
      render: (_: unknown, item: RoleResponse) => (
        <span className="text-slate-500 text-xs">{formatDate(item.created_at)}</span>
      ),
    },
  ];

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

      <DataTable
        columns={columns}
        data={roles}
        onEdit={hasPermission('user.update') ? openEdit : undefined}
        onDelete={hasPermission('user.delete') ? handleDelete : undefined}
        searchable={['name']}
        emptyMessage="Belum ada data role."
        loading={loading}
      />

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
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
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
                    const allActive = perms.every(p => form.permissions.includes(p.name));
                    const someActive = perms.some(p => form.permissions.includes(p.name));
                    const isExpanded = expandedModules[modul] ?? true;

                    return (
                      <div key={modul} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleExpand(modul)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-slate-400">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allActive ? 'bg-sky-500 border-sky-500' : someActive ? 'bg-sky-500/50 border-sky-500' : 'border-slate-300 bg-white'}`}
                            onClick={(e) => { e.stopPropagation(); toggleModule(modul); }}
                          >
                            {(allActive || someActive) && <Check size={12} className="text-white" />}
                          </div>
                          <span className="font-semibold text-slate-700 text-sm">{modul}</span>
                          <span className="text-xs text-slate-400">({perms.length} izin)</span>
                          {someActive && !allActive && (
                            <span className="ml-auto text-xs text-sky-600 font-medium">Sebagian</span>
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 py-3 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                            {perms.map(p => {
                              const active = form.permissions.includes(p.name);
                              return (
                                <label
                                  key={p.id}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors border ${active ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={() => togglePermission(p.name)}
                                    className="sr-only"
                                  />
                                  {active && <Check size={12} className="text-sky-600 shrink-0" />}
                                  <span className="text-xs font-medium">{p.name}</span>
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
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
