// Vercel Routing Middleware — intercepts crawler requests to berita pages
// and returns proper OG/Twitter meta tags for social sharing preview
// Works with Vite/React SPAs on Vercel (uses standard Web API, not Next.js)

export const runtime = 'edge';

export function onConfig(config: { isbot: boolean; request: Request }) {
  const blocked = [
    '^/api\\',
    '^/_next\\',
    '^/admin\\',
    '^/login\\',
    '\\.(ico|css|js|svg|png|jpg|jpeg|webp|woff|woff2)$',
  ];
  config.headers.push({ key: 'X-Robots-Tag', value: 'noindex' });
}

// Crawler user agents that read meta tags from HTML
const CRAWLERS = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'pinterest',
  'whatsapp',
  'slackbot',
  'telegram',
  'discordbot',
  'googlebot',
  'bingbot',
  'duckduckbot',
];

function isSocialCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLERS.some((c) => ua.includes(c));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '…';
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only intercept specific berita detail pages (not /berita/ alone)
  if (pathname === '/berita' || pathname === '/berita/') {
    return new Response('Not Found', { status: 404 });
  }

  if (!pathname.startsWith('/berita/')) {
    return new Response('Not Found', { status: 404 });
  }

  const userAgent = request.headers.get('user-agent');
  const isCrawler = isSocialCrawler(userAgent);

  // Non-social crawler: let the SPA handle it normally
  if (!isCrawler) {
    return fetch(request);
  }

  // Extract slug — everything after /berita/
  const slug = pathname.replace('/berita/', '').split('/')[0];

  try {
    const apiBase = process.env.API_URL || 'https://api-lpm.test/api';
    const apiRes = await fetch(`${apiBase}/public/beritas/${slug}`, {
      headers: { Accept: 'application/json', 'X-Language': 'id' },
    });

    if (!apiRes.ok) {
      return new Response('Not Found', { status: 404 });
    }

    const json = await apiRes.json();
    if (!json.success || !json.data) {
      return new Response('Not Found', { status: 404 });
    }

    const berita = json.data;
    const baseUrl = url.origin;
    const fullUrl = `${baseUrl}/berita/${berita.slug}`;

    // Full image URL
    const imageUrl = berita.gambar
      ? berita.gambar.startsWith('http')
        ? berita.gambar
        : `${baseUrl}${berita.gambar}`
      : `${baseUrl}/og-default.svg`;

    const description = truncate(stripHtml(berita.excerpt || berita.konten || ''), 160);
    const title = esc(berita.meta_title || berita.judul);
    const kategori = esc(berita.kategori?.nama || 'Berita');
    const author = esc(berita.author?.username || 'LPM UIN Raden Fatah');
    const publishedTime = berita.created_at || '';

    const tagsMeta = berita.tags && berita.tags.length > 0
      ? berita.tags.map((tag: { nama: string }) => `  <meta property="article:tag" content="${esc(tag.nama)}" />`).join('\n')
      : '';

    const ogHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${fullUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:site_name" content="LPM UIN Raden Fatah" />
  <meta property="og:locale" content="id_ID" />
  <meta property="article:published_time" content="${publishedTime}" />
  <meta property="article:author" content="${author}" />
  <meta property="article:section" content="${kategori}" />
${tagsMeta}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${title}" />
  <meta name="twitter:site" content="@lpmuinrdf" />

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .card {
      background: #1e3a5f;
      border-radius: 16px;
      max-width: 640px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .card-img {
      width: 100%;
      height: 340px;
      object-fit: cover;
      display: block;
    }
    .card-img-placeholder {
      width: 100%;
      height: 340px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-img-placeholder span { font-size: 4rem; }
    .card-body { padding: 1.5rem; }
    .card-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #fbbf24;
      margin-bottom: 0.5rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.35;
      margin-bottom: 0.75rem;
    }
    .card-desc {
      font-size: 0.875rem;
      color: #cbd5e1;
      line-height: 1.65;
    }
    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .card-logo {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: #fbbf24;
      display: inline-block;
      flex-shrink: 0;
    }
    .card-site { font-size: 0.75rem; color: #64748b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <img
      class="card-img"
      src="${imageUrl}"
      alt="${title}"
      onerror="this.style.display='none';document.getElementById('imgPlaceholder').style.display='flex'"
    />
    <div id="imgPlaceholder" class="card-img-placeholder" style="display:none">
      <span>📰</span>
    </div>
    <div class="card-body">
      <div class="card-label">${kategori}</div>
      <div class="card-title">${title}</div>
      <div class="card-desc">${esc(description)}</div>
    </div>
    <div class="card-footer">
      <div class="card-logo"></div>
      <span class="card-site">LPM UIN Raden Fatah Palembang</span>
    </div>
  </div>
</body>
</html>`;

    return new Response(ogHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    console.error('[middleware] OG tag error:', err);
    return fetch(request);
  }
}
