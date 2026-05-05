import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Eye, User, Tag as TagIcon, Rss, ChevronRight, Share2, Bookmark } from 'lucide-react';
import { getBeritaBySlug, getPublicBeritas, type BeritaResponse, type TagResponse } from '../lib/api';

// Helper to extract plain text from HTML
function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Helper to generate excerpt from content if not provided
function getExcerpt(content: string | null, excerpt: string | null, maxWords = 50): string {
  if (excerpt && excerpt.trim()) {
    return excerpt;
  }
  if (!content) return '';

  const plainText = stripHtml(content);
  const words = plainText.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return plainText;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

// Update meta tags for SEO and social sharing
function updateMetaTags(berita: BeritaResponse, description: string) {
  const baseUrl = window.location.origin;
  const imageUrl = berita.gambar ? `${berita.gambar}` : `${baseUrl}/og-default.jpg`;

  // Title
  document.title = berita.meta_title || berita.judul;

  // Generic meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  // Open Graph tags
  updateOrCreateMeta('og:title', berita.meta_title || berita.judul, 'property');
  updateOrCreateMeta('og:description', description, 'property');
  updateOrCreateMeta('og:image', imageUrl, 'property');
  updateOrCreateMeta('og:url', `${baseUrl}/berita/${berita.slug}`, 'property');
  updateOrCreateMeta('og:type', 'article', 'property');
  updateOrCreateMeta('og:site_name', 'LPM UIN Raden Fatah Palembang', 'property');
  updateOrCreateMeta('og:locale', 'id_ID', 'property');

  // Article specific
  updateOrCreateMeta('article:published_time', berita.created_at, 'property');
  updateOrCreateMeta('article:author', berita.author?.username || 'LPM UIN', 'property');
  updateOrCreateMeta('article:section', berita.kategori?.nama || 'Berita', 'property');

  // Add article:tag for each tag
  if (berita.tags && berita.tags.length > 0) {
    berita.tags.forEach((tag: TagResponse) => {
      updateOrCreateMeta('article:tag', tag.nama, 'property');
    });
  }

  // Twitter Card
  updateOrCreateMeta('twitter:card', 'summary_large_image', 'name');
  updateOrCreateMeta('twitter:title', berita.meta_title || berita.judul, 'name');
  updateOrCreateMeta('twitter:description', description, 'name');
  updateOrCreateMeta('twitter:image', imageUrl, 'name');
  updateOrCreateMeta('twitter:url', `${baseUrl}/berita/${berita.slug}`, 'name');
}

function updateOrCreateMeta(name: string, content: string, type: 'property' | 'name') {
  const attr = type === 'property' ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attr}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export default function BeritaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [berita, setBerita] = useState<BeritaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<BeritaResponse[]>([]);
  const abortControllerRef = { current: null as AbortController | null };

  const loadBerita = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setBerita(null);

    try {
      const item = await getBeritaBySlug(slug);
      setBerita(item);

      // Load related beritas from same category
      const result = await getPublicBeritas({ per_page: 5, status: 'published', kategori_id: item.kategoris_id });
      const allBeritas = Array.isArray(result) ? result : result?.data || [];
      const relatedItems = allBeritas.filter((b: BeritaResponse) => b.id !== item.id).slice(0, 4);
      setRelated(relatedItems);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Gagal memuat berita');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Load berita when slug changes
  useEffect(() => {
    loadBerita();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadBerita]);

  // Update meta tags when berita loads and cleanup on unmount
  useEffect(() => {
    if (berita) {
      const generatedExcerpt = getExcerpt(berita.konten, berita.excerpt);
      updateMetaTags(berita, generatedExcerpt);
    }
    return () => {
      document.title = 'LPM UIN Raden Fatah Palembang';
    };
  }, [berita]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-amber-400 animate-spin"></div>
      </div>
      <p className="mt-4 text-blue-900 font-medium animate-pulse">Memuat Informasi...</p>
    </div>
  );

  if (error || !berita) return (
    <div className="container mx-auto px-4 py-32 text-center bg-slate-50 min-h-[60vh] flex flex-col justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-blue-900/5 max-w-lg w-full border border-slate-100">
        <h2 className="text-3xl font-extrabold text-blue-950 mb-4">Oops!</h2>
        <p className="text-slate-500 mb-8 text-lg">{error || 'Berita yang Anda cari tidak ditemukan atau sudah dihapus.'}</p>
        <Link
          to="/berita"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:-translate-y-0.5"
        >
          <ArrowLeft size={18} /> Kembali ke Daftar Berita
        </Link>
      </div>
    </div>
  );

  const viewKey = `lpm_berita_views_${berita.id}`;
  const views = parseInt(localStorage.getItem(viewKey) || '0');
  const kategoriNama = berita.kategori?.nama || 'Berita';
  const gambarUrl = berita.gambar ? `${berita.gambar}` : null;
  const displayExcerpt = getExcerpt(berita.konten, berita.excerpt);

  // Refined professional color mapping using Blue & Yellow theme
  const kategoriColors: Record<string, string> = {
    Akreditasi: 'bg-blue-100 text-blue-800 ring-blue-200',
    SPMI: 'bg-amber-100 text-amber-800 ring-amber-200',
    'Inovasi Digital': 'bg-sky-100 text-sky-800 ring-sky-200',
    Sertifikasi: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    ISO: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  };
  const kategoriColor = kategoriColors[kategoriNama] || 'bg-blue-50 text-blue-700 ring-blue-100';

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Navigation Breadcrumb / Back */}
        <nav className="flex items-center gap-2 text-sm font-medium mb-8">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">Beranda</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link to="/berita" className="text-slate-500 hover:text-blue-600 transition-colors">Berita</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-blue-900 truncate max-w-[200px] sm:max-w-xs">{berita.judul}</span>
        </nav>

        {/* Main Layout: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-100 overflow-hidden">

              {/* Header Image */}
              <div className="w-full h-[300px] md:h-[450px] relative overflow-hidden bg-blue-900 group">
                {gambarUrl ? (
                  <img
                    src={gambarUrl}
                    alt={berita.judul}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
                    <Rss size={64} className="text-blue-600/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/20 to-transparent"></div>

                {/* Badge Kategori */}
                <div className="absolute top-6 left-6 z-10">
                  <Link
                    to={`/berita/kategori/${encodeURIComponent(kategoriNama)}`}
                    className={`px-4 py-1.5 ${kategoriColor} rounded-full text-xs font-black uppercase tracking-wider shadow-lg ring-1 ring-inset hover:opacity-80 transition-opacity`}
                  >
                    {kategoriNama}
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-10 lg:p-12">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mb-6 pb-6 border-b border-slate-100 text-sm">
                  <span className="flex items-center gap-2 text-slate-500 font-medium">
                    <Calendar size={16} className="text-blue-600" />
                    {new Date(berita.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 font-medium">
                    <User size={16} className="text-amber-500" />
                    <span className="text-blue-950 font-semibold">{berita.author?.username || 'Redaksi'}</span>
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 font-medium">
                    <Eye size={16} className="text-blue-400" />
                    {views} kali dibaca
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-950 mb-8 leading-[1.25] tracking-tight">
                  {berita.judul}
                </h1>

                {/* Excerpt - auto-generated from content if not set */}
                {displayExcerpt && (
                  <div className="relative mb-10 p-6 bg-blue-50/50 rounded-2xl border-l-4 border-amber-400">
                    <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed italic">
                      "{displayExcerpt}"
                    </p>
                  </div>
                )}

                {/* HTML Content */}
                <div
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:text-blue-950 prose-headings:font-bold
                    prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-amber-500 hover:prose-a:no-underline
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:shadow-blue-900/10
                    prose-blockquote:border-l-amber-400 prose-blockquote:bg-slate-50 prose-blockquote:p-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                    prose-strong:text-blue-900
                    text-slate-600 leading-loose"
                  dangerouslySetInnerHTML={{ __html: berita.konten }}
                />

                {/* Tags Section */}
                {berita.tags && berita.tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-semibold text-slate-500 mr-2">Topik:</span>
                      {berita.tags.map((tag: TagResponse) => (
                        <Link
                          key={tag.id}
                          to={`/berita/tag/${tag.slug}`}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <TagIcon size={12} className="opacity-50" />
                          {tag.nama}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl font-semibold transition-colors text-sm">
                      <Share2 size={16} /> Bagikan
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:bg-amber-400 hover:text-blue-950 rounded-xl font-semibold transition-colors text-sm">
                      <Bookmark size={16} /> Simpan
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 sticky top-8">

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
                  <h3 className="text-xl font-black text-blue-950">Baca Juga</h3>
                </div>

                <div className="flex flex-col gap-5">
                  {related.map(r => (
                    <Link
                      key={r.id}
                      to={`/berita/${r.slug}`}
                      className="group flex gap-4 items-start"
                    >
                      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
                        {r.gambar && (
                          <img
                            src={`${r.gambar}`}
                            alt={r.judul}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <Link
                          to={`/berita/kategori/${encodeURIComponent(r.kategori?.nama || '')}`}
                          className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-1 hover:text-amber-600 transition-colors"
                        >
                          {r.kategori?.nama}
                        </Link>
                        <h4 className="text-sm font-bold text-blue-950 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                          {r.judul}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link to="/berita" className="mt-6 w-full py-3 bg-slate-50 hover:bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                  Lihat Indeks Berita <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {/* LPM Banner */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-lg p-8 text-center relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>

              <Rss size={32} className="text-amber-400 mx-auto mb-4 relative z-10" />
              <h3 className="text-white font-bold text-lg mb-2 relative z-10">Jurnal Akademik</h3>
              <p className="text-blue-100 text-sm mb-4 relative z-10">Kirimkan artikel riset Anda untuk publikasi bulan ini.</p>
              <span className="inline-block px-5 py-2 bg-amber-400 text-blue-950 font-bold rounded-full text-sm shadow-md group-hover:scale-105 transition-transform">
                Kirim Sekarang
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}