import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicStafs, type StafResponse } from '../lib/api';

const departmentColors: Record<string, string> = {
  Pimpinan: 'bg-red-100 text-red-700',
  Administrasi: 'bg-blue-100 text-blue-700',
  Akreditasi: 'bg-green-100 text-green-700',
  'Mutu Internal': 'bg-purple-100 text-purple-700',
  Keuangan: 'bg-yellow-100 text-yellow-700',
  Publikasi: 'bg-pink-100 text-pink-700',
  Perencanaan: 'bg-teal-100 text-teal-700',
};

export default function StafPage() {
  const [stafs, setStafs] = useState<StafResponse[]>([]);

  useEffect(() => {
    document.title = 'Pimpinan dan Staf :: LPM UIN Raden Fatah Palembang';
    const fetchData = async () => {
      const data = await getPublicStafs();
      setStafs(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sky-200 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Beranda
            </Link>
            <span>/</span>
            <span>Profil</span>
            <span>/</span>
            <span className="text-white font-medium">Pimpinan dan Staf</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Pimpinan dan Staf</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Section Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Pimpinan Lembaga Penjaminan Mutu
          </h2>
          <p className="text-slate-500 mt-2">
            Tim lengkap Lembaga Penjaminan Mutu UIN Raden Fatah Palembang
          </p>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stafs.map((staf) => (
            <div
              key={staf.id}
              className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={staf.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(staf.nama)}&background=0284c7&color=fff&size=200`}
                  alt={staf.nama}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-100"
                />
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                {staf.nama}
              </h3>
              <p className="text-sky-600 font-medium mb-3">{staf.jabatan}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${departmentColors[staf.program_studi || ''] || 'bg-slate-100 text-slate-600'}`}
              >
                {staf.program_studi || '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
