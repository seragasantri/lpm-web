import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBeritaBySlug, getPublicBeritas, type BeritaResponse } from '../lib/api';
import { Calendar, ArrowLeft, Eye, User, Tag, Rss } from 'lucide-react';

export default function BeritaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [berita, setBerita] = useState<BeritaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<BeritaResponse[]>([]);
  const viewsTracked = useRef<string | null>(null);

  const loadBerita = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const item = await getBeritaBySlug(slug);
      setBerita(item);

      // Track views only once per berita
      if (viewsTracked.current !== item.id.toString()) {
        const viewKey = `lpm_berita_views_${item.id}`;
        const currentViews = parseInt(localStorage.getItem(viewKey) || '0');
        localStorage.setItem(viewKey, String(currentViews + 1));
        viewsTracked.current = item.id.toString();
      }

      // Load related beritas from same category
      const result = await getPublicBeritas({ per_page: 5, status: 'published', kategori_id: item.kategoris_id });
      const allBeritas = Array.isArray(result) ? result : result?.data || [];
      const relatedItems = allBeritas.filter((b: BeritaResponse) => b.id !== item.id).slice(0, 4);
      setRelated(relatedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadBerita();
  }, [loadBerita]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full" />
    </div>
  );

  if (error || !berita) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Berita tidak ditemukan</h2>
      <p className="text-slate-500 mb-4">{error || 'Silakan coba lagi nanti.'}</p>
      <Link to="/berita" className="text-sky-600 hover:text-sky-700 font-semibold">← Kembali ke daftar berita</Link>
    </div>
  );

  const viewKey = `lpm_berita_views_${berita.id}`;
  const views = parseInt(localStorage.getItem(viewKey) || '0');
  const kategoriNama = berita.kategori?.nama || 'Lainnya';
  const gambarUrl = berita.gambar ? `${berita.gambar}` : null;

  const kategoriColors: Record<string, string> = {
    Akreditasi: 'bg-blue-100 text-blue-700',
    SPMI: 'bg-purple-100 text-purple-700',
    'Inovasi Digital': 'bg-cyan-100 text-cyan-700',
    Sertifikasi: 'bg-amber-100 text-amber-700',
    ISO: 'bg-sky-100 text-sky-700',
  };
  const kategoriColor = kategoriColors[kategoriNama] || 'bg-sky-100 text-sky-700';

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Back */}
      <Link to="/berita" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold mb-6 transition-colors">
        <ArrowLeft size={18} /> Kembali ke Berita
      </Link>

      {/* Article */}
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Image */}
        <div className="w-full h-72 md:h-96 relative overflow-hidden bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
          {gambarUrl ? (
            <img src={gambarUrl} alt={berita.judul} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <Rss size={64} className="text-sky-400 mx-auto mb-4" />
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${kategoriColor}`}>
                {kategoriNama}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-10">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${kategoriColor}`}>
              {kategoriNama}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Calendar size={14} />
              {new Date(berita.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <User size={14} />
              {berita.author?.username || berita.author?.name || '-'}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Eye size={14} />
              {views} dilihat
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">{berita.judul}</h1>

          {/* Excerpt */}
          {berita.excerpt && (
            <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">{berita.excerpt}</p>
          )}

          {/* Content */}
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: berita.konten }}
          />
        </div>
      </article>

      {/* Related - show related beritas from same category */}
      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Tag size={20} className="text-sky-500" />
            Berita Terkait
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(r => (
              <Link
                key={r.id}
                to={`/berita/${r.slug}`}
                className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                {r.gambar && (
                  <div className="h-36 overflow-hidden">
                    <img
                      src={`${r.gambar}`}
                      alt={r.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-xs font-bold text-sky-600">{r.kategori?.nama}</span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1 line-clamp-2 leading-snug">{r.judul}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
