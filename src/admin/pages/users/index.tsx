import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUsers, createUser, updateUser, deleteUser, getRoles } from '../../../lib/mockData';
import type { User, Role } from '../../../lib/types';
import { Users, Plus, Pencil, Trash2, X, Loader, Shield, UserCheck, UserX, Save, Check, ShieldCheck } from 'lucide-react';
import DataTable from '../../components/DataTable';

// Group permissions by module for display
type GroupedPerms = Record<string, string[]>;
function groupPermsByModule(perms: string[], permMeta: Record<string, string>): GroupedPerms {
  const groups: GroupedPerms = {};
  for (const p of perms) {
    const modul = permMeta[p] || 'Lainnya';
    if (!groups[modul]) groups[modul] = [];
    groups[modul].push(p);
  }
  return groups;
}

// Permission display names and module mapping
const PERM_META: Record<string, string> = {
  'berita.create': 'Berita', 'berita.read': 'Berita', 'berita.update': 'Berita', 'berita.delete': 'Berita',
  'galeri.create': 'Galeri', 'galeri.read': 'Galeri', 'galeri.update': 'Galeri', 'galeri.delete': 'Galeri',
  'download.create': 'Download', 'download.read': 'Download', 'download.update': 'Download', 'download.delete': 'Download',
  'halaman.read': 'Halaman', 'halaman.update': 'Halaman',
  'staf.create': 'Staf', 'staf.read': 'Staf', 'staf.update': 'Staf', 'staf.delete': 'Staf',
  'sertifikat.create': 'Sertifikat', 'sertifikat.read': 'Sertifikat', 'sertifikat.update': 'Sertifikat', 'sertifikat.delete': 'Sertifikat',
  'peraturan.create': 'Peraturan', 'peraturan.read': 'Peraturan', 'peraturan.update': 'Peraturan', 'peraturan.delete': 'Peraturan',
  'poll.create': 'Poll', 'poll.read': 'Poll', 'poll.update': 'Poll', 'poll.delete': 'Poll',
  'footer.read': 'Footer', 'footer.update': 'Footer',
  'user.create': 'User', 'user.read': 'User', 'user.update': 'User', 'user.delete': 'User',
  'role.create': 'Role', 'role.read': 'Role', 'role.update': 'Role', 'role.delete': 'Role',
  'log.read': 'Log Aktivitas',
  'faker.create': 'Faker', 'faker.read': 'Faker', 'faker.update': 'Faker', 'faker.delete': 'Faker',
  'prodi.create': 'Program Studi', 'prodi.read': 'Program Studi', 'prodi.update': 'Program Studi', 'prodi.delete': 'Program Studi',
  'spme.akreditasi.create': 'SPMI Akreditasi', 'spme.akreditasi.read': 'SPMI Akreditasi', 'spme.akreditasi.update': 'SPMI Akreditasi', 'spme.akreditasi.delete': 'SPMI Akreditasi',
  'spme.iso.create': 'SPMI ISO', 'spme.iso.read': 'SPMI ISO', 'spme.iso.update': 'SPMI ISO', 'spme.iso.delete': 'SPMI ISO',
  'spme.situs.create': 'SPMI Situs', 'spme.situs.read': 'SPMI Situs', 'spme.situs.update': 'SPMI Situs', 'spme.situs.delete': 'SPMI Situs',
  'profil.read': 'Profil', 'profil.update': 'Profil',
  'spmi.create': 'SPMI', 'spmi.read': 'SPMI', 'spmi.update': 'SPMI', 'spmi.delete': 'SPMI',
  'settings.read': 'Pengaturan', 'settings.update': 'Pengaturan',
};

const PERM_LABELS: Record<string, string> = {
  create: 'Buat', read: 'Lihat', update: 'Edit', delete: 'Hapus',
};

const ROLE_COLORS = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
];

export default function UsersIndex() {
  useEffect(() => { document.title = 'Manajemen User :: LPM Admin'; }, []);
  const { hasPermission, user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', roleIds: [] as string[] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasPermission('user.read')) { setLoading(false); return; }
    Promise.all([getUsers(), getRoles()]).then(([u, r]) => {
      setUsers(u);
      setRoles(r);
      setLoading(false);
    });
  }, [hasPermission]);

  const openCreate = () => {
    setEditUser(null);
    setForm({ username: '', email: '', password: '', roleIds: [] });
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ username: u.username, email: u.email, password: '', roleIds: [...u.roleIds] });
    setShowModal(true);
  };

  const toggleRole = (roleId: string) => {
    setForm(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(r => r !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const toggleAllRoles = () => {
    if (form.roleIds.length === roles.length) {
      setForm(prev => ({ ...prev, roleIds: [] }));
    } else {
      setForm(prev => ({ ...prev, roleIds: roles.map(r => r.id) }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) {
        const updated = await updateUser(editUser.id, { username: form.username, email: form.email, roleIds: form.roleIds });
        if (updated) setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      } else {
        const created = await createUser({ username: form.username, email: form.email, roleIds: form.roleIds, isActive: true });
        setUsers(prev => [...prev, created]);
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Yakin ingin menghapus user "${u.username}"?`)) return;
    await deleteUser(u.id);
    setUsers(prev => prev.filter(x => x.id !== u.id));
  };

  const toggleActive = async (u: User) => {
    const updated = await updateUser(u.id, { isActive: !u.isActive });
    if (updated) setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  // Compute permissions from selected roles
  const selectedPerms = useMemo(() => {
    const selectedRoles = roles.filter(r => form.roleIds.includes(r.id));
    return [...new Set(selectedRoles.flatMap(r => r.permissions))];
  }, [form.roleIds, roles]);

  // Get role names for a user
  const getUserRoleNames = (u: User): string[] => {
    return roles.filter(r => (u.roleIds || []).includes(r.id)).map(r => r.nama);
  };

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
        <p className="text-sm">Anda tidak memiliki akses</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen User</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola akun dan hak akses pengguna</p>
          </div>
        </div>
        {hasPermission('user.create') && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow">
            <Plus size={16} /> Tambah User
          </button>
        )}
      </div>

      <DataTable
        columns={[
          {
            key: 'username',
            label: 'Username',
            sortable: true,
            render: (_, u: User) => <span className="font-semibold text-slate-800">{u.username}</span>,
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (_, u: User) => <span className="text-slate-600">{u.email}</span>,
          },
          {
            key: 'roleIds',
            label: 'Role',
            sortable: true,
            render: (_, u: User) => {
              const names = getUserRoleNames(u);
              return (
                <div className="flex flex-wrap gap-1">
                  {names.length === 0 ? (
                    <span className="text-slate-400 text-xs">-</span>
                  ) : names.map((name, i) => (
                    <span key={name} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[i % ROLE_COLORS.length]}`}>
                      {name}
                    </span>
                  ))}
                </div>
              );
            },
          },
          {
            key: 'isActive',
            label: 'Status',
            sortable: true,
            render: (_, u: User) => (
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {u.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            ),
          },
          {
            key: 'permissions',
            label: 'Permissions',
            render: (_, u: User) => (
              <span className="text-slate-500 text-xs">{u.permissions.length} izin</span>
            ),
          },
          {
            key: 'lastLogin',
            label: 'Login Terakhir',
            sortable: true,
            render: (_, u: User) => (
              <span className="text-slate-500 text-xs">
                {u.lastLogin ? new Date(u.lastLogin).toLocaleString('id-ID') : '-'}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Aksi',
            sortable: false,
            render: (_, u: User) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(u)}
                  className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                  title={u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                </button>
                {hasPermission('user.update') && (
                  <button onClick={() => openEdit(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Pencil size={16} />
                  </button>
                )}
                {hasPermission('user.delete') && u.id !== currentUser?.id && (
                  <button onClick={() => handleDelete(u)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={users}
        searchable={['username', 'email']}
        onEdit={hasPermission('user.update') ? openEdit : undefined}
        onDelete={hasPermission('user.delete') ? handleDelete : undefined}
        onCreate={hasPermission('user.create') ? openCreate : undefined}
        createLabel="Tambah User"
        emptyMessage="Belum ada data user."
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">{editUser ? 'Edit User' : 'Tambah User'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                  <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Contoh: admin, editor" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="user@lpm.ac.id" />
                </div>
                {!editUser && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                    <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Minimal 6 karakter" />
                  </div>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Role</label>
                  <button type="button" onClick={toggleAllRoles} className="text-xs text-sky-600 hover:text-sky-800 font-medium">
                    {form.roleIds.length === roles.length ? 'Hapus Semua' : 'Pilih Semua'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
                  {roles.map((role) => {
                    const isActive = form.roleIds.includes(role.id);
                    return (
                      <label
                        key={role.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border ${isActive ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <input type="checkbox" checked={isActive} onChange={() => toggleRole(role.id)} className="sr-only" />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-sky-500 border-sky-500' : 'border-slate-300 bg-white'}`}>
                          {isActive && <Check size={12} className="text-white" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold block truncate">{role.nama}</span>
                          <span className="text-xs opacity-60 block truncate">{role.permissions.length} izin</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Computed Permissions Preview */}
              {form.roleIds.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Permission yang diperoleh ({selectedPerms.length})
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-[25vh] overflow-y-auto">
                    {Object.entries(groupPermsByModule(selectedPerms, PERM_META)).map(([modul, perms]) => (
                      <div key={modul} className="mb-3 last:mb-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{modul}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {perms.map(p => {
                            const action = p.split('.').pop() || '';
                            const label = PERM_LABELS[action] || action;
                            return (
                              <span key={p} className="inline-flex px-2 py-0.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600">
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {selectedPerms.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Belum ada role yang dipilih.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
                  {saving ? <><Loader className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
