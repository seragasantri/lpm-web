import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Clear Google Translate cookie and prevent auto-translate on admin
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'googbert=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    // Remove any translate class added by Google Translate
    document.body.classList.remove('translated-content', 'translated-ltr');
    document.documentElement.style.setProperty('filter', '');
    document.documentElement.lang = 'id';
  }, []);

  return (
    <div className="flex h-screen bg-slate-100">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <AdminTopbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}