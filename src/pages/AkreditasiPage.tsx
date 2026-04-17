import { useEffect } from 'react';
import { AlertCircle, FileText, Download, ExternalLink, BookOpen, ClipboardCheck, FileCheck, Users, Globe } from 'lucide-react';

interface InstrumentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  downloadUrl?: string;
  externalUrl?: string;
}

function InstrumentCard({ icon, title, description, downloadUrl, externalUrl }: InstrumentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-lg mb-1">{title}</h3>
          <p className="text-slate-500 text-sm mb-4">{description}</p>
          <div className="flex gap-2">
            {downloadUrl && (
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
              >
                <Download size={14} />
                Unduh
              </a>
            )}
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
              >
                <ExternalLink size={14} />
                Kunjungi
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface RelatedLinkProps {
  icon: React.ReactNode;
  title: string;
  url: string;
}

function RelatedLink({ icon, title, url }: RelatedLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors duration-150 group"
    >
      <div className="w-9 h-9 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700 transition-colors">{title}</span>
    </a>
  );
}

export default function AkreditasiPage() {
  useEffect(() => { document.title = 'Instrumen Akreditasi BAN-PT :: LPM UIN Raden Fatah Palembang'; }, []);
  const instruments = [
    {
      icon: <ClipboardCheck size={22} />,
      title: 'Instrumen Akreditasi Program Studi',
      description: 'Instrumen akreditasi untuk evaluasi dan asesorat program studi sesuai standar BAN-PT.',
      externalUrl: 'https://banpt.or.id',
    },
    {
      icon: <Users size={22} />,
      title: 'Instrumen AMI Auditee',
      description: 'Instrumen Audit Mutu Internal untuk Auditee yang digunakan dalam proses AMI.',
      downloadUrl: '#',
    },
    {
      icon: <FileCheck size={22} />,
      title: 'Instrumen AMI Auditor',
      description: 'Instrumen Audit Mutu Internal untuk Auditor dalam melaksanakan kegiatan AMI.',
      downloadUrl: '#',
    },
    {
      icon: <BookOpen size={22} />,
      title: 'Instrumen Evaluasi Diri',
      description: 'Instrumen evaluasi diri program studi untuk melakukan penilaian kinerja mandiri.',
      downloadUrl: '#',
    },
  ];

  const relatedLinks = [
    {
      icon: <Globe size={18} />,
      title: 'Website BAN-PT',
      url: 'https://banpt.or.id',
    },
    {
      icon: <FileText size={18} />,
      title: 'Instrumen LAM',
      url: 'https://sialim.kemdikbud.go.id',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Instrumen Akreditasi BAN-PT</h1>
          <p className="text-sky-100">Unduh instrumen akreditasi dan dokumen pendukung SPMI</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-yellow-400 text-sky-900 rounded-xl p-5 mb-8 flex gap-4 items-start">
          <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Informasi Pengunduhan Instrumen</p>
            <p className="text-sm leading-relaxed">
              Untuk mengunduh Instrumen Akreditasi Program Studi, silakan kunjungi{' '}
              <a
                href="https://banpt.or.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-sky-700"
              >
                banpt.or.id
              </a>
              . Instrumen dari Lembaga Akreditasi Mandiri (LAM) dapat diunduh melalui{' '}
              <a
                href="https://sialim.kemdikbud.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-sky-700"
              >
                Sistem Informasi Akreditasi (SIALIN)
              </a>
              .
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Daftar Instrumen Akreditasi</h2>
            <div className="space-y-4">
              {instruments.map((item, index) => (
                <InstrumentCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ExternalLink size={18} className="text-sky-600" />
                Tautan Terkait
              </h3>
              <div className="space-y-1">
                {relatedLinks.map((link, index) => (
                  <RelatedLink key={index} {...link} />
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">Dokumen Pendukung</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 transition-colors">
                    <FileText size={14} />
                    Panduan SPMI
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 transition-colors">
                    <FileText size={14} />
                    Form AMI
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 transition-colors">
                    <FileText size={14} />
                    Template Laporan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
