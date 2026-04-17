import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getPermissions, getRoles, type Permission, type RoleResponse } from '../../../lib/api';
import DataTable, { type Column } from '../../components/DataTable';
import { Shield, Eye, FileText } from 'lucide-react';

// Parse permission name: modul_action (e.g., "berita_create" → modul: "Berita", action: "Buat")
function parsePermissionName(name: string): { modul: string; action: string } {
  const parts = name.split('_');
  const action = parts.pop() ?? '';
  const modul = parts.join(' ');

  const actionMap: Record<string, string> = {
    create: 'Buat',
    read: 'Lihat',
    update: 'Edit',
    delete: 'Hapus',
  };

  return {
    modul: modul.charAt(0).toUpperCase() + modul.slice(1),
    action: actionMap[action] ?? action,
  };
}

// Grouped role colors
const ROLE_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-red-100 text-red-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
];

export default function PermissionIndex() {
  useEffect(() => { document.title = 'Manajemen Permission :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasPermission('user.read')) return;

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const p = await getPermissions();
        if (controller.signal.aborted) return;
        setPermissions(p);

        const r = await getRoles();
        if (controller.signal.aborted) return;
        setRoles(r);
      } catch {
        // ignore
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [hasPermission]);

  // Get roles that have this permission
  function getPermRoles(permissionName: string): RoleResponse[] {
    return roles.filter(role =>
      role.permissions.some(p => p.name === permissionName)
    );
  }

  if (!hasPermission('user.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 flex flex-col items-center gap-3">
        <Shield className="w-8 h-8 text-red-400" />
        <p className="font-semibold">Akses Ditolak</p>
        <p className="text-sm">Halaman ini hanya dapat diakses oleh Super Admin.</p>
      </div>
    </div>
  );

  const columns: Column<Permission>[] = [
    {
      key: 'modul',
      label: 'Modul',
      sortable: true,
      render: (_: unknown, item: Permission) => {
        const { modul, action } = parsePermissionName(item.name);
        return (
          <div>
            <div className="font-semibold text-slate-800">{modul}</div>
            <div className="text-xs text-slate-400 mt-0.5">{action}</div>
          </div>
        );
      },
    },
    {
      key: 'aplikasi',
      label: 'Aplikasi',
      sortable: true,
      render: (_: unknown, item: Permission) => (
        <span className="text-slate-600">{item.aplikasi ?? '-'}</span>
      ),
    },
    {
      key: 'roles',
      label: 'Dipakai oleh Role',
      sortable: false,
      render: (_: unknown, item: Permission) => {
        const permRoles = getPermRoles(item.name);
        if (permRoles.length === 0) {
          return <span className="text-slate-400 text-sm">Belum ada role</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {permRoles.map((role, idx) => (
              <span
                key={role.id}
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[idx % ROLE_COLORS.length]}`}
              >
                {role.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Aksi',
      sortable: false,
      render: () => (
        <button className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Lihat Detail">
          <Eye size={16} />
        </button>
      ),
    },
  ];

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
      </div>

      <DataTable
        columns={columns}
        data={permissions}
        searchable={['name', 'aplikasi']}
        loading={loading}
        emptyMessage="Belum ada data permission."
        perPage={15}
      />
    </div>
  );
}