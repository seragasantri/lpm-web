import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getHalaman } from '../../../lib/mockData';
import type { Halaman } from '../../../lib/types';
import { FileText, Pencil } from 'lucide-react';

const PAGE_META: Record<string, { icon: string; title: string; desc: string }> = {
  profil: { icon: '🏢', title: 'Profil LPM', desc: 'Edit halaman profil lembaga' },
  sambutan: { icon: '💬', title: 'Sambutan Ketua', desc: 'Edit kata pengantar dari ketua LPM' },
  visimisi: { icon: '🎯', title: 'Visi dan Misi', desc: 'Edit visi, misi, dan tujuan' },
  gpmp: { icon: '📋', title: 'GPMP', desc: 'Edit halaman GPMP' },
  gpmf: { icon: '📋', title: 'GPMF', desc: 'Edit halaman GPMF' },
  iso: { icon: '📜', title: 'ISO', desc: 'Edit halaman standar ISO' },
  peraturan: { icon: '📚', title: 'Peraturan', desc: 'Edit halaman regulasi & prosedur' },
};

const PAGE_SLUGS = Object.keys(PAGE_META);

export default function HalamanIndex() {
  useEffect(() => { document.title = 'Manajemen Halaman :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const [pages, setPages] = useState<Halaman[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHalaman().then(setPages);
  }, []);

  if (!hasPermission('halaman.update')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
          Anda tidak memiliki akses ke halaman ini.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Halaman Statis</h1>
            <p className="text-sky-100 text-sm mt-0.5">Edit konten halaman statis website LPM</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGE_SLUGS.map(slug => {
          const meta = PAGE_META[slug];
          const page = pages.find(p => p.slug === slug);
          return (
            <div key={slug} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{meta.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{meta.desc}</p>
                </div>
              </div>
              {page && (
                <p className="text-xs text-slate-400 line-clamp-2">{page.konten.replace(/<[^>]+>/g, '')}</p>
              )}
              <button
                onClick={() => navigate(`/admin/halaman/${slug}`)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <Pencil size={14} /> Edit Halaman
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
