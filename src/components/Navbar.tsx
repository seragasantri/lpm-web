import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { navItems } from '../data/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string): boolean => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const isActiveParent = (item: typeof navItems[0]): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href || ''));
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const renderNavLink = (item: typeof navItems[0]) => {
    const active = item.href ? isActive(item.href) : isActiveParent(item);

    if (item.external && item.href) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-4 ${active
              ? 'bg-sky-900 text-yellow-400 border-yellow-400'
              : 'text-white border-transparent hover:bg-sky-900 hover:text-white'
            }`}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        to={item.href || '#'}
        className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-4 ${active
            ? 'bg-sky-900 text-yellow-400 border-yellow-400'
            : 'text-white border-transparent hover:bg-sky-900 hover:text-white'
          }`}
      >
        {item.label}
      </Link>
    );
  };

  const renderDropdown = (item: typeof navItems[0]) => {
    const isOpen = openDropdown === item.label;
    const hasActiveChild = isActiveParent(item);

    return (
      <li key={item.label} className="relative">
        <button
          onClick={() => handleDropdownToggle(item.label)}
          className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-4 w-full ${hasActiveChild
              ? 'bg-sky-900 text-yellow-400 border-yellow-400'
              : 'text-white border-transparent hover:bg-sky-900 hover:text-white'
            }`}
        >
          {item.label}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <ul
          className={`absolute left-0 top-full min-w-[240px] bg-white shadow-2xl rounded-b-2xl border-t-4 border-t-yellow-400 overflow-hidden z-50 transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
            }`}
        >
          {item.children?.map((child) => (
            <li key={child.label}>
              {child.external && child.href ? (
                <a
                  href={child.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150 border-b border-gray-100 last:border-0"
                >
                  {child.label}
                </a>
              ) : (
                <Link
                  to={child.href || '#'}
                  onClick={() => setOpenDropdown(null)}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150 border-b border-gray-100 last:border-0"
                >
                  {child.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </li>
    );
  };

  const renderMobileNavLink = (item: typeof navItems[0]) => {
    if (item.children && item.children.length > 0) {
      const isOpen = openDropdown === item.label;
      return (
        <li key={item.label}>
          <button
            onClick={() => handleDropdownToggle(item.label)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white border-b border-white/10 transition-colors duration-150 ${isOpen ? 'bg-sky-900' : ''
              }`}
          >
            <span>{item.label}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          <ul
            className={`bg-sky-950/50 overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[500px]' : 'max-h-0'
              }`}
          >
            {item.children.map((child) => (
              <li key={child.label}>
                {child.external && child.href ? (
                  <a
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-2.5 text-sm text-sky-100/80 hover:text-yellow-400 transition-colors duration-150 border-b border-white/5"
                  >
                    {child.label}
                  </a>
                ) : (
                  <Link
                    to={child.href || '#'}
                    onClick={() => { setOpenDropdown(null); setIsOpen(false); }}
                    className="block px-6 py-2.5 text-sm text-sky-100/80 hover:text-yellow-400 transition-colors duration-150 border-b border-white/5"
                  >
                    {child.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      );
    }

    const active = item.href ? isActive(item.href) : false;
    return (
      <li key={item.label}>
        {item.external && item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block px-4 py-3 text-sm font-medium border-b border-white/10 transition-colors duration-150 ${active ? 'bg-sky-900 text-yellow-400' : 'text-white hover:bg-sky-900 hover:text-yellow-400'
              }`}
          >
            {item.label}
          </a>
        ) : (
          <Link
            to={item.href || '#'}
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 text-sm font-medium border-b border-white/10 transition-colors duration-150 ${active ? 'bg-sky-900 text-yellow-400' : 'text-white hover:bg-sky-900 hover:text-yellow-400'
              }`}
          >
            {item.label}
          </Link>
        )}
      </li>
    );
  };

  const now = new Date();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayName = dayNames[now.getDay()];
  const day = now.getDate().toString().padStart(2, '0');
  const monthName = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const dateStr = `${dayName}, ${day} ${monthName} ${year}`;

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes} WIB`;

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div
        className={`bg-sky-950 text-sky-100 transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {timeStr}
            </span>
            <span className="text-sky-200">|</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-sky-200 hidden sm:block">|</span>
            <a
              href="http://radenfatah.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors duration-150 hidden sm:block"
            >
              Web Utama UIN
            </a>
            <span className="text-sky-200 hidden sm:block">|</span>
            <a
              href="#"
              className="hover:text-yellow-400 transition-colors duration-150 hidden sm:block"
            >
              Alumni
            </a>
            <span className="text-sky-200 hidden sm:block">|</span>
            <a
              href="#"
              className="hover:text-yellow-400 transition-colors duration-150"
            >
              Karir
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div
        className={`bg-gradient-to-r from-sky-700 via-sky-600 to-sky-500 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-3'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 via-sky-600 to-sky-800 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-lg tracking-wide">UIN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight tracking-wide">
                LPM UIN Raden Fatah
              </span>
              <span className="text-sky-200 text-xs leading-tight tracking-wide">
                Lembaga Penjaminan Mutu Palembang
              </span>
            </div>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm ml-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 text-sm rounded-full bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-200"
              />
              <button className="absolute right-0 top-0 h-full px-3 text-sky-600 hover:text-sky-800 transition-colors duration-150">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Nav Bar */}
      <div className="bg-sky-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden lg:flex items-stretch">
            <ul className="flex items-stretch">
              {navItems.map((item) =>
                item.children && item.children.length > 0
                  ? renderDropdown(item)
                  : <li key={item.label} className="flex items-stretch">{renderNavLink(item)}</li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-12 h-12 text-white hover:bg-sky-700 rounded-md transition-colors duration-150 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'
          }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsOpen(false)}
        />
        <nav
          className={`absolute top-0 left-0 bottom-0 w-72 bg-sky-800 shadow-2xl transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-white font-bold text-base">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-10 h-10 text-white hover:bg-sky-700 rounded-md transition-colors duration-150"
            >
              <X size={22} />
            </button>
          </div>
          <ul className="py-2">
            {navItems.map((item) => renderMobileNavLink(item))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
