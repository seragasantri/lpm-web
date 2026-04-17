import { useEffect } from 'react';
import React from 'react';
import { ShieldCheck, Download, Users, ClipboardCheck, Target, BookUser, FileText } from 'lucide-react';


interface FunctionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FunctionCard({ icon, title, description }: FunctionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function GPMPPage() {
  useEffect(() => { document.title = 'GPMP :: LPM UIN Raden Fatah Palembang'; }, []);
  const functions = [
    {
      icon: <ClipboardCheck size={20} />,
      title: 'Pelaksanaan AMI',
      description: 'Melaksanakan Audit Mutu Internal (AMI) secara berkala pada program studi untuk memastikan kepatuhan terhadap standar SPMI.',
    },
    {
      icon: <Target size={20} />,
      title: 'Pengendalian Mutu',
      description: 'Melakukan pengendalian dan pemantauan kegiatan penjaminan mutu di tingkat program studi secara berkelanjutan.',
    },
    {
      icon: <BookUser size={20} />,
      title: 'Evaluasi Diri',
      description: 'Melakukan evaluasi diri program studi secara periodik sebagai dasar perbaikan mutu dan pengembangan institusi.',
    },
    {
      icon: <Users size={20} />,
      title: 'Koordinasi & Pelaporan',
      description: 'Mengkoordinasikan kegiatan mutu dengan GPMF dan LPMP, serta menyusun laporan hasil kegiatan penjaminan mutu.',
    },
  ];

  const members = [
    { no: 1, nama: 'Dr. Ahmad Fauzi, M.Ag.', jabatan: 'Ketua GPMP', prodi: 'Hukum Keluarga (Ahwal Syakhshiyyah)' },
    { no: 2, nama: 'Dr. Sri Hartati, M.Pd.', jabatan: 'Sekretaris', prodi: 'Pendidikan Bahasa Arab' },
    { no: 3, nama: 'Dr. Muhammad Anwar, M.Si.', jabatan: 'Anggota', prodi: 'Hukum Tata Negara' },
    { no: 4, nama: 'Dra. Fatimah Zahra, M.Hum.', jabatan: 'Anggota', prodi: 'Perbankan Syariah' },
    { no: 5, nama: 'Dr. Hasan Basri, M.A.', jabatan: 'Anggota', prodi: 'Komunikasi dan Penyiaran Islam' },
    { no: 6, nama: 'Dr. Nurul Huda, M.Psi.', jabatan: 'Anggota', prodi: 'Psikologi' },
    { no: 7, nama: 'Dr. Salim Al-Aidrus, Lc., M.A.', jabatan: 'Anggota', prodi: 'Ilmu Al-Qur\'an dan Tafsir' },
    { no: 8, nama: 'Dr. Aminah Abdullah, M.Hum.', jabatan: 'Anggota', prodi: 'Manajemen Pendidikan' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Gugus Pengendalian Mutu Prodi (GPMP)</h1>
          <p className="text-sky-100">Pengendalian mutu di tingkat program studi</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Tentang GPMP</h2>
              <p className="text-slate-600 leading-relaxed">
                Gugus Pengendalian Mutu Program Studi (GPMP) adalah unit kerja di tingkat program studi
                yang bertanggung jawab dalam pengendalian dan pemantauan mutu. GPMP berperan sebagai
                garda terdepan dalam memastikan bahwa setiap kegiatan akademik di program studi sesuai
                dengan standar yang telah ditetapkan oleh Sistem Penjaminan Mutu Internal (SPMI).
              </p>
            </div>
          </div>
        </div>

        {/* Function Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Tugas & Fungsi GPMP</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {functions.map((func, index) => (
              <FunctionCard key={index} {...func} />
            ))}
          </div>
        </div>

        {/* Members Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Susunan Anggota GPMP</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-12">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Nama</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Jabatan</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Program Studi</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-sky-50 transition-colors`}
                    >
                      <td className="px-4 py-3 text-slate-600">{member.no}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{member.nama}</td>
                      <td className="px-4 py-3 text-slate-600">{member.jabatan}</td>
                      <td className="px-4 py-3 text-slate-600">{member.prodi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Download Guidelines */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-0.5">Panduan GPMP</h4>
            <p className="text-slate-500 text-sm">Dokumen panduan pembentukan dan operasional GPMP</p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Download size={16} />
            Unduh Panduan
          </a>
        </div>
      </div>
    </div>
  );
}
