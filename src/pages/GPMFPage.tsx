import { useEffect } from 'react';
import React from 'react';
import { ShieldCheck, Users, Target, FileText, Calendar, Download, UserCircle } from 'lucide-react';
import Layout from '../components/Layout';

interface FunctionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FunctionCard({ icon, title, description }: FunctionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface OrgMemberProps {
  name: string;
  role: string;
  top: string;
  left: string;
  isChair?: boolean;
}

function OrgMember({ name, role, top, left, isChair }: OrgMemberProps) {
  return (
    <div
      className={`absolute transform -translate-x-1/2 bg-white border-2 ${isChair ? 'border-indigo-400' : 'border-slate-200'} rounded-xl p-3 text-center shadow-sm min-w-[160px]`}
      style={{ top, left }}
    >
      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-1">
        <UserCircle size={20} />
      </div>
      <p className={`font-semibold text-xs ${isChair ? 'text-indigo-700' : 'text-slate-700'}`}>{name}</p>
      <p className="text-slate-500 text-xs">{role}</p>
    </div>
  );
}

export default function GPMFPage() {
  useEffect(() => { document.title = 'GPMF :: LPM UIN Raden Fatah Palembang'; }, []);
  const functions = [
    {
      icon: <ShieldCheck size={20} />,
      title: 'Penjaminan Mutu Fakultas',
      description: 'Merumuskan dan melaksanakan kebijakan penjaminan mutu di tingkat fakultas sesuai standar nasional dan institusi.',
    },
    {
      icon: <Users size={20} />,
      title: 'Koordinasi GPMP',
      description: 'Mengkoordinasikan dan membimbing kegiatan Gugus Pengendalian Mutu Program Studi (GPMP) di lingkungan fakultas.',
    },
    {
      icon: <Target size={20} />,
      title: 'Monitoring & Evaluasi',
      description: 'Melakukan monitoring dan evaluasi berkala terhadap implementasi SPMI di seluruh program studi.',
    },
    {
      icon: <FileText size={20} />,
      title: 'Pelaporan & Dokumentasi',
      description: 'Menyusun laporan hasil penjaminan mutu dan memastikan dokumentasi kegiatan tersimpan dengan baik.',
    },
  ];

  const schedule = [
    { day: 'Senin', activity: 'Rapat Koordinasi GPMF', time: '09.00 - 11.00 WIB', location: 'Ruang Rapat Dekanat' },
    { day: 'Selasa', activity: 'Monitoring kegiatan GPMP', time: '13.00 - 15.00 WIB', location: 'Ruang GPMF Lt. 2' },
    { day: 'Kamis', activity: 'Evaluasi implementasi SPMI', time: '10.00 - 12.00 WIB', location: 'Ruang Rapat Dekanat' },
    { day: 'Jumat', activity: 'Diskusi tim GPMF', time: '14.00 - 16.00 WIB', location: 'Ruang GPMF Lt. 2' },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Gugus Penjaminan Mutu Fakultas (GPMF)</h1>
          <p className="text-sky-100">Penjaminan mutu di tingkat fakultas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Tentang GPMF</h2>
              <p className="text-slate-600 leading-relaxed">
                Gugus Penjaminan Mutu Fakultas (GPMF) merupakan unit fungsional di tingkat fakultas
                yang bertugas memastikan terlaksananya sistem penjaminan mutu di seluruh program studi
                dalam lingkungan fakultas. GPMF berperan sebagai penghubung antara LPMP dan GPMP
                dalam koordinasi dan implementasi kebijakan penjaminan mutu.
              </p>
            </div>
          </div>
        </div>

        {/* Function Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Tugas & Fungsi GPMF</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {functions.map((func, index) => (
              <FunctionCard key={index} {...func} />
            ))}
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Struktur Organisasi GPMF</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <div className="relative h-80">
              {/* Top Level */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-4">
                <div className="bg-indigo-600 text-white rounded-xl p-3 text-center shadow-md min-w-[180px]">
                  <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center mx-auto mb-1">
                    <UserCircle size={20} className="text-white" />
                  </div>
                  <p className="font-bold text-sm">Dekan / Wakil Dekan</p>
                  <p className="text-xs text-indigo-200">Pembina GPMF</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="absolute left-1/2 top-24 w-0.5 h-6 bg-slate-300 transform -translate-x-1/2" />

              {/* Second Level */}
              <div className="absolute left-1/2 top-32 transform -translate-x-1/2">
                <div className="bg-indigo-500 text-white rounded-xl p-3 text-center shadow-md min-w-[180px]">
                  <div className="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center mx-auto mb-1">
                    <UserCircle size={20} className="text-white" />
                  </div>
                  <p className="font-bold text-sm">Koordinator GPMF</p>
                  <p className="text-xs text-indigo-200">Pemimpin Struktural</p>
                </div>
              </div>

              {/* Connector Lines to members */}
              <div className="absolute left-1/2 top-48 w-0.5 h-6 bg-slate-300 transform -translate-x-1/2" />
              <div className="absolute left-1/4 top-56 w-1/2 border-t border-slate-300" />

              {/* Horizontal Line */}
              <div className="absolute left-1/4 top-56 w-1/2 border-t border-slate-300" />

              {/* Vertical Lines */}
              <div className="absolute left-1/4 top-56 w-0.5 h-6 bg-slate-300" />
              <div className="absolute left-1/2 top-56 w-0.5 h-6 bg-slate-300" />
              <div className="absolute left-3/4 top-56 w-0.5 h-6 bg-slate-300" />

              {/* Members Row */}
              <OrgMember name="Dr. Zainab, M.Ag." role="Sekretaris GPMF" top="224px" left="25%" />
              <OrgMember name="Dr. Rahman, M.Hum." role="Bidang Audit Mutu" top="224px" left="50%" />
              <OrgMember name="Dra. Maryam, M.Psi." role="Bidang Evaluasi" top="224px" left="75%" />

              {/* Second Member Row */}
              <div className="absolute left-1/4 top-288px w-1/2 border-t border-slate-300" style={{ top: '288px' }} />
              <div className="absolute left-1/4 top-288px w-0.5 h-6 bg-slate-300" style={{ top: '288px' }} />
              <div className="absolute left-1/2 top-288px w-0.5 h-6 bg-slate-300" style={{ top: '288px' }} />
              <div className="absolute left-3/4 top-288px w-0.5 h-6 bg-slate-300" style={{ top: '288px' }} />

              <OrgMember name="Dr. Ibrahim, M.Si." role="Bidang Perencanaan" top="308px" left="25%" />
              <OrgMember name="Dr. Khadijah, M.Ed." role="Bidang Pelatihan AMI" top="308px" left="50%" />
              <OrgMember name="Dr. Yusuf, M.H." role="Bidang Dokumen" top="308px" left="75%" />
            </div>
          </div>
        </div>

        {/* Meeting Schedule */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Jadwal Kegiatan GPMF</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50 border-b border-indigo-200">
                    <th className="text-left px-4 py-3 font-semibold text-indigo-700">Hari</th>
                    <th className="text-left px-4 py-3 font-semibold text-indigo-700">Kegiatan</th>
                    <th className="text-left px-4 py-3 font-semibold text-indigo-700">Waktu</th>
                    <th className="text-left px-4 py-3 font-semibold text-indigo-700">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/50 transition-colors`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">{item.day}</td>
                      <td className="px-4 py-3 text-slate-600">{item.activity}</td>
                      <td className="px-4 py-3 text-slate-600">{item.time}</td>
                      <td className="px-4 py-3 text-slate-600">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Download Guidelines */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-0.5">Panduan GPMF</h4>
            <p className="text-slate-500 text-sm">Dokumen petunjuk teknis pembentukan dan operasional GPMF</p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Download size={16} />
            Unduh Panduan
          </a>
        </div>
      </div>
    </Layout>
  );
}
