import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Download,
  Network,
  Users,
  Award,
  ScrollText,
  BarChart2,
  Settings,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
  Plus,
  List,
  Building2,
  BookOpen,
  UserCog,
  Shield,
  Key,
  FolderOpen,
  FileCheck,
  Globe,
  UserCircle,
  MessageSquare,
  Target,
  MapPin,
  ClipboardCheck,
  BookText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SubMenuItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permissionKey: 'dashboard' | 'berita' | 'galeri' | 'download' | 'halaman' | 'struktur' | 'staf' | 'sertifikat' | 'peraturan' | 'poll' | 'footer' | 'user' | 'log' | 'kategori' | 'faker' | 'prodi' | 'spme' | 'profil' | 'spmi';
  to?: string;
  submenu?: SubMenuItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, permissionKey: 'dashboard' },
  {
    label: 'Berita', icon: FileText, permissionKey: 'berita',
    submenu: [
      { label: 'Semua Berita', to: '/admin/berita', icon: List },
      { label: 'Tambah Berita', to: '/admin/berita/create', icon: Plus },
      { label: 'Kategori', to: '/admin/kategori', icon: Tag },
    ]
  },
  { label: 'Galeri', to: '/admin/galeri', icon: Image, permissionKey: 'galeri' },
  { label: 'Download', to: '/admin/download', icon: Download, permissionKey: 'download' },
  { label: 'Halaman Statis', to: '/admin/halaman', icon: ScrollText, permissionKey: 'halaman' },
  {
    label: 'SPME', icon: FolderOpen, permissionKey: 'spme',
    submenu: [
      { label: 'Akreditasi', to: '/admin/spme/akreditasi', icon: Award },
      { label: 'ISO', to: '/admin/spme/iso', icon: FileCheck },
      { label: 'Situs Terkait', to: '/admin/spme/situs', icon: Globe },
    ]
  },
  {
    label: 'Profil', icon: UserCircle, permissionKey: 'profil',
    submenu: [
      { label: 'Profil LPM', to: '/admin/profil/lpm', icon: ShieldCheck },
      { label: 'Sambutan Ketua', to: '/admin/profil/sambutan', icon: MessageSquare },
      { label: 'Visi Misi', to: '/admin/profil/visimisi', icon: Target },
      { label: 'Struktur Org', to: '/admin/profil/struktur', icon: Network },
      { label: 'Pimpinan & Staf', to: '/admin/staf', icon: Users },
      { label: 'Kontak', to: '/admin/profil/kontak', icon: MapPin },
    ]
  },
  { label: 'Sertifikat', to: '/admin/sertifikat', icon: Award, permissionKey: 'sertifikat' },
  { label: 'Peraturan', to: '/admin/peraturan', icon: ScrollText, permissionKey: 'peraturan' },
  { label: 'Poll', to: '/admin/poll', icon: BarChart2, permissionKey: 'poll' },
  { label: 'Fakultas', to: '/admin/faker', icon: Building2, permissionKey: 'berita' },
  { label: 'Prodi', to: '/admin/prodi', icon: BookOpen, permissionKey: 'berita' },
  { label: 'Footer', to: '/admin/footer', icon: Settings, permissionKey: 'footer' },
  {
    label: 'Manajemen User', icon: ShieldCheck, permissionKey: 'user',
    submenu: [
      { label: 'Users', to: '/admin/users', icon: UserCog },
      { label: 'Role', to: '/admin/role', icon: Shield },
      { label: 'Permission', to: '/admin/permission', icon: Key },
    ]
  },
  {
    label: 'SPMI', icon: ClipboardCheck, permissionKey: 'spmi',
    submenu: [
      { label: 'GPMP', to: '/admin/spmi/gpmp', icon: BookOpen },
      { label: 'GPMF', to: '/admin/spmi/gpmf', icon: BookText },
    ]
  },
  { label: 'Log Aktivitas', to: '/admin/log', icon: Activity, permissionKey: 'log' },
  { label: 'Pengaturan', to: '/admin/settings', icon: Settings, permissionKey: 'user' },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Berita');

  const isActive = (path: string) => location.pathname === path;
  const isSubmenuActive = (subs?: SubMenuItem[]) => subs?.some(s => isActive(s.to));

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-sky-800 z-40 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sky-700/50 shrink-0">
        <ShieldCheck size={28} className="text-yellow-400 shrink-0" />
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-wide">LPM ADMIN</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => {
          if (!hasPermission(item.permissionKey)) return null;

          // Item with submenu
          if (item.submenu) {
            const isOpen = openSubmenu === item.label;
            const hasActive = isSubmenuActive(item.submenu);

            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mx-0 my-0.5 transition-colors duration-150 group ${hasActive
                    ? 'bg-sky-700 text-yellow-400'
                    : 'text-white/80 hover:bg-sky-700/50 hover:text-white'
                    }`}
                >
                  <item.icon
                    size={20}
                    className={`shrink-0 ${hasActive ? 'text-yellow-400' : 'text-white/70 group-hover:text-white'}`}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </button>

                {/* Submenu */}
                {!collapsed && isOpen && (
                  <div className="ml-4 mt-1 mb-2 space-y-0.5">
                    {item.submenu?.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive: linkActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${linkActive
                            ? 'bg-sky-600 text-yellow-400 font-medium'
                            : 'text-white/60 hover:bg-sky-600/50 hover:text-white'
                          }`
                        }
                      >
                        <sub.icon size={16} className="shrink-0" />
                        <span>{sub.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Simple nav item
          return (
            <NavLink
              key={item.label}
              to={item.to || '/admin'}
              end={item.to === '/admin'}
              className={({ isActive: linkActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mx-0 my-0.5 transition-colors duration-150 group ${linkActive
                  ? 'bg-sky-700 text-yellow-400'
                  : 'text-white/80 hover:bg-sky-700/50 hover:text-white'
                }`
              }
            >
              <item.icon
                size={20}
                className="shrink-0"
              />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="shrink-0 px-2 py-4 border-t border-sky-700/50">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full p-2 rounded-lg text-white/60 hover:bg-sky-700/50 hover:text-white transition-colors duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}