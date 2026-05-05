import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminTopbarProps {
  onMenuClick: () => void;
}

const routeTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/berita': 'Berita',
  '/admin/galeri': 'Galeri',
  '/admin/download': 'Download',
  '/admin/halaman': 'Halaman Statis',
  '/admin/struktur-organisasi': 'Struktur Organisasi',
  '/admin/staf': 'Staf',
  '/admin/sertifikat': 'Sertifikat',
  '/admin/peraturan': 'Peraturan',
  '/admin/poll': 'Poll',
  '/admin/footer': 'Footer',
  '/admin/users': 'User & Permission',
  '/admin/log': 'Log Aktivitas',
};

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = routeTitles[location.pathname] ?? 'Admin Panel';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 flex items-center justify-between h-16 px-4 md:px-6 bg-white shadow-sm z-30 border-b border-slate-200">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-150 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-slate-700 font-semibold text-lg md:text-xl">{pageTitle}</h1>
      </div>

      {/* Right: user dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-150"
        >
          <span className="hidden sm:flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <User size={18} />
            </span>
            <span className="font-medium text-sm">{user?.username ?? 'Admin'}</span>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </span>
          <span className="sm:hidden text-slate-600">
            <User size={20} />
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{user?.username ?? '-'}</p>
              {user?.roleIds?.[0] && (
                <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                  {user.roleIds[0]}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="px-2 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut size={16} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}