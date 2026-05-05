import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPublicBeritas, type BeritaResponse } from '../lib/api';
import { getKategoriPublic } from '../lib/hooks-data';
import { Calendar, Search, Rss, ArrowRight, Eye } from 'lucide-react';

const kategoriColors: Record<string, string> = {
  Akreditasi: 'bg-blue-100 text-blue-700 border-blue-200',
  SPMI: 'bg-purple-100 text-purple-700 border-purple-200',
  'Inovasi Digital': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Sertifikasi: 'bg-amber-100 text-amber-700 border-amber-200',
  ISO: 'bg-sky-100 text-sky-700 border-sky-700',
  Lainnya: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function BeritaPage() {
  const navigate = useNavigate();
  const { kategori } = useParams<{ kategori?: string }>();
  const { tag } = useParams<{ tag?: string }>();
  const [berita, setBerita] = useState<BeritaResponse[]>([]);
  const [kategoriList, setKategoriList] = useState<{ id: string; nama: string }[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string | null>(kategori || null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const title = tag
      ? `Tag: ${tag} :: LPM UIN Raden Fatah`
      : selectedKategori
      ? `Berita ${selectedKategori} :: LPM UIN Raden Fatah`
      : 'Berita :: LPM UIN Raden Fatah';
    document.title = title;
  }, [selectedKategori, tag]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const beritaData = await getPublicBeritas({ per_page: 100, status: 'published' });
        const kategoriData = await getKategoriPublic();
        // Handle both array and object response
        const beritas = Array.isArray(beritaData) ? beritaData : (beritaData?.data || []);
        setBerita(beritas);
        setKategoriList(kategoriData);
      } catch (err) {
        console.error('Gagal memuat berita:', err);
        setBerita([]);
        setKategoriList([]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filtered = berita.filter(b => {
    const matchKategori = !selectedKategori || b.kategori?.nama === selectedKategori;
    const matchTag = !tag || (b.tags && b.tags.some(t => t.slug === tag));
    const matchSearch = !search ||
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      (b.excerpt?.toLowerCase() || '').includes(search.toLowerCase());
    return matchKategori && matchTag && matchSearch;
  });

  const getViews = (id: number) => {
    return parseInt(localStorage.getItem(`lpm_berita_views_${id}`) || '0');
  };

  const handleKategoriClick = (nama: string) => {
    // Navigate to kategori route
    navigate(`/berita/kategori/${encodeURIComponent(nama)}`);
  };

  const getGambarUrl = (gambar: string | null) => {
    if (!gambar) return null;
    return `${gambar}`;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Rss size={28} className="text-yellow-400" />
            <h1 className="text-3xl font-black">Berita & Artikel</h1>
          </div>
          <p className="text-sky-100 font-medium text-lg mb-1">
            Berikut berita dan artikel terbaru dari LPM UIN Raden Fatah
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-white/20 rounded-lg px-3 py-1.5 text-sm font-bold">
              {filtered.length} Berita
            </span>
            {tag && (
              <span className="bg-purple-500 text-white rounded-lg px-3 py-1.5 text-sm font-bold flex items-center gap-1">
                Tag: {tag}
              </span>
            )}
            {selectedKategori && (
              <button
                onClick={() => setSelectedKategori(null)}
                className="bg-yellow-400 text-sky-900 rounded-lg px-3 py-1.5 text-sm font-bold hover:bg-yellow-300 transition-colors"
              >
                Kategori: {selectedKategori} ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => navigate('/berita')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${!tag && !selectedKategori
            ? 'bg-sky-600 text-white shadow-lg'
            : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
            }`}
        >
          Semua
        </button>
        {kategoriList.map(k => (
          <button
            key={k.id}
            onClick={() => handleKategoriClick(k.nama)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${selectedKategori === k.nama
              ? 'bg-sky-600 text-white shadow-lg'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
              }`}
          >
            {k.nama}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berita..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
        />
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Rss size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            {tag ? `Tidak ada berita dengan tag "${tag}".` : 'Belum ada berita dalam kategori ini.'}
          </p>
          {tag && (
            <button
              onClick={() => navigate('/berita')}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              Lihat Semua Berita
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <Link
              key={item.id}
              to={`/berita/${item.slug}`}
              className="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
            >
              {item.gambar ? (
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={getGambarUrl(item.gambar) || ''}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-xs font-extrabold shadow-md ${kategoriColors[item.kategori?.nama || 'Lainnya'] || 'bg-slate-100 text-slate-600'}`}>
                    {item.kategori?.nama || 'Lainnya'}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-sky-100 to-sky-200 relative flex items-center justify-center">
                  <Rss size={40} className="text-sky-400 opacity-50" />
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-xs font-extrabold shadow-md ${kategoriColors[item.kategori?.nama || 'Lainnya'] || 'bg-slate-100 text-slate-600'}`}>
                    {item.kategori?.nama || 'Lainnya'}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={14} />
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Eye size={14} />
                    {getViews(item.id)} dilihat
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                  {item.judul}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">{item.excerpt}</p>
                <span className="text-sm font-bold text-sky-600 flex items-center group-hover:text-yellow-600 transition-colors">
                  Baca Selengkapnya <ArrowRight size={14} className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
