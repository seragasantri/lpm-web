import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBerita } from '../lib/mockData';
import type { Berita } from '../lib/types';
import { Calendar, ArrowLeft, Eye, User, Tag, Rss } from 'lucide-react';

export default function BeritaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Berita[]>([]);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    getBerita().then(list => {
      const item = list.find(b => b.slug === slug || b.id === slug);
      if (item) {
        setBerita(item);
        const relatedItems = list.filter(b => b.kategori === item.kategori && b.id !== item.id && b.status === 'published').slice(0, 3);
        setRelated(relatedItems);
        const viewKey = `lpm_berita_views_${item.id}`;
        const currentViews = parseInt(localStorage.getItem(viewKey) || '0');
        localStorage.setItem(viewKey, String(currentViews + 1));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <>
      <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full" /></div>
    </>
  );

  if (!berita) return (
    <>
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Berita tidak ditemukan</h2>
        <Link to="/berita" className="text-sky-600 hover:text-sky-700 font-semibold">← Kembali ke daftar berita</Link>
      </div>
    </>
  );

  const viewKey = `lpm_berita_views_${berita.id}`;
  const views = parseInt(localStorage.getItem(viewKey) || '0');

  return (
    <>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Back */}
        <Link to="/berita" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold mb-6 transition-colors">
          <ArrowLeft size={18} /> Kembali ke Berita
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header Image - show if there's no gambar or always show */}
          <div className="w-full h-72 md:h-96 relative overflow-hidden bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
            {berita.gambar ? (
              <img src={berita.gambar} alt={berita.judul} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <Rss size={64} className="text-sky-400 mx-auto mb-4" />
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${berita.kategori === 'Akreditasi' ? 'bg-blue-100 text-blue-700' : berita.kategori === 'SPMI' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                  {berita.kategori}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${berita.kategori === 'Akreditasi' ? 'bg-blue-100 text-blue-700' : berita.kategori === 'SPMI' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                {berita.kategori}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                <Calendar size={14} />
                {new Date(berita.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                <User size={14} />
                {berita.author}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                <Eye size={14} />
                {views} dilihat
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">{berita.judul}</h1>

            {/* Excerpt */}
            <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">{berita.excerpt}</p>

            {/* Content */}
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Tag size={20} className="text-sky-500" />
              Berita Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/berita/${r.slug}`}
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  {r.gambar && (
                    <div className="h-36 overflow-hidden">
                      <img src={r.gambar} alt={r.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs font-bold text-sky-600">{r.kategori}</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1 line-clamp-2 leading-snug">{r.judul}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}