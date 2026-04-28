import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getPartners, deletePartner } from '../../../lib/api';
import DataTable from '../../components/DataTable';
import type { PartnerResponse } from '../../../lib/api';
import { Building2, Plus, Loader, Edit, Trash2 } from 'lucide-react';

export default function PartnerIndex() {
  useEffect(() => { document.title = 'Partner & Sertifikasi :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<PartnerResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await getPartners();
      setData(list);
    } catch (err) {
      console.error('Gagal memuat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (item: PartnerResponse) => {
    if (!confirm(`Hapus "${item.nama}"?`)) return;
    try {
      await deletePartner(item.id);
      await load();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama Partner',
      render: (_: unknown, item: PartnerResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-slate-500" />
          </div>
          <span className="font-semibold text-slate-800">{item.nama}</span>
        </div>
      ),
    },
    {
      key: 'logo_url',
      label: 'Logo',
      render: (_: unknown, item: PartnerResponse) => (
        item.logo_url ? (
          <img src={item.logo_url} alt={item.nama} className="w-12 h-12 object-contain rounded-lg" />
        ) : (
          <span className="text-slate-400 text-sm">Tidak ada logo</span>
        )
      ),
    },
    {
      key: 'link_url',
      label: 'Link',
      render: (_: unknown, item: PartnerResponse) => (
        <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 text-sm">
          Kunjungi
        </a>
      ),
    },
    {
      key: 'urutan',
      label: 'Urutan',
      render: (_: unknown, item: PartnerResponse) => (
        <span className="text-slate-600 font-medium">{item.urutan}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Partner & Sertifikasi</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola logo partner dan sertifikasi di halaman utama</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['nama']}
          onCreate={hasPermission('partner.create') ? () => navigate('/admin/partner/create') : undefined}
          onEdit={(item) => navigate(`/admin/partner/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Partner"
          emptyMessage="Belum ada partner/sertifikasi."
        />
      </div>
    </div>
  );
}
