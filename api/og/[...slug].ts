// Vercel Edge Function — generates proper OG/Twitter meta tags for berita pages
// Intercepts crawler requests and returns HTML with dynamic meta tags

export const config = {
  runtime: 'edge',
};

const CRAWLERS = [
  'facebookexternalhit', 'facebookcatalog', 'facebot',
  'twitterbot', 'x.com', 'tweetbot',
  'linkedinbot', 'linkedin',
  'pinterest', ' Pinterest',
  'whatsapp', 'WhatsApp',
  'slackbot', 'Slack-ImgGetter',
  'telegrambot', 'TelegramBot',
  'discordbot',
  'googlebot', 'Googlebot', 'Google-InspectionTool',
  'bingbot', 'bingbot', 'msnbot',
  'duckduckbot', 'DuckDuckBot',
];

function isCrawler(ua: string | null): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return CRAWLERS.some((c) => lower.includes(c.toLowerCase()));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}

function esc(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fullImageUrl(gambar: string | null, baseUrl: string): string {
  if (!gambar) return `${baseUrl}/og-default.svg`;
  if (gambar.startsWith('http')) return gambar;
  return gambar.startsWith('/') ? `${baseUrl}${gambar}` : `${baseUrl}/${gambar}`;
}

function buildHtml(params: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  kategori: string;
  author: string;
  publishedTime: string;
  tags: string[];
}): string {
  const { title, description, imageUrl, url, kategori, author, publishedTime, tags } = params;

  const tagsMeta = tags.length > 0
    ? tags.map((t) => `  <meta property="article:tag" content="${esc(t)}" />`).join('\n')
    : '';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="noindex, nofollow" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="LPM UIN Raden Fatah Palembang" />
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
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
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
      box-shadow: 0 25px 50px -12px rgba(0,0,0,.5);
    }
    .card-img-wrap {
      position: relative;
      width: 100%;
      height: 340px;
      overflow: hidden;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .card-img-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #0284c7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-img-fallback span { font-size: 4rem; }
    .card-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: #fbbf24;
      color: #1e3a5f;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
      padding: 4px 12px;
      border-radius: 99px;
    }
    .card-body { padding: 1.5rem; }
    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
      margin-bottom: .75rem;
    }
    .card-desc {
      font-size: .875rem;
      color: #94a3b8;
      line-height: 1.65;
    }
    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,.08);
      display: flex;
      align-items: center;
      gap: .5rem;
    }
    .card-logo {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: #fbbf24;
      flex-shrink: 0;
    }
    .card-site { font-size: .75rem; color: #475569; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-img-wrap">
      <img
        class="card-img"
        src="${imageUrl}"
        alt="${esc(title)}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      />
      <div class="card-img-fallback" style="display:none"><span>📰</span></div>
      <div class="card-badge">${kategori}</div>
    </div>
    <div class="card-body">
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
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const ua = req.headers.get('user-agent');

  // Only handle /berita/<slug> paths
  const pathname = url.pathname;

  // Non-crawler: let the SPA serve normally
  if (!isCrawler(ua)) {
    return fetch(req);
  }

  // Extract slug
  const match = pathname.match(/^\/berita\/([^/]+)/);
  if (!match) {
    return fetch(req);
  }

  const slug = match[1];
  const baseUrl = url.origin;

  try {
    const apiBase = process.env.API_URL || 'https://api-lpm.test/api';
    const apiRes = await fetch(`${apiBase}/public/beritas/${slug}`, {
      headers: { Accept: 'application/json', 'X-Language': 'id' },
    });

    if (!apiRes.ok) {
      return fetch(req);
    }

    const json = await apiRes.json();
    if (!json.success || !json.data) {
      return fetch(req);
    }

    const berita = json.data;
    const title = berita.meta_title || berita.judul;
    const description = truncate(stripHtml(berita.excerpt || berita.konten || ''), 160);
    const imageUrl = fullImageUrl(berita.gambar, baseUrl);
    const fullUrl = `${baseUrl}/berita/${berita.slug}`;
    const kategori = berita.kategori?.nama || 'Berita';
    const author = berita.author?.username || 'LPM UIN Raden Fatah';
    const publishedTime = berita.created_at || '';
    const tags: string[] = (berita.tags ?? []).map((t: { nama: string }) => t.nama);

    const html = buildHtml({ title, description, imageUrl, url: fullUrl, kategori, author, publishedTime, tags });

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[api/og] Error:', err);
    return fetch(req);
  }
}