import { useEffect } from 'react';
import Layout from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StaffMember {
  name: string;
  position: string;
  department: string;
  photoId: string;
}

const staffMembers: StaffMember[] = [
  {
    name: 'Dr. H. Ahmad Hidayat, M.Ag.',
    position: 'Ketua LPM',
    department: 'Pimpinan',
    photoId: '1560250097',
  },
  {
    name: 'Dr. Siti Aminah, M.Pd.',
    position: 'Sekretaris',
    department: 'Administrasi',
    photoId: '1573496359',
  },
  {
    name: 'Prof. Dr. Budi Santoso, M.Si.',
    position: 'Kepala Bagian Akreditasi',
    department: 'Akreditasi',
    photoId: '1472099645',
  },
  {
    name: 'Dr. Hasan Basri, M.Hum.',
    position: 'Kepala Bagian Mutu Internal',
    department: 'Mutu Internal',
    photoId: '1507003211169',
  },
  {
    name: 'Muhammad Yusuf, S.Pd., M.M.',
    position: 'Staf Administrasi',
    department: 'Administrasi',
    photoId: '1500648767791',
  },
  {
    name: 'Dewi Rahmawati, S.Kom., M.T.',
    position: 'Staf Keuangan',
    department: 'Keuangan',
    photoId: '1552058544',
  },
  {
    name: 'Ir. Abdul Rahman, M.T.',
    position: 'Auditor Mutu Internal',
    department: 'Mutu Internal',
    photoId: '1568602471122',
  },
  {
    name: 'Fitri Handayani, S.Sos., M.AP.',
    position: 'Staf Dokumentasi & Publikasi',
    department: 'Publikasi',
    photoId: '1519085360753',
  },
  {
    name: 'Ahmad Fauzi, S.E., M.M.',
    position: 'Staf Perencanaan',
    department: 'Perencanaan',
    photoId: '1560250097',
  },
  {
    name: 'Nur Halimah, S.Pd., M.Sc.',
    position: 'Staf Pengendalian Mutu',
    department: 'Mutu Internal',
    photoId: '1573496359',
  },
];

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
  useEffect(() => { document.title = 'Pimpinan dan Staf :: LPM UIN Raden Fatah Palembang'; }, []);
  return (
    <Layout>
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
          {staffMembers.map((staff, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={`https://images.unsplash.com/photo-${staff.photoId}?auto=format&fit=crop&q=80&w=200&h=200`}
                  alt={staff.name}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-100"
                />
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                {staff.name}
              </h3>
              <p className="text-sky-600 font-medium mb-3">{staff.position}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  departmentColors[staff.department] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {staff.department}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
