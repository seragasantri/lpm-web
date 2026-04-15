
import { Award, Download, QrCode, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function SertifikatPage() {
  const stats = [
    { label: 'Akreditasi Unggul', count: 34, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    { label: 'Akreditasi A', count: 4, color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { label: 'Akreditasi B', count: 1, color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { label: 'Baik Sekali', count: 7, color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  ];

  const totalProdi = stats.reduce((sum, s) => sum + s.count, 0);

  const programs = [
    { no: 1, prodi: 'Hukum Keluarga (Ahwal Syakhshiyyah)', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '204/SK/BAN-PT/Akred/S/V/2024', berlaku: '7 Mei 2024 - 7 Mei 2029' },
    { no: 2, prodi: 'Hukum Tata Negara', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '356/SK/BAN-PT/Akred/S/VII/2023', berlaku: '11 Juli 2023 - 11 Juli 2028' },
    { no: 3, prodi: 'Perbankan Syariah', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '158/SK/BAN-PT/Akred/S/IV/2024', berlaku: '3 April 2024 - 3 April 2029' },
    { no: 4, prodi: 'Pendidikan Guru Madrasah Ibtidaiyah (PGMI)', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '112/SK/BAN-PT/Akred/S/III/2023', berlaku: '14 Maret 2023 - 14 Maret 2028' },
    { no: 5, prodi: 'Pendidikan Agama Islam (PAI)', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '089/SK/BAN-PT/Akred/S/II/2024', berlaku: '28 Februari 2024 - 28 Februari 2029' },
    { no: 6, prodi: 'Ilmu Al-Qur\'an dan Tafsir', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '267/SK/BAN-PT/Akred/S/VI/2023', berlaku: '6 Juni 2023 - 6 Juni 2028' },
    { no: 7, prodi: 'Komunikasi dan Penyiaran Islam', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '445/SK/BAN-PT/Akred/S/IX/2023', berlaku: '22 September 2023 - 22 September 2028' },
    { no: 8, prodi: 'Manajemen Pendidikan', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '078/SK/BAN-PT/Akred/S/I/2024', berlaku: '10 Januari 2024 - 10 Januari 2029' },
    { no: 9, prodi: 'Psikologi', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '189/SK/BAN-PT/Akred/S/V/2023', berlaku: '15 Mei 2023 - 15 Mei 2028' },
    { no: 10, prodi: 'Ekonomi Syariah', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '302/SK/BAN-PT/Akred/S/VII/2024', berlaku: '18 Juli 2024 - 18 Juli 2029' },
    { no: 11, prodi: 'Hukum Bisnis Syariah', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '134/SK/BAN-PT/Akred/S/IV/2023', berlaku: '5 April 2023 - 5 April 2028' },
    { no: 12, prodi: 'Pendidikan Bahasa Arab', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '411/SK/BAN-PT/Akred/S/VIII/2023', berlaku: '30 Agustus 2023 - 30 Agustus 2028' },
    { no: 13, prodi: 'Tadris Matematika', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '223/SK/BAN-PT/Akred/S/V/2024', berlaku: '20 Mei 2024 - 20 Mei 2029' },
    { no: 14, prodi: 'Tadris Bahasa Indonesia', jenjang: 'S1', lembaga: 'BAN-PT', noSk: '167/SK/BAN-PT/Akred/S/IV/2024', berlaku: '12 April 2024 - 12 April 2029' },
    { no: 15, prodi: 'Konseling Keluarga (Hukum Keluarga)', jenjang: 'S2', lembaga: 'BAN-PT', noSk: '089/SK/BAN-PT/Akred/S/II/2023', berlaku: '1 Februari 2023 - 1 Februari 2028' },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Sertifikat Akreditasi</h1>
          <p className="text-sky-100">Daftar akreditasi program studi UIN Raden Fatah</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Statistik Akreditasi</h2>
              <p className="text-slate-500 text-sm mt-1">Total {totalProdi} program studi</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle size={20} />
              <span className="font-semibold text-sm">Terverifikasi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 text-center`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.color} rounded-full mb-2`}>
                  <Award size={18} className="text-white" />
                </div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.count}</p>
                <p className={`text-xs font-medium ${stat.textColor} mt-0.5`}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div>
            <div className="flex items-end gap-2 h-24">
              {stats.map((stat, index) => {
                const width = (stat.count / totalProdi) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full ${stat.color} rounded-t-md transition-all duration-300 min-h-[4px]`}
                      style={{ height: `${Math.max((width / 100) * 96, 4)}px` }}
                      title={`${stat.label}: ${stat.count}`}
                    />
                    <span className="text-xs text-slate-500 font-medium">{stat.count}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex-1 flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${stat.color} flex-shrink-0`} />
                  <span className="text-xs text-slate-500 truncate">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Verification Note */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-6 flex gap-4 items-start">
          <QrCode size={22} className="text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 mb-1">Verifikasi dengan QR Code</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Setiap sertifikat akreditasi dapat diverifikasi melalui QR code yang tertera pada dokumen asli.
              Scan QR code pada sertifikat atau kunjungi portal verikasi BAN-PT untuk memastikan keaslian dokumen.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 w-12">No</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Program Studi</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 w-16">Jenjang</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Lembaga Akreditasi</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">No. SK</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Masa Berlaku</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-sky-50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-slate-600">{prog.no}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{prog.prodi}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">
                        {prog.jenjang}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{prog.lembaga}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{prog.noSk}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{prog.berlaku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download All */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <QrCode size={16} />
            Verifikasi Online
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Download size={16} />
            Unduh Daftar Lengkap
          </a>
        </div>
      </div>
    </Layout>
  );
}
