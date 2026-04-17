import { useEffect } from 'react';

import { Award, CheckCircle, Download, FileText, ExternalLink, Trophy, Target, ClipboardCheck } from 'lucide-react';


interface MilestoneProps {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'upcoming';
}

function MilestoneCard({ year, title, description, icon, status }: MilestoneProps) {
  const statusStyles = {
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    current: 'bg-sky-100 text-sky-700 border-sky-200',
    upcoming: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${statusStyles[status]}`}>
          {icon}
        </div>
        <div className="w-0.5 h-full bg-slate-200 mt-2" />
      </div>
      <div className="pb-8">
        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 ${statusStyles[status]}`}>
          {year}
        </span>
        <h4 className="font-semibold text-slate-800 text-lg">{title}</h4>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface DocumentCardProps {
  title: string;
  description: string;
  type: string;
}

function DocumentCard({ title, description, type }: DocumentCardProps) {
  const typeColors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    DOC: 'bg-blue-100 text-blue-700',
    XLS: 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-sky-600 flex-shrink-0" />
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeColors[type] || 'bg-slate-100 text-slate-600'}`}>
              {type}
            </span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">{title}</h4>
          <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
        </div>
        <a
          href="#"
          className="flex-shrink-0 w-9 h-9 bg-sky-100 hover:bg-sky-200 text-sky-600 rounded-lg flex items-center justify-center transition-colors"
          title="Unduh Dokumen"
        >
          <Download size={16} />
        </a>
      </div>
    </div>
  );
}

export default function ISOPage() {
  useEffect(() => { document.title = 'ISO 9001:2015 :: LPM UIN Raden Fatah Palembang'; }, []);
  const milestones: MilestoneProps[] = [
    {
      year: '2017',
      title: 'Sertifikasi ISO 9001:2015 Pertama',
      description: 'UIN Raden Fatah berhasil memperoleh sertifikat ISO 9001:2015 untuk pertama kalinya, mencakup sistem manajemen mutu di bidang pendidikan.',
      icon: <Award size={20} />,
      status: 'completed',
    },
    {
      year: '2019',
      title: 'Surveillance Audit Pertama',
      description: 'Melakukan surveillance audit pertama oleh pihak certifier untuk memastikan kesinambungan penerapan sistem manajemen mutu.',
      icon: <ClipboardCheck size={20} />,
      status: 'completed',
    },
    {
      year: '2021',
      title: 'Re-Certification Audit',
      description: 'Berhasil melewati proses re-certification audit dan memperoleh kembali sertifikat ISO 9001:2015 dengan cakupan yang lebih luas.',
      icon: <Trophy size={20} />,
      status: 'completed',
    },
    {
      year: '2024',
      title: 'Sertifikasi Baru & Perluasan Cakupan',
      description: 'Memperoleh renewal sertifikat ISO 9001:2015 dan memperluas cakupan sertifikasi ke unit-unit baru di lingkungan UIN Raden Fatah.',
      icon: <Target size={20} />,
      status: 'current',
    },
  ];

  const documents = [
    { title: 'Sertifikat ISO 9001:2015', description: 'Salinan sertifikat ISO 9001:2015 UIN Raden Fatah', type: 'PDF' },
    { title: 'Manual Mutu', description: 'Dokumen manual mutu sistem manajemen ISO 9001:2015', type: 'PDF' },
    { title: 'Prosedur Mutu', description: 'Kumpulan prosedur operasional standard mutu', type: 'PDF' },
    { title: 'Formulir ISO', description: 'Berbagai formulir yang digunakan dalam sistem ISO', type: 'DOC' },
    { title: 'Daftar Risiko', description: 'Register risiko dan kesempatan organisasi', type: 'XLS' },
    { title: 'Auditor Schedule', description: 'Jadwal audit internal dan eksternal ISO', type: 'PDF' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">ISO 9001:2015</h1>
          <p className="text-sky-100">Sistem Manajemen Mutu Berbasis ISO di UIN Raden Fatah</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ISO Badge Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-36 h-36 bg-gradient-to-br from-sky-600 to-sky-800 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg">
                <Award size={40} className="mb-1" />
                <span className="text-2xl font-bold">ISO</span>
                <span className="text-xs font-medium text-sky-200">9001:2015</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                <CheckCircle size={16} />
                Tersertifikasi
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Sistem Manajemen Mutu ISO 9001:2015</h2>
              <p className="text-slate-600 leading-relaxed">
                UIN Raden Fatah telah tersertifikasi ISO 9001:2015 sebagai bukti komitmen institusi dalam menerapkan
                sistem manajemen mutu yang berkelanjutan. Sertifikasi ini mencakup seluruh proses akademik dan
                administratif untuk memastikan pelayanan prima kepada seluruh pemangku kepentingan.
              </p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Unduh Sertifikat
                </a>
                <a
                  href="https://iso.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <ExternalLink size={16} />
                  Tentang ISO
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Perjalanan Sertifikasi ISO</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} {...milestone} />
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Dokumen ISO</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <DocumentCard key={index} {...doc} />
            ))}
          </div>
        </div>

        {/* Certificate Image Placeholder */}
        <div className="mt-8 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
          <Award size={48} className="text-slate-300 mb-3" />
          <p className="text-slate-400 font-medium">Area Display Sertifikat ISO</p>
          <p className="text-slate-400 text-sm">Sertifikat asli dapat ditampilkan di area ini</p>
        </div>
      </div>
    </div>
  );
}
